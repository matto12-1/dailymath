import { shopsFor, build } from './shops.js?v=9a67f36b25';
import { masteredUnits } from './looks.js?v=9a67f36b25';
import { openChest } from './chest.js?v=9a67f36b25';
import { addDays } from './date.js?v=9a67f36b25';
import { firstVariant } from './roles.js?v=9a67f36b25';

// main can switch a sample's kind after creating it. Translate its shops and roles once.
export function matchDemoVillageKind(state) {
  const previous = state.town.demoKind ?? 'cat';
  if (previous === state.town.kind) return;
  const aliases = state.town.kind === 'dog' ? { fish: 'snack', yarn: 'toy' } : { snack: 'fish', toy: 'yarn' };
  state.town.shops = state.town.shops.map(shop => ({ ...shop, id: aliases[shop.id] ?? shop.id }));
  state.town.arrivals = { first: firstVariant(state.town.kind, state.createdAt) };
  delete state.town.arrivalOrder;
  recordDemoArrivals(state);
}

export function recordDemoArrivals(state) {
  state.town.demoKind = state.town.kind;
  for (const [id] of masteredUnits(state)) {
    if (state.chests.includes(id) || Object.hasOwn(state.town.arrivals, id)) continue;
    state.chests.push(id);
    openChest(state, id);
  }
}

// 화면에서 full / some을 넘기는 입구. 저장하지 않는 견본에서만 쓴다.
export function villageDemo(state, units, today, mode) {
  const count = mode === 'full' ? 39 : 3;
  state.units = Object.fromEntries(units.slice(0, count).map((unit, i) => [unit.id, {
    passed: [], history: [], mastered: addDays(today, i - count),
  }]));
  state.town.shops = [];
  state.town.arrivals = { first: firstVariant(state.town.kind, state.createdAt) };
  delete state.town.arrivalOrder;
  state.chests = [];
  state.coins = 20000;
  if (mode === 'full') {
    for (const shop of shopsFor(state.town.kind)) for (let i = 0; i < 3; i++) build(state, shop.id);
  } else {
    build(state, 'bakery');
    build(state, 'bakery');
    build(state, 'flower');
  }
  recordDemoArrivals(state);
  state.coins = mode === 'full' ? 2000 : 260;
}
