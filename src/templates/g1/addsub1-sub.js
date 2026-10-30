import { explain, say, count } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a - b;
const mistakes = [
  { id: "start-included", label: "처음 수도 세기", say: "거꾸로 셀 때 {a}부터 세어 {value:이/가} 나왔습니다. {a} 바로 앞의 수부터 {b}개를 거꾸로 세면 {answer}입니다.", value: ({ a, b }) => a - b + 1 },
  {id:'extra-step',label:'하나 더 빼기',value:({a,b})=>a-b-1,say:'거꾸로 셀 때 한 수 더 세어 {value:이/가} 나왔습니다. {a} 바로 앞의 수부터 {b}번만 거꾸로 세면 {answer}입니다.'},
  {id:'removed',label:'뺀 수 고르기',value:({b})=>b,say:'남은 수 대신 뺀 수 {b:을/를} 골랐습니다. 지우지 않은 점을 세면 {answer}입니다.'},
];

export default {
  id: 'g1.addsub1.sub', grade: 1, unit: 'g1s1-addsub', strand: 'calc', level: 2,
  std: ["[2수01-06]"],
  label: "9까지 뺄셈", input: 'choice', answerKind: 'int', maxDigits: 1, speedBonus: true,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  answerSpan: [1,2,3,4,5,6,7,8],
  texts: ["〔{a} − {b} = ?〕그림을 보고 계산하면 얼마일까요?"],
  make: explain(function(rng) {

    return numberVars(rng, () => {
      const difference = rng.int(1, 8);
      const b = rng.int(1, 9 - difference), a = b + difference; return { a, b };
    // 채움 보기는 답이 될 수 있는 수에서만 고른다. 답이 못 되는 수가 채움으로도 끼면 늘 오답인 보기가 30% 넘게 나와 그 보기부터 지우고 찍었다(검수 2번).
    }, answer, mistakes, this.range, { candidates: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
  }, v => [v.a + '개에서 ' + v.b + '개를 뺍니다.', '남은 것을 하나씩 세면 ' + (v.a - v.b) + '개입니다.']),
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ a, b }) => ({ kind: 'tenframe', n: a, crossed: b }),
  answer,
  check: ({ a, b }) => countBack(a, b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b }) => countBack(a, b))(vars),
  mistakes,
  solution: "{process}\n따라서 답은 {answer}입니다.",
};
