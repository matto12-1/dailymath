// 처음 들어오기(설계서 4.1~4.3): 마을 고르기 → 반 코드 + 학년·반·번호(기본) 또는 작은 「반 없이 시작」 → 학년.
// 서버 주소가 없으면(ctx.api가 null: 폰 페이지·견본·옛 시험) 지금처럼 형식만 보고 기기에만 시작한다
// (서버 부름도 「하던 마을 이어 하기」 단추도 없다, 계획서 Review Focus 5).
// 서버가 있으면:
//  - 반으로: [다음] → 반 찾기(check) → 처음 온 번호·선생님이 그림을 지운 번호는 비밀 그림 정하기(한 번 더 눌러 확인),
//    이미 있는 번호는 비밀 그림 누르기 → 들어가기(join). 이미 있는 번호면 고른 마을 대신 서버의 마을·기록을 불러온다.
//  - 반 없이: 학년 → [시작하기] → 서버가 내 마을 열쇠(글자 6개 + 그림 둘)를 만든다(key/new) → 「내 마을 열쇠」 → [시작하기].
//    인터넷이 없으면 [다시]·[이 기기에서만 시작](열쇠는 나중에 탐험 일지에서 만든다).
//  - 첫 화면 아래 「하던 마을 이어 하기」: [반 코드로](반 칸 → 비밀 그림 누르기) · [열쇠로](글자 6개 → 그림 둘, key/login).
// 들어가면 연결(dailymath.link)을 두고, 서버 기록은 fromServer()로 걸러 넣고(하던 판은 버린다, Ruling R40. 없으면 새 기록으로 시작해 바로 보낸다),
// 보내기 줄을 깨운다.
// 서버를 부르는 동안 누른 단추는 「확인하는 중…」으로 막는다. call()은 던지지 않는다.
// 글·서버 답 읽기·열쇠 글자 맞추기는 entry-text.js(순수, node 시험). 반 칸·학년 단추는 class-form.js(탐험 일지와 같이 쓴다).
import { h, VILLAGE_NAME } from '../ui.js?v=9a67f36b25';
import { residentImg } from '../art/assets.js?v=9a67f36b25';
import { VILLAGE } from '../art/village-data.js?v=9a67f36b25';
import { BASES } from '../art/bases.js?v=9a67f36b25';
import { newState } from '../../src/game/state.js?v=9a67f36b25';
import { recordVisit, setGrade } from '../../src/game/study.js?v=9a67f36b25';
import { saveLink, clearLink, clearLost, keyLink, enteredLink, seatBody, seatText } from '../../src/game/link.js?v=9a67f36b25';
import { snapshot, fromServer } from '../../src/game/sync.js?v=9a67f36b25';
import { buildReport } from '../../src/game/report.js?v=9a67f36b25';
import { call } from '../net.js?v=9a67f36b25';
import { connectSync, showNote } from '../sync-runner.js?v=9a67f36b25';
import { picPad, keyCard } from '../pics.js?v=9a67f36b25';
import { classForm, gradeButtons, field, warnLine } from '../class-form.js?v=9a67f36b25';
import {
  AGAIN, BUSY, NO_TOWN, RESET, KEY_NOTE, PICS_SET_TITLE, PICS_SET_HINT, cleanKey, tidyKey, keyWarning,
  kidMessage, retryable, seatSlot, validEntry, validNewKey, joinOutcome, sentenceLines, enterNote,
} from '../entry-text.js?v=9a67f36b25';
import { labMark, privacyLink } from '../lab.js?v=9a67f36b25';

const studentOf = (st) => ({ classCode: st.classCode, classNo: st.classNo, number: st.number });
const sameStudent = (a, b) => Boolean(a) && typeof a === 'object'
  && a.classCode === b.classCode && a.classNo === b.classNo && a.number === b.number;

export function welcome(ctx) {
  const root = h('section', { class: 'screen welcome paper-screen' });
  const server = Boolean(ctx.api);
  const draftKey = 'dailymath.welcome';
  const draft = (() => {
    try {
      const value = JSON.parse(sessionStorage.getItem(draftKey) ?? '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch { return {}; } // 저장을 막은 기기에서도 입력할 수 있다.
  })();
  const validGrade = (g) => Number.isInteger(g) && g >= 1 && g <= 6 ? g : null;
  let kind = ['cat', 'dog'].includes(draft.kind) ? draft.kind : null;
  let soloGrade = validGrade(draft.soloGrade ?? (draft.step === 'grade' ? draft.grade : null));
  let entered = false;
  const remember = (step, values = {}) => {
    if (entered) return;
    Object.assign(draft, values, { step, kind });
    try { sessionStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* 저장 금지 기기는 현재 화면에서만 기억한다. */ }
  };
  const forget = () => {
    entered = true;
    try { sessionStorage.removeItem(draftKey); } catch { /* 저장 금지 기기 */ }
  };
  const classValue = () => ({ classCode: draft.code ?? '', grade: validGrade(Object.hasOwn(draft, 'classGrade') ? draft.classGrade : draft.step === 'class' ? draft.grade : null),
    classNo: draft.classNo ?? '', number: draft.number ?? '' });
  const rememberClass = (mode, st) => remember('class', { entryMode: mode, code: st.classCode,
    classGrade: st.grade, grade: st.grade, classNo: st.classNo, number: st.number });
  let turn = 0; // 화면을 그릴 때마다 하나씩 센다. 서버 답이 오기 전에 아이가 다른 화면으로 갔으면 그 답은 버린다
  const still = (at) => at === turn && root.isConnected;
  const tall = h('img', { class: 'backdrop-scene portrait', alt: '' });
  const wide = h('img', { class: 'backdrop-scene landscape', alt: '' });
  const backdrop = h('div', { class: 'place-backdrop welcome-backdrop', 'aria-hidden': 'true' }, tall, wide,
    h('div', { class: 'backdrop-veil' }));
  const show = (step, ...children) => {
    turn += 1;
    const k = kind ?? 'cat';
    tall.src = wide.src = VILLAGE[k].img;
    tall.style.objectPosition = VILLAGE[k].plazaCenter.x+'% 50%';
    backdrop.style.setProperty('--sea-tall', BASES.sea[k].tall);
    backdrop.style.setProperty('--sea-wide', BASES.sea[k].wide);
    root.dataset.step = step;
    remember(step);
    const links = children.find(child => child?.classList?.contains('welcome-links'));
    root.replaceChildren(backdrop, h('div', { class: 'welcome-panel paper-surface' }, ...children.filter(child => child !== links)), ...[links].filter(Boolean));
  };
  const links = (...buttons) => h('div', { class: 'welcome-links' }, ...buttons);
  const linkButton = (text, onclick) => h('button', { class: 'link small', onclick }, text);
  const focus = (selector) => root.querySelector(selector)?.focus();

  const fresh = (grade, student) => {
    const state = newState({ kind, grade, today: ctx.today, student });
    recordVisit(state, ctx.today);
    return state;
  };

  // 기기에만 시작(서버 없을 때, 인터넷이 없어 「이 기기에서만 시작」). 서버가 있으면 남은 연결을 지운다:
  // 새 마을이 전에 이어 두었던 서버 기록으로 올라가지 않게(풀린 연결 기억도 앞 아이 것이라 지운다).
  // 서버가 없으면 연결 칸을 건드리지 않는다(지금 그대로).
  const start = (grade, student) => {
    if (server) {
      clearLink(ctx.linkStorage);
      clearLost(ctx.linkStorage);
    }
    ctx.state = fresh(grade, student);
    forget();
    ctx.save();
    ctx.go('home', { firstTime: true });
  };

  // 서버에 들어간 뒤: 연결을 두고 기록을 넣고, 보내기 줄을 이어 바로 한 번 보낸다
  // (서버에 기록이 없었으면 이 기록이 올라가고, 있었으면 이 기기 접속만 더해 맞춘다).
  const enter = ({ link, state, first = false, note = null, home = true }) => {
    saveLink(ctx.linkStorage, link);
    ctx.state = state;
    forget();
    ctx.save();
    connectSync(ctx, { base: ctx.api, storage: ctx.linkStorage, buildReport });
    if (home) ctx.go('home', first ? { firstTime: true } : {});
    if (note) showNote(note);
    ctx.sync?.now();
  };

  // 들어가기(join)·열쇠로 이어 하기(key/login)의 답을 넣는다. 서버 기록은 fromServer()로 거른다(남이 꾸몄을 수 있다)
  // (처음 온 번호면 방금 보낸 이 기기 기록이 그대로 돌아온다). 서버 기록이 없으면 새 기록으로 시작한다
  // (마을·학년을 모르면 먼저 묻는다). 이미 있던 기록이면 이 기기 접속을 하나 세고 「하던 ○○ 마을을 불러왔어요」.
  // 연결에 서버 기록 해시(lastHash)를 두지 않는다: 들어가자마자 보내기 줄이 기록과 선생님 화면 요약을 한 번 올린다
  // (들어가기에는 요약 칸이 없어서, 처음 온 아이도 선생님 화면에 바로 지금 단원이 보이게).
  const arrive = (entry) => {
    const { data, mode, grade = null, student = null, extra = {} } = entry;
    const link = enteredLink(data, mode, extra);
    let state = fromServer(data.state);
    const loaded = Boolean(state) && data.created !== true;
    if (!state) {
      draft.arrival = entry; // 기록이 빈 마을의 추가 질문도 새로 고친 뒤 잇는다.
      if (!kind) return askVillage(() => arrive(entry));
      if (!grade) return askGrade((g) => arrive({ ...entry, grade: g }));
      state = fresh(grade, student);
    }
    if (student && !sameStudent(state.student, student)) state.student = student;
    if (student && grade && state.grade !== grade) setGrade(state, grade);
    if (loaded) recordVisit(state, ctx.today);
    enter({ link, state, first: !loaded, note: enterNote({ seatReset: link.seatReset === true, loaded, village: VILLAGE_NAME[state.town.kind] }) });
  };

  const villageCards = (onPick) => h('div', { class: 'pick-two' }, ...['cat', 'dog'].map((k) => {
    const src = residentImg(k, 1);
    return h('button', { class: 'village-card', onclick: () => onPick(k) }, src && h('img', { src, alt: '' }), VILLAGE_NAME[k]);
  }));
  const askVillage = (then) => show('village',
    h('h1', { class: 'lead' }, '어느 마을에서 시작할까요?'),
    villageCards((k) => { kind = k; then(); }));
  const askGrade = (then) => {
    const go = h('button', { class: 'primary go', disabled: !soloGrade, onclick: () => then(soloGrade) }, '시작하기');
    show('grade', h('h1', { class: 'lead' }, '몇 학년이에요?'), gradeButtons((g) => {
      soloGrade = g; remember('grade', { soloGrade, grade: g }); go.disabled = false;
    }, soloGrade), go);
  };

  const step1 = () => {
    show('village',
      h('h1', { class: 'title' }, '매일 수학'),
      h('p', { class: 'lead' }, '어느 마을에서 시작할까요?'),
      villageCards((k) => { kind = k; step2(); }),
      server && links(linkButton('하던 마을 이어 하기', () => continueWays())),
    );
    // 첫 화면 위쪽 오른쪽 MattoLAB 글자(누르면 제품 목록 · 연락처 종이 창, app/lab.js)와 맨 아래 개인정보 안내 링크(R39),
    // 같은 줄 오른쪽에 선생님 로그인(2026-10-26 Matto 「선생님들이 더 헷갈리겠다」).
    // 다음 단계(show)가 같이 치운다, 한 판에는 없다(자리는 link.css)
    root.prepend(labMark({ className: 'welcome-lab' }));
    root.append(h('p', { class: 'privacy-line' }, privacyLink(), h('a', { class: 'teacher-link', href: 'teacher.html' }, '선생님 로그인')));
  };

  const step2 = (value = classValue(), message = null) => {
    rememberClass('start', value);
    show('class',
      h('h1', { class: 'lead' }, '우리 반을 알려 주세요'),
      classForm({
        mode: 'start',
        submit: server ? '다음' : '시작하기',
        value,
        message,
        onChange: (st) => rememberClass('start', st),
        onCheck: server ? (st) => findSeat(st, 'start') : (st) => start(st.grade, studentOf(st)),
      }),
      links(linkButton('반 없이 시작', () => step3()), linkButton('마을 다시 고르기', () => step1())),
    );
    focus('.class-code input');
  };

  const step3 = () => {
    // 학년 고르기는 기억만 한다. [시작하기]를 눌러야 열쇠를 만들거나 기기에 시작한다.
    const go = h('button', { class: 'primary go', disabled: !soloGrade,
      onclick: () => server ? makeKey(soloGrade) : start(soloGrade, null) }, '시작하기');
    const grades = gradeButtons((g) => {
      soloGrade = g;
      remember('grade', { soloGrade, grade: g });
      go.disabled = false;
      say.replaceChildren();
    }, soloGrade);
    const say = h('div', { class: 'key-make', 'aria-live': 'polite' });
    const hold = (on) => {
      go.disabled = on;
      grades.querySelectorAll('button').forEach((b) => { b.disabled = on; });
      if (on) grades.setAttribute('aria-busy', 'true');
      else grades.removeAttribute('aria-busy');
    };
    // 못 만들면 글과 [다시]·[이 기기에서만 시작]. 던져진 오류도 같은 길로(학년 단추가 막힌 채 남지 않게).
    async function makeKey(grade) {
      const at = turn;
      const failed = (text) => {
        hold(false);
        say.replaceChildren(
          warnLine(text),
          h('div', { class: 'key-make-actions' },
            h('button', { type: 'button', class: 'primary', onclick: () => makeKey(grade) }, '다시'),
            h('button', { type: 'button', onclick: () => start(grade, null) }, '이 기기에서만 시작')));
      };
      hold(true);
      say.replaceChildren(h('p', { class: 'pic-say' }, BUSY));
      try {
        const local = fresh(grade, null);
        const sent = snapshot(local);
        const res = await call(ctx.api, '/v1/kid/key/new', { body: { state: sent } });
        if (!still(at)) return;
        if (!res.ok || !validNewKey(res.data)) {
          failed(kidMessage('new', res));
          return;
        }
        enter({ link: keyLink(res.data, sent), state: local, home: false }); // 같이 보낸 기록을 서버가 판 1로 두었다
        keyMade(res.data);
      } catch (err) {
        console.error(err);
        if (still(at)) failed(AGAIN);
      }
    }
    show('grade',
      h('h1', { class: 'lead' }, '몇 학년이에요?'),
      grades,
      go,
      say,
      h('button', { class: 'link small', onclick: () => step2() }, '반 코드 넣기로 돌아가기'),
    );
  };

  // 「내 마을 열쇠」: 연결과 기록은 이미 두었다(새로 고쳐도 마을은 남는다). [시작하기]는 홈으로.
  // 안내는 문장마다 줄을 바꾼다(탐험 일지의 열쇠 안내와 같게, 마지막 검토 L132: 390px에서 문장 가운데서 끊겼다).
  const keyMade = ({ key, pics }) => show('key',
    h('h1', { class: 'title key-title' }, '내 마을 열쇠'),
    keyCard({ key, pics }),
    h('p', { class: 'key-note sentences' }, sentenceLines(KEY_NOTE)),
    h('button', { class: 'primary go', onclick: () => ctx.go('home', { firstTime: true }) }, '시작하기'),
  );

  // 반 찾기(check). 고칠 것이 있으면 그 글을 돌려준다(반 칸 아래에 보인다).
  // 이어 하기(continue)인데 아무도 안 들어온 번호면 이어 할 마을이 없다(남의 번호를 잘못 차지하지 않게).
  async function findSeat(st, mode) {
    const at = turn;
    const res = await call(ctx.api, '/v1/kid/class/check', { body: seatBody(st) });
    if (!still(at)) return;
    const slot = seatSlot(res);
    if (!slot) return kidMessage('check', res);
    if (mode === 'continue' && slot === 'new') return NO_TOWN;
    seatPics(st, mode, slot);
  }

  // 비밀 그림: 처음 온 번호·선생님이 지운 번호는 정하기(한 번 더 눌러 확인), 이미 있는 번호는 누르기
  const seatPics = (st, mode, slot) => {
    remember('pics', { seat: st, entryMode: mode, slot, picMode: 'class' });
    const set = slot !== 'existing';
    const back = () => (mode === 'continue' ? classAgain(st) : step2(st));
    show('pics',
      h('p', { class: 'pill seat' }, seatText(st)),
      picPad({
        heading: 'h1',
        title: set ? PICS_SET_TITLE : '비밀 그림 두 개를 차례로 눌러요',
        hint: slot === 'reset' ? RESET
          : set ? PICS_SET_HINT : '처음 들어올 때 고른 두 그림이에요.',
        confirm: set,
        onDone: (pics) => joinSeat(st, mode, slot, pics),
      }),
      links(linkButton('번호 다시 넣기', back), linkButton('처음으로', () => step1())),
    );
  };

  // 들어가기(join). 처음 온 번호는 이 기기 새 기록을 같이 보낸다(서버가 판 1로 둔다).
  // 반이 바뀌었거나(닫힘·인원) 그 사이 다른 기기가 이 번호를 다른 그림으로 먼저 차지했으면(409 taken)
  // 넣은 값을 채운 반 칸으로 돌아가 글을 보인다(저절로 다시 부르지 않는다). 갈래는 entry-text.js joinOutcome.
  async function joinSeat(st, mode, slot, pics) {
    const student = studentOf(st);
    const body = { ...seatBody(st), pics };
    if (slot === 'new' && kind) body.state = snapshot(fresh(st.grade, student));
    const at = turn;
    const res = await call(ctx.api, '/v1/kid/class/join', { body });
    if (!still(at)) return;
    const out = joinOutcome(res, st);
    if (out.go === 'in') {
      arrive({ data: out.data, mode: 'class', grade: st.grade, student });
      return;
    }
    if (out.go === 'form') {
      if (mode === 'continue') classAgain(out.value, out.text);
      else step2(out.value, out.text);
      return;
    }
    if (out.go === 'retry') return { text: out.text, retry: true };
    return out.text;
  }

  // ── 하던 마을 이어 하기 ──

  const continueWays = () => show('continue',
    h('h1', { class: 'lead' }, '하던 마을 이어 하기'),
    h('p', { class: 'continue-hint' }, '반에 들어 있으면 반 코드로, 내 마을 열쇠를 받았으면 열쇠로 이어 해요.'),
    h('div', { class: 'pick-two continue-ways' },
      h('button', { type: 'button', class: 'way', 'aria-label': '반 코드로', onclick: () => classAgain() },
        h('strong', {}, '반 코드로'), h('small', {}, '반 코드·번호·비밀 그림')),
      h('button', { type: 'button', class: 'way', 'aria-label': '열쇠로', onclick: () => keyEntry() },
        h('strong', {}, '열쇠로'), h('small', {}, '열쇠 글자 6개·그림 둘'))),
    links(linkButton('처음으로', () => step1())),
  );

  const classAgain = (value = classValue(), message = null) => {
    rememberClass('continue', value);
    show('class',
      h('h1', { class: 'lead' }, '하던 반을 알려 주세요'),
      classForm({ mode: 'continue', value, message, onChange: (st) => rememberClass('continue', st), onCheck: (st) => findSeat(st, 'continue') }),
      links(linkButton('열쇠로 이어 하기', () => keyEntry()), linkButton('처음으로', () => step1())),
    );
    focus('.class-code input');
  };

  // 열쇠 글자 6개. 소문자·빈칸을 받아 대문자로 맞춘다(한글 조합 중에는 건드리지 않는다).
  // 가운데를 고쳐도 커서는 그 자리에 두고, 열쇠에 없는 글자(B·G·I·L·O·Q·S·Z)는 따로 알려 준다.
  const keyEntry = (value = draft.keyText ?? '', message = null) => {
    const errs = h('div', { class: 'errs', 'aria-live': 'polite' });
    const warn = (text) => (text ? errs.replaceChildren(warnLine(text)) : errs.replaceChildren());
    const input = h('input', {
      class: 'key-input', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', lang: 'en', placeholder: '글자 6개',
      oninput: (e) => { if (!e.isComposing) tidy(); },
      oncompositionend: () => tidy(),
      onkeydown: (e) => { if (e.key === 'Enter' && !e.isComposing) next(); },
    });
    input.value = value;
    function tidy() {
      const raw = input.value;
      const { value: clean, caret } = tidyKey(raw, input.selectionStart);
      if (clean !== raw) {
        input.value = clean;
        input.setSelectionRange(caret, caret);
      }
      warn(keyWarning(raw));
      remember('key-entry', { keyText: input.value });
    }
    function next() {
      const text = keyWarning(input.value, true);
      if (text) return warn(text);
      keyPics(cleanKey(input.value));
    }
    if (message) warn(message);
    show('key-entry',
      h('h1', { class: 'lead' }, '내 마을 열쇠를 넣어 주세요'),
      h('div', { class: 'key-entry' },
        field('열쇠 글자', input, '열쇠에 적힌 영어 글자 6개', true),
        errs,
        h('button', { class: 'primary go', onclick: next }, '다음')),
      links(linkButton('반 코드로 이어 하기', () => classAgain()), linkButton('처음으로', () => step1())),
    );
    input.focus();
  };

  const keyPics = (key) => {
    remember('pics', { keyText: key, picMode: 'key' });
    show('pics',
    h('p', { class: 'pill seat' }, `열쇠 ${key}`),
    picPad({ heading: 'h1', title: '열쇠 그림 두 개를 차례로 눌러요', hint: '열쇠와 같이 받은 두 그림이에요.', onDone: (pics) => login(key, pics) }),
    links(linkButton('열쇠 글자 다시 넣기', () => keyEntry(key)), linkButton('처음으로', () => step1())),
    );
  };

  // 열쇠로 이어 하기(key/login). 틀리면 열쇠인지 그림인지 가리지 않는 한 가지 글.
  async function login(key, pics) {
    const at = turn;
    const res = await call(ctx.api, '/v1/kid/key/login', { body: { key, pics } });
    if (!still(at)) return;
    if (res.ok && validEntry(res.data)) {
      arrive({ data: res.data, mode: 'key', extra: { key, pics } });
      return;
    }
    if (retryable(res)) return { text: kidMessage('login', res), retry: true };
    return kidMessage('login', res);
  }

  if (server && draft.arrival && validEntry(draft.arrival.data)) arrive(draft.arrival);
  else if (server && draft.step === 'continue') continueWays();
  else if (server && draft.step === 'key-entry') keyEntry();
  else if (server && draft.step === 'pics' && draft.picMode === 'key' && !keyWarning(draft.keyText, true)) keyPics(draft.keyText);
  else if (server && draft.step === 'pics' && draft.seat && ['new', 'existing', 'reset'].includes(draft.slot)) seatPics(draft.seat, draft.entryMode, draft.slot);
  else if (server && draft.step === 'class' && draft.entryMode === 'continue') classAgain();
  else if (kind && draft.step === 'grade') step3();
  else if (kind && draft.step === 'class') step2();
  else step1();
  return root;
}
