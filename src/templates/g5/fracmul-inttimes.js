import {define,meta,casesSpec,errors,wrong,frac,repeated,gcd} from './helpers.js?v=9a67f36b25';
const cases=[];for(let d=3;d<=12;d++)for(let n=2;n<d;n++)for(let q=1;q<=20;q++){if(gcd(n,d)===1)cases.push({A:d*q,n,d});};
const answer=v=>v.A/v.d*v.n;
export default define(meta('fracmul','inttimes',2,'calc',['01-09'],'자연수와 분수의 곱'),{
 input:'number',back:'g3s2-fractions',texts:['〔{A} × {right} = ?〕계산하면 얼마일까요?'],
 ...casesSpec(cases,answer,v=>repeated(v.A/v.d,v.n),v=>({...v,right:frac(0,v.n,v.d),part:v.A/v.d,...errors(wrong(v.A*v.n,'분모 무시하기','분모 {d:을/를} 무시하고 {A} × {n}만 계산했습니다. 분모 {d:으로/로} 나눈 뒤 분자를 곱하면 {part} × {n} = {answer:입니다}.'),wrong(v.A/v.d,'분자 무시하기','{A:을/를} {d:으로/로} 나눈 뒤 분자 {n:을/를} 곱하지 않았습니다. 나눈 몫에 빠뜨린 분자까지 곱하면 {part} × {n} = {answer:입니다}.'))})),
 solution:'자연수 {A:과/와} 분모 {d:을/를} {d:으로/로} 약분하면 {part} × {n:입니다}. {part} × {n} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
