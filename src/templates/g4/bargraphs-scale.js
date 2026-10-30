import {define,meta,seq,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
import {labelsFor,barsArt} from './graph-helpers.js?v=9a67f36b25';
const cases=[2,5].flatMap(step=>seq(2,10).map(n=>({step,n})));
export default define(meta('bargraphs','scale',2,'life',['04-01'],'눈금 크기가 다른 막대그래프'),{
  input:'number',errorCount:3,answerUnit:'명',back:'g3s2-picture-graphs',
  texts:['막대그래프에서 {asked:을/를} 고른 사람은 몇 명일까요?'],
  ...casesSpec(cases,({step,n})=>step*n,({step,n})=>Array(n).fill(step).reduce((a,b)=>a+b,0),(v,rng)=>{const labels=labelsFor(rng),target=rng.int(0,2),values=rng.shuffle(seq(2,10).filter(n=>n!==v.n)).slice(0,2).map(n=>n*v.step);values.splice(target,0,v.n*v.step);return {...v,labelEvery:5,below:(v.n-1)*v.step,amount:v.n*v.step,labels,values,target,asked:labels[target],...errors(wrong(v.n,'칸 수를 명수로 읽기','한 칸이 {step}명인데 {n}칸을 {n}명으로 읽었습니다. {n}칸은 {n} × {step} = {answer}이므로 {answer}명입니다.'),wrong((v.n-1)*v.step,'아래 눈금 읽기','막대 끝보다 한 칸 아래 눈금 {below}명을 읽었습니다. 한 칸 {step}명만큼 더 올라간 막대 끝 눈금은 {amount}명입니다.'),wrong((v.n+1)*v.step,'위 눈금 읽기',`막대 끝보다 한 칸 위인 ${(v.n+1)*v.step}명을 읽었습니다. 막대 끝은 그보다 ${v.step}명 작은 ${v.n*v.step}명입니다.`))};}),
  art:barsArt,solution: "세로 눈금 한 칸은 {step}명을 나타냅니다.\n{asked} 막대는 {n}칸이므로 {n} × {step} = {answer}입니다.\n따라서 {asked:을/를} 고른 사람은 {answer}명입니다.",
});
