// 계정 열쇠 카드(설계서 4-2): 처음 비밀번호를 바꾸거나 · 열쇠로 비밀번호를 새로 정하거나 · 「내 계정」에서 새로 받으면 한 번 보인다.
// 크게, 낱말 사이를 띄워서. [인쇄] [베끼기] [다 적었어요]. [다 적었어요](onDone)만 다음으로 간다. 다시 보기는 없다(서버는 바꾼 값만 둔다).
// 인쇄는 카드 사본을 쪽 맨 끝(.k-print)에 붙이고 body[data-printing="key"]일 때 그것만 찍는다(staff.css, 어두운 판이어도 흰 바탕).
import { h } from './ui.js?v=9a67f36b25';
import { msgLine, say } from './teacher/say.js?v=9a67f36b25';
import { KEY_LEAD, KEY_COPIED, KEY_COPY_BY_HAND } from './teacher/text.js?v=9a67f36b25';

function printKey(card) {
  document.querySelector('body > .k-print')?.remove();
  const copy = h('div', { class: 'k-print' }, card.cloneNode(true));
  document.body.append(copy);
  document.body.dataset.printing = 'key';
  const done = () => {
    window.removeEventListener('afterprint', done);
    copy.remove();
    delete document.body.dataset.printing;
  };
  window.addEventListener('afterprint', done);
  window.print();
}

export function keyCard({ loginId, key, title = '계정 열쇠', onDone }) {
  const words = h('p', { class: 'k-key' }, key);
  const msg = msgLine();
  const card = h('section', { class: 'k-card', 'aria-label': title });
  const print = h('button', { type: 'button', onclick: () => printKey(card) }, '인쇄');
  // 베끼기가 막힌 창(주소가 https가 아니거나 허락이 없으면)은 열쇠 글을 골라 두고 직접 복사하게 한다
  const copy = h('button', { type: 'button', onclick: async () => {
    try {
      await navigator.clipboard.writeText(key);
      say(msg, KEY_COPIED, 'ok');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(words);
      const picked = getSelection();
      picked.removeAllRanges();
      picked.addRange(range);
      say(msg, KEY_COPY_BY_HAND, '');
    }
  } }, '베끼기');
  const done = h('button', { type: 'button', class: 'primary', onclick: () => onDone() }, '다 적었어요');
  card.append(h('h2', { tabindex: '-1' }, title), h('p', { class: 'k-lead' }, KEY_LEAD),
    h('dl', { class: 'k-facts' }, h('div', {}, h('dt', {}, '아이디'), h('dd', {}, h('code', {}, loginId))), h('div', {}, h('dt', {}, '계정 열쇠'), h('dd', {}, words))),
    h('div', { class: 'k-actions' }, print, copy, done), msg);
  return card;
}
