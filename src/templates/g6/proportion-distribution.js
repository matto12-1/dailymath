import {numeric,meta,cart,seq,gcd,wrong} from './helpers.js?v=9a67f36b25';
const cases=cart({a:seq(2,9),b:seq(2,9),k:seq(2,8),target:[0,1]}).filter(v=>v.a!==v.b&&gcd(v.a,v.b)===1).map(v=>({...v,A:(v.a+v.b)*v.k}));
export default numeric(meta('proportion','distribution',3,'calc',['02-05'],'비례배분하기'),{
 cases,texts:['〔{A} → {a} : {b}〕{A:을/를} {a} : {b:으로/로} 비례배분할 때 {position} {part}에 해당하는 수는 몇일까요?','〔{A} → {a} : {b}〕{A:을/를} {a} : {b:으로/로} 비례배분할 때 {position} {part}에 해당하는 수는 몇일까요?'],
 answer:v=>v.k*(v.target?v.b:v.a),check:v=>v.A/(v.a+v.b)*(v.target?v.b:v.a),decorate:v=>({s:v.a+v.b,one:v.k,part:v.target?v.b:v.a,position:v.target?'후항':'전항',otherPosition:v.target?'전항':'후항',otherPart:v.target?v.a:v.b}),
 errors:v=>[wrong(v.k*(v.target?v.a:v.b),'반대로 배분하기','{position} {part} 대신 {otherPosition} {otherPart}에 해당하는 수를 구하여 {value:을/를} 썼습니다. 반대 항 대신 {position} {part}에 해당하는 부분을 구하면 {A} × {part}/{s} = {answer:입니다}.'),wrong(v.k,'한 부분만 답하기','{A} ÷ {s} = {one}에서 멈추어 {value:을/를} 썼습니다. 한 부분의 크기 {one}에 {position} {part:을/를} 곱하면 {answer:입니다}.')],
 solution:'전항과 후항의 합은 {a} + {b} = {s:입니다}. {position} {part}에 해당하는 수는 {A} × {part}/{s} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
