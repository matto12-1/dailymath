import {numeric,meta,cart,seq,gcd,wrong,f,divideCheck,fractionSteps} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv2','same',1,'calc',['01-11'],'분모가 같은 분수 나누기'),{
 answerKind:'fraction',back:'g5s2-fraction-multiply',cases:cart({a:seq(1,11),b:seq(1,11),d:seq(3,12)}).filter(v=>v.a<v.d&&v.b<v.d&&v.a!==v.b&&gcd(v.a,v.d)===1&&gcd(v.b,v.d)===1),
 texts:['〔{a}/{d} ÷ {b}/{d} = ?〕계산하면 얼마일까요?'],
 decorate:v=>({steps:fractionSteps(v.a,v.b)}),
 answer:v=>f(v.a,v.b),check:v=>divideCheck(v.a,v.d,v.b,v.d),
 errors:v=>[wrong(f(v.a*v.b,v.d*v.d),'나누기 대신 곱하기','{a}/{d} ÷ {b}/{d} 대신 두 분수를 곱하여 {value:을/를} 썼습니다. 분모가 같으므로 곱하지 않고 분자끼리 {a} ÷ {b:을/를} 계산하면 {answer:입니다}.'),wrong(f(v.b,v.a),'분자의 순서 바꾸기','분자를 {a} ÷ {b} 대신 {b} ÷ {a:으로/로} 계산하여 {value:을/를} 썼습니다. 분자의 순서를 원래대로 하여 {a:을/를} {b:으로/로} 나누면 {answer:입니다}.')],
 solution:'분모가 같으므로 분자끼리 나눕니다. {a}/{d} ÷ {b}/{d} = {a} ÷ {b} = {steps}{stepsEnding}.\n따라서 답은 {answer:입니다}.',
});
