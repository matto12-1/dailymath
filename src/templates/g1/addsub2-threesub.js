import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b, c }) => a - b - c;
const mistakes = [
  { id: "miss-last", label: "마지막 빼기 빠뜨리기", say: "{c:을/를} 빼는 것을 빠뜨렸습니다. {a} − {b} − {c} = {answer}입니다.", value: ({ a, b }) => a - b },
  {id:'last-operation',label:'{lastLabel}',value:({a,b,c,lastDirection})=>a-b-c+lastDirection*c,say:'{lastAction} {value:이/가} 나왔습니다. 마지막 수 {c:을/를} 한 번만 빼면 {answer}입니다.'},
  {id:'count-one',label:'거꾸로 세기에서 한 수 달리 세기',value:({a,b,c,slip})=>a-b-c+slip,say:'거꾸로 셀 때 한 수를 달리 세어 {value:이/가} 나왔습니다. 처음 수를 빼고 바로 앞 수부터 정확히 세면 {answer}입니다.'},
];

export default {
  id: 'g1.addsub2.threesub', grade: 1, unit: 'g1s2-addsub-one', strand: 'calc', level: 2,
  std: ["[2수01-08]"],
  label: "세 수 빼기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 19 }, operandRange: { min: -2, max: 100 },
  answerSpan: [0,1,2,3,4,5,6],
  texts: ["〔{a} − {b} − {c} = ?〕그림을 보고 계산하면 얼마일까요?"],
  make: explain(function(rng) {

    return numberVars(rng, () => {
      const difference = rng.int(0, 6);
      const b = rng.int(1, 5), c = rng.int(1, 5), a = difference + b + c,lastDirection=rng.pick([-1,-1,2]); return b !== c && a <= 9 ? { a,b,c,lastDirection,slip:rng.pick([-1,-1,1]),lastLabel:lastDirection<0?'마지막 수 두 번 빼기':'마지막 수를 더하기',lastAction:lastDirection<0?'마지막 수를 두 번 빼서':'마지막 수를 더하여'} : null;
    }, answer, mistakes, this.range, { directionFor: ({a,b,c=0}) => rng.pick(a-b-c >= 3 ? [-1, -1, -1, 1] : [-1, 1]) });
  }, v => ['먼저 ' + v.a + ' − ' + v.b + ' = ' + say(v.a-v.b), (v.a-v.b) + '에서 마지막 수 ' + j(v.c,'을/를') + ' 빼면 ' + (v.a-v.b) + ' − ' + v.c + ' = ' + say(v.a-v.b-v.c)]),
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a, b, c }) => ({ kind: 'tenframe', n: a, crossed: [b,c] }),
  answer,
  check: ({ a, b, c }) => countBack(a, b, c),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b, c }) => countBack(a, b, c))(vars),
  mistakes,
  solution: "{process}\n따라서 {a} − {b} − {c} = {answer}입니다.",
};
