import {numeric,meta,cart,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('ratio','decimal',2,'calc',['02-03'],'비율을 소수로'),{
 answerKind:'decimal',cycleBy:'b',cases:cart({a:seq(1,99),b:[10,20,25,50,100]}).filter(v=>v.a<v.b&&100*v.a%v.b===0),
 texts:['〔기준량 {b}〕〔비교하는 양 {a}〕기준량과 비교하는 양을 보고 비율을 소수로 나타내면 얼마일까요?'],
 answer:v=>dec(100*v.a/v.b,2),check:v=>dec(v.a*(100/v.b),2),
 errors:v=>[wrong(String(100*v.a/v.b),'백분율을 답하기','비율 {answer}에 100을 곱한 {value:을/를} 썼습니다. 100을 곱하기 전의 비율을 소수로 쓰면 {answer:입니다}.'),wrong(dec(100*v.a/v.b,1),'소수점 한 자리만 옮기기','{a} ÷ {b}의 몫에 소수점을 잘못 찍어 {value:으로/로} 썼습니다. {a:은/는} {b}보다 작으므로 비율은 1보다 작은 {answer:입니다}.')],
 solution:'비교하는 양을 기준량으로 나누면 {a} ÷ {b} = {answer:입니다}.\n따라서 비율은 {answer:입니다}.',
});
