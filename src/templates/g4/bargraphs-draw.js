import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
import {labelsFor,barsArt} from './graph-helpers.js?v=9a67f36b25';
export default define(meta('bargraphs','draw',2,'life',['04-01'],'막대를 그릴 칸 수'),{
  input:'number',answerUnit:'칸',answerSpan:seq(2,10),back:'g3s2-picture-graphs',
  texts:["{asked:을/를} 고른 사람은 {amount}명입니다. 막대그래프에서 {asked:을/를} 나타내려면 막대를 몇 칸 그려야 할까요?","{asked:을/를} 고른 사람은 {amount}명입니다. 막대그래프에서 {asked:을/를} 나타내려면 막대를 몇 칸 그려야 할까요?"],
  draw(rng){const n=cycle(rng,'bar-draw',seq(2,10)),step=rng.pick([2,5]),labels=labelsFor(rng),target=rng.int(0,2),values=[rng.int(2,10)*step,rng.int(2,10)*step];values.splice(target,0,0);return {n,step,labels,target,values,asked:labels[target],amount:n*step,blank:true,...errors(wrong(n*step,'명수를 칸 수로 답하기','한 칸이 {step}명인 것을 생각하지 않고 {amount}명을 {amount}칸으로 보았습니다. {amount} ÷ {step} = {answer}이므로 막대는 {answer}칸입니다.'),wrong(n+1,'눈금 선을 0부터 세기',`눈금 0의 선부터 선을 세어 ${n+1}칸이라고 했습니다. 선 사이의 칸을 세면 {amount}명까지 {n}칸입니다.`))};},
  answer:v=>v.n,check:v=>v.amount/v.step,art:barsArt,
  solution:"세로 눈금 한 칸은 {step}명을 나타냅니다. {amount} ÷ {step} = {answer}입니다.\n따라서 그려야 할 막대는 {answer}칸입니다.",
});
