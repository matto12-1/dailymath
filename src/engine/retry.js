// 조건에 맞는 숫자가 나올 때까지 다시 뽑는다. 맞출 수 없는 조건이면 멈춰 버리지 않고 오류를 낸다.
// 문제 틀의 make()는 for(;;) 대신 이것을 쓴다(자동 시험의 모양 검사가 막는다).
export function until(attempt, max = 10000) {
  for (let i = 0; i < max; i++) {
    const v = attempt();
    if (v) return v;
  }
  throw new Error(`조건에 맞는 숫자를 ${max}번 안에 못 찾음`);
}
