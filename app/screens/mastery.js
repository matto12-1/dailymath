import { h } from '../ui.js?v=9a67f36b25';
import { focusScene } from '../fit.js?v=9a67f36b25';
import { ISLANDS, WIDE_MAPS, MAP_SPRITES, islandId, wideId } from '../art/map-data.js?v=9a67f36b25';
import { residentImg } from '../art/assets.js?v=9a67f36b25';
import { pendingChests, openChest } from '../../src/game/chest.js?v=9a67f36b25';
import { residents } from '../../src/game/village.js?v=9a67f36b25';
import { matchDemoVillageKind } from '../../src/game/village-demo-data.js?v=9a67f36b25';

export function mastery(ctx, { unit: unitId = pendingChests(ctx.state)[0] } = {}) {
  if (ctx.demo) matchDemoVillageKind(ctx.state);
  const unit = ctx.units.find(u => u.id === unitId);
  if (!unit || !ctx.state.units[unitId]?.mastered) {
    const frame = requestAnimationFrame(() => ctx.go('home'));
    ctx.cleanup = () => cancelAnimationFrame(frame);
    return h('section', { class: 'screen' });
  }
  let opened = !pendingChests(ctx.state).includes(unitId), alive = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let green = opened || reduce.matches;
  const title = `${unit.grade}학년 ${unit.semester}학기 · ${unit.title}`;
  const island = ISLANDS[islandId(unit.grade, unit.semester)], wide = WIDE_MAPS[wideId(unit.grade)];
  const position = p => `--x:${p.x}%;--y:${p.y}%;--r:${p.r}`;
  const scenes = [[island, 'portrait'], [wide, 'landscape']].map(([art, direction]) => {
    const point = art.places[unitId];
    return h('figure', { class: `mastery-scene ${direction}`, 'data-direction': direction },
      h('img', { class: 'mastery-art', src: art.img, alt: '', width: art.w, height: art.h, draggable: 'false' }),
      h('div', { class: 'mastery-spotlight', 'aria-hidden': 'true' }),
      h('img', { class: 'map-sprite flag mastery-flag', src: green ? MAP_SPRITES.flagDone : MAP_SPRITES.flagNow, alt: '단원을 끝낸 깃발', style: position(point) }),
      h('button', { class: 'mastery-chest', style: position({ ...point, ...point.label }), 'aria-label': '보물상자 열기', onclick: reveal },
        h('img', { src: MAP_SPRITES.chest, alt: '', draggable: 'false' })));
  });
  const head = h('header', { class: 'mastery-head' },
    h('h1', {}, '새 주민이', h('br'), '우리 마을로 이사 와요'), h('p', { class: 'pill mastery-unit' }, title));
  const note = h('div', { class: 'mastery-note' }, h('p', {}, '보물상자를 눌러 보세요'), h('p', { class: 'sub' }, '새 주민이 기다리고 있어요'));
  const primary = h('button', { class: 'primary mastery-primary', onclick: () => {
    if (!opened) reveal();
    else if (pendingChests(ctx.state).length) ctx.go('mastery', { unit: pendingChests(ctx.state)[0] });
    else ctx.go('village', { highlight: unitId });
  } });
  const actions = h('nav', { class: 'mastery-actions', 'aria-label': '탐험 이어 가기' }, primary,
    h('button', { class: 'pill mastery-home', onclick: () => ctx.go('home') }, '지도로'));
  const slot = h('div', { class: 'mastery-card-slot' });
  const root = h('section', { class: 'screen mastery-screen', 'data-unit': unitId, style: `--wide-sea:${wide.sea}` }, ...scenes, head, note, slot, actions);
  let card = null;
  function flagDone() {
    green = true;
    for (const scene of scenes) {
      const flag = scene.querySelector('.mastery-flag');
      flag.src = MAP_SPRITES.flagDone;
      flag.classList.add('settled');
    }
  }
  function render() {
    root.dataset.opened = String(opened);
    note.hidden = opened;
    const remaining = pendingChests(ctx.state).length;
    primary.textContent = !opened ? '보물상자 열기' : remaining ? `다음 상자 열기 (${remaining}개 남음)` : '마을에 가 보기';
    for (const scene of scenes) {
      const chest = scene.querySelector('.mastery-chest');
      chest.disabled = opened;
      chest.setAttribute('aria-label', opened ? '열린 보물상자' : '보물상자 열기');
      chest.querySelector('img').src = opened ? MAP_SPRITES.chestOpen : MAP_SPRITES.chest;
    }
    if (opened && !card) {
      const resident = residents(ctx.state, ctx.units).find(r => r.id === unitId);
      const [, month, day] = resident.date.split('-');
      card = h('article', { class: 'mastery-card', 'aria-live': 'polite', 'data-resident': resident.id },
        h('img', { class: 'mastery-portrait', src: residentImg(ctx.state.town.kind, resident.look.variant), alt: '', 'data-baby': String(resident.look.baby), width: 384, height: 384 }),
        h('h2', {}, resident.name), h('p', { class: 'mastery-card-unit' }, title),
        h('p', { class: 'mastery-date' }, `${Number(month)}월 ${Number(day)}일에 이사 왔어요`));
      slot.replaceChildren(card);
    }
  }
  function reveal() {
    if (opened || !openChest(ctx.state, unitId)) return;
    opened = true;
    ctx.save(); flagDone(); render(); fit(); primary.focus({ preventScroll: true });
  }
  const overlap = (a, b) => Math.min(a.right, b.right) > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top);
  function fit() {
    if (!root.isConnected || !alive) return;
    const { width: W, height: H } = root.getBoundingClientRect(), landscape = W >= H;
    root.style.setProperty('--column-x', `${landscape ? W * .74 : W / 2}px`);
    root.style.setProperty('--card-top', `${H * .18}px`);
    head.style.left = `${landscape ? W * .36 : W / 2}px`;
    scenes.forEach((scene, i) => {
      const art = i ? wide : island, point = art.places[unitId];
      const fitted = focusScene({ W, H, imgW: art.w, imgH: art.h, point, base: i ? 'cover' : 'width', zoom: i ? 1.6 : 1.8,
        maxScale: 1.5, anchor: { x: i ? .36 : .5, y: i ? .48 : .36 }, cover: Boolean(i) });
      Object.assign(scene.style, { width: `${fitted.width}px`, height: `${fitted.height}px`, left: `${fitted.left}px`, top: `${fitted.top}px` });
      scene.dataset.scale = fitted.scale;
      const spotlight = scene.querySelector('.mastery-spotlight'), radius = point.r / 100 * fitted.width * 1.3;
      Object.assign(spotlight.style, { left: `${-fitted.left}px`, top: `${-fitted.top}px`, width: `${W}px`, height: `${H}px` });
      spotlight.style.setProperty('--spot-x', `${fitted.px}px`);
      spotlight.style.setProperty('--spot-y', `${fitted.py}px`);
      spotlight.style.setProperty('--spot-inner', `${radius}px`);
      spotlight.style.setProperty('--spot-outer', `${radius * 1.6}px`);
      if (Boolean(i) !== landscape) return;
      root.style.setProperty('--focus-y', `${fitted.py}px`);
      scene.dataset.px = fitted.px; scene.dataset.py = fitted.py;
      const flag = scene.querySelector('.mastery-flag');
      // 큰 섬에서도 깃발이 머리 글까지 뻗지 않도록 표시 크기만 제한한다.
      const flagHeight = Math.min(128, Math.max(64, fitted.width * point.r / 100), fitted.py - 12);
      flag.style.height = `${flagHeight}px`;
      flag.style.width = `${flagHeight * .65}px`;
      const flagBox = { left: fitted.px - flagHeight * .325, right: fitted.px + flagHeight * .325, top: fitted.py - flagHeight, bottom: fitted.py };
      if (landscape && overlap(flag.getBoundingClientRect(), head.getBoundingClientRect())) {
        head.style.left = `${W * (fitted.px < W / 2 ? .74 : .26)}px`;
      }
      if (landscape && card) {
        // 떠오르는 애니메이션 중의 네모가 아니라 끝난 뒤의 네모로 가림을 판단한다.
        const width = card.offsetWidth;
        let center = W * .74;
        const cardBox = () => ({ left: center - width / 2, right: center + width / 2, top: H * .18, bottom: H - 148 });
        if (overlap(flagBox, cardBox())) center = W * .26;
        root.style.setProperty('--column-x', `${center}px`);
        if (overlap(head.getBoundingClientRect(), cardBox())) root.style.setProperty('--card-top', `${Math.max(H * .18, head.getBoundingClientRect().bottom + 16)}px`);
      }
      if (!opened) {
        const chest = scene.querySelector('.mastery-chest').getBoundingClientRect();
        note.style.left = `${Math.max(note.offsetWidth / 2 + 16, Math.min(W - note.offsetWidth / 2 - 16, chest.left + chest.width / 2))}px`;
        note.style.top = `${chest.bottom + 14}px`;
      }
    });
    if (landscape && !opened && overlap(note.getBoundingClientRect(), actions.getBoundingClientRect())) {
      root.style.setProperty('--column-x', `${W * .26}px`);
    }
  }
  render();
  const observer = new ResizeObserver(fit);
  const frame = requestAnimationFrame(() => { fit(); observer.observe(root); });
  const timer = green ? null : setTimeout(() => { if (alive) { flagDone(); fit(); } }, 700);
  const changed = () => { if (reduce.matches) flagDone(); };
  reduce.addEventListener('change', changed);
  ctx.cleanup = () => { alive = false; clearTimeout(timer); cancelAnimationFrame(frame); observer.disconnect(); reduce.removeEventListener('change', changed); };
  return root;
}
