import {define,meta,seq,cycle} from './helpers.js?v=9a67f36b25';
import {labelsFor,barsArt,readErrors} from './graph-helpers.js?v=9a67f36b25';
export default define(meta('bargraphs','read',1,'life',['04-01'],'막대그래프 읽기'),{
  input:'number',answerUnit:'명',answerSpan:seq(2,12),
  texts:['막대그래프에서 {asked:을/를} 고른 사람은 몇 명일까요?'],
  draw(rng){const answer=cycle(rng,'bar-read',seq(2,12)),labels=labelsFor(rng),target=rng.int(0,2),values=rng.shuffle(seq(2,12).filter(n=>n!==answer)).slice(0,2);values.splice(target,0,answer);return {labels,values,target,asked:labels[target],step:1,...readErrors(values,target,labels)};},
  answer:v=>v.values[v.target],check:v=>v.values[v.labels.indexOf(v.asked)],art:barsArt,
  solution:"{asked} 막대의 끝에서 세로 눈금을 읽습니다.\n따라서 {asked:을/를} 고른 사람은 {answer}명입니다.",
});
