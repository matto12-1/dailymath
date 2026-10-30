import {define,meta,casesSpec,errors,wrong,pairs,nth,repeated} from './helpers.js?v=9a67f36b25';
const cases=pairs(2,12,2,8).map(({a,b:k})=>({a,k})),answer=v=>v.a*v.k;
export default define(meta('factors','multiple',2,'calc',['01-05'],'몇 번째 배수'),{
 input:'number',texts:['{a}의 {ordinal} 번째 배수는 몇일까요?','{a}의 배수를 작은 수부터 쓰면 {ordinal} 번째 수는 무엇일까요?'],
 ...casesSpec(cases,answer,v=>repeated(v.a,v.k),v=>({...v,ordinal:nth[v.k],second:v.a*2,third:v.a*3,...errors(wrong(v.a*(v.k-1),'0을 첫 배수로 세기','0을 첫 번째 배수로 세었습니다. {a} × 1부터 세어 {ordinal} 번째 배수까지 가면 {a} × {k} = {answer:입니다}.'),wrong(v.a*(v.k+1),'자기 자신을 배수에서 빼기','{a:을/를} 빼고 배수를 세었습니다. {a}도 첫 번째 배수에 넣어 세면 {ordinal} 번째 배수는 {a} × {k} = {answer:입니다}.'))})),
 solution:'{a}의 배수를 작은 수부터 쓰면 {a} × 1 = {a}, {a} × 2 = {second}, {a} × 3 = {third}, …입니다.\n따라서 {a}의 {ordinal} 번째 배수는 {answer:입니다}.',
});
