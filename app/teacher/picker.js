// 맨 위 줄의 반 고르기(2026-10-22 오후 결정, V14 결): 「5학년 3반 ▾」 단추를 누르면 아래로 목록(다른 반 · 모든 반 · 새 반 만들기)이 펼쳐진다.
// 펼치고 접는 단추(aria-expanded)와 링크 목록이다. 펼치면 초점은 지금 반(없으면 첫 링크)으로, 위·아래 화살표로 옮긴다.
// Esc로 접으면 초점은 단추로 돌아간다. 바깥을 누르거나 초점이 밖으로 나가면 접는다. 링크를 누르면 접고 주소가 바뀐다(main.js가 화면을 연다).
// 머리를 다시 그릴 때마다 새로 만들고, 옛것은 destroy()로 푼다.
import { h } from '../ui.js?v=9a67f36b25';

let seq = 0;

// label = 단추 글, items = [{ href, label, current, tag }] · 칸막이는 'gap'
export function classPicker({ label, items }) {
  const id = `t-pick-${++seq}`;
  const button = h('button', { type: 'button', class: 't-pick-btn', 'aria-expanded': 'false', 'aria-controls': id },
    h('span', { class: 't-pick-text' }, label));
  const links = [];
  const list = h('ul', { class: 't-pick-list', id, hidden: true, 'aria-label': '반 고르기' }, items.map((item) => {
    if (item === 'gap') return h('li', { class: 't-pick-gap', role: 'separator' });
    const link = h('a', { class: `t-pick-item ${item.className ?? ''}`.trim(), href: item.href, 'aria-current': item.current ? 'page' : null },
      h('span', { class: 't-pick-name' }, item.label), item.tag ? h('span', { class: 't-pick-tag' }, item.tag) : null);
    link.addEventListener('click', () => hide({ focus: false }));
    links.push(link);
    return h('li', {}, link);
  }));
  const el = h('div', { class: 't-pick' }, button, list);

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  function show() {
    if (isOpen()) return;
    button.setAttribute('aria-expanded', 'true');
    list.hidden = false;
    document.addEventListener('pointerdown', outside, true);
    (links.find((a) => a.getAttribute('aria-current') === 'page') ?? links[0])?.focus({ preventScroll: true });
  }
  function hide({ focus = true } = {}) {
    if (!isOpen()) return;
    button.setAttribute('aria-expanded', 'false');
    list.hidden = true;
    document.removeEventListener('pointerdown', outside, true);
    if (focus) button.focus({ preventScroll: true });
  }
  function outside(event) {
    if (!el.contains(event.target)) hide({ focus: false });
  }
  button.addEventListener('click', () => (isOpen() ? hide() : show()));
  el.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      hide();
      return;
    }
    if (event.key === 'ArrowDown' && !isOpen() && event.target === button) {
      event.preventDefault();
      show();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || !isOpen()) return;
    event.preventDefault();
    const at = links.indexOf(document.activeElement);
    const next = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: links.length - 1 }[event.key];
    links[(next + links.length) % links.length]?.focus();
  });
  el.addEventListener('focusout', (event) => {
    if (isOpen() && event.relatedTarget && !el.contains(event.relatedTarget)) hide({ focus: false });
  });
  return {
    el,
    destroy() { document.removeEventListener('pointerdown', outside, true); },
  };
}
