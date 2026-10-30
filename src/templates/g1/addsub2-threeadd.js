import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b, c }) => a + b + c;
const mistakes = [
  { id: "miss-last", label: "끝 수 빠뜨리기", say: "끝 수 {c:을/를} 빠뜨렸습니다. {a} + {b} + {c} = {answer}입니다.", value: ({ a, b }) => a + b },
  {id:'last-operation',label:'{lastLabel}',value:({a,b,c,repeatLast})=>repeatLast?a+b+2*c:a+b-c,say:'{lastAction} {value:이/가} 나왔습니다. 마지막 수 {c:을/를} 한 번만 더하면 {answer}입니다.'},
  {id:'extra-step',label:'이어 세기에서 한 번 더 세기',value:({a,b,c})=>a+b+c+1,say:'세 무리를 이어 세면서 한 수 더 세어 {value:이/가} 나왔습니다. 각 무리의 점을 한 번씩만 세면 {answer}입니다.'},
];

export default {
  id: 'g1.addsub2.threeadd', grade: 1, unit: 'g1s2-addsub-one', strand: 'calc', level: 1,
  std: ["[2수01-08]"],
  label: "세 수 더하기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 19 }, operandRange: { min: -2, max: 100 },
  answerSpan: [4,5,6,7,8,9],
  texts: ["〔{a} + {b} + {c} = ?〕그림을 보고 계산하면 얼마일까요?"],
  make: explain(function(rng) {

    return numberVars(rng, () => {
      const total = rng.int(4, 9);
      const a = rng.int(1, total - 2), b = rng.int(1, total - a - 1), c = total - a - b; return a !== c ? (()=>{const repeatLast=rng.pick([true,true,false]);return {a,b,c,repeatLast,lastLabel:repeatLast?'마지막 수 두 번 더하기':'마지막 수를 빼기',lastAction:repeatLast?'마지막 수를 두 번 더해':'마지막 수를 빼서'};})() : null;
    }, answer, mistakes, this.range, { directionFor: ({a,b,c=0}) => rng.pick(a+b+c <= 6 ? [-1, 1, 1, 1] : [-1, 1]) });
  }, v => ['먼저 ' + v.a + ' + ' + v.b + ' = ' + say(v.a+v.b), (v.a+v.b) + '에 마지막 수 ' + j(v.c,'을/를') + ' 더해 ' + (v.a+v.b) + ' + ' + v.c + ' = ' + say(v.a+v.b+v.c)]),
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a, b, c }) => ({ kind: 'tenframe', n: a + b + c, groups: [a, b, c] }),
  answer,
  check: ({ a, b, c }) => countSum(a, b, c),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b, c }) => countSum(a, b, c))(vars),
  mistakes,
  solution: "{process}\n따라서 {a} + {b} + {c} = {answer}입니다.",
};
