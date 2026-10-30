import {define,meta,casesSpec,errors,wrong,pairs} from './helpers.js?v=9a67f36b25';
const cases=pairs(2,9,2,20).flatMap(({a:d,b:q})=>[q+1,q+3,q+7,q+12].map(k=>({a:k*d,b:q*d,d}))),answer=v=>v.a-v.b/v.d;
export default define(meta('mixed','division',2,'calc',['01-01'],'나눗셈 먼저 계산하기'),{
 input:'number',texts:['〔{a} − {b} ÷ {d} = ?〕계산하면 얼마일까요?'],
 ...casesSpec(cases,answer,v=>Number(BigInt(v.a)-BigInt(v.b)/BigInt(v.d)),v=>({...v,first:v.b/v.d,...errors(wrong((v.a-v.b)/v.d,'뺄셈부터 계산하기','{a} − {b}부터 계산하고 {d:으로/로} 나누었습니다. {b} ÷ {d} = {first}부터 구한 뒤 {a}에서 빼면 {answer:입니다}.'),wrong(v.a-v.b,'나눗셈 빠뜨리기','{b} ÷ {d:을/를} 계산하지 않고 {a} − {b}만 계산했습니다. {b} 대신 나눈 몫 {first:을/를} 빼면 {a} − {first} = {answer:입니다}.'))})),
 solution:'{b} ÷ {d} = {first}부터 구합니다. {a} − {first} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
