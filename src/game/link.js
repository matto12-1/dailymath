// 기기에 저장하는 로그인과 보내기 위치. 앞판 연결도 읽되 쓰지 않는 복구 값은 버린다.
import { studyRange } from './study.js?v=47133803ae';
import { stateHash, unsentRounds, fromServer, SENT_KEEP } from './sync.js?v=47133803ae';

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
    return isLink(link) ? cleanLink(link) : null;
  } catch {
    return null;
  }
}

// 새 연결이 생기면 풀린 연결 기억은 끝(다시 들어갔다)
export function saveLink(storage, link) {
  try { storage?.setItem(LINK_KEY, JSON.stringify(cleanLink(link))); } catch { /* 저장이 막히면 이 창에서만 잇는다 */ }
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
function lostOf(mode, at, { kidId, rev, lastHash, sent, classCode, grade, classNo } = {}) {
  const lost = { v: 1, mode, at };
  if (typeof kidId === 'string' && kidId !== '') lost.kidId = kidId;
  if (Number.isSafeInteger(rev) && rev >= 0) lost.rev = rev;
  if (isHash(lastHash)) lost.lastHash = lastHash;
  const hashes = Array.isArray(sent) ? sent.filter(isHash).slice(-SENT_KEEP) : [];
  if (hashes.length) lost.sent = hashes;
  if (isClassCode(classCode) && isGrade(grade) && isClassNo(classNo)) Object.assign(lost, { classCode, grade, classNo });
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

export function cleanLink(link) {
  const { seatReset, key, pics, ...rest } = link;
  return rest;
}

// 서버 기록 해시(lastHash)는 두지 않는다: 들어가자마자 보내기 줄이 기록과 선생님 화면 요약을 한 번 올린다.
export const enteredLink = ({ token, kidId, rev }, mode = 'class') => ({ v: 1, token, kidId, rev, mode });
// 판 번호를 0으로 둔다. 첫 보내기에서 서버가 판 수(sessions)로 고른다: 서버 것이 많거나 같으면 newer로 돌려주어
// 이 기기가 서버 기록으로 바꾸고(applySyncResult), 이 기기 것이 많으면 서버가 받는다. 안 보낸 판은 그대로 따로 보낸다.
export const rejoinLink = (data, mode, extra = {}) => ({ ...enteredLink(data, mode, extra), rev: 0 });

// 다시 들어간 자리가 풀린 연결의 그 아이인가(kidId를 모르면 그렇다고 본다: kidId 칸이 생기기 전에 풀린 연결·풀린 연결이 없는 기기)
export const sameKid = (lost, data) => !lost?.kidId || data?.kidId === lost.kidId;

// 서버에 이미 있던 자리로 다시 들어간 답(data = join·key/login 답 { token, kidId, rev, state }) → 넣을 기록과 연결
// - 같은 아이(sameKid): 기록은 그대로, 판 번호 0인 연결(rejoinLink). 서버가 판 수로 고르고 안 보낸 판은 그대로 보낸다.
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

// 판 번호를 모르면(이 칸이 생기기 전에 풀린 연결) null: 그때는 afterRejoin(판 번호 0, 서버가 판 수로 고른다).
// ── 탐험 일지 「내 자리」 ──

const isSeat = (st) => st !== null && typeof st === 'object' && Number.isInteger(st.classNo) && Number.isInteger(st.number);
// 반 칸 값(seat = { classCode, grade, classNo, number }) → 「5학년 3반 12번」, 서버 몸통 { code, grade, classNo, number }
export const seatText = ({ grade, classNo, number }) => `${grade}학년 ${classNo}반 ${number}번`;
export const seatBody = (seat) => ({ code: seat.classCode, number: seat.number });


// 칸에 보일 것. state = 기록, link = 연결(없으면 null), status = 보내기 줄 status()(없으면 null), api = 서버 주소(없으면 null).
// → { kind, title, lines: [{ id, text } | { id: 'key', key, pics }], buttons }
//   'none'  서버가 없다(폰 페이지·견본·옛 시험): 칸이 없다(title null)
//   'local' 「기록 저장」 서버는 있는데 연결이 없다(인터넷이 없어 「이 기기에서만 시작」·3권 전 기기):
//           반에 들어가기·다른 사람이에요
//   'class' 「내 자리」 반 아이: 「5학년 3반 12번」, 보낸 상태, 다른 사람이에요.
// 보낸 상태: 안 보낸 판이 있으면 그 수, 마지막 보내기가 실패했으면(status.error) 그렇다고 한 줄,
// 서버 답을 한 번이라도 받았고(link.lastOkAt) 실패 중이 아니면 「기록을 보냈어요」(받기 전에는 보냈다고 하지 않는다).
export function linkLines(state, link, status, api, lost = null) {
  if (!api) return { kind: 'none', title: null, lines: [], buttons: [] };
  if (!link) return {
    kind: lost ? 'lost' : 'local', title: lost ? '우리 반' : '기록 저장',
    lines: [{ id: lost ? 'lost' : 'local', text: lost ? '반 연결이 풀려서 이 기기에만 저장돼요' : '이 기기에만 저장돼요' }],
    buttons: ['attach'],
  };
  const lines = [];
  if (state?.student && Number.isInteger(state.grade)) lines.push({ id: 'seat', text: seatText({ ...state.student, grade: state.grade }) });
  const unsent = state ? unsentRounds(state).length : 0;
  if (unsent) lines.push({ id: 'unsent', text: `아직 못 보낸 판 ${unsent}개` });
  else if (!status?.error && Number.isFinite(link.lastOkAt)) lines.push({ id: 'sent', text: '기록을 보냈어요' });
  if (status?.error) lines.push({ id: 'stuck', text: '지금은 기록을 보내지 못하고 있어요' });
  return { kind: state?.student ? 'class' : 'local', title: state?.student ? '우리 반' : '기록 저장', lines, buttons: state?.student ? [] : ['attach'] };
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
