import {numeric,meta,proper,seq,wrong,f,divideCheck,fractionSteps} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv2','int',2,'calc',['01-11'],'자연수 나누기 분수'),{
 answerKind:'fraction',cases:proper.flatMap(v=>seq(2,12).map(A=>({A,b:v.a,e:v.d}))),
 texts:['〔{A} ÷ {b}/{e} = ?〕계산하면 얼마일까요?'],
 answer:v=>f(v.A*v.e,v.b),check:v=>divideCheck(v.A,1,v.b,v.e),decorate:v=>({reciprocal:v.b===1?String(v.e):`${v.e}/${v.b}`,n:v.A*v.e,steps:fractionSteps(v.A*v.e,v.b)}),
 errors:v=>[wrong(f(v.A,v.b),'분모 곱하기 빠뜨리기','{A} ÷ {b}만 계산하여 {value:을/를} 썼습니다. 빠뜨린 분모 {e:을/를} {A} ÷ {b}의 몫에 곱하면 {answer:입니다}.'),wrong(f(v.A*v.b,v.e),'나누는 분수 그대로 곱하기','{b}/{e}의 분모와 분자를 바꾸지 않고 {A}에 곱하여 {value:을/를} 썼습니다. 나누는 분수 {b}/{e}의 분모와 분자를 바꾸어 {A}에 곱하면 {answer:입니다}.')],
 solution:'나누는 분수 {b}/{e}의 분모와 분자를 바꾸어 곱하면 {A} ÷ {b}/{e} = {A} × {reciprocal} = {steps}{stepsEnding}.\n따라서 답은 {answer:입니다}.',
});
