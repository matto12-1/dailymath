// 관리 화면 글(설계서 6)과 서버 답 읽기, 칸 검사, 증명서 파일 꼴 고르기, 지우기 글. DOM을 부르지 않는다(node 시험, tests/admin-text.test.mjs).
// 말씨는 선생님 화면과 같다: 해요체, 줄표 없이. 끊김·서버 오류·401 같은 일반 답은 teacher/text.js teacherMessage가 읽는다.
import { teacherMessage, AGAIN, INTERNET, SCHOOL_RULE } from '../teacher/text.js?v=9a67f36b25';
import { isKey, isPicId, keyWarning, KEY_SHORT } from '../entry-text.js?v=9a67f36b25';

const DAY = 24 * 60 * 60 * 1000;
const CERT_ID = /^[0-9a-f]{32}$/; // 서버 admin.js의 신청 id 꼴(주소에 들어간다)
export const REASON_MAX = 200; // 거절 까닭 글자 수(서버 admin.js와 같다)
export const REASONS = ['재직증명서가 아니에요', '글자가 안 보여요']; // 고르는 까닭. 그 밖은 직접 쓰기

export const NO_SERVER = '관리 화면은 기록 서버와 연결해서 써요. 지금은 연결할 서버가 없어요.';
export const NOT_ADMIN = '관리자만 볼 수 있어요';
export const NOT_ADMIN_LEAD = '이 구글 계정은 관리자가 아니에요. 선생님 화면은 그대로 쓸 수 있어요.';
export const FILE_GONE = '파일이 지워졌어요. 기한이 지났을 수 있어요.';
export const CANT_VIEW = '볼 수 없는 파일이에요.';
// PDF는 모든 기기에서 pdf.js로 그린다(Ruling R33). 파일이 PDF가 아니면 PDF_BROKEN, 비밀번호가 걸렸으면 PDF_PASSWORD,
// worker가 죽거나 그리다 오류가 나면 PDF_HALTED와 [다시](pdf.js·worker를 받지 못하면 끊김 글 INTERNET과 [다시], drawNote). 쪽이 많으면 앞 쪽만
export const PDF_BROKEN = '이 PDF를 열지 못했어요.';
export const PDF_PASSWORD = '비밀번호가 걸린 PDF라 열 수 없어요.';
export const PDF_HALTED = 'PDF를 그리다가 멈췄어요. 다시 눌러 주세요.';
export const pdfMore = (shown, total) => `앞 ${shown}쪽만 보여요. 모두 ${total}쪽이에요.`;
export const ALREADY = '이미 처리된 신청이에요.';
export const MISSING = '신청을 찾지 못했어요.';
export const APPROVED = '승인했어요. 파일을 지웠어요.';
export const REJECTED = '거절했어요. 파일을 지웠어요.';
export const REASON_PICK = '거절 까닭을 골라 주세요.';
export const REASON_EMPTY = '거절 까닭을 써 주세요.';
export const REASON_LONG = `거절 까닭은 ${REASON_MAX}자까지 써 주세요.`;
export const REASON_RULE = `거절 까닭은 1자에서 ${REASON_MAX}자까지 써 주세요.`;

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const text = (v) => (typeof v === 'string' ? v : '');
const time = (v) => (Number.isFinite(v) ? v : null);

// 증명서를 그리지 못한 까닭(admin/pdf.js drawPdf · admin/picture.js drawPicture) → 파일 칸 알림 { message, retry }.
// 끊김(pdf.js·worker를 받지 못함, 오프라인)과 멈춤(worker가 죽음, 그리다 난 오류)만 [다시]. 'bad'는 풀지 못한 그림.
export function drawNote(kind) {
  if (kind === 'offline') return { message: INTERNET, retry: true };
  if (kind === 'halted') return { message: PDF_HALTED, retry: true };
  if (kind === 'password') return { message: PDF_PASSWORD, retry: false };
  if (kind === 'broken') return { message: PDF_BROKEN, retry: false };
  return { message: CANT_VIEW, retry: false };
}

// ── 서버 줄 읽기 ──

// 기다리는 신청 한 줄(AdminCert) → 화면에 쓸 값. id가 꼴에 맞지 않으면 null(그 줄은 그리지 않는다).
export function readCert(c) {
  if (!isObject(c) || typeof c.id !== 'string' || !CERT_ID.test(c.id)) return null;
  return {
    id: c.id, email: text(c.teacherEmail), name: text(c.teacherName), school: text(c.school), fileType: text(c.fileType),
    createdAt: time(c.createdAt), expiresAt: time(c.expiresAt),
  };
}

// 인증된 선생님 한 줄(AdminTeacher). classes는 열린 반 수.
export function readTeacher(t) {
  if (!isObject(t) || typeof t.email !== 'string') return null;
  return {
    email: t.email, name: text(t.name), school: text(t.school), verifiedAt: time(t.verifiedAt),
    classes: Number.isSafeInteger(t.classes) && t.classes >= 0 ? t.classes : 0,
  };
}

// 남은 날: 기한(expiresAt)까지 하루가 안 남았으면 「오늘까지」, 아니면 다 찬 날 수로 「3일 남음」. 틀린 값은 null.
// 이 기기 시계가 조금 빨라 기한이 지나 보여도 서버가 기다리는 신청이라 했으니 「오늘까지」.
export function daysLeft(expiresAt, now = Date.now()) {
  if (!Number.isFinite(expiresAt) || !Number.isFinite(now)) return null;
  const days = Math.floor((expiresAt - now) / DAY);
  return days >= 1 ? `${days}일 남음` : '오늘까지';
}

// ── 증명서 파일 꼴(Ruling R29) ──

const VIEW_KINDS = { 'application/pdf': 'pdf', 'image/jpeg': 'image', 'image/png': 'image', 'image/webp': 'image' };

// 답 머리 Content-Type(매개변수는 뗀다)이 허락한 넷 가운데 하나이고 신청 줄의 fileType과 같을 때만 그 꼴, 아니면 null
export function viewType(contentType, fileType) {
  const type = String(contentType ?? '').split(';')[0].trim().toLowerCase();
  return Object.hasOwn(VIEW_KINDS, type) && type === fileType ? type : null;
}

export const viewKind = (type) => (Object.hasOwn(VIEW_KINDS, type) ? VIEW_KINDS[type] : null);

// 파일 받기 답(call()의 bytes 꼴 { ok, status, data, bytes, type }) → 띄울 것 { type, kind } 또는 알릴 것 { message, retry }.
// 꼴이 허락 밖이거나 신청 줄과 다르거나 몸통이 없으면 띄우지 않는다. 끊김·서버 탓은 다시 해 볼 수 있다(retry).
export function fileView(res, fileType) {
  if (!res?.ok) {
    const status = res?.status ?? 0;
    return { message: adminMessage('file', res), retry: status === 0 || status >= 500 };
  }
  const type = viewType(res.type, fileType);
  if (!type || !(res.bytes instanceof ArrayBuffer)) return { message: CANT_VIEW, retry: false };
  return { type, kind: viewKind(type) };
}

// ── 거절 까닭(서버 admin.js readReason과 같은 규칙) ──

// 빈칸·줄바꿈은 한 칸으로 줄이고 앞뒤는 뗀다
export const cleanReason = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
export function reasonProblem(value) {
  const length = [...cleanReason(value)].length;
  if (length < 1) return REASON_EMPTY;
  return length > REASON_MAX ? REASON_LONG : null;
}

// ── 지우기(지워 달라는 요청, 설계서 6 · 2026-10-21 결정 3) ──
// 선생님 메일·열쇠 글자·반 코드와 번호(R52)로 찾아(서버 erase/check) 무엇이 지워지는지 한 줄로 보이고, [지우기] → 확인 시트 → 지운 수(서버 erase).
// 찾은 것·지운 것은 by('email' | 'key' | 'seat')를 단 값으로 읽는다(readFound·readErased). 꼴이 틀린 답은 null(잠시 뒤에 다시).
export const ERASE_NONE = '찾은 것이 없어요.'; // 반 코드로 찾을 때 그림이 틀려도 같은 글(그 자리에 아이가 있는지 알려 주지 않는다)
export const ERASE_SURE = '되돌릴 수 없어요. 정말 지울까요?';
export const ERASE_DONE = '지웠어요.';
export const ERASE_NOTHING = '지운 것이 없어요. 벌써 지워졌을 수 있어요.'; // 그 사이 다른 창에서 먼저 지웠다(서버는 모두 0)
export const ERASE_RULE = '찾을 칸을 다시 봐 주세요.'; // 서버 400(화면이 먼저 보니 거의 없다)
export const EMAIL_RULE = '선생님의 구글 계정 메일 주소를 써 주세요.';
export const PICS_PICK = '비밀 그림 두 개를 골라 주세요.';
export const CODE_RULE = '반 코드 숫자 6개를 써 주세요.';
export const NUMBER_RULE = '번호를 숫자로 써 주세요.';
export const EMAIL_MAX = 254; // 서버 erase.js와 같다
// 판 기록이 이보다 많으면 찾은 줄에 장부 쓰기 한도를 알린다(검토 Important 2). 지운 줄과 그 색인 줄이 모두 쓰기라 판 수 × 2쯤이고,
// 무료 D1은 하루 10만 줄, 한국 시각 오전 9시(UTC 0시)에 다시 찬다. 지우기는 한 묶음 그대로 둔다(반쯤만 지워진 채 남지 않게).
export const BIG_ERASE_ROUNDS = 20000;
export const ERASE_BIG = '판 기록이 많아 지우면 오늘 장부 쓰기 한도를 많이 써요. 한도는 매일 오전 9시에 다시 차요.';
export const ERASE_TELEGRAM = '텔레그램에 온 그 선생님의 인증 신청 알림도 지워 주세요.'; // 그 알림 글에 메일이 들어 있다(검토 Minor 3)
export const ERASE_FILES_LATER = '재직증명서 파일은 7일 안에 저절로 지워져요.'; // 찾을 때보다 덜 지웠다: KV 지우기 실패(검토 Minor 4)
export const ERASE_SELF = '지금 로그인한 관리자 계정이에요. 지우면 이 화면에서도 로그아웃돼요.'; // 확인 시트(검토 Minor 2)
export const ERASE_SEAT_KEY = '열쇠로 하던 마을은 남아요. 마을도 지우려면 열쇠 글자로 찾아 지워요.'; // 반 코드로 찾은 자리의 열쇠 아이(R52)
// 열쇠 글자가 같은 마을이 둘 넘다(서버 409 many-villages): 그림 둘로 하나를 고른다
export function manyVillages(n) {
  const how = Number.isSafeInteger(n) && n > 1 ? `${n}개예요` : '여럿이에요';
  return `열쇠 글자가 같은 마을이 ${how}. 보낸 분께 비밀 그림 두 개를 물어 아래에서 고른 뒤 다시 찾아 주세요.`;
}

const STATUS_NAMES = { new: '인증 전', pending: '확인 중', verified: '인증됨', rejected: '거절됨', expired: '기한 지남' };
const MAIL = /^[^\s@]+@[^\s@]+$/;
const count = (v) => (Number.isSafeInteger(v) && v >= 0 ? v : null);
const counts = (data, names) => {
  const list = names.map((name) => count(data[name]));
  return list.includes(null) ? null : Object.fromEntries(names.map((name, i) => [name, list[i]]));
};
const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 1203 → 1,203

// 넣은 칸 검사(서버와 같은 규칙). 메일은 앞뒤 빈칸만 떼고 보낸다(대소문자는 서버가 가리지 않는다)
export const cleanEmail = (value) => String(value ?? '').trim();
export function emailProblem(value) {
  const mail = cleanEmail(value);
  return mail.length <= EMAIL_MAX && MAIL.test(mail) ? null : EMAIL_RULE;
}
// 열쇠: 빈칸·줄표를 빼고 대문자로. 열쇠 글자 6개가 아니면 아이 화면 열쇠 칸과 같은 글(7자를 6자로 자르지 않는다)
export const cleanEraseKey = (value) => String(value ?? '').replace(/[\s-]/g, '').toUpperCase();
export const keyProblem = (value) => (isKey(cleanEraseKey(value)) ? null : keyWarning(value, true) ?? KEY_SHORT);
export const picsProblem = (pics) => (Array.isArray(pics) && pics.length === 2 && pics.every(isPicId) ? null : PICS_PICK);
// 반 코드는 빈칸을 빼고 숫자 6개, 번호는 1~999(서버 erase.js와 같다). 확인 시트 머리 아래 한 줄은 「반 코드 482913 · 12번」
export const cleanCode = (value) => String(value ?? '').replace(/\s+/g, '');
export const codeProblem = (value) => (/^\d{6}$/.test(cleanCode(value)) ? null : CODE_RULE);
export function seatNumber(value) {
  const text = String(value ?? '').trim();
  return /^\d{1,3}$/.test(text) && Number(text) >= 1 ? Number(text) : null;
}
export const numberProblem = (value) => (seatNumber(value) === null ? NUMBER_RULE : null);
export const seatWho = ({ code, number }) => `반 코드 ${code} · ${number}번`;
// 지금 로그인한 관리자의 메일인지(대소문자·앞뒤 빈칸은 가리지 않는다)
export const isOwnEmail = (typed, signedIn) =>
  typeof signedIn === 'string' && signedIn.trim() !== '' && cleanEmail(typed).toLowerCase() === signedIn.trim().toLowerCase();

// 찾은 것: 메일 { teachers: [{ status, school }], classes, kids, rounds, keyKids, certs, certFiles } ·
// 열쇠 { found, seat: { code, grade, classNo, number } | null, sessions, rounds } · 반 코드 { found, keyKid, seat(찾았으면 꼭), sessions, rounds }
export function readFound(by, data) {
  if (!isObject(data)) return null;
  if (by === 'key' || by === 'seat') {
    const n = counts(data, ['sessions', 'rounds']);
    const seat = data.seat;
    const seatOk = seat === null || (isObject(seat) && typeof seat.code === 'string' && ['grade', 'classNo', 'number'].every((k) => count(seat[k]) !== null));
    if (typeof data.found !== 'boolean' || !n || !seatOk) return null;
    const place = seat && { code: seat.code, grade: seat.grade, classNo: seat.classNo, number: seat.number };
    if (by === 'key') return { by, found: data.found, seat: place, ...n };
    if (typeof data.keyKid !== 'boolean' || (data.found && !place)) return null;
    return { by, found: data.found, keyKid: data.keyKid, seat: place, ...n };
  }
  const n = counts(data, ['classes', 'kids', 'rounds', 'keyKids', 'certs', 'certFiles']);
  if (!Array.isArray(data.teachers) || !n) return null;
  return { by, teachers: data.teachers.filter(isObject).map((t) => ({ status: text(t.status), school: text(t.school) })), ...n };
}

// 지운 것(서버가 센 지운 수): 메일 { teachers, classes, kids, rounds, keyKids, certs, certFiles, tokens } · 열쇠 { villages, rounds, tokens } ·
// 반 코드 { kids, keyKids, rounds, tokens }
const ERASED_COUNTS = {
  loginId: ['teachers', 'classes', 'kids', 'rounds', 'keyKids', 'certs', 'certFiles', 'tokens'],
  email: ['teachers', 'classes', 'kids', 'rounds', 'keyKids', 'certs', 'certFiles', 'tokens'],
  key: ['villages', 'rounds', 'tokens'],
  seat: ['kids', 'keyKids', 'rounds', 'tokens'],
};
export function readErased(by, data) {
  if (!isObject(data) || !Object.hasOwn(ERASED_COUNTS, by)) return null;
  const n = counts(data, ERASED_COUNTS[by]);
  return n && { by, ...n };
}

// 선생님 몫 「반 2개 · 반 아이 기록 48명(판 기록 1,203개) · 인증 신청 기록 1개」(없는 것은 뺀다)
function teacherParts(c) {
  const parts = [];
  if (c.classes) parts.push(`반 ${num(c.classes)}개`);
  if (c.kids) parts.push(`반 아이 기록 ${num(c.kids)}명(판 기록 ${num(c.rounds)}개)`);
  if (c.certs) parts.push(`인증 신청 기록 ${num(c.certs)}개${c.certFiles ? `(재직증명서 파일 ${num(c.certFiles)}개)` : ''}`);
  return parts;
}

// 문장 잇기: 빈 조각은 빼고, 뒤에 문장이 오는데 마침표가 없는 조각(「… 판 기록 3개」)에는 찍는다
function sentences(...parts) {
  const list = parts.filter(Boolean);
  return list.map((part, i) => (i < list.length - 1 && !/[.?]$/.test(part) ? `${part}.` : part)).join(' ');
}
const bigNote = (text, rounds) => (rounds > BIG_ERASE_ROUNDS ? sentences(text, ERASE_BIG) : text);
const seatPlace = (seat) => `${seat.grade}학년 ${seat.classNo}반 ${seat.number}번`;

// 찾은 것 한 줄(지우기 전에 무엇이 지워지는지). 아무것도 없으면 「찾은 것이 없어요.」. 지울 판 기록이 2만 개를 넘으면 ERASE_BIG을 붙인다.
// 「선생님 계정 1개(○○초등학교, 인증됨) · 반 2개 · 반 아이 기록 48명(판 기록 1,203개) · 인증 신청 기록 1개. 열쇠 아이 3명은 반에서만 빠지고 마을은 남아요.」
// 「열쇠 마을 1개(지금 5학년 3반 12번) · 판 기록 87개」 · 반 코드: 「반 아이 기록 1명(5학년 3반 12번) · 판 기록 87개」,
// 그 자리가 열쇠 아이면 「열쇠 아이 1명(5학년 3반 12번)은 반에서만 빠져요. 열쇠로 하던 마을은 남아요. …」(판 기록은 지우지 않는다)
export function foundText(found) {
  if (found.by === 'seat') {
    if (!found.found) return ERASE_NONE;
    if (found.keyKid) return `열쇠 아이 1명(${seatPlace(found.seat)})은 반에서만 빠져요. ${ERASE_SEAT_KEY}`;
    return bigNote(`반 아이 기록 1명(${seatPlace(found.seat)}) · 판 기록 ${num(found.rounds)}개`, found.rounds);
  }
  if (found.by === 'key') {
    if (!found.found) return ERASE_NONE;
    const seat = found.seat ? `(지금 ${seatPlace(found.seat)})` : '';
    return bigNote(`열쇠 마을 1개${seat} · 판 기록 ${num(found.rounds)}개`, found.rounds);
  }
  if (!found.teachers.length) return ERASE_NONE;
  const status = (t) => (Object.hasOwn(STATUS_NAMES, t.status) ? STATUS_NAMES[t.status] : '');
  const who = found.teachers.map((t) => [t.school, status(t)].filter(Boolean).join(', ')).filter(Boolean).join(' / ');
  const list = [`선생님 계정 ${num(found.teachers.length)}개${who ? `(${who})` : ''}`, ...teacherParts(found)].join(' · ');
  return bigNote(sentences(list, found.keyKids ? `열쇠 아이 ${num(found.keyKids)}명은 반에서만 빠지고 마을은 남아요.` : ''), found.rounds);
}

// 지운 뒤 한 줄: 「지웠어요.」와 지운 수. 지운 것이 없으면(그 사이 먼저 지웠다) ERASE_NOTHING.
// 선생님은 뒤에 할 일을 붙인다: 찾을 때(found)보다 덜 지운 재직증명서 파일 → ERASE_FILES_LATER, 인증 신청 기록을 지웠으면 → ERASE_TELEGRAM
export function erasedText(erased, found = null) {
  if (erased.by === 'seat') {
    if (erased.kids) return `${ERASE_DONE} 반 아이 기록 ${num(erased.kids)}명 · 판 기록 ${num(erased.rounds)}개`;
    return erased.keyKids ? `${ERASE_DONE} 열쇠 아이 ${num(erased.keyKids)}명을 반에서 뺐어요. 열쇠로 하던 마을은 남아요.` : ERASE_NOTHING;
  }
  if (erased.by === 'key') return erased.villages ? `${ERASE_DONE} 열쇠 마을 ${num(erased.villages)}개 · 판 기록 ${num(erased.rounds)}개` : ERASE_NOTHING;
  if (!erased.teachers) return ERASE_NOTHING;
  return sentences(
    `${ERASE_DONE} ${[`선생님 계정 ${num(erased.teachers)}개`, ...teacherParts(erased)].join(' · ')}`,
    erased.keyKids ? `열쇠 아이 ${num(erased.keyKids)}명은 반에서 뺐어요.` : '',
    erased.certs && found?.by === 'email' && erased.certFiles < found.certFiles ? ERASE_FILES_LATER : '',
    erased.certs ? ERASE_TELEGRAM : '',
  );
}

// ── 서버 답 → 글 ──

// kind = 'list' | 'file' | 'approve' | 'reject' | 'find'(지울 것 찾기) | 'erase'. call()의 답 { ok, status, data }(인터넷이 안 되면 status 0).
export function adminMessage(kind, res) {
  const status = res?.status ?? 0;
  const error = isObject(res?.data) ? res.data.error : undefined;
  if (status === 403 && error === 'not-admin') return `${NOT_ADMIN}.`;
  if (status === 404) {
    if (error === 'gone') return FILE_GONE; // 승인·거절·7일로 지운 파일
    return kind === 'list' ? AGAIN : MISSING;
  }
  if (status === 409 && error === 'not-pending') return ALREADY;
  if (status === 409 && error === 'many-villages') return manyVillages(res.data.villages);
  if (status === 400 && kind === 'approve') return SCHOOL_RULE;
  if (status === 400 && kind === 'reject') return REASON_RULE;
  if (status === 400 && (kind === 'find' || kind === 'erase')) return ERASE_RULE;
  return teacherMessage(kind, res);
}

// ── 선생님 계정 만들기(설계서 4-1) ──

export const ACCOUNT_ID_RULE = '아이디 = 머리글자 + 연도 두 자리 + 학년 + 반';
// 지금 고른 학교 · 연도로 만든 보기 하나: 'ys2652 = 용산 26년도 5학년 2반'
export const idExample = ({ prefix, short, year }) => `${prefix}${year}52 = ${short} ${year}년도 5학년 2반`;
// 다른 학교 계정이 이미 쓰는 머리글자(막지 않고 알린다)
// 이름 뒤 「이/가」: 마지막 한글 글자에 받침이 있으면 「이」(분교장이), 없으면 「가」(학교가)
const subjectParticle = (word) => {
  const last = [...String(word)].reverse().find((ch) => ch >= '가' && ch <= '힣');
  return last && (last.charCodeAt(0) - 0xac00) % 28 ? '이' : '가';
};
export const prefixTaken = (prefix, schoolName) => `${prefix}는 ${schoolName}${subjectParticle(schoolName)} 이미 써요`;
export const INITIAL_RULE = '처음 비밀번호는 8자 이상으로 적어 주세요.';
export const INITIAL_HINT = '이번에 만드는 계정은 모두 이 비밀번호예요. 쪽지에 그대로 찍혀요.';
export const SLIP_FIRST = '처음 들어가면 비밀번호를 바꾸고, 그때 받는 계정 열쇠를 적어 두세요.';
export const SLIP_WARNING = '이 화면을 벗어나면 쪽지를 다시 띄울 수 없어요. 지금 인쇄해 주세요.';
export const SCHOOL_PICK = '학교를 찾아 골라 주세요.';
export const MANUAL_RULE = '학교 이름(2자 이상)을 적고 시·도를 골라 주세요.';
export const NAMES_RULE = '짧은 이름과 머리글자를 확인해 주세요. 머리글자는 영어 소문자로 시작하고 12자까지예요.';
export const YEAR_RULE = '학년도는 2000부터 2099까지 네 자리로 적어 주세요.';
export const NOTHING_TO_MAKE = '만들 계정이 없어요. 반 수를 넣거나 줄을 붙여 넣어 주세요.';

// 만들기 · 확인 답 → 글. 그 밖은 관리 화면 공통(adminMessage).
export function accountMessage(res) {
  const error = isObject(res?.data) ? res.data.error : undefined;
  if (res?.status === 400) {
    if (error === 'password-rule') return INITIAL_RULE;
    if (error === 'bad-request') return '학교·머리글자·학년도를 다시 봐 주세요.';
    if (error === 'duplicate-input') return '같은 아이디가 두 줄에 있어요.';
  }
  return adminMessage('accounts', res);
}

// ── 관리 첫 화면(설계서 4-4) ──

export const HOME_TITLE = '선생님 계정';
export const HOME_HINT = '지역 · 학교 · 학년도 차례로 묶었어요. 위 숫자를 누르면 그 계정만 보여요.';
export const HOME_EMPTY = '아직 만든 계정이 없어요. 「선생님 계정 만들기」로 시작해요.';
export const HOME_NONE = '맞는 계정이 없어요.';
export const TEMP_RULE = '임시 비밀번호는 8자 이상으로 적어 주세요.';
export const RESET_LEAD = '임시 비밀번호를 적어 주세요. 다음에 들어올 때 새 비밀번호로 바꾸게 돼요.';
export const RESET_EFFECTS = '잠김이 풀리고 로그인한 기기는 모두 나가요. 계정 열쇠는 지워지고, 새 비밀번호로 바꿀 때 새 열쇠가 나와요.';
export const resetDone = (name) => `되돌렸어요. ${name} 선생님에게 임시 비밀번호를 알려 주세요.`;
export function resetMessage(res) {
  const error = isObject(res?.data) ? res.data.error : undefined;
  if (res?.status === 400 && error === 'password-rule') return TEMP_RULE;
  if (res?.status === 404) return '그 계정을 찾지 못했어요. 새로 고침해 주세요.';
  return adminMessage('accounts', res);
}
