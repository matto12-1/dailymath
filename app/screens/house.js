import { h } from '../ui.js?v=9a67f36b25';
import { watchSceneImages } from '../backdrop.js?v=9a67f36b25';
import { matchDemoVillageKind } from '../../src/game/village-demo-data.js?v=9a67f36b25';
import { icon } from '../icons.js?v=9a67f36b25';
import { HOUSES } from '../art/village-data.js?v=9a67f36b25';
import { BASES } from '../art/bases.js?v=9a67f36b25';
import { homes, whereToday } from '../../src/game/village.js?v=9a67f36b25';
import { residentThing } from './village.js?v=9a67f36b25';
import { houseResidentScale } from '../../src/game/village-pan.js?v=9a67f36b25';

export function house(ctx, { house: id } = {}) {
  if (ctx.demo) matchDemoVillageKind(ctx.state);
  const s = ctx.state, kind = s.town.kind, itemId = 'house-' + id;
  const art = HOUSES[kind][id];
  if (!art) {
    const frame = requestAnimationFrame(() => ctx.go('village'));
    ctx.cleanup = () => cancelAnimationFrame(frame);
    return h('section', { class: 'screen house-scene' });
  }
  const today = whereToday(s, ctx.units, ctx.today);
  const household = homes(s, ctx.units).houses.find(home => home.id === id);
  const present = today.houses.find(home => home.id === id).home;
  let alive = true, closeSheet = null;
  const openCard = async (resident, where) => {
    const { residentCard } = await import('./residents.js?v=9a67f36b25');
    if (!alive) return;
    closeSheet?.(); closeSheet = residentCard(ctx, resident, where);
  };
  const residentHeight = itemId === 'house-small' ? 20 : 16;
  // 투명 여백까지 포함한 가장 넓은 주민 반 폭. 어느 주민이 쉬어도 가장자리 12px을 남긴다.
  const halfWidth = Math.max(...BASES.residents[kind].map(box =>
    residentHeight / (box.b - box.t) * Math.max((box.l + box.r) / 2, 100 - (box.l + box.r) / 2))) / 100;
  const xs = art.seats.map(point => point.x / 100), left = Math.min(...xs), right = Math.max(...xs);
  const seats = present.map((resident, i) => {
    const seat = household.residents.findIndex(r => r.id === resident.id);
    const node = residentThing(kind, resident, art.seats[seat], residentHeight, today.where[resident.id], openCard);
    node.classList.add('seated');
    for (const key of ['--size', '--bw', '--bh']) node.style.setProperty(key, `calc(${node.style.getPropertyValue(key)} * var(--house-resident-scale, 1))`);
    return node;
  });
  const note = !household.residents.length ? '빈 집이에요. 새 주민이 오면 여기서 쉬어요' : !present.length ? '다들 광장에 나가 놀아요' : null;
  const occupiedSeats = present.map(resident => art.seats[household.residents.findIndex(r => r.id === resident.id)]);
  const seatBottom = Math.max(...(occupiedSeats.length ? occupiedSeats : art.seats).map(point => point.y / 100));
  const root = h('section', { class: 'screen house-scene', 'data-item': itemId, 'data-house': id, 'data-kind': kind,
    style: `--wall:${art.wall};--seat-span:${right - left + halfWidth * 2};--seat-center:${(left + right) / 2};--seat-bottom:${seatBottom}` },
    h('div', { class: 'stage house-room' }, h('img', { class: 'house-art', src: art.img, alt: '', width: art.w, height: art.h }), ...seats),
    h('header', { class: 'house-top' },
      h('button', { class: 'back pill', onclick: () => ctx.go('village') }, icon('back'), '뒤로'),
      h('h1', { class: 'house-name pill' }, itemId === 'house-small' ? '작은 집' : '큰 집')),
    note && h('p', { class: 'house-note' }, note));
  const stopImages = watchSceneImages(document.getElementById('app'));
  const fit = () => {
    const scale = houseResidentScale({ width: root.clientWidth, height: root.clientHeight,
      roomWidth: root.querySelector('.house-room').getBoundingClientRect().width,
      topHeight: root.querySelector('.house-top').getBoundingClientRect().height });
    root.style.setProperty('--house-resident-scale', scale);
  };
  const observer = new ResizeObserver(fit);
  const frame = requestAnimationFrame(() => { fit(); observer.observe(root); });
  ctx.cleanup = () => { alive = false; cancelAnimationFrame(frame); observer.disconnect(); stopImages(); closeSheet?.(); };
  return root;
}
