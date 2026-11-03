// 선생님·관리 화면의 계정 메뉴. 닫을 때 먼저 계정 단추로 초점을 돌려 시트도 이 단추로 돌아오게 한다.
import { h } from '../ui.js?v=47133803ae';
import { openSheet } from '../sheet.js?v=47133803ae';
import * as T from './text.js?v=47133803ae';

let seq = 0;

export function accountMenu({ loginId, name = '', className, canOpenMine, onMine, onLogout }) {
  const id = `account-menu-${++seq}`;
  const button = h('button', {
    type: 'button', class: `s-pill s-account ${className}`, title: [loginId, name].filter(Boolean).join('\n'),
    'aria-label': `${T.ACCOUNT_MENU} · ${loginId}`, 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-controls': id,
  }, h('span', { class: 's-account-avatar', 'aria-hidden': 'true' }),
  h('span', { class: 's-account-who' }, h('span', { class: 's-account-id' }, loginId),
    name ? h('span', { class: 's-account-name' }, name) : null),
  h('span', { class: 's-account-arrow', 'aria-hidden': 'true' }, '▾'));
  const items = [
    { label: T.ACCOUNT_MINE, disabled: !canOpenMine, run: onMine },
    { label: T.ACCOUNT_SWITCH, run: () => onLogout({ switchAccount: true }) },
    { label: T.ACCOUNT_LOGOUT, run: () => onLogout({ switchAccount: false }) },
  ].map(({ label, disabled, run }) => h('button', {
    type: 'button', role: 'menuitem', class: 's-account-item', tabindex: '-1', disabled,
    onclick: () => { hide(); run(); },
  }, label));
  const menu = h('div', { id, class: 's-account-list', role: 'menu', 'aria-label': T.ACCOUNT_MENU, hidden: true }, items);
  const el = h('div', { class: 's-account-menu' }, button, menu);
  const isOpen = () => !menu.hidden;
  const enabled = () => items.filter((item) => !item.disabled);
  function show(last = false) {
    if (button.disabled) return;
    const bottom = el.closest('header').getBoundingClientRect().bottom;
    menu.style.maxHeight = `${Math.max(44, innerHeight - bottom - 16)}px`;
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', outside, true);
    (last ? enabled().at(-1) : enabled()[0])?.focus();
  }
  function hide({ focus = true } = {}) {
    if (!isOpen()) return;
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', outside, true);
    if (focus) button.focus({ preventScroll: true });
  }
  function outside(event) {
    if (!el.contains(event.target)) hide();
  }
  button.addEventListener('click', () => isOpen() ? hide() : show());
  el.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      hide();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!isOpen()) { show(event.key === 'ArrowUp' || event.key === 'End'); return; }
      const list = enabled(), at = list.indexOf(document.activeElement);
      const next = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: list.length - 1 }[event.key];
      list[(next + list.length) % list.length]?.focus();
    } else if (event.key === 'Tab' && isOpen()) {
      // 메뉴 항목은 Tab 순서에서 빼고 계정 단추 다음(Shift면 이전)으로 자연스럽게 나간다.
      hide();
    }
  });
  el.addEventListener('focusout', (event) => {
    if (isOpen() && event.relatedTarget && !el.contains(event.relatedTarget)) hide({ focus: false });
  });
  return {
    el,
    setBusy(value) { button.disabled = value; if (value) hide(); },
    destroy() { hide({ focus: false }); },
  };
}

// logoutAsking이 쓰는 공용 확인 창. 이름 처리와 서버 로그아웃의 순서는 names.js가 그대로 맡는다.
export function askLogoutNames() {
  return new Promise((resolve) => {
    let picked = 'cancel';
    const pick = (value, label, primary = false) => h('button', {
      type: 'button', class: primary ? 'primary' : null, onclick: () => { picked = value; close(); },
    }, label);
    const close = openSheet(document.body, {
      label: T.LOGOUT_NAMES_TITLE, className: 'my-sheet t-sheet t-logout-sheet', onClose: () => resolve(picked),
    }, h('h2', {}, T.LOGOUT_NAMES_TITLE), h('p', { class: 'my-warn t-sheet-text' }, T.LOGOUT_NAMES_TEXT),
    h('div', { class: 'my-actions t-sheet-actions' },
      pick('clear', T.LOGOUT_CLEAR, true), pick('keep', T.LOGOUT_KEEP), pick('cancel', T.ACCOUNT_CANCEL)));
  });
}
