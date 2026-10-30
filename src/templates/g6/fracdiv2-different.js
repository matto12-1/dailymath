import {numeric,meta,proper,wrong,f,divideCheck,fractionSteps} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv2','different',2,'calc',['01-11'],'분모가 다른 분수 나누기'),{
 answerKind:'fraction',cases:proper.flatMap(v=>proper.map(u=>({...v,b:u.a,e:u.d}))).filter(v=>v.d!==v.e&&v.d*v.e<=60&&v.d*v.b<=60&&v.a*v.e<=60&&v.a*v.e!==v.b*v.d),
 texts:['〔{a}/{d} ÷ {b}/{e} = ?〕계산하면 얼마일까요?'],
 answer:v=>f(v.a*v.e,v.d*v.b),check:v=>divideCheck(v.a,v.d,v.b,v.e),decorate:v=>({reciprocal:v.b===1?String(v.e):`${v.e}/${v.b}`,n:v.a*v.e,D:v.d*v.b,steps:fractionSteps(v.a*v.e,v.d*v.b)}),
 errors:v=>[wrong(f(v.a*v.b,v.d*v.e),'나누는 분수를 뒤집지 않기','나누는 분수 {b}/{e}의 분모와 분자를 바꾸지 않고 그대로 곱하여 {value:을/를} 썼습니다. 나누는 분수 {b}/{e}의 분모와 분자를 바꾸어 {a}/{d}에 곱하면 {answer:입니다}.'),wrong(f(v.d*v.b,v.a*v.e),'나누어지는 분수 뒤집기','나누어지는 분수 {a}/{d}의 분모와 분자를 바꾸어 {value:을/를} 썼습니다. {a}/{d:은/는} 그대로 두고 나누는 분수 {b}/{e}의 분모와 분자를 바꾸어 곱하면 {answer:입니다}.')],
 solution:'나누는 분수 {b}/{e}의 분모와 분자를 바꾸어 곱하면 {a}/{d} ÷ {b}/{e} = {a}/{d} × {reciprocal} = {steps}{stepsEnding}.\n따라서 답은 {answer:입니다}.',
});
