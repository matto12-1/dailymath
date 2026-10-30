import {numeric,meta,cart,seq,wrong,dec,decimalDivision} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv2','different',2,'calc',['01-15'],'소수 자릿수가 다른 나눗셈'),{
 answerKind:'decimal',cycleBy:'B',cases:cart({A:seq(11,399),B:seq(2,9)}).filter(v=>v.A%10!==0&&v.A*10%v.B===0),
 texts:['〔{left} ÷ {right} = ?〕계산하면 얼마일까요?'],
 answer:v=>dec(v.A*10/v.B,2),check:v=>dec(Math.floor(v.A/v.B)*10+(v.A%v.B)*10/v.B,2),decorate:v=>({left:dec(v.A,2),right:dec(v.B,1),scaled:dec(v.A,1)}),
 errors:v=>[wrong(dec(v.A*10/v.B,1),'소수점을 각각 모두 없애기','{left}의 소수점은 두 자리, {right}의 소수점은 한 자리 옮겨 {value:을/를} 썼습니다. 두 수를 모두 10배 한 {scaled} ÷ {B:을/를} 계산하면 {answer:입니다}.'),wrong(dec(v.A*10/v.B,3),'나누는 수만 십 배 하기','{right}만 {B:으로/로} 바꾸고 {left:은/는} 그대로 두었습니다. {left}도 {scaled:으로/로} 바꾸어 {B:으로/로} 나누면 {answer:입니다}.')],
 solution:'나누는 수 {right:이/가} 자연수가 되도록 두 수를 모두 10배 하면 {scaled} ÷ {B:입니다}.\n{scaled} ÷ {B} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
 extra:v=>({divisor:v.B*10}),
});
