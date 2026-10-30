import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ n, direction }) => n + direction;
const mistakes = [
  { id: "no-tens-up", label: "{sequenceLabel}", say: "{sequenceAction} {value:을/를} 골랐습니다. 10개씩 묶음과 낱개를 맞추어 한 수만 {action} 세면 {answer}입니다.", value: ({ n, direction }) => (direction>0?n%10===9:n%10===0)?n+direction-direction*10:n+2*direction },
  { id:'given',label:'주어진 수 그대로 고르기',say:'{n:을/를} 그대로 골랐습니다. {n} {where}로 한 수만 {action} 세면 {answer}입니다.',value:({n})=>n },
  { id:'opposite',label:'앞과 다음 반대로 고르기',say:'{n} {opposite}의 수 {value:을/를} 골랐습니다. 앞과 다음의 차례를 바르게 세면 {n} {where}의 수는 {answer}입니다.',value:({n,direction})=>n-direction },
];

export default {
  id: 'g1.hundred.next', grade: 1, unit: 'g1s2-numbers-hundred', strand: 'calc', level: 2,
  std: ["[2수01-03]"],
  label: "100까지 바로 앞과 다음 수", input: 'choice', answerKind: 'int', maxDigits: 3, speedBonus: true,
  range: { min: 0, max: 100 }, operandRange: { min: -2, max: 100 },
  answerSpan: {min:51,max:99},
  texts: ["〔{row}〕{n} {where}의 수는 무엇일까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const direction = rng.pick([-1, 1]);
      const n = rng.next()<1/3?rng.pick([60,70,80,90])-(direction>0?1:0):rng.int(52,98);
      return {n,direction,sequenceLabel:(direction>0?n%10===9:n%10===0)?'묶음 바꾸기 빠뜨리기':'두 수 건너가기',sequenceAction:(direction>0?n%10===9:n%10===0)?'낱개만 바꾸고 묶음을 그대로 두어':'두 수를 건너가서',wrongOnes: direction>0?0:9, bundleChange: direction>0?'늘어납니다':'줄어듭니다', where: direction > 0 ? '바로 다음' : '바로 앞', opposite:direction>0?'바로 앞':'바로 다음',change:direction>0?'큰':'작은',action: direction > 0 ? '더' : '거꾸로', row: direction > 0 ? n + ' → ?' : '? → ' + n };
    // 정답이 몇십(바로 다음 수)이면 채움 보기도 몇십이다. 아무 수로 채우면 끝이 0인 수만 골라도 45%가 맞았다.
    }, answer, mistakes, this.range, { candidates:({n,direction})=>Array.from({length:21},(_,i)=>n+direction-10+i) });
  },
  answer,
  check: ({ n, direction }) => direction > 0 ? countSum(n, 1) : countBack(n, 1),
  choices: options,
  isCorrect: (vars, choice) => choice === (vars.direction > 0 ? countSum(vars.n, 1) : countBack(vars.n, 1)),
  mistakes,
  solution: "{n} {where}의 수는 {n}보다 1만큼 더 {change} 수는 {answer}입니다.\n따라서 {n} {where}의 수는 {answer}입니다.",
};
