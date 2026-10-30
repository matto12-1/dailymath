import {define,meta,casesSpec,errors,wrong,pairs,gcd,lcm,divisors} from './helpers.js?v=9a67f36b25';
const cases=pairs(4,100,4,100,(a,b)=>a%b!==0&&b%a!==0&&divisors(gcd(a,b)).length>2),answer=v=>gcd(v.a,v.b);
export default define(meta('factors','gcd',2,'calc',['01-04'],'최대공약수'),{
 input:'number',texts:['〔{a:과/와} {b}〕두 수의 최대공약수는 무엇일까요?', '〔{a:과/와} {b}〕두 수의 최대공약수는 몇일까요?'],
 ...casesSpec(cases,answer,v=>divisors(v.a).filter(n=>v.b%n===0).at(-1),v=>({...v,left:divisors(v.a).join(', '),right:divisors(v.b).join(', '),common:divisors(gcd(v.a,v.b)).join(', '),...errors(wrong(lcm(v.a,v.b),'최소공배수와 혼동','공약수 대신 {a:과/와} {b}의 최소공배수를 구했습니다. 두 수를 모두 나누어떨어지게 하는 공약수는 {common}이고, 그중 가장 큰 수는 {answer:입니다}.'),wrong(divisors(gcd(v.a,v.b))[1],'작은 공약수에서 멈추기','1보다 큰 가장 작은 공약수만 찾았습니다. 공약수 {common} 중 가장 큰 수까지 찾으면 최대공약수는 {answer:입니다}.'))})),
 solution:'{a}의 약수는 {left:입니다}.\n{b}의 약수는 {right:입니다}.\n두 수의 공약수는 {common:입니다}.\n따라서 두 수의 최대공약수는 {answer:입니다}.',
});
