import {define,meta,casesSpec,errors,wrong,pairs,gcd,lcm} from './helpers.js?v=9a67f36b25';
// 교과서 연습처럼 최소공배수는 150 이하로 두고, 한 수가 다른 수의 배수라 큰 수가 곧 답인 짝은 뺀다(10-20).
// 풀이는 교과서의 「공약수로 나누기」를 최대공약수로 한 번에 한다.
const cases=pairs(2,40,2,40,(a,b)=>a%b!==0&&b%a!==0&&gcd(a,b)>1&&lcm(a,b)<=150),answer=v=>lcm(v.a,v.b);
export default define(meta('factors','lcm',3,'calc',['01-05'],'최소공배수'),{
 input:'number',texts:['〔{a:과/와} {b}〕두 수의 최소공배수는 무엇일까요?', '〔{a:과/와} {b}〕두 수의 최소공배수는 몇일까요?'],
 ...casesSpec(cases,answer,v=>Array.from({length:v.b},(_,i)=>(i+1)*v.a).find(n=>n%v.b===0),v=>({...v,g:gcd(v.a,v.b),p:v.a/gcd(v.a,v.b),q:v.b/gcd(v.a,v.b),...errors(wrong(v.a*v.b,'공약수를 생각하지 않고 곱하기','공약수를 생각하지 않고 {a} × {b}만 계산했습니다. 두 수를 최대공약수 {g:으로/로} 나눈 몫 {p}, {q:과/와} 최대공약수 {g:을/를} 곱하면 {g} × {p} × {q} = {answer:입니다}.'),wrong(gcd(v.a,v.b),'최대공약수와 혼동','공배수 대신 {a:과/와} {b}의 최대공약수를 구했습니다. 두 수를 최대공약수로 나눈 뒤 {g} × {p} × {q:을/를} 계산하면 최소공배수는 {answer:입니다}.'))})),
 solution:'{a:과/와} {b}의 최대공약수는 {g:입니다}.\n{a} ÷ {g} = {p}, {b} ÷ {g} = {q}이므로 {g} × {p} × {q} = {answer:입니다}.\n따라서 {a:과/와} {b}의 최소공배수는 {answer:입니다}.',
});
