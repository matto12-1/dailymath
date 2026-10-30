import {define,meta,seq,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
const cases=seq(10,180,5).flatMap(a=>seq(10,180,5).filter(b=>Math.abs(a-b)!==a).map(b=>({a,b})));
export default define(meta('angles','sumstory',3,'word',['03-24'],'부채 각도의 합'),{
  input:'number',answerUnit:'°',back:'g3s1-addsub',
  texts:['두 부채를 펼쳐 빈틈없이 나란히 붙였습니다. 각각 {a}°와 {b}°일 때 전체 각은 몇 도일까요?','펼친 두 부채의 각은 {a}°와 {b}°입니다. 겹치지 않게 나란히 붙이면 전체 각은 몇 도일까요?'],
  ...casesSpec(cases,({a,b})=>a+b,({a,b})=>Number(BigInt(a)+BigInt(b)),v=>({...v,...errors(wrong(Math.abs(v.a-v.b),'합 대신 차 구하기',`두 각을 더하지 않고 빼서 ${Math.abs(v.a-v.b)}°를 썼습니다. 두 부채의 각을 더하면 {a} + {b} = {answer}이므로 {answer}°입니다.`),wrong(v.a,'한 부채의 각만 답하기','한 부채의 각 {a}°만 썼습니다. 빠뜨린 {b}°도 더하면 {a} + {b} = {answer}이므로 {answer}°입니다.'))})),
  art:()=>({scene:'fans-open'}),solution:'두 부채의 각을 더하면 {a} + {b} = {answer}입니다.\n따라서 전체 각은 {answer}°입니다.',
});
