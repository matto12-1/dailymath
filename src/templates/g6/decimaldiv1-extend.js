import {numeric,meta,cart,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv1','extend',2,'calc',['01-15'],'소수 둘째 자리까지 나누기'),{
 answerKind:'decimal',cycleBy:'d',back:'g4s1-multiply-divide',cases:cart({A:seq(11,199),d:seq(2,9)}).filter(v=>v.A%10!==0&&v.A%v.d!==0&&v.A*10%v.d===0),
 texts:['〔{left} ÷ {d} = ?〕계산하면 얼마일까요?'],
 answer:v=>dec(v.A*10/v.d,2),check:v=>dec(Math.floor(v.A/v.d)*10+(v.A%v.d)*10/v.d,2),decorate:v=>({left:dec(v.A,1),expanded:(v.A/10).toFixed(2),scaled:v.A*10,quotient:v.A*10/v.d,truncated:dec(Math.floor(v.A/v.d),1)}),
 errors:v=>[wrong(dec(Math.floor(v.A/v.d),1),'남은 양 버리기','소수 첫째 자리까지만 나누어 {value:으로/로} 썼습니다. {left}의 끝에 0을 붙인 {expanded:을/를} {d:으로/로} 끝까지 나누면 {answer:입니다}.'),wrong(dec(v.A*10/v.d,1),'소수점 한 자리 잘못 쓰기','{left} 대신 {A:을/를} {d:으로/로} 나눈 몫을 그대로 {value:으로/로} 썼습니다. {left:은/는} {A}의 1/10배이므로 {A} ÷ {d}의 몫도 1/10배 하면 {answer:입니다}.')],
 solution:'{left:은/는} 소수 끝에 0을 붙여 {expanded:으로/로} 나타낼 수 있습니다.\n{expanded:은/는} {scaled}의 1/100배이므로 {left} ÷ {d}의 몫은 {scaled} ÷ {d} = {quotient}의 1/100배입니다.\n{left} ÷ {d} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
