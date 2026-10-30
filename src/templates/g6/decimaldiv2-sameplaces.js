import {numeric,meta,cart,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv2','sameplaces',1,'calc',['01-15'],'소수 한 자리끼리 나누기'),{
 answerKind:'decimal',cycleBy:'B',cases:cart({A:seq(11,199),B:seq(2,19)}).filter(v=>v.A%10!==0&&v.B%10!==0&&100*v.A%v.B===0&&v.A/v.B<=50),
 texts:['〔{left} ÷ {right} = ?〕계산하면 얼마일까요?'],
 answer:v=>dec(100*v.A/v.B,2),check:v=>dec(Math.floor(v.A/v.B)*100+(v.A%v.B)*100/v.B,2),decorate:v=>({left:dec(v.A,1),right:dec(v.B,1)}),
 errors:v=>[wrong(dec(100*v.A/v.B,3),'나누는 수의 소수점 무시하기','{right} 대신 {B:으로/로} 나누어 {value:을/를} 썼습니다. 나누어지는 수 {left}도 10배 하여 {A} ÷ {B:을/를} 계산하면 {answer:입니다}.'),wrong(dec(v.A*v.B,2),'나누기 대신 곱하기','{left} ÷ {right} 대신 {left} × {right:을/를} 계산하여 {value:을/를} 썼습니다. 곱셈 대신 두 수를 모두 10배 한 {A} ÷ {B:을/를} 계산하면 {answer:입니다}.')],
 solution:'두 수를 모두 10배 하면 {A} ÷ {B:입니다}. 몫은 같으므로 {left} ÷ {right} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
