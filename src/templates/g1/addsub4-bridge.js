import { remainingMistake, crossTenPair, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a + b;
const mistakes = [
  {id:'only-ten',label:'{firstLabel}',say:'{firstAction} {value:이/가} 나왔습니다. 10 다음부터 남은 {rest}개만 정확히 세면 {answer}입니다.',value:({rest,showTen,offset})=>showTen?10:10+rest+offset},
  { id:'start-included',label:'10을 다시 세며 이어 세기',say:'10을 만든 뒤 10부터 다시 세어 {value:이/가} 나왔습니다. 11부터 남은 {rest}개를 이어 세면 {answer}입니다.',value:({a,b})=>a+b-1 },
  { id:'extra-step',label:'이어 세기에서 한 번 더 세기',say:'10에서 이어 셀 때 하나를 더 세어 {value:이/가} 나왔습니다. 남은 {rest}개만 한 번씩 모아 10에 더하면 {answer}입니다.',value:({a,b})=>a+b+1 },
];

export default {
  id: 'g1.addsub4.bridge', grade: 1, unit: 'g1s2-addsub-three', strand: 'calc', level: 1,
  std: ["[2수01-06]"],
  label: "10을 만들어 더하기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 18 }, operandRange: { min: -2, max: 100 },
  answerSpan: [11,12,13,14,15,16,17,18],
  texts: ["〔{a} + {b} = ?〕그림을 보고 계산하면 얼마일까요?"],
  make(rng) {
    const base=crossTenPair(rng,true);
    return numberVars(rng, rank => {
      const error=remainingMistake(rng);
      const total=base.a+base.b;
      if(rank!==1){error.showTen=false;error.offset=total===11||total===12&&rank===3||rank===0&&total<=16?2:-2;error.firstLabel=error.offset>0?'남은 점 두 개 더 세기':'남은 점 두 개 빠뜨리기';error.firstAction=error.offset>0?'남은 점을 두 개 더 세어':'남은 점 두 개를 빠뜨려';}
      return {...base,...error};
    // 채움 보기도 답이 될 수 있는 11~18이다(검수 2번).
    }, answer, mistakes, this.range, { candidates: [11, 12, 13, 14, 15, 16, 17, 18],allowRankFallback:true });
  },
  answer,
  check: ({ a, b }) => 10 + (b - countBack(10, a)),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b }) => 10 + (b - countBack(10, a)))(vars),
  mistakes,
  art: ({ a, b }) => ({ kind: 'tenframe', n: a + b, groups: [a, b] }),
  solution: "{b:을/를} {need:과/와} {rest:으로/로} 가릅니다.\n{a}에 {need:을/를} 더해 10을 만듭니다.\n10에 남은 {rest:을/를} 더하면 10 + {rest} = {answer}입니다.\n따라서 답은 {answer}입니다.",
};
