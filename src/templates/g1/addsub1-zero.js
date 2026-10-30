import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

// 교과서의 「0을 더하고 빼기」에는 같은 수를 모두 빼서 0이 되는 뺄셈(4 − 4 = 0)도 있다.
// 전엔 0이 늘 오답으로만 나와(74%) 0부터 지우고 찍었다(검수 2번). 네 문제 중 하나쯤은 같은 수를 빼서 0이 정답이다.
const answer = ({ a, b, add }) => add ? a + b : a - b;
const mistakes = [
  { id: "zero-all", label: "0이면 모두 없어지는 것으로 생각하기", say: "0을 더하거나 빼면 모두 없어진다고 생각했습니다. {zeroAllFact}", value: ({ b = 0 }) => b === 0 ? 0 : null },
  { id: "zero-as-one", label: "0을 1로 세기", say: "0을 1처럼 세어 {value:이/가} 나왔습니다. {zeroOneFact}", value: ({ a, add, b = 0 }) => b === 0 ? a + (add ? 1 : -1) : null },
  { id: "keep-all", label: "모두 빼도 그대로라고 생각하기", say: "빼지 않고 처음 수 {a:을/를} 그대로 골랐습니다. {a}에서 {a:을/를} 모두 빼면 남는 것이 없으므로 0입니다.", value: ({ a, b }) => b === a ? a : null },
  {id:'empty-cells',label:'남은 점 대신 빈칸 세기',value:({a,b})=>b===a?10-a:null,say:'지운 점 밖의 빈칸을 세어 {value:이/가} 나왔습니다. 처음 점을 모두 빼면 남은 점이 없으므로 {answer}입니다.'},
];

export default {
  id: 'g1.addsub1.zero', grade: 1, unit: 'g1s1-addsub', strand: 'calc', level: 3,
  std: ["[2수01-06]"],
  label: "0을 더하고 빼기", input: 'choice', answerKind: 'int', maxDigits: 1, speedBonus: true,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  answerSpan: [0,1,2,3,4,5,6,7,8],
  texts: ["〔{a} {op} {b} = ?〕그림을 보고 계산하면 얼마일까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const a = rng.int(1, 8), all = rng.next() < 0.25, add = !all && rng.pick([true, false]);
      return { a, b: all ? a : 0, add, op: add ? '+' : '−',zeroAllFact:add?`0은 더할 것이 없다는 뜻이므로 ${a}입니다.`:`0은 뺄 것이 없다는 뜻이므로 ${a}입니다.`,zeroOneFact:add?`새로 더하는 점이 없으므로 처음 수 ${a}입니다.`:`지우는 점이 없으므로 처음 수 ${a}입니다.`,zeroMeaning:add?'0은 더할 것이 없다는 뜻이므로 처음 수 그대로입니다.':'0은 뺄 것이 없다는 뜻이므로 처음 수 그대로 남습니다.', reason: all ? `${a}에서 같은 수를 모두 빼면 남는 것이 없습니다.` : add?'0은 더할 것이 없다는 뜻입니다.':'0은 뺄 것이 없다는 뜻입니다.' };
    }, answer, mistakes, this.range, { edgeWeight: 3, directionFor:({a,b})=>b===a?1:rng.pick([-1,1]) });
  },
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a, b, add }) => add ? { kind: 'tenframe', n: a + b } : { kind: 'tenframe', n: a, crossed: b },
  answer,
  check: ({ a, b, add }) => add ? countSum(a, b) : countBack(a, b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b, add }) => add ? countSum(a, b) : countBack(a, b))(vars),
  mistakes,
  solution: "{reason}\n따라서 답은 {answer}입니다.",
};
