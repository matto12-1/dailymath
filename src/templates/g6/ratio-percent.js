import {numeric,meta,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('ratio','percent',3,'calc',['02-03'],'소수 비율의 백분율'),{
 answerKind:'int',answerUnit:'%',minMistakes:2,errorCount:3,cases:seq(1,99).map(p=>({p})),texts:['〔비율 {rate}〕백분율로 나타내면 몇 %일까요?'],
 answer:v=>v.p,check:v=>Array(100).fill(v.p).reduce((s,n)=>s+n,0)/100,decorate:v=>({rate:dec(v.p,2)}),
 errors:v=>[wrong(v.p*10,'천 배 하기','비율 {rate}에 100 대신 1000을 곱하여 {value:을/를} 썼습니다. 비율 {rate}에 100을 곱하면 {answer}%입니다.'),wrong(100-v.p,'나머지 부분의 백분율 답하기','비율을 백분율로 바꾼 뒤 100%에서 빼고 {value:을/를} 썼습니다. 전체에서 빼기 전의 {rate} × 100이 주어진 비율의 백분율이므로 {answer}%입니다.'),wrong(100,'전체의 백분율 답하기','부분 대신 전체를 나타내는 100%를 썼습니다. 주어진 비율 {rate}만 백분율로 바꾸면 {answer}%입니다.')],
 solution:'비율에 100을 곱하면 {rate} × 100 = {answer:입니다}.\n따라서 백분율은 {answer}%입니다.',
});
