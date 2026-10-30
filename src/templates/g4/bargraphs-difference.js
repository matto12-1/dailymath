import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
import {labelsFor,barsArt} from './graph-helpers.js?v=9a67f36b25';
export default define(meta('bargraphs','difference',3,'life',['04-03'],'막대그래프의 차'),{
  input:'number',answerUnit:'명',answerSpan:[2,4,5,6,8,10,12,14,15,16,18,20,25,30,35,40,45],back:'g3s2-picture-graphs',
  texts:['막대그래프에서 {more:을/를} 고른 사람은 {less:을/를} 고른 사람보다 몇 명 많을까요?'],
  draw(rng){const diff=cycle(rng,'bar-diff',[2,4,5,6,8,10,12,14,15,16,18,20,25,30,35,40,45]),step=diff%5===0?5:2,n=diff/step,b=rng.int(1,Math.max(1,10-n))*step,a=b+diff,labels=labelsFor(rng),i=rng.int(0,2),j=(i+1)%3,values=[step*2,step*2,step*2];values[i]=a;values[j]=b;return {a,b,n,step,minCount:6,labels,values,more:labels[i],less:labels[j],...errors(wrong(n,'칸 수의 차만 답하기','한 칸이 {step}명인데 두 막대의 {n}칸 차이를 {n}명으로 읽었습니다. {more} {a}명에서 {less} {b}명을 빼면 {answer}명입니다.'),wrong(a,'많은 쪽의 명수 그대로 답하기','차 대신 {more:을/를} 고른 {a}명만 썼습니다. {less:을/를} 고른 {b}명을 빼면 {a} − {b} = {answer}명입니다.'))};},
  answer:({a,b})=>a-b,check:v=>v.values[v.labels.indexOf(v.more)]-v.values[v.labels.indexOf(v.less)],art:barsArt,
  solution: "막대그래프에서 {more:은/는} {a}명, {less:은/는} {b}명입니다.\n{a} − {b} = {answer}입니다.\n따라서 {more:을/를} 고른 사람은 {less:을/를} 고른 사람보다 {answer}명 많습니다.",
});
