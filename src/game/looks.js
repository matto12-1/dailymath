// 생김새와 익힌 차례. 옛 저장도 같은 계산으로 읽는다.
export const RESIDENT_VARIANTS = 40;

export function hash(id) {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
  return h;
}

export function lookOf(id) {
  return { variant: hash(id) % RESIDENT_VARIANTS };
}

export const masteredUnits = (state) =>
  Object.entries(state.units)
    .filter(([, u]) => u.mastered)
    .sort((a, b) => (a[1].mastered < b[1].mastered ? -1 : a[1].mastered > b[1].mastered ? 1 : a[0] < b[0] ? -1 : 1));

// 상자를 안 연 단원도 자리를 차지한다. 아기 생김새는 옛날에도 해시 그대로였다.
export function legacyVariants(state) {
  const used = new Set();
  const entries = ['first', ...masteredUnits(state).map(([id]) => id)].slice(0, RESIDENT_VARIANTS);
  return Object.fromEntries(entries.map((id) => {
    let { variant } = lookOf(id);
    for (let i = 0; i < RESIDENT_VARIANTS && used.has(variant); i++) variant = (variant + 1) % RESIDENT_VARIANTS;
    used.add(variant);
    return [id, variant];
  }));
}

// 일부 이사 기록만 있는 견본도 이미 적힌 생김새를 먼저 남긴다.
export function arrivalOrder(state) {
  const ids = ['first', ...masteredUnits(state).map(([id]) => id)];
  const valid = new Set(ids);
  const saved = Array.isArray(state.town.arrivalOrder) ? state.town.arrivalOrder : (() => {
    // Older saves have dates and insertion order, even when two units share a day.
    const rank = new Map(Object.keys(state.town.arrivals ?? {}).map((id, i) => [id, i]));
    return masteredUnits(state).sort(([a, x], [b, y]) => x.mastered < y.mastered ? -1 : x.mastered > y.mastered ? 1 :
      (rank.get(a) ?? Infinity) - (rank.get(b) ?? Infinity) || (a < b ? -1 : 1)).map(([id]) => id);
  })();
  return [...new Set(['first', ...saved.filter(id => valid.has(id)), ...ids])];
}

export function arrivalVariants(state) {
  const fallback = legacyVariants(state);
  const saved = state.town.arrivals ?? {};
  const ids = arrivalOrder(state).slice(0, RESIDENT_VARIANTS);
  const babies = new Set(arrivalOrder(state).slice(RESIDENT_VARIANTS));
  const fixed = new Set(ids.filter(id => Object.hasOwn(saved, id)).map(id => saved[id]));
  const used = new Set();
  let repaired = false;
  const variants = Object.fromEntries(ids.map(id => {
    let variant = saved[id] ?? fallback[id] ?? lookOf(id).variant;
    if (!Object.hasOwn(saved, id) || used.has(variant)) {
      for (let i = 0; i < RESIDENT_VARIANTS && (used.has(variant) || fixed.has(variant)); i++) variant = (variant + 1) % RESIDENT_VARIANTS;
    }
    if (Object.hasOwn(saved, id) && saved[id] !== variant) repaired = true;
    used.add(variant);
    return [id, variant];
  }));
  // migrate passes a fresh town object. Replace the map so its input stays intact.
  if (repaired || Object.entries(saved).some(([id, variant]) => babies.has(id) && variant !== lookOf(id).variant)) {
    state.town.arrivals = Object.fromEntries(Object.entries(saved).map(([id, variant]) => [id, variants[id] ?? (babies.has(id) ? lookOf(id).variant : variant)]));
  }
  return variants;
}
