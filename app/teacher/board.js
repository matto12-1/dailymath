// 반 대시보드(설계서 5.4·5.5, 생김새와 배치는 2026-10-22 오후 결정: code.xr 「Dashboard V14」 결).
// 쪽은 넷이고 맨 위 줄의 알약 탭으로 바꾼다(main.js가 주소를 읽어 goPage를 부른다, pages.js). 쪽마다 한 화면 안에 든다(teacher.css).
//   쪽 머리(모든 쪽): 큰 제목(한눈에 보기는 「안녕하세요, 선생님」) · 「5학년 3반 오늘 모습이에요.」 · 오른쪽에 [반 코드 복사](먹색 알약,
//   반 설정 쪽에서는 먹색 카드에 있어 뺀다) · [새로 고침](미색 알약) · 「마지막으로 받은 때」.
//   한눈에 보기: 숫자 칸 넷(반 정답률은 살구 강조 칸 하나 · 들어온 아이 · 오늘 들어온 아이 · 살펴볼 아이) → 갈래별 맞힌 비율 세로 막대 · 살펴볼 아이 다섯.
//   아이별: 찾기 칸(번호·이 기기의 이름) · 거르기 탭(전체 · 살펴볼 아이 · 안 들어옴) · 아이별 표(표 머리는 붙어 있고 표 안에서만 내려간다).
//   실수·접속: 많이 나온 실수 다섯(막대 목록, 줄마다 그 실수가 있는 아이 번호) · 접속 순위 다섯.
//   반 설정: 반 코드 먹색 카드(코드 · 반 이름 · 복사) · 아이에게 알려 줄 말 · 인원 바꾸기(쪽 안 폼) · 반 닫기/다시 열기(닫기는 확인 시트).
// - 숫자 칸·살펴볼 아이·탭·찾기는 지금 받은 자료를 다시 묶은 것(src/game/board.js). 지난주와 견주는 꼬리표는 달지 않는다(자료가 없다).
// - 표: 번호·이름·지금 단원·익힌 단원·자주 하는 실수 셋·최근 날짜·접속 날 수(횟수)·점수·관리, 표 머리로 줄 세우기.
//   줄 세우기 → 탭 → 찾기 차례로 거른다(셋이 같이 된다). 탭은 role=tablist: 왼쪽·오른쪽·Home·End 키로 옮기며 고른다.
// - 관리 칸(표 머리 글은 화면 읽개만, 단추 이름과 겹쳐서): 잠김·새 그림 기다림 꼬리표와 [관리]. [관리]는 고르는 시트(그림 다시 정하기 · 번호 비우기, Ruling R31)를 열고
//   고른 일마다 확인 시트를 한 번 더 연다.
// - 쪽을 바꾸면(탭) 칸 자리에 회색 뼈대가 0.25초 안쪽으로 뜨고 칸이 차례로 나타나며 제목은 흐림에서 또렷해진다(teacher.css t-enter,
//   자료를 기다리게 하지 않는 짧은 움직임, 움직임 줄이기 설정이면 없음). 새로 고침으로 다시 그릴 때는 뼈대 없이.
// - 표 자료는 src/game/board.js, 이름은 names.js(이 기기에만, 서버로 보내지 않는다).
// - 서버·아이 기기에서 온 글과 선생님이 적은 이름은 글로만 넣는다(Ruling R27). 대시보드 안에는 b·i·img 같은 꾸밈 요소를 쓰지 않는다
//   (시험이 「글이 요소가 되지 않았다」를 그 요소 수로 본다).
// - 대시보드 부름(새로 고침·인원 바꾸기·반 닫기/다시 열기·그림 다시 정하기·자리 비우기)은 한 번에 하나: 도는 동안(working) 그 단추들
//   (data-action)은 다시 그려도, 쪽을 바꿔도 막혀 있다(두 번 보내지 않게). 늦게 온 새로 고침 답은 버린다(loadSeq).
// - 다시 그려도 누르던 단추·쓰던 칸으로 초점을 돌린다(data-focus). 짜임·색은 teacher.css(단추 그림도 CSS가 단다).
// - 아이 상세 리포트(모달, 2026-10-23, report.js): 아이별 표의 줄(이름 칸·[관리] 빼고) · 살펴볼 아이 · 접속 순위 · 실수 쪽 번호 꼬리표를
//   누르면 연다. 여는 것은 링크(번호·이름 글자, href = 그 아이 리포트 주소)라 키보드 Enter도 되고, 줄의 빈 곳을 눌러도 그 링크를 누른다.
//   주소가 바뀌면 main.js가 showKid를 부른다. 안 들어온 번호(반 설정의 아직 안 들어온 번호)는 링크가 아니다.
import { h } from '../ui.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { lockSheet } from '../sheet-lock.js?v=9a67f36b25';
import {
  boardRows, classStrands, classMistakes, mistakeNumbers, sortRows, isClass, attentionList, boardStats, tabRows, tabCounts, searchRows, TABS,
  ATTENTION, AWAY_DAYS,
} from '../../src/game/board.js?v=9a67f36b25';
import { todayStr } from '../../src/game/date.js?v=9a67f36b25';
import { rateLevel, attentionLevel } from '../../src/game/rate-level.js?v=9a67f36b25';
import { loadNames, saveName, NAME_MAX } from './names.js?v=9a67f36b25';
import { msgLine, say } from './say.js?v=9a67f36b25';
import { PAGES } from './pages.js?v=9a67f36b25';
import { reportModal } from './report.js?v=9a67f36b25';
import { classActions } from './access.js?v=9a67f36b25';
import * as T from './text.js?v=9a67f36b25';

// 줄 세우기 단추: 번호는 작은 차례, 나머지는 많은(최근) 차례
const SORT_DIR = { number: 'ascending', recent: 'descending', visits: 'descending', score: 'descending' };
const COLUMNS = [
  { cls: 'c-num', label: '번호', sort: 'number' },
  { cls: 'c-name', label: '이름' },
  { cls: 'c-here', label: '지금 단원' },
  { cls: 'c-mastered', label: '익힌 단원' },
  { cls: 'c-mistakes', label: '자주 하는 실수' },
  { cls: 'c-recent', label: '최근 날짜', sort: 'recent' },
  { cls: 'c-visits', label: '접속 날 수', sort: 'visits' },
  { cls: 'c-score', label: '점수', sort: 'score' },
  { cls: 'c-seat', label: '관리', sr: true },
];
const TAB_NAMES = { all: '전체', attention: '살펴볼 아이', absent: '안 들어옴' };
const TAB_EMPTY = { attention: '지금은 살펴볼 아이가 없어요.', absent: '모두 들어왔어요.' };
const RANK_TOP = 5;
const MISTAKE_NUMBERS = 10; // 실수 줄 아래 번호 꼬리표는 이만큼까지, 나머지는 「외 N명」
const MISSING_NUMBERS = 30; // 반 설정의 아직 안 들어온 번호도 이만큼까지(넉넉히, 2026-10-22 3차)
const AXIS = [1, 0.75, 0.5, 0.25, 0]; // 갈래 그림의 가로 눈금(V14 Profit and Loss)
// 살펴볼 까닭 풀이(넓은 화면에서 살펴볼 아이 칸 아래가 비면): 까닭마다 몇 명. 한 아이는 가장 급한 까닭 하나로 센다(attentionOf)
const WHY = {
  locked: '비밀 그림이 잠김',
  reset: '새 그림을 기다림',
  away: `${AWAY_DAYS}일 이상 안 들어옴`,
  low: '최근 맞힌 비율 절반 아래',
};
const ATTENTION_TOP = 5; // 폰(쪽을 내려 보는 폭)은 다섯까지
const ATTENTION_MAX = 10; // 노트북·태블릿에서 칸이 높으면(넓은 화면) 들어가는 만큼 열까지(fitAttention)
const ATTN_SPREAD_MAX = 24; // 살펴볼 아이 줄 한쪽에 더하는 여백 끝(fitAttention): 몇 명 안 되어도 칸 아래 빈 띠가 48px을 넘지 않게
const WIDE = '(min-width: 760px)'; // teacher.css의 한 화면 폭과 같다
const ROW_SPREAD_MAX = 24; // 실수·접속 줄 하나에 더하는 위아래 여백 끝(fitActivity, 칸 안 빈 띠 48px 아래로)
const ENTER_MS = 700; // 쪽을 바꾼 뒤 칸이 다 나타날 때까지(teacher.css t-enter의 마지막 칸 늦춤 + 길이보다 조금 길게)
const CLOSE_TEXT = '반을 닫으면 반 코드로 더는 들어올 수 없어요. 아이 기록은 그대로 남아요.';

const timeText = (ms) => new Date(ms).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
const none = (text = '없어요') => h('span', { class: 't-none' }, text);
const validBoard = (d) => isClass(d?.class) && Array.isArray(d?.kids);
// 이 화면을 떠나야 하는 답: 반이 없어졌다(404, 한 번호에 하는 부름은 그 번호가 없는 것이라 빼고) · 인증이 풀렸다(403)
const leaving = (kind, res) => (res.status === 404 && !T.SEAT_KINDS.includes(kind)) || res.status === 403;
// 칸(카드) 하나: 쪽을 바꿀 때 차례로 나타나게 차례 번호(--i)를 단다
const card = (tag, props, i, ...kids) => {
  const node = h(tag, props, ...kids);
  node.classList.add('t-card-x');
  node.style.setProperty('--i', String(i));
  return node;
};

// 클립보드에 글 넣기. 되면 true
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// data = { class, kids }(서버 board 답). send = 토큰을 붙인 부르기(401이면 null), busy = 부르는 동안 단추 막기(session.js),
// page = 처음 쪽, pageHash(쪽, 번호?, 탭?) = 그 쪽 주소(리포트를 열면 번호·탭까지, pages.js boardHash),
// gone(글) = 반이 없어졌을 때(404) 다른 반으로, recheck(글) = 인증이 풀렸을 때(403) 내 상태부터 다시,
// changed(반) = 반이 바뀌었을 때(반 고르기의 내 반). { el, goPage, showKid, dispose }를 돌려준다.
export function boardScreen({ data, storage, send, busy, notice = '', page: firstPage = 'overview', pageHash = () => null, gone, recheck = gone, changed = () => {} }) {
  let cls = data.class;
  let kids = data.kids;
  const owner = data.owner ?? null;
  const actions = classActions(data);
  const columns = COLUMNS.filter((col) => col.cls !== 'c-seat' || actions.includes('seat'));
  let rows = [];
  let attention = [];
  let page = PAGES.includes(firstPage) ? firstPage : 'overview';
  let sort = 'number';
  let tab = 'all';
  let query = '';
  let fetchedAt = Date.now();
  let disposed = false;
  let closeSheet = null;
  let working = 0; // 도는 대시보드 부름 수
  let loadSeq = 0; // 새로 고침 차례: 늦게 온 옛 답이 새 답(바뀐 인원 등)을 덮지 않게
  let owedFocus = null; // 다시 그릴 때 단추가 막혀 있어 옮기지 못한 초점(부름이 끝나면 옮긴다)
  let pendingFocus = null; // 쪽을 바꾼 뒤 옮길 초점(「모두 보기」 → 아이별 쪽 「살펴볼 아이」 탭)
  let enterTimer = 0;
  let openerKey = null; // 리포트를 연 링크(data-focus): 닫으면 초점을 돌린다
  const names = loadNames(storage, cls.id); // 이 창에서 쓰는 이름(저장이 막혀도 이 창에서는 남는다)

  const headBox = h('div', { class: 't-board-head' });
  const headMsg = msgLine(notice); // 대시보드 알림 줄: 다시 그려도, 쪽을 바꿔도 같은 줄(늦게 온 글이 떨어진 줄에 쓰이지 않게)
  headMsg.classList.add('t-board-msg');
  const body = h('div', { class: 't-page-body' });
  const el = h('section', { class: 't-board', 'data-class': cls.id, 'data-page': page }, headBox, headMsg, body);

  // 아이별 쪽의 표·탭·찾기 칸은 한 번 만들어 두고 쪽을 오가도 같은 것을 쓴다(찾던 글·줄 세우기가 남게)
  const tbody = h('tbody');
  const sortButtons = new Map();
  const headCells = columns.map((col) => {
    if (!col.sort) return h('th', { scope: 'col', class: col.cls }, col.sr ? h('span', { class: 's-sr' }, col.label) : col.label);
    const button = h('button', { type: 'button', class: 't-sort', 'data-sort': col.sort, 'data-focus': `sort-${col.sort}` }, col.label);
    button.addEventListener('click', () => {
      sort = col.sort;
      renderRows();
    });
    sortButtons.set(col.sort, button);
    return h('th', { scope: 'col', class: `${col.cls} sortable` }, button);
  });
  const kidsTitle = h('h3', { id: `kids-${cls.id}`, class: 's-sr' }, '아이별 표');
  const table = h('table', { class: 't-table', 'aria-labelledby': `kids-${cls.id}` }, h('thead', {}, h('tr', {}, headCells)), tbody);
  const tabsBox = h('div', { class: 't-tabs', role: 'tablist', 'aria-label': '아이 거르기' });
  const tableWrap = h('div', { class: 't-table-wrap', id: `kids-table-${cls.id}`, role: 'tabpanel' }, table);
  const search = h('input', {
    type: 'search', class: 't-search', id: `kids-search-${cls.id}`, placeholder: '번호나 이름으로 찾기', autocomplete: 'off', spellcheck: 'false',
    'data-focus': 'search', enterkeyhint: 'search',
  });
  search.addEventListener('input', () => {
    query = search.value;
    renderRows();
  });
  const searchBox = h('div', { class: 't-search-box' }, h('label', { class: 's-sr', for: search.id }, '번호나 이름으로 찾기'), search);
  const found = h('p', { class: 't-found s-sr', 'aria-live': 'polite' });
  const kidsPanel = h('section', { class: 't-panel t-kids', 'aria-labelledby': kidsTitle.id },
    kidsTitle,
    h('div', { class: 't-kids-top' }, tabsBox, searchBox),
    tableWrap,
    h('p', { class: 't-names-note' }, T.NAMES_NOTE),
    found);

  // ── 부름 차례 ──

  // 부름 단추(data-action)는 부름이 도는 동안 모두 막는다. 새로 그린 단추도 그린 뒤 여기서 맞춘다.
  function syncActions() {
    for (const b of el.querySelectorAll('button[data-action]')) b.disabled = working > 0;
  }
  function focusOn(key) {
    const target = key ? el.querySelector(`[data-focus="${key}"]`) : null;
    if (!target) return;
    if (target.disabled) owedFocus = key;
    else {
      owedFocus = null;
      target.focus({ preventScroll: true });
    }
  }
  // 대시보드 부름 하나. button은 「…하는 중」 글을 보일 단추(없어도 된다).
  async function task(button, label, work) {
    working += 1;
    syncActions();
    try {
      return await busy(button, label, work);
    } finally {
      working -= 1;
      if (!disposed) {
        syncActions();
        const lostFocus = !document.activeElement || document.activeElement === document.body;
        if (owedFocus && lostFocus) focusOn(owedFocus);
        owedFocus = null;
      }
    }
  }
  // 떠나야 하는 답이면 떠나고 true
  function lost(kind, res) {
    if (!leaving(kind, res)) return false;
    (res.status === 403 ? recheck : gone)(T.teacherMessage(kind, res));
    return true;
  }
  // 실패한 답 → 그 줄에 글(떠나야 하는 답이면 떠난다)
  function failed(kind, res, line = headMsg) {
    if (!lost(kind, res)) say(line, T.teacherMessage(kind, res), 'bad');
  }

  // ── 아이별 표 ──

  // 이름 칸: 쓰는 대로 이 기기에 남기고, 다 쓰면(change) 다듬은 이름으로 바꾼다
  function keepName(number, value) {
    const kept = saveName(storage, cls.id, number, value);
    if (kept) names[number] = kept;
    else delete names[number];
    return kept;
  }
  function nameInput(number) {
    const input = h('input', {
      class: 't-name', type: 'text', maxlength: String(NAME_MAX), placeholder: '이름', autocomplete: 'off', spellcheck: 'false',
      'aria-label': `${number}번 이름`, 'data-focus': `name-${number}`,
    });
    input.value = names[number] ?? '';
    input.addEventListener('input', () => { keepName(number, input.value); });
    input.addEventListener('change', () => { input.value = keepName(number, input.value); });
    return input;
  }

  function stepLine(here) {
    const text = here.step ? `${here.step}단계 ${here.stepName}`.trim() : here.stepName;
    return text ? h('span', { class: 't-step', title: text }, text) : null;
  }

  // 꼬리표(자리 칸, [관리] 옆 한 줄)
  const seatTag = (kind, text, title = text) => h('span', { class: `t-tag ${kind}`, title, 'data-level': attentionLevel(kind) }, text);

  function seatCell(row) {
    return h('div', { class: 't-seat' },
      row.locked ? seatTag('locked', '잠김', '비밀 그림을 5번 틀려 잠시 들어올 수 없어요') : null,
      row.picReset ? seatTag('reset', '새 그림을 기다려요') : null,
      h('button', {
        type: 'button', class: 't-seat-btn', 'aria-label': `${row.number}번 관리`, 'data-focus': `seat-${row.number}`, 'data-action': 'seat',
        onclick: () => { if (!working) askSeat(row.number); },
      }, '관리'));
  }

  // 접속 날 수: 「14일 (22번)」. 태블릿은 「14일」만 보이고 횟수는 title과 화면 읽개로(teacher.css)
  function visitsCell(row) {
    const text = `${row.visitDays}일 (${row.visitCount}번)`;
    return h('td', { class: 'c-visits', 'data-label': '접속 날 수', title: text },
      h('div', { class: 't-val' }, `${row.visitDays}일 `, h('small', { class: 't-visit-count' }, `(${row.visitCount}번)`)));
  }

  function rowEl(row) {
    const name = h('td', { class: 'c-name' }, nameInput(row.number));
    if (!row.joined) {
      return h('tr', { class: 't-absent', 'data-number': String(row.number), 'data-joined': 'false' },
        h('th', { scope: 'row', class: 'c-num' }, String(row.number)), name, h('td', { class: 'c-absent', colspan: String(columns.length - 2) }, '아직 안 들어왔어요'));
    }
    const number = h('th', { scope: 'row', class: 'c-num' },
      kidLink(row.number, `open-${row.number}`, 't-num-link', String(row.number), { 'aria-label': `${row.number}번 상세 리포트` }));
    const day = T.dayText(row.lastDay);
    // 칸 값은 한 덩어리(.t-val)로: 좁은 화면에서 칸이 「이름표 | 값」 두 칸이 될 때 값이 갈라지지 않게
    const cell = (cls, label, ...value) => h('td', { class: cls, 'data-label': label }, h('div', { class: 't-val' }, ...value));
    const tr = h('tr', { 'data-number': String(row.number), 'data-joined': 'true', 'data-open-kid': String(row.number) },
      number,
      name,
      // 태블릿(760~1099px)은 익힌 단원 칸을 접고 이 칸 안 「익힌 단원 4개」로 보인다(teacher.css, 한 폭에 하나만 보인다)
      cell('c-here', '지금 단원', row.here ? [h('span', { class: 't-unit', title: row.here.unitName }, row.here.unitName), stepLine(row.here)] : none('아직 없어요'),
        row.mastered === null ? null : h('span', { class: 't-here-mastered', 'aria-hidden': 'true' }, `익힌 단원 ${row.mastered}개`)),
      cell('c-mastered', '익힌 단원', row.mastered === null ? none() : String(row.mastered)),
      cell('c-mistakes', '자주 하는 실수', row.mistakes3.length ? h('ul', { class: 't-mistake-list' }, row.mistakes3.map((n) => h('li', { title: n }, n))) : none()),
      cell('c-recent', '최근 날짜', day ? h('time', { datetime: row.lastDay }, day) : none()),
      visitsCell(row),
      cell('c-score', '점수', String(row.score)),
      // 관리 칸은 이름표 없이(폰 카드에서 「관리 [관리]」로 겹치지 않게). .t-val은 살펴볼 까닭 표시가 쓴다(아래)
      actions.includes('seat') ? h('td', { class: 'c-seat' }, h('div', { class: 't-val' }, seatCell(row))) : null);
    // 표시만 단다. 제품 화면에는 영향이 없고 colors.css를 넣은 견본에서만 보인다.
    const rate = row.recent?.total ? row.recent.correct / row.recent.total : null;
    if (rate !== null) {
      const value = tr.querySelector('.c-here .t-val');
      value.dataset.rate = String(rate);
      value.dataset.level = rateLevel(rate);
      value.dataset.rateLabel = `최근 맞힌 비율 ${T.rateText(rate)}`;
    }
    const why = attention.find((a) => a.number === row.number);
    if (why && actions.includes('seat')) {
      const value = tr.querySelector('.c-seat .t-val');
      value.dataset.reason = why.reason;
      value.dataset.level = attentionLevel(why.reason);
      value.dataset.reasonText = T.attentionText(why);
    }
    return tr;
  }

  // 탭: 고르면 거르고, 키보드로 옮기면 바로 고른다(자동 고르기). 고른 탭만 Tab 차례에 든다.
  function pickTab(key, { focus = false } = {}) {
    tab = TABS.includes(key) ? key : 'all';
    renderRows();
    if (focus) focusOn(`tab-${tab}`);
  }
  function tabKeys(event) {
    const at = TABS.indexOf(tab);
    const next = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: TABS.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    pickTab(TABS[(next + TABS.length) % TABS.length], { focus: true });
  }
  function renderTabs() {
    const counts = tabCounts(rows, attention);
    tabsBox.replaceChildren(...TABS.map((key) => {
      const on = key === tab;
      const button = h('button', {
        type: 'button', role: 'tab', class: 't-tab', id: `tab-${key}-${cls.id}`, 'data-tab': key, 'data-focus': `tab-${key}`,
        'aria-selected': String(on), 'aria-controls': tableWrap.id, tabindex: on ? '0' : '-1',
      }, h('span', { class: 't-tab-name' }, TAB_NAMES[key]), h('span', { class: 't-tab-n' }, String(counts[key])));
      button.addEventListener('click', () => pickTab(key));
      button.addEventListener('keydown', tabKeys);
      return button;
    }));
    tableWrap.setAttribute('aria-labelledby', `tab-${tab}-${cls.id}`);
  }

  function renderRows() {
    for (const [by, button] of sortButtons) {
      const on = by === sort;
      button.setAttribute('aria-pressed', String(on));
      if (on) button.parentElement.setAttribute('aria-sort', SORT_DIR[by]);
      else button.parentElement.removeAttribute('aria-sort');
    }
    renderTabs();
    const inTab = tabRows(sortRows(rows, sort), tab, attention);
    const shown = searchRows(inTab, query, names);
    const empty = query.trim() && inTab.length ? '찾는 아이가 없어요.' : (TAB_EMPTY[tab] ?? '');
    tbody.replaceChildren(...(shown.length
      ? shown.map(rowEl)
      : [h('tr', { class: 't-empty-row' }, h('td', { colspan: String(columns.length) }, empty))]));
    found.textContent = query.trim() ? `${shown.length}명을 찾았어요.` : '';
    syncActions();
  }

  // ── 쪽 머리 ──

  function headParts() {
    const lead = T.PAGE_HEADS[page];
    const copyOut = h('span', { class: 't-copy-msg', 'aria-live': 'polite' });
    const copy = page === 'settings' ? null : h('button', { type: 'button', class: 't-pill t-copy', 'data-focus': 'copy' },
      '반 코드 ', h('span', { class: 't-pill-code' }, cls.code), ' 복사');
    copy?.addEventListener('click', async () => {
      copyOut.textContent = (await copyText(cls.code)) ? '반 코드를 복사했어요' : '복사하지 못했어요. 숫자를 직접 알려 주세요.';
    });
    const refresh = h('button', { type: 'button', class: 't-pill t-refresh-btn', 'data-focus': 'refresh', 'data-action': 'refresh' }, '새로 고침');
    refresh.addEventListener('click', () => {
      if (!working) task(refresh, '받는 중…', () => reload({ focus: 'refresh' }));
    });
    return [
      h('div', { class: 't-page-titles' },
        h('h2', { class: 't-page-title', tabindex: '-1' }, lead.title),
        h('p', { class: 't-page-lead' },
          h('span', { class: 't-class-title' }, T.classTitle(cls)), lead.lead,
          cls.closed ? h('span', { class: 't-tag closed' }, '닫힌 반') : null)),
      h('div', { class: 't-page-tools' },
        h('div', { class: 't-pills' }, copy, refresh),
        h('p', { class: 't-stamp' }, `마지막으로 받은 때 ${timeText(fetchedAt)}`),
        copyOut),
    ];
  }

  // ── 한눈에 보기 ──

  function statsSection() {
    const s = boardStats(cls, rows, kids, todayStr());
    const notes = T.statNotes(s);
    const stat = (i, key, label, value, note) => card('div', { class: 't-stat', 'data-stat': key }, i,
      h('p', { class: 't-stat-label' }, label),
      h('p', { class: 't-stat-value' }, ...value),
      h('p', { class: 't-stat-note' }, note));
    const num = (n, unit) => [h('span', { class: 't-stat-num' }, String(n)), h('span', { class: 't-stat-unit' }, unit)];
    const rate = T.rateText(s.rate);
    return h('section', { class: 't-stats', 'aria-label': '반 숫자' },
      stat(0, 'rate', '반 정답률', rate ? num(rate.slice(0, -1), '%') : [h('span', { class: 't-stat-none' }, '아직 없어요')], notes.rate),
      stat(1, 'joined', '들어온 아이', num(s.joined, `/${s.size}`), notes.joined),
      stat(2, 'today', '오늘 들어온 아이', num(s.today, '명'), notes.today),
      stat(3, 'attention', '살펴볼 아이', num(s.attention, '명'), notes.attention));
  }

  // 갈래별 맞힌 비율(사례 01 Profit and Loss): 가는 세로 막대 다섯(위에 %, 아래 갈래 이름과 맞힌/푼 수, 풀지 않은 갈래는
  // 「아직 없어요」), 뒤에 옅은 가로 눈금(0·25·50·75·100%)과 왼쪽 작은 눈금 글자.
  // 맞힌 비율이 가장 낮은 갈래 하나(같으면 앞 갈래)만 살구·코랄로 칠하고 머리에 그 뜻을 적는다. 그림 높이는 위 끝이 있다(teacher.css).
  function strandsPanel(i) {
    const strands = classStrands(kids);
    const low = strands.reduce((min, s) => (s.rate !== null && (!min || s.rate < min.rate) ? s : min), null);
    const item = (s) => {
      const bar = h('span', { class: 't-bar', 'aria-hidden': 'true' }, h('span', { class: 't-bar-fill' }));
      bar.style.setProperty('--rate', String(s.rate ?? 0));
      return h('li', { 'data-strand': s.id, 'data-level': rateLevel(s.rate), 'data-rate': s.rate, 'data-empty': s.rate === null ? 'true' : null, 'data-low': s === low ? 'true' : null },
        h('span', { class: 't-rate-pct' }, s.rate === null ? '아직 없어요' : T.rateText(s.rate)),
        bar,
        h('span', { class: 't-strand-name' }, s.name, s === low ? h('span', { class: 's-sr' }, ' (가장 낮은 갈래)') : null),
        h('span', { class: 't-rate-count' }, s.rate === null ? '0/0' : `${s.correct}/${s.total}`));
    };
    const axis = h('div', { class: 't-axis', 'aria-hidden': 'true' }, AXIS.map((at) => {
      const line = h('span', { class: 't-axis-line' }, h('span', { class: 't-axis-text' }, `${Math.round(at * 100)}%`));
      line.style.setProperty('--at', String(at));
      return line;
    }));
    return card('section', { class: 't-panel t-strands', 'aria-labelledby': `strands-${cls.id}` }, i,
      h('div', { class: 't-panel-head' },
        h('h3', { id: `strands-${cls.id}` }, '갈래별 맞힌 비율'),
        h('p', { class: 't-hint' }, low ? h('span', { class: 't-legend' }, '가장 낮은 갈래') : null, '아이마다 최근 10문제를 모았어요.')),
      h('div', { class: 't-chart' }, axis, h('ul', { class: 't-strand-list' }, strands.map(item))));
  }

  // 살펴볼 아이: 까닭 그림 · 「19번 류건우」(이름이 없으면 「19번」) · 까닭 꼬리표, 심한 차례로 다섯까지(칸이 높으면 들어가는 만큼 열까지).
  // [모두 보기] → 아이별 쪽 「살펴볼 아이」 탭
  function attentionPanel(i) {
    const more = attention.length
      ? h('button', { type: 'button', class: 't-more', 'data-focus': 'more' }, `모두 보기 (${attention.length})`)
      : null;
    more?.addEventListener('click', () => openKids('attention'));
    const item = (a) => h('li', { 'data-number': String(a.number), 'data-reason': a.reason, 'data-level': attentionLevel(a.reason), 'data-open-kid': String(a.number) },
      h('span', { class: 't-attn-icon', 'aria-hidden': 'true' }),
      kidLink(a.number, `attn-${a.number}`, 't-attn-who', [
        h('span', { class: 't-attn-num' }, `${a.number}번`),
        names[a.number] ? [' ', h('span', { class: 't-attn-name' }, names[a.number])] : null]),
      h('span', { class: 't-attn-why' }, T.attentionText(a)));
    // 칸 아래가 비면(넓은 화면) 보이는 까닭 풀이: 까닭마다 몇 명. fitAttention이 들어갈 때만 보인다
    const why = attention.length ? h('div', { class: 't-why', hidden: true },
      h('p', { class: 't-why-title' }, '살펴볼 까닭'),
      h('ul', { class: 't-why-list' }, ATTENTION.map((reason) => {
        const n = attention.filter((a) => a.reason === reason).length;
        return h('li', { 'data-reason': reason, 'data-level': attentionLevel(reason), 'data-zero': n ? null : 'true' },
          h('span', { class: 't-attn-icon', 'aria-hidden': 'true' }),
          h('span', { class: 't-why-text' }, WHY[reason]),
          h('span', { class: 't-why-n' }, `${n}명`));
      }))) : null;
    return card('section', { class: 't-panel t-attention', 'aria-labelledby': `attention-${cls.id}` }, i,
      h('div', { class: 't-panel-head' }, h('h3', { id: `attention-${cls.id}` }, '살펴볼 아이'), more),
      attention.length
        ? h('ul', { class: 't-attn-list' }, attention.slice(0, ATTENTION_MAX).map((a, n) => {
          const li = item(a);
          li.hidden = n >= ATTENTION_TOP;
          return li;
        }))
        : h('p', { class: 't-none t-attn-none' }, '지금은 없어요'),
      why);
  }

  // 살펴볼 아이 칸이 높으면 다섯 뒤 줄도 칸 안에 들어가는 만큼 보인다(넓은 화면에서 칸 아래가 비지 않게). 폰은 다섯 그대로.
  // 목록은 칸의 남은 높이만 갖고(teacher.css) 넘치는 줄은 숨긴다: 하나씩 보이며 넘치면 그 줄부터 다시 숨긴다.
  // 줄을 다 보이고도 칸 아래가 남으면 「살펴볼 까닭」 풀이를 둔다: 한 줄에 하나씩(더 높다) → 두 줄로 나눠 → 안 들어가면 숨김.
  // 그러고도 남는 높이는 줄 위아래 여백으로 고르게 나눈다(한쪽에 ATTN_SPREAD_MAX까지, --attn-spread): 목록 아래에 빈 띠가 남지 않게
  function fitAttention() {
    const list = body.querySelector('.t-attn-list');
    if (!list) return;
    const why = body.querySelector('.t-why');
    const extra = [...list.children].slice(ATTENTION_TOP);
    for (const li of extra) li.hidden = true;
    if (why) why.hidden = true;
    list.style.removeProperty('--attn-spread');
    if (!matchMedia(WIDE).matches) return;
    const over = () => list.scrollHeight > list.clientHeight + 1;
    let full = false;
    for (const li of extra) {
      li.hidden = false;
      if (over()) {
        li.hidden = true;
        full = true;
        break;
      }
    }
    if (why && !full) {
      for (const cols of ['1', '2']) {
        why.dataset.cols = cols;
        why.hidden = false;
        if (!over()) break;
        why.hidden = true;
      }
    }
    const shown = [...list.children].filter((li) => !li.hidden);
    if (!shown.length) return;
    const room = list.clientHeight - (shown.at(-1).getBoundingClientRect().bottom - list.getBoundingClientRect().top);
    const spread = Math.floor(Math.min(ATTN_SPREAD_MAX, room / (2 * shown.length - 1)) * 100) / 100;
    if (spread > 0) list.style.setProperty('--attn-spread', `${spread}px`);
  }
  // 실수·접속(노트북·태블릿): 빈 자리는 두 목록의 줄 위아래 여백이 고르게 나눠 갖되 한 줄에 ROW_SPREAD_MAX까지(--row-spread).
  // 나란히 둘 때(노트북·가로 태블릿)는 두 칸이 높은 칸에 맞춰 같은 높이로 늘고(teacher.css) 낮은 칸의 줄들이 그 차이를 나눠 갖는다.
  // 낮은 칸의 줄이 몇 개 안 되거나 「아직 없어요」면 칸 안에 큰 빈 띠가 생기니 그 칸은 늘리지 않는다(줄 여백만 끝까지, 칸은 내용 높이).
  // 위아래로 쌓을 때(태블릿 세로)는 두 칸 아래로 쪽 끝까지 남는 높이를 두 목록의 줄이 나눠 갖고, 모자라면 나머지는 쪽 끝에 남긴다.
  // 폰은 그대로
  function fitActivity() {
    const duo = page === 'activity' ? body.querySelector('.t-duo') : null;
    if (!duo) return;
    const panels = [...duo.children];
    duo.style.removeProperty('--row-spread');
    for (const panel of panels) {
      panel.style.removeProperty('--row-spread');
      panel.style.removeProperty('align-self');
    }
    if (!matchMedia(WIDE).matches) return;
    const rowsOf = (el) => el.querySelectorAll('.t-top-mistakes > li, .t-rank-list > li').length;
    if (getComputedStyle(duo).gridTemplateColumns.trim().split(/\s+/).length === 1) {
      const rows = rowsOf(duo);
      const room = body.getBoundingClientRect().bottom - duo.getBoundingClientRect().bottom;
      const spread = rows ? Math.floor(Math.min(ROW_SPREAD_MAX, room / rows) * 100) / 100 : 0;
      if (spread > 0) duo.style.setProperty('--row-spread', `${spread}px`);
      return;
    }
    duo.style.alignItems = 'start'; // 늘리기 전 칸마다 내용 높이를 잰다
    const heights = panels.map((panel) => panel.offsetHeight);
    duo.style.removeProperty('align-items');
    const tall = Math.max(...heights);
    panels.forEach((panel, i) => {
      const rows = rowsOf(panel);
      const room = tall - heights[i];
      if (room < 1 || (rows && room / rows <= ROW_SPREAD_MAX)) return; // 높은 칸이거나, 늘어난 높이를 줄 사이가 고르게 채운다
      panel.style.alignSelf = 'start';
      if (rows) panel.style.setProperty('--row-spread', `${ROW_SPREAD_MAX}px`);
    });
  }
  const fitWatch = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { fitAttention(); fitActivity(); }) : null;

  // ── 실수·접속 ──

  // 많이 나온 실수: 이름 · 「9명」 · 아래 막대(가장 많은 실수를 끝까지로 견준 아이 수) · 그 실수가 있는 아이 번호(이름은 이 기기에 적은 것만 title로)
  function mistakesPanel(i) {
    const mistakes = classMistakes(kids);
    const most = Math.max(1, ...mistakes.map((m) => m.kids));
    const item = (m, i) => {
      const bar = h('span', { class: 't-line-bar', 'aria-hidden': 'true' }, h('span', { class: 't-line-fill' }));
      bar.style.setProperty('--share', String(m.kids / most));
      const numbers = mistakeNumbers(kids, m.key).filter((n) => rows.some((r) => r.number === n && r.joined));
      const who = numbers.length ? h('p', { class: 't-mistake-who' },
        h('span', { class: 's-sr' }, '이 실수가 있는 아이: '),
        numbers.slice(0, MISTAKE_NUMBERS).map((n) => kidLink(n, `chip-${i}-${n}`, 't-num-chip', `${n}번`, { title: names[n] ?? null })),
        numbers.length > MISTAKE_NUMBERS ? h('span', { class: 't-num-more' }, `외 ${numbers.length - MISTAKE_NUMBERS}명`) : null) : null;
      return h('li', {}, h('span', { class: 't-mistake-name' }, m.name), h('span', { class: 't-mistake-kids' }, `${m.kids}명`), bar, who);
    };
    return card('section', { class: 't-panel t-mistakes', 'aria-labelledby': `mistakes-${cls.id}` }, i,
      h('div', { class: 't-panel-head' }, h('h3', { id: `mistakes-${cls.id}` }, '많이 나온 실수'), h('p', { class: 't-hint' }, '그 실수를 한 아이 수')),
      mistakes.length ? h('ol', { class: 't-top-mistakes' }, mistakes.map(item)) : h('p', { class: 't-none' }, '아직 없어요'));
  }

  // 접속 순위: 순위(CSS 숫자) · 「24번 한시우」 · 「9일 (15번)」 · 아래 막대(가장 많이 들어온 아이를 끝까지로 견준 날 수)
  function visitsPanel(i) {
    const ranking = sortRows(rows, 'visits').filter((r) => r.joined && r.visitDays > 0).slice(0, RANK_TOP);
    const most = Math.max(1, ...ranking.map((r) => r.visitDays));
    const item = (r) => {
      const bar = h('span', { class: 't-line-bar', 'aria-hidden': 'true' }, h('span', { class: 't-line-fill' }));
      bar.style.setProperty('--share', String(r.visitDays / most));
      return h('li', { 'data-open-kid': String(r.number) },
        kidLink(r.number, `rank-${r.number}`, 't-kid-who', [h('span', { class: 't-kid-num' }, `${r.number}번`), ' ', h('span', { class: 't-kid-name' }, names[r.number] ?? '')]),
        h('span', { class: 't-kid-visits' }, `${r.visitDays}일 (${r.visitCount}번)`),
        bar);
    };
    return card('section', { class: 't-panel t-visits', 'aria-labelledby': `visits-${cls.id}` }, i,
      h('div', { class: 't-panel-head' }, h('h3', { id: `visits-${cls.id}` }, '접속 순위'), h('p', { class: 't-hint' }, '접속한 날 수 차례, 같으면 횟수')),
      ranking.length ? h('ol', { class: 't-rank-list' }, ranking.map(item)) : h('p', { class: 't-none' }, '아직 없어요'));
  }

  // ── 반 설정 ──

  // 반 코드 먹색 카드(사례 04-manage): 「반 코드」 · 열린/닫힌 반 · 숫자 크게 · 반 이름과 인원 · 아래 [반 코드 복사]
  function codeCard(i) {
    const said = h('span', { class: 't-copy-msg', 'aria-live': 'polite' });
    const copy = h('button', { type: 'button', class: 't-tile t-code-copy', 'data-focus': 'copy-code' }, '반 코드 복사');
    copy.addEventListener('click', async () => {
      said.textContent = (await copyText(cls.code)) ? '반 코드를 복사했어요' : '복사하지 못했어요. 숫자를 직접 알려 주세요.';
    });
    const tellCopy = h('button', { type: 'button', class: 't-tile t-tell-copy', 'data-focus': 'copy-tell' }, '알려 줄 말 복사');
    tellCopy.addEventListener('click', async () => {
      said.textContent = (await copyText(T.tellKids(cls))) ? '알려 줄 말을 복사했어요' : '복사하지 못했어요. 직접 알려 주세요.';
    });
    return card('section', { class: 't-panel t-code-panel', 'aria-labelledby': `code-${cls.id}` }, i,
      h('div', { class: 't-panel-head' }, h('h3', { id: `code-${cls.id}` }, '반 코드'), h('p', { class: 't-hint' }, '아이들은 이 숫자로 반에 들어와요.')),
      h('div', { class: 't-code-stage' },
        h('div', { class: `t-code-card${cls.closed ? ' closed' : ''}` },
          h('div', { class: 't-code-card-top' },
            h('span', { class: 't-code-card-label' }, '매일 수학 반 코드'),
            h('span', { class: 't-code-state' }, cls.closed ? '닫힌 반' : '열린 반')),
          h('strong', { class: 't-code-big' }, cls.code),
          h('div', { class: 't-code-card-foot' },
            h('span', {}, h('small', {}, '반'), h('span', {}, T.classTitle(cls))),
            h('span', {}, h('small', {}, '인원'), h('span', {}, `${cls.size}명`)),
            h('span', {}, h('small', {}, '들어온 아이'), h('span', {}, `${cls.joined}명`))))),
      h('div', { class: 't-tiles' }, copy, tellCopy),
      said);
  }

  // 오른쪽 칸: 아이에게 알려 줄 말 · 인원 바꾸기 · 반 닫기/다시 열기. 되면 쪽 알림 줄에 된 일, 안 되면 이 칸 알림 줄에.
  function settingsPanel(i) {
    const panelMsg = msgLine();
    const size = h('input', { type: 'number', name: 'size', id: `t-board-size-${cls.id}`, min: '1', max: '40', inputmode: 'numeric', 'data-focus': 'size-input' });
    size.value = String(cls.size);
    const sizeGo = h('button', { type: 'submit', class: 'primary', 'data-action': 'size', 'data-focus': 'size' }, '인원 바꾸기');
    const form = h('form', { class: 't-size-form', novalidate: true },
      h('label', { class: 's-sr', for: size.id }, '인원'),
      size,
      sizeGo);
    // 부름 하나: 되면 쪽 알림 줄에 된 일, 초점은 누른 단추로
    const call = (button, label, body, flash, focus) => task(button, label, async () => {
      const reply = await send(`/v1/teacher/classes/${cls.id}`, { method: 'PATCH', body });
      if (reply?.ok && !disposed) await afterChange(reply, flash, focus);
      return reply;
    });
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (working) return;
      const n = Number(size.value);
      const problem = T.sizeProblem(n);
      if (problem) {
        say(panelMsg, problem, 'bad');
        return;
      }
      say(panelMsg, '');
      const res = await call(sizeGo, '바꾸는 중…', { size: n }, `인원을 ${n}명으로 바꿨어요.`, 'size');
      if (res && !res.ok && !disposed) failed('patch', res, panelMsg.isConnected ? panelMsg : headMsg);
    });
    const toggle = h('button', { type: 'button', class: cls.closed ? 'primary' : 't-quiet', 'data-action': 'toggle', 'data-focus': 'toggle' }, cls.closed ? '다시 열기' : '반 닫기');
    toggle.addEventListener('click', async () => {
      if (working) return;
      if (!cls.closed) {
        askClose();
        return;
      }
      say(panelMsg, '');
      const res = await call(toggle, '여는 중…', { closed: false }, '반을 다시 열었어요.', 'toggle');
      if (res && !res.ok && !disposed) failed('patch', res, panelMsg.isConnected ? panelMsg : headMsg);
    });
    const row = (key, title, text, ...action) => h('div', { class: 't-set-row', 'data-row': key },
      h('span', { class: 't-set-icon', 'aria-hidden': 'true' }),
      h('div', { class: 't-set-text' }, h('p', { class: 't-set-title' }, title), text ? h('p', { class: 't-set-note' }, text) : null),
      h('div', { class: 't-set-action' }, ...action));
    return card('section', { class: 't-panel t-settings', 'aria-labelledby': `settings-${cls.id}` }, i,
      h('div', { class: 't-panel-head' },
        h('h3', { id: `settings-${cls.id}` }, '반 다루기'),
        h('span', { class: `t-tag ${cls.closed ? 'closed' : 'open'}` }, cls.closed ? '닫힌 반' : '열린 반')),
      h('div', { class: 't-tell-box' },
        h('p', { class: 't-tell-label' }, '아이에게 알려 줄 말'),
        h('p', { class: 't-tell' }, T.tellKids(cls))),
      actions.includes('size') ? row('size', '인원', '들어온 아이 번호보다 적게는 못 바꿔요.', form) : null,
      actions.includes('toggle') ? row('close', cls.closed ? '닫힌 반' : '반 닫기', cls.closed ? '반 코드로 더는 들어올 수 없어요. 아이 기록은 남아 있어요.' : CLOSE_TEXT, toggle) : null,
      joinBox(),
      panelMsg);
  }

  // 반에 들어온 아이(사례 04 한도 막대 자리): 「18 / 25명」 · 막대 · 아직 안 들어온 번호(반 코드를 다시 알려 줄 아이)
  function joinBox() {
    const joined = rows.filter((r) => r.joined).length;
    const missing = rows.filter((r) => !r.joined).map((r) => r.number);
    const bar = h('span', { class: 't-line-bar', 'aria-hidden': 'true' }, h('span', { class: 't-line-fill' }));
    bar.style.setProperty('--share', String(cls.size > 0 ? Math.min(1, joined / cls.size) : 0));
    return h('div', { class: 't-join-box' },
      h('div', { class: 't-join-head' },
        h('p', { class: 't-join-label' }, '반에 들어온 아이'),
        h('p', { class: 't-join-num' }, h('strong', {}, String(joined)), ` / ${cls.size}명`)),
      bar,
      missing.length
        ? h('p', { class: 't-join-missing' },
          h('span', { class: 't-join-missing-label' }, '아직 안 들어온 번호'),
          missing.slice(0, MISSING_NUMBERS).map((n) => h('span', { class: 't-num-chip', title: names[n] ?? null }, `${n}번`)),
          missing.length > MISSING_NUMBERS ? h('span', { class: 't-num-more' }, `외 ${missing.length - MISSING_NUMBERS}명`) : null)
        : h('p', { class: 't-join-missing' }, '모두 들어왔어요.'));
  }

  // ── 아이 상세 리포트(report.js) ──

  // 그 아이 리포트를 여는 링크(지금 쪽 위에 &kid=번호). key = data-focus(닫으면 이리로 초점), content = 글·요소(목록도), extra = 더 붙일 속성
  function kidLink(number, key, className, content, extra = {}) {
    return h('a', { ...extra, class: `${className} t-open-kid`, href: pageHash(page, number), 'data-open-kid': String(number), 'data-focus': key }, [content].flat(Infinity));
  }

  // 링크를 누르면 주소가 바뀌고(main.js → showKid) 연 링크를 기억한다. 줄·칸의 빈 곳을 누르면 그 안 링크를 누른다
  // (이름 칸·[관리]·다른 단추와 칸은 그대로). 새 탭으로 여는 누르기(가운데 단추·Ctrl 등)는 브라우저에 맡긴다.
  body.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[data-open-kid]');
    if (link) {
      openerKey = link.dataset.focus;
      return;
    }
    const holder = event.target.closest('[data-open-kid]');
    if (!holder || event.target.closest('.c-name, button, input, select, textarea, label, a')) return;
    if (window.getSelection?.()?.toString()) return; // 글을 고르던 중이면 열지 않는다
    holder.querySelector('a[data-open-kid]')?.click();
  });

  const report = reportModal({
    board: () => ({ cls, rows, kids, names, owner }),
    load: (number) => send(`/v1/teacher/classes/${cls.id}/kids/${number}/report`, { method: 'GET' }),
    url: (number, kidTab, how) => {
      if (how === 'back') history.back();
      else history.replaceState(null, '', pageHash(page, number, kidTab));
    },
    actions: {
      reset: (number) => { if (!working) askReset(number); },
      clear: (number) => { if (!working) askClear(number); },
    },
    lost,
    focusBack: (key) => {
      if (key) focusOn(key);
      if (!el.contains(document.activeElement)) el.querySelector('.t-page-title')?.focus({ preventScroll: true });
    },
  });

  // 주소의 리포트 번호 → 열기·바꾸기·닫기(main.js). pushed = 주소가 쌓이며 바뀌었다(링크·앞으로 가기: 닫으면 뒤로 간다).
  // 안 들어온 번호면 열지 않고 주소에서 뗀다
  function showKid(number, kidTab = 'summary', { pushed = false } = {}) {
    if (number === null || number === undefined) {
      report.hide({ fromUrl: true });
      return;
    }
    if (!report.show(number, kidTab, { pushed, opener: openerKey })) {
      report.hide({ fromUrl: true });
      history.replaceState(null, '', pageHash(page));
    }
    openerKey = null;
  }

  // ── 쪽 그리기 ──

  function pageParts() {
    if (page === 'kids') {
      kidsPanel.classList.add('t-card-x');
      kidsPanel.style.setProperty('--i', '0');
      renderRows();
      return [kidsPanel];
    }
    if (page === 'activity') return [h('div', { class: 't-duo' }, mistakesPanel(0), visitsPanel(1))];
    if (page === 'settings') return [h('div', { class: 't-duo t-duo-settings' }, codeCard(0), settingsPanel(1))];
    return [statsSection(), h('div', { class: 't-duo t-duo-overview' }, strandsPanel(4), attentionPanel(5))];
  }

  // 「모두 보기」 → 아이별 쪽의 그 탭(주소를 바꾸면 main.js가 goPage를 부른다)
  function openKids(withTab) {
    tab = withTab;
    query = '';
    search.value = '';
    pendingFocus = `tab-${withTab}`;
    const hash = pageHash('kids');
    if (hash && location.hash !== hash) location.hash = hash;
    else goPage('kids');
  }

  // 반을 고친 뒤: 답의 반을 바로 쓰고, 아이 자료도 새로 받아 그린다(못 받으면 고친 반만으로)
  async function afterChange(reply, flash, focus) {
    if (isClass(reply.data?.class)) {
      cls = reply.data.class;
      changed(cls, owner);
    }
    if ((await reload({ flash, focus })) === false && !disposed) render({ flash, focus });
  }

  // ── 확인 시트 ──

  // 확인 시트: [yes]를 누르면 run()을 부르는 동안 시트를 잠근다(대시보드 부름 하나). 되면 닫고 done(), 안 되면 시트에 글.
  function confirmSheet({ title, text, yes, busyLabel, kind, run, done }) {
    const sheetMsg = msgLine();
    const ok = h('button', { type: 'button', class: 'primary' }, yes);
    const cancel = h('button', { type: 'button' }, '취소');
    let close = null;
    ok.addEventListener('click', () => task(null, null, async () => {
      const unlock = lockSheet(ok.closest('.sheet'));
      say(sheetMsg, '');
      ok.textContent = busyLabel;
      let res = null;
      try {
        res = await run();
      } finally {
        unlock();
        ok.textContent = yes;
      }
      if (!res || disposed) {
        close?.();
        return;
      }
      if (res.ok) {
        close?.();
        await done(res);
        return;
      }
      if (leaving(kind, res)) {
        close?.();
        lost(kind, res);
        return;
      }
      say(sheetMsg, T.teacherMessage(kind, res), 'bad');
    }));
    cancel.addEventListener('click', () => close?.());
    close = openSheet(document.body, { label: title, className: 't-sheet', onClose: () => { closeSheet = null; } },
      h('h2', {}, title),
      h('p', { class: 't-sheet-text' }, text),
      h('div', { class: 't-sheet-actions' }, ok, cancel),
      sheetMsg);
    closeSheet = close;
  }

  function askClose() {
    confirmSheet({
      title: '반 닫기', text: CLOSE_TEXT, yes: '반 닫기', busyLabel: '닫는 중…', kind: 'patch',
      run: () => send(`/v1/teacher/classes/${cls.id}`, { method: 'PATCH', body: { closed: true } }),
      done: (reply) => afterChange(reply, '반을 닫았어요.', 'toggle'),
    });
  }

  // [관리] → 그 번호에 할 일 고르기(Ruling R31). 고르면 이 시트를 닫고(초점은 [관리]로) 그 일의 확인 시트를 연다.
  function askSeat(number) {
    const title = T.seatTitle(number);
    const choice = (key, label, when, next) => {
      const note = h('p', { class: 't-choice-when', id: `t-choice-${key}` }, when);
      const go = h('button', { type: 'button', class: 't-choice-btn', 'aria-describedby': note.id }, label);
      go.addEventListener('click', () => {
        close();
        next(number);
      });
      return h('div', { class: 't-choice' }, go, note);
    };
    const cancel = h('button', { type: 'button' }, '취소');
    const close = openSheet(document.body, { label: title, className: 't-sheet t-seat-sheet', onClose: () => { closeSheet = null; } },
      h('h2', {}, title),
      h('div', { class: 't-choices' },
        choice('reset', '그림 다시 정하기', T.RESET_WHEN, askReset),
        choice('clear', '번호 비우기', T.CLEAR_WHEN, askClear)),
      h('div', { class: 't-sheet-actions' }, cancel));
    cancel.addEventListener('click', () => close());
    closeSheet = close;
  }

  function askReset(number) {
    confirmSheet({
      title: '비밀 그림 다시 정하기', text: T.resetPicsText(number), yes: '지우기', busyLabel: '지우는 중…', kind: 'reset',
      run: () => send(`/v1/teacher/classes/${cls.id}/kids/${number}/reset-pics`, {}),
      done: () => {
        // 서버가 그 번호를 reset으로 두고 잠김을 풀고 그 번호의 기기를 내보냈다: 그 줄만 바꿔 그린다
        kids = kids.map((kid) => (kid?.number === number ? { ...kid, picReset: true, locked: false } : kid));
        render({ focus: `seat-${number}` });
        say(headMsg, T.resetDoneText(number), 'ok');
      },
    });
  }

  function askClear(number) {
    confirmSheet({
      title: '번호 비우기', text: T.clearSeatText(number), yes: '비우기', busyLabel: '비우는 중…', kind: 'clear',
      run: () => send(`/v1/teacher/classes/${cls.id}/kids/${number}/clear`, { body: {} }),
      done: () => {
        // 서버가 그 번호를 빈 번호로 돌렸다: 그 줄은 「아직 안 들어왔어요」(선생님이 적은 이름은 이 기기에 그대로)
        // 서버 답은 {ok}뿐이라 반 코드 카드의 「들어온 아이」도 여기서 하나 줄인다(반 설정 막대와 같은 수)
        if (kids.some((kid) => kid?.number === number)) cls = { ...cls, joined: Math.max(0, cls.joined - 1) };
        kids = kids.filter((kid) => kid?.number !== number);
        render({ focus: `name-${number}` });
        say(headMsg, T.clearDoneText(number), 'ok');
      },
    });
  }

  // 서버에서 새로 받아 그린다. 그렸으면 true, 못 받았으면 false, 로그인이 풀렸거나 화면을 떠났거나 더 새 부름이 있으면 null.
  async function reload({ flash = '', focus = null } = {}) {
    const mine = ++loadSeq;
    const res = await send(`/v1/teacher/classes/${cls.id}/board`, { method: 'GET' });
    if (!res || disposed || mine !== loadSeq) return null;
    if (lost('board', res)) return null;
    if (!res.ok || !validBoard(res.data)) {
      say(headMsg, T.teacherMessage('board', res), 'bad');
      return false;
    }
    cls = res.data.class;
    kids = res.data.kids;
    fetchedAt = Date.now();
    changed(cls, owner);
    say(headMsg, '');
    report.forget(); // 받아 둔 아이 리포트는 다음에 열 때 새로
    render({ flash, focus });
    return true;
  }

  // flash는 고친 뒤 「…바꿨어요」 같은 된 일(대시보드 알림 줄, 없으면 그대로 둔다). enter면 쪽을 바꾼 것(뼈대와 차례로 나타남)
  function render({ flash = '', focus = null, enter = false } = {}) {
    const key = focus ?? document.activeElement?.dataset?.focus ?? null;
    rows = boardRows(cls, kids);
    attention = attentionList(rows, todayStr());
    if (!TABS.includes(tab)) tab = 'all';
    el.dataset.page = page;
    clearTimeout(enterTimer);
    el.classList.toggle('t-enter', enter);
    if (enter) enterTimer = setTimeout(() => el.classList.remove('t-enter'), ENTER_MS);
    headBox.replaceChildren(...headParts());
    body.replaceChildren(...pageParts());
    fitWatch?.disconnect();
    const attnList = body.querySelector('.t-attn-list');
    if (attnList) {
      fitWatch?.observe(attnList);
      fitAttention();
    }
    if (page === 'activity') {
      fitWatch?.observe(body);
      fitActivity();
      document.fonts?.ready?.then(() => fitActivity()); // 글꼴이 늦게 오면 칸 높이가 바뀐다
    }
    if (flash) say(headMsg, flash, 'ok');
    syncActions();
    focusOn(key);
    report.refresh({ focusKey: focus }); // 열린 리포트의 머리(꼬리표·앞뒤 번호). 자리를 비웠으면 닫고 초점은 그 줄로
  }

  // 다른 쪽으로(탭 · 뒤로 가기). 받아 둔 자료로 그 쪽만 그린다(다시 받지 않는다)
  function goPage(next) {
    const to = PAGES.includes(next) ? next : 'overview';
    if (to === page && !pendingFocus) return;
    page = to;
    const focus = pendingFocus;
    pendingFocus = null;
    render({ enter: true, focus });
  }

  render();
  return {
    el,
    goPage,
    showKid,
    dispose() {
      disposed = true;
      clearTimeout(enterTimer);
      fitWatch?.disconnect();
      closeSheet?.();
      report.dispose();
    },
  };
}
