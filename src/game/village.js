// 마을: 가게 일꾼의 이사, 집과 광장 자리. 화면은 다루지 않는다.
// 그림은 4권(app/art/assets.js). 여기는 이름·값·자리만 다룬다.
import { dayNumber } from './date.js?v=9a67f36b25';
import { hash, lookOf, masteredUnits, arrivalVariants, arrivalOrder, RESIDENT_VARIANTS } from './looks.js?v=9a67f36b25';
import { ROLES, workersOf } from './roles.js?v=9a67f36b25';
import { shopLevel } from './shops.js?v=9a67f36b25';
export { lookOf } from './looks.js?v=9a67f36b25';

export const CURRENCY = { cat: '생선', dog: '뼈다귀' };
export const MAX_PLOTS = 6;
export const HOUSE_CAP = { small: 2, big: 4 };
export { RESIDENT_VARIANTS } from './looks.js?v=9a67f36b25';
export const RESIDENT_NAMES = {
  cat: ['나비', '보리', '모카', '두부', '치즈', '호두', '자두', '코코', '미미', '루루', '쿠키', '라떼', '우유', '구름이', '소리', '마루', '초코', '토리', '레오', '사과',
    '살구', '흑미', '참깨', '솜이', '후추', '깜찍이', '점박이', '복숭아', '고구마', '단추', '방울이', '은비', '꽃님이', '완두', '귤이', '반반이', '잠보', '잎새', '삼색이', '겨울이'],
  dog: ['콩이', '바다', '해피', '뭉치', '꼬미', '토비', '루키', '몽이', '봄이', '별이', '감자', '까미', '단비', '누리', '포도', '두리', '아리', '다래', '순이', '머루',
    '차돌이', '바둑이', '밤톨이', '오디', '누렁이', '주근깨', '복실이', '유자', '뽀글이', '알록이', '초롱이', '눈송이', '민들레', '연탄이', '보송이', '망고', '쿨쿨이', '새싹이', '얼룩이', '하늘이'],
};

export const openPlots = (state) => Math.min(masteredUnits(state).length, MAX_PLOTS);

export function residents(state, units) {
  const byId = new Map(units.map((u) => [u.id, u]));
  const variants = arrivalVariants(state);
  const order = arrivalOrder(state);
  return [
    { id: 'first', unit: null, title: null, grade: null, semester: null, date: state.createdAt },
    ...masteredUnits(state).map(([id, record]) => {
      const unit = byId.get(id);
      return { id, unit: id, title: unit?.title ?? id, grade: unit?.grade ?? null, semester: unit?.semester ?? null, date: record.mastered };
    }),
  ].map(resident => {
    const baby = order.indexOf(resident.id) >= RESIDENT_VARIANTS;
    const variant = baby ? lookOf(resident.id).variant : variants[resident.id];
    const name = `${baby ? '아기 ' : ''}${RESIDENT_NAMES[state.town.kind][variant]}`;
    return { ...resident, name, look: { variant, baby } };
  }).filter(resident => !(state.chests ?? []).includes(resident.unit));
}

export function chooseArrival(state, unitId) {
  const ids = arrivalOrder(state);
  if (ids.indexOf(unitId) >= RESIDENT_VARIANTS) return lookOf(unitId).variant;
  const used = new Set(ids.slice(0, RESIDENT_VARIANTS).filter(id => id !== unitId && Object.hasOwn(state.town.arrivals, id))
    .map(id => state.town.arrivals[id]));
  for (const shop of state.town.shops) {
    const worker = workersOf(state.town.kind, shop.id).find(variant => ROLES[state.town.kind][variant].seat <= shop.level && !used.has(variant));
    if (worker !== undefined) return worker;
  }
  let { variant } = lookOf(unitId);
  for (let i = 0; i < RESIDENT_VARIANTS && used.has(variant); i++) variant = (variant + 1) % RESIDENT_VARIANTS;
  return variant;
}

export const yardSpots = () => 20;

export function worksAtShop(state, resident) {
  const role = ROLES[state.town.kind][resident.look.variant];
  return !resident.look.baby && role.role === 'worker' && role.seat <= shopLevel(state, role.shop);
}

export function homes(state, units) {
  const all = residents(state, units);
  const working = all.filter(r => worksAtShop(state, r));
  const plaza = all.filter(r => ROLES[state.town.kind][r.look.variant].role === 'plaza');
  const resting = all.filter(r => ROLES[state.town.kind][r.look.variant].role === 'worker' && !worksAtShop(state, r));
  let next = 0;
  const houses = Object.entries(HOUSE_CAP).map(([id, cap]) => {
    const occupants = resting.slice(next, next + cap);
    next += cap;
    return { id, residents: occupants };
  });
  return { houses, yard: [...plaza, ...resting.slice(next)], working };
}

export function whereToday(state, units, today) {
  const layout = homes(state, units);
  const all = residents(state, units);
  const arrival = new Map(all.map((r, i) => [r.id, i]));
  const day = dayNumber(today);
  const houses = layout.houses.map(({ id, residents: occupants }) => {
    const home = [];
    const out = [];
    occupants.forEach((r, j) => {
      if (r.date !== today && (j + day) % 2 === 0) home.push(r);
      else out.push(r);
    });
    return { id, residents: occupants, home, out };
  });
  const candidates = [...layout.yard, ...houses.flatMap(h => h.out)];
  candidates.sort((a, b) => {
    const moved = Number(b.date === today) - Number(a.date === today);
    if (moved) return moved;
    const order = arrival.get(a.id) - arrival.get(b.id);
    if (a.date === today) return order;
    const plaza = Number(ROLES[state.town.kind][b.look.variant].role === 'plaza') - Number(ROLES[state.town.kind][a.look.variant].role === 'plaza');
    return plaza || hash(a.id + '|' + today) - hash(b.id + '|' + today) || order;
  });
  const yard = candidates.slice(0, yardSpots(state));
  const walking = candidates.slice(yard.length);
  const where = {};
  for (const h of houses) for (const r of h.home) where[r.id] = { place: 'house', house: h.id, seat: h.residents.indexOf(r) + 1 };
  for (const r of layout.working) {
    const role = ROLES[state.town.kind][r.look.variant];
    where[r.id] = { place: 'shop', shop: role.shop, seat: role.seat };
  }
  yard.forEach((r, spot) => { where[r.id] = { place: 'yard', spot }; });
  for (const r of walking) where[r.id] = { place: 'walk' };
  return { houses, yard, walking, where, working: layout.working };
}
