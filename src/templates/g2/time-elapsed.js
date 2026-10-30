import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.time.elapsed","unit":"g2s2-time","strand":"word","level":3,"label":"걸린 시간","std":["[2수03-08]"]}, {

  range:{min:0,max:180},operandRange:{min:0,max:180},answerSpan:seq(11,49),errorCount:3,
  texts:['{h}시 {m}분부터 {next}시까지 놀았습니다. 걸린 시간은 몇 분일까요?'],
  draw(rng){const h=rng.int(1,12),next=h===12?1:h+1,m=rng.int(11,49);return {h,next,m,...errors(
    wrong(100-m,'1시간을 100분으로 생각하기',`1시간을 100분으로 보고 ${m}분을 뺐습니다. 1시간인 60분에서 ${m}분을 빼면 ${60-m}분입니다.`),
    wrong(m,'시작 분을 그대로 고르기',`시작 시각의 ${m}분을 골랐습니다. 시작한 뒤 남은 분 수는 60에서 ${m}을 뺀 ${60-m}분입니다.`),
    wrong(Math.max(0,59-m),'끝 눈금 하나 덜 세기',`다음 정각까지 세면서 마지막 1분을 빠뜨렸습니다. 빠뜨린 마지막 1분까지 넣어 다음 정각까지 세면 ${60-m}분입니다.`))};},
  answer:({m})=>60-m,check:({m})=>seq(m,59).length,art:()=>({scene:'playground-play'}),
  solution: "{h}시부터 {next}시까지는 60분입니다.\n{h}시 {m}분은 {h}시에서 {m}분이 지난 시각이므로 {next}시까지는 60 − {m} = {answer}입니다.\n따라서 걸린 시간은 {answer}분입니다.",
});
