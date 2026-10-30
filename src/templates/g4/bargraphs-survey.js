import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
import {barsArt} from './graph-helpers.js?v=9a67f36b25';
export default define(meta('bargraphs','survey',3,'word',['04-03'],'과일 조사 인원 합하기'),{
  input:'number',answerUnit:'명',referenceArt:'bars',answerSpan:seq(5,40).concat([42,44,46]),back:'g3s1-addsub',
  texts:["좋아하는 과일을 한 사람이 하나씩 골라 막대그래프로 나타냈습니다. 막대그래프에서 조사한 사람은 모두 몇 명일까요?"],
  draw(rng){const total=cycle(rng,'bar-survey',seq(5,40).concat([42,44,46])),a=rng.int(Math.max(2,total-24),Math.min(24,total-2)),b=total-a;if(a===b||Math.max(a,b)>20&&(a%2||b%2))return null;return {a,b,labels:['사과','배'],values:[a,b],step:Math.max(a,b)>20?2:1,...errors(wrong(Math.abs(a-b),'합 대신 차 구하기',`두 사람 수를 더하지 않고 빼서 ${Math.abs(a-b)}명을 썼습니다. 한 사람이 하나씩 골랐으므로 ${a} + ${b} = ${a+b}명입니다.`),wrong(a,'한 항목만 답하기','사과를 고른 {a}명만 세고 배를 고른 {b}명을 빠뜨렸습니다. 빠뜨린 {b}명도 더하면 {a} + {b} = {answer}명입니다.'))};},
  answer:({a,b})=>a+b,check:v=>v.values.reduce((s,n)=>s+n,0),art:barsArt,
  solution: "막대그래프에서 사과는 {a}명, 배는 {b}명입니다.\n한 사람이 하나씩 골랐으므로 사과와 배를 고른 사람 수를 더하면 {a} + {b} = {answer}입니다.\n따라서 조사한 사람은 모두 {answer}명입니다.",
});
