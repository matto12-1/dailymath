// 아이 상세 리포트(모달, DECISIONS 2026-10-23 ★12가지). 대시보드(board.js)가 하나 만들어 두고 아이를 누르면 연다.
// 여는 곳은 board.js(아이별 표의 줄 · 살펴볼 아이 · 접속 순위 · 실수 쪽 번호 꼬리표, 키보드 Enter도). 안 들어온 번호는 열지 않는다.
// - 생김새(teacher.css t-report): 노트북·가로 태블릿은 화면 대부분을 덮는 큰 창(가장자리 여백), 태블릿 세로(810)·폰은 화면 가득.
// - 머리: 번호와 이름(이 기기에 적은 이름) · 살펴볼 까닭 꼬리표 · 진도 학년 · 최근 날짜 · 접속 날 수 · 점수 · 「← 4번 · 6번 →」
//   (들어온 아이끼리, ←·→ 키도. 탭에 초점이 있으면 ←·→는 탭을 옮긴다) · 닫기.
// - 탭 넷(요약 · 진도 · 실수 · 기록)은 role=tablist. 노트북·가로 태블릿에서는 탭마다 창 안에서 내리지 않는다(폰은 내려 본다).
//   요약: ① 지금 하는 곳 ⑫ 공부한 양 ④ 맞힌 비율(주마다) ⑤ 갈래별(반 평균과) ⑦ 자주 하는 실수 셋 ⑯ 지도 제안과
//   [그림 다시 정하기]·[자리 비우기] ⑭ 최근 활동(칸에 들어가는 줄만)
//   진도: ② 학년 단원 지도 ③ 성취기준 도달 · 실수: ⑦ 열 개 ⑧ 막힌 단계 ⑨ 흔들리는 기초 · 기록: ④ 정답률 추이 ⑪ 학습 달력 ⑭ 최근 활동
//   기록이 아주 적은 아이는 칸마다 「아직 기록이 적어요」(빈 그림을 그리지 않는다). 비율·진도는 단계 색, 달력은 살구색 짙기.
// - 창: role=dialog · aria-modal · 제목으로 이름. 열린 동안 뒤는 inert이고 쪽은 굴러가지 않는다. Esc · 바깥 · [닫기]로 닫고,
//   초점은 연 곳으로 돌아간다. Tab은 창 안에서만 돈다. 창 안에서 연 확인 시트(sheet.js)가 열린 동안 창은 inert라 Esc는 시트만 닫는다.
// - 주소(&kid=7&tab=…)는 board.js가 바꾼다(url): 탭과 앞뒤 아이는 바꿔 쓰고, 닫으면 연 그 자리로 돌아간다(뒤로 가기도 닫는다).
// - 자료: 열 때 그 아이 것만 받는다(뼈대를 보이며). 받은 자료는 대시보드가 다시 받을 때까지 번호마다 둔다(앞뒤로 넘겨도 다시 받지 않는다).
//   인터넷 끊김·서버 오류·없는 번호는 창 안에 글과 [다시], 401은 로그인으로(session.js), 403은 대시보드처럼 떠난다(lost).
// - 글은 모두 h()로 글로만 넣는다(실수 이름은 아이 기기에서 온 글이다). 그림은 createElementNS(글은 append). 계산은 src/game/kid-report.js.
// - 그래프는 칸 크기(px)를 재서 그 크기 그대로 그린다(plot): 창 크기에 따라 글자·선이 커지거나 흐려지지 않는다.
import { h } from '../ui.js?v=9a67f36b25';
import { classStrands, attentionOf } from '../../src/game/board.js?v=9a67f36b25';
import { todayStr } from '../../src/game/date.js?v=9a67f36b25';
import { rateLevel, attentionLevel } from '../../src/game/rate-level.js?v=9a67f36b25';
import { REPORT_TABS, REPORT_TAB_NAMES } from './pages.js?v=9a67f36b25';
import { classActions } from './access.js?v=9a67f36b25';
import * as T from './text.js?v=9a67f36b25';

const SVG = 'http://www.w3.org/2000/svg';
const FEW = '아직 기록이 적어요';
const STUCK_SHOWN = 4; // ⑧ 막힌 단계는 넷까지(아직 막힌 곳이 먼저)
const RECENT_SHOWN = 7; // ⑭ 최근 판(창 높이에 맞춰 넘치는 줄은 숨긴다, fitRecent)
const RECENT_PHONE = 5; // 요약의 ⑭는 폰에서 다섯 줄까지(창 안을 내려 보므로 칸에 맞추지 않는다)
const RECENT_SPREAD_MAX = 12; // ⑭ 줄 한쪽에 더하는 여백 끝(fitRecent): 숨기고 남은 높이를 줄 사이가 나눠 갖는다(칸 아래 빈 띠가 한 줄을 넘지 않게)
const CALC = () => import('../../src/game/kid-report.js?v=9a67f36b25');

// 그림 요소(글은 append → 글로만 들어간다)
function svg(tag, attrs = {}, ...kids) {
  const node = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined && v !== false) node.setAttribute(k, String(v));
  for (const kid of kids.flat(Infinity)) if (kid !== null && kid !== undefined && kid !== false && kid !== '') node.append(kid);
  return node;
}
const none = (text = FEW) => h('p', { class: 't-none t-rp-few' }, text);
const pct = (rate) => T.rateText(rate) ?? '없음';
const num = (n) => Number(n).toLocaleString('ko-KR');
const shortDay = (day) => `${Number(day.slice(5, 7))}/${Number(day.slice(8, 10))}`;
const card = (key, title, ...kids) => h('section', { class: `t-rp-card t-rp-${key}`, 'aria-labelledby': `t-rp-${key}-title` },
  h('h3', { class: 't-rp-title', id: `t-rp-${key}-title` }, title), ...kids);
const tag = (kind, text) => h('span', { class: `t-rp-tag ${kind}` }, text);
const rateKey = () => h('span', { class: 't-rp-color-key' },
  [['good', '75% 이상'], ['warn', '50~74%'], ['bad', '50% 아래']].map(([level, text]) =>
    h('span', { class: 't-colors-key', 'data-level': level }, text)));

// board() = { cls, rows, kids, names }(대시보드가 지금 가진 것), load(번호) = 그 아이 리포트 부름(send, 401이면 null),
// url(번호 | null, 탭, how) = 주소 바꾸기(how: 'replace' · 'back' 연 자리로), actions = { reset(번호), clear(번호) } 확인 시트,
// lost(kind, 답) = 떠나야 하는 답이면 떠나고 true, focusBack(열쇠) = 대시보드에서 그 data-focus로 초점.
export function reportModal({ board, load, url, actions, lost, focusBack }) {
  let number = null; // 열린 아이(닫혔으면 null)
  let tab = 'summary';
  let pushed = false; // 열 때 주소를 쌓았다(닫으면 뒤로 가서 그 자리로)
  let openerKey = null; // 닫으면 초점을 돌릴 대시보드 data-focus
  let calc = null; // kid-report.js(처음 열 때 받는다)
  let restore = []; // 연 동안 inert로 둔 뒤 요소들 [요소, 그 전 inert]
  const watches = []; // 그래프 칸 크기 지켜보기(plot). 다시 그리거나 닫으면 끊는다
  const cache = new Map(); // 번호 → { state: 'loading' | 'ok' | 'error', kid, message, res }

  const title = h('h2', { class: 't-rp-name', id: 't-report-title', tabindex: '-1' });
  const status = h('div', { class: 't-rp-status' });
  const facts = h('dl', { class: 't-rp-facts' });
  const prev = h('button', { type: 'button', class: 't-rp-step t-rp-prev' });
  const next = h('button', { type: 'button', class: 't-rp-step t-rp-next' });
  const close = h('button', { type: 'button', class: 't-rp-close', 'aria-label': '리포트 닫기', title: '닫기 (Esc)' });
  const tabs = h('div', { class: 't-rp-tabs', role: 'tablist', 'aria-label': '리포트 탭' });
  const panel = h('div', { class: 't-rp-body', role: 'tabpanel', id: 't-report-panel', tabindex: '0' });
  const dialog = h('div', { class: 't-report', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': title.id },
    h('header', { class: 't-rp-head' },
      h('div', { class: 't-rp-who' }, title, status),
      facts,
      h('nav', { class: 't-rp-nav', 'aria-label': '다른 아이' }, prev, next),
      close),
    tabs,
    panel);
  const backdrop = h('div', { class: 't-report-backdrop', hidden: true }, dialog);
  const tabButtons = new Map(REPORT_TABS.map((key) => {
    const button = h('button', {
      type: 'button', role: 'tab', class: 't-rp-tab', id: `t-rp-tab-${key}`, 'aria-controls': panel.id, 'data-tab': key,
    }, REPORT_TAB_NAMES[key]);
    button.addEventListener('click', () => pickTab(key));
    tabs.append(button);
    return [key, button];
  }));

  const joined = () => board().rows.filter((r) => r.joined).map((r) => r.number).sort((a, b) => a - b);
  const rowOf = (n) => board().rows.find((r) => r.number === n && r.joined) ?? null;
  const rawOf = (n) => board().kids.find((k) => k?.number === n) ?? null;
  const isOpen = () => number !== null;

  // ── 열고 닫기 ──

  // 열거나(닫혀 있으면) 다른 아이·탭으로. 안 들어온 번호면 false. pushed = 주소를 쌓으며 열었다(링크·앞으로 가기)
  function show(n, nextTab = 'summary', { pushed: wasPushed = false, opener = null } = {}) {
    if (!rowOf(n)) return false;
    const opening = !isOpen();
    number = n;
    tab = REPORT_TABS.includes(nextTab) ? nextTab : 'summary';
    if (opening) {
      pushed = wasPushed;
      openerKey = opener;
      mount();
    }
    render();
    fetchKid(n);
    if (opening) title.focus({ preventScroll: true });
    return true;
  }

  function mount() {
    document.body.append(backdrop);
    restore = [...document.body.children].filter((node) => node !== backdrop).map((node) => [node, node.inert]);
    for (const [node] of restore) node.inert = true;
    document.documentElement.classList.add('t-report-open');
    backdrop.hidden = false;
    addEventListener('resize', onResize);
  }

  // 닫기. fromUrl = 주소가 먼저 바뀌었다(뒤로 가기): 주소는 그대로 둔다. focusKey = 연 곳 대신 초점을 둘 곳(자리를 비운 뒤 그 줄 이름 칸)
  function hide({ fromUrl = false, focusKey = null } = {}) {
    if (!isOpen()) return;
    number = null;
    unwatch();
    backdrop.hidden = true;
    backdrop.remove();
    for (const [node, inert] of restore) node.inert = inert;
    restore = [];
    document.documentElement.classList.remove('t-report-open');
    removeEventListener('resize', onResize);
    cancelAnimationFrame(fitFrame);
    if (!fromUrl) url(null, null, pushed ? 'back' : 'replace');
    pushed = false;
    focusBack(focusKey ?? openerKey);
    openerKey = null;
  }

  function goKid(n) {
    if (n === null || n === number) return;
    number = n;
    url(n, tab, 'replace');
    render();
    fetchKid(n);
  }

  function pickTab(key, { focus = false } = {}) {
    if (!REPORT_TABS.includes(key)) return;
    tab = key;
    url(number, tab, 'replace');
    render();
    if (focus) tabButtons.get(key).focus();
  }

  // ── 키보드 · 바깥 누르기 ──

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) hide();
  });
  close.addEventListener('click', () => hide());
  prev.addEventListener('click', () => goKid(neighbor(-1)));
  next.addEventListener('click', () => goKid(neighbor(1)));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      hide();
      return;
    }
    if (event.key === 'Tab') {
      trapTab(event);
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const onTab = event.target.getAttribute?.('role') === 'tab';
    if (onTab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const at = REPORT_TABS.indexOf(tab);
      const to = { ArrowLeft: at - 1, ArrowRight: at + 1, Home: 0, End: REPORT_TABS.length - 1 }[event.key];
      pickTab(REPORT_TABS[(to + REPORT_TABS.length) % REPORT_TABS.length], { focus: true });
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const to = neighbor(event.key === 'ArrowLeft' ? -1 : 1);
      if (to === null) return;
      event.preventDefault();
      goKid(to);
    }
  });
  // Tab은 창 안에서만: 마지막 다음은 처음, 처음(또는 처음 초점을 받는 제목) 앞은 마지막
  function trapTab(event) {
    const targets = [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')]
      .filter((node) => !node.disabled && node.getClientRects().length);
    const first = targets[0];
    const last = targets.at(-1);
    if (!first) return;
    const at = document.activeElement;
    if (event.shiftKey && (at === first || at === title || !dialog.contains(at))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (at === last || !dialog.contains(at))) {
      event.preventDefault();
      first.focus();
    }
  }

  // 앞(-1)·뒤(1) 들어온 번호(끝이면 null)
  function neighbor(step) {
    const list = joined();
    const at = list.indexOf(number);
    if (at < 0) return list[0] ?? null;
    return list[at + step] ?? null;
  }

  // ── 자료 ──

  async function fetchKid(n, { again = false } = {}) {
    const have = cache.get(n);
    if (have && (have.state === 'ok' || have.state === 'loading') && !again) return;
    cache.set(n, { state: 'loading' });
    if (n === number) render();
    const [res, module] = await Promise.all([load(n), calc ? Promise.resolve(calc) : CALC().catch(() => null)]);
    if (module) calc = module;
    if (!res) {
      cache.delete(n); // 로그인이 풀렸다(session.js가 로그인 칸으로)
      return;
    }
    if (!res.ok || !calc) {
      if (res.status === 403 && lost('report', res)) return;
      cache.set(n, { state: 'error', message: res.ok ? T.INTERNET : T.teacherMessage('report', res) }); // 계산 모듈을 못 받았으면 인터넷 탓
    } else {
      cache.set(n, { state: 'ok', kid: calc.readKidReport(res.data) });
    }
    if (n === number) render();
  }

  // ── 그리기 ──

  function render() {
    if (!isOpen()) return;
    const row = rowOf(number);
    if (!row) {
      hide();
      return;
    }
    const { names } = board();
    const today = todayStr();
    // replaceChildren은 null도 글(「null」)로 넣으므로 없는 것은 빼고 넘긴다
    title.replaceChildren(...[h('span', { class: 't-rp-num' }, `${number}번`), names[number] ? h('span', { class: 't-rp-kid' }, names[number]) : null].filter(Boolean));
    const why = attentionOf(row, today);
    status.replaceChildren(...(why ? [h('span', { class: 't-rp-why', 'data-reason': why.reason, 'data-level': attentionLevel(why.reason), title: `살펴볼 아이: ${T.attentionText(why)}` }, T.attentionText(why))] : []));
    const entry = cache.get(number);
    const study = entry?.kid?.study ?? (Number.isSafeInteger(rawOf(number)?.report?.study) ? rawOf(number).report.study : null);
    const day = T.dayText(row.lastDay);
    const fact = (label, value) => h('div', {}, h('dt', {}, label), h('dd', {}, value));
    facts.replaceChildren(
      fact('진도', study ? `${study}학년` : '아직 없어요'),
      fact('최근', day ?? '아직 없어요'),
      fact('접속', `${row.visitDays}일 (${row.visitCount}번)`),
      fact('점수', `${num(row.score)}점`));
    const before = neighbor(-1);
    const after = neighbor(1);
    prev.disabled = before === null;
    next.disabled = after === null;
    prev.replaceChildren(h('span', { 'aria-hidden': 'true' }, '← '), before === null ? '처음' : `${before}번`);
    next.replaceChildren(after === null ? '마지막' : `${after}번`, h('span', { 'aria-hidden': 'true' }, ' →'));
    prev.setAttribute('aria-label', before === null ? '앞 번호 없음' : `앞 번호 ${before}번 리포트`);
    next.setAttribute('aria-label', after === null ? '뒤 번호 없음' : `뒤 번호 ${after}번 리포트`);
    for (const [key, button] of tabButtons) {
      const on = key === tab;
      button.setAttribute('aria-selected', String(on));
      button.tabIndex = on ? 0 : -1;
    }
    panel.setAttribute('aria-labelledby', tabButtons.get(tab).id);
    panel.dataset.tab = tab;
    dialog.dataset.tab = tab;
    unwatch();
    if (!entry || entry.state === 'loading') {
      panel.setAttribute('aria-busy', 'true');
      panel.replaceChildren(skeleton());
      return;
    }
    panel.removeAttribute('aria-busy');
    if (entry.state === 'error') {
      const again = h('button', { type: 'button', class: 'primary' }, '다시');
      again.addEventListener('click', () => fetchKid(number, { again: true }));
      panel.replaceChildren(h('div', { class: 't-rp-problem' }, h('p', { class: 't-alert', role: 'alert' }, entry.message), again));
      return;
    }
    const kid = entry.kid;
    const parts = { summary: summaryTab, progress: progressTab, mistakes: mistakesTab, record: recordTab }[tab](kid, row, today);
    panel.replaceChildren(parts);
    if (tab === 'record' || tab === 'summary') fitRecent();
    if (tab === 'progress') markScroll();
  }

  // 받는 동안 회색 뼈대(탭 칸 짜임 그대로)
  function skeleton() {
    return h('div', { class: 't-rp-bones', 'aria-hidden': 'true' },
      [0, 1, 2, 3].map((i) => h('div', { class: `t-rp-card t-rp-bone b${i}` }, h('span', { class: 't-rp-bone-line' }), h('span', { class: 't-rp-bone-line short' }))));
  }

  // ── 요약 ──

  function summaryTab(kid, row, today) {
    const amount = calc.amountOf(kid);
    const map = calc.unitMap(kid, row.here);
    const mastered = map.filter((u) => u.status === 'mastered').length;
    const here = card('here', '지금 하는 곳',
      row.here
        ? [h('p', { class: 't-rp-big', title: row.here.unitName }, row.here.unitName),
          h('p', { class: 't-rp-sub' }, row.here.step ? `${row.here.step}단계 ${row.here.stepName}`.trim() : row.here.stepName || '단계 정보 없음')]
        : none(),
      h('p', { class: 't-rp-note' }, kid.study ? `${kid.study}학년 단원 ${map.length}개 중 ${mastered}개 익힘` : ''));
    const w = calc.weekCounts(kid, today);
    const stat = (label, value, note) => h('div', { class: 't-rp-stat' },
      h('dt', {}, label), h('dd', {}, h('span', { class: 't-rp-stat-num' }, value), note ? h('span', { class: 't-rp-stat-note' }, note) : null));
    const week = card('week', '공부한 양',
      h('dl', { class: 't-rp-stats' },
        stat('이번 주', `${num(w.thisWeek)}문제`, `${w.thisWeekDays}일`),
        stat('지난 주', `${num(w.lastWeek)}문제`, `${w.lastWeekDays}일`),
        stat('연속으로 공부한 날', `${w.streak}일`, w.today ? '오늘도 했어요' : null)));
    const guide = card('guide', '지도 제안', guideLines(kid, row, today, amount), seatActions());
    const mistakes = calc.topMistakes(kid, 3);
    const top3 = card('top3', '자주 하는 실수',
      mistakes.length ? mistakeList(mistakes, mistakes[0].count) : none(amount.sparse ? FEW : '자주 하는 실수가 없어요'),
      mistakes.length ? h('button', { type: 'button', class: 't-rp-more', onclick: () => pickTab('mistakes', { focus: true }) }, '실수 모두 보기') : null);
    const acc = accuracyCard(kid, today);
    const recent = recentCard(kid, { more: true });
    // 가운데 줄: 공부한 양 → 맞힌 비율(남는 높이) → 자주 하는 실수. 오른쪽 줄(.t-rp-side): 지도 제안(글 높이만) → 최근 활동(남는 높이).
    // 태블릿 세로 · 폰은 오른쪽 묶음이 없는 것처럼(display: contents) 칸마다 자리를 잡는다. 폰은 지금 곳 → 공부한 양 → 맞힌 비율 →
    // 갈래별 → 실수 → 최근 활동 → 지도 제안(teacher.css가 지도 제안을 맨 뒤로)
    const side = h('div', { class: 't-rp-side', 'data-few': recent.dataset.few ? 'true' : null }, guide, recent);
    return h('div', { class: 't-rp-grid t-rp-summary', 'data-acc': acc.dataset.few ? 'few' : null }, here, week, acc, strandsCard(kid), top3, side);
  }

  // ⑭ 최근 활동(기록 탭 · 요약 오른쪽 아래): 판마다 날짜 · 판 종류 · 몇 문제 중 몇 개, 단계 넘김 · 단원 익힘 꼬리표.
  // 노트북·태블릿은 칸에 통째로 들어가는 줄만 최신부터 보인다(fitRecent). 판이 없으면 「아직 기록이 적어요」 한 줄만(작은 칸, data-few).
  // more(요약): 아래에 [기록 모두 보기] → 기록 탭
  function recentCard(kid, { more = false } = {}) {
    const recent = calc.recentActivity(kid, RECENT_SHOWN);
    const activity = card('recent', '최근 활동',
      recent.length ? h('ol', { class: 't-rp-recent-list' }, recent.map((r) => h('li', {},
        h('time', { class: 't-rp-day', datetime: r.date }, T.dayText(r.date)),
        h('span', { class: 't-rp-kind' }, r.label),
        h('span', { class: 't-rp-score' }, `${r.count}문제 중 ${r.correct}개`),
        r.events.length ? h('span', { class: 't-rp-events' }, r.events.map((e) => (e.type === 'mastered'
          ? tag('done', `${e.title} 익힘`)
          : tag('doing', `${e.title} ${e.level}단계 넘음`)))) : null))) : none(),
      more && recent.length ? h('button', { type: 'button', class: 't-rp-more', onclick: () => pickTab('record', { focus: true }) }, '기록 모두 보기') : null);
    if (!recent.length) activity.dataset.few = 'true';
    return activity;
  }

  // ④ 요약의 맞힌 비율: 이번 주·지난 주 비율 한 줄과 주마다 최근 8주 작은 막대(이번 주 테두리, 점선은 단계를 넘는 75%).
  // 기록 탭 「맞힌 비율」의 주마다 그림과 같은 자료(accuracyTrend). 판이 적으면 「아직 기록이 적어요」만 두고 작은 칸(data-few)
  function accuracyCard(kid, today) {
    const { weeks, enough } = calc.accuracyTrend(kid, today);
    if (!enough || weeks.filter((w) => w.rate !== null).length < 2) {
      const few = card('acc', '맞힌 비율', none());
      few.dataset.few = 'true';
      return few;
    }
    const [last, now] = weeks.slice(-2);
    const said = (label, w) => h('span', {}, `${label} `, h('b', {}, w.rate === null ? '안 풀었어요' : pct(w.rate)));
    // 제목 줄 오른쪽에 이번 주·지난 주(칸 높이를 그림에 남긴다). 점선 뜻은 그림 왼쪽 75% 글이 말한다
    return h('section', { class: 't-rp-card t-rp-acc', 'aria-labelledby': 't-rp-acc-title' },
      h('div', { class: 't-rp-acc-head' },
        h('h3', { class: 't-rp-title', id: 't-rp-acc-title' }, '맞힌 비율'),
        h('p', { class: 't-rp-acc-nums' }, said('이번 주', now), ' · ', said('지난 주', last))),
      weeksChart(weeks, { now: true }));
  }

  function guideLines(kid, row, today, amount) {
    if (amount.sparse && !row.lastDay) return none();
    const lines = calc.guidance(kid, { lastDay: row.lastDay, today });
    if (!lines.length) return h('p', { class: 't-rp-guide-none' }, amount.sparse ? `${FEW}. 몇 판 더 풀면 짚을 곳이 보여요.` : '지금은 따로 짚을 곳이 없어요.');
    return h('ul', { class: 't-rp-guide-list' }, lines.map((line) => h('li', { 'data-kind': line.kind }, line.text)));
  }

  // [그림 다시 정하기]·[자리 비우기]: 대시보드 [관리]와 같은 확인 시트(창 위에 뜬다)
  function seatActions() {
    if (!classActions(board()).includes('reset')) return null;
    const n = number;
    const button = (key, label, run) => {
      const b = h('button', { type: 'button', class: `t-rp-seat ${key}` }, label);
      b.addEventListener('click', () => run(n));
      return b;
    };
    return h('div', { class: 't-rp-seat-box' },
      h('p', { class: 't-rp-seat-label' }, T.seatTitle(n)),
      h('div', { class: 't-rp-seat-actions' }, button('reset', '그림 다시 정하기', actions.reset), button('clear', '번호 비우기', actions.clear)));
  }

  // ⑤ 갈래마다 이 아이(단계 색 막대)와 반 평균(세로 눈금).
  function strandsCard(kid) {
    const { rows, lowest, enough } = calc.strandCompare(kid, classStrands(board().kids));
    const item = (s) => {
      const bar = h('span', { class: 't-rp-hbar', 'aria-hidden': 'true' }, h('span', { class: 't-rp-hfill' }));
      bar.style.setProperty('--rate', String(s.rate ?? 0));
      if (s.classRate !== null) {
        const mark = h('span', { class: 't-rp-avg' });
        mark.style.setProperty('--at', String(s.classRate));
        bar.append(mark);
      }
      const said = s.rate === null ? '아직 안 풀었어요' : `${pct(s.rate)} (${s.correct}/${s.total})`;
      return h('li', { 'data-strand': s.id, 'data-level': rateLevel(s.rate), 'data-rate': s.rate, 'data-empty': s.rate === null ? 'true' : null, 'data-low': s.id === lowest ? 'true' : null },
        h('span', { class: 't-rp-strand' }, s.name, s.id === lowest ? h('span', { class: 's-sr' }, ' (짚을 갈래)') : null),
        bar,
        h('span', { class: 't-rp-rate' }, said),
        h('span', { class: 't-rp-class' }, s.classRate === null ? '반 없음' : `반 ${pct(s.classRate)}`));
    };
    return card('strands', '갈래별 맞힌 비율',
      h('p', { class: 't-rp-hint' }, h('span', { class: 't-rp-key-avg', 'aria-hidden': 'true' }), '세로 줄은 반 평균, 갈래마다 최근 10문제', rateKey()),
      enough ? h('ul', { class: 't-rp-strand-list' }, rows.map(item)) : none());
  }

  // 실수 목록(이름 · 횟수 · 막대). 이름은 글로만. detail이면 이름 옆에 그 단원과, 앞 학년 단원에 기대는 실수면 그 단원
  function mistakeList(list, most, { detail = false } = {}) {
    return h('ol', { class: 't-rp-mistake-list' }, list.map((m) => {
      const bar = h('span', { class: 't-rp-line', 'aria-hidden': 'true' }, h('span', { class: 't-rp-line-fill' }));
      bar.style.setProperty('--share', String(m.count / Math.max(1, most)));
      const from = detail ? [m.title, m.back ? `${m.backGrade}학년 「${m.backTitle}」${calc.andOf(m.backTitle)} 이어짐` : null].filter(Boolean).join(' · ') : '';
      return h('li', { 'data-back': m.back ? 'true' : null },
        h('span', { class: 't-rp-mistake', title: m.name }, m.name),
        from ? h('span', { class: 't-rp-from', title: from }, from) : h('span', { class: 't-rp-from' }),
        h('span', { class: 't-rp-count' }, `${m.count}번`), bar);
    }));
  }

  // ── 진도 ──

  function progressTab(kid, row) {
    const map = calc.unitMap(kid, row.here);
    const reach = calc.standardsReach(kid, row.here);
    const count = (list, key) => list.filter((x) => x.status === key).length;
    const unitItem = (u) => {
      const bar = h('span', { class: 't-rp-steps', 'aria-hidden': 'true' }, h('span', { class: 't-rp-steps-fill' }));
      bar.style.setProperty('--share', String(u.total ? u.passed / u.total : 0));
      const state = u.status === 'mastered'
        ? tag('done', `익힘 ${T.dayText(u.mastered) ?? ''}`.trim())
        : u.status === 'doing' ? tag('doing', `하는 중 ${u.passed}/${u.total}단계`) : tag('todo', '아직');
      return h('li', { 'data-status': u.status, 'data-current': u.current ? 'true' : null },
        h('span', { class: 't-rp-unit', title: u.title }, u.title, u.current ? h('span', { class: 't-rp-now' }, '지금') : null),
        bar, state);
    };
    const semester = (s) => {
      const list = map.filter((u) => u.semester === s);
      return list.length ? h('div', { class: 't-rp-sem' }, h('h4', {}, `${s}학기`), h('ol', { class: 't-rp-unit-list' }, list.map(unitItem))) : null;
    };
    const units = card('units', kid.study ? `${kid.study}학년 단원 지도` : '단원 지도',
      h('p', { class: 't-rp-hint' }, `익힌 단원 ${count(map, 'mastered')}개 · 하는 중 ${count(map, 'doing')}개 · 아직 ${count(map, 'todo')}개`),
      map.length ? h('div', { class: 't-rp-sems' }, semester(1), semester(2)) : none());
    const domains = [...new Set(reach.map((s) => s.domain))];
    const label = { reached: '도달', doing: '하는 중', todo: '아직' };
    // 성취기준 글은 줄여 자르지 않고 끝까지(한 단, 영역마다 묶음). 노트북·태블릿에서 칸에 다 안 들어가면 이 목록만 칸 안에서 내린다(markScroll)
    const standards = card('standards', '성취기준 도달',
      h('p', { class: 't-rp-hint' }, `도달 ${count(reach, 'reached')} · 하는 중 ${count(reach, 'doing')} · 아직 ${count(reach, 'todo')}. 이어진 단원을 다 익히면 도달, 하나라도 하고 있으면 하는 중이에요. 이 사이트 기록이라 학교 평가가 아니에요.`),
      reach.length ? h('div', { class: 't-rp-std-groups', role: 'region', 'aria-label': '성취기준 목록' }, domains.map((domain) => h('div', { class: 't-rp-std-group' },
        h('h4', {}, domain),
        h('ul', { class: 't-rp-std-list' }, reach.filter((s) => s.domain === domain).map((s) => h('li', { 'data-status': s.status },
          tag(s.status, label[s.status]),
          h('span', { class: 't-rp-code' }, s.code.replace(/[[\]]/g, '')),
          h('span', { class: 't-rp-std' }, s.text))))))) : none());
    return h('div', { class: 't-rp-grid t-rp-progress' }, units, standards);
  }

  // ── 실수 ──

  function mistakesTab(kid) {
    const amount = calc.amountOf(kid);
    const top = calc.topMistakes(kid);
    const mistakes = card('mistakes10', '자주 하는 실수',
      h('p', { class: 't-rp-hint' }, `많이 한 차례로 열 개까지 · 옆 작은 글씨는 실수가 난 단원 · 복습으로 다시 풀 실수 ${kid.reviews}개`),
      top.length ? mistakeList(top, top[0].count, { detail: true }) : none(amount.sparse ? FEW : '자주 하는 실수가 없어요'));
    const stuck = calc.stuckSteps(kid).slice(0, STUCK_SHOWN);
    const stuckCard = card('stuck', '막힌 단계',
      h('p', { class: 't-rp-hint' }, '같은 단계를 두 번 이상 못 넘긴 곳(최근 판 기록)'),
      stuck.length
        ? h('ul', { class: 't-rp-stuck-list' }, stuck.map((s, i) => h('li', { 'data-now': s.passedNow ? 'passed' : 'stuck', 'data-first': i === 0 && !s.passedNow ? 'true' : null },
          h('span', { class: 't-rp-stuck-name' }, `${s.title} ${s.level}단계`, h('small', {}, s.stepName)),
          h('span', { class: 't-rp-stuck-meta' }, `${s.fails}번 못 넘음 · 처음 ${T.dayText(s.first)}`),
          s.passedNow ? tag('done', '지금은 넘었어요') : tag('stuck', '아직 막혔어요'))))
        : none(kid.rounds.length < 3 ? FEW : '막힌 단계가 없어요'));
    const shaky = calc.shakyBasics(kid);
    const shakyCard = card('shaky', '흔들리는 기초',
      h('p', { class: 't-rp-hint' }, '실수와 이어진 앞 학년 단원, 많은 차례로 셋까지'),
      shaky.length
        ? h('ul', { class: 't-rp-shaky-list' }, shaky.map((b) => h('li', {},
          h('span', { class: 't-rp-shaky-name' }, `${b.grade}학년 ${b.title}`),
          h('span', { class: 't-rp-stuck-meta' }, `이어진 실수 ${b.count}번`),
          b.mastered ? tag('done', `익힘 ${T.dayText(b.mastered) ?? ''}`.trim()) : tag('todo', '아직 안 익혔어요'))))
        : none(amount.sparse ? FEW : '앞 학년에서 이어진 실수가 없어요'));
    return h('div', { class: 't-rp-grid t-rp-mistakes' }, mistakes, h('div', { class: 't-rp-col' }, stuckCard, shakyCard));
  }

  // ── 기록 ──

  function recordTab(kid, row, today) {
    const trend = calc.accuracyTrend(kid, today);
    const weeks = trend.weeks.filter((w) => w.rate !== null).length;
    const trendCard = card('trend', '맞힌 비율',
      h('p', { class: 't-rp-hint' }, '점선은 단계를 넘는 기준(75%)', rateKey()),
      h('div', { class: 't-rp-charts' },
        h('figure', { class: 't-rp-chart' }, h('figcaption', {}, `최근 ${trend.rounds.length}판`), trend.enough ? roundsChart(trend.rounds) : none()),
        h('figure', { class: 't-rp-chart' }, h('figcaption', {}, '주마다(최근 8주)'), weeks >= 2 ? weeksChart(trend.weeks) : none())));
    const cal = calc.studyCalendar(kid, today);
    const calendar = card('calendar', '학습 달력',
      h('p', { class: 't-rp-hint' }, `최근 ${cal.weeks.length}주 동안 ${cal.active}일, ${num(cal.total)}문제`),
      cal.active && !calc.amountOf(kid).sparse ? calendarGrid(cal) : none()); // 기록이 아주 적으면 빈 달력 대신 글
    return h('div', { class: 't-rp-grid t-rp-record' }, trendCard, calendar, recentCard(kid));
  }

  // 그래프 칸: 칸 크기(px)를 재서 그 크기 그대로 그린다(글자 11px · 선 굵기가 창 크기에 따라 늘거나 줄지 않게).
  // 칸 크기가 바뀌면 다시 그린다. 그림(svg)은 칸 위에 겹쳐 놓여(teacher.css .t-rp-plot) 칸 크기를 바꾸지 않는다
  function plot(label, draw) {
    const box = h('div', { class: 't-rp-plot', role: 'img', 'aria-label': label });
    let drawn = '';
    const watch = new ResizeObserver(() => {
      const w = Math.floor(box.clientWidth);
      const ht = Math.floor(box.clientHeight);
      if (w < 80 || ht < 60 || `${w}x${ht}` === drawn) return;
      drawn = `${w}x${ht}`;
      box.replaceChildren(svg('svg', { class: 't-rp-svg', width: w, height: ht, viewBox: `0 0 ${w} ${ht}`, 'aria-hidden': 'true' }, draw(w, ht)));
    });
    watch.observe(box);
    watches.push(watch);
    return box;
  }
  function unwatch() {
    for (const watch of watches.splice(0)) watch.disconnect();
  }

  // 옅은 가로 눈금과 왼쪽 % 글(0 · 50 · 100%, 낮은 그림은 50%를 뺀다), 단계를 넘는 기준 75%는 점선
  function yGrid(W, pad, y, levels = [0, 0.5, 1]) {
    const mark = (at, kind) => svg('g', { class: kind },
      svg('line', { x1: pad.l, x2: W - pad.r, y1: y(at), y2: y(at) }),
      svg('text', { x: pad.l - 8, y: y(at) + 4, 'text-anchor': 'end' }, `${Math.round(at * 100)}%`));
    return [...levels.map((at) => mark(at, 'grid')), mark(0.75, 'pass')];
  }

  // 위 두 모서리만 둥근 막대(바닥은 기준선에 붙는다)
  function barPath(x, y, w, ht, r) {
    const k = Math.min(r, w / 2, ht);
    return `M${x} ${y + ht}V${y + k}Q${x} ${y} ${x + k} ${y}H${x + w - k}Q${x + w} ${y} ${x + w} ${y + k}V${y + ht}Z`;
  }

  // 판마다(오래된 것 → 최근): 가는 선 하나, 마지막 판에만 점과 % 글. 판마다 올리면 그 판 풀이(title)
  function roundsChart(rounds) {
    const mean = rounds.reduce((s, r) => s + r.rate, 0) / rounds.length;
    const label = `최근 ${rounds.length}판 맞힌 비율: 처음 ${pct(rounds[0].rate)}, 마지막 ${pct(rounds.at(-1).rate)}, 평균 ${pct(mean)}`;
    return plot(label, (W, H) => {
      const pad = { l: 40, r: 44, t: 10, b: 10 };
      const x = (i) => pad.l + (rounds.length < 2 ? (W - pad.l - pad.r) / 2 : (i * (W - pad.l - pad.r)) / (rounds.length - 1));
      const y = (rate) => Math.round(pad.t + (1 - rate) * (H - pad.t - pad.b)) + 0.5;
      const at = rounds.length - 1;
      return [
        yGrid(W, pad, y),
        svg('path', { class: 'trend', d: rounds.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(r.rate)}`).join(' ') }),
        svg('circle', { class: 'dot', cx: x(at).toFixed(1), cy: y(rounds[at].rate), r: 4 }),
        svg('text', { class: 'val', x: (x(at) + 10).toFixed(1), y: y(rounds[at].rate) + 4 }, pct(rounds[at].rate)),
        rounds.map((r, i) => svg('circle', { class: 'hit', cx: x(i).toFixed(1), cy: y(r.rate), r: 8 },
          svg('title', {}, `${T.dayText(r.date) ?? r.date} · ${r.count}문제 중 ${r.correct}개 (${pct(r.rate)})`))),
      ];
    });
  }

  // 주마다(최근 8주): 단계 색과 % 글(판이 없는 주는 비운다), 이번 주만 테두리, 아래에 그 주 월요일.
  // now(요약 칸): 아래 글은 첫 주 날짜와 「이번 주」만. 왼쪽 눈금과 막대 글은 가로로 떨어져 겹치지 않는다.
  function weeksChart(weeks, { now = false } = {}) {
    const said = weeks.filter((w) => w.rate !== null).map((w) => `${shortDay(w.from)} 주 ${pct(w.rate)}`).join(', ');
    const end = weeks.length - 1;
    const dayLabel = (w, i) => (!now ? shortDay(w.from) : i === 0 ? shortDay(w.from) : i === end ? '이번 주' : null);
    return plot(`주마다 맞힌 비율: ${said}`, (W, H) => {
      const pad = { l: 40, r: 12, t: 16, b: 24 };
      const slot = (W - pad.l - pad.r) / weeks.length;
      const wide = Math.round(Math.max(8, Math.min(20, slot * 0.36)));
      const y = (rate) => Math.round(pad.t + (1 - rate) * (H - pad.t - pad.b)) + 0.5;
      const base = y(0) - 0.5;
      return [
        yGrid(W, pad, y, now && H < 140 ? [0, 1] : undefined),
        weeks.map((w, i) => {
          const cx = Math.round(pad.l + slot * (i + 0.5));
          const top = Math.min(base - 1, y(w.rate ?? 0) - 0.5);
          return svg('g', { class: 'week', 'data-level': rateLevel(w.rate), 'data-rate': w.rate, 'data-current': i === end ? 'true' : null },
            w.rate === null ? null : svg('path', { class: 'bar', d: barPath(cx - wide / 2, top, wide, base - top, 4) },
              svg('title', {}, `${shortDay(w.from)} 주: ${w.count}문제 중 ${w.correct}개 (${pct(w.rate)})`)),
            w.rate !== null ? svg('text', { class: 't-colors-week-value', x: cx, y: top - 5, 'text-anchor': 'middle' }, pct(w.rate)) : null,
            dayLabel(w, i) ? svg('text', { x: cx, y: H - 7, 'text-anchor': 'middle' }, dayLabel(w, i)) : null);
        }),
        svg('line', { class: 'base', x1: pad.l, x2: W - pad.r, y1: base + 0.5, y2: base + 0.5 }),
      ];
    });
  }

  // ⑪ 잔디: 주마다 한 줄(월~일 칸 일곱), 하루 푼 문제 수의 살구색 짙기(0~4)
  function calendarGrid(cal) {
    const months = h('div', { class: 't-rp-cal-months', 'aria-hidden': 'true' }, cal.weeks.map((w) => h('span', {}, w.month ? `${w.month}월` : '')));
    const days = h('div', { class: 't-rp-cal-days', 'aria-hidden': 'true' }, ['월', '', '수', '', '금', '', ''].map((d) => h('span', {}, d)));
    const grid = h('div', { class: 't-rp-cal', role: 'img', 'aria-label': `최근 ${cal.weeks.length}주 학습 달력: ${cal.active}일 공부, ${num(cal.total)}문제` },
      cal.weeks.map((w) => h('div', { class: 't-rp-cal-week' }, w.days.map((d) => (d
        ? h('span', { class: 't-rp-cal-day', 'data-level': String(d.level), title: `${T.dayText(d.day)} ${d.count ? `${d.count}문제` : '안 했어요'}` })
        : h('span', { class: 't-rp-cal-day', 'data-level': 'none' }))))));
    const legend = h('p', { class: 't-rp-cal-legend', 'aria-hidden': 'true' }, '적게',
      [0, 1, 2, 3, 4].map((level) => h('span', { class: 't-rp-cal-day', 'data-level': String(level) })), '많이');
    return h('div', { class: 't-rp-cal-box' }, months, h('div', { class: 't-rp-cal-row' }, days, grid), legend);
  }

  // ⑭ 최근 활동 줄을 칸에 맞춘다(기록 탭 · 요약). 노트북·태블릿(600px부터): 창 안이 넘치면 오래된 줄부터 숨겨 최신부터 통째로
  // 들어가는 줄만 남기고, 칸 아래 남은 높이는 보이는 줄 위아래 여백이 나눠 갖는다(한쪽에 RECENT_SPREAD_MAX까지, --recent-spread).
  // 폰은 창 안을 내려 보므로 칸에 맞추지 않는다(요약은 RECENT_PHONE줄까지). 창 크기가 바뀌면 다시 잰다
  function fitRecent() {
    const list = panel.querySelector('.t-rp-recent-list');
    if (!list) return;
    const items = [...list.children];
    list.style.removeProperty('--recent-spread');
    const wide = matchMedia('(min-width: 600px)').matches;
    items.forEach((li, i) => { li.hidden = !wide && tab === 'summary' && i >= RECENT_PHONE; });
    if (!wide) return;
    for (let i = items.length - 1; i > 0 && panel.scrollHeight > panel.clientHeight + 1; i--) items[i].hidden = true;
    if (panel.scrollHeight > panel.clientHeight + 1) return;
    // 줄 끝에서 칸 바닥(요약은 [기록 모두 보기] 위, 칸 사이 간격만큼 띄운 곳)까지가 남은 높이
    const box = list.closest('.t-rp-card');
    const cs = getComputedStyle(box);
    const more = box.querySelector('.t-rp-more');
    const floor = more
      ? more.getBoundingClientRect().top - (parseFloat(cs.rowGap) || 0)
      : box.getBoundingClientRect().bottom - parseFloat(cs.paddingBottom) - parseFloat(cs.borderBottomWidth);
    const room = floor - list.getBoundingClientRect().bottom;
    const shown = items.filter((li) => !li.hidden).length;
    const spread = Math.floor(Math.min(RECENT_SPREAD_MAX, room / (2 * shown - 1)) * 100) / 100;
    if (spread > 0) list.style.setProperty('--recent-spread', `${spread}px`);
  }
  // 성취기준 목록이 칸 안에서 내려가면(넓은 화면) 키보드로도 내릴 수 있게 초점을 받는다. 다 보이면(폰) 초점 차례에 넣지 않는다
  function markScroll() {
    const box = panel.querySelector('.t-rp-std-groups');
    if (!box) return;
    if (box.scrollHeight > box.clientHeight + 1) box.tabIndex = 0;
    else box.removeAttribute('tabindex');
  }
  let fitFrame = 0;
  const onResize = () => {
    cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(() => {
      if (!isOpen()) return;
      if (tab === 'record' || tab === 'summary') fitRecent();
      if (tab === 'progress') markScroll();
    });
  };

  return {
    show,
    hide,
    isOpen,
    get number() { return number; },
    // 대시보드를 다시 그렸다(새로 받음 · 그림 다시 정함): 머리와 앞뒤 번호를 다시. 그 아이가 빠졌으면(자리 비움) 닫는다
    refresh({ focusKey = null } = {}) {
      if (!isOpen()) return;
      if (!rowOf(number)) hide({ focusKey });
      else render();
    },
    // 대시보드를 새로 받았다: 받아 둔 리포트는 버린다(다음에 열 때 새로)
    forget() {
      cache.clear();
      if (isOpen()) fetchKid(number);
    },
    dispose() {
      if (isOpen()) hide({ fromUrl: true });
      cache.clear();
    },
  };
}
