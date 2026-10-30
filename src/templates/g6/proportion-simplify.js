import {numeric,meta,cart,seq,gcd,wrong,pair} from './helpers.js?v=9a67f36b25';
export default numeric(meta('proportion','simplify',1,'calc',['02-04'],'가장 간단한 자연수 비'),{
 answerKind:'pair',parts:[{after:':'},{}],back:'g5s1-reduce-common-denominators',cases:cart({a:seq(1,9),b:seq(1,9),g:[4,6,8,10,12]}).filter(v=>gcd(v.a,v.b)===1&&v.a!==v.b),
 texts:['〔{A} : {B}〕가장 간단한 자연수의 비로 쓰면 무엇일까요?'],
 answer:v=>pair(v.a,v.b),check:v=>pair(v.a*v.g/gcd(v.a*v.g,v.b*v.g),v.b*v.g/gcd(v.a*v.g,v.b*v.g)),decorate:v=>({A:v.a*v.g,B:v.b*v.g}),
 errors:v=>[wrong(pair(v.a*v.g/2,v.b*v.g/2),'공약수로 한 번만 나누기','전항과 후항을 2로만 나누었습니다. 두 항을 최대공약수 {g:으로/로} 끝까지 나누면 {a} : {b:입니다}.'),wrong(pair(v.a,v.b*v.g),'한 항만 나누기','전항만 {g:으로/로} 나누었습니다. 후항 {B}도 같은 수 {g:으로/로} 나누면 가장 간단한 비는 {a} : {b:입니다}.')],
 solution:'전항 {A:과/와} 후항 {B}의 최대공약수는 {g:입니다}. 전항과 후항을 {g:으로/로} 나누면 {A} ÷ {g} = {a}, {B} ÷ {g} = {b:입니다}.\n따라서 가장 간단한 자연수의 비는 {a} : {b:입니다}.',
});
