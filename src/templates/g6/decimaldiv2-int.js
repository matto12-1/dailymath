import {numeric,meta,cart,seq,wrong,dec,decimalDivision} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv2','int',2,'calc',['01-15'],'자연수를 소수로 나누기'),{
 answerKind:'decimal',cases:cart({A:seq(1,30),B:seq(2,9)}).filter(v=>1000*v.A%v.B===0),
 texts:['〔{A} ÷ {right} = ?〕계산하면 얼마일까요?'],
 answer:v=>dec(1000*v.A/v.B,2),check:v=>dec((v.A*10%v.B)*100/v.B+Math.floor(v.A*10/v.B)*100,2),decorate:v=>({right:dec(v.B,1),tenA:v.A*10,division:decimalDivision(v.A*10,v.B)}),
 errors:v=>[wrong(dec(1000*v.A/v.B,3),'자연수는 그대로 두기','{right}만 {B:으로/로} 바꾸고 자연수 {A:은/는} 그대로 두었습니다. 자연수 {A}도 10배 하여 {tenA} ÷ {B:을/를} 계산하면 {answer:입니다}.'),wrong(dec(v.A*v.B,1),'나누기 대신 곱하기','{A} ÷ {right} 대신 {A} × {right:을/를} 계산하여 {value:을/를} 썼습니다. 곱셈 대신 두 수를 10배 한 {tenA} ÷ {B:을/를} 계산하면 {answer:입니다}.')],
 solution:'두 수를 모두 10배 하면 {tenA} ÷ {B:입니다}. \n{division}\n따라서 답은 {answer:입니다}.',
});
