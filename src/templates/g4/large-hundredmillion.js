import {define,meta,seq,casesSpec,errors,wrong,largeText} from './helpers.js?v=9a67f36b25';
const cases=seq(1,8).flatMap(a=>seq(1,9).map(b=>({a,b})));
// 검수 A2-23: 풀이는 「5억 = 500000000, 1000만 = 10000000」처럼 자리 채우기를 보인다(읽는 말 괄호를 되풀이하지 않는다).
// 큰 수 답을 숫자판에 쓰므로 쓴 수의 읽는 말을 보이는 틀이다(readTyped, 10-22 판단 2).
export default define(meta('large','hundredmillion',2,'calc',['01-01'],'억과 만을 숫자로 쓰기'),{
  input:'number',maxDigits:10,readTyped:true,texts:['〔{shown}〕숫자로 쓰면 얼마일까요?', '〔{a}억 + {shownPart}〕숫자로 쓰면 얼마일까요?'],
  ...casesSpec(cases,({a,b})=>a*1e8+b*1e7,({a,b})=>(10*a+b)*1e7,(v)=>({...v,shown:largeText(v.a*1e8+v.b*1e7),...errors(
    wrong(v.a*1e8+v.b*1e6,'천만을 백만으로 읽기',`{shownPart:을/를} {low:으로/로} 읽어 ${v.a*1e8+v.b*1e6}을 썼습니다. {shownPart:은/는} {part}이므로 {shown:은/는} {answer}입니다.`),
    wrong((v.a+v.b)*1e8,'천만을 억으로 읽기',`{shownPart}에 0을 하나 더 붙여 {high:으로/로} 읽고 ${(v.a+v.b)*1e8}을 썼습니다. {hundred}에 {part:을/를} 더하면 {answer}입니다.`)),shownPart:largeText(v.b*1e7),hundred:v.a*1e8,part:v.b*1e7,low:largeText(v.b*1e6),high:largeText(v.b*1e8)})),
  solution:'{shown:은/는} {a}억과 {shownPart:을/를} 더한 수입니다.\n{a}억 = {hundred}, {shownPart} = {part:입니다}.\n따라서 {shown:은/는} {answer:입니다}.',
  // 풀이의 숫자도 제작값에서 만든다.
});
