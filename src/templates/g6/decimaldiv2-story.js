import {numeric,meta,cart,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv2','story',3,'word',['01-15'],'리본을 소수 길이로 자르기'),{
 answerUnit:'개',minMistakes:2,errorCount:2,cases:cart({A:seq(1,30),B:seq(2,9)}).filter(v=>v.A*10%v.B===0),
 texts:['리본 {A} m를 {right} m씩 자릅니다. 몇 개를 만들 수 있을까요?','{A} m인 리본을 {right} m씩 자르면 몇 개가 나올까요?'],
 answer:v=>v.A*10/v.B,check:v=>Array(v.A).fill(10).reduce((a,b)=>a+b,0)/v.B,decorate:v=>({right:dec(v.B,1),tenA:v.A*10}),
 errors:v=>[...(v.A%v.B===0?[wrong(v.A/v.B,'나누는 수만 자연수로 바꾸기','{right} m 대신 {B} m씩 자른다고 계산하여 {value:을/를} 썼습니다. 전체 길이도 10배 하여 {tenA} ÷ {B:을/를} 계산하면 {answer}개입니다.')]:[]),...(v.A*v.B%10===0?[wrong(v.A*v.B/10,'나누기 대신 곱하기','{A} ÷ {right} 대신 {A} × {right:을/를} 계산하여 {value:을/를} 썼습니다. 곱셈 대신 전체 길이 {A:을/를} 한 도막 {right:으로/로} 나누면 {answer}개입니다.')]:[])],
 art:()=>({scene:'craft'}),solution:'{A} ÷ {right} = {tenA} ÷ {B} = {answer:입니다}.\n따라서 {right} m인 리본은 {answer}개입니다.',
});
