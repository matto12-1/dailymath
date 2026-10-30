import {define,meta,frac,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','mixed',2,'calc',['01-15'],'받아올림 없는 대분수 덧셈'),{
  input:'number',answerKind:'fraction',mixedInput:true,back:'g3s2-fractions',
  texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
  draw(rng){const d=rng.int(3,12),a=rng.int(1,d-2),b=rng.int(1,d-a-1),w=rng.int(1,4),v=rng.int(1,4);return {a,b,d,w,v,whole:w+v,numerator:a+b,left:frac(w,a,d),right:frac(v,b,d),...errors(wrong(frac(w+v,a,d),'자연수만 더하고 분수는 하나만 쓰기',`자연수만 더하고 앞의 분수 부분만 써서 ${frac(w+v,a,d)}을 썼습니다. 분수 부분도 ${a}/${d} + ${b}/${d} = ${a+b}/${d}로 더하면 ${frac(w+v,a+b,d)}입니다.`),wrong(frac(w+v,a+b,2*d),'분모도 더하기',`분모도 더하여 ${frac(w+v,a+b,2*d)}을 썼습니다. 분모는 ${d} 그대로 두면 ${frac(w+v,a+b,d)}입니다.`))};},
  answer:({a,b,d,w,v})=>frac(w+v,a+b,d),check:({a,b,d,w,v})=>frac(0,w*d+a+v*d+b,d),
  solution: "자연수 부분끼리 더하면 {w} + {v} = {whole}, 분수 부분끼리 더하면 {a}/{d} + {b}/{d} = {numerator}/{d}입니다.\n따라서 {left} + {right} = {answer}입니다.",
});
