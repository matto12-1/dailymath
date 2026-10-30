import { numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a - b;
const mistakes = [
  { id: "given-part", label: "주어진 부분 답하기", say: "문제에 있는 {b:을/를} 그대로 골랐습니다. 이미 주어진 {b} 말고 다른 부분을 찾으면 {answer}입니다.", value: ({ b }) => b },
  { id: "start-included", label: "모을 수 하나 더 세기", say: "모을 수를 하나 더 세어 {value:이/가} 나왔습니다. 두 부분을 모아 {a:이/가} 되도록 정확히 가르면 나머지는 {answer}입니다.", value: ({ a, b }) => b > 1 ? a - b + 1 : null },
  { id: "extra-subtract", label: "모을 수 하나 덜 세기", say: "모을 수를 하나 덜 세어 {value:이/가} 나왔습니다. 빠뜨린 수까지 넣어 {b:과/와} 모으면 {a:이/가} 되는 다른 부분은 {answer}입니다.", value: ({ a, b }) => a - b - 1 },
];

export default {
  id: 'g1.addsub1.split', grade: 1, unit: 'g1s1-addsub', strand: 'calc', level: 1,
  std: ["[2수01-04]"],
  label: "9까지 수 가르기", input: 'choice', answerKind: 'int', maxDigits: 1, speedBonus: true,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  answerSpan: [1,2,3,4,5,6,7,8],
  texts: ["{a:을/를} {b:과/와} 몇으로 가를 수 있을까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const a = rng.int(3, 9), b = rng.int(1, a - 1); return b !== a - b ? { a, b } : null;
    }, answer, mistakes, this.range, { edgeWeight: 2, candidates: ({ a }) => Array.from({ length: a - 1 }, (_, i) => i + 1) });
  },
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a,b }) => ({ kind: 'tenframe', n: a,groups:[b,a-b] }),
  answer,
  check: ({ a, b }) => countBack(a, b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b }) => countBack(a, b))(vars),
  mistakes,
  solution: "{b:과/와} {answer:을/를} 모으면 {a}입니다.\n따라서 {a:은/는} {b:과/와} {answer:으로/로} 가를 수 있습니다.",
};
