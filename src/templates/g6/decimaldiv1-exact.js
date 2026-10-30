import {numeric,meta,cart,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv1','exact',1,'calc',['01-15'],'소수 나누기 자연수'),{
 answerKind:'decimal',cycleBy:'d',back:'g5s2-decimal-multiply',cases:cart({A:seq(11,199),d:seq(2,9)}).filter(v=>v.A%10!==0&&v.A%v.d===0),
 texts:['〔{left} ÷ {d} = ?〕계산하면 얼마일까요?'],
 answer:v=>dec(v.A/v.d,1),check:v=>dec(v.A*10/v.d,2),decorate:v=>({left:dec(v.A,1),whole:v.A/v.d}),
 errors:v=>[wrong(dec(v.A/v.d,0),'소수점 빠뜨리기','{left} 대신 {A:을/를} {d:으로/로} 나누고 몫의 소수점을 찍지 않았습니다. {left:은/는} {A}의 1/10배이므로 자연수 나눗셈의 몫 {whole}도 1/10배 하면 {answer:입니다}.'),wrong(dec(v.A*v.d,1),'나누기 대신 곱하기','{left} ÷ {d} 대신 {left} × {d:을/를} 계산하여 {value:을/를} 썼습니다. {left:을/를} {d}등분하여 한 부분의 크기를 구하면 {answer:입니다}.')],
 solution:'{left:은/는} {A}의 1/10배이므로 {left} ÷ {d}의 몫은 {A} ÷ {d} = {whole}의 1/10배입니다. {left} ÷ {d} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
