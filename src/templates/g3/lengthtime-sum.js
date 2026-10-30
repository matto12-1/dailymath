import { define, sum, pair, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define({ id:'g3.lengthtime.sum', unit:'g3s1-length-time', strand:'calc', level:3, label:'분과 초 더하기', std:['[4수03-14]'] }, {
  input:'number', answerKind:'pair', parts:[{after:'분'},{after:'초'}], range:{min:0,max:999}, errorCount:2,
  texts:["〔{a}분 {b}초 + {c}초 = ?〕계산하면 몇 분 몇 초일까요?"],
  draw(rng){const a=rng.int(1,8),b=rng.int(2,59),c=rng.int(61-b,59),seconds=b+c;return {a,b,c,seconds,minutes:a+1,left:seconds-60,...errors(
    wrong(pair(a,seconds),'초를 분으로 바꾸기 빠뜨리기',`${seconds}초 가운데 60초를 1분으로 바꾸지 않아 ${a}분 ${seconds}초라고 했습니다. ${seconds}초는 1분 ${seconds-60}초이므로 ${a}분에 1분을 더하면 ${a+1}분 ${seconds-60}초입니다.`),
    wrong(pair(a+1,seconds),'분을 올린 뒤 초 그대로 두기',`분에 1을 받아올리고도 ${seconds}초를 그대로 두어 ${a+1}분 ${seconds}초라고 했습니다. ${seconds}초에서 60초를 덜어 내면 ${seconds-60}초가 남으므로 ${a+1}분 ${seconds-60}초입니다.`))};},
  answer:({a,b,c})=>pair(a+1,b+c-60), check:({a,b,c})=>{const total=sum(a*60,b,c);return pair(Math.floor(total/60),total%60);},
  solution:"초끼리 더하면 {b}초 + {c}초 = {seconds}초이고, {seconds}초는 1분 {left}초입니다.\n{a}분에 받아올린 1분을 더하면 {minutes}분입니다.\n따라서 계산한 시간은 {minutes}분 {left}초입니다.",
});
