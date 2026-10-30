// 보내기에 드는 순수한 계산(설계서 4.4·4.5, 계획서 「서버 주소 약속」 /v1/kid/sync).
// 보내는 것 = 안 보낸 판 끝 요약 + 지금 기록(outbox 뺀 것, 바뀌었을 때만) + 선생님 화면 요약(기록과 같이).
// 서버는 기록을 판 번호(rev)로 맞추고, 뒤처진 기기가 판 수(sessions)도 많지 않으면 자기 것(newer)을 돌려준다.
import { migrate } from './state.js?v=9a67f36b25';
import { setGrade } from './study.js?v=9a67f36b25';

export const ROUNDS_PER_SYNC = 200; // 서버가 한 번에 받는 판 끝 요약 수
export const SENT_KEEP = 5; // 답을 못 받은 채 기억하는 기록 해시 수
export const SYNC_BODY_MAX = 448 * 1024; // 서버 512KiB보다 64KiB 작게. 기록 400KiB + 요약 16KiB도 들어간다.
const STATE_MAX = 400 * 1024, REPORT_MAX = 16 * 1024;
export const jsonBytes = value => new TextEncoder().encode(JSON.stringify(value)).byteLength;

const copy = (value) => JSON.parse(JSON.stringify(value));

// 아직 안 보낸 판 전체. 전송 개수와 바이트 한도는 syncBatch가 정한다.
export function unsentRounds(state) {
  return (state?.outbox ?? []).filter((round) => round && !round.sent);
}

// 서버가 받았다고 답한 판에만 sent를 단다(답을 못 받으면 다음에 다시 보낸다. 서버는 같은 판을 한 번만 넣는다)
export function markSent(state, ids) {
  const done = new Set(ids);
  for (const round of state.outbox ?? []) if (round && done.has(round.id)) round.sent = true;
}

// 서버에 둘 기록: outbox를 뺀 깊은 복사. JSON으로 복사해 서버가 두었다 돌려주는 것과 글자까지 같다.
export function snapshot(state) {
  const { outbox, ...rest } = state;
  return copy(rest);
}

// FNV-1a 32비트(글자 단위) 16진 8자리
export function fnv1a(text) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16).padStart(8, '0');
}

// 기록 해시 = FNV-1a 16진 + '-' + JSON 길이. 보내는 그대로(JSON.stringify)를 잰다.
export function snapshotHash(value) {
  const text = JSON.stringify(value) ?? '';
  return `${fnv1a(text)}-${text.length}`;
}

// 지금 기록의 해시 = 서버에 둘 복사본(outbox 뺀 것)의 해시
export const stateHash = (state) => snapshotHash(snapshot(state));

// 올리는 기록의 해시를 기억한다(답을 잃었을 때 서버가 돌려준 기록이 이 기기 것인지 알아보려고)
export function rememberSent(link, hash) {
  const sent = (Array.isArray(link.sent) ? link.sent : []).filter((h) => h !== hash);
  return { ...link, sent: [...sent, hash].slice(-SENT_KEEP) };
}

// 서버가 가진 기록(link.lastHash)과 같으면 기록·요약을 빼고 판만 보낸다.
// 서버는 요약을 받은 기록과 같이 두므로 요약은 기록이 갈 때만 붙인다.
// report는 요약 값이나, 기록이 갈 때만 부르는 함수(() => 요약)다.
export function syncBatch(state, link, report = null, { maxBytes = SYNC_BODY_MAX, maxRounds = ROUNDS_PER_SYNC, omitState = false } = {}) {
  maxBytes = Math.min(maxBytes, SYNC_BODY_MAX);
  const payload = { baseRev: link.rev, rounds: [] };
  const snap = snapshot(state);
  let blocked = null;
  if (!omitState && snapshotHash(snap) !== link.lastHash) {
    payload.state = snap;
    const made = typeof report === 'function' ? report() : report;
    if (made) payload.report = made;
    if (jsonBytes(snap) > STATE_MAX || (made && jsonBytes(made) > REPORT_MAX) || jsonBytes(payload) > maxBytes) {
      blocked = made && jsonBytes(made) > REPORT_MAX ? 'report-too-big' : 'state-too-big';
      delete payload.state;
      delete payload.report;
    }
  }
  let size = jsonBytes(payload);
  const rounds = unsentRounds(state).slice(0, Math.min(maxRounds, ROUNDS_PER_SYNC));
  for (const round of rounds) {
    const extra = jsonBytes(round) + (payload.rounds.length ? 1 : 0);
    if (size + extra > maxBytes) {
      if (!payload.state && !payload.rounds.length) blocked ??= 'round-too-big';
      break;
    }
    payload.rounds.push(round);
    size += extra;
  }
  return { payload, blocked };
}

export const syncPayload = (state, link, report = null, options) => syncBatch(state, link, report, options).payload;

// 서버에서 온 기록(들어가기·열쇠로 이어 하기 답의 state, 보내기 답의 newer.state)은 앱에 넣기 전에 여기서만 거른다(Ruling R40).
// 서버는 기록을 가볍게만 보고 그대로 두었다 돌려주므로, 아이가 자기 토큰으로 꾸민 기록을 올리면 다른 기기가 그것을 받는다.
// - 하던 판(activeRound·roundRecord)은 버린다: 그 판의 문제 그림(art)은 카드가 innerHTML로 그린다(app/card.js artView).
//   다른 기기에서 반쯤 푼 판은 이 기기에서 이어 하지 않는다(그 값으로 치른다).
// - 판 끝 요약(outbox)은 기기에만 두는 칸이라 받지 않는다(빈 칸으로 시작, 부른 쪽이 이 기기 것을 붙인다).
// - 나머지는 migrate()가 지금 모양으로 맞춘다(깨진 기록이면 null). 아이 앱에서 기록 값이 HTML로 들어갈 수 있는 곳은
//   하던 판의 문제 그림뿐이다(app/ui.js h()의 html을 쓰는 곳: 카드 그림·단추 그림·발자국·하트·푸터. 나머지는 코드에 적힌 SVG).
// 받은 값은 고치지 않고 새 기록을 돌려준다.
export function fromServer(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return null;
  const { activeRound, roundRecord, outbox, ...rest } = state;
  return migrate(copy(rest));
}

// 서버 답을 기록과 연결에 넣는다. 받은 판은 sent, rev·lastHash·lastOkAt은 새로.
// 서버가 꼴이 틀려 받지 않은 판(rejected, Ruling R42)도 sent를 단다: 고쳐질 일이 없으니 다시 보내지 않는다.
// newer(서버 것이 더 새것)가 오면:
//  - 이 기기가 전에 올린 기록이면(sent·lastHash에 있는 해시: 올렸는데 답만 잃었다) 바꾸지 않고
//    그 판 번호로 지금 기록을 다시 보낸다(resend). 가게만 산 것처럼 판 수가 같으면 서버가 받지 않아 산 것이 사라지기 때문.
//  - 다른 기기 기록이면 fromServer로 거른 그것에 지금 outbox를 붙여 바꾼다(replaced). 깨진 기록이면 무시한다.
//    서버 기록 해시(lastHash)는 받은 기록이 아니라 거른 기록(이 기기가 지금 가진 것)의 해시다(Ruling R43): 받은 해시를 두면
//    다음 보내기가 거른 기록을 올려, 다른 기기가 반쯤 푼 판을 서버에서 지운다(그 기기도 다음에 받아 오면서 잃는다).
function applyResult(state, link, result, payload, now) {
  markSent(state, Array.isArray(result?.accepted) ? result.accepted : []);
  markSent(state, Array.isArray(result?.rejected) ? result.rejected : []);
  const sent = Array.isArray(link.sent) ? link.sent : [];
  const done = { ...link, lastOkAt: now };
  const newer = result?.newer;
  if (newer && typeof newer === 'object') {
    const hash = snapshotHash(newer.state);
    if (sent.includes(hash) || hash === link.lastHash) {
      return { state, link: { ...done, rev: newer.rev, lastHash: hash, sent: sent.filter((h) => h !== hash) }, replaced: false, resend: true };
    }
    const fresh = fromServer(newer.state);
    if (!fresh) return { state, link: done, replaced: false, resend: false };
    fresh.outbox = state.outbox;
    return { state: fresh, link: { ...done, rev: newer.rev, lastHash: stateHash(fresh), sent: [] }, replaced: true, resend: false };
  }
  const next = { ...done, rev: result.rev };
  if (payload?.state) {
    // 보낸 기록을 서버가 받았다
    next.lastHash = snapshotHash(payload.state);
    next.sent = [];
  }
  return { state, link: next, replaced: false, resend: false };
}

export function applySyncResult(state, link, result, payload, now = Date.now()) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) return { state, link, replaced: false, resend: false };
  const out = applyResult(state, link, result, payload, now);
  if (Object.hasOwn(result, 'classSeat')) {
    const next = copy(out.state), seat = result.classSeat;
    if (seat) {
      if (next.grade !== seat.grade) setGrade(next, seat.grade);
      next.student = { classCode: seat.classCode, classNo: seat.classNo, number: seat.number };
    } else next.student = null;
    out.state = next; out.replaced = true; out.link.mode = seat ? 'class' : 'key';
    // 서버가 기록의 반 칸을 맞췄더라도 요약은 옛 학년으로 만들었다. 고친 기록과 요약을 한 번 더 보낸다.
    out.link.lastHash = null;
    out.resend = true;
  }
  return out;
}
