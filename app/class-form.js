// 들어오기(screens/welcome.js)와 탐험 일지 「반에 들어가기」(record-link.js)가 같이 쓰는 반 칸과 그 조각:
// 반 칸(classForm), 학년 단추(gradeButtons), 이름 붙은 칸(field), 서버 글을 한 문장씩 한 줄로(warnLine).
// 모양은 app.css(.welcome-class-layout 등)와 link.css(.link-sheet 안).
import { h } from './ui.js?v=9a67f36b25';
import { checkStudent } from '../src/game/study.js?v=9a67f36b25';
import { AGAIN, BUSY, sentenceLines } from './entry-text.js?v=9a67f36b25';

// 숫자만 남긴 뒤 자른다(붙여 넣은 '123-456'이 글자 수 제한에 먼저 잘리지 않게)
const digits = (max) => (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, max); };
const toInt = (el) => (/^\d+$/.test(el.value) ? Number(el.value) : NaN);

export const field = (label, control, hint = null, wide = false) =>
  h(control.tagName === 'INPUT' ? 'label' : 'div', { class: `field${wide ? ' wide' : ''}` }, h('span', {}, label), control, hint && h('small', {}, hint));

// 서버 글은 한 문장씩 한 줄(link.css .warn.sentences)
export const warnLine = (text) => h('p', { class: 'warn sentences' }, sentenceLines(text));

export const gradeButtons = (onPick, picked = null) => {
  const box = h('div', { class: 'grades' });
  box.append(...[1, 2, 3, 4, 5, 6].map((g) => h('button', {
    type: 'button',
    class: g === picked ? 'primary' : null,
    'aria-pressed': String(g === picked),
    onclick: (e) => {
      box.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('primary', b === e.currentTarget);
        b.setAttribute('aria-pressed', String(b === e.currentTarget));
      });
      onPick(g);
    },
  }, `${g}학년`)));
  return box;
};

// 반 칸: 반 코드·학년·반·번호.
// mode = 'start' | 'continue' | 'attach'(data-mode). submit = 단추 글, value = 처음 채울 값, message = 처음 보일 글.
// onCheck(st)는 형식이 맞을 때만 부른다(st = { classCode, grade, classNo, number }). 글(또는 글 목록)을 돌려주면 칸 아래에 보이고,
// 약속을 돌려주면 기다리는 동안 단추를 「확인하는 중…」으로 막는다. 화면을 넘기면 아무것도 돌려주지 않는다.
// onCheck·message의 글(서버 글)은 한 문장씩 한 줄로, 형식 확인 글(checkStudent)은 지금 그대로 보인다.
export function classForm({ mode = 'start', onCheck, onChange, submit = '다음', value = {}, message = null } = {}) {
  let grade = value.grade ?? null;
  const code = h('input', { inputmode: 'numeric', autocomplete: 'off', placeholder: '숫자 6개', oninput: digits(6) });
  const classNo = h('input', { inputmode: 'numeric', autocomplete: 'off', oninput: digits(2) });
  const number = h('input', { inputmode: 'numeric', autocomplete: 'off', oninput: digits(2) });
  code.value = value.classCode ?? '';
  classNo.value = value.classNo ?? '';
  number.value = value.number ?? '';
  const errs = h('div', { class: 'errs', 'aria-live': 'polite' });
  const warn = (list) => errs.replaceChildren(...[list].flat().map((t) => h('p', { class: 'warn' }, t)));
  const say = (list) => errs.replaceChildren(...[list].flat().map(warnLine));
  const changed = () => {
    errs.replaceChildren();
    onChange?.({ classCode: code.value, grade, classNo: classNo.value, number: number.value });
  };
  const go = h('button', { type: 'submit', class: 'primary go' }, submit);
  async function send() {
    if (go.disabled) return;
    const st = { classCode: code.value, grade, classNo: toInt(classNo), number: toInt(number) };
    const list = checkStudent(st);
    if (list.length) return warn(list);
    const out = onCheck?.(st);
    if (!out || typeof out.then !== 'function') {
      if (out) say(out);
      return;
    }
    errs.replaceChildren();
    go.disabled = true;
    go.textContent = BUSY;
    let result;
    try {
      result = await out;
    } catch (err) {
      console.error(err);
      result = AGAIN;
    }
    go.disabled = false;
    go.textContent = submit;
    if (result) say(result);
  }
  if (message) say(message);
  // 고치기 시작하면 지난 안내를 걷는다
  return h('form', { class: 'welcome-class-layout', 'data-mode': mode, oninput: changed,
    onsubmit: (e) => { e.preventDefault(); send(); } },
    h('div', { class: 'class-details' },
      h('div', { class: 'class-code' }, field('반 코드', code, '선생님께 받은 숫자 6개', true)),
      h('div', { class: 'class-grades' }, field('학년', gradeButtons((g) => { grade = g; changed(); }, grade), null, true)),
      h('div', { class: 'class-numbers' }, field('반', classNo), field('번호', number)),
      errs,
      go));
}
