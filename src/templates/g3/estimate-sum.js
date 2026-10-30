import { until } from '../../engine/retry.js?v=9a67f36b25';

// 3학년 1학기 덧셈과 뺄셈: 세 자리 + 세 자리를 백 단위로 어림하기 (경계 근처는 안 낸다)
export default {
  id: 'g3.add3.estimate', grade: 3, unit: 'g3s1-addsub', strand: 'estimate', level: 1,
  std: ['[4수01-08]'],
  label: '세 자리 덧셈 어림', input: 'choice',
  range: { min: 100, max: 1800 },
  texts: [
    '{a} + {b:을/를} 계산하지 말고 어림해 보세요. 어디쯤일까요?',
    '{a} + {b:은/는} 어느 수에 가장 가까울까요?',
  ],
  make(rng) {
    return until(() => {
      const a = rng.int(101, 899);
      const b = rng.int(101, 899);
      const ra = Math.round(a / 100) * 100;
      const rb = Math.round(b / 100) * 100;
      const r = ra + rb;
      // 아이들은 각 수를 어림해 더한다. 각 수도 합도 경계(50 근처)에서 먼 것만
      if (!(Math.abs(a - ra) <= 30 && Math.abs(b - rb) <= 30 && Math.abs(a + b - r) <= 30)) return null;
      // 보기는 정답 위아래로 고르게 섞는다(늘 [−200, 정답, +200]이면 가운데만 골라도 맞힌다).
      // −100과 +100처럼 마주 보는 짝은 하나만 뽑아 정답이 두 보기의 한가운데가 되지 않게 한다. 가장 작은 보기도 100 이상
      const offs = [];
      for (const o of rng.shuffle([-300, -200, -100, 100, 200, 300])) {
        if (offs.length < 3 && r + o >= 100 && r + o <= 1800 && !offs.includes(-o)) offs.push(o);
      }
      return { a, b, r, ra, rb, offs };
    });
  },
  answer: ({ r }) => r,
  check: ({ a, b }) => { const s = a + b; return s - (s % 100) + (s % 100 >= 50 ? 100 : 0); },
  choices: ({ r, offs }) => [r, ...offs.map((o) => r + o)],
  mistakes: [
    { id: 'too-small', label: '작게 어림하기', say: '조금 작게 어림했어요. 두 수를 각각 가장 가까운 몇백으로 바꾼 다음 더해 보세요.', value: ({ r }) => r - 100 },
    { id: 'too-big', label: '크게 어림하기', say: '조금 크게 어림했어요. 두 수를 각각 가장 가까운 몇백으로 바꾼 다음 더해 보세요.', value: ({ r }) => r + 100 },
  ],
  solution: '{a:은/는} 약 {ra}, {b:은/는} 약 {rb}. 더하면 약 {answer:이에요/예요}.',
};
