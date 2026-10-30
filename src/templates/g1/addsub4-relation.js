import { numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ b }) => b;
const mistakes = [
  { id: "other-number", label: "식의 다른 수 고르기", say: "뺄셈식에서 빼는 수 {a:을/를} 그대로 골랐습니다. {s}에서 {a:을/를} 빼면 {answer}입니다.", value: ({ a }) => a },
  { id: "start-included", label: "처음 수도 세기", say: "거꾸로 셀 때 {s}부터 세어 {value:이/가} 나왔습니다. {s} 바로 앞의 수부터 {a}개를 거꾸로 세면 {answer}입니다.", value: ({ b }) => b + 1 },
  { id: "extra-subtract", label: "하나 더 빼기", say: "하나를 더 빼서 {value:이/가} 나왔습니다. 더 뺀 한 개를 되돌리고 {a}개만 빼면 {answer}입니다.", value: ({ b }) => b - 1 },
];

export default {
  id: 'g1.addsub4.relation', grade: 1, unit: 'g1s2-addsub-three', strand: 'calc', level: 3,
  std: ["[2수01-07]"],
  label: "덧셈과 뺄셈의 관계", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 18 }, operandRange: { min: -2, max: 100 },
  answerSpan: [2,3,4,5,6,7,8,9],
  texts: ["〔{b} + {a} = {s}〕〔{s} − {a} = ?〕덧셈식을 이용하여 뺄셈식을 계산하면 얼마일까요?"],
  make(rng) {
    return numberVars(rng, () => {
      // 답(받은 수)도 9까지다. 전엔 8까지라 9가 늘 오답으로만 나왔다(검수 2번).
      const a = rng.int(2, 9), b = rng.int(2, 9); return a + b >= 11 && a + b <= 18 && a !== b && a !== b + 1 ? { a, b, s: a + b } : null;
    }, answer, mistakes, this.range, { edgeWeight: 2 });
  },
  answer,
  check: ({ s, a }) => countBack(s, a),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ s, a }) => countBack(s, a))(vars),
  mistakes,
  art:({a,b,s})=>({kind:'tenframe',n:s,groups:[b,a],crossed:a}),
  solution: "{b} + {a} = {s}에서 {s:은/는} {a:과/와} {b:을/를} 모은 수입니다.\n{s}에서 {a:을/를} 빼면 {b:이/가} 남습니다.\n따라서 {s} − {a} = {answer}입니다.",
};
