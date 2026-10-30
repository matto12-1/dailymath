// 선생님 화면 글(설계서 5.1~5.5)과 서버 답 읽기, 칸 검사. DOM을 부르지 않는다(node 시험, tests/teacher-text.test.mjs).
// 선생님 화면도 아이 화면과 같은 말씨: 해요체, 줄표 없이, 숫자는 붙여서.
import { lowPercent } from '../../src/game/board.js?v=9a67f36b25';
const MB = 1024 * 1024;
export const CERT_MAX = 8 * MB; // 재직증명서(서버 teacher.js와 같다)

export const INTERNET = '인터넷이 안 돼요. 연결되면 다시 눌러 주세요.';
export const AGAIN = '잘 안 됐어요. 잠시 뒤에 다시 해 주세요.';
export const SIGNED_OUT = '로그인이 끝났어요. 다시 로그인해 주세요.';
export const SCHOOL_RULE = '학교 이름은 2자에서 40자까지 써 주세요.';
export const FILE_MISSING = '재직증명서 파일을 골라 주세요.';
export const TOO_BIG = '파일이 너무 커요. 8MB 이하로 올려 주세요.';
export const TOO_MANY_CLASSES = '열린 반은 30개까지예요. 쓰지 않는 반을 닫고 다시 해 주세요.';
export const CLASS_MISSING = '반을 찾지 못했어요. 맨 위 반 고르기에서 다시 골라 주세요.';
export const PENDING = '확인 중이에요. 보통 하루 안에 확인해요.';
export const NAMES_NOTE = '이름은 이 기기에만 남아요. 서버로 가지 않아요.';
export const NO_SERVER = '선생님 화면은 기록 서버와 연결해서 써요. 지금은 연결할 서버가 없어요.';

const GRADE_RULE = '학년을 골라 주세요.';
const CLASS_NO_RULE = '반은 1부터 99까지 넣어 주세요.';
const SIZE_RULE = '인원은 1명부터 40명까지 넣어 주세요.';

// 한 번호에 하는 부름(그림 다시 정하기·자리 비우기·아이 리포트 읽기): 404는 반이 아니라 그 번호가 없는 것
export const SEAT_KINDS = ['reset', 'clear', 'report'];

const minutes = (seconds) => Math.max(1, Math.ceil(seconds / 60));
const isInt = (v, min, max) => Number.isSafeInteger(v) && v >= min && v <= max;

// 서버 답(call()의 { ok, status, data }) → 선생님 글. kind = 'login' | 'me' | 'cert' | 'class' | 'patch' | 'board' | 'reset' | 'clear' | 'report'.
// 인터넷이 안 되면(status 0) 다시 누르라는 글, 서버 오류·약속 밖의 답은 잠시 뒤에 다시. 429는 남은 시간을 분으로 올려 말한다.
export function teacherMessage(kind, res) {
  const status = res?.status ?? 0;
  const data = res?.data !== null && typeof res?.data === 'object' ? res.data : {};
  if (status === 0) return INTERNET;
  if (status >= 500 || (status >= 200 && status < 300)) return AGAIN;
  if (status === 429) {
    const what = kind === 'login' ? '로그인을' : '';
    const when = Number.isFinite(data.retryAfter) && data.retryAfter > 0 ? `${minutes(data.retryAfter)}분 뒤에` : '잠시 뒤에';
    return `${what ? `${what} ` : ''}너무 많이 했어요. ${when} 다시 해 주세요.`;
  }
  switch (data.error) {
    case 'bad-google-token': return '구글 계정을 확인하지 못했어요. 다시 로그인해 주세요.';
    case 'bad-token': return SIGNED_OUT;
    case 'already-pending': return '벌써 확인을 기다리는 신청이 있어요.';
    case 'already-verified': return '벌써 인증된 계정이에요.';
    case 'bad-file': return 'PDF·JPG·PNG·WEBP 파일만 올릴 수 있어요.';
    case 'too-big': return TOO_BIG;
    case 'not-verified': return '인증이 끝나야 반을 만들고 볼 수 있어요.';
    case 'too-many-classes': return TOO_MANY_CLASSES;
    case 'size-below-joined':
      return Number.isSafeInteger(data.maxNumber) && data.maxNumber > 0
        ? `${data.maxNumber}번 아이까지 들어와 있어요. 인원을 ${data.maxNumber}명보다 적게 할 수 없어요.`
        : '들어온 아이 번호보다 인원을 적게 할 수 없어요.';
    case 'not-found': return SEAT_KINDS.includes(kind) ? '그 번호의 아이를 찾지 못했어요. 새로 고침해 주세요.' : CLASS_MISSING;
    default: break;
  }
  if (status === 401) return SIGNED_OUT;
  if (status === 400 && kind === 'cert') return SCHOOL_RULE; // 파일은 화면이 먼저 보니 남는 것은 학교 이름
  if (status === 400 && (kind === 'class' || kind === 'patch')) return '학년·반·인원을 다시 봐 주세요.';
  return AGAIN;
}

// ── 칸 검사(서버와 같은 규칙) ──

// 학교 이름: 빈칸·줄바꿈은 한 칸으로 줄이고 앞뒤는 뗀다(서버 readSchool과 같다)
export const cleanSchool = (text) => String(text ?? '').replace(/\s+/g, ' ').trim();
export function schoolProblem(text) {
  const length = [...cleanSchool(text)].length;
  return length >= 2 && length <= 40 ? null : SCHOOL_RULE;
}

// 파일 꼴은 서버가 앞 바이트로 본다(기기가 붙인 꼴 이름은 비거나 틀릴 수 있다). 여기서는 고른 것과 크기만.
export function fileProblem(file) {
  if (!file) return FILE_MISSING;
  return file.size > CERT_MAX ? TOO_BIG : null;
}

export const sizeProblem = (size) => (isInt(size, 1, 40) ? null : SIZE_RULE);
export function classProblem({ grade, classNo, size }) {
  if (!isInt(grade, 1, 6)) return GRADE_RULE;
  if (!isInt(classNo, 1, 99)) return CLASS_NO_RULE;
  return sizeProblem(size);
}

// ── 화면 글 ──

// 'YYYY-MM-DD' → 「10월 21일」(틀린 날짜는 null)
export function dayText(day) {
  const m = typeof day === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(day) : null;
  if (!m) return null;
  const month = Number(m[2]);
  const date = Number(m[3]);
  if (month < 1 || month > 12 || date < 1 || date > 31) return null;
  return `${month}월 ${date}일`;
}

// 서버 시간(epoch 밀리초) → 이 기기 시간대로 「10월 21일」(틀린 값은 null). 선생님 화면 올린 날, 관리 화면 올린 날·인증한 날.
export function msDay(ms) {
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export const classTitle = ({ grade, classNo }) => `${grade}학년 ${classNo}반`;

// 한 번호에 하는 일(Ruling R31): 줄의 [관리] → 고르는 시트(그림 다시 정하기 · 번호 비우기, 언제 쓰는지 한 줄씩) → 확인 시트
// 「자리」는 지어낸 말로 읽혀서(2026-10-25 Matto) 「번호」로 쓴다
export const seatTitle = (number) => `${number}번 관리`;
// 마지막 검토 R38: 두 일 모두 서버가 그 번호의 토큰을 지운다. 그 번호로 들어와 있던 기기가 나가게 된다고 미리 알린다
export const RESET_WHEN = '아이가 비밀 그림을 잊었을 때 써요. 기록은 그대로 남고, 이 번호로 들어와 있던 기기는 나가게 돼요.';
export const CLEAR_WHEN = '다른 아이가 이 번호로 잘못 들어왔을 때 써요. 이 번호의 기록이 지워져요.';
// 반 코드를 아는 사람이 지운 번호를 먼저 채지 못하게 아이가 바로 정할 수 있을 때 누른다(보안 검토 Important 2 A)
export const resetPicsText = (number) => `${number}번 아이의 비밀 그림을 지워요. 이 번호로 들어와 있던 기기도 모두 나가게 돼요. 다음에 들어올 때 새로 정해요. 아이가 바로 새로 정할 수 있을 때 누르세요.`;
export const resetDoneText = (number) => `${number}번 아이의 비밀 그림을 지웠어요. 다음에 들어올 때 새로 정해요.`;
// 열쇠 아이는 마을(서버 기록)이 남고 이 반 자리만 떨어진다: 「이 반에 남은」 기록
export const clearSeatText = (number) => `${number}번을 비워요. 이 반에 남은 이 번호의 기록이 모두 지워지고, 이 번호로 들어와 있던 기기는 나가게 돼요. 되돌릴 수 없어요.`;
export const clearDoneText = (number) => `${number}번을 비웠어요. 이 번호로 새로 들어올 수 있어요.`;
// 로그아웃 전에(결정 4, 2026-10-21): 이 기기에 적은 아이 이름이 있으면 같이 지울지 묻는다(이름은 이 기기에만 있다, names.js)
export const LOGOUT_NAMES_TITLE = '이 기기에 적은 이름도 지울까요?';
export const LOGOUT_NAMES_TEXT = '학교 공용 컴퓨터라면 지우는 것이 좋아요. 이름은 이 기기에만 있어서, 지우면 다시 적어야 해요.';
export const LOGOUT_CLEAR = '이름도 지우고 로그아웃';
export const LOGOUT_KEEP = '이름은 두고 로그아웃';
// 아이에게 알려 줄 말(설계서 5.4)
export const tellKids = (cls) => `매일 수학 → 반 코드 ${cls.code} → ${classTitle(cls)} → 자기 번호`;

// ── 반 대시보드 숫자 칸·살펴볼 아이(2026-10-22 결정, 자료는 src/game/board.js) ──

// 살펴볼 까닭 한 줄(attentionOf). 대시보드 살펴볼 아이 꼬리표와 리포트 머리 꼬리표가 같은 글을 쓴다
export function attentionText(item) {
  switch (item?.reason) {
    case 'locked': return '비밀 그림이 잠겼어요';
    case 'reset': return '새 그림을 기다려요';
    case 'away': return `${item.days}일째 안 들어왔어요`;
    case 'low': return `최근 맞힌 비율 ${lowPercent(item)}%`;
    default: return '';
  }
}

// 비율 → 「63%」(없으면 null: 지어낸 0%를 보이지 않는다)
export const rateText = (rate) => (Number.isFinite(rate) ? `${Math.round(rate * 100)}%` : null);

// 숫자 칸 넷의 한 줄 설명(boardStats)
export const statNotes = (s) => ({
  joined: s.absent > 0 ? `아직 ${s.absent}명이 안 들어왔어요` : '모두 들어왔어요',
  today: '오늘 한 번 이상 들어왔어요',
  rate: s.total ? `최근 문제 ${s.total}개 가운데 ${s.correct}개를 맞혔어요` : '아이들이 문제를 풀면 보여요',
  attention: s.attention ? '잠김·오래 안 옴·맞힌 비율이 낮은 아이를 모았어요' : '지금은 없어요',
});

// 반 대시보드 쪽 머리(2026-10-22 오후 결정, V14 결): 큰 제목과 설명 한 줄. 설명은 반 이름 뒤에 붙는 글(반 이름은 화면이 칸으로 넣는다)
export const PAGE_HEADS = {
  overview: { title: '안녕하세요, 선생님', lead: ' 오늘 모습이에요.' },
  kids: { title: '아이별', lead: ' 아이마다 지금 단원과 기록을 봐요.' },
  activity: { title: '실수·접속', lead: '에서 많이 나온 실수와 자주 들어온 아이예요.' },
  settings: { title: '반 설정', lead: ' 반 코드를 알려 주고, 인원과 반 닫기를 바꿔요.' },
};

// ── 아이디 로그인 · 계정 열쇠 · 내 계정(설계서 4-2, 선생님 · 관리 화면이 같이 쓴다) ──
export const LOGIN_NOTE = '처음 들어오면 자기 비밀번호로 바꿔 주세요. 비밀번호를 잊으면 「비밀번호를 잊었어요」에서 계정 열쇠로 새로 정해요.';
export const PASSWORD_LOCKED = '5번 틀려서 15분 동안 잠겼어요. 비밀번호가 생각나지 않으면 「비밀번호를 잊었어요」에서 계정 열쇠로 새로 정해 주세요.';
export const CREDENTIALS = '아이디나 비밀번호가 맞지 않아요. 다시 확인해 주세요.';
export const PASSWORD_RULE = '새 비밀번호를 8자 이상 넣고 한 번 더 똑같이 넣어 주세요.';
export const PASSWORD_TWICE = '두 비밀번호가 달라요. 다시 넣어 주세요.';
export const KEY_WRONG = '아이디나 열쇠가 맞지 않아요. 다시 확인해 주세요.';
export const KEY_LOCKED = '열쇠를 5번 틀려서 15분 동안 잠겼어요. 열쇠도 잃었으면 운영자에게 알려 주세요.';
export const FORGOT_LEAD = '아이디와 계정 열쇠를 넣고 새 비밀번호를 정해요. 열쇠는 띄어 쓰지 않아도 돼요.';
export const KEY_LEAD = '비밀번호를 잊었을 때 이 열쇠로 새 비밀번호를 정해요. 다시 볼 수 없으니 지금 적거나 인쇄해 두세요.';
export const KEY_COPIED = '베꼈어요. 안전한 곳에 붙여 두세요.';
export const KEY_COPY_BY_HAND = '열쇠를 골라 두었어요. 복사해 주세요.';
export const NEW_KEY_WARN = '새 열쇠를 받으면 지금 열쇠는 못 써요.';
export const NEW_KEY_DONE = '새 열쇠를 받았어요. 옛 열쇠는 이제 못 써요.';
export const PASSWORD_CHANGED = '비밀번호를 바꿨어요. 다른 기기에서는 다시 로그인해 주세요.';
export const classLabel = (t) => (Number.isSafeInteger(t?.grade) && Number.isSafeInteger(t?.classNo) ? `${t.grade}학년 ${t.classNo}반` : '');
const errorOf = (res) => (res?.data !== null && typeof res?.data === 'object' ? res.data.error : undefined);

// 「비밀번호를 잊었어요」 답 → { text, contact }. 틀린 열쇠는 아이디 · 열쇠 어느 쪽인지 말하지 않는다(없는 아이디도 같은 답).
// 열쇠 잠김은 막 잠겼으면(15분) 정한 글, 잠긴 동안 또 오면 남은 분. contact면 [운영자 연락처]를 보인다.
export function keyResetMessage(res) {
  const error = errorOf(res);
  if (res?.status === 429 && error === 'key-locked') {
    const left = Number.isFinite(res.data.retryAfter) && res.data.retryAfter > 0 ? minutes(res.data.retryAfter) : 15;
    return { text: left >= 15 ? KEY_LOCKED : `열쇠를 5번 틀려서 잠겼어요. ${left}분 뒤에 다시 해 주세요. 열쇠도 잃었으면 운영자에게 알려 주세요.`, contact: true };
  }
  if (res?.status === 401 || (res?.status === 400 && error === 'bad-request')) return { text: KEY_WRONG, contact: false };
  if (res?.status === 400 && error === 'password-rule') return { text: PASSWORD_RULE, contact: false };
  return { text: teacherMessage('key', res), contact: false };
}

// 「내 계정」 비밀번호 바꾸기 답 → 글. 지금 비밀번호가 틀리면 서버는 403(401이면 로그아웃되므로)
export function changeMessage(res) {
  const error = errorOf(res);
  if (res?.status === 403 && error === 'bad-credentials') return '지금 비밀번호가 맞지 않아요.';
  if (res?.status === 429 && error === 'password-locked') {
    const left = Number.isFinite(res.data.retryAfter) && res.data.retryAfter > 0 ? minutes(res.data.retryAfter) : 15;
    return `지금 비밀번호를 5번 틀려서 잠겼어요. ${left}분 뒤에 다시 해 주세요.`;
  }
  if (res?.status === 400 && error === 'password-same') return '지금 비밀번호와 다른 비밀번호를 써 주세요.';
  if (res?.status === 400 && error === 'password-rule') return PASSWORD_RULE;
  return teacherMessage('password', res);
}
