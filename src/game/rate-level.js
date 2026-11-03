// 선생님 색 시안의 공통 경계. 비율은 반올림하기 전 값으로 나눈다.
// 기록이 없거나 범위를 벗어난 값은 단계가 없다(0%로 만들지 않는다).
export function rateLevel(rate) {
  if (!Number.isFinite(rate) || rate < 0 || rate > 1) return null;
  if (rate >= 0.75) return 'good';
  return rate >= 0.5 ? 'warn' : 'bad';
}

export function attentionLevel(reason) {
  if (reason === 'locked' || reason === 'low') return 'bad';
  return reason === 'reset' || reason === 'away' ? 'warn' : null;
}
