import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';
import { countFrom } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a + b;
const mistakes = [
  { id: "start-included", label: "처음 수도 세기", say: "이어 셀 때 {a}부터 다시 세어 {value:이/가} 나왔습니다. {a} 다음 수부터 {b}개를 이어 세면 {answer}입니다.", value: ({ a, b }) => a + b - 1 },
  {id:'extra-step',label:'이어 세기에서 한 번 더 세기',value:({a,b})=>a+b+1,say:'이어 셀 때 한 수 더 세어 {value:이/가} 나왔습니다. 더할 수 {b}개만큼만 이어 세면 {answer}입니다.'},
  {id:'operation',label:'{operationLabel}',value:({a,b,repeat})=>repeat?a+2*b:a-b,say:'{operationAction} {value:이/가} 나왔습니다. 두 무리를 한 번씩 모아 세면 {answer}입니다.'},
];

export default {
  id: 'g1.addsub1.add', grade: 1, unit: 'g1s1-addsub', strand: 'calc', level: 2,
  std: ["[2수01-06]"],
  label: "9까지 덧셈", input: 'choice', answerKind: 'int', maxDigits: 1, speedBonus: true,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  answerSpan: [2,3,4,5,6,7,8,9],
  texts: ["〔{a} + {b} = ?〕그림을 보고 계산하면 얼마일까요?"],
  make: explain(function(rng) {
    // 합은 9까지다. 전엔 8까지라 9가 늘 오답으로만 나왔다(검수 2번).

    // 찍기 검사는 씨앗마다 달라 40%에 붙으면 어떤 날은 걸린다. 씨앗 8개에서 38% 아래가 되게 맞췄다(검수 2·5번 뒤).
    return numberVars(rng, () => {
      const total = rng.int(2, 9);
      const a = rng.int(1, total - 1), b = total - a; const repeat=rng.pick([true,false]);return {a,b,repeat,operationLabel:repeat?'더할 수 두 번 더하기':'더할 수를 빼기',operationAction:repeat?'더할 수를 두 번 모아':'더할 수를 빼서'};
    }, answer, mistakes, this.range, { edgeWeight: 3, directionFor: () => rng.pick([-1, 1, 1]) });
  }, v => [v.a + ' 다음부터 ' + countFrom(v.a,v.b) + ' 하고 이어 셉니다.']),
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a, b }) => ({ kind: 'tenframe', n: a + b, groups: [a, b] }),
  answer,
  check: ({ a, b }) => countSum(a, b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b }) => countSum(a, b))(vars),
  mistakes,
  solution: "{process}\n따라서 답은 {answer}입니다.",
};
