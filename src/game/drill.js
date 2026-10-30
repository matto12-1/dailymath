// 집중 훈련: 같은 꼴 20문제, 틀린 문제 다시 풀기, 끝낸 판 수와 최고 기록.
import { studyRange } from './study.js?v=9a67f36b25';
import { generate } from '../engine/template.js?v=9a67f36b25';
import { questionText } from '../engine/format.js?v=9a67f36b25';

export const DRILL_COUNT = 20;
export const DRILLS = [
  [1, 'make10', '10 모으기·가르기', 'g1.addsub2.drill'],
  [1, 'addsub18', '18까지 덧셈·뺄셈', 'g1.addsub4.drill'],
  [2, 'times', '구구단', 'g2.times.drill'],
  [2, 'addsub-one', '두 자리 ± 한 자리', 'g2.addsub.drill'],
  [3, 'div-fact', '나눗셈 몫', 'g3.div1.drill'],
  [3, 'mul-two-one', '두 자리 × 한 자리', 'g3.mul1.drill'],
  [3, 'units', '단위 바꾸기', 'g3.lengthtime.drill'],
  [4, 'tens-tens', '몇백 × 몇십', 'g4.muldiv.drill'],
  [4, 'frac-same', '분수 덧셈·뺄셈', 'g4.fracaddsub.drill'],
  [4, 'decimal-addsub', '소수 덧셈·뺄셈', 'g4.decimaladdsub.drill'],
  [5, 'reduce', '약분', 'g5.reduce.drill'],
  [5, 'gcd-lcm', '최대공약수·최소공배수', 'g5.factors.drill'],
  [5, 'decimal-times', '소수 × 자연수', 'g5.decimalmul.drill'],
  [6, 'frac-div', '분수 ÷ 자연수', 'g6.fracdiv1.drill'],
  [6, 'decimal-div', '소수 ÷ 자연수', 'g6.decimaldiv1.drill'],
  [6, 'percent', '백분율', 'g6.ratio.drill'],
].map(([grade, id, label, templateId]) => ({ id, grade, label, templateId, count: DRILL_COUNT }));

// 이 아이가 할 수 있는 드릴: 틀이 있고, 그 틀 학년이 학습 진도 범위 안(DECISIONS 10-14)
export function drillsFor(state, templates) {
  return DRILLS.filter((d) => {
    const t = templates.find((x) => x.id === d.templateId);
    return t && studyRange(state.grade).includes(t.grade);
  });
}

const freshItem = (template, problem) => ({ template, reason: 'drill', problem, done: false, result: null });

export function drillItems(template, count, rng) {
  const seen = new Map();
  const items = [];
  for (let i = 0; i < count; i++) {
    let chosen = null;
    let bestRank = Infinity;
    const previous = items.at(-1) && questionText(items.at(-1).problem);
    for (let attempt = 0; attempt < 40; attempt++) {
      const problem = generate(template, rng);
      const key = questionText(problem), times = seen.get(key) ?? 0;
      const rank = times === 0 ? 0 : key === previous ? 3 : times === 1 ? 1 : 2;
      if (rank < bestRank) { chosen = problem; bestRank = rank; }
      if (rank === 0) break;
    }
    seen.set(questionText(chosen), (seen.get(questionText(chosen)) ?? 0) + 1);
    items.push(freshItem(template, chosen));
  }
  return items;
}

export function retryItems(items) {
  return items.filter((it) => it.result && !it.result.correct).map((it) => freshItem(it.template, it.problem));
}

export function drillRecord(state, drillId) {
  const { runs = 0, best = 0 } = state.drills[drillId] ?? {};
  return { runs, best };
}

export function recordDrill(state, drillId, correct) {
  const old = drillRecord(state, drillId);
  const rec = { runs: old.runs + 1, best: Math.max(old.best, correct) };
  state.drills[drillId] = rec;
  return { ...rec, isNew: correct > old.best };
}
