import { define, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac } from '../../engine/answer.js?v=9a67f36b25';

export default define({id:'g3.fractions.improper',unit:'g3s2-fractions',strand:'calc',level:3,label:'대분수를 가분수로',std:['[4수01-10]']},{
  input:'number',answerKind:'fraction',mixedInput:true,exactForm:true,errorCount:2,
  texts:["〔{shown}〕상자의 대분수를 가분수로 나타내면 얼마일까요?"],
  draw(rng){const d=rng.int(2,9),w=rng.int(1,3),n=rng.int(1,d-1);return {d,w,n,shown:frac(w,n,d),numerator:w*d+n,wholeNumerator:w*d,
    ...errors(wrong(frac(0,w+n,d),'자연수와 분자만 더하기',`자연수 ${w}을 분수로 바꾸지 않고 ${w+n}/${d}을 썼습니다. 자연수 ${w}은 ${w*d}/${d}이므로 ${frac(w,n,d)}은 1/${d}이 ${w*d+n}개인 ${w*d+n}/${d}입니다.`),wrong(frac(0,n,d),'자연수 부분 빠뜨리기','자연수 {w:을/를} 빠뜨리고 {n}/{d}만 썼습니다. 자연수 {w:을/를} 분수로 바꾼 부분도 함께 세면 {answer}입니다.')),added:w+n};},
  answer:({w,n,d})=>frac(0,w*d+n,d),check:({w,n,d})=>`${Array(w).fill(d).reduce((a,b)=>a+b,n)}/${d}`,
  solution:"자연수 {w:은/는} {wholeNumerator}/{d}입니다.\n{wholeNumerator}/{d:과/와} {n}/{d:은/는} 1/{d:이/가} {numerator}개인 수입니다.\n따라서 {shown} = {answer:입니다}.",
});
