// 마을 고르기 뒤 반 코드와 번호만 넣는다. 같은 번호의 기록은 서버에서 이어 받는다.
import { h, VILLAGE_NAME } from '../ui.js?v=47133803ae';
import { residentImg } from '../art/assets.js?v=47133803ae';
import { VILLAGE } from '../art/village-data.js?v=47133803ae';
import { BASES } from '../art/bases.js?v=47133803ae';
import { newState } from '../../src/game/state.js?v=47133803ae';
import { recordVisit } from '../../src/game/study.js?v=47133803ae';
import { saveLink, clearLink, clearLost, enteredLink, seatBody } from '../../src/game/link.js?v=47133803ae';
import { snapshot, fromServer } from '../../src/game/sync.js?v=47133803ae';
import { buildReport } from '../../src/game/report.js?v=47133803ae';
import { call } from '../net.js?v=47133803ae';
import { connectSync, showNote } from '../sync-runner.js?v=47133803ae';
import { classForm, gradeButtons } from '../class-form.js?v=47133803ae';
import { kidMessage, validEntry, enterNote } from '../entry-text.js?v=47133803ae';
import { labMark, privacyLink } from '../lab.js?v=47133803ae';

export function welcome(ctx) {
  const root = h('section', { class: 'screen welcome paper-screen' });
  const draftKey = 'dailymath.welcome';
  const draft = (() => {
    try { const value = JSON.parse(sessionStorage.getItem(draftKey) ?? '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; }
  })();
  let kind = ['cat', 'dog'].includes(draft.kind) ? draft.kind : null;
  let soloGrade = Number.isInteger(draft.soloGrade) ? draft.soloGrade : null;
  let turn = 0;
  const remember = (step, values = {}) => {
    Object.assign(draft, values, { step, kind });
    try { sessionStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* 저장 금지 기기 */ }
  };
  const forget = () => { try { sessionStorage.removeItem(draftKey); } catch { /* 저장 금지 기기 */ } };
  const tall = h('img', { class: 'backdrop-scene portrait', alt: '' });
  const wide = h('img', { class: 'backdrop-scene landscape', alt: '' });
  const backdrop = h('div', { class: 'place-backdrop welcome-backdrop', 'aria-hidden': 'true' }, tall, wide, h('div', { class: 'backdrop-veil' }));
  const show = (step, children, foot = null) => {
    turn++;
    const k = kind ?? 'cat';
    tall.src = wide.src = VILLAGE[k].img;
    tall.style.objectPosition = VILLAGE[k].plazaCenter.x + '% 50%';
    backdrop.style.setProperty('--sea-tall', BASES.sea[k].tall);
    backdrop.style.setProperty('--sea-wide', BASES.sea[k].wide);
    root.dataset.step = step;
    remember(step);
    root.replaceChildren(backdrop, h('div', { class: 'welcome-panel paper-surface' }, ...children), ...[foot].filter(Boolean));
  };
  const links = (...children) => h('div', { class: 'welcome-links' }, ...children);
  const button = (text, onclick) => h('button', { type: 'button', class: 'link small', onclick }, text);
  const fresh = (grade, student = null) => {
    const state = newState({ kind: kind ?? 'cat', grade, today: ctx.today, student });
    recordVisit(state, ctx.today);
    return state;
  };
  const villages = onPick => h('div', { class: 'pick-two' }, ...['cat', 'dog'].map(k =>
    h('button', { class: 'village-card', onclick: () => { kind = k; onPick(); } },
      h('img', { src: residentImg(k, 1), alt: '' }), VILLAGE_NAME[k])));
  const home = () => {
    show('village', [h('h1', { class: 'title' }, '매일 수학'), h('p', { class: 'lead' }, '어느 마을에서 시작할까요?'), villages(() => form())],
      ctx.api ? links(button('하던 마을 이어 하기', () => form())) : null);
    root.prepend(labMark({ className: 'welcome-lab' }));
    root.prepend(h('p', { class: 'school-mark' }, h('img', { src: 'img/school-yongsan.webp', alt: '' }), '용산초등학교'));
    root.append(h('p', { class: 'privacy-line' }, privacyLink(), h('a', { class: 'teacher-link', href: 'teacher.html' }, '선생님 로그인')));
  };
  function form() {
    show('class', [h('h1', { class: 'lead' }, '반 코드와 내 번호를 넣어요'),
      classForm({ submit: '들어가기', value: { classCode: draft.code ?? '', number: draft.number ?? '' },
        onChange: st => remember('class', { code: st.classCode, number: st.number }),
        onCheck: join })],
      links(button('반 없이 시작', () => grade()), button('처음으로', home)));
  }
  async function join(st) {
    if (!ctx.api) return '인터넷에 연결한 뒤 다시 들어와 주세요.';
    const at = turn;
    const check = await call(ctx.api, '/v1/kid/class/check', { body: seatBody(st) });
    if (at !== turn || !root.isConnected) return;
    if (!check.ok || !check.data?.classSeat) return kidMessage('check', check);
    const seat = check.data.classSeat;
    const student = { classCode: seat.classCode, classNo: seat.classNo, number: seat.number };
    const body = seatBody(st);
    if (check.data.slot === 'new' && kind) body.state = snapshot(fresh(seat.grade, student));
    const res = await call(ctx.api, '/v1/kid/class/join', { body });
    if (at !== turn || !root.isConnected) return;
    if (!res.ok || !validEntry(res.data)) return kidMessage('join', res);
    const arrive = () => {
      const remote = fromServer(res.data.state), loaded = Boolean(remote) && res.data.created !== true;
      const state = remote ?? fresh(seat.grade, student);
      if (loaded) recordVisit(state, ctx.today);
      ctx.state = state;
      saveLink(ctx.linkStorage, enteredLink(res.data, 'class'));
      forget();
      ctx.save();
      connectSync(ctx, { base: ctx.api, storage: ctx.linkStorage, buildReport });
      ctx.go('home', loaded ? {} : { firstTime: true });
      const note = enterNote({ loaded: Boolean(loaded), village: VILLAGE_NAME[state.town.kind] });
      if (note) showNote(note);
      ctx.sync?.now();
    };
    if (!kind && !fromServer(res.data.state)) {
      show('village', [h('h1', { class: 'lead' }, '어느 마을에서 시작할까요?'), villages(arrive)]);
    } else arrive();
  }
  function grade() {
    const go = h('button', { class: 'primary go', disabled: !soloGrade, onclick: () => {
      clearLink(ctx.linkStorage); clearLost(ctx.linkStorage);
      ctx.state = fresh(soloGrade);
      forget(); ctx.save(); ctx.go('home', { firstTime: true });
    } }, '시작하기');
    show('grade', [h('h1', { class: 'lead' }, '몇 학년이에요?'), gradeButtons(g => {
      soloGrade = g; remember('grade', { soloGrade }); go.disabled = false;
    }, soloGrade), h('p', { class: 'continue-hint' }, '반 없이 시작하면 이 기기에만 저장돼요.'), go],
    links(button('반 코드 넣기로 돌아가기', form)));
    if (!kind) {
      show('village', [h('h1', { class: 'lead' }, '어느 마을에서 시작할까요?'), villages(grade)]);
    }
  }
  if (draft.step === 'class' || ['continue', 'pics', 'key-entry'].includes(draft.step)) form();
  else if (kind && draft.step === 'grade') grade();
  else home();
  return root;
}
