// 선생님 계정 만들기(설계서 4-1): 규칙 · 줄 읽기(DOM 없음, tests/accounts.test.mjs), 만들기 칸(createPanel), 안내 쪽지(slipsView).
// 만들기 칸은 관리 첫 화면(admin/home.js)이 큰 시트에 띄운다.
import { h } from '../ui.js?v=9a67f36b25';
import { msgLine, say } from '../teacher/say.js?v=9a67f36b25';
import { busy } from '../teacher/session.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { lockSheet } from '../sheet-lock.js?v=9a67f36b25';
import { INTERNET } from '../teacher/text.js?v=9a67f36b25';
import { SIDO_ORDER, loadSchools, searchSchools, shortSchoolName, prefixFor, regionLabel, schoolKey } from './schools.js?v=9a67f36b25';
import {
  ACCOUNT_ID_RULE, idExample, prefixTaken, INITIAL_RULE, INITIAL_HINT, SLIP_FIRST, SLIP_WARNING, SCHOOL_PICK, MANUAL_RULE, NAMES_RULE, YEAR_RULE,
  NOTHING_TO_MAKE, accountMessage,
} from './text.js?v=9a67f36b25';

const PREFIX = /^[a-z][a-z0-9]{0,11}$/; // 서버 accounts.js readPrefix와 같다
const BATCH = 40; // 서버가 한 번에 받는 계정 수

// 규칙으로 만들 계정: 아이디 = 머리글자 + 연도 두 자리 + 학년 + 반, 이름 = 짧은 이름 + 연도 + 「년도」 + 학년-반 + 「반」(ys2652 · 용산26년도5-2반)
export function ruleAccounts({ prefix, short, year, counts }) {
  const name = String(short ?? '').trim();
  if (!PREFIX.test(prefix) || !/^\d{2}$/.test(year) || !name) throw new Error('머리글자·짧은 이름·연도 두 자리를 확인해 주세요.');
  return counts.flatMap((n, i) => {
    if (!Number.isInteger(n) || n < 0 || n > 99) throw new Error('반 수는 0부터 99까지 넣어 주세요.');
    return Array.from({ length: n }, (_, j) => ({ loginId: `${prefix}${year}${i + 1}${j + 1}`, name: `${name}${year}년도${i + 1}-${j + 1}반`, grade: i + 1, classNo: j + 1 }));
  });
}
// 줄마다 「아이디 이름」. 규칙으로 만든 줄(generated)의 학년 · 반은 이름을 고쳐도 그대로, 아니면 이름 끝 「5-2반」에서 읽는다.
export function parseAccounts(text, generated = []) {
  const metadata = new Map(generated.map((a) => [a.loginId, a]));
  const seen = new Set();
  const accounts = String(text ?? '').split(/\r?\n/).filter((s) => s.trim()).map((line) => {
    const m = /^\s*([a-z0-9]{3,20})\s+(.+?)\s*$/i.exec(line);
    if (!m) throw new Error('줄마다 아이디와 이름을 띄어 써 주세요. 아이디는 영어 소문자·숫자 3~20자예요.');
    const id = m[1].toLowerCase();
    if (seen.has(id)) throw new Error(`같은 아이디가 두 줄에 있어요: ${id}`);
    seen.add(id);
    const known = metadata.get(id);
    const matched = /([1-6])-(\d{1,2})반$/.exec(m[2]);
    return { loginId: id, name: m[2], grade: known?.grade ?? (matched ? Number(matched[1]) : null), classNo: known?.classNo ?? (matched ? Number(matched[2]) : null) };
  });
  if (!accounts.length || accounts.length > 600) throw new Error('만들 계정(1~600개)을 넣어 주세요.');
  return accounts;
}
// 학년도 칸의 첫 값: 그해. 11 · 12월에 만드는 계정도 지금 쓰는 그해 학년도이고, 1 · 2월에는 3월에 시작할 학년도 계정을 만든다. 다른 해는 칸에서 고친다
export const schoolYearFor = (now = new Date()) => now.getFullYear();
// 이 머리글자를 다른 학교가 이미 쓰면 그 학교 이름, 아니면 null. taken = [{ prefix, schoolKey, schoolName }]
export const takenBy = (taken, prefix, key) => taken.find((t) => t.prefix === prefix && t.schoolKey !== key)?.schoolName ?? null;

const label = (text, input) => h('label', { class: 'p-field' }, h('span', {}, text), input);
const input = (name, extra = {}) => h('input', { name, autocomplete: 'off', ...extra });
const step = (no, title, ...kids) => h('fieldset', { class: 'a-step' }, h('legend', {}, h('span', { class: 'a-step-no', 'aria-hidden': 'true' }, String(no)), title), ...kids);

// 안내 쪽지: 반마다 한 장(반 이름 · 주소 · 아이디 · 처음 비밀번호 · 열쇠 안내). 인쇄하면 쪽지만 찍힌다(admin.css @media print).
export function slipsView(accounts, password, { notice = '', onDone = () => {} } = {}) {
  const print = h('button', { type: 'button', class: 'primary', onclick: () => window.print() }, '쪽지 인쇄');
  const done = h('button', { type: 'button', onclick: () => onDone() }, '다 했어요');
  return h('section', { class: 'a-panel a-slips-panel' }, h('h2', { tabindex: '-1' }, `안내 쪽지 ${accounts.length}장`),
    h('p', { class: 'a-slip-warning' }, SLIP_WARNING), notice ? h('p', {}, notice) : null, h('div', { class: 'a-slip-actions' }, print, done),
    h('div', { class: 'a-slips' }, accounts.map((a) => h('article', { class: 'a-slip' },
      h('h3', {}, a.name), h('p', {}, '매일 수학 선생님 화면: math.matto.kr/teacher'), h('p', {}, '아이디 ', h('strong', {}, a.loginId)),
      h('p', {}, '처음 비밀번호 ', h('strong', { class: 'a-password' }, password)), h('p', {}, SLIP_FIRST)))));
}

// 만들기 칸: ① 학교 찾기 → ② 짧은 이름 · 머리글자 → ③ 학년도 · 학년마다 반 수(또는 줄 붙여 넣기) → ④ 처음 비밀번호
// → 미리 보기(이미 있는 아이디는 「있음」) → 확인 시트 → 40개씩 만들기 → 쪽지.
// opts.school = 고른 학교 { code, name, sido, sigungu }([반 더 만들기]), prefix · short = 그 학교가 쓰던 값, taken = 다른 학교들이 쓰는 머리글자.
// ctx = { send, holdSheet, done? }: done은 쪽지의 [다 했어요](없으면 빈 칸으로 다시). 처음 비밀번호는 칸을 닫으면 버린다.
export function createPanel(ctx, { school = null, prefix = '', short = '', taken = [] } = {}) {
  const el = h('div', { class: 'a-create-wrap' });
  let generation = 0, close = null, checkTimer = 0, checkSeq = 0;
  let chosen = school?.sido ? school : null; // 목록에서 고른 학교(또는 [반 더 만들기]의 학교)
  let manual = Boolean(school && !school.sido); // 「목록에 없어요」: 이름 · 시·도를 적는다(지역 없는 옛 계정의 [반 더 만들기]도)
  let shortTouched = Boolean(short), prefixTouched = Boolean(prefix);
  let mode = 'rule', generated = [], existing = new Set(), schools = null;

  const searchInput = input('school-search', { type: 'search', placeholder: '학교 이름 몇 글자, 예: 용산', 'aria-label': '학교 찾기', maxlength: '40' });
  const hits = h('div', { class: 'a-school-hits', role: 'list' });
  const manualName = input('school-name', { maxlength: '40', value: manual ? school.name : '', placeholder: '용산초등학교' });
  const sidoSelect = h('select', { name: 'sido', 'aria-label': '시·도' }, h('option', { value: '' }, '고르기'), SIDO_ORDER.map((s) => h('option', { value: s }, s)));
  const sigunguInput = input('sigungu', { maxlength: '20', placeholder: '비워도 돼요' });
  const schoolBox = h('div', { class: 'a-school' });
  const shortInput = input('short', { maxlength: '20', value: short });
  const prefixInput = input('prefix', { maxlength: '12', value: prefix, autocapitalize: 'off', spellcheck: 'false' });
  const takenLine = h('p', { class: 'a-taken', role: 'status', hidden: true });
  const yearInput = input('school-year', { inputmode: 'numeric', maxlength: '4', value: String(schoolYearFor()) });
  const counts = [1, 2, 3, 4, 5, 6].map((g) => input(`g${g}`, { type: 'number', min: '0', max: '99', value: '0', inputmode: 'numeric', 'aria-label': `${g}학년 반 수` }));
  const countsBox = h('div', { class: 'a-rule-counts' }, counts.map((v, i) => label(`${i + 1}학년`, v)));
  const lines = h('textarea', { name: 'accounts', rows: '7', spellcheck: 'false', placeholder: 'ys2651 용산26년도5-1반\nys2652 용산26년도5-2반' });
  const linesBox = h('div', { class: 'a-lines', hidden: true }, label('만들 계정 (줄마다 아이디 이름)', lines));
  const modeButtons = [['rule', '학년마다 반 수'], ['lines', '줄로 붙여 넣기']].map(([key, text]) =>
    h('button', { type: 'button', 'data-mode': key, 'aria-pressed': String(key === mode), onclick: () => setMode(key) }, text));
  const password = input('initial-password', { type: 'text', maxlength: '256', placeholder: '8자 이상', spellcheck: 'false', autocapitalize: 'off' });
  const ruleExample = h('span', { class: 'a-rule-example' });
  const previewHead = h('p', { class: 'a-preview-head', 'aria-live': 'polite' });
  const previewBody = h('div', { class: 'a-preview-body' });
  const make = h('button', { type: 'button', class: 'primary a-make' }, '만들기');
  const msg = msgLine();

  const yy = () => yearInput.value.trim().slice(-2);
  function currentSchool() {
    if (!manual) return chosen;
    const name = manualName.value.replace(/\s+/g, ' ').trim();
    return name.length >= 2 && sidoSelect.value ? { code: null, name, sido: sidoSelect.value, sigungu: sigunguInput.value.replace(/\s+/g, '').trim() } : null;
  }
  // 학교가 바뀌면 짧은 이름 · 머리글자를 다시 채운다(손으로 고친 칸은 그대로)
  function fillNames() {
    const typed = manual && manualName.value.trim() ? { name: manualName.value.trim(), sido: sidoSelect.value || null } : null;
    const s = currentSchool() ?? typed; // 「목록에 없어요」는 시·도를 고르기 전에도 이름으로 채운다
    if (s && !shortTouched) shortInput.value = shortSchoolName(s.name, s.sido);
    if (!prefixTouched) prefixInput.value = prefixFor(shortInput.value);
  }
  // 학교를 새로 고르러 가면 짧은 이름 · 머리글자는 새 학교를 따른다
  function another(toManual, focus) {
    manual = toManual; chosen = null; shortTouched = false; prefixTouched = false;
    drawSchool(); fillNames(); update(); focus.focus();
  }
  function drawSchool() {
    if (manual) {
      schoolBox.replaceChildren(h('div', { class: 'a-school-manual' }, label('학교 이름', manualName), label('시·도', sidoSelect), label('시·군·구', sigunguInput)),
        h('button', { type: 'button', class: 'a-link', onclick: () => another(false, searchInput) }, '목록에서 찾기'));
      return;
    }
    if (chosen) {
      schoolBox.replaceChildren(h('div', { class: 'a-school-chip' }, h('strong', {}, chosen.name), h('span', {}, regionLabel(chosen)),
        h('button', { type: 'button', onclick: () => another(false, searchInput) }, '바꾸기')));
      return;
    }
    schoolBox.replaceChildren(searchInput, hits, h('button', { type: 'button', class: 'a-link', onclick: () => another(true, manualName) }, '목록에 없어요'));
    find();
  }
  function pick(s) {
    chosen = s; shortTouched = false; prefixTouched = false;
    drawSchool(); fillNames(); update();
    shortInput.focus();
  }
  // 학교 목록은 칸을 열 때 받기 시작한다(관리 화면 처음 열기에는 받지 않는다)
  async function find() {
    const at = generation, query = searchInput.value;
    if (!schools) {
      if (query.trim()) hits.replaceChildren(h('p', { class: 'a-hint' }, '학교 목록을 받는 중…'));
      try { schools = (await loadSchools()).schools; } catch {
        if (at !== generation) return;
        hits.replaceChildren(h('p', { class: 'a-hint' }, INTERNET, ' ', h('button', { type: 'button', onclick: () => find() }, '다시')));
        return;
      }
      if (at !== generation || query !== searchInput.value) return;
    }
    if (!query.trim()) { hits.replaceChildren(); return; }
    const found = searchSchools(schools, query);
    // 줄(listitem)이 단추를 품는다: 단추에 줄 역할을 얹으면 화면 읽기 프로그램이 단추로 읽지 않는다. 못 찾았다는 글은 목록이 아니다
    if (found.length) hits.setAttribute('role', 'list'); else hits.removeAttribute('role');
    hits.replaceChildren(...(found.length ? found.map((s) => h('div', { role: 'listitem' }, h('button', { type: 'button', class: 'a-school-hit', onclick: () => pick(s) },
      h('strong', {}, s.name), h('span', {}, regionLabel(s)))))
      : [h('p', { class: 'a-hint' }, '찾는 학교가 없어요. 아래 「목록에 없어요」로 적어 주세요.')]));
  }
  function setMode(next) {
    if (next === 'lines' && !lines.value.trim() && generated.length) lines.value = generated.map((a) => `${a.loginId} ${a.name}`).join('\n');
    mode = next;
    for (const b of modeButtons) b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    countsBox.hidden = mode !== 'rule'; linesBox.hidden = mode !== 'lines';
    update();
  }
  // 지금 칸으로 만들 계정 { accounts, problem }
  function planned() {
    try {
      if (mode === 'lines') return { accounts: lines.value.trim() ? parseAccounts(lines.value, generated) : [] };
      const list = ruleAccounts({ prefix: prefixInput.value.trim(), short: shortInput.value, year: yy(), counts: counts.map((c) => Number(c.value || 0)) });
      generated = list;
      return { accounts: list };
    } catch (e) { return { accounts: [], problem: e.message }; }
  }
  function drawPreview(accounts, problem = '') {
    const there = accounts.filter((a) => existing.has(a.loginId)).length;
    previewHead.textContent = problem || (accounts.length ? `모두 ${accounts.length}개${there ? ` · 새로 ${accounts.length - there}개 · 있음 ${there}개` : ''}` : '반 수를 넣으면 여기에 아이디가 보여요.');
    previewHead.dataset.tone = problem ? 'bad' : '';
    const groups = new Map();
    for (const a of accounts) groups.set(a.grade ?? 0, [...(groups.get(a.grade ?? 0) ?? []), a]);
    previewBody.replaceChildren(...[...groups.keys()].sort((a, b) => (a || 9) - (b || 9)).map((g) => h('section', { class: 'a-preview-grade' },
      h('h4', {}, `${g ? `${g}학년` : '학년 모름'} · ${groups.get(g).length}개`),
      h('ul', {}, groups.get(g).map((a) => h('li', { class: existing.has(a.loginId) ? 'is-there' : null },
        h('code', {}, a.loginId), h('span', {}, a.name), existing.has(a.loginId) ? h('em', {}, '있음') : null))))));
  }
  // 이미 있는 아이디 표시: 칸을 고친 뒤 잠깐 멈추면 확인 길(check)로 묻는다. 답이 늦게 와 지금 칸과 다르면 버린다.
  function scheduleCheck(accounts) {
    clearTimeout(checkTimer);
    if (!accounts.length || accounts.length > 600) return;
    const seq = ++checkSeq;
    checkTimer = setTimeout(async () => {
      const res = await ctx.send('/v1/admin/accounts/check', { body: { accounts } });
      if (seq !== checkSeq || !res?.ok) return;
      existing = new Set(res.data.skipped);
      drawPreview(accounts);
    }, 500);
  }
  function update() {
    const s = currentSchool(), prefixNow = prefixInput.value.trim();
    const other = s && PREFIX.test(prefixNow) ? takenBy(taken, prefixNow, schoolKey({ schoolCode: s.code, sido: s.sido, school: s.name })) : null;
    takenLine.hidden = !other;
    takenLine.textContent = other ? prefixTaken(prefixNow, other) : '';
    const [id, rest] = (PREFIX.test(prefixNow) && shortInput.value.trim() && /^\d{2}$/.test(yy())
      ? idExample({ prefix: prefixNow, short: shortInput.value.trim(), year: yy() }) : idExample({ prefix: 'ys', short: '용산', year: '26' })).split(' = ');
    ruleExample.replaceChildren(h('code', {}, id), ` = ${rest}`);
    const { accounts, problem } = planned();
    existing = new Set([...existing].filter((id) => accounts.some((a) => a.loginId === id)));
    drawPreview(accounts, accounts.length ? '' : problem && (mode === 'lines' || counts.some((c) => Number(c.value) > 0)) ? problem : '');
    scheduleCheck(accounts);
  }

  // 만들기 전 마지막 확인: 칸 차례대로 하나씩 말한다
  function problemNow() {
    const s = currentSchool();
    if (!s) return manual ? MANUAL_RULE : SCHOOL_PICK;
    if (!shortInput.value.trim() || !PREFIX.test(prefixInput.value.trim())) return NAMES_RULE;
    const year = Number(yearInput.value.trim());
    if (!/^\d{4}$/.test(yearInput.value.trim()) || year < 2000 || year > 2099) return YEAR_RULE;
    if (password.value.length < 8 || password.value.length > 256) return INITIAL_RULE;
    const { accounts, problem } = planned();
    if (!accounts.length) return problem && mode === 'lines' ? problem : NOTHING_TO_MAKE;
    return null;
  }
  make.addEventListener('click', async () => {
    const problem = problemNow();
    if (problem) { say(msg, problem, 'bad'); return; }
    say(msg, '');
    const s = currentSchool(), { accounts } = planned(), pw = password.value;
    const body = { school: { code: s.code, name: s.name, sido: s.sido, sigungu: s.sigungu ?? '' }, prefix: prefixInput.value.trim(), schoolYear: Number(yearInput.value.trim()), initialPassword: pw };
    const at = generation;
    const res = await busy(make, '확인하는 중…', () => ctx.send('/v1/admin/accounts/check', { body: { accounts } }));
    if (!res || at !== generation) return;
    if (!res.ok) { say(msg, accountMessage(res), 'bad'); return; }
    existing = new Set(res.data.skipped); drawPreview(accounts);
    const confirm = h('button', { type: 'button', class: 'primary' }, '확인하고 만들기');
    const cancel = h('button', { type: 'button', onclick: () => close?.() }, '취소');
    const note = msgLine();
    close = openSheet(document.body, { label: '계정 만들기 확인', className: 'a-sheet', onClose: () => { close = null; } },
      h('h2', {}, '계정 만들기 확인'), h('p', { class: 'a-sheet-who' }, `${s.name} · ${regionLabel(s) || '지역 모름'}`),
      h('p', {}, `${res.data.total}개 가운데 ${res.data.create}개를 만들어요.${res.data.skipped.length ? ` 이미 있는 아이디 ${res.data.skipped.length}개는 건너뛰어요.` : ''}`),
      h('p', {}, '처음 비밀번호 ', h('strong', { class: 'a-password' }, pw)), h('div', { class: 'a-sheet-actions' }, confirm, cancel), note);
    ctx.holdSheet(() => close?.());
    confirm.addEventListener('click', async () => {
      const unlock = lockSheet(confirm.closest('.sheet'));
      try {
        const created = [], skipped = [];
        let failure = null, finished = 0, signedOut = false;
        await busy([confirm, cancel], '만드는 중…', async () => {
          for (let start = 0; start < accounts.length; start += BATCH) {
            const out = await ctx.send('/v1/admin/accounts', { body: { ...body, accounts: accounts.slice(start, start + BATCH), confirm: true } });
            if (!out) { signedOut = true; break; }
            if (!out.ok) { failure = out; break; }
            created.push(...out.data.created); skipped.push(...out.data.skipped); finished = Math.min(start + BATCH, accounts.length);
          }
        });
        if (signedOut || at !== generation || !confirm.isConnected) return;
        if (failure && !created.length) { say(note, accountMessage(failure), 'bad'); return; }
        const byId = new Map(accounts.map((a) => [a.loginId, a]));
        const notice = [skipped.length ? `건너뛴 아이디: ${skipped.join(', ')}` : '',
          finished < accounts.length ? `${accounts.length - finished}개는 만들지 못했어요. 이 쪽지를 먼저 인쇄한 뒤 다시 만들어 주세요.` : ''].filter(Boolean).join(' ');
        close?.();
        showSlips(created.map((id) => byId.get(id)).filter(Boolean), pw, notice);
      } finally { unlock(); }
    });
  });
  function showSlips(made, pw, notice) {
    generation += 1; clearTimeout(checkTimer);
    password.value = '';
    el.replaceChildren(slipsView(made, pw, { notice, onDone: () => (ctx.done ? ctx.done() : reset()) }));
    el.querySelector('h2')?.focus({ preventScroll: true });
  }
  function reset() {
    generation += 1;
    el.replaceChildren(form);
    for (const c of counts) c.value = '0';
    lines.value = ''; generated = []; existing = new Set();
    update();
  }

  shortInput.addEventListener('input', () => { shortTouched = true; fillNames(); update(); });
  prefixInput.addEventListener('input', () => { prefixTouched = true; update(); });
  for (const field of [manualName, sigunguInput]) field.addEventListener('input', () => { fillNames(); update(); });
  sidoSelect.addEventListener('change', () => { fillNames(); update(); });
  for (const field of [yearInput, lines, ...counts]) field.addEventListener('input', update);
  searchInput.addEventListener('input', () => find());

  const form = h('section', { class: 'a-panel a-create' },
    h('div', { class: 'a-create-head' }, h('h2', { tabindex: '-1' }, '선생님 계정 만들기'), h('p', { class: 'a-hint' }, '반마다 계정을 하나 만들어요.'),
      h('p', { class: 'a-rule-line' }, h('span', {}, ACCOUNT_ID_RULE), ruleExample)), // 설계서 4-1: 만들기 칸 맨 위(폰에서도 단계보다 위)
    h('div', { class: 'a-create-grid' },
      h('div', { class: 'a-create-steps' },
        step(1, '학교', schoolBox),
        step(2, '짧은 이름·머리글자', h('div', { class: 'a-two' }, label('짧은 이름', shortInput), label('머리글자', prefixInput)),
          h('p', { class: 'a-hint' }, '짧은 이름은 계정 이름에, 머리글자는 아이디 앞에 들어가요. 고칠 수 있어요.'), takenLine),
        step(3, '학년도·반 수', h('div', { class: 'a-mode' }, modeButtons), h('div', { class: 'a-year' }, label('학년도', yearInput)), countsBox, linesBox),
        step(4, '처음 비밀번호', label('처음 비밀번호', password), h('p', { class: 'a-hint' }, INITIAL_HINT))),
      h('aside', { class: 'a-create-preview', 'aria-label': '만들 아이디 미리 보기' },
        h('h3', {}, '만들 아이디'), previewHead, previewBody, make, msg)));
  el.append(form);
  drawSchool();
  if (manual && school.name) fillNames();
  else if (chosen) fillNames();
  update();
  loadSchools().then((data) => { schools = data.schools; }, () => {});
  return {
    el,
    dispose: () => { generation += 1; checkSeq += 1; clearTimeout(checkTimer); close?.(); password.value = ''; el.replaceChildren(); },
  };
}
