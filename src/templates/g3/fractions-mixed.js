import { define, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac } from '../../engine/answer.js?v=9a67f36b25';

export default define({id:'g3.fractions.mixed',unit:'g3s2-fractions',strand:'calc',level:3,label:'가분수를 대분수로',std:['[4수01-10]']},{
  input:'number',answerKind:'fraction',mixedInput:true,exactForm:true,errorCount:2,
  texts:["〔{shown}〕상자의 가분수를 대분수로 나타내면 얼마일까요?"],
  draw(rng){const d=rng.int(3,9),q=rng.int(1,d-1),r=rng.int(1,d-1);if(q===r)return null;const n=q*d+r;return {d,q,r,n,shown:frac(0,n,d),
    ...errors(wrong(frac(r,q,d),'몫과 나머지 뒤바꾸기',`몫과 나머지를 바꾸어 ${r} ${q}/${d}을 썼습니다. ${n} ÷ ${d}의 몫 ${q}는 자연수, 나머지 ${r}은 분자가 되므로 ${q} ${r}/${d}입니다.`),wrong(frac(0,r,d),'자연수 부분 빠뜨리기','자연수 {q:을/를} 빠뜨리고 {r}/{d}만 썼습니다. 몫 {q:을/를} 자연수에 함께 쓰면 {q} {r}/{d}입니다.'))};},
  answer:({q,r,d})=>frac(q,r,d),check:({n,d})=>frac(Math.floor(n/d),n%d,d),
  solution:'{n} ÷ {d}의 몫은 {q}, 나머지는 {r:입니다}.\n몫은 자연수가 되고 나머지는 분자가 됩니다.\n따라서 {shown} = {answer:입니다}.',
});
