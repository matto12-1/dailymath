import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ n }) => n % 10;
const mistakes = [{id:'bundles',label:'낱개 대신 묶음 수 고르기',value:({n})=>Math.floor(n/10),say:'낱개 대신 10개씩 묶음 수 {value:을/를} 골랐습니다. 묶음에 넣은 {bundled}개를 빼고 남은 수는 {answer}개입니다.'}];

export default {
  id: 'g1.fifty.splitstory', grade: 1, unit: 'g1s1-numbers-fifty', strand: 'word', level: 3,
  std: ["[2수01-04]"],
  label: "연필 묶고 남은 수", input: 'choice', answerKind: 'int', maxDigits: 2,
  range: { min: 0, max: 50 }, operandRange: { min: -2, max: 100 },
  answerSpan: [1,2,3,4,5,6,7,8,9],
  texts: ["연필 {n}개를 10개씩 묶었습니다. 묶고 남은 낱개는 몇 개일까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const n=rng.int(23,49);return n%10?{n,t:Math.floor(n/10),bundled:Math.floor(n/10)*10}:null;
    }, answer, mistakes, this.range, { candidates: [1,2,3,4,5,6,7,8,9] });
  },
  answer,
  check: ({ n,t }) => countBack(n, ...Array(t).fill(10)),
  choices: options,
  isCorrect: (vars, choice) => choice === countBack(vars.n,...Array(vars.t).fill(10)),
  mistakes,
  art: () => ({ scene: 'pencil-bundles' }),
  solution: "10개씩 묶음 {t}개에 들어가는 연필은 {bundled}개입니다.\n따라서 남은 낱개는 {answer}개입니다.",
};
