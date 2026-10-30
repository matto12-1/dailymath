import {define,meta,frac,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','over',2,'calc',['01-15'],'1보다 큰 분수의 합'),{
  input:'number',answerKind:'fraction',mixedInput:true,back:'g3s2-fractions',
  texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
  draw(rng){const d=rng.int(3,12),a=rng.int(2,d-1),b=rng.int(d-a+1,d-1);return {a,b,d,one:frac(0,d,d),left:frac(0,a,d),right:frac(0,b,d),...errors(wrong(frac(0,a+b-d,d),'자연수 1 빠뜨리기',`${a+b}/${d}에서 ${d}/${d}을 덜어 내고 ${frac(0,a+b-d,d)}만 썼습니다. ${d}/${d}은 1이므로 ${a+b}/${d} = ${frac(1,a+b-d,d)}입니다.`),wrong(frac(0,a+b,2*d),'분모도 더하기',`분모도 더해 ${frac(0,a+b,2*d)}을 썼습니다. 분모는 ${d} 그대로 두면 ${a+b}/${d} = ${frac(1,a+b-d,d)}입니다.`)),total:a+b,rest:a+b-d};},
  answer:({a,b,d})=>frac(1,a+b-d,d),check:({a,b,d})=>frac(0,a+b,d),
  solution: "분모 {d:은/는} 그대로 두고 분자끼리 더하면 {a} + {b} = {total}입니다.\n{total}/{d:은/는} {d}/{d:과/와} {rest}/{d:으로/로} 나뉘고 {d}/{d:은/는} 1입니다.\n따라서 {left} + {right} = {answer}입니다.",
});
