import {numeric,meta,proper,seq,wrong,f,divideCheck,fractionSteps} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv2','mixed',3,'calc',['01-11'],'대분수 나누기 분수'),{
 answerKind:'fraction',back:'g5s2-fraction-multiply',cases:proper.filter(v=>v.d<=6).flatMap(v=>proper.filter(u=>u.d<=6).flatMap(u=>seq(1,3).map(w=>({...v,w,b:u.a,e:u.d})))),
 texts:['〔{w} {a}/{d} ÷ {b}/{e} = ?〕계산하면 얼마일까요?'],
 answer:v=>f((v.w*v.d+v.a)*v.e,v.d*v.b),check:v=>divideCheck(v.w*v.d+v.a,v.d,v.b,v.e),decorate:v=>({reciprocal:v.b===1?String(v.e):`${v.e}/${v.b}`,N:v.w*v.d+v.a,n:(v.w*v.d+v.a)*v.e,D:v.d*v.b,steps:fractionSteps((v.w*v.d+v.a)*v.e,v.d*v.b)}),
 errors:v=>[wrong(f((v.w+v.a)*v.e,v.d*v.b),'자연수와 분자 더하기','대분수를 가분수로 바꿀 때 {w} × {d} + {a} 대신 {w} + {a:을/를} 계산하여 {value:을/를} 썼습니다. 분자를 {w} × {d} + {a} = {N:으로/로} 바꾸고 {b}/{e:으로/로} 나누면 {answer:입니다}.'),wrong(f(v.w*v.d*v.b+v.a*v.e,v.d*v.b),'자연수는 그대로 두고 분수 부분만 나누기','자연수 {w:은/는} 그대로 두고 분수 부분 {a}/{d}만 {b}/{e:으로/로} 나누어 {value:을/를} 썼습니다. 자연수 부분까지 포함한 {N}/{d:을/를} {b}/{e:으로/로} 나누면 {answer:입니다}.')],
 solution:'{w} {a}/{d:을/를} 가분수로 바꾸면 {N}/{d:입니다}. 나누는 분수 {b}/{e}의 분모와 분자를 바꾸어 곱하면 {N}/{d} ÷ {b}/{e} = {N}/{d} × {reciprocal} = {steps}{stepsEnding}.\n따라서 답은 {answer:입니다}.',
});
