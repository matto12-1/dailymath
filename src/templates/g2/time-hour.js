import { define, seq, sum, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.time.hour","unit":"g2s2-time","strand":"life","level":2,"label":"시간을 분으로","std":["[2수03-08]"]}, {

  range:{min:0,max:300},operandRange:{min:0,max:240},differentDigits:true,errorCount:3,
  answerSpan:[...seq(61,119),...seq(121,179)],
  candidates:({h,m})=>seq(Math.max(61,h*60+m-10),Math.min(179,h*60+m+10)).filter(n=>n!==120),
  texts:['{h}시간 {m}분은 모두 몇 분일까요?'],
  draw(rng){const h=rng.int(1,2),m=rng.int(1,59);return {h,m,minutes:h*60,...errors(
    wrong(h*100+m,'1시간을 100분으로 바꾸기',`1시간을 100분으로 보고 ${h*100}분에 ${m}분을 더했습니다. 한 시간은 60분이므로 ${h*60}분에 ${m}분을 더하면 ${h*60+m}분입니다.`),
    // 60·120은 답이 될 수 없는 붙박이 오답이라 시간 수를 바꿔 세는 실수로 대신한다(C-9).
    wrong((3-h)*60+m,'시간 수 바꾸어 세기',`${h}시간을 ${3-h}시간으로 보고 분으로 바꾸었습니다. 시간 수를 ${h}로 읽어 분으로 바꾼 뒤 ${m}분을 더하면 ${h*60+m}분입니다.`),
    rng.pick([true,false])?wrong(h*60+m*2,'남은 분 두 번 더하기',`${h}시간을 분으로 바꾼 뒤 ${m}분을 두 번 더했습니다. ${h}시간 ${m}분은 ${h*60}분에 ${m}분을 한 번만 더한 ${h*60+m}분입니다.`):wrong(h*60-m,'남은 분을 빼기',`${h*60}분에 ${m}분을 더해야 하는데 뺐습니다. ${h}시간 ${m}분은 ${h*60}분에 ${m}분을 더하면 ${h*60+m}분입니다.`))};},
  answer:({h,m})=>60*h+m,check:({h,m})=>sum(...Array(h).fill(60),m),
  art:({h,m})=>({kind:'clock',duration:h*60,remainingMinutes:m}),solution: "{h}시간은 {minutes}분입니다.\n{h}시간 {m}분은 {minutes}분에 {m}분을 더한 시간입니다. {minutes} + {m} = {answer}입니다.\n따라서 {h}시간 {m}분은 {answer}분입니다.",
});
