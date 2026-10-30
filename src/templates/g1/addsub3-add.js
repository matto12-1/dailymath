import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a + b;
const mistakes = [
  { id: "add-to-tens", label: "몇을 십에 더하기", say: "{b:을/를} 10개씩 묶음의 수에 더해 {value:이/가} 나왔습니다. 더할 수 {b:은/는} 낱개이므로 묶음은 그대로 두고 낱개에만 더하면 {answer}입니다.", value: ({ a, b }) => a + 10 * b },
  {id:'sequence-slip',label:'이어 세기에서 한 수 달리 세기',say:'이어 세며 한 수를 달리 세어 {value:이/가} 나왔습니다. {a} 다음 수부터 {b}개만 정확히 이어 세면 {answer}입니다.',value:({a,b,slip})=>a+b+slip},
  { id:'subtract',label:'더할 수를 빼기',say:'{b:을/를} 더해야 하는데 뺐습니다. 빼지 않고 낱개 {o}개에 {b}개를 모으면 모두 {answer}입니다.',value:({a,b})=>a-b },
];

export default {
  id: 'g1.addsub3.add', grade: 1, unit: 'g1s2-addsub-two', strand: 'calc', level: 2,
  std: ["[2수01-06]"],
  label: "몇십몇에 몇 더하기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 99 }, operandRange: { min: -2, max: 100 },
  answerSpan: [23,24,25,26,27,28,29,33,34,35,36,37,38,39,43,44,45,46,47,48,49,53,54,55,56,57,58,59,63,64,65,66,67,68,69,73,74,75,76,77,78,79,83,84,85,86,87,88,89],
  texts: ["〔{a} + {b} = ?〕계산하면 얼마일까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const t = rng.int(2, 8), o = rng.int(1, 7), b = rng.int(2, 7), a = 10 * t + o; return o + b < 10 ? { a, b, t, o,slip:rng.pick([-1,1]),onesSum:o+b } : null;
    }, answer, mistakes, this.range,{rankWeights:[2,1,1,1]});
  },
  answer,
  check: ({ t, o, b }) => 10 * t + countSum(o, b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ t, o, b }) => 10 * t + countSum(o, b))(vars),
  mistakes,
  art:({a,b,t,o})=>({kind:'blocks',tens:t,ones:o+b,added:{tens:0,ones:b}}),
  solution: "낱개끼리 더하면 {o} + {b} = {onesSum}입니다.\n10개씩 묶음은 {t}개 그대로이고 낱개는 {onesSum}개가 됩니다.\n따라서 {a} + {b} = {answer}입니다.",
  guessHints:[],
};
