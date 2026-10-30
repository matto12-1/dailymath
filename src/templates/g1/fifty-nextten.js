import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ n }) => n + 10;
const mistakes = [
 {id:'step-one',label:'1씩 세기',value:({n})=>n+1,say:'묶음 한 개 대신 낱개 하나만 늘려 {value:이/가} 나왔습니다. 10개씩 묶음을 한 개 늘리면 {answer}입니다.'},
 {id:'three-bundles',label:'묶음을 세 개 늘리기',value:({n})=>n+30,say:'묶음을 세 개 늘려 {value:이/가} 나왔습니다. 한 개의 묶음만 늘리면 {answer}입니다.'},
 {id:'stop-or-twice',label:'{label3}',value:({n,twice})=>twice?n+20:n,say:'{action3} {value:이/가} 나왔습니다. 원래 묶음보다 한 개 많은 수는 {answer}입니다.'},
];

export default {
  id: 'g1.fifty.nextten', grade: 1, unit: 'g1s1-numbers-fifty', strand: 'calc', level: 2,
  std: ["[2수01-03]"],
  label: "10씩 세기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 50 }, operandRange: { min: -2, max: 100 },
  answerSpan: [20,30,40,50],
  texts: ["10개씩 묶음이 1개씩 늘어나도록 셉니다. 다음 수는 무엇일까요?"],
  // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
  numberRow: ({ n }) => ({ items: [...(n>10?[n-10]:[]),n,'?'], arrows: true }),
  make(rng) {
    return numberVars(rng, () => {
      // 10개씩 묶음이 한 개 늘어나는 몇십만 다룬다. 낱개 하나 늘리기와 묶음을 더 늘리기 등을 실제 실수로 섞는다.
      const n=rng.pick([10,20,30,40]),twice=rng.pick([true,true,true,true,false]);return {n,twice,includeClose:rng.next()<.65,label3:twice?'묶음을 두 개 늘리기':'주어진 수 그대로 고르기',action3:twice?'묶음을 두 개 늘려':'묶음을 늘리지 않아'};
    }, answer, mistakes, this.range, { requiredChoices:v=>v.includeClose?[v.n+1]:[],candidates:Array.from({length:31},(_,i)=>i+20),rankWeights:[2,1,1,1] });
  },
  answer,
  check: ({ n }) => countSum(n, 10),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ n }) => countSum(n, 10))(vars),
  mistakes,
  solution: "10씩 세면 10개씩 묶음이 1개씩 늘어납니다.\n10개씩 묶음의 수가 하나 늘어납니다.\n따라서 다음에 올 수는 {answer}입니다.",
};
