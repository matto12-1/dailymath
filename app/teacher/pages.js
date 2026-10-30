// 반 대시보드의 쪽(2026-10-22 오후 결정, code.xr 「Dashboard V14」 결): 맨 위 알약 탭으로 쪽을 바꾸고, 보던 쪽은 주소(#)에 남긴다.
// 주소 꼴: 「#class=<반 id>」는 한눈에 보기, 「#class=<반 id>&page=kids」처럼 쪽 이름을 붙이면 그 쪽. 모르는 쪽 이름은 한눈에 보기.
// 아이 상세 리포트(모달, 2026-10-23)를 열면 번호와 탭을 붙인다: 「…&kid=7」(요약) · 「…&kid=7&tab=progress」. 닫으면 뗀다.
// 반 주소 없이 들어오면(반 목록 쪽은 없앴다) 열 반을 고른다(defaultClass, 마지막으로 본 반은 이 기기에).
// DOM 없이 node 시험이 본다(tests/teacher-pages.test.mjs).
export const PAGES = ['overview', 'kids', 'activity', 'settings'];
export const PAGE_NAMES = { overview: '한눈에 보기', kids: '아이별', activity: '실수·접속', settings: '반 설정' };
export const REPORT_TABS = ['summary', 'progress', 'mistakes', 'record'];
export const REPORT_TAB_NAMES = { summary: '요약', progress: '진도', mistakes: '실수', record: '기록' };
const KEYS = ['page', 'kid', 'tab'];
const KID_MAX = 999; // 서버 번호 길(\d{1,3})과 같다

const isKid = (n) => Number.isSafeInteger(n) && n >= 1 && n <= KID_MAX;

// 반 주소면 { id, page, kid, tab, exact }, 아니면 null.
// kid = 리포트를 연 번호(없으면 null), tab = 그 리포트의 탭(번호가 없으면 null), exact = 그 꼴 그대로 다시 쓴 주소와 같다.
// 붙는 것은 page·kid·tab만 한 번씩(차례는 아무래도 된다). 번호가 1~999가 아니면 리포트를 열지 않고, 모르는 탭은 요약.
export function readBoardHash(hash) {
  const m = /^#class=([0-9a-f]{32})((?:&[a-z]+=[^&]*)*)$/.exec(typeof hash === 'string' ? hash : '');
  if (!m) return null;
  const params = new Map();
  for (const part of m[2].split('&').slice(1)) {
    const at = part.indexOf('=');
    const key = part.slice(0, at);
    if (!KEYS.includes(key) || params.has(key)) return null;
    params.set(key, part.slice(at + 1));
  }
  const page = PAGES.includes(params.get('page')) ? params.get('page') : 'overview';
  const number = /^\d{1,3}$/.test(params.get('kid') ?? '') ? Number(params.get('kid')) : 0;
  const kid = isKid(number) ? number : null;
  const tab = kid === null ? null : REPORT_TABS.includes(params.get('tab')) ? params.get('tab') : 'summary';
  return { id: m[1], page, kid, tab, exact: boardHash(m[1], page, kid, tab) === hash };
}

// 반 주소. 한눈에 보기·요약 탭은 짧은 꼴(쪽·탭 이름을 붙이지 않는다)
export function boardHash(id, page = 'overview', kid = null, tab = 'summary') {
  let hash = `#class=${id}`;
  if (page !== 'overview' && PAGES.includes(page)) hash += `&page=${page}`;
  if (isKid(kid)) {
    hash += `&kid=${kid}`;
    if (tab !== 'summary' && REPORT_TABS.includes(tab)) hash += `&tab=${tab}`;
  }
  return hash;
}

// ── 반 주소 없이 들어왔을 때 열 반(2026-10-23, 반 목록 쪽을 없앰) ──

export const LAST_CLASS_KEY = 'dailymath.teacher.lastClass';

// 반이 없으면 null(새 반 만들기), 하나면 그 반, 여럿이면 이 기기에서 마지막으로 본 반(목록에 있을 때),
// 아니면 열린 반 가운데 먼저 만든 반, 모두 닫혔으면 먼저 만든 반. classes는 만든 차례(서버 classes 답). avoid = 열지 않을 반 id
export function defaultClass(classes, lastId = null, avoid = null) {
  const list = (Array.isArray(classes) ? classes : []).filter((c) => c?.id !== avoid);
  if (!list.length) return null;
  return list.find((c) => c.id === lastId) ?? list.find((c) => !c.closed) ?? list[0];
}

export function loadLastClass(storage) {
  try {
    const id = storage?.getItem(LAST_CLASS_KEY) ?? null;
    return typeof id === 'string' && /^[0-9a-f]{32}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function saveLastClass(storage, id) {
  try { storage?.setItem(LAST_CLASS_KEY, id); } catch { /* 저장이 막히면 다음에는 먼저 만든 반부터 */ }
}
// 로그아웃하면 지운다(이 기기에 선생님 칸을 남기지 않는다. 이름 칸은 names.js가 묻고 지운다)
export function clearLastClass(storage) {
  try { storage?.removeItem(LAST_CLASS_KEY); } catch { /* 지우지 못하면 그대로(반 id뿐이다) */ }
}
