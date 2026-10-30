import {numeric,meta,cart,seq,wrong,dec,decimalDivision} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv1','intquotient',2,'calc',['01-14'],'자연수 나눗셈의 소수 몫'),{
 answerKind:'decimal',back:'g4s1-multiply-divide',cases:cart({a:seq(1,79),d:[2,4,5]}).filter(v=>v.a%v.d!==0),
 texts:['〔{a} ÷ {d}〕몫을 소수로 나타내면 얼마일까요?'],
 answer:v=>dec(100*v.a/v.d,2),check:v=>dec(Math.floor(v.a/v.d)*100+(v.a%v.d)*100/v.d,2),decorate:v=>({division:decimalDivision(v.a,v.d),q:Math.floor(v.a/v.d),r:v.a%v.d,rest:dec((v.a%v.d)*100/v.d,2)}),
 errors:v=>[wrong(dec(Math.floor(v.a/v.d)*10+v.a%v.d,1),'나머지를 소수 부분으로 쓰기','몫 {q} 뒤에 나머지 {r:을/를} 그대로 소수 부분으로 붙여 {value:을/를} 썼습니다. 나머지 {r:을/를} {d:으로/로} 나눈 {rest:을/를} 몫 {q}에 더하면 {answer:입니다}.'),wrong(String(Math.floor(v.a/v.d)),'나머지 버리기','나머지 {r:을/를} 버리고 몫 {q}만 {value:으로/로} 썼습니다. 버린 나머지 {r}도 {d:으로/로} 나누어 몫 {q}에 더하면 {answer:입니다}.')],
 solution:'{division} {d} × {answer} = {a:으로/로} 확인합니다.\n따라서 답은 {answer:입니다}.',
});
