import {numeric,meta,cart,seq,proper,wrong,f,fractionSteps} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv1','notdivisible',3,'calc',['01-11'],'분자가 나누어지지 않는 분수'),{
 answerKind:'fraction',back:'g5s2-fraction-multiply',cases:proper.flatMap(v=>seq(2,5).map(c=>({...v,c}))).filter(v=>v.a%v.c!==0&&v.d*v.c<=60),
 texts:['〔{a}/{d} ÷ {c} = ?〕계산하면 얼마일까요?'],
 answer:v=>f(v.a,v.d*v.c),check:v=>f(v.a*2,v.d*v.c*2),decorate:v=>({D:v.d*v.c,steps:fractionSteps(v.a,v.d*v.c)}),
 errors:v=>[wrong(f(v.a*v.c,v.d),'분자에 곱하기','분모 대신 분자 {a}에 {c:을/를} 곱하여 {value:을/를} 썼습니다. 분모 {d}에 {c:을/를} 곱한 {D:을/를} 분모로 쓰면 {answer:입니다}.'),wrong(f(v.a,v.d),'나누는 수 무시하기','{c:으로/로} 나누지 않고 {a}/{d:을/를} 그대로 썼습니다. 원래 양 {a}/{d:을/를} {c}등분한 한 부분은 {answer:입니다}.')],
 solution:'{c:으로/로} 나누려면 1/{c:을/를} 곱합니다.\n{a}/{d} ÷ {c} = {a}/{d} × 1/{c} = {steps}{stepsEnding}.\n따라서 답은 {answer:입니다}.',
});
