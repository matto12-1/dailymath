import { define, seq, sum, errors, wrong } from './helpers.js?v=9a67f36b25';
const span=[...new Set([...seq(1,5).flatMap(m=>seq(5,55,5).map(s=>60*m+s)),...seq(2,9).map(m=>60*m)])].sort((a,b)=>a-b);
export default define({ id:'g3.lengthtime.seconds', unit:'g3s1-length-time', strand:'life', level:1, label:'분을 초로', std:['[4수03-13]'] }, {
  input:'number', range:{min:0,max:999}, errorCount:2, answerSpan:span, answerUnit:'초',
  texts:['{question}'],
  draw(rng){const turns=rng.pick([true,false]),m=turns?rng.int(2,9):rng.int(1,5),s=turns?0:rng.int(1,11)*5;
    return {m,s,turns,question:turns?`초침이 ${m}바퀴 도는 시간은 몇 초일까요?`:`〔${m}분 ${s}초 = ? 초〕빈칸에 알맞은 수는 얼마일까요?`,explanation:turns?`초침이 한 바퀴 도는 시간은 60초입니다. 60 × ${m} = ${60*m}입니다.`:`1분은 60초이므로 ${m}분은 ${60*m}초입니다. ${60*m}초 + ${s}초 = ${60*m+s}초입니다.`,conclusion:turns?`초침이 ${m}바퀴 도는 시간은 ${60*m}초입니다.`:`빈칸에 알맞은 수는 ${60*m+s}입니다.`,...errors(
      wrong(100*m+s,'1분을 100초로 바꾸기',turns?`초침이 한 바퀴 도는 시간을 100초로 보아 ${100*m}초라고 했습니다. 한 바퀴는 60초이므로 ${m}바퀴는 60 × ${m} = ${60*m}초입니다.`:`1분을 100초로 보아 ${100*m+s}초라고 했습니다. ${m}분은 ${60*m}초이므로 ${60*m} + ${s} = ${60*m+s}초입니다.`),
      turns?wrong(m,'바퀴 수를 초로 답하기',`초침이 돈 ${m}바퀴를 ${m}초라고 했습니다. 한 바퀴에 60초씩 ${m}바퀴 돌면 ${60*m}초입니다.`):wrong(60*m,'분만 바꾸고 초 빠뜨리기',`${m}분만 바꾸어 ${60*m}초라고 하고 ${s}초는 빠뜨렸습니다. 빠뜨린 ${s}초를 더하면 ${60*m} + ${s} = ${60*m+s}초입니다.`))};},
  answer:({m,s})=>60*m+s,check:({m,s})=>sum(...Array(m).fill(60),s),
  art:({m,turns})=>turns?({kind:'clock',h:12,m:0,secondDuration:m*60}):null,
  solution:"{explanation}\n따라서 {conclusion}",
});
