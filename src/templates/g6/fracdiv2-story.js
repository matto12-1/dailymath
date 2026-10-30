import {numeric,meta,proper,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv2','story',3,'word',['01-11'],'끈을 같은 길이로 자르기'),{
 answerUnit:'개',minMistakes:1,errorCount:3,cases:proper.flatMap(v=>seq(1,8).map(k=>({A:v.a*k,b:v.a,e:v.d}))),
 texts:['끈 {A} m를 {b}/{e} m씩 자릅니다. 몇 개를 만들 수 있을까요?','길이가 {A} m인 끈을 {b}/{e} m씩 자르면 끈은 몇 개가 될까요?'],
 answer:v=>v.A*v.e/v.b,check:v=>v.A/v.b*v.e,decorate:v=>({reciprocal:v.b===1?String(v.e):`${v.e}/${v.b}`}),
 errors:v=>[wrong(v.A/v.b,'분모 무시하기','{b}/{e} m 대신 {b} m씩 자른다고 계산하여 {value:을/를} 썼습니다. 전체 길이 {A:을/를} 한 도막의 길이 {b}/{e:으로/로} 나누면 {answer}개입니다.'),wrong(v.A*v.e,'분자 무시하기','{b}/{e} m 대신 1/{e} m씩 자른다고 계산하여 {value:을/를} 썼습니다. 1/{e} m짜리 도막 {b}개를 한 도막으로 묶으면 {A} × {e} ÷ {b} = {answer}개입니다.'),...(v.A*v.b%v.e===0?[wrong(v.A*v.b/v.e,'나누기 대신 곱하기','전체 길이 {A}에 한 도막의 길이 {b}/{e:을/를} 곱하여 {value:을/를} 썼습니다. 몇 도막인지는 나눗셈으로 구하므로 {A} ÷ {b}/{e} = {answer}개입니다.')]:[])],
 art:()=>({scene:'cord-cutting'}),solution:'{A} ÷ {b}/{e} = {A} × {reciprocal} = {answer:입니다}.\n따라서 {b}/{e} m인 끈은 {answer}개입니다.',
});
