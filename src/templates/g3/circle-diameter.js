import {define,wrong,errors,seq} from './helpers.js?v=9a67f36b25';
import {meta,things} from './shape-helpers.js?v=9a67f36b25';
export default define(meta('circle','diameter',2,['06'],'반지름으로 지름 구하기'),{
  input:'number',errorCount:2,answerUnit:'cm',answerSpan:seq(1,9).map(r=>2*r),
  texts:['그림의 {thing}의 지름은 몇 cm일까요?','이 {thing}의 지름은 몇 cm일까요?'],
  draw(rng){const r=rng.pick(seq(1,9));return {r,thing:rng.pick(things),...errors(wrong(r,'반지름을 그대로 답하기',`반지름 ${r} cm를 그대로 썼습니다. 지름은 반지름의 2배이므로 ${r} + ${r} = ${2*r} cm입니다.`),wrong(r*3,'반지름 세 개 더하기',`반지름을 세 번 더해 ${r*3} cm라고 했습니다. 지름은 반지름 두 개의 길이이므로 ${r} + ${r} = ${2*r} cm입니다.`))};},
  answer:v=>v.r*2,check:v=>v.r+v.r,
  art:v=>({kind:'circle',r:v.r,show:['center','radius','diameter'],radiusLabel:`${v.r} cm`}),
  solution:'지름은 반지름 두 개의 길이이므로 {r} + {r} = {answer}입니다.\n따라서 지름은 {answer} cm입니다.',
});
