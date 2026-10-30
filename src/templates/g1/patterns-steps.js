import { countFrom, countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ n, d }) => n + d;
const mistakes = [
  { id: "step-one", label: "1씩 늘리기", say: "1칸만 더 가서 {value}칸이 나왔습니다. {n} 다음 수부터 {d}번 이어 세면 {answer}칸입니다.", value: ({ n }) => n + 1 },
  {id:'repeat-rule',label:'규칙을 여러 번 적용하기',value:({n,d,repeats})=>n+d*repeats,say:'{d}씩 커지는 규칙을 {repeats}번 적용해 {value:이/가} 나왔습니다. 한 번만 이어 세면 {answer}입니다.'},
  {id:'count-one',label:'이어 세기에서 한 수 달리 세기',value:({n,d,slip})=>n+d+slip,say:'이어 세면서 한 수를 달리 세어 {value:이/가} 나왔습니다. {n} 바로 다음 수부터 {d}번 정확히 이어 세면 {answer}입니다.'},
];

export default {
  id: 'g1.patterns.steps', grade: 1, unit: 'g1s2-patterns', strand: 'word', level: 3,
  std: ["[2수02-01]"],
  label: "걷는 칸 수의 규칙", input: 'choice', answerKind: 'int', maxDigits: 3,
  range: { min: 0, max: 100 }, operandRange: { min: -2, max: 100 },
  answerSpan: [8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],
  texts: ["뛰어간 칸 수를 차례로 나타냈습니다. 같은 규칙으로 뛰면 다음에는 모두 몇 칸일까요?"],
  // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
  numberRow: ({ first, second, n }) => ({ items: [first + '칸', second + '칸', n + '칸', '?'], arrows: true }),
  make(rng) {
    return numberVars(rng, () => {
      const d = rng.pick([2, 5]), n = rng.int(d * 3, 30 + d * 2); return { d, n, repeats:rng.pick([0,2,3]),slip:rng.pick([-1,1]),counted:countFrom(n,d), first: n - 2 * d, second: n - d };
    }, answer, mistakes, this.range);
  },
  answer,
  check: ({ n, d }) => countSum(n, d),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ n, d }) => countSum(n, d))(vars),
  mistakes,
  art: () => ({ scene: 'stepping-playground' }),
  solution: "{d}칸씩 커지는 규칙입니다.\n{n} 다음부터 {counted} 하고 이어 셉니다.\n따라서 다음은 {answer}칸입니다.",
};
