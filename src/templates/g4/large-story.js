import { explain, say } from '../solution-process.js?v=9a67f36b25';
import {define,meta,seq,casesSpec,errors,wrong,largeText} from './helpers.js?v=9a67f36b25';
const cases=seq(1,8).flatMap(a=>seq(1,9).map(b=>({a:a*1e8,b:b*1e6})));
// 검수 B-19: 4학년에게 어려운 「매출」 대신 「판 돈」, 검수 B-23: 답 칸 뒤에 「원」.
// 9자리 답을 숫자판에 쓰므로 쓴 수의 읽는 말을 보이는 틀이다(readTyped, 10-22 판단 2). 읽는 말은 화면(묶음 1)이 보인다.
export default define(meta('large','story',3,'word',['01-01','01-02'],'판 돈 뛰어 세기'),{
  input:'number',maxDigits:10,answerUnit:'원',readTyped:true,
  texts:["가게에서 물건을 팔아 번 돈이 {start}에서 {increase} 늘었습니다. 늘어난 뒤 번 돈은 몇 원일까요?","가게에서 물건을 팔아 번 돈이 {start}에서 {increase} 늘었습니다. 늘어난 뒤 번 돈은 몇 원일까요?"],
  ...casesSpec(cases,({a,b})=>a+b,({a,b})=>Number(BigInt(a)+BigInt(b)),explain(v=>({...v,start:largeText(v.a)+' 원',increase:largeText(v.b)+' 원',...errors(
    wrong(v.a+v.b/10,'늘어난 수의 0 빠뜨리기',`늘어난 {increase}에서 0을 빠뜨려 {small} 원만 더하고 ${v.a+v.b/10}을 썼습니다. 늘어난 {increase:은/는} {b} 원이므로 {a} + {b} = {answer} 원입니다.`),wrong(v.a-v.b,'늘어난 수 빼기',`번 돈이 늘었는데 {increase:을/를} 빼서 ${v.a-v.b}을 썼습니다. 늘어난 돈은 더해야 하므로 {start}에 {increase:을/를} 더하면 {answer} 원입니다.`)),small:largeText(v.b/10)}), v => ['100만 원을 1묶음으로 보면 ' + v.start + '은 ' + (v.a/1000000) + '묶음이고, 늘어난 돈은 ' + (v.b/1000000) + '묶음입니다.', '묶음끼리 더하면 ' + (v.a/1000000) + ' + ' + (v.b/1000000) + ' = ' + ((v.a+v.b)/1000000) + '이므로 100만 원짜리 묶음이 '+((v.a+v.b)/1000000)+'개입니다.'])),
  art:()=>({scene:'shop'}),solution:'{process}\n따라서 늘어난 뒤 번 돈은 {answer} 원입니다.',
});
