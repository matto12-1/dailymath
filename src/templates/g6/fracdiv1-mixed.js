import {numeric,meta,proper,seq,wrong,f,fractionSteps} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv1','mixed',3,'calc',['01-11'],'대분수 나누기'),{
 answerKind:'fraction',cases:proper.flatMap(v=>seq(1,3).flatMap(w=>seq(2,5).map(c=>({...v,w,c})))),
 texts:['〔{w} {a}/{d} ÷ {c} = ?〕계산하면 얼마일까요?'],
 answer:v=>f(v.w*v.d+v.a,v.d*v.c),check:v=>f(v.w*v.d*2+v.a*2,v.d*v.c*2),decorate:v=>({n:v.w*v.d+v.a,D:v.d*v.c,steps:fractionSteps(v.w*v.d+v.a,v.d*v.c)}),
 errors:v=>[wrong(f(v.w+v.a,v.d*v.c),'자연수와 분자 더하기','가분수로 바꿀 때 {w} × {d} + {a} 대신 {w} + {a:을/를} 계산하여 {value:을/를} 썼습니다. 분자를 {w} × {d} + {a} = {n:으로/로} 바꾸고 {c:으로/로} 나누면 {answer:입니다}.'),wrong(f(v.a,v.d*v.c),'자연수 부분 빠뜨리기','자연수 {w:을/를} 빼고 {a}/{d}만 {c:으로/로} 나누어 {value:을/를} 썼습니다. 자연수 부분까지 포함한 가분수 {n}/{d:을/를} {c:으로/로} 나누면 {answer:입니다}.')],
 solution:'{w} × {d} + {a} = {n}이므로 {w} {a}/{d} = {n}/{d:입니다}.\n{c:으로/로} 나누려면 1/{c:을/를} 곱합니다. 분모는 {d} × {c} = {D:입니다}.\n{n}/{d} ÷ {c} = {n}/{d} × 1/{c} = {steps}{stepsEnding}.\n따라서 답은 {answer:입니다}.',
});
