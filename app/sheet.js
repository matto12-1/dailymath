// 지도와 마을이 같이 쓰는 아래 창. 닫을 때 연 단추로 초점을 돌린다.
import { h } from './ui.js?v=9a67f36b25';

export function openSheet(root, { label, onClose, className = '' }, ...children) {
  const opener = document.activeElement;
  const siblings = [...root.children].map((node) => [node, node.inert]);
  siblings.forEach(([node]) => { node.inert = true; });
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', keydown);
    overlay.remove();
    siblings.forEach(([node, inert]) => { node.inert = inert; });
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    onClose?.();
  };
  const panel = h('section', {
    class: `sheet ${className}`, role: 'dialog', 'aria-modal': 'true', 'aria-label': label, tabindex: '-1',
  }, h('button', { class: 'sheet-close', 'aria-label': '닫기', onclick: close }, '✕'), ...children);
  const overlay = h('div', { class: 'sheet-backdrop', onclick: (e) => { if (e.target === overlay) close(); } }, panel);
  function keydown(e) {
    // 창을 닫지 않고 화면을 바꾸면(ctx.go) 창이 떨어져 나간다. 그때는 Tab을 붙잡지 않고 스스로 거둔다.
    if (!overlay.isConnected) { close(); return; }
    // 위에 다른 창이 열려 이 창이 막혀(inert) 있으면 키는 위 창의 몫이다. 관리 「계정 만들기 확인」의 Esc가 아래 만들기 창까지 닫으면
    // 두 창이 막아 둔 것을 거꾸로 되돌려 화면이 막힌 채 남는다(최종 검토 M4)
    if (overlay.closest('[inert]')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key !== 'Tab') return;
    const targets = [...panel.querySelectorAll('button, a[href], input, [tabindex="0"]')].filter((node) => !node.disabled && node.getClientRects().length);
    const first = targets[0], last = targets.at(-1);
    if (!first) { e.preventDefault(); panel.focus(); }
    else if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || document.activeElement === panel)) { e.preventDefault(); first.focus(); }
  }
  root.append(overlay);
  document.addEventListener('keydown', keydown);
  panel.focus({ preventScroll: true });
  return close;
}

// 한 판·집중 훈련의 「그만하기」: 푼 문제가 있으면 한 번 묻는다(검수 P-012, 10-20 Matto 「한 번 묻기」).
export function confirmStop(answered, stop) {
  if (!answered) return stop();
  const close = openSheet(document.getElementById('app'), { label: '여기서 그만할까요?', className: 'stop-sheet' },
    h('h2', {}, '여기서 그만할까요?'),
    h('p', { class: 'sub' }, `지금까지 푼 ${answered}문제는 기록돼요.`),
    h('div', { class: 'actions' },
      h('button', { class: 'primary', onclick: () => close() }, '계속 풀기'),
      h('button', { onclick: () => { close(); stop(); } }, '그만하기')));
}
