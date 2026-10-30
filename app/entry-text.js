// 들어오기(welcome.js)·비밀 그림(pics.js)·탐험 일지 「내 자리」(record-link.js)가 같이 쓰는 순수한 부분(설계서 4.1~4.3·4.6):
// 아이 글, 서버 답 읽기, 열쇠 글자. DOM·그림·다른 모듈을 부르지 않는다(node 시험이 화면 모듈 없이 본다,
// tests/entry-text.test.mjs·tests/record-link.test.mjs). 아이 글은 해요체, 줄표 없이, 숫자는 붙여서.

// ── 글 ──
export const BUSY = '확인하는 중…';
export const AGAIN = '잘 안 됐어요. 다시 해 주세요.';
export const INTERNET = '인터넷이 안 돼요. 연결되면 다시 눌러 주세요.';
export const KEY_INTERNET = '인터넷이 안 돼서 열쇠를 못 만들었어요.';
// 이어 하기인데 아무도 들어오지 않은 번호: 번호를 고치거나, 처음이면 같은 화면 아래 [처음으로]로 새로 시작한다
export const NO_TOWN = '이 번호로 시작한 마을이 없어요. 번호를 다시 봐 주세요. 처음이면 ‘처음으로’를 눌러 시작해요.';
export const RESET = '선생님이 그림을 지웠어요. 새 그림 두 개를 골라요.';
export const KEY_NOTE = '다른 기기에서 이어 하려면 이 열쇠가 있어야 해요. 적어 두거나 사진을 찍어 두세요.';
export const KEY_HANGUL = '영어 글자로 넣어 주세요.';
export const KEY_SHORT = '열쇠 글자 6개를 다시 봐 주세요.';
// 비밀 그림 정하기(들어오기·탐험 일지 반에 들어가기)
export const PICS_SET_TITLE = '비밀 그림 두 개를 골라요';
export const PICS_SET_HINT = '다음에 들어올 때 이 두 그림을 같은 차례로 눌러요. 같은 그림을 두 번 골라도 돼요.';
// 탐험 일지 「내 자리」(설계서 4.6·4.7). 마침표: 시트 안의 안내·경고는 문장마다 찍고,
// 잠깐 뜨는 알림(showNote)·칸의 한 줄·제목은 찍지 않는다(앱의 다른 알림 「…불러왔어요」와 같게).
export const SEAT_TAKEN = '이 번호는 벌써 있어요. 선생님께 여쭤봐요.'; // 반에 들어가기: 그 번호에 이미 기록이 있다
export const ALREADY_IN_CLASS = '벌써 반에 들어 있어요'; // 알림: 다른 기기에서 이 열쇠로 먼저 반에 들어갔다
export const JOINED_NOTE = '반에 들어갔어요'; // 알림
export const LEAVE_NOTE = '이 기기에서 내 마을을 지워요. 반 코드나 열쇠로 다시 들어올 수 있어요.';
// 열쇠 아이가 나가기 전에(한 문장씩 한 줄. 폰에서 「적어 / 두거나」로 갈리지 않게 둘째 문장을 짧게)
export const LEAVE_KEY_NOTE = '다시 들어오려면 이 열쇠가 있어야 해요. 적어 두거나 사진을 찍어 두세요.';
// 기기에만 저장한 아이가 나가기 전에(Ruling R25): 서버에 없으니 지우면 끝이다
export const LOCAL_LEAVE_WARN = '이 마을은 이 기기에만 있어요. 지우면 다시 찾을 수 없어요.';
export const UNSENT_WARN = '아직 못 보낸 기록이 있어요. 지금 나가면 그 기록은 사라져요.';
// 풀린 연결(토큰이 죽어 401, 마지막 검토 I1·Ruling R41). 알림은 그때 한 번만 뜬다(sync-runner.js).
// 두 문장이라 시트 글처럼 문장마다 마침표를 찍는다(조정자가 준 글 그대로).
export const LOST_NOTE = '이 기기는 반 연결이 풀렸어요. 탐험 일지에서 다시 들어가요.';
export const LOST_CLASS_KEY_NOTE = '이 기기는 반 연결이 풀렸어요. 탐험 일지에서 열쇠로 다시 이어 해요.'; // 반에 든 열쇠 아이
export const LOST_KEY_NOTE = '이 기기는 연결이 풀렸어요. 탐험 일지에서 열쇠로 다시 이어 해요.'; // 반 없는 열쇠 아이
export const lostNote = (lost) => (!lost?.key ? LOST_NOTE : lost.mode === 'class' ? LOST_CLASS_KEY_NOTE : LOST_KEY_NOTE);
// 풀린 연결의 다른 사람이에요: 서버에 자리가 남아 있을 수 있으니 「다시 찾을 수 없어요」라고 하지 않는다
export const LOST_LEAVE_WARN = '이 기기에서 내 마을을 지워요. 서버에 보낸 기록은 다시 들어오면 찾을 수 있지만, 보내지 못한 기록은 사라져요.';
// 반에 들어가기에서 이미 있는 번호(R36(a)): 그림을 맞히면 그 자리로 다시 들어간다
export const SEAT_PICS_TITLE = '비밀 그림 두 개를 차례로 눌러요';
export const SEAT_EXISTING_HINT = '이 번호는 벌써 있어요. 내 번호가 맞으면 처음 고른 두 그림을 차례로 눌러요.';
// 열쇠로 다시 이어 하기(R36(b))
export const RELOGIN_TITLE = '열쇠 그림 두 개를 차례로 눌러요';
export const RELOGIN_HINT = '열쇠와 같이 받은 두 그림이에요.';
export const RELINKED_NOTE = '열쇠로 다시 이었어요'; // 알림
// 반 그림 새로 정하기(OOS 3): 선생님이 그림을 지운 자리에 열쇠로 다시 이은, 반에 든 열쇠 아이. 칸의 까닭 줄은 link.js linkLines
export const SEAT_PICS_DONE = '반 그림을 새로 정했어요'; // 알림
export const SEAT_PICS_ALREADY = '반 그림은 벌써 새로 정했어요. 그림이 생각나지 않으면 선생님께 다시 정해 달라고 해요.';
// 그 자리로 들어왔을 때(첫 화면 열쇠 로그인, 그 연결로 앱을 켤 때) 한 번 뜨는 알림(R51). 두 문장이라 문장마다 마침표(조정자가 준 글 그대로)
export const SEAT_RESET_NOTE = '선생님이 반 그림을 다시 정하게 했어요. 탐험 일지 맨 아래에서 새 그림을 정해 주세요.';

// 들어오기(welcome.js)에서 들어간 뒤 띄울 알림 하나(showNote는 떠 있는 알림을 바꾸니 하나만 고른다):
// 반 그림을 다시 정할 자리(열쇠 로그인 답의 seatReset, R51)면 그것(아이가 할 일이 있다), 하던 마을을 불러왔으면
// 「하던 ○○ 마을을 불러왔어요」(village는 마을 이름), 아니면 없음
export const enterNote = ({ seatReset = false, loaded = false, village = '' } = {}) =>
  (seatReset ? SEAT_RESET_NOTE : loaded ? `하던 ${village}을 불러왔어요` : null);

// 한 문장씩 한 줄(폰에서 문장 가운데가 끊기지 않게). white-space: pre-line인 칸에 넣는다.
export const sentenceLines = (text) => String(text).replace(/([.?!]) (?=\S)/g, '$1\n');

// ── 비밀 그림 ──
// 그림 이름. 차례가 서버와 같은 그림 번호다(0 빵 · 1 책 · 2 꽃 · 3 아이스크림 · 4 사과 · 5 물고기 · 6 컵 · 7 공 · 8 빗).
// 그림(PICS)은 pics.js가 이 차례로 붙인다. 아홉은 2026-10-21 결정(R47, 81가지). 앞 넷은 번호를 바꾸지 않는다
export const PIC_NAMES = ['빵', '책', '꽃', '아이스크림', '사과', '물고기', '컵', '공', '빗'];
export const isPicId = (id) => Number.isInteger(id) && id >= 0 && id < PIC_NAMES.length;
const isPair = (v) => Array.isArray(v) && v.length === 2 && v.every(isPicId);
const samePair = (a, b) => isPair(a) && isPair(b) && a[0] === b[0] && a[1] === b[1];

// ── 내 마을 열쇠 ──
// 열쇠 글자: 헷갈리는 B·G·I·L·O·Q·S·Z를 뺀 영어 대문자 18자 가운데 6개(서버 crypto.js KEY_ALPHABET과 같다).
export const KEY_LETTERS = 'ACDEFHJKMNPRTUVWXY';
export const KEY_LENGTH = 6;
const KEY_FORM = new RegExp(`^[${KEY_LETTERS}]{${KEY_LENGTH}}$`);
// 넣는 동안 맞추기: 글자만 남기고(빈칸·숫자·기호 뺌) 대문자로, 6자까지
export const cleanKey = (text) => String(text ?? '').replace(/[^a-z]/gi, '').toUpperCase().slice(0, KEY_LENGTH);
export const isKey = (text) => typeof text === 'string' && KEY_FORM.test(text);
// 맞춘 글과 커서 자리(커서 앞에 남는 글자 수). 가운데를 고쳐도 커서가 끝으로 튀지 않게. 커서를 모르면 끝.
export function tidyKey(raw, caret = null) {
  const text = String(raw ?? '');
  const at = Number.isInteger(caret) ? caret : text.length;
  return { value: cleanKey(text), caret: cleanKey(text.slice(0, at)).length };
}
// 열쇠 칸 아래 글(없으면 null). 넣는 동안은 한글과 열쇠에 없는 글자(B·G·I·L·O·Q·S·Z)만,
// [다음]을 누르면(done) 글자 수도 본다.
export function keyWarning(raw, done = false) {
  const text = String(raw ?? '');
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text)) return KEY_HANGUL;
  const clean = cleanKey(text);
  const bad = [...new Set([...clean].filter((letter) => !KEY_LETTERS.includes(letter)))];
  if (bad.length) return `열쇠에는 ${bad.join(', ')} 글자가 없어요. 다시 봐 주세요.`;
  if (done && !isKey(clean)) return KEY_SHORT;
  return null;
}

// ── 서버 답 ──
const MINUTE = 60 * 1000;
const SLOT_LOCK_MINUTES = 15; // 서버 잠김(비밀 그림 5번 틀림)은 15분. 기기 시계가 틀려도 그보다 길게 말하지 않는다
const minutes = (ms) => Math.max(1, Math.ceil(ms / MINUTE));
const SEAT_FILLED = ['taken', 'wrong-pics', 'locked']; // 반에 들어가기에서 「그 번호에 이미 기록이 있다」는 답

// 서버 답 → 아이 글(설계서 4.1 표). kind = 'check' | 'join' | 'login' | 'new' | 'attach'(탐험 일지 반에 들어가기).
// 인터넷이 안 되거나(status 0) 서버 오류·약속 밖의 답이면 인터넷 글. 잠김·횟수는 남은 시간을 분으로 올려 말한다.
// 반에 들어가기에서 번호에 이미 기록이 있으면(409 taken, 기기에만 저장한 아이의 join이 그 사이 생긴 번호를 만나
// 403 wrong-pics·423 locked) 반 찾기 existing과 같은 글(설계서 4.6).
export function kidMessage(kind, res, now = Date.now()) {
  const status = res?.status ?? 0;
  const data = res?.data !== null && typeof res?.data === 'object' ? res.data : {};
  if (status === 0 || status >= 500 || (status >= 200 && status < 300)) return kind === 'new' ? KEY_INTERNET : INTERNET;
  if (status === 429) {
    const seconds = Number.isFinite(data.retryAfter) && data.retryAfter > 0 ? data.retryAfter : 600;
    return `너무 많이 해 봤어요. ${minutes(seconds * 1000)}분 뒤에 다시 해 주세요.`;
  }
  if (kind === 'attach' && SEAT_FILLED.includes(data.error)) return SEAT_TAKEN;
  switch (data.error) {
    case 'no-class': return '반 코드를 찾지 못했어요. 선생님께 받은 숫자 6개를 다시 봐 주세요.';
    case 'mismatch': return '반 코드와 학년·반이 맞지 않아요. 다시 봐 주세요.';
    case 'number-range':
      return Number.isInteger(data.size) && data.size > 0 ? `번호는 1부터 ${data.size}까지예요.` : '번호를 다시 봐 주세요.';
    case 'wrong-pics':
      return Number.isInteger(data.left) && data.left > 0
        ? `그림이 맞지 않아요. ${data.left}번 더 틀리면 잠시 들어올 수 없어요.` : '그림이 맞지 않아요. 다시 눌러 봐요.';
    case 'locked': {
      const left = Number.isFinite(data.until) ? Math.min(SLOT_LOCK_MINUTES, minutes(data.until - now)) : SLOT_LOCK_MINUTES;
      return `너무 많이 틀렸어요. ${left}분 뒤에 다시 하거나 선생님께 그림을 다시 정해 달라고 해요.`;
    }
    case 'taken': return '이 번호는 벌써 쓰고 있어요. 번호를 다시 봐 주세요.';
    case 'wrong-key': return '열쇠가 맞지 않아요. 글자와 그림을 다시 봐 주세요.';
    case 'already-in-class': return ALREADY_IN_CLASS;
    default: return AGAIN;
  }
}

// 다시 눌러 볼 만한 실패(인터넷·서버 오류·약속 밖의 답)
export const retryable = (res) => res?.status === 0 || res?.status >= 500 || Boolean(res?.ok);

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isText = (v) => typeof v === 'string' && v !== '';
const isRev = (v) => Number.isSafeInteger(v) && v >= 0;
const SLOTS = ['new', 'existing', 'reset'];
// 반 찾기(check) 답의 자리: 'new'(처음 온 번호) · 'existing'(이미 있는 번호) · 'reset'(선생님이 그림을 지움), 아니면 null
export const seatSlot = (res) => (res?.ok && SLOTS.includes(res.data?.slot) ? res.data.slot : null);
// 들어가기·열쇠로 이어 하기 답 { token, kidId, rev, state(없으면 null) }
export const validEntry = (d) => isObject(d) && isText(d.token) && isText(d.kidId) && isRev(d.rev) && (d.state == null || isObject(d.state));
// 열쇠 만들기 답 { token, kidId, key, pics, rev }
export const validNewKey = (d) => isObject(d) && isText(d.token) && isText(d.kidId) && isRev(d.rev) && isKey(d.key) && isPair(d.pics);

// 반 그림 새로 정하기 답(POST /v1/kid/class/pics, OOS 3) → 다음 할 일
//  { go: 'set' }            정했다(연결의 표시를 뗀다)
//  { go: 'already', text }  벌써 새로 정한 자리다(다른 기기에서 정했거나 그 번호를 넣은 누군가가 먼저 정했다, 409 not-reset): 표시를 떼고 글
//  { go: 'unlinked' }       토큰이 죽었다(401): 연결을 푼다(풀린 연결에 열쇠가 남는다)
//  { go: 'retry', text }    고른 그림을 두고 [다시](인터넷·서버 오류·약속 밖의 답)
//  { go: 'pics', text }     글을 보이고 그림을 처음부터
export function seatPicsOutcome(res) {
  if (res?.ok && res.data?.ok === true) return { go: 'set' };
  if (res?.status === 401) return { go: 'unlinked' };
  if (!res?.ok && res?.data?.error === 'not-reset') return { go: 'already', text: SEAT_PICS_ALREADY };
  const text = kidMessage('pics', res);
  return retryable(res) ? { go: 'retry', text } : { go: 'pics', text };
}

// 반 칸으로 돌아갈 실패: 반이 그 사이 바뀌었거나(닫힘·학년·인원) 다른 기기가 이 번호를 먼저 차지했다(409 taken)
const BACK_TO_FORM = ['taken', 'no-class', 'mismatch', 'number-range'];
// 들어가기(join) 답 → 다음 할 일
//  { go: 'in', data }          들어간다
//  { go: 'form', value, text } 넣은 값(seat)을 채운 반 칸으로 돌아가 글을 보인다(저절로 다시 부르지 않는다)
//  { go: 'retry', text }       고른 그림을 두고 [다시](인터넷·서버 오류·약속 밖의 답)
//  { go: 'pics', text }        글을 보이고 그림을 처음부터(틀린 그림·잠김·횟수)
export function joinOutcome(res, seat, now = Date.now()) {
  if (res?.ok && validEntry(res.data)) return { go: 'in', data: res.data };
  const text = kidMessage('join', res, now);
  if (!res?.ok && BACK_TO_FORM.includes(res?.data?.error)) return { go: 'form', value: { ...seat }, text };
  if (retryable(res)) return { go: 'retry', text };
  return { go: 'pics', text };
}

// 탐험 일지 「반에 들어가기」 답 → 다음 할 일(joinOutcome과 같은 갈래, 설계서 4.6).
// 열쇠 아이는 attach 답({ ok: true }), 기기에만 저장한 아이(joined)는 join 답(처음 온 번호에 지금 마을을 들고 들어감).
// 답을 잃은 부름(인터넷이 끊겨 [다시]가 뜬 부름)도 서버에서는 처리됐을 수 있다. 시트가 기억한 것을 넘긴다:
//   mine(state)  join으로 돌아온 서버 기록이 이 시트가 보낸 마을이면 true(해시로 견준다, record-link.js)
//   lostHere     이 번호로 보낸 attach의 답을 이 시트에서 잃은 적이 있다
//   pics         이번에 보낸 그림, lostPics  이 번호로 보낸 join 가운데 답을 잃은 첫 그림(없으면 null)
//   existing     이미 있는 번호·선생님이 그림을 지운 번호로 그림을 눌러 들어갔다(R36(a), 연결 없는 join 길만)
// →
//  { go: 'in', data }          들어갔다(data = join 답, attach면 { ok: true } 또는 null).
//                              rejoin: true면 서버에 이미 있던 자리로 다시 들어갔다(연결 판 번호 0으로: 서버가 판 수로 고른다, I2)
//  { go: 'form', value, text } 넣은 값을 채운 반 칸으로 돌아가 글(번호가 그 사이 찼다·반이 바뀌었다).
//                              revoke가 있으면 그 토큰을 버린다(join이 남의 번호로 들여보냈다: 다른 기기가 같은 그림으로 먼저 들어옴)
//  { go: 'again', pics }       그 그림으로 한 번만 더 보낸다(답을 잃은 첫 join이 만든 내 번호일 수 있다. 다시 볼 때는 lostPics 없이)
//  { go: 'class', text }       다른 기기에서 이 열쇠로 벌써 반에 들어갔다(연결을 반으로 맞춘다)
//  { go: 'unlinked', text }    토큰이 죽었다(401): 연결을 풀고(기록은 둔다) 고른 그림을 두고 [다시](다음은 join)
//  { go: 'retry', text }       고른 그림을 두고 [다시](인터넷·서버 오류·약속 밖의 답)
//  { go: 'pics', text }        글을 보이고 그림을 처음부터(횟수·이미 있는 번호의 틀린 그림·잠김)
// join의 403(그림을 견준 답)에는 forget: true를 단다: 그 번호의 「답을 잃은 그림」 기억을 버린다(그 그림도 아니었다).
export function attachOutcome(res, seat, { joined = false, existing = false, mine = null, lostHere = false, pics = null, lostPics = null } = {}, now = Date.now()) {
  const value = { ...seat };
  if (res?.ok && !joined && res.data?.ok === true) return { go: 'in', data: res.data };
  if (res?.ok && joined && validEntry(res.data)) {
    if (res.data.created === true || (res.data.state && mine?.(res.data.state) === true)) return { go: 'in', data: res.data };
    if (existing) return { go: 'in', data: res.data, rejoin: true };
    return { go: 'form', value, text: SEAT_TAKEN, revoke: res.data.token };
  }
  const error = res?.ok ? null : res?.data?.error;
  if (!joined && res?.status === 401) return { go: 'unlinked', text: AGAIN };
  if (error === 'already-in-class') return lostHere ? { go: 'in', data: null } : { go: 'class', text: kidMessage('attach', res, now) };
  if (joined && (error === 'wrong-pics' || error === 'locked') && isPair(lostPics) && !samePair(lostPics, pics)) {
    return { go: 'again', pics: [...lostPics] };
  }
  const forget = joined && error === 'wrong-pics' ? { forget: true } : {};
  if (joined && existing && (error === 'wrong-pics' || error === 'locked')) return { go: 'pics', text: kidMessage('join', res, now), ...forget };
  const text = kidMessage('attach', res, now);
  if (SEAT_FILLED.includes(error) || BACK_TO_FORM.includes(error)) return { go: 'form', value, text, ...forget };
  if (retryable(res)) return { go: 'retry', text };
  return { go: 'pics', text };
}
