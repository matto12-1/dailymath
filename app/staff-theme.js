// 선생님·관리 화면의 밝기 단추(2026-10-22 결정, 생김새는 오후 결정의 V14 결). 처음 판은 theme.js가 그리기 전에 html[data-theme]에 달아 둔다.
// 단추를 누르면 판을 바꾸고 이 기기에 남긴다(저장이 막혀도 이 창에서는 바뀐다). 단추는 켜고 끄는 스위치(role=switch):
// 「어두운 화면」이 켜졌는지(aria-checked)를 화면 읽개가 읽는다. 컴퓨터 설정이 바뀌어 판이 바뀌어도 단추가 따라간다.
// 생김새는 해와 달이 위아래로 든 알약 하나(staff.css .s-theme). 바꿀 때 누른 단추 자리에서 새 판이 원으로 퍼진다(View Transitions API).
// 브라우저에 그 기능이 없거나 움직임 줄이기 설정이면 바로 바뀐다.
import { h } from './ui.js?v=9a67f36b25';

export const THEME_KEY = 'dailymath.staff.theme';
const root = document.documentElement;
const current = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
const storage = () => { try { return globalThis.localStorage ?? null; } catch { return null; } };
const TIP = { light: '어두운 화면으로', dark: '밝은 화면으로' };

const switches = new Set();
const sync = () => {
  for (const button of switches) {
    if (!button.isConnected) switches.delete(button);
    else {
      button.setAttribute('aria-checked', String(current() === 'dark'));
      button.dataset.tip = TIP[current()];
    }
  }
};
new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

// 판을 바꾸는 동안(두 그림 틀) 색 넘김을 끈다(staff.css .s-theme-turning): 단추·알약이 옛 판 색에서 0.12~0.2초 동안 넘어가면
// 원 안에 그 사이 회색이 비친다(2026-10-22 밤, 원 퍼짐 가운데를 멈춰 찍어 봄). 원 안은 처음부터 새 판 색이다
function apply(next, store) {
  root.classList.add('s-theme-turning');
  root.setAttribute('data-theme', next);
  try { store?.setItem(THEME_KEY, next); } catch { /* 저장이 막히면 이 창에서만 */ }
  sync();
  const settle = globalThis.requestAnimationFrame ?? ((fn) => setTimeout(fn, 16));
  settle(() => settle(() => root.classList.remove('s-theme-turning')));
}

// from(누른 단추)을 주면 그 자리에서 원이 퍼지며 바뀐다
export function setTheme(theme, store = storage(), from = null) {
  const next = theme === 'dark' ? 'dark' : 'light';
  const still = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!from || still || typeof document.startViewTransition !== 'function') {
    apply(next, store);
    return;
  }
  const box = from.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  let done = false;
  try {
    const turn = document.startViewTransition(() => {
      done = true;
      apply(next, store);
    });
    turn.ready.then(() => root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
      { duration: 520, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' },
    )).catch(() => {});
    turn.finished.catch(() => {}).finally(() => { if (!done) apply(next, store); });
  } catch {
    apply(next, store);
  }
}

// className은 쪽마다 자리 잡기용(선생님·관리 왼쪽 아이콘 줄)
export function themeSwitch(className = '') {
  const button = h('button', { type: 'button', role: 'switch', class: `s-theme ${className}`.trim(), 'aria-checked': String(current() === 'dark'), 'data-tip': TIP[current()] },
    h('span', { class: 's-sr' }, '어두운 화면'),
    h('span', { class: 's-theme-sun', 'aria-hidden': 'true' }),
    h('span', { class: 's-theme-moon', 'aria-hidden': 'true' }));
  button.addEventListener('click', () => setTheme(current() === 'dark' ? 'light' : 'dark', storage(), button));
  switches.add(button);
  return button;
}
