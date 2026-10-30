import {numeric,meta,cart,seq,wrong,f,gcd} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv1','divisible',2,'calc',['01-11'],'분자가 나누어지는 분수 나누기'),{
 answerKind:'fraction',cycleBy:'c',cases:cart({a:seq(2,11),d:seq(3,12),c:seq(2,6)}).filter(v=>v.a<v.d&&v.a%v.c===0&&gcd(v.a,v.d)===1),
 texts:['〔{a}/{d} ÷ {c} = ?〕계산하면 얼마일까요?'],
 answer:v=>f(v.a/v.c,v.d),check:v=>f(v.a,v.d*v.c),decorate:v=>({n:v.a/v.c}),
 errors:v=>[wrong(f(v.a*v.c,v.d),'나누기 대신 곱하기','분자 {a:을/를} {c:으로/로} 나누지 않고 곱하여 {value:을/를} 썼습니다. 분모 {d:은/는} 그대로 두고 분자 {a:을/를} {c:으로/로} 나누면 {answer:입니다}.'),wrong(f(v.a,v.d),'나누는 수 무시하기','{c:으로/로} 나누지 않고 {a}/{d:을/를} 그대로 썼습니다. 원래 양 {a}/{d:을/를} {c}등분하면 한 부분은 {answer:입니다}.')],
 solution:'분자를 나누면 {a} ÷ {c} = {n:입니다}. {a}/{d} ÷ {c} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
