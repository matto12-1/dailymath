import {numeric,meta,cart,seq,wrong,f,gcd,fill} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv1','intover',2,'calc',['01-10'],'가분수인 몫'),{
 answerKind:'fraction',backs:['g4s1-multiply-divide'],cases:cart({a:seq(3,35),d:seq(2,12)}).filter(v=>v.a>v.d&&v.a%v.d!==0),
 texts:['〔{a} ÷ {d}〕몫을 분수로 나타내면 얼마일까요?'],
 answer:v=>f(v.a,v.d),check:v=>f(Math.floor(v.a/v.d)*v.d+v.a%v.d,v.d),decorate:v=>{const r=v.a%v.d,g=gcd(r,v.d);return {q:Math.floor(v.a/v.d),r,whole:Math.floor(v.a/v.d)*v.d,reduction:g>1?fill('{q} {r}/{d:을/를} 약분하면 {answer:입니다}.\n',{g,r,q:Math.floor(v.a/v.d),d:v.d,answer:f(v.a,v.d)}):''};},
 errors:v=>[wrong(String(Math.floor(v.a/v.d)),'나머지 버리기','{a} ÷ {d}에서 나머지를 버려 {value:을/를} 썼습니다. 몫 {q}에 나머지 {r:을/를} {d:으로/로} 나눈 부분을 더하면 {answer:입니다}.'),wrong(f(v.d,v.a),'분자와 분모 바꾸기','나누는 수 {d:을/를} 분자로 {value:으로/로} 썼습니다. {a:을/를} 분자, {d:을/를} 분모로 쓰고 대분수로 나타내면 {answer:입니다}.')],
 solution:'{a} ÷ {d} = {a}/{d:입니다}.\n{a} ÷ {d} = {q} … {r}이므로 {a}/{d} = {whole}/{d} + {r}/{d} = {q} {r}/{d:입니다}.\n{reduction}따라서 답은 {answer:입니다}.',
});
