// 「내 계정」 시트(설계서 4-2): 아이디 · 학교 · 학년 반, [새 열쇠 받기](알림과 지금 비밀번호 뒤 열쇠 카드), [비밀번호 바꾸기](지금 + 새 두 번).
// 선생님 · 관리 화면 맨 위 계정 칸(단추)이 연다. 비밀번호를 바꾸면 서버가 다른 기기의 로그인을 모두 풀고 이 기기에는 새 로그인을 준다
// (session.keep 뒤 onSignedIn). 부르는 동안과 새 열쇠 카드가 떠 있는 동안은 시트를 잠근다(✕ · Esc · 바깥). 닫으면 적은 비밀번호를 비우고 onClose.
// 로그인이 풀리면(401) 부른 쪽이 로그인 화면으로 가며 돌려받은 close()로 닫는다.
import { h } from './ui.js?v=9a67f36b25';
import { openSheet } from './sheet.js?v=9a67f36b25';
import { lockSheet } from './sheet-lock.js?v=9a67f36b25';
import { busy } from './teacher/session.js?v=9a67f36b25';
import { msgLine, say } from './teacher/say.js?v=9a67f36b25';
import { keyCard } from './account-key.js?v=9a67f36b25';
import { teacherMessage, classLabel, changeMessage, NEW_KEY_WARN, NEW_KEY_DONE, PASSWORD_CHANGED, PASSWORD_TWICE } from './teacher/text.js?v=9a67f36b25';

const field = (label, input) => h('label', { class: 'p-field' }, h('span', {}, label), input);
const secret = (name, autocomplete) => h('input', { name, type: 'password', autocomplete, minlength: name === 'currentPassword' ? null : '8', maxlength: '256', required: true });

export function openMyAccount({ session, teacher, onSignedIn = () => {}, onClose = () => {} }) {
  const body = h('div', { class: 'my-body' });
  const title = h('h2', { tabindex: '-1' }, '내 계정');
  const typed = []; // 시트를 닫으면 비울 비밀번호 칸
  let unlockCard = null; // 새 열쇠 카드가 떠 있는 동안의 시트 잠금을 푸는 함수(로그인이 풀려 부른 쪽이 닫을 때도 푼다)
  const close = openSheet(document.body, { label: '내 계정', className: 'my-sheet', onClose: () => { unlockCard?.(); for (const input of typed) input.value = ''; onClose(); } }, title, body);
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
      h('div', { class: 'my-actions' }, h('button', { type: 'button', onclick: askKey }, '새 열쇠 받기'), h('button', { type: 'button', onclick: changeForm }, '비밀번호 바꾸기')),
      msgLine(notice, notice ? 'ok' : ''));
  }

  // [새 열쇠 받기]: 지금 열쇠를 못 쓰게 된다고 알리고, 지금 비밀번호를 확인한 뒤 받는다(로그인된 채 둔 컴퓨터에서 남이 받지 못하게, 최종 검토 I1)
  function askKey() {
    const current = secret('currentPassword', 'current-password');
    typed.push(current);
    const ok = h('button', { type: 'submit', class: 'primary' }, '새 열쇠 받기');
    const cancel = h('button', { type: 'button', onclick: () => { home(); title.focus(); } }, '그만두기');
    const note = msgLine();
    const form = h('form', { class: 'p-form my-form' }, h('p', { class: 'my-warn' }, NEW_KEY_WARN), field('지금 비밀번호', current),
      h('div', { class: 'my-actions' }, ok, cancel), note);
    body.replaceChildren(form);
    current.focus();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const res = await sending([ok, cancel], '받는 중…', '/v1/teacher/key', { body: { currentPassword: current.value } });
      if (!res) return;
      if (!res.ok || typeof res.data?.key !== 'string') {
        say(note, res.status === 403 || res.status === 429 ? changeMessage(res) : teacherMessage('key', res), 'bad'); // 틀림 · 잠김은 비밀번호 바꾸기와 같은 글
        return;
      }
      current.value = '';
      // 한 번만 보이는 열쇠: [다 적었어요]를 누를 때까지 시트를 닫지 못하게(최종 검토 M1). 카드 단추는 잠근 뒤에 생겨서 막히지 않는다
      unlockCard = lockSheet(body.closest('.sheet'));
      const done = () => { unlockCard(); unlockCard = null; home(NEW_KEY_DONE); title.focus(); };
      body.replaceChildren(keyCard({ loginId: teacher.loginId, key: res.data.key, title: '새 계정 열쇠를 받았어요', onDone: done }));
      body.querySelector('.k-card h2')?.focus();
    });
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
