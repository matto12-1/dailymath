// 서버 연결(설계서 4.4): 기록(state)과 따로 기기에만 둔다(서버로 올라가지 않게).
// link = { v: 1, token, kidId, rev, mode: 'class'|'key', key?, pics?, lastHash?, lastOkAt?, sent?, seatReset? }
//   rev      마지막으로 서버와 맞춘 판 번호
//   lastHash 그 판 번호의 서버 기록 해시(같으면 기록을 다시 보내지 않는다, sync.js)
//   sent     올렸는데 아직 답을 못 받은 기록 해시(새것이 뒤, 5개까지)
//   key·pics 반 없는 아이의 내 마을 열쇠와 비밀 그림(반에 들어간 뒤에도 남는다: 열쇠는 그대로 쓸 수 있다)
//   seatReset 반에 든 자리를 선생님이 「그림 다시 정하기」로 지운 채다(OOS 3: 열쇠로 다시 이은 반에 든 열쇠 아이).
//            서버 답(key/login·sync)의 seatReset이 달고 떼고(markSeatReset), 탐험 일지가 「반 그림 새로 정하기」로 이끈다
// 풀린 연결(마지막 검토 I1, Ruling R41): 토큰이 죽어(401) 연결을 풀 때 다시 들어갈 실마리만 따로 둔다(LOST_KEY, 토큰 없음).
// lost = { v: 1, mode, at, kidId?, rev?, lastHash?, sent?, classCode?, grade?, classNo?(반 칸, 번호는 빼고: R36(c)), key?, pics?(열쇠 아이) }
//   kidId  그 연결의 아이. 다시 들어간 자리가 다른 아이면 서버 기록을 따른다(afterRejoin, OOS 4)
//   rev·lastHash·sent  그 연결의 보내기 자리. 반에 들어가기에서 같은 아이로 다시 이으면 이어 쓴다(resumedLink·keyAttach).
//                      토큰은 남기지 않는다(그래서 연결로 읽히지 않는다)
// 연결로 치지 않는다(loadLink는 LINK_KEY만 본다). 새 연결을 두면(saveLink) 지운다.
// 연결 만들기(keyLink·enteredLink·rejoinLink)는 들어오기(welcome.js)와 탐험 일지(record-link.js)가 같이 쓴다.
// 탐험 일지 「내 자리」 칸의 순수한 부분(linkLines·leavePending·enterSeat·seatRequest, 설계서 4.6·4.7)도 여기 둔다.
// 칸은 app/record-link.js가 그린다.
import { studyRange } from './study.js?v=9a67f36b25';
import { snapshot, snapshotHash, stateHash, unsentRounds, fromServer, SENT_KEEP } from './sync.js?v=9a67f36b25';

export const LINK_KEY = 'dailymath.link';
export const LOST_KEY = 'dailymath.link.lost';
const MODES = ['class', 'key'];

const isLink = (link) => link !== null && typeof link === 'object' && !Array.isArray(link) && link.v === 1
  && typeof link.token === 'string' && link.token !== '' && typeof link.kidId === 'string' && link.kidId !== ''
  && Number.isSafeInteger(link.rev) && link.rev >= 0 && MODES.includes(link.mode);

// 없거나 깨졌으면 null
export function loadLink(storage) {
  let raw = null;
  try { raw = storage?.getItem(LINK_KEY) ?? null; } catch { return null; }
  if (raw === null) return null;
  try {
    const link = JSON.parse(raw);
    return isLink(link) ? link : null;
  } catch {
    return null;
  }
}

// 새 연결이 생기면 풀린 연결 기억은 끝(다시 들어갔다)
export function saveLink(storage, link) {
  try { storage?.setItem(LINK_KEY, JSON.stringify(link)); } catch { /* 저장이 막히면 이 창에서만 잇는다 */ }
  clearLost(storage);
}

export function clearLink(storage) {
  try { storage?.removeItem(LINK_KEY); } catch { /* 지우지 못해도 앱은 계속 */ }
}

// ── 풀린 연결 ──

const isClassCode = (v) => typeof v === 'string' && /^\d{6}$/.test(v);
const isGrade = (v) => Number.isInteger(v) && v >= 1 && v <= 6;
const isClassNo = (v) => Number.isInteger(v) && v >= 1;
const isHash = (v) => typeof v === 'string' && /^[0-9a-f]{8}-\d+$/.test(v); // 기록 해시(sync.js snapshotHash)
// 칸마다 꼴이 맞는 것만 남긴다(kidId는 빈 글이 아닐 때만, 판 번호는 0 이상 정수, 해시는 해시 꼴만, 보낸 해시는 뒤에서 SENT_KEEP개까지,
// 반 칸은 셋이 다 맞을 때만, 열쇠는 글자와 그림이 다 맞을 때만)
function lostOf(mode, at, { kidId, rev, lastHash, sent, classCode, grade, classNo, key, pics } = {}) {
  const lost = { v: 1, mode, at };
  if (typeof kidId === 'string' && kidId !== '') lost.kidId = kidId;
  if (Number.isSafeInteger(rev) && rev >= 0) lost.rev = rev;
  if (isHash(lastHash)) lost.lastHash = lastHash;
  const hashes = Array.isArray(sent) ? sent.filter(isHash).slice(-SENT_KEEP) : [];
  if (hashes.length) lost.sent = hashes;
  if (isClassCode(classCode) && isGrade(grade) && isClassNo(classNo)) Object.assign(lost, { classCode, grade, classNo });
  if (isKeyPair(key, pics)) Object.assign(lost, { key, pics: [...pics] });
  return lost;
}

// 없거나 깨졌으면 null
export function loadLost(storage) {
  let raw = null;
  try { raw = storage?.getItem(LOST_KEY) ?? null; } catch { return null; }
  if (raw === null) return null;
  let lost = null;
  try { lost = JSON.parse(raw); } catch { return null; }
  if (!lost || typeof lost !== 'object' || Array.isArray(lost) || lost.v !== 1 || !MODES.includes(lost.mode) || !Number.isFinite(lost.at)) return null;
  return lostOf(lost.mode, lost.at, lost);
}

export function saveLost(storage, lost) {
  try { storage?.setItem(LOST_KEY, JSON.stringify(lost)); } catch { /* 저장이 막히면 기억하지 못한다 */ }
}

export function clearLost(storage) {
  try { storage?.removeItem(LOST_KEY); } catch { /* 지우지 못해도 앱은 계속 */ }
}

// 토큰이 죽었다(401): 연결을 풀고 풀린 연결을 남긴다(기록은 그대로). 아이·보내기 자리·열쇠는 연결에서(토큰은 빼고), 반 칸은 기록의 반 칸에서.
// 남긴 것을 돌려준다(연결이 없었으면 null, 아무것도 바꾸지 않는다).
export function loseLink(storage, state, now) {
  const link = loadLink(storage);
  if (!link) return null;
  const st = state?.student;
  const lost = lostOf(link.mode, now, {
    kidId: link.kidId,
    rev: link.rev,
    lastHash: link.lastHash,
    sent: link.sent,
    ...(link.mode === 'class' && isSeat(st) ? { classCode: st.classCode, grade: state.grade, classNo: st.classNo } : {}),
    key: link.key,
    pics: link.pics,
  });
  clearLink(storage);
  saveLost(storage, lost);
  return lost;
}

// 반에 들어가기 반 칸에 처음 채울 값. 풀린 연결이 있으면 반 코드·학년·반만(번호는 비운다: 자리 비우기로 나간 아이가
// 그 번호를 저절로 다시 차지하지 않게, R36(c)). 아니면 3권 전 기기는 기록에 남은 반 칸, 그 밖에는 학년만.
export function seatPrefill(state, lost) {
  const st = state?.student && typeof state.student === 'object' ? state.student : null;
  const kept = st ? { classCode: st.classCode ?? '', grade: state.grade, classNo: st.classNo ?? '', number: st.number ?? '' } : { grade: state?.grade ?? null };
  if (!lost) return kept;
  const cls = lost.classCode ? { classCode: lost.classCode, grade: lost.grade, classNo: lost.classNo } : {};
  return { ...kept, ...cls, number: '' };
}

// 열쇠 만들기(key/new) 답 → 연결. sent = 같이 보낸 기록(snapshot). 서버가 그 기록을 판 1로 두었으면(rev ≥ 1)
// 그 해시를 서버 기록 해시로 둔다(같은 기록을 바로 다시 올리지 않게).
export function keyLink({ token, kidId, rev, key, pics }, sent = null) {
  const link = { v: 1, token, kidId, rev, mode: 'key', key, pics: [...pics] };
  if (sent && rev >= 1) link.lastHash = snapshotHash(sent);
  return link;
}

// 반 그림을 다시 정할 자리(OOS 3): 서버 답의 seatReset이 true면 연결에 표시를 단다. 선생님이 그림을 지운 반 자리라
// 연결은 반으로 둔다(열쇠·그림은 남긴다). 아니면 표시를 뗀다(새 그림을 정했다, 다른 기기에서 정했다). 받은 연결은 고치지 않는다.
export function markSeatReset(link, reset) {
  if (reset === true) return { ...link, mode: 'class', seatReset: true };
  if (!('seatReset' in link)) return link;
  const { seatReset, ...rest } = link;
  return rest;
}

// 들어가기(join)·열쇠로 이어 하기(key/login) 답 → 연결. extra = { key, pics }(열쇠로 들어왔을 때).
// 서버 기록 해시(lastHash)는 두지 않는다: 들어가자마자 보내기 줄이 기록과 선생님 화면 요약을 한 번 올린다.
// 열쇠로 이었는데 반 그림을 다시 정할 자리라고 하면(seatReset) 표시를 단다(markSeatReset).
export const enteredLink = ({ token, kidId, rev, seatReset }, mode, extra = {}) => markSeatReset({ v: 1, token, kidId, rev, mode, ...extra }, seatReset);
// 기록을 가진 기기가 서버에 이미 있는 자리로 다시 들어갈 때(풀린 연결 뒤 반에 들어가기·열쇠로 다시 이어 하기, 마지막 검토 I2):
// 판 번호를 0으로 둔다. 첫 보내기에서 서버가 판 수(sessions)로 고른다: 서버 것이 많거나 같으면 newer로 돌려주어
// 이 기기가 서버 기록으로 바꾸고(applySyncResult), 이 기기 것이 많으면 서버가 받는다. 안 보낸 판은 그대로 따로 보낸다.
export const rejoinLink = (data, mode, extra = {}) => ({ ...enteredLink(data, mode, extra), rev: 0 });

// 다시 들어간 자리가 풀린 연결의 그 아이인가(kidId를 모르면 그렇다고 본다: kidId 칸이 생기기 전에 풀린 연결·풀린 연결이 없는 기기)
export const sameKid = (lost, data) => !lost?.kidId || data?.kidId === lost.kidId;

// 서버에 이미 있던 자리로 다시 들어간 답(data = join·key/login 답 { token, kidId, rev, state }) → 넣을 기록과 연결
// (풀린 연결 뒤 그림으로 반에 다시 들어가기·열쇠로 다시 잇기. 마지막 검토 I2, OOS 4). lost = 풀린 연결(없으면 null).
// - 같은 아이(sameKid): 기록은 그대로, 판 번호 0인 연결(rejoinLink). 서버가 판 수로 고르고 안 보낸 판은 그대로 보낸다.
// - 다른 아이 자리(남의 번호를 넣고 그 아이 그림을 맞혔다, 공용 기기에서 다른 아이가 풀린 칸으로 자기 번호에 들어왔다):
//   서버 기록을 따른다. fromServer로 거른 서버 기록(서버에 기록이 없으면 blank(): 마을 없이 처음 들어온 것처럼 새 기록)으로
//   바꾸고 이 기기의 안 보낸 판은 버린다(그 아이 것이 아니다). 판 번호는 서버 것, 서버 기록 해시는 바꾼 기록의 해시라
//   이 기기 것이 올라가 그 아이 기록을 덮지 않는다.
// → { state, link, other }(받은 값·지금 기록은 고치지 않는다. 다른 아이면 state가 새 기록)
// blank는 꼭 넘긴다(빠뜨리면 드문 갈래에 가서야 터지지 않게 들어오자마자 던진다).
export function afterRejoin(state, lost, data, mode, extra, blank) {
  if (typeof blank !== 'function') throw new TypeError('afterRejoin: blank(새 기록 만들기)를 넘겨야 한다');
  if (sameKid(lost, data)) return { state, link: rejoinLink(data, mode, extra), other: false };
  const fresh = fromServer(data.state) ?? blank();
  return { state: fresh, link: { ...enteredLink(data, mode, extra), lastHash: stateHash(fresh) }, other: true };
}

// 같은 아이로 다시 이었을 때 풀린 연결의 보내기 자리(판 번호·서버 기록 해시·보낸 해시)를 이어 쓰는 연결(토큰은 새것, keyAttach).
// 판 번호를 모르면(이 칸이 생기기 전에 풀린 연결) null: 그때는 afterRejoin(판 번호 0, 서버가 판 수로 고른다).
export function resumedLink(lost, data, mode, extra = {}) {
  if (!Number.isSafeInteger(lost?.rev) || lost.rev < 0) return null;
  const link = { ...enteredLink(data, mode, extra), rev: lost.rev };
  if (lost.lastHash) link.lastHash = lost.lastHash;
  if (lost.sent) link.sent = [...lost.sent];
  return link;
}

// ── 탐험 일지 「내 자리」 ──

// 칸에 그릴 수 있는 열쇠만(대문자 6개 + 그림 번호 둘, 0~8: 0 빵 · 1 책 · 2 꽃 · 3 아이스크림 · 4 사과 · 5 물고기 · 6 컵 · 7 공 · 8 빗).
// 글자 뽑기 규칙은 서버가 지킨다. 그림 수는 app/entry-text.js PIC_NAMES·서버 crypto.js PIC_COUNT와 같다
const PIC_COUNT = 9;
const isPic = (id) => Number.isInteger(id) && id >= 0 && id < PIC_COUNT;
const isKeyPair = (key, pics) => typeof key === 'string' && /^[A-Z]{6}$/.test(key) && Array.isArray(pics) && pics.length === 2 && pics.every(isPic);
const isSeat = (st) => st !== null && typeof st === 'object' && Number.isInteger(st.classNo) && Number.isInteger(st.number);
// 반 칸 값(seat = { classCode, grade, classNo, number }) → 「5학년 3반 12번」, 서버 몸통 { code, grade, classNo, number }
export const seatText = ({ grade, classNo, number }) => `${grade}학년 ${classNo}반 ${number}번`;
export const seatBody = (seat) => ({ code: seat.classCode, grade: seat.grade, classNo: seat.classNo, number: seat.number });

// 칸 제목은 갈래를 따른다(Ruling R26). 풀린 연결은 열쇠가 있으면 열쇠, 없으면 자리
const TITLES = { class: '우리 반', key: '내 마을 열쇠', local: '기록 저장' };

// 칸에 보일 것. state = 기록, link = 연결(없으면 null), status = 보내기 줄 status()(없으면 null), api = 서버 주소(없으면 null).
// → { kind, title, lines: [{ id, text } | { id: 'key', key, pics }], buttons }
//   'none'  서버가 없다(폰 페이지·견본·옛 시험): 칸이 없다(title null)
//   'local' 「기록 저장」 서버는 있는데 연결이 없다(인터넷이 없어 「이 기기에서만 시작」·3권 전 기기):
//           열쇠 만들기·반에 들어가기·다른 사람이에요(Ruling R25: 지우면 다시 찾을 수 없다고 먼저 알린다)
//   'key'   「내 마을 열쇠」 반 없는 아이: 열쇠 글자·그림(제목이 이름이라 줄에는 글이 없다), 보낸 상태,
//           반에 들어가기·다른 사람이에요
//   'class' 「내 자리」 반 아이: 「5학년 3반 12번」, 보낸 상태, 다른 사람이에요.
//           반 그림을 다시 정할 자리(link.seatReset, OOS 3)면 자리 줄 다음에 까닭 한 줄, 첫 단추는 반 그림 새로 정하기
//   'lost'  연결이 없고 풀린 연결(lost, 401)이 있다(마지막 검토 I1): 까닭 한 줄(+ 열쇠), 안 보낸 판 수.
//           반 아이는 반에 들어가기가 첫 단추, 열쇠가 있으면 열쇠로 다시 이어 하기가 첫 단추. 열쇠 만들기는 없다
//           (서버에 자리가 남아 있을 수 있어 새 열쇠는 반과 따로 노는 두 번째 마을이 된다).
//           반 없는 열쇠 아이는 반에 들어가기도 없다(OOS 1): 연결 없이 들어가면 join이라 두 번째 마을이 생기고 열쇠를 잊는다.
//           열쇠로 다시 이으면 보통 칸('key')에 반에 들어가기가 있다
// 보낸 상태: 안 보낸 판이 있으면 그 수, 마지막 보내기가 실패했으면(status.error) 그렇다고 한 줄,
// 서버 답을 한 번이라도 받았고(link.lastOkAt) 실패 중이 아니면 「기록을 보냈어요」(받기 전에는 보냈다고 하지 않는다).
export function linkLines(state, link, status, api, lost = null) {
  if (!api) return { kind: 'none', title: null, lines: [], buttons: [] };
  if (!link && lost) {
    const keyed = isKeyPair(lost.key, lost.pics);
    const lines = [{ id: 'lost', text: lost.mode === 'class' ? '반 연결이 풀려서 이 기기에만 저장돼요' : '연결이 풀려서 이 기기에만 저장돼요' }];
    if (keyed) lines.push({ id: 'key', key: lost.key, pics: [...lost.pics] });
    const unsent = state ? unsentRounds(state).length : 0;
    if (unsent) lines.push({ id: 'unsent', text: `아직 못 보낸 판 ${unsent}개` });
    const buttons = !keyed ? ['attach', 'leave'] : lost.mode === 'key' ? ['relogin', 'leave'] : ['relogin', 'attach', 'leave'];
    return { kind: 'lost', title: keyed ? TITLES.key : TITLES.class, lines, buttons };
  }
  if (!link) return { kind: 'local', title: TITLES.local, lines: [{ id: 'local', text: '이 기기에만 저장돼요' }], buttons: ['makeKey', 'attach', 'leave'] };
  const lines = [];
  if (link.mode === 'class') {
    const st = state?.student;
    lines.push({ id: 'seat', text: isSeat(st) && Number.isInteger(state.grade) ? seatText({ ...st, grade: state.grade }) : '반에 들어 있어요' });
  } else if (isKeyPair(link.key, link.pics)) {
    lines.push({ id: 'key', key: link.key, pics: [...link.pics] });
  }
  const reset = link.seatReset === true;
  if (reset) lines.push({ id: 'reset', text: '선생님이 반 그림을 다시 정하게 했어요. 새 그림을 정해 주세요.' });
  const unsent = state ? unsentRounds(state).length : 0;
  const failing = Boolean(status?.error);
  if (unsent) lines.push({ id: 'unsent', text: `아직 못 보낸 판 ${unsent}개` });
  else if (!failing && Number.isFinite(link.lastOkAt)) lines.push({ id: 'sent', text: '기록을 보냈어요' });
  if (failing) lines.push({ id: 'stuck', text: '지금은 기록을 보내지 못하고 있어요' });
  const buttons = link.mode === 'class' ? ['leave'] : ['attach', 'leave'];
  return { kind: link.mode, title: TITLES[link.mode], lines, buttons: reset ? ['setPics', ...buttons] : buttons };
}

// 다른 사람이에요 전에 서버에 아직 없는 것이 있나: 안 보낸 판, 또는 마지막으로 맞춘 뒤 바뀐 기록(가게·지도 고르기 등).
// 판 보냄 표시는 기록 해시에 들지 않는다(snapshot이 outbox를 뺀다).
export const leavePending = (state, link) => Boolean(state) && (unsentRounds(state).length > 0 || stateHash(state) !== link?.lastHash);

// 반에 든 기록: 반 칸 값을 넣고 학년을 반 학년으로. 진도 학년(study)은 그 학년 범위 안이면 두고, 밖이면 학년으로.
// seat = { classCode, grade, classNo, number }. 고친 기록을 돌려준다.
export function enterSeat(state, { classCode, grade, classNo, number }) {
  state.student = { classCode, classNo, number };
  if (state.grade !== grade) state.study = grade;
  state.grade = grade;
  if (!studyRange(grade).includes(state.study)) state.study = grade;
  return state;
}

// 반에 들어가기가 attach인가: 연결이 있거나(열쇠 아이), 연결이 풀린 반 없는 열쇠 아이(열쇠로 먼저 다시 잇는다, OOS 2).
// 그 밖(기기에만 저장한 아이·풀린 반 아이·반에 든 열쇠 아이)은 join.
export const attaches = (link, lost = null) => Boolean(link) || (lost?.mode === 'key' && isKeyPair(lost.key, lost.pics));

// 반에 들어가기 부름(설계서 4.6, 계획서 「서버 주소 약속」). lost = 풀린 연결(없으면 null)
// → attach면 { join: false, body }: 길과 토큰은 record-link.js keyAttach가 정한다(연결을 다시 읽고, 401이면 열쇠로 다시 잇는다).
//   join이면 { join: true, path, body, token: null }.
// 연결이 있으면(열쇠 아이) attach: 서버 기록이 그대로 반으로 옮긴다.
// 연결이 풀린 반 없는 열쇠 아이(이 시트에서 토큰이 죽었다)도 attach(열쇠로 다시 이은 뒤 부른다).
// join으로 가면 두 번째 마을이 생기고 열쇠를 잊는다.
// 그 밖에 연결이 없으면(기기에만 저장한 아이) 처음 온 번호에 지금 마을을 그대로 들고 join: 서버가 이 기록을 판 1로 둔다
// (반 칸을 넣은 복사본을 보낸다. 판 끝 요약은 들어간 뒤 보내기 줄이 보낸다). 서버가 받기 전에는 기록을 바꾸지 않는다.
export function seatRequest(state, link, seat, pics, lost = null) {
  const body = { ...seatBody(seat), pics: [...pics] };
  if (attaches(link, lost)) return { join: false, body };
  return { path: '/v1/kid/class/join', body: { ...body, state: enterSeat(snapshot(state), seat) }, token: null, join: true };
}
