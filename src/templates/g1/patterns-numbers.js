import { countFrom, countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';
import { cycle } from '../g3/arithmetic-helpers.js?v=9a67f36b25';

const answer = ({ n, d }) => n + d;
const mistakes = [
  { id: "step-one", label: "1씩 늘리기", say: "1만 더해 {value:이/가} 나왔습니다. 수가 {d}씩 커지므로 {n} 바로 다음 수부터 {d}번 이어 세면 {answer}입니다.", value: ({ n }) => n + 1 },
  {id:'repeat-rule',label:'규칙을 여러 번 적용하기',value:({n,d,repeats})=>n+d*repeats,say:'{d}씩 커지는 규칙을 {repeats}번 적용해 {value:이/가} 나왔습니다. 한 번만 이어 세면 {answer}입니다.'},
  {id:'count-one',label:'이어 세기에서 한 수 달리 세기',value:({n,d,slip})=>n+d+slip,say:'이어 세면서 한 수를 달리 세어 {value:이/가} 나왔습니다. {n} 바로 다음 수부터 {d}번 정확히 이어 세면 {answer}입니다.'},
];

export default {
  id: 'g1.patterns.numbers', grade: 1, unit: 'g1s2-patterns', strand: 'calc', level: 3,
  std: ["[2수02-01]"],
  label: "수의 규칙 찾기", input: 'choice', answerKind: 'int', maxDigits: 3, speedBonus: true,
  range: { min: 0, max: 100 }, operandRange: { min: -2, max: 100 },
  answerSpan: [6,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99],
  texts: ["규칙에 따라 다음에 올 수는 무엇일까요?"],
  // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
  numberRow: ({ first, second, n }) => ({ items: [first, second, n, '?'], arrows: true }),
  make(rng) {
    const target = cycle(rng, this, this.answerSpan);
    return numberVars(rng, () => {
      const d = rng.pick(target >= 15 ? [2, 5] : [2]), n = target - d; return { d, n, repeats:rng.pick([0,2,3]),slip:rng.pick([-1,1]),counted:countFrom(n,d), first: n - 2 * d, second: n - d };
    }, answer, mistakes, this.range);
  },
  answer,
  check: ({ n, d }) => countSum(n, d),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ n, d }) => countSum(n, d))(vars),
  mistakes,
  solution: "{d}씩 커지는 규칙입니다.\n{n} 다음부터 {counted} 하고 이어 셉니다.\n따라서 다음 수는 {answer}입니다.",
};
