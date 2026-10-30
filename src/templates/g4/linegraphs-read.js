import {define,meta,seq,cycle} from './helpers.js?v=9a67f36b25';
import {lineArt,readErrors} from './graph-helpers.js?v=9a67f36b25';
export default define(meta('linegraphs','read',1,'life',['04-02'],'꺾은선그래프 한 점 읽기'),{
  input:'number',answerUnit:'°C',answerSpan:seq(10,25),
  texts:['꺾은선그래프에서 {asked}의 기온은 몇 도일까요?'],
  draw(rng){const answer=cycle(rng,'line-read',seq(10,25)),values=rng.shuffle(seq(10,25).filter(n=>n!==answer)).slice(0,3),target=rng.int(0,3),labels=['1일','2일','3일','4일'];values.splice(target,0,answer);return {values,labels,target,asked:labels[target],base:8,step:1,...readErrors(values,target,labels,{thing:"점",unit:"°C"})};},
  answer:v=>v.values[v.target],check:v=>v.values[v.labels.indexOf(v.asked)],art:lineArt,
  solution:"{asked}의 점에서 세로 눈금을 읽습니다.\n따라서 {asked}의 기온은 {answer}°C입니다.",
});
