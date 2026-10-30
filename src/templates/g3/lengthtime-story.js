import { define, pair, errors, wrong } from './helpers.js?v=9a67f36b25';

// 「몇 분 몇 초」는 붙는 띄어쓰기로 묶어 줄 끝에서 「몇 분 / 몇 초」로 갈리지 않게 한다(검수 B-17).
const ask = '몇 분 몇 초';
export default define({ id:'g3.lengthtime.story', unit:'g3s1-length-time', strand:'word', level:3, label:'뛴 시간 구하기', std:['[4수03-14]'] }, {
  input:'number', answerKind:'pair', parts:[{after:'분'},{after:'초'}], range:{min:0,max:999}, errorCount:2,
  texts:["{a}분 동안 쉬지 않고 걷거나 뛰었습니다. 그중 {s}초 동안 걸었다면 뛴 시간은 몇 분 몇 초일까요?","{a}분 동안 쉬지 않고 걷거나 뛰었습니다. 그중 {s}초 동안 걸었다면 뛴 시간은 몇 분 몇 초일까요?"],
  // 「1초 걸었다면」처럼 어색한 수와 0분 답은 내지 않는다(검수 B-32).
  draw(rng){const a=rng.int(2,9),s=5*rng.int(2,11);return {a,s,leftMinutes:a-1,leftSeconds:60-s,...errors(
    wrong(pair(a-1,100-s),'1분을 100초로 빌리기',`1분을 100초로 바꾸어 ${a-1}분 ${100-s}초라고 했습니다. ${a}분은 ${a-1}분 60초이므로 60초 − ${s}초 = ${60-s}초를 쓰면 ${a-1}분 ${60-s}초입니다.`),
    wrong(pair(a,60-s),'빌려준 1분 빼먹기',`초로 바꾼 1분을 빼지 않아 ${a}분 ${60-s}초라고 했습니다. ${a}분에서 1분을 60초로 바꾸면 ${a-1}분이 남으므로 뛴 시간은 ${a-1}분 ${60-s}초입니다.`))};},
  answer:({a,s})=>pair(a-1,60-s), check:({a,s})=>{const total=a*60-s;return pair(Math.floor(total/60),total%60);},
  art:()=>({scene:'running'}),
  // 검수 B-16: 「6분 = 5분 60초」로 바꾸는 줄을 먼저 보인다.
  solution:"{a}분은 {leftMinutes}분 60초입니다.\n60초에서 걸은 {s}초를 빼면 {leftSeconds}초입니다.\n따라서 뛴 시간은 {leftMinutes}분 {leftSeconds}초입니다.",
});
