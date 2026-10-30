import {define,wrong,errors,seq} from './helpers.js?v=9a67f36b25';
import {meta,things} from './shape-helpers.js?v=9a67f36b25';
export default define(meta('circle','compass',3,['07'],'컴퍼스 간격'),{
  input:'number',errorCount:2,answerUnit:'cm',answerSpan:seq(3,9),
  texts:["이 {thing:을/를} 그리려면 컴퍼스를 몇 cm 벌려야 할까요?","이 {thing:을/를} 그리려면 컴퍼스를 몇 cm 벌려야 할까요?"],
  draw(rng){const d=2*rng.pick(seq(3,9));return {d,thing:rng.pick(things),...errors(wrong(d,'지름만큼 컴퍼스 벌리기',`지름 ${d} cm를 그대로 썼습니다. 컴퍼스를 벌린 간격은 반지름과 같으므로 ${d} ÷ 2 = ${d/2} cm입니다.`),wrong(d*2,'거꾸로 두 배 하기',`지름 ${d} cm를 2배 하여 ${d*2} cm라고 했습니다. 지름을 2로 나눈 길이는 ${d/2} cm이므로 컴퍼스를 벌릴 간격은 ${d/2} cm입니다.`))};},
  answer:v=>v.d/2,check:v=>{let r=0;for(let n=0;n<v.d;n+=2)r++;return r;},
  art:v=>({kind:'circle',r:v.d/2,show:['center','diameter'],diameterLabel:`${v.d} cm`,compass:true}),
  solution:"컴퍼스를 벌린 간격은 원의 반지름과 같습니다.\n지름이 {d} cm이므로 반지름은 {d} ÷ 2 = {answer}입니다.\n따라서 벌려야 하는 간격은 {answer} cm입니다.",
});
