import {define,wrong,errors,seq} from './helpers.js?v=9a67f36b25';
import {meta,things} from './shape-helpers.js?v=9a67f36b25';
export default define(meta('circle','half',2,['06'],'지름으로 반지름 구하기'),{
  input:'number',errorCount:2,answerUnit:'cm',answerSpan:seq(2,9),
  texts:['그림의 {thing}의 반지름은 몇 cm일까요?','이 {thing}의 반지름은 몇 cm일까요?'],
  draw(rng){const d=2*rng.pick(seq(2,9));return {d,thing:rng.pick(things),...errors(wrong(d,'지름을 그대로 답하기',`지름 ${d} cm를 그대로 썼습니다. 반지름은 지름의 반이므로 ${d} ÷ 2 = ${d/2} cm입니다.`),wrong(d*2,'거꾸로 두 배 하기',`지름 ${d} cm를 2배 하여 ${d*2} cm라고 했습니다. 지름을 2로 나눈 길이는 ${d/2} cm이므로 반지름은 ${d/2} cm입니다.`))};},
  answer:v=>v.d/2,check:v=>{let r=0;for(let n=0;n<v.d;n+=2)r++;return r;},
  art:v=>({kind:'circle',r:v.d/2,show:['center','diameter'],diameterLabel:`${v.d} cm`}),
  solution:'반지름은 지름의 반이므로 {d} ÷ 2 = {answer}입니다.\n따라서 반지름은 {answer} cm입니다.',
});
