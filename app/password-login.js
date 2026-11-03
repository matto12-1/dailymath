// 선생님과 관리자 아이디 로그인과 처음 비밀번호 바꾸기.
import { h } from './ui.js?v=47133803ae';
import { call } from './net.js?v=47133803ae';
import { busy } from './teacher/session.js?v=47133803ae';
import { msgLine, say } from './teacher/say.js?v=47133803ae';
import { teacherMessage, PASSWORD_LOCKED, CREDENTIALS, PASSWORD_RULE, PASSWORD_TWICE } from './teacher/text.js?v=47133803ae';

const field = (label, input) => h('label', { class: 'p-field' }, h('span', {}, label), input);
const loginIdInput = () => h('input', { name: 'loginId', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false', maxlength: '20', required: true });
const newPassword = (name) => h('input', { name, type: 'password', autocomplete: 'new-password', minlength: '8', maxlength: '256', required: true });

export function passwordLoginForm({ api, session, entered }) {
  const id = loginIdInput();
  const password = h('input', { name: 'password', type: 'password', autocomplete: 'current-password', maxlength: '256', required: true });
  const msg = msgLine();
  const go = h('button', { type: 'submit', class: 'primary' }, '로그인');
  const form = h('form', { class: 'p-form' }, field('아이디', id), field('비밀번호', password), go, h('p', { class: 't-hint' }, '비밀번호를 잊으면 관리자 선생님께 말해 주세요'), msg);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const res = await busy(go, '로그인하는 중…', () => call(api, '/v1/teacher/password-login', { body: { loginId: id.value, password: password.value } }));
    if (!form.isConnected) return;
    password.value = '';
    if (res.ok && typeof res.data?.token === 'string') { session.keep(res.data); entered(); return; }
    say(msg, res.data?.error === 'password-locked' ? PASSWORD_LOCKED : res.status === 401 ? CREDENTIALS : teacherMessage('login', res), 'bad');
  });
  return form;
}

// 처음 비밀번호를 바꾸면 바로 들어간다.
export function passwordChangeForm({ session, entered }) {
  const password = newPassword('newPassword'), confirm = newPassword('confirmPassword');
  const go = h('button', { type: 'submit', class: 'primary' }, '비밀번호 바꾸기');
  const msg = msgLine();
  const form = h('form', { class: 'p-form' }, field('새 비밀번호', password), field('한 번 더 넣기', confirm), go, msg);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (password.value !== confirm.value) { say(msg, PASSWORD_TWICE, 'bad'); return; }
    const res = await busy(go, '바꾸는 중…', () => session.send('/v1/teacher/password', { body: { newPassword: password.value, confirmPassword: confirm.value } }));
    if (!res || !form.isConnected) return;
    if (res.ok && res.data?.token) {
      session.keep(res.data);
      password.value = ''; confirm.value = '';
      entered();
      return;
    }
    say(msg, res.data?.error === 'password-same' ? '처음 비밀번호와 다른 비밀번호를 써 주세요.' : res.data?.error === 'password-rule'
      ? PASSWORD_RULE : teacherMessage('password', res), 'bad');
  });
  return form;
}
