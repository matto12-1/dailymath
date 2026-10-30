// 선생님·관리 화면이 같이 쓰는 틀(2026-10-22 오후 결정, code.xr 「Dashboard V14」 결): 맨 위 줄(알약들)과 왼쪽 얇은 아이콘 줄.
// - 아이콘 단추: 글 이름은 화면 읽개용으로 단추 안에 두고(.s-sr), 보이는 이름표는 마우스·초점일 때 CSS가 data-tip으로 띄운다.
//   그림은 CSS 마스크(.s-i-* class의 --icon). 생김새는 staff.css.
// - 맨 위 줄 높이를 재어 html의 --s-top-h로 둔다(선생님 아이별 표가 남은 높이 안에서만 내려가게, teacher.css).
import { h } from './ui.js?v=9a67f36b25';
import { privacyLink } from './lab.js?v=9a67f36b25';

// tag 'a'면 링크(href), 'button'이면 단추(onclick). icon은 staff.css·각 쪽 CSS의 .s-i-<icon>
export function railButton({ tag = 'button', label, icon, className = '', ...attrs }) {
  const props = { class: `s-rail-btn s-i-${icon} ${className}`.trim(), 'data-tip': label, ...attrs };
  if (tag === 'button') props.type = 'button';
  return h(tag, props, h('span', { class: 's-sr' }, label));
}

// 개인정보 안내(Ruling R39)를 아이콘 단추로: privacyLink()의 a.privacy-link 그대로, 글은 화면 읽개용
export function railPrivacy() {
  const link = privacyLink();
  const text = link.textContent;
  link.classList.add('s-rail-btn', 's-i-privacy');
  link.dataset.tip = text;
  link.replaceChildren(h('span', { class: 's-sr' }, text));
  return link;
}

// 왼쪽 줄 묶음 하나(흰 알약). 빈 칸(null)은 건너뛴다
export const railGroup = (...items) => h('div', { class: 's-pill s-rail-group' }, ...items.filter(Boolean));

// 맨 위 줄 높이 → --s-top-h(바뀔 때마다)
export function watchTopHeight(top) {
  const set = () => document.documentElement.style.setProperty('--s-top-h', `${Math.ceil(top.getBoundingClientRect().height)}px`);
  set();
  if (typeof ResizeObserver === 'function') new ResizeObserver(set).observe(top);
  else addEventListener('resize', set);
}
