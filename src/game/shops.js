// 가게 표와 짓기 규칙. shops는 처음 지은 차례대로 남긴다.
import { masteredUnits } from './looks.js?v=9a67f36b25';

export const MAX_LEVEL = 3;
export const SHOPS = [
  { id: 'bakery', name: '빵집', kinds: ['cat', 'dog'], plot: 0, prices: [60, 250, 600] },
  { id: 'flower', name: '꽃집', kinds: ['cat', 'dog'], plot: 0, prices: [60, 250, 600] },
  { id: 'fruit', name: '과일 가게', kinds: ['cat', 'dog'], plot: 0, prices: [60, 250, 600] },
  { id: 'cafe', name: '카페', kinds: ['cat', 'dog'], plot: 0, prices: [60, 250, 600] },
  { id: 'fish', name: '생선 가게', kinds: ['cat'], plot: 1, prices: [150, 500, 1200] },
  { id: 'snack', name: '간식 가게', kinds: ['dog'], plot: 1, prices: [150, 500, 1200] },
  { id: 'books', name: '책방', kinds: ['cat', 'dog'], plot: 2, prices: [150, 500, 1200] },
  { id: 'post', name: '우체국', kinds: ['cat', 'dog'], plot: 3, prices: [180, 600, 1400] },
  { id: 'icecream', name: '아이스크림 가게', kinds: ['cat', 'dog'], plot: 4, prices: [180, 600, 1400] },
  { id: 'groom', name: '털 손질 가게', kinds: ['cat', 'dog'], plot: 5, prices: [220, 700, 1600] },
  { id: 'yarn', name: '털실 가게', kinds: ['cat'], plot: 6, prices: [220, 700, 1600] },
  { id: 'toy', name: '장난감 가게', kinds: ['dog'], plot: 6, prices: [220, 700, 1600] },
];

export const shopsFor = (kind) => SHOPS.filter((s) => s.kinds.includes(kind));
export const shopLevel = (state, id) => state.town.shops.find((s) => s.id === id)?.level ?? 0;
const shopOf = (state, id) => shopsFor(state.town.kind).find((s) => s.id === id);

export function nextPrice(state, id) {
  return shopOf(state, id)?.prices[shopLevel(state, id)] ?? null;
}

export function lotOpen(state, id) {
  const shop = shopOf(state, id);
  // 터 번호가 1~6뿐이므로 익힌 수 비교는 열린 땅 수 비교와 같다.
  return !!shop && (shop.plot === 0 || masteredUnits(state).length >= shop.plot);
}

function cannotBuild(state, id) {
  if (!shopOf(state, id)) return 'unknown';
  if (!lotOpen(state, id)) return 'locked';
  if (shopLevel(state, id) >= MAX_LEVEL) return 'max';
  if (state.coins < nextPrice(state, id)) return 'coins';
  return null;
}

export const canBuild = (state, id) => cannotBuild(state, id) === null;

export function build(state, id) {
  const reason = cannotBuild(state, id);
  if (reason) return { ok: false, reason };
  state.coins -= nextPrice(state, id);
  const shop = state.town.shops.find((s) => s.id === id);
  if (shop) shop.level++;
  else state.town.shops.push({ id, level: 1 });
  return { ok: true, level: shopLevel(state, id) };
}
