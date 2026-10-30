// 홈은 내 학년 지도. 섬 그림 위에 진도 표식과 단원 이름만 얹는다.
import { h } from '../ui.js?v=9a67f36b25';
import { icon } from '../icons.js?v=9a67f36b25';
import { ISLANDS, MAP_SPRITES, islandId, WIDE_MAPS, wideId } from '../art/map-data.js?v=9a67f36b25';
import { CURRENCY, residents } from '../../src/game/village.js?v=9a67f36b25';
import { unitPath, currentUnit } from '../../src/game/units.js?v=9a67f36b25';
import { placeState, mapProgress, exploreLine, startSemester } from '../../src/game/map.js?v=9a67f36b25';
import { placeSheet } from './place.js?v=9a67f36b25';
import { gradeSheet } from './grade.js?v=9a67f36b25';
import { pendingChests } from '../../src/game/chest.js?v=9a67f36b25';
import { watchSceneImages } from '../backdrop.js?v=9a67f36b25';
import { matchDemoVillageKind } from '../../src/game/village-demo-data.js?v=9a67f36b25';

const PLACE_NAME = { fog: '안개 낀 곳', clear: '맑은 곳', now: '지금 곳', done: '끝낸 곳' };

function placeView(ctx, unit, point, index, current, open) {
  const place = placeState(ctx.state, unit.id, ctx.templates, current);
  const ready = place === 'done' && pendingChests(ctx.state).includes(unit.id);
  const position = `--x:${point.x}%;--y:${point.y}%;--r:${point.r};`;
  const sprite = (src, className) => h('img', { src, alt: '', class: `map-sprite ${className}`, style: position });
  return [
    (place === 'now' || ready) && h('span', { class: 'place-glow', style: position }),
    place === 'fog' && sprite(MAP_SPRITES.mist[index % 3], 'mist'),
    (place === 'now' || place === 'done') && sprite(place === 'now' ? MAP_SPRITES.flagNow : MAP_SPRITES.flagDone, `flag ${place}`),
    (place === 'now' || ready) && sprite(MAP_SPRITES.chest, `chest${ready ? ' ready' : ''}`),
    h('button', { class: 'place', 'data-unit': unit.id, 'data-place': place, tabindex: '-1', 'aria-hidden': 'true',
      style: position, onclick: () => open(unit.id, unit.semester) }),
    h('button', { class: 'label', 'data-unit': unit.id, 'data-place': place,
      'aria-label': `${unit.title}, ${PLACE_NAME[place]}${ready ? ', 보물상자가 기다려요' : ''}`,
      style: `left:${point.label.x}%;top:${point.label.y}%`, onclick: () => open(unit.id, unit.semester) }, unit.title),
  ];
}

function islandView(ctx, semester, path, current, open) {
  const island = ISLANDS[islandId(ctx.state.study ?? ctx.state.grade, semester)];
  return h('figure', { class: 'island', 'data-semester': semester, 'aria-label': `${semester}학기 섬` },
    h('img', { class: 'island-art', src: island.img, alt: '', width: island.w, height: island.h, draggable: 'false' }),
    h('figcaption', { class: 'semester pill' }, `${semester}학기`),
    ...path.filter((u) => u.semester === semester).flatMap((u, i) => placeView(ctx, u, island.places[u.id], i, current, open)));
}

function wideView(ctx, grade, path, current, open) {
  const map = WIDE_MAPS[wideId(grade)];
  return h('figure', { class: 'wide-map', 'data-map': wideId(grade), 'aria-label': `${grade}학년 가로 지도` },
    h('img', { class: 'wide-art', src: map.img, alt: '', width: map.w, height: map.h, loading: 'lazy', draggable: 'false' }),
    ...path.flatMap((unit, index) => placeView(ctx, unit, map.places[unit.id], index, current, open)));
}

function topBar(ctx, openGrade) {
  const s = ctx.state;
  return h('header', { class: 'map-top' },
    h('button', { class: 'pill grade-pill', 'aria-label': `${s.study ?? s.grade}학년 지도, 다른 학년 지도 보기`, onclick: openGrade },
      icon('flag'), h('span', {}, `${s.study ?? s.grade}학년`)),
    h('div', { class: 'stats' },
      h('span', { class: 'pill stat', 'aria-label': `내 점수 ${s.score}점` }, icon('star'), h('span', {}, s.score)),
      h('span', { class: 'pill stat', 'aria-label': `${CURRENCY[s.town.kind]} ${s.coins}개` }, icon(s.town.kind === 'cat' ? 'fish' : 'bone'), h('span', {}, s.coins))));
}

function bottomBar(ctx) {
  const round = (name, picture, text, screen) => h('button', { class: `round ${name}`, onclick: () => ctx.go(screen) },
    icon(picture), h('span', { class: 'round-name' }, text));
  return h('nav', { class: 'map-bottom', 'aria-label': '탐험과 마을' },
    round('pick', 'target', '골라 풀기', 'pick'),
    h('button', { class: 'explore', onclick: () => ctx.go('play', { strand: null }) },
      h('span', { class: 'compass-badge' }, icon('compass')),
      h('strong', {}, '오늘의 탐험'), h('span', { class: 'explore-line' }, exploreLine(ctx.state, ctx.units, ctx.templates))),
    round('village', 'house', '마을', 'village'),
    round('record', 'book', '기록', 'record'));
}

function notices(ctx, firstTime, path) {
  const s = ctx.state;
  const bubble = (kind, text) => {
    const node = h('div', { class: `bubble ${kind}` }, h('p', {}, text),
      h('button', { class: 'close', 'aria-label': `${kind === 'warn' ? '저장 안내' : '인사'} 닫기`, onclick: () => node.remove() }, '✕'));
    return node;
  };
  const { done, total } = mapProgress(s, ctx.units, ctx.templates, s.study ?? s.grade);
  return h('div', { class: 'map-notices', 'aria-live': 'polite' },
    (ctx.demo ? ctx.demoWarn : !ctx.store.persistent) && bubble('warn', '이 기기에는 기록이 저장되지 않아요. 창을 닫거나 새로 고침하면 처음부터 다시 해요.'),
    firstTime && bubble('hello', `「${residents(s, ctx.units)[0].name}」가 마을에 왔어요! 첫 탐험을 떠나 볼까요?`),
    pendingChests(s).length > 0 && h('div', { class: 'bubble chests' },
      h('p', {}, `열지 않은 보물상자가 ${pendingChests(s).length}개 있어요`),
      h('button', { class: 'pill', onclick: () => ctx.go('mastery') }, '열기')),
    path.length > 0 && done === total && h('p', { class: 'banner pill' }, `${s.study ?? s.grade}학년 지도를 다 돌았어요!`));
}

// 넓은 지도에서 깃발·이름표를 장소에서 떼어 당길 수 있는 한도(px). 그 밖은 끌어 보기로.
const PULL = 48;
const OFFSETS = [];
for (let x = -PULL; x <= PULL; x += 4) for (let y = -PULL; y <= PULL; y += 4) OFFSETS.push({ x, y });
OFFSETS.sort((a, b) => a.x * a.x + a.y * a.y - b.x * b.x - b.y * b.y);
const overlap = (a, b) => Math.min(a.right, b.right) > Math.max(a.left, b.left) && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top);
const moved = (box, o) => ({ left: box.left + o.x, right: box.right + o.x, top: box.top + o.y, bottom: box.bottom + o.y });
const inside = (box, area) => box.left >= area.left - .5 && box.right <= area.right + .5 && box.top >= area.top - .5 && box.bottom <= area.bottom + .5;

// The transparent place targets must not cover the labels or one another.
// Keep the painted map and its coordinate data in place; fit only the 48px
// targets into nearby free space after the labels have their final positions.
function fitTargets(scene, bounds) {
  const labels = [...scene.querySelectorAll('.label')].map(e => e.getBoundingClientRect());
  const places = [...scene.querySelectorAll('.place')];
  places.forEach(e => { e.style.translate = '0px 0px'; });
  const placed = [];
  const root = scene.closest('.map-home');
  const top = Math.max(0, bounds.top, root.querySelector('.map-top').getBoundingClientRect().bottom);
  const bottom = Math.min(innerHeight, bounds.bottom, root.querySelector('.map-bottom').getBoundingClientRect().top);
  for (const place of places) {
    const original = place.getBoundingClientRect();
    for (const offset of OFFSETS) {
      const next = moved(original, offset);
      if (next.left < Math.max(0, bounds.left) || next.right > Math.min(innerWidth, bounds.right) || next.top < top || next.bottom > bottom) continue;
      if ([...labels, ...placed].some(box => overlap(next, box))) continue;
      place.style.translate = `${offset.x}px ${offset.y}px`;
      placed.push(next);
      break;
    }
  }
}

// 글꼴을 바꾸거나 태블릿을 돌려도 이름표 전체가 섬 안에 남도록 밀어 넣는다.
function containLabels(island) {
  if (!island.getClientRects().length) return;
  const bounds = island.getBoundingClientRect();
  const flags = [...island.querySelectorAll('.flag')].map(flag => flag.getBoundingClientRect());
  const placed = [];
  for (const label of island.querySelectorAll('.label')) {
    label.style.translate = '0px 0px';
    const box = label.getBoundingClientRect();
    const dx = Math.max(0, bounds.left - box.left) - Math.max(0, box.right - bounds.right);
    const dy = Math.max(0, bounds.top - box.top) - Math.max(0, box.bottom - bounds.bottom);
    const wanted = { x: dx, y: dy };
    const free = offset => inside(moved(box, offset), bounds) && ![...flags, ...placed].some(other => overlap(moved(box, offset), other));
    const pick = free(wanted) ? wanted : OFFSETS.find(free) ?? wanted;
    label.style.translate = `${pick.x}px ${pick.y}px`;
    placed.push(moved(box, pick));
  }
  fitTargets(island, bounds);
}

// 넓은 지도: 위아래 메뉴 사이(safe) 밖으로 나간 깃발·이름표만 PULL 안에서 당긴다.
// 이름표는 서로 겹치지 않게, 많이 당겨야 하는 것부터 자리를 잡고 나머지는 가장 가까운 빈 곳으로 비킨다.
function pullWide(scene, safe) {
  const cap = (n) => Math.max(-PULL, Math.min(PULL, n));
  const items = [...scene.querySelectorAll('.label, .flag')].map((e) => {
    e.style.translate = '0px 0px';
    const box = e.getBoundingClientRect();
    const want = { x: cap(Math.max(0, safe.left - box.left) - Math.max(0, box.right - safe.right)),
      y: cap(Math.max(0, safe.top - box.top) - Math.max(0, box.bottom - safe.bottom)) };
    return { e, box, want };
  });
  const far = (o) => Math.max(Math.abs(o.x), Math.abs(o.y));
  const placed = [];
  for (const { e, box, want } of items.sort((a, b) => far(b.want) - far(a.want))) {
    let pick = want;
    if (e.matches('.label')) {
      const free = (o) => inside(moved(box, o), safe) && !placed.some((b) => overlap(b, moved(box, o)));
      const near = (o) => (o.x - want.x) ** 2 + (o.y - want.y) ** 2;
      if (!free(want)) pick = [...OFFSETS].sort((a, b) => near(a) - near(b)).find(free) ?? want;
      placed.push(moved(box, pick));
    }
    e.style.translate = `${pick.x}px ${pick.y}px`;
  }
}

export function home(ctx, { firstTime = false, semester = null, sheet = null } = {}) {
  if (ctx.demo) matchDemoVillageKind(ctx.state);
  const s = ctx.state;
  const path = unitPath(ctx.units, ctx.templates, s.study ?? s.grade);
  const current = currentUnit(s, path, ctx.templates);
  let selected = semester ?? startSemester(s, ctx.units, ctx.templates);
  let closeSheet = null;
  const open = (factory) => { closeSheet?.(); closeSheet = factory(); };
  const islands = path.length ? [1, 2].map((term) => islandView(ctx, term, path, current,
    (id, term) => open(() => placeSheet(ctx, id, { semester: term })))) : [];
  const grade = s.study ?? s.grade;
  const map = WIDE_MAPS[wideId(grade)];
  const landscape = path.length ? wideView(ctx, grade, path, current,
    (id, term) => open(() => placeSheet(ctx, id, { semester: term }))) : null;
  const semesterPills = path.length ? [1, 2].map(term => h('span', { class: 'semester pill', 'data-semester': term }, `${term}학기`)) : [];
  const tabs = [1, 2].map((term) => h('button', { class: 'pill', onclick: () => select(term) }, `${term}학기`));
  const stage = h('div', { class: 'archipelago' }, ...islands,
    !path.length && h('p', { class: 'empty-map pill' }, `${s.study ?? s.grade}학년 문제는 아직 준비 중이에요. 학습 진도를 바꿔 볼까요?`));
  const root = h('section', { class: 'screen map-home', style: `--wide-sea:${map.sea}` },
    h('h1', { class: 'sr-only' }, `${grade}학년 지도`),
    topBar(ctx, () => open(() => gradeSheet(ctx))),
    h('nav', { class: 'tabs', 'aria-label': '학기' }, ...tabs), stage, landscape,
    h('div', { class: 'wide-semesters', 'aria-label': '학기' }, ...semesterPills),
    notices(ctx, firstTime, path), bottomBar(ctx));
  const stopImages = watchSceneImages(document.getElementById('app'));
  const noticeBox = root.querySelector('.map-notices');
  const fitNotices = () => {
    const height = noticeBox.getBoundingClientRect().height;
    root.style.setProperty('--notice-height', height ? `${height + 16}px` : '0px');
  };
  // 넓은 화면: 지도 그림은 늘 화면을 덮는다(줄여서 띠를 만들지 않는다). 깃발·이름표·누름 자리를 다 담는
  // 네모를 위아래 메뉴 사이 가운데에 두고, 남는 것은 PULL 안에서 당긴다. 그래도 밖에 남으면 그 방향으로 끌어 본다.
  let fit = null, pan = { x: 0, y: 0 }, drag = null, dragged = false;
  const safeArea = () => ({ left: 0, right: innerWidth,
    top: root.querySelector('.map-top').getBoundingClientRect().bottom, bottom: root.querySelector('.map-bottom').getBoundingClientRect().top });
  function placeWide() {
    fit.left = Math.max(fit.minLeft, Math.min(0, fit.baseLeft + pan.x));
    fit.top = Math.max(fit.minTop, Math.min(0, fit.baseTop + pan.y));
    pan = { x: fit.left - fit.baseLeft, y: fit.top - fit.baseTop };
    Object.assign(landscape.style, { left: `${fit.left}px`, top: `${fit.top}px` });
    const gradeBox = root.querySelector('.grade-pill').getBoundingClientRect();
    const statsBox = root.querySelector('.stats').getBoundingClientRect();
    for (const pill of semesterPills) {
      const half = pill.getBoundingClientRect().width / 2;
      const x = fit.left + fit.width * map.semesters[pill.dataset.semester].x / 100;
      pill.style.left = `${Math.max(gradeBox.right + 8 + half, Math.min(statsBox.left - 8 - half, x))}px`;
    }
  }
  function fitWide({ keepPan = false } = {}) {
    if (!landscape || !root.isConnected || !matchMedia('(min-aspect-ratio: 1/1)').matches) return;
    if (root.scrollTop || root.scrollLeft) root.scrollTo(0, 0);
    const { width: W, height: H } = root.getBoundingClientRect();
    const width = Math.max(W, H * map.w / map.h), height = width * map.h / map.w;
    Object.assign(landscape.style, { width: `${width}px`, height: `${height}px`, left: '0px', top: '0px' });
    const marks = [...landscape.querySelectorAll('.label, .flag, .place')];
    marks.forEach((e) => { e.style.translate = '0px 0px'; });
    const boxes = marks.map((e) => e.getBoundingClientRect()), safe = safeArea();
    const middle = (lo, hi, a, b, min) => Math.max(min, Math.min(0, (lo + hi - a - b) / 2));
    fit = { width, height, minLeft: W - width, minTop: H - height,
      baseLeft: middle(safe.left, safe.right, Math.min(...boxes.map((b) => b.left)), Math.max(...boxes.map((b) => b.right)), W - width),
      baseTop: middle(safe.top, safe.bottom, Math.min(...boxes.map((b) => b.top)), Math.max(...boxes.map((b) => b.bottom)), H - height) };
    if (!keepPan) pan = { x: 0, y: 0 };
    placeWide();
    landscape.dataset.cover = String(fit.left <= .5 && fit.top <= .5 && fit.left + width >= W - .5 && fit.top + height >= H - .5);
    pullWide(landscape, safe);
    fitTargets(landscape, landscape.getBoundingClientRect());
    if (keepPan) return;
    const out = marks.map((e) => e.getBoundingClientRect()).filter((b) => !inside(b, safe));
    const axes = (out.some((b) => b.left < safe.left - .5 || b.right > safe.right + .5) && width - W > 1 ? 'x' : '') +
      (out.some((b) => b.top < safe.top - .5 || b.bottom > safe.bottom + .5) && height - H > 1 ? 'y' : '');
    if (axes) landscape.dataset.pan = axes; else delete landscape.dataset.pan;
  }
  // 끌어 보기: 당겨도 메뉴 밑이나 화면 밖에 남는 것이 있는 크기에서만 켠다. 끌다 놓은 누름은 장소 창을 열지 않는다.
  function panBy(dx, dy) {
    const axes = landscape.dataset.pan ?? '';
    pan = { x: pan.x + (axes.includes('x') ? dx : 0), y: pan.y + (axes.includes('y') ? dy : 0) };
    placeWide();
  }
  landscape?.addEventListener('pointerdown', (e) => {
    if (landscape.dataset.pan && e.isPrimary) drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moving: false };
  });
  landscape?.addEventListener('pointermove', (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    if (!drag.moving && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
    if (!drag.moving) { drag.moving = true; landscape.setPointerCapture?.(e.pointerId); landscape.classList.add('dragging'); }
    panBy(e.clientX - drag.x, e.clientY - drag.y);
    drag.x = e.clientX; drag.y = e.clientY;
  });
  const endDrag = (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    if (drag.moving) { dragged = true; landscape.classList.remove('dragging'); fitWide({ keepPan: true }); }
    drag = null;
  };
  landscape?.addEventListener('pointerup', endDrag);
  landscape?.addEventListener('pointercancel', endDrag);
  landscape?.addEventListener('click', (e) => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);
  landscape?.addEventListener('pointerdown', () => { dragged = false; }, true);
  // 자판으로 고른 이름표가 메뉴 밑이면 그만큼 끌어 와 보인다. 초점 때문에 지도 화면이 밀리지 않게 한다.
  const unscroll = () => { if (root.scrollTop || root.scrollLeft) root.scrollTo(0, 0); };
  landscape?.addEventListener('focusin', (e) => {
    if (!landscape.dataset.pan || !fit) return;
    unscroll(); // 크롬은 초점을 준 뒤 지도 화면을 먼저 밀어 둔다. 되돌린 뒤에 잰다.
    const box = e.target.getBoundingClientRect(), safe = safeArea();
    panBy(Math.max(0, safe.left - box.left) - Math.max(0, box.right - safe.right), Math.max(0, safe.top - box.top) - Math.max(0, box.bottom - safe.bottom));
    fitWide({ keepPan: true });
  });
  root.addEventListener('scroll', unscroll);
  function select(term) {
    selected = term;
    tabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i + 1 === term)));
    islands.forEach((island) => { island.toggleAttribute('data-active', Number(island.dataset.semester) === term); containLabels(island); });
  }
  let pointer = null, suppressClick = false;
  stage.addEventListener('click', (e) => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); suppressClick = false; } }, true);
  stage.addEventListener('pointerdown', (e) => { if (e.isPrimary) pointer = { id: e.pointerId, x: e.clientX, y: e.clientY }; });
  stage.addEventListener('pointerup', (e) => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
    pointer = null;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) { suppressClick = true; select(dx < 0 ? 2 : 1); }
  });
  stage.addEventListener('pointercancel', () => { pointer = null; });
  const observer = new ResizeObserver(() => { fitNotices(); islands.forEach(containLabels); fitWide(); });
  observer.observe(noticeBox);
  islands.forEach((island) => { observer.observe(island); island.querySelectorAll('.label').forEach((label) => observer.observe(label)); });
  landscape?.querySelectorAll('.label').forEach(label => observer.observe(label));
  window.addEventListener('resize', fitWide);
  select(selected);
  const frame = requestAnimationFrame(() => { fitNotices(); islands.forEach(containLabels); fitWide(); if (sheet === 'grade') open(() => gradeSheet(ctx)); });
  ctx.cleanup = () => { stopImages(); cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', fitWide); closeSheet?.(); };
  return root;
}
