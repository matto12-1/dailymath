import { h } from './ui.js?v=9a67f36b25';
import { MAP_SPRITES } from './art/map-data.js?v=9a67f36b25';

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

export function placePicture(island, point, fog) {
  // 정사각형으로 자를 범위. 세로 좌표는 원본의 2:3 비율을 반영한다.
  const side = 2.6 * point.r;
  const vertical = side * island.w / island.h;
  const left = clamp(point.x - side / 2, 0, 100 - side);
  const top = clamp(point.y - .5 * point.r * island.w / island.h - vertical / 2, 0, 100 - vertical);
  return h('div', {
    class: 'place-pic', role: 'img', 'aria-label': fog ? '안개 낀 장소 풍경' : '장소 풍경',
    style: `background-image:url('${island.img}');background-size:${10000 / side}% ${10000 / vertical}%;background-position:${left / (100 - side) * 100}% ${top / (100 - vertical) * 100}%`,
  }, fog && h('img', { src: MAP_SPRITES.mist[0], alt: '', class: 'pic-mist' }));
}
