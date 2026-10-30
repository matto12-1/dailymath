// 실제 섬 그림에서 잰 %. 왼쪽 위 0,0 / 오른쪽 아래 100,100.
// x,y는 풍경 밑동의 표식 자리, r은 그림 폭 기준 반지름, label은 바로 아래 빈 땅.
export const islandId = (grade, semester) => `g${grade}s${semester}`;
const p = (x, y, r, lx, ly) => ({ x, y, r, label: { x: lx, y: ly } });
const island = (grade, semester, places) => ({ grade, semester, img: `img/map/${islandId(grade, semester)}.webp`, w: 1024, h: 1536, places });

export const ISLANDS = {
  g1s1: island(1, 1, {
    'g1s1-numbers-nine': p(34, 70, 15, 34, 74),
    'g1s1-solid-shapes': p(70, 61, 15, 70, 65),
    'g1s1-addsub': p(36, 43, 16, 36, 46),
    'g1s1-compare': p(67, 32, 15, 70, 35),
    'g1s1-numbers-fifty': p(52, 17, 17, 52, 19),
  }),
  g1s2: island(1, 2, {
    'g1s2-numbers-hundred': p(31, 74.5, 15, 31, 78),
    'g1s2-addsub-one': p(76, 61, 15, 76, 65),
    'g1s2-shapes-clock': p(31, 47, 13, 31, 50.5),
    'g1s2-addsub-two': p(71, 34.5, 12, 71, 38),
    'g1s2-patterns': p(39, 28, 10, 35, 31),
    'g1s2-addsub-three': p(56, 16, 13, 56, 18.7),
  }),
  g2s1: island(2, 1, {
    'g2s1-numbers-three-digits': p(32, 75, 15, 32, 79),
    'g2s1-shapes': p(69, 66, 14, 69, 69),
    'g2s1-addsub': p(33, 52, 15, 33, 55),
    'g2s1-length': p(84, 40.5, 7, 82, 43),
    'g2s1-classify': p(36, 28, 16, 36, 31),
    'g2s1-multiplication': p(56, 13, 18, 56, 15),
  }),
  g2s2: island(2, 2, {
    'g2s2-numbers-four-digits': p(29, 75, 14, 29, 78),
    'g2s2-times': p(75, 66, 14, 75, 69),
    'g2s2-length': p(33, 49.5, 16, 33, 52),
    'g2s2-time': p(73, 35, 11, 73, 38),
    'g2s2-tables-graphs': p(34, 28, 14, 34, 31),
    'g2s2-patterns': p(55, 13.5, 11, 55, 15.5),
  }),
  g3s1: island(3, 1, {
    'g3s1-addsub': p(32, 76, 16, 32, 79),
    'g3s1-plane-shapes': p(72, 69, 15, 72, 72),
    'g3s1-div': p(32, 51, 17, 32, 54),
    'g3s1-multiplication': p(72, 45, 15, 72, 48),
    'g3s1-length-time': p(29, 28, 12, 29, 30),
    'g3s1-fractions-decimals': p(56, 19.5, 17, 56, 21),
  }),
  g3s2: island(3, 2, {
    'g3s2-multiplication': p(32, 73, 18, 32, 76),
    'g3s2-circles': p(74, 67, 14, 74, 70),
    'g3s2-div': p(43, 47.5, 5, 49, 55.5),
    'g3s2-weight-capacity': p(72, 39.2, 14, 72, 42),
    'g3s2-fractions': p(32, 29.5, 16, 32, 31.5),
    'g3s2-picture-graphs': p(55, 16, 14, 55, 18),
  }),
  g4s1: island(4, 1, {
    'g4s1-large-numbers': p(34, 82, 17, 34, 85),
    'g4s1-angles': p(73, 65, 16, 73, 68),
    'g4s1-multiply-divide': p(34, 55, 18, 34, 58),
    'g4s1-shape-movement': p(67, 38, 16, 67, 41),
    'g4s1-fraction-addsub': p(32, 26, 14, 32, 28),
    'g4s1-bar-graphs': p(51, 14, 15, 51, 16),
  }),
  g4s2: island(4, 2, {
    'g4s2-decimal-addsub': p(34, 84, 16, 34, 87),
    'g4s2-triangles': p(73, 68, 17, 73, 71),
    'g4s2-patterns-equations': p(29, 56, 17, 29, 59),
    'g4s2-quadrilaterals': p(74, 34, 14, 74, 36),
    'g4s2-line-graphs': p(31, 29, 15, 31, 31),
    'g4s2-polygons': p(50, 14, 13, 50, 16),
  }),
  g5s1: island(5, 1, {
    'g5s1-mixed-operations': p(30, 77, 16, 29, 80),
    'g5s1-factors-multiples': p(73, 68, 17, 73, 71),
    'g5s1-reduce-common-denominators': p(36, 49, 18, 36, 51),
    'g5s1-correspondence': p(79, 36, 16, 79, 38),
    'g5s1-fraction-addsub': p(29, 28, 16, 29, 30),
    'g5s1-perimeter-area': p(55, 16, 18, 55, 18),
  }),
  g5s2: island(5, 2, {
    'g5s2-range-rounding': p(31, 78, 17, 31, 81),
    'g5s2-fraction-multiply': p(74, 67, 14, 74, 69),
    'g5s2-congruence-symmetry': p(30, 53, 17, 30, 55),
    'g5s2-decimal-multiply': p(73, 39, 13, 73, 41),
    'g5s2-cuboids': p(42, 26, 16, 42, 28),
    'g5s2-average-likelihood': p(57, 15, 13, 57, 16.5),
  }),
  g6s1: island(6, 1, {
    'g6s1-fraction-divide': p(33, 77, 16, 33, 80),
    'g6s1-prisms-pyramids': p(71, 65, 17, 71, 68),
    'g6s1-decimal-divide': p(34, 50, 17, 34, 52.5),
    'g6s1-ratio-rate': p(74, 36, 15, 74, 38),
    'g6s1-graphs': p(35, 25, 18, 35, 27),
    'g6s1-cuboid-area-volume': p(53, 16, 14, 53, 18),
  }),
  g6s2: island(6, 2, {
    'g6s2-fraction-divide': p(29, 78, 17, 29, 81),
    'g6s2-space-solids': p(76, 68, 17, 76, 71),
    'g6s2-decimal-divide': p(33, 52, 17, 33, 55),
    'g6s2-proportion-distribution': p(73, 41, 16, 73, 44),
    'g6s2-circle-perimeter-area': p(40, 28, 17, 40, 30),
    'g6s2-cylinders-cones-spheres': p(57, 15, 15, 57, 17),
  }),
};

// 가로 지도는 채택 그림의 밑동과 바로 아래 빈 땅에서 따로 쟀다.
export const wideId = (grade) => `wide-g${grade}`;
const wide = (grade, sea, places) => ({ grade, img: `img/map/${wideId(grade)}.webp`, w: 1536, h: 1024,
  sea, semesters: { 1: { x: 25 }, 2: { x: 75 } }, places });
export const WIDE_MAPS = {
  'wide-g1': wide(1, '#54b5db', {
    'g1s1-numbers-nine': p(10.7, 61, 5, 10.7, 64.2),
    'g1s1-solid-shapes': p(26.4, 63.7, 5, 26.4, 66.5),
    'g1s1-addsub': p(36.9, 53.7, 5.5, 37, 56.5),
    'g1s1-compare': p(37.3, 30.5, 5.5, 37.3, 33.3),
    'g1s1-numbers-fifty': p(19.6, 28.8, 6, 19.5, 31.6),
    'g1s2-numbers-hundred': p(61.8, 60.5, 5.5, 61.8, 63.3),
    'g1s2-addsub-one': p(75.5, 63, 6, 75.5, 65.8),
    'g1s2-shapes-clock': p(90.9, 59.1, 5, 90.9, 62),
    'g1s2-addsub-two': p(88.2, 32.4, 5, 88.2, 35.2),
    'g1s2-patterns': p(74.9, 38.1, 4.5, 74.9, 41),
    'g1s2-addsub-three': p(62, 27, 5, 62, 29.8),
  }),
  'wide-g2': wide(2, '#45b0d6', {
    'g2s1-numbers-three-digits': p(10.2, 65.6, 5.5, 10.2, 68.4),
    'g2s1-shapes': p(24.5, 68.5, 5, 24.5, 71.3),
    'g2s1-addsub': p(38.2, 66.4, 5, 38.2, 69.2),
    'g2s1-length': p(28.5, 45.1, 5.5, 28.5, 47.9),
    'g2s1-classify': p(34.5, 33.7, 6, 34.5, 36.5),
    'g2s1-multiplication': p(13.7, 30, 6, 13.7, 32.8),
    'g2s2-numbers-four-digits': p(60.3, 69.6, 5.5, 60.3, 72.4),
    'g2s2-times': p(74, 67, 5.5, 74, 69.8),
    'g2s2-length': p(90.2, 66.4, 6, 90.2, 69.2),
    'g2s2-time': p(90.1, 39, 5, 90.1, 41.8),
    'g2s2-tables-graphs': p(75.9, 33.4, 5.5, 75.9, 36.2),
    'g2s2-patterns': p(60.9, 32.1, 5, 60.9, 34.9),
  }),
  'wide-g3': wide(3, '#4dadd6', {
    'g3s1-addsub': p(13.2, 71.1, 6, 13.2, 74),
    'g3s1-plane-shapes': p(33.85, 71.8, 6, 33.85, 74.6),
    'g3s1-div': p(34.2, 52.1, 6, 34.2, 54.9),
    'g3s1-multiplication': p(14.5, 50.5, 6, 14.5, 53.3),
    'g3s1-length-time': p(29.4, 34.8, 5, 29.4, 37.6),
    'g3s1-fractions-decimals': { ...p(16, 31.8, 6, 16, 34.6), top: 12 },
    'g3s2-multiplication': p(62.3, 55.7, 5.5, 62.3, 58.5),
    'g3s2-circles': p(76.2, 58, 5.5, 76.2, 60.8),
    'g3s2-div': p(90.7, 61.7, 5.5, 90.7, 64.5),
    'g3s2-weight-capacity': p(88.2, 35.4, 5.5, 88.2, 38.2),
    'g3s2-fractions': p(72.7, 33.1, 5.5, 72.7, 35.9),
    'g3s2-picture-graphs': p(57, 31.5, 5, 57, 34.3),
  }),
  'wide-g4': wide(4, '#63b7d5', {
    'g4s1-large-numbers': p(8.8, 62.2, 5.5, 9, 65),
    'g4s1-angles': p(23.8, 61.8, 5, 23.8, 64.6),
    'g4s1-multiply-divide': p(39.5, 62.9, 5.5, 39.5, 65.7),
    'g4s1-shape-movement': p(40, 37, 5.5, 40, 39.8),
    'g4s1-fraction-addsub': p(25.4, 35.9, 5.5, 25.4, 38.7),
    'g4s1-bar-graphs': p(10.1, 35.3, 5.5, 10.1, 38.1),
    'g4s2-decimal-addsub': p(60.4, 61.7, 5.5, 60.4, 64.5),
    'g4s2-triangles': p(74.9, 59.8, 5, 74.9, 62.6),
    'g4s2-patterns-equations': p(90.75, 59.9, 5.5, 90.75, 62.7),
    'g4s2-quadrilaterals': p(90.75, 37.8, 5, 90.75, 40.6),
    'g4s2-line-graphs': p(74.9, 34.7, 5.5, 74.9, 37.5),
    'g4s2-polygons': p(60.4, 38, 5, 60.4, 40.8),
  }),
  'wide-g5': wide(5, '#5bbacf', {
    'g5s1-mixed-operations': p(9.1, 65, 6, 9.3, 67.8),
    'g5s1-factors-multiples': p(24.4, 66.9, 5.5, 24.4, 69.7),
    'g5s1-reduce-common-denominators': p(39.4, 62.6, 6, 39.4, 65.4),
    'g5s1-correspondence': p(42.6, 39.4, 5.5, 42, 42.2),
    'g5s1-fraction-addsub': p(27.8, 36.4, 5.5, 27.8, 39.2),
    'g5s1-perimeter-area': p(11.3, 35, 6, 11.3, 37.8),
    'g5s2-range-rounding': p(63.9, 64.9, 6, 61, 67.7),
    'g5s2-fraction-multiply': p(74.8, 63.6, 5, 75.5, 66.4),
    'g5s2-congruence-symmetry': p(89.2, 65.8, 6, 90, 68.6),
    'g5s2-decimal-multiply': p(90.8, 37, 5, 90.8, 39.8),
    'g5s2-cuboids': p(73.6, 37.1, 5.5, 73.6, 39.9),
    'g5s2-average-likelihood': p(60.7, 37.4, 5, 60.7, 40.2),
  }),
  'wide-g6': wide(6, '#42a6d3', {
    'g6s1-fraction-divide': p(9.4, 67, 5.5, 9.6, 69.8),
    'g6s1-prisms-pyramids': p(24.9, 69.1, 6, 24.9, 71.9),
    'g6s1-decimal-divide': p(40.6, 65.8, 5.5, 40.6, 68.6),
    'g6s1-ratio-rate': p(40.5, 39.6, 5.5, 40.5, 42.4),
    'g6s1-graphs': p(25.1, 39.8, 6, 25.1, 42.6),
    'g6s1-cuboid-area-volume': p(10, 39.8, 5.5, 10, 42.6),
    'g6s2-fraction-divide': p(61.5, 68.1, 5.5, 61.5, 70.9),
    'g6s2-space-solids': p(75.5, 69.1, 5.5, 75.5, 71.9),
    'g6s2-decimal-divide': p(91, 67, 5.5, 90.8, 69.8),
    'g6s2-proportion-distribution': p(90, 40.3, 5.5, 90.9, 43.1),
    'g6s2-circle-perimeter-area': p(76.3, 41.3, 5.5, 76.2, 44.1),
    'g6s2-cylinders-cones-spheres': p(62.8, 40, 5, 61.5, 42.8),
  }),
};

export function wideContentBox(map) {
  const list = Object.values(map.places);
  return {
    x0: Math.max(0, Math.min(...list.flatMap(p => [p.x - 3, p.label.x - 7])) - 2),
    // 높은 풍차의 날개까지 위 단추 띠 아래에 남긴다. top은 그림에서 잰 가장 높은 부분의 %다.
    y0: Math.max(0, Math.min(...list.flatMap(p => [p.y - 7, p.label.y - 2, p.top ?? 100])) - 2),
    x1: Math.min(100, Math.max(...list.flatMap(p => [p.x + 3, p.label.x + 7])) + 2),
    y1: Math.min(100, Math.max(...list.flatMap(p => [p.y + 2, p.label.y + 5])) + 2),
  };
}

export const MAP_SPRITES = {
  flagDone: 'img/map/flag-done.webp',
  flagNow: 'img/map/flag-now.webp',
  mist: ['img/map/mist-1.webp', 'img/map/mist-2.webp', 'img/map/mist-3.webp'],
  chest: 'img/map/chest.webp',
  chestOpen: 'img/map/chest-open.webp',
};
