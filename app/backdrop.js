import { h } from './ui.js?v=9a67f36b25';
import { focusScene } from './fit.js?v=9a67f36b25';
import { ISLANDS, WIDE_MAPS, islandId, wideId } from './art/map-data.js?v=9a67f36b25';
import { backdropUnit } from '../src/game/map.js?v=9a67f36b25';

export function placeBackdrop(ctx) {
  const unit = backdropUnit(ctx.state, ctx.units, ctx.templates);
  const el = h('div', { class: 'place-backdrop', 'aria-hidden': 'true' });
  if (!unit) return { el, cleanup() {} };
  const scenes = [ISLANDS[islandId(unit.grade, unit.semester)], WIDE_MAPS[wideId(unit.grade)]].map((art, i) => {
    const scene = h('img', { class: `backdrop-scene ${i ? 'landscape' : 'portrait'}`, src: art.img, alt: '',
      width: art.w, height: art.h });
    el.append(scene);
    return { art, scene };
  });
  el.append(h('div', { class: 'backdrop-veil' }));
  function fit() {
    const W = el.clientWidth, H = el.clientHeight, wide = W >= H;
    el.style.backgroundColor = wide ? scenes[1].art.sea : '#8fd3ea';
    scenes.forEach(({ art, scene }, i) => {
      scene.hidden = Boolean(i) !== wide;
      const fitted = focusScene({ W, H, imgW: art.w, imgH: art.h, point: art.places[unit.id],
        base: 'cover', zoom: i ? 1.3 : 1.8, maxScale: 1.5,
        anchor: { x: .5, y: i ? .45 : .42 }, cover: true });
      Object.assign(scene.style, { width: `${fitted.width}px`, height: `${fitted.height}px`, left: `${fitted.left}px`, top: `${fitted.top}px` });
    });
  }
  const observer = new ResizeObserver(fit);
  const frame = requestAnimationFrame(() => { fit(); observer.observe(el); });
  return { el, cleanup() { cancelAnimationFrame(frame); observer.disconnect(); } };
}
// A missing picture leaves its space empty. Reconnect retries only failed pictures.
export function watchSceneImages(root) {
  const failed = event => {
    if (event.target.tagName !== 'IMG') return;
    event.target.dataset.imageMissing = 'true';
    event.target.style.visibility = 'hidden';
    const thing = event.target.classList?.contains('thing-art') ? event.target.closest('.thing') : null;
    if (thing) { thing.dataset.imageMissing = 'true'; thing.style.visibility = 'hidden'; }
  };
  const loaded = event => {
    if (event.target.tagName !== 'IMG' || !event.target.dataset.imageMissing) return;
    delete event.target.dataset.imageMissing;
    event.target.style.removeProperty('visibility');
    const thing = event.target.classList?.contains('thing-art') ? event.target.closest('.thing') : null;
    if (thing) { delete thing.dataset.imageMissing; thing.style.removeProperty('visibility'); }
  };
  const retry = () => {
    for (const img of root.querySelectorAll('img[data-image-missing]')) img.src = img.src;
  };
  root.addEventListener('error', failed, true);
  root.addEventListener('load', loaded, true);
  window.addEventListener('online', retry);
  return () => {
    root.removeEventListener('error', failed, true);
    root.removeEventListener('load', loaded, true);
    window.removeEventListener('online', retry);
  };
}
