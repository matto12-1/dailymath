import { explain, j, count } from '../solution-process.js?v=9a67f36b25';
import {define,meta,casesSpec,errors,wrong,pairs,gcd,lcm,frac} from './helpers.js?v=9a67f36b25';
const cases=pairs(2,12,2,12,(a,b)=>a%b!==0&&b%a!==0&&gcd(a,b)>1&&a+b!==lcm(a,b)&&lcm(a,b)<=60).map(({a:d,b:e})=>({d,e})),answer=v=>lcm(v.d,v.e);
export default define(meta('reduce','common',2,'calc',['01-06'],'가장 작은 공통분모'),{
 input:'number',texts:['〔{left:과/와} {right}〕두 분수를 통분할 때 가장 작은 공통분모는 몇일까요?', '〔{left:과/와} {right}〕두 분수의 공통분모 중 가장 작은 수는 무엇일까요?'],
 ...casesSpec(cases,answer,v=>Array.from({length:v.e},(_,i)=>(i+1)*v.d).find(n=>n%v.e===0),explain((v,rng)=>({...v,left:frac(0,rng.pick(Array.from({length:v.d-1},(_,i)=>i+1).filter(n=>gcd(n,v.d)===1)),v.d),right:frac(0,rng.pick(Array.from({length:v.e-1},(_,i)=>i+1).filter(n=>gcd(n,v.e)===1)),v.e),...errors(wrong(v.d*v.e,'분모를 곱한 뒤 멈추기','{d} × {e}도 공통분모지만 가장 작지는 않습니다. {d}의 배수와 {e}의 배수 중 처음으로 같은 수는 {answer:이/가} 되므로 가장 작은 공통분모는 {answer:입니다}.'),wrong(v.d+v.e,'분모 더하기','{d} + {e:을/를} 공통분모로 골랐습니다. 분모를 더하는 대신 두 분모의 최소공배수를 구하면 가장 작은 공통분모는 {answer:입니다}.'))}), v => {const L=lcm(v.d,v.e);return [(v.d+'의')+' 배수를 차례로 쓰면 '+count(L/v.d,v.d)+', …입니다.', (v.e+'의')+' 배수를 차례로 쓰면 '+count(L/v.e,v.e)+', …입니다.', '두 분모의 배수에서 공통으로 처음 나오는 수를 찾습니다.'];})),
 solution:"{process}\n따라서 가장 작은 공통분모는 {answer:입니다}.",
});
