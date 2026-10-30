import { explain, say } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';
import { countFrom } from './helpers.js?v=9a67f36b25';

const answer = ({ n }) => 10 + n;
const mistakes = [
  { id: "reverse-or-extra", label: "{label1}", say: "{say1}", value: ({ n }) => n === 1 || n >= 5 ? 10 + n + 1 : n * 10 + 1 },
  {id:'miss-one',label:'낱개 하나 빠뜨리기',value:({n})=>10+n-1,say:'낱개 하나를 빠뜨려 {value:이/가} 나왔습니다. 10 다음부터 낱개 {n}개를 빠짐없이 이어 세면 {answer}입니다.'},
  {id:'two-ones',label:'낱개 두 개 달리 세기',value:({n})=>10+n+(n>=8?-2:2),say:'낱개를 두 개 달리 세어 {value:이/가} 나왔습니다. 낱개 {n}개를 빠짐없이 한 번씩 세어 묶음과 모으면 {answer}입니다.'},
];

export default {
  id: 'g1.fifty.teen', grade: 1, unit: 'g1s1-numbers-fifty', strand: 'calc', level: 1,
  std: ["[2수01-01]"],
  label: "십몇 알기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 50 }, operandRange: { min: -2, max: 100 },
  answerSpan: [11,12,13,14,15,16,17,18,19],
  texts: ["10개와 {n}개는 모두 몇 개일까요?"],
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const n = rng.int(1, 9), reverse = n >= 2 && n <= 4;
      return { n, label1: reverse ? '십과 일 뒤바꾸기' : '낱개 하나 더 세기',
        say1: reverse ? `10개씩 묶음의 수와 낱개의 수를 바꾸어 ${n * 10 + 1}이 나왔습니다. 10개씩 묶음 1개와 낱개 ${n}개를 모으면 ${10+n}입니다.` : `낱개 하나를 더 세었습니다. 10 다음부터 낱개 ${n}개를 이어 세면 ${10+n}입니다.` };
    }, answer, mistakes, this.range);
  }, v => ['10개씩 묶음이 1개, 낱개가 ' + v.n + '개입니다.', '10 다음부터 ' + countFrom(10,v.n) + ' 하고 이어 셉니다.']),
  answer,
  check: ({ n }) => countSum(10, n),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ n }) => countSum(10, n))(vars),
  mistakes,
  art: ({ n }) => ({ kind: 'blocks', tens: 1, ones: n }),
  solution: "{process}\n따라서 모두 {answer}개입니다.",
};
