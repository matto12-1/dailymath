import {define,meta,casesSpec,errors,wrong,repeated} from './helpers.js?v=9a67f36b25';
const cases=[];for(let b=2;b<=9;b++)for(let c=2;c<=6;c++)for(let q=2;q<=18;q++){const a=b*c*q;if(a<=1000&&b!==c)cases.push({a,b,c});}
const answer=({a,b,c})=>a/b*c;
export default define(meta('mixed','left',1,'calc',['01-01'],'왼쪽부터 곱셈과 나눗셈'),{
 input:'number',texts:['〔{a} ÷ {b} × {c} = ?〕계산하면 얼마일까요?'],
 ...casesSpec(cases,answer,v=>repeated(v.a/v.b,v.c),(v)=>({...v,first:v.a/v.b,...errors(wrong(v.a/(v.b*v.c),'곱셈부터 계산하기','{b} × {c}부터 계산했습니다. 곱셈과 나눗셈이 섞여 있는 식은 왼쪽부터 {a} ÷ {b} = {first}, {first} × {c} = {answer:입니다}.'),wrong(v.a/v.b,'마지막 곱셈 빠뜨리기','{a} ÷ {b} = {first}에서 멈췄습니다. 나눈 몫에 {c:을/를} 곱하면 {first} × {c} = {answer:입니다}.'))})),
 solution:'곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례대로 계산합니다. {a} ÷ {b} = {first}, {first} × {c} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
