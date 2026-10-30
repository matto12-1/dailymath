// 관리 첫 화면 Ⓑ(설계서 4-4 · 4-6, Matto 10-25 「요약 숫자 + 큰 표」): 맨 위 요약 숫자(누르면 거름) · 찾기 · [선생님 계정 만들기],
// 그 아래 큰 표 하나. 표는 묶음 머리줄로 시·도(SIDO_ORDER, 지역 없는 옛 계정은 맨 끝 「지역 모름」) → 학교(시·군·구 · 학교 가나다,
// 이름이 같으면 학교 코드로 따로) → 학년도(최근 먼저 펼침, 지난 해 · 학년도 없음은 접힘) → 반(학년 · 반) 차례.
// 반 줄: 아이디 · 반 이름 · 처음 비밀번호 바꿈 · 마지막으로 쓴 날 · 반 · 아이 수 · 잠김 · [비밀번호 되돌리기] [지우기].
// 계정 만들기는 덧창(시트)으로 연다(admin/accounts.js createPanel). 맨 아래 접힌 「다른 지우기 요청」은 지금의 지우기 칸(admin/erase.js).
// 묶기 · 요약 · 글은 DOM 없이(tests/admin-home.test.mjs).
import { h } from '../ui.js?v=9a67f36b25';
import { msgLine, say } from '../teacher/say.js?v=9a67f36b25';
import { busy } from '../teacher/session.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { lockSheet } from '../sheet-lock.js?v=9a67f36b25';
import { createPanel } from './accounts.js?v=9a67f36b25';
import { eraseSection, eraseAccount } from './erase.js?v=9a67f36b25';
import { SIDO_ORDER, schoolKey, shortSchoolName, regionLabel } from './schools.js?v=9a67f36b25';
import { classViewHref } from '../teacher/access.js?v=9a67f36b25';
import * as A from './text.js?v=9a67f36b25';

const DAY = 24 * 60 * 60 * 1000;
export const UNKNOWN_REGION = '지역 모름';
const dayStart = (ms) => new Date(ms).setHours(0, 0, 0, 0);
// 마지막으로 쓴 날: 오늘 · 어제 · 6일 전까지는 며칠 전, 그보다 전은 날짜(해가 다르면 해까지)
export function seenText(ms, now) {
  if (ms == null) return '아직 없음';
  const days = Math.round((dayStart(now) - dayStart(ms)) / DAY);
  if (days <= 0) return '오늘';
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  const d = new Date(ms);
  return `${d.getFullYear() !== new Date(now).getFullYear() ? `${d.getFullYear()}년 ` : ''}${d.getMonth() + 1}월 ${d.getDate()}일`;
}
export const lockText = (a) => [a.passwordLocked && '비밀번호', a.keyLocked && '열쇠'].filter(Boolean).join('·');
const ko = (a, b) => a.localeCompare(b, 'ko');
const sidoRank = (sido) => (SIDO_ORDER.includes(sido) ? SIDO_ORDER.indexOf(sido) : SIDO_ORDER.length);
const late = (n) => n ?? Infinity; // 학년 · 반이 없으면 뒤로

// 요약 숫자를 누르면 거르는 술어(a = AccountView, now = 지금 ms)
export const FILTERS = {
  notChanged: (a) => a.mustChangePassword, // 처음 비밀번호 그대로(아직 안 들어온 반)
  seen7: (a, now) => a.lastSeenAt != null && now - a.lastSeenAt <= 7 * DAY, // 지난 7일 안에 쓴 계정(정확히 7일 전도 넣는다)
  withClass: (a) => a.classCount > 0,
  locked: (a) => a.passwordLocked || a.keyLocked,
};

export function summarize(accounts, now) {
  const count = (name) => accounts.filter((a) => FILTERS[name](a, now)).length;
  return {
    schools: new Set(accounts.map(schoolKey)).size, accounts: accounts.length, notChanged: count('notChanged'), seen7: count('seen7'),
    withClass: count('withClass'), kids: accounts.reduce((n, a) => n + (a.kidCount ?? 0), 0), locked: count('locked'),
  };
}

function bucket(list, keyOf) {
  const map = new Map();
  for (const item of list) {
    const key = keyOf(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return [...map];
}

// 규칙으로 만든 계정 이름(용산26년도5-2반, accounts.js ruleAccounts): 앞의 짧은 이름을 꺼낸다
const RULE_NAME = /^(.+?)\d{2}년도\d-\d{1,2}반$/;
// 학교 하나: 이름 · 코드 · 지역은 첫 줄에서, 머리글자와 짧은 이름은 가장 최근 학년도 줄의 것([반 더 만들기]가 채운다).
// 짧은 이름은 규칙으로 만든 계정 이름에서 꺼낸다(만들 때 고친 값이 남는다). 그런 줄이 없으면 공식 이름에서
function schoolGroup(key, rows) {
  const first = rows[0];
  const latest = [...rows].sort((a, b) => (b.schoolYear ?? -1) - (a.schoolYear ?? -1) || b.createdAt - a.createdAt);
  const newest = latest.find((a) => a.prefix);
  const named = latest.map((a) => RULE_NAME.exec(a.name ?? '')?.[1]).find(Boolean);
  const years = bucket(rows, (a) => a.schoolYear ?? null).sort(([a], [b]) => (b ?? -Infinity) - (a ?? -Infinity))
    .map(([year, list]) => ({ year, rows: list.sort((a, b) => late(a.grade) - late(b.grade) || late(a.classNo) - late(b.classNo) || ko(a.loginId, b.loginId)) }));
  return {
    key, name: first.school ?? '', code: first.schoolCode ?? null, sido: first.sido ?? null, sigungu: first.sigungu ?? null,
    prefix: newest?.prefix ?? '', short: named ?? shortSchoolName(first.school, first.sido), years,
  };
}

// AccountView[] → [{ sido(모르면 null), sigungus: [{ sigungu(없으면 ''), schools: [{ key, name, code, sido, sigungu, prefix, short, years: [{ year, rows }] }] }] }]
export function groupAccounts(accounts) {
  return bucket(accounts, (a) => (SIDO_ORDER.includes(a.sido) ? a.sido : null)).sort(([a], [b]) => sidoRank(a) - sidoRank(b)).map(([sido, rows]) => ({
    sido,
    sigungus: bucket(rows, (a) => a.sigungu ?? '').sort(([a], [b]) => (a === '') - (b === '') || ko(a, b)).map(([sigungu, list]) => ({
      sigungu,
      schools: bucket(list, schoolKey).map(([key, items]) => schoolGroup(key, items)).sort((a, b) => ko(a.name, b.name) || ko(a.code ?? '', b.code ?? '')),
    })),
  }));
}

// ── 화면 ──

const COLUMNS = ['아이디', '반 이름', '처음 비밀번호', '마지막으로 쓴 날', '반', '아이', '잠김', '관리'];
const cell = (label, ...kids) => h('td', { 'data-label': label }, ...kids);
// 묶음 머리줄 하나(표 너비 전체). spot은 다시 그린 뒤 초점을 되찾는 이름표.
const groupHead = (cls, spot, ...kids) => h('tr', { class: cls, 'data-spot': spot }, h('th', { colspan: COLUMNS.length, scope: 'rowgroup' }, ...kids));

// 학교마다 쓰는 머리글자(만들기 칸이 「○○가 이미 써요」로 알린다)
function takenOf(accounts) {
  const seen = new Map();
  for (const a of accounts) {
    const key = `${a.prefix}|${schoolKey(a)}`;
    if (a.prefix && !seen.has(key)) seen.set(key, { prefix: a.prefix, schoolKey: schoolKey(a), schoolName: a.school });
  }
  return [...seen.values()];
}

// ctx = main.js의 손잡이 { isWorking(), task(work), send(path, opts), reload(), refused(), page(), holdSheet(close | null), adminEmail() }
export function adminHome(ctx) {
  let accounts = [], classes = [], now = Date.now(), filter = null, seq = 0, alive = true, closeCreate = null;
  const flipped = new Set(); // 손으로 펼치거나 접은 학년도 묶음(「학교 키|학년도」)
  const search = h('input', { type: 'search', name: 'account-search', class: 'a-home-search', placeholder: '아이디·반 이름·학교 찾기', 'aria-label': '계정 찾기', autocomplete: 'off' });
  const make = h('button', { type: 'button', class: 'primary a-home-make', 'data-action': 'create', onclick: () => openCreate() }, '선생님 계정 만들기');
  const summary = h('div', { class: 'a-summary', role: 'group', 'aria-label': '요약' });
  const notice = msgLine(); // 되돌리기 · 지우기 결과
  const shownLine = h('p', { class: 'a-hint a-home-shown', 'aria-live': 'polite' });
  const rows = h('tbody');
  const table = h('table', { class: 'a-home-grid' }, h('thead', {}, h('tr', {}, COLUMNS.map((c) => h('th', { scope: 'col' }, c)))), rows);
  const tableBox = h('div', { class: 'a-home-table' }, h('p', { class: 'a-home-empty' }, '불러오는 중…'));
  const title = h('h2', { tabindex: '-1' }, A.HOME_TITLE);
  const el = h('div', { class: 'a-home' },
    h('div', { class: 'a-home-top' }, h('div', { class: 'a-home-title' }, title, h('p', { class: 'a-hint' }, A.HOME_HINT)), search, make),
    summary, notice, shownLine, tableBox,
    h('details', { class: 'a-home-more' }, h('summary', {}, '다른 지우기 요청'), eraseSection(ctx)));
  const tell = (text, tone = '') => say(notice, text, tone);

  const stat = (label, value, sub) => [h('span', {}, label), h('strong', {}, value), sub ? h('small', {}, sub) : null];
  function filterStat(name, label, value, sub) {
    return h('button', { type: 'button', class: 'a-stat', 'data-filter': name, 'aria-pressed': String(filter === name), onclick: () => {
      filter = filter === name ? null : name;
      draw();
      summary.querySelector(`[data-filter="${name}"]`)?.focus();
    } }, ...stat(label, value, sub));
  }
  function drawSummary() {
    const s = summarize(accounts, now);
    summary.replaceChildren(h('div', { class: 'a-stat' }, ...stat('학교', `${s.schools}곳`)), h('div', { class: 'a-stat' }, ...stat('계정', `${s.accounts}개`)),
      filterStat('notChanged', '처음 비밀번호 그대로', `${s.notChanged}개`), filterStat('seen7', '지난 7일 쓴 계정', `${s.seen7}개`),
      filterStat('withClass', '반 만든 계정', `${s.withClass}개`, `아이 ${s.kids}명`), filterStat('locked', '잠긴 계정', `${s.locked}개`));
  }

  function rowFor(a) {
    const href = classViewHref(classes, a.loginId, location.search);
    const erase = h('button', { type: 'button', class: 'a-small a-danger', 'data-action': 'erase' }, '지우기');
    erase.addEventListener('click', () => eraseAccount(ctx, a.loginId, erase, tell));
    const lock = lockText(a);
    return h('tr', { class: 'a-row', 'data-spot': a.loginId },
      cell('아이디', h('code', {}, a.loginId)), cell('반 이름', a.name),
      cell('처음 비밀번호', a.mustChangePassword ? h('span', { class: 'a-tag is-warn' }, '아직 안 바꿈') : '바꿈'),
      cell('마지막으로 쓴 날', seenText(a.lastSeenAt, now)), cell('반', a.classCount > 0 ? '만듦' : h('span', { class: 'a-none' }, '아직')),
      cell('아이', `${a.kidCount ?? 0}명`), cell('잠김', lock ? h('span', { class: 'a-tag is-bad' }, lock) : h('span', { class: 'a-none' }, '없음')),
      h('td', { class: 'a-row-actions', 'data-label': '관리' },
        href ? h('a', { class: 'a-small a-view', href }, '반 보기') : null,
        h('button', { type: 'button', class: 'a-small', 'data-action': 'reset', onclick: () => askReset(a) }, '비밀번호 되돌리기'), erase));
  }
  // 학년도 묶음: 맨 위(가장 최근) 해만 펼치고, 거르거나 찾는 동안은 모두 펼친다. 손으로 누른 묶음은 그 반대로.
  function yearRows(school, y, open) {
    const key = `${school.key}|${y.year}`;
    const shown = flipped.has(key) ? !open : open;
    const toggle = h('button', { type: 'button', class: 'a-year-btn', 'aria-expanded': String(shown), onclick: () => {
      if (!flipped.delete(key)) flipped.add(key);
      drawTable();
    } }, `${y.year ? `${y.year}학년도` : '학년도 없음'} · ${y.rows.length}개`);
    return [groupHead('a-g-year', `year:${key}`, toggle), ...(shown ? y.rows.map(rowFor) : [])];
  }
  function schoolRows(school, narrowed) {
    const total = school.years.reduce((n, y) => n + y.rows.length, 0);
    const more = h('button', { type: 'button', class: 'a-small', 'data-action': 'create', onclick: () => openCreate({
      school: { code: school.code, name: school.name, sido: school.sido, sigungu: school.sigungu ?? '' }, prefix: school.prefix, short: school.short,
    }) }, '반 더 만들기');
    const facts = [regionLabel(school), school.prefix && `머리글자 ${school.prefix}`, `계정 ${total}개`].filter(Boolean).join(' · ');
    return [groupHead('a-g-school', `school:${school.key}`, h('div', { class: 'a-g-line' }, h('strong', {}, school.name || '이름 없는 학교'), h('span', {}, facts), more)),
      ...school.years.flatMap((y, i) => yearRows(school, y, narrowed || i === 0))];
  }
  // 다시 그리면 단추가 새로 생긴다. 초점이 표 안에 있었으면 같은 줄의 같은 단추로 옮기고, 그 줄이 없어졌으면(지운 계정) 제목으로.
  function drawTable() {
    const at = document.activeElement;
    const spot = at && rows.contains(at) ? at.closest('[data-spot]') : null;
    const was = spot && { spot: spot.dataset.spot, nth: [...spot.querySelectorAll('button, a')].indexOf(at) };
    const q = search.value.trim().toLowerCase();
    const narrowed = Boolean(filter || q);
    const shown = accounts.filter((a) => (!filter || FILTERS[filter](a, now)) && (!q || `${a.loginId} ${a.name} ${a.school ?? ''}`.toLowerCase().includes(q)));
    shownLine.textContent = narrowed ? `${shown.length}개 보여요.` : '';
    rows.replaceChildren(...groupAccounts(shown).flatMap((region) => {
      const schools = region.sigungus.flatMap((g) => g.schools);
      return [groupHead('a-g-region', `region:${region.sido ?? ''}`, h('span', {}, region.sido ?? UNKNOWN_REGION), h('small', {}, `학교 ${schools.length}곳`)),
        ...schools.flatMap((school) => schoolRows(school, narrowed))];
    }));
    tableBox.replaceChildren(shown.length ? table : h('p', { class: 'a-home-empty' }, accounts.length ? A.HOME_NONE : A.HOME_EMPTY));
    if (!was) return;
    const again = [...rows.querySelectorAll('[data-spot]')].find((n) => n.dataset.spot === was.spot);
    (again?.querySelectorAll('button, a')[was.nth] ?? title).focus({ preventScroll: true });
  }
  function draw() { drawSummary(); drawTable(); }

  // 서버 목록을 새로 받는다. 그렸으면 true, 못 받았으면 false(표 자리에 까닭과 [다시]), 로그인이 풀렸거나 늦은 답이면 null.
  async function reload() {
    const at = ++seq;
    const [res, classRes] = await Promise.all([
      ctx.send('/v1/admin/accounts', { method: 'GET' }),
      ctx.send('/v1/admin/classes', { method: 'GET' }).catch(() => null),
    ]);
    if (!res || at !== seq || !alive) return null;
    if (res.status === 403) { ctx.refused(); return null; }
    if (!res.ok) {
      tableBox.replaceChildren(msgLine(A.adminMessage('accounts', res), 'bad'), h('button', { type: 'button', onclick: () => reload() }, '다시'));
      return false;
    }
    accounts = Array.isArray(res.data?.accounts) ? res.data.accounts : [];
    classes = classRes?.ok && Array.isArray(classRes.data?.classes) ? classRes.data.classes : [];
    now = Date.now();
    draw();
    return true;
  }

  // [비밀번호 되돌리기]: Matto가 임시 비밀번호를 적는다(보이게, 8자 이상). 부르는 동안 시트를 잠그고(지우기 확인과 같다),
  // 되면 시트를 닫고 알림 줄에 누구에게 알릴지 쓴 뒤 목록을 새로 받는다.
  function askReset(a) {
    if (ctx.isWorking()) return;
    const temp = h('input', { name: 'temp-password', type: 'text', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', maxlength: '256', placeholder: '8자 이상' });
    const ok = h('button', { type: 'button', class: 'primary' }, '되돌리기');
    const cancel = h('button', { type: 'button' }, '그만두기');
    const note = msgLine();
    const close = openSheet(document.body, { label: '비밀번호 되돌리기', className: 'a-sheet a-reset-sheet', onClose: () => { temp.value = ''; ctx.holdSheet(null); } },
      h('h2', {}, '비밀번호 되돌리기'), h('p', { class: 'a-sheet-who' }, `${a.loginId} · ${a.name}`), h('p', { class: 'a-sheet-text' }, A.RESET_LEAD),
      h('label', { class: 'p-field' }, h('span', {}, '임시 비밀번호'), temp), h('p', { class: 'a-hint' }, A.RESET_EFFECTS),
      h('div', { class: 'a-sheet-actions' }, ok, cancel), note);
    ctx.holdSheet(close);
    temp.focus();
    cancel.addEventListener('click', () => close());
    const submit = () => {
      if (ctx.isWorking()) return;
      if (temp.value.length < 8) { say(note, A.TEMP_RULE, 'bad'); temp.focus(); return; }
      const my = ctx.page();
      ctx.task(async () => {
        const unlock = lockSheet(ok.closest('.sheet'));
        ok.textContent = '되돌리는 중…';
        say(note, '');
        let res = null;
        try {
          res = await ctx.send(`/v1/admin/accounts/${encodeURIComponent(a.loginId)}/reset`, { body: { tempPassword: temp.value } });
        } finally {
          unlock();
          ok.textContent = '되돌리기';
        }
        if (!res || my !== ctx.page()) return; // 로그인이 풀렸다(화면이 바뀌며 시트도 닫혔다)
        if (res.status === 403) { ctx.refused(); return; }
        if (!res.ok) { say(note, A.resetMessage(res), 'bad'); return; }
        close();
        tell(A.resetDone(a.name || a.loginId), 'ok');
        await reload();
      });
    };
    ok.addEventListener('click', submit);
    temp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  }

  // [선생님 계정 만들기] · [반 더 만들기]: 만들기 칸을 큰 시트로 연다. 닫으면(✕ · [다 했어요]) 처음 비밀번호를 버리고 목록을 새로 받는다.
  // 화면을 떠나며 닫혔으면(main.js show가 시트를 닫은 뒤 dispose) 받지 않는다: 받기는 dispose가 끝난 다음 차례에 alive를 본다.
  function openCreate(opts = {}) {
    if (ctx.isWorking() || closeCreate) return;
    const panel = createPanel({ ...ctx, done: () => closeCreate?.() }, { ...opts, taken: takenOf(accounts) });
    closeCreate = openSheet(document.body, { label: '선생님 계정 만들기', className: 'a-sheet a-create-sheet', onClose: () => {
      panel.dispose();
      closeCreate = null;
      ctx.holdSheet(null);
      queueMicrotask(() => { if (alive) reload(); });
    } }, panel.el);
    ctx.holdSheet(closeCreate);
  }

  search.addEventListener('input', drawTable);
  reload();
  return {
    el,
    reload,
    dispose: () => { alive = false; seq += 1; closeCreate?.(); },
  };
}
