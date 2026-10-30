// 단추 그림 12개(설계서 7.1). 코드로 그린 SVG, 그림책 결(두툼한 갈색 선 + 팔레트 채움).
import { h } from './ui.js?v=9a67f36b25';

const svg = (body) => `<svg viewBox="0 0 48 48" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#fbf3e4" stroke="#4a3b30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ICONS = {
  compass: svg('<circle cx="24" cy="25" r="19" fill="#e8a46a"/><circle cx="24" cy="25" r="15" fill="#fffaf1"/><path d="m16 34 5-12L33 14l-6 13Z" fill="#5fb3d6"/><path d="m21 22 12-8-6 13Z" fill="#c9773a"/><path d="M22 5V2h4v3"/>'),
  house: svg('<path d="M10 22v20h28V22" fill="#fbf3e4"/><path d="M4 22 22 5q2-2 4 0l18 17-4 5L24 12 8 27Z" fill="#e8a46a"/><path d="M20 42V29h9v13" fill="#c9773a"/><path d="M12 28h4v5h-4Z" fill="#8fd3ea"/>'),
  book: svg('<path d="M24 10Q14 4 4 9v31q10-5 20 1 10-6 20-1V9Q34 4 24 10Z" fill="#a99bbd"/><path d="M24 11v29M9 14q5-1 10 2M9 21q5-1 10 2M9 28q5-1 10 2M29 16q5-3 10-2M29 23q5-3 10-2M29 30q5-3 10-2" fill="none"/>'),
  star: svg('<path d="M22 5q2-4 4 0l4 10 11 1q5 0 1 4l-8 8 2 12q1 4-3 2l-9-6-10 6q-4 2-3-2l2-12-8-8q-4-4 1-4l12-1Z" fill="#e8a46a"/><path d="m20 18 3-7" stroke="#fffaf1"/>'),
  fish: svg('<path d="M35 15 44 9v27l-9-6C25 44 5 34 4 23 7 11 25 3 35 15Z" fill="#5fb3d6"/><path d="m18 9 4-5 7 5M18 36l5 6 6-6" fill="#8fd3ea"/><circle cx="12" cy="21" r="1.5" fill="#4a3b30" stroke="none"/><path d="M25 16q-5 8 0 15" fill="none"/>'),
  bone: svg('<path d="M11 9C4 2 0 13 7 17l5 2 16 17v5c3 9 14 4 11-3 8 1 10-10 2-12h-5L20 11l-1-5C15-2 6 2 11 9Z" fill="#fffaf1"/><path d="m16 17 14 14" stroke="#e8a46a"/>'),
  brush: svg('<path d="M23 25 36 5q3-4 7-1 3 3 0 6L28 30Z" fill="#e8a46a"/><path d="m22 23 9 7-5 6-9-7Z" fill="#a99bbd"/><path d="M18 29c-13-1-5 12-15 14 17 5 25-2 22-10Z" fill="#a8bfa0"/>'),
  cards: svg('<rect x="4" y="7" width="28" height="35" rx="4" transform="rotate(-9 18 24)" fill="#a8bfa0"/><rect x="14" y="5" width="29" height="36" rx="4" transform="rotate(7 28 23)" fill="#fffaf1"/><path d="m29 13 3 6 6 1-5 5 1 7-6-4-6 3 2-7-4-5 7-1Z" fill="#e8a46a"/>'),
  map: svg('<path d="m4 10 13-5 14 6 13-5v33l-13 5-14-6-13 5Z" fill="#a8bfa0"/><path d="M17 5v33l14 6V11Z" fill="#fbf3e4"/><path d="m9 30 5-7 10 5 13-13" fill="none" stroke-dasharray="3 4"/><path d="m34 13 6 5m0-5-6 5" fill="none"/>'),
  back: svg('<path d="M22 7 4 23l18 17V30h8q10 0 14 9V24q-2-10-14-10h-8Z" fill="#e8a46a"/>'),
  flag: svg('<path d="M10 43V6" fill="none"/><path d="M11 8c10-8 17 7 30 1l-4 17c-12 7-17-7-26-1Z" fill="#a8bfa0"/><circle cx="10" cy="5" r="3" fill="#e8a46a"/><path d="M6 44h9"/>'),
  target: svg('<circle cx="23" cy="26" r="19" fill="#e8a46a"/><circle cx="23" cy="26" r="13" fill="#fffaf1"/><circle cx="23" cy="26" r="6" fill="#a8bfa0"/><path d="m23 26 16-17M34 5v9h9l-1-9Z" fill="#a99bbd"/>'),
};

export const icon = (name) => h('span', { class: 'icon', html: ICONS[name] });

// 장소 창 단계 줄의 표시(넘김 ✓·잠김). 단추 그림 12개와 따로 둔다. 같은 선·같은 색.
export const MARKS = {
  check: svg('<circle cx="24" cy="24" r="20" fill="#a8bfa0"/><path d="m14 25 7 7 13-15" fill="none" stroke-width="5"/>'),
  lock: svg('<path d="M16 22v-7a8 8 0 0 1 16 0v7" fill="none" stroke-width="4"/><rect x="10" y="21" width="28" height="22" rx="5" fill="#e8a46a"/><path d="M24 29v6" stroke-width="4"/>'),
};
export const mark = (name) => h('span', { class: `icon mark mark-${name}`, html: MARKS[name] });
