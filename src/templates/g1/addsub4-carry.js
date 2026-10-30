import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack,crossTenPair } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a + b;
const mistakes = [
  { id: "start-included", label: "처음 수도 세기", say: "이어 셀 때 {a}부터 다시 세어 {value:이/가} 나왔습니다. {a} 다음 수부터 {b}개를 이어 세면 {answer}입니다.", value: ({ a, b }) => a + b - 1 },
  {id:'extra-step',label:'이어 세기에서 한 번 더 세기',value:({a,b})=>a+b+1,say:'이어 셀 때 한 수 더 세어 {value:이/가} 나왔습니다. 더할 수 {b}개만큼만 이어 세면 {answer}입니다.'},
  {id:'two-ones',label:'각 무리에서 점 하나씩 달리 세기',value:({a,b,doubleDirection})=>a+b+2*doubleDirection,say:'두 무리에서 점을 하나씩 달리 세어 {value:이/가} 나왔습니다. 두 무리의 점을 빠짐없이 한 번씩 세면 {answer}입니다.'},
];

export default {
  id: 'g1.addsub4.carry', grade: 1, unit: 'g1s2-addsub-three', strand: 'calc', level: 2,
  std: ["[2수01-06]"],
  label: "십몇이 되는 덧셈", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 18 }, operandRange: { min: -2, max: 100 },
  answerSpan: [11,12,13,14,15,16,17,18],
  texts: ["〔{a} + {b} = ?〕그림을 보고 계산하면 얼마일까요?"],
  make: explain(function(rng) {
    const base=crossTenPair(rng);
    return numberVars(rng, rank => {
      const total=base.a+base.b;
      return {...base,doubleDirection:total===11||total===12&&rank===3||rank===0&&total<=16?1:rank===0||rank===2||rank===3?-1:rng.pick([-1,1])};
    // 채움 보기는 답이 될 수 있는 수에서만 고른다. 답이 못 되는 수가 채움으로도 끼면 늘 오답인 보기가 30% 넘게 나와 그 보기부터 지우고 찍었다(검수 2번).
    }, answer, mistakes, this.range, { candidates: [11, 12, 13, 14, 15, 16, 17, 18], edgeWeight: 4.5,allowRankFallback:true });
  }, v => [j(v.b,'을/를') + ' ' + j(v.need,'과/와') + ' ' + j(v.rest,'으로/로') + ' 가릅니다.', v.a + ' + ' + v.need + (' = ' + j("10", "입니다") + '.'), '남은 수를 더해 10 + ' + v.rest + ' = ' + say(v.a+v.b)]),
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a, b }) => ({ kind: 'tenframe', n: a + b, groups: [a, b] }),
  answer,
  check: ({ a, b }) => countSum(a, b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b }) => countSum(a, b))(vars),
  mistakes,
  solution: "{process}\n따라서 {a} + {b} = {answer}입니다.",
};
