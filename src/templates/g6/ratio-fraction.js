import {numeric,meta,cart,seq,wrong,f,fractionSteps} from './helpers.js?v=9a67f36b25';
export default numeric(meta('ratio','fraction',2,'calc',['02-03'],'비율을 분수로'),{
 answerKind:'fraction',cycleBy:'less',cycleWeights:{true:4,false:1},cases:cart({a:seq(1,19),b:seq(2,20)}).filter(v=>v.a!==v.b).map(v=>({...v,less:v.a<v.b})),
 texts:['〔기준량 {b}〕〔비교하는 양 {a}〕기준량과 비교하는 양을 보고 비율을 분수로 나타내면 얼마일까요?'],
 answer:v=>f(v.a,v.b),check:v=>f(v.a*3,v.b*3),decorate:v=>({steps:fractionSteps(v.a,v.b)}),
 errors:v=>[wrong(f(v.b,v.a),'기준량과 비교하는 양 바꾸기','기준량 {b:을/를} 비교하는 양 {a:으로/로} 나누었습니다. 비교하는 양 {a:을/를} 분자, 기준량 {b:을/를} 분모로 쓰면 {answer:입니다}.'),wrong(f(v.a,v.a+v.b),'두 양을 합해 기준량으로 쓰기','기준량 {b}에 비교하는 양 {a:을/를} 더한 수로 나누었습니다. 두 양을 더하지 않고 기준량 {b:으로/로} 비교하는 양 {a:을/를} 나누면 {answer:입니다}.')],
 solution:'비율은 비교하는 양 ÷ 기준량입니다. {a} ÷ {b} = {steps}{stepsEnding}.\n따라서 비율은 {answer:입니다}.',
});
