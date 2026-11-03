// 내 계정: 아이디와 반 정보를 보고 비밀번호를 바꾼다.
import { h } from './ui.js?v=47133803ae';
import { openSheet } from './sheet.js?v=47133803ae';
import { lockSheet } from './sheet-lock.js?v=47133803ae';
import { busy } from './teacher/session.js?v=47133803ae';
import { msgLine, say } from './teacher/say.js?v=47133803ae';
import { teacherMessage, classLabel, changeMessage, PASSWORD_CHANGED, PASSWORD_TWICE } from './teacher/text.js?v=47133803ae';

const field = (label, input) => h('label', { class: 'p-field' }, h('span', {}, label), input);
const secret = (name, autocomplete) => h('input', { name, type: 'password', autocomplete, minlength: name === 'currentPassword' ? null : '8', maxlength: '256', required: true });

export function openMyAccount({ session, teacher, onSignedIn = () => {}, onClose = () => {} }) {
  const body = h('div', { class: 'my-body' });
  const title = h('h2', { tabindex: '-1' }, '내 계정');
  const typed = []; // 시트를 닫으면 비울 비밀번호 칸
  const close = openSheet(document.body, { label: '내 계정', className: 'my-sheet', onClose: () => { for (const input of typed) input.value = ''; onClose(); } }, title, body);
  // 부름 하나: 그동안 시트를 잠그고 단추를 막는다. 로그인이 풀렸거나(null) 시트가 닫혔으면 null
  async function sending(buttons, label, path, opts) {
    const unlock = lockSheet(body.closest('.sheet'));
    try {
      const res = await busy(buttons, label, () => session.send(path, opts));
      return res && body.isConnected ? res : null;
    } finally { unlock(); }
  }

  function home(notice = '') {
    const facts = [['아이디', teacher.loginId], ['학교', teacher.school], ['학년 반', classLabel(teacher)]].filter(([, value]) => value);
    body.replaceChildren(
      h('dl', { class: 'my-facts' }, facts.map(([name, value]) => h('div', {}, h('dt', {}, name), h('dd', {}, value)))),
      h('div', { class: 'my-actions' }, h('button', { type: 'button', onclick: changeForm }, '비밀번호 바꾸기')),
      msgLine(notice, notice ? 'ok' : ''));
  }

  // [비밀번호 바꾸기]: 지금 비밀번호 + 새 비밀번호 두 번
  function changeForm() {
    const current = secret('currentPassword', 'current-password'), next = secret('newPassword', 'new-password'), again = secret('confirmPassword', 'new-password');
    typed.push(current, next, again);
    const go = h('button', { type: 'submit', class: 'primary' }, '비밀번호 바꾸기');
    const back = h('button', { type: 'button', onclick: () => { home(); title.focus(); } }, '뒤로');
    const note = msgLine();
    const form = h('form', { class: 'p-form my-form' }, field('지금 비밀번호', current), field('새 비밀번호', next), field('한 번 더 넣기', again),
      h('div', { class: 'my-actions' }, go, back), note);
    body.replaceChildren(form);
    current.focus();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (next.value !== again.value) { say(note, PASSWORD_TWICE, 'bad'); return; }
      const res = await sending([go, back], '바꾸는 중…', '/v1/teacher/password/change', { body: { currentPassword: current.value, newPassword: next.value, confirmPassword: again.value } });
      if (!res) return;
      if (res.ok && typeof res.data?.token === 'string') {
        session.keep(res.data);
        for (const input of [current, next, again]) input.value = '';
        onSignedIn();
        home(PASSWORD_CHANGED);
        title.focus();
        return;
      }
      say(note, changeMessage(res), 'bad');
    });
  }

  home();
  return close;
}
