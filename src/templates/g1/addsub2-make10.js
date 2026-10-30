import { numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a }) => 10 - a;
const mistakes = [
  { id: "start-included", label: "모을 수 하나 더 세기", say: "모을 수를 하나 더 세어 {value:이/가} 나왔습니다. 빈칸을 하나씩 정확히 세어 10을 채우면 {answer}입니다.", value: ({ a }) => 11 - a },
  { id: "given", label: "식의 수 그대로 고르기", say: "식에 있는 {a:을/를} 그대로 골랐습니다. 10을 이미 주어진 {a:과/와} 다른 부분으로 가르면 나머지는 {answer}입니다.", value: ({ a }) => a },
  { id: "extra-subtract", label: "모을 수 하나 덜 세기", say: "모을 수를 하나 덜 세어 {value:이/가} 나왔습니다. 빈칸을 빠뜨리지 않고 모두 세어 10을 채우면 {answer}입니다.", value: ({ a }) => 9 - a },
];

export default {
  id: 'g1.addsub2.make10', grade: 1, unit: 'g1s2-addsub-one', strand: 'calc', level: 2,
  std: ["[2수01-06]"],
  label: "10이 되는 수 찾기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 19 }, operandRange: { min: -2, max: 100 },
  answerSpan: [1,2,3,4,5,6,7,8,9],
  texts: ["〔{a} + □ = 10〕□에 알맞은 수는 얼마일까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const a = rng.int(1, 9); return { a };
    }, answer, mistakes, this.range);
  },
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a }) => ({ kind: 'tenframe', n: a }),
  answer,
  check: ({ a }) => countBack(10, a),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a }) => countBack(10, a))(vars),
  mistakes,
  solution: "그림에 점이 {a}개, 빈칸이 {answer}개 있습니다.\n{a:과/와} {answer:을/를} 모으면 10입니다.\n따라서 □에 알맞은 수는 {answer}입니다.",
};
