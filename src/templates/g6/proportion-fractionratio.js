import {numeric,meta,proper,gcd,lcm,wrong,pair,fill} from './helpers.js?v=9a67f36b25';
const components=v=>{const L=lcm(v.d,v.e),x=v.a*L/v.d,y=v.b*L/v.e,g=gcd(x,y);return {L,x,y,g};};
const answer=v=>{const c=components(v);return pair(c.x/c.g,c.y/c.g);};
export default numeric(meta('proportion','fractionratio',1,'calc',['02-04'],'분수 비를 자연수 비로'),{
 answerKind:'pair',parts:[{after:':'},{}],cases:proper.flatMap(v=>proper.map(u=>({...v,b:u.a,e:u.d}))).filter(v=>v.d!==v.e&&lcm(v.d,v.e)<=60&&answer(v)!==pair(v.d,v.e)&&answer(v)!==pair(v.a,v.b)),
 texts:['〔{a}/{d} : {b}/{e}〕가장 간단한 자연수의 비로 쓰면 무엇일까요?'],
 answer,check:v=>{const x=v.a*v.e,y=v.b*v.d,g=gcd(x,y);return pair(x/g,y/g);},decorate:v=>{const c=components(v);return {...c,ra:c.x/c.g,rb:c.y/c.g,ending:c.g===1?fill('{x:과/와} {y}의 공약수는 1뿐입니다.',c):fill('전항과 후항을 최대공약수 {g:으로/로} 나눕니다.',{g:c.g,answer:pair(c.x/c.g,c.y/c.g).replace('|',' : ')})};},
 errors:v=>[wrong(pair(v.d,v.e),'분모끼리 비로 쓰기','분모 {d}, {e:을/를} 그대로 비로 썼습니다. 분모만 쓰지 않고 두 항에 최소공배수 {L:을/를} 곱한 뒤 약분하면 {ra} : {rb:입니다}.'),wrong(pair(v.a,v.b),'분자끼리 비로 쓰기','분모가 다른데 분자 {a}, {b}만 비로 썼습니다. 분모를 같게 하는 {L:을/를} 두 항에 곱하고 공약수로 나누면 {ra} : {rb:입니다}.')],
 solution:'전항과 후항에 두 분모 {d:과/와} {e}의 최소공배수 {L:을/를} 곱하면 {x} : {y:입니다}. {ending}\n따라서 가장 간단한 자연수의 비는 {ra} : {rb:입니다}.',
});
