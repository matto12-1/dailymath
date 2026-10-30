import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a - b;
const mistakes = [
  { id: "bigger-ones", label: "낱개끼리 큰 수에서 작은 수 빼기", say: "낱개끼리 큰 수에서 작은 수를 빼서 {value:이/가} 나왔습니다. {b:을/를} {ones:과/와} {rest:으로/로} 갈라 {a}에서 {ones:을/를} 빼고, 남은 10에서 {rest:을/를} 빼면 {answer}입니다.", value: ({ b, ones }) => b - ones },
  { id:'start-included',label:'거꾸로 세기에서 처음 수도 세기',say:'거꾸로 셀 때 {a}부터 세어 {value:이/가} 나왔습니다. {a} 바로 앞의 수부터 {b}개를 거꾸로 세면 {answer}입니다.',value:({a,b})=>a-b+1 },
  { id:'subtract-all-from-ten',label:'10에서 뺄 수를 모두 빼기',say:'낱개 {ones}개를 빼고도 10에서 {b:을/를} 모두 뺐습니다. 10에서 남은 {rest:을/를} 빼면 {answer}입니다.',value:({b})=>10-b },
];

export default {
  id: 'g1.addsub4.borrow', grade: 1, unit: 'g1s2-addsub-three', strand: 'calc', level: 3,
  std: ["[2수01-06]"],
  label: "십몇에서 몇 빼기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 18 }, operandRange: { min: -2, max: 100 },
  answerSpan: [2,3,4,5,6,7,8,9],
  texts: ["〔{a} − {b} = ?〕그림을 보고 계산하면 얼마일까요?"],
  make(rng) {

    const difference=rng.int(2,9);
    return numberVars(rng, () => {
      const ones=rng.int(1,difference-1),a=10+ones,b=a-difference;
      return {a,b,ones,rest:b-ones};
    }, answer, mistakes, this.range,{balanceRank:false});
  },
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a, b }) => ({ kind: 'tenframe', n: a, crossed: [a%10,b-a%10] }),
  answer,
  check: ({ a, b }) => countBack(a, b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b }) => countBack(a, b))(vars),
  mistakes,
  solution: "{b:을/를} {ones:과/와} {rest:으로/로} 가릅니다.\n{a} − {ones} = 10입니다. 10 − {rest} = {answer}입니다.\n따라서 답은 {answer}입니다.",
};
