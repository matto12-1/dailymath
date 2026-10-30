// 익힌 차례대로 남기는 선물. 열기 전에는 마을 주민에 포함하지 않는다.
import { chooseArrival } from './village.js?v=9a67f36b25';
import { arrivalOrder } from './looks.js?v=9a67f36b25';
export const pendingChests = state => state.chests ?? [];

export function noteChests(state, events) {
  state.chests ??= [];
  for (const event of events) {
    if (event.type === 'mastered' && !state.chests.includes(event.unit)) state.chests.push(event.unit);
  }
}

export function openChest(state, unitId) {
  const index = pendingChests(state).indexOf(unitId);
  if (index < 0) return false;
  // Keep the mastery order, including unopened chests. Later same-day units append.
  state.town.arrivalOrder = arrivalOrder(state);
  state.town.arrivals[unitId] = chooseArrival(state, unitId);
  state.chests.splice(index, 1);
  return true;
}
