// 선생님과 관리자의 아이디 로그인 · 처음 비밀번호 바꾸기 · 「비밀번호를 잊었어요」(계정 열쇠, 설계서 4-2). 구글 글을 불러오지 않는다.
// 처음 바꾸기와 잊었어요는 서버가 새 계정 열쇠를 돌려준다: entered({ key })로 넘기면 부른 쪽이 열쇠 카드(account-key.js)를 띄운다.
import { h } from './ui.js?v=9a67f36b25';
import { call } from './net.js?v=9a67f36b25';
import { busy } from './teacher/session.js?v=9a67f36b25';
import { msgLine, say } from './teacher/say.js?v=9a67f36b25';
import { teacherMessage, PASSWORD_LOCKED, CREDENTIALS, PASSWORD_RULE, PASSWORD_TWICE, keyResetMessage } from './teacher/text.js?v=9a67f36b25';

const field = (label, input) => h('label', { class: 'p-field' }, h('span', {}, label), input);
const loginIdInput = () => h('input', { name: 'loginId', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false', maxlength: '20', required: true });
const newPassword = (name) => h('input', { name, type: 'password', autocomplete: 'new-password', minlength: '8', maxlength: '256', required: true });

// onForgot이 있으면 [로그인] 옆에 [비밀번호를 잊었어요](좁으면 아래로 내려간다)
export function passwordLoginForm({ api, session, entered, onForgot = null }) {
  const id = loginIdInput();
  const password = h('input', { name: 'password', type: 'password', autocomplete: 'current-password', maxlength: '256', required: true });
  const msg = msgLine();
  const go = h('button', { type: 'submit', class: 'primary' }, '로그인');
  const forgot = onForgot ? h('button', { type: 'button', class: 'p-link', onclick: () => onForgot() }, '비밀번호를 잊었어요') : null;
  const form = h('form', { class: 'p-form' }, field('아이디', id), field('비밀번호', password), forgot ? h('div', { class: 'p-row' }, go, forgot) : go, msg);
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

// 처음 비밀번호 바꾸기: 되면 entered({ key })(처음 바꾸면 서버가 계정 열쇠를 준다)
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
      entered({ key: typeof res.data.key === 'string' ? res.data.key : null });
      return;
    }
    say(msg, res.data?.error === 'password-same' ? '처음 비밀번호와 다른 비밀번호를 써 주세요.' : res.data?.error === 'password-rule'
      ? PASSWORD_RULE : teacherMessage('password', res), 'bad');
  });
  return form;
}

// 「비밀번호를 잊었어요」: 아이디 · 계정 열쇠 · 새 비밀번호 두 번. 맞으면 바로 로그인하고 entered({ key })(쓴 열쇠는 새 열쇠로 바뀐다).
// 틀리면 어느 쪽이 틀렸는지 말하지 않는다. 열쇠가 잠기면 [운영자 연락처](onContact)를 보인다. [로그인으로]는 onBack.
export function passwordResetForm({ api, session, entered, onBack, onContact }) {
  const id = loginIdInput();
  const key = h('input', { name: 'accountKey', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false', maxlength: '64', required: true, placeholder: '예: 구름 연필 47' });
  const password = newPassword('newPassword'), confirm = newPassword('confirmPassword');
  const msg = msgLine();
  const go = h('button', { type: 'submit', class: 'primary' }, '새 비밀번호 정하기');
  const contact = h('button', { type: 'button', class: 'p-link', hidden: true, onclick: () => onContact() }, '운영자 연락처');
  const back = h('button', { type: 'button', class: 'p-link', onclick: () => onBack() }, '로그인으로');
  const form = h('form', { class: 'p-form' }, field('아이디', id), field('계정 열쇠', key), field('새 비밀번호', password), field('한 번 더 넣기', confirm), h('div', { class: 'p-row' }, go, back), msg, contact);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (password.value !== confirm.value) { say(msg, PASSWORD_TWICE, 'bad'); return; }
    const body = { loginId: id.value, key: key.value, newPassword: password.value, confirmPassword: confirm.value };
    const res = await busy(go, '정하는 중…', () => call(api, '/v1/teacher/password-reset', { body }));
    if (!form.isConnected) return;
    if (res.ok && typeof res.data?.token === 'string' && typeof res.data.key === 'string') {
      session.keep(res.data);
      key.value = ''; password.value = ''; confirm.value = '';
      entered({ key: res.data.key });
      return;
    }
    const said = keyResetMessage(res);
    say(msg, said.text, 'bad');
    contact.hidden = !said.contact;
  });
  return form;
}
