// 마을 돈. 빠르기 덤은 셈 갈래에만, 이미 익힌 단원은 적게(쉬운 것으로 돈만 모으기 막기).
export const COIN = { correct: 10, speed: 3, easy: 3, drill: 2, drillEasy: 1 };
export const RETRY_COINS = 1;
export const SPEED_MS = { 1: 8000, 2: 8000, 3: 6000, 4: 6000, 5: 6000, 6: 6000 };

export function coinsFor({ correct, strand, speedBonus, ms, grade, easy, drill }) {
  if (!correct) return 0;
  if (drill) return easy ? COIN.drillEasy : COIN.drill;
  if (easy) return COIN.easy;
  const fast = strand === 'calc' && speedBonus && ms <= (SPEED_MS[grade] ?? 6000);
  return COIN.correct + (fast ? COIN.speed : 0);
}
