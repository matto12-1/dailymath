import {define,meta,frac,errors,wrong} from './helpers.js?v=9a67f36b25';
import {gcd} from '../g5/helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','mixedsubtract',2,'calc',['01-15'],'받아내림 없는 대분수 뺄셈'),{
  input:'number',answerKind:'fraction',mixedInput:true,back:'g3s2-fractions',
  texts:['〔{left} − {right} = ?〕계산하면 얼마일까요?'],
  draw(rng){const d=rng.int(3,12),a=rng.int(2,d-1),b=rng.int(1,a-1),v=rng.int(1,3),w=v+rng.int(1,4);
    if(gcd(a,d)!==1||gcd(b,d)!==1)return null;
    // 4학년은 약분을 배우지 않아 답도 약분하지 않은 꼴(4 2/8)로 둔다(10-22 Matto 판단 1, 검수 A2-10).
    const n=a-b;
    return {a,b,d,w,v,n,whole:w-v,left:frac(w,a,d),right:frac(v,b,d),...errors(
      wrong(frac(0,n,d),'자연수 부분 빠뜨리기',`분수 부분끼리만 빼서 ${frac(0,n,d)}을 썼습니다. 자연수 부분 ${w} − ${v} = ${w-v}도 함께 쓰면 ${frac(w-v,n,d)}입니다.`),
      wrong(frac(w-v,a,d),'분수 부분 빼기 빠뜨리기',`분수 부분을 빼지 않고 그대로 두어 ${frac(w-v,a,d)}을 썼습니다. 분수 부분도 ${a}/${d} − ${b}/${d} = ${n}/${d}로 빼면 ${frac(w-v,n,d)}입니다.`))};},
  answer:({w,v,n,d})=>frac(w-v,n,d),check:({w,v,a,b,d})=>frac(0,w*d+a-v*d-b,d),
  solution:'자연수끼리 {w} − {v} = {whole}, 분수끼리 {a}/{d} − {b}/{d} = {n}/{d:입니다}.\n따라서 {left} − {right} = {answer:입니다}.',
});
