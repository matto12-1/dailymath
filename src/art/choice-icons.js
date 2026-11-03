// 긴 말 보기에 붙이는 그림표(검수 7번). 단추에는 그림표와 짧은 말을 두고, 읽어 주는 말(aria-label)은 원래 보기 그대로다.
// 돌리기는 가운데 점에서 시곗바늘이 휘어진 화살표를 따라 움직이고(흐린 바늘 → 주황 바늘), 뒤집기는 점선(거울 선) 양쪽에 같은 모양이 마주 본다.
const INK = '#8a6a55', SAGE = '#a8bfa0', ORANGE = '#e8a46a', PURPLE = '#a99bbd';
const icon = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
const mirror = (d) => `<path d="${d}" stroke-width="2.5" stroke-dasharray="3 5"/>`;
// 뒤집기: 처음 모양(연두)과 뒤집은 모양(주황).
const pair = (before, after) => `<path d="${before}" fill="${SAGE}"/><path d="${after}" fill="${ORANGE}"/>`;
// 돌리기: 가운데 점, 처음 바늘(위), 돌린 바늘, 휘어진 화살표와 화살촉.
const turn = (hand, arc, head) => `<path d="M24 24V11" stroke="${SAGE}" stroke-width="5"/><path d="${hand}" stroke="${ORANGE}" stroke-width="5"/><path d="${arc}" stroke-width="3.2"/><path d="${head}" fill="${INK}" stroke="none"/><circle cx="24" cy="24" r="3.5" fill="${INK}" stroke="none"/>`;
// 가능성: 불가능(왼쪽 끝)부터 확실(오른쪽 끝)까지 다섯 자리 눈금 위의 점. 눈금은 옆으로 길어 넓은 그림표로 둔다.
const chance = (i) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 28" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M10 14h52"/>${[10, 23, 36, 49, 62].map((x) => `<path d="M${x} 7v14" stroke-width="2.5"/>`).join('')}<circle cx="${10 + 13 * i}" cy="14" r="7.5" fill="${ORANGE}" stroke-width="2.5"/></svg>`;
const ICONS = {
  'weight-unit-g': icon(`<text x="24" y="35" font-family="Arial, sans-serif" font-size="34" text-anchor="middle" fill="${INK}" stroke="none">g</text>`),
  'weight-unit-kg': icon(`<text x="24" y="35" font-family="Arial, sans-serif" font-size="30" text-anchor="middle" fill="${INK}" stroke="none">kg</text>`),
  'weight-unit-t': icon(`<text x="24" y="35" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="${INK}" stroke="none">t</text>`),
  'arrow-up': icon(`<path d="M24 41V8M13 19 24 8l11 11" stroke="${ORANGE}" stroke-width="4"/>`),
  'arrow-down': icon(`<path d="M24 7v33M13 29l11 11 11-11" stroke="${ORANGE}" stroke-width="4"/>`),
  'arrow-left': icon(`<path d="M41 24H8M19 13 8 24l11 11" stroke="${ORANGE}" stroke-width="4"/>`),
  'arrow-right': icon(`<path d="M7 24h33M29 13l11 11-11 11" stroke="${ORANGE}" stroke-width="4"/>`),
  'flip-right': icon(mirror('M24 4v40') + pair('M20 9v30H6z', 'M28 9v30h14z')),
  'flip-up': icon(mirror('M4 24h40') + pair('M9 28h30L9 42z', 'M9 20h30L9 6z')),
  'flip-both': icon(mirror('M24 4v40M4 24h40') + pair('M20 28v14H7z', 'M28 20V6h13z')),
  'turn-cw-90': icon(turn('M24 24h13', 'M24 6a18 18 0 0 1 18 18', 'M42 31l-5.5-8.5h11z')),
  'turn-ccw-90': icon(turn('M24 24H11', 'M24 6A18 18 0 0 0 6 24', 'M6 31l-5.5-8.5h11z')),
  'turn-180': icon(turn('M24 24v13', 'M24 6a18 18 0 0 1 0 36', 'M17 42l8.5-5.5v11z')),
  perpendicular: icon(`<path d="M5 39h38M24 39V7"/><path d="M24 31h8v8" stroke-width="2"/>`),
  parallel: icon(`<path d="M5 16h38M5 32h38"/>`),
  neither: icon(`<path d="M5 35h38M15 44 33 6"/>`),
  'chance-0': chance(0), 'chance-1': chance(1), 'chance-2': chance(2), 'chance-3': chance(3), 'chance-4': chance(4),
  'graph-line': icon(`<path d="M8 7v33h34"/><path d="M13 31l8-10 8 5 9-14" stroke="${ORANGE}"/>${[[13, 31], [21, 21], [29, 26], [38, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${INK}" stroke="none"/>`).join('')}`),
  'graph-bar': icon(`<path d="M8 7v33h34"/><rect x="13" y="22" width="6" height="18" fill="${SAGE}" stroke-width="2"/><rect x="23" y="12" width="6" height="28" fill="${ORANGE}" stroke-width="2"/><rect x="33" y="27" width="6" height="13" fill="${PURPLE}" stroke-width="2"/>`),
  'graph-pie': icon(`<g stroke-width="2"><path d="M24 24V7a17 17 0 0 1 9.99 30.75z" fill="${SAGE}"/><path d="M24 24l9.99 13.75a17 17 0 0 1-26.16-8.5z" fill="${ORANGE}"/><path d="M24 24 7.83 29.25A17 17 0 0 1 24 7z" fill="${PURPLE}"/></g>`),
  'graph-picture': icon(`${[[12,16],[24,16],[36,16],[12,32],[24,32]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="${SAGE}" stroke-width="2"/>`).join('')}`),
};
export const CHOICE_ICONS = Object.keys(ICONS);
export const choiceIcon = (name) => ICONS[name] ?? null;
export const wideIcon = (name) => /^chance-/.test(name);
