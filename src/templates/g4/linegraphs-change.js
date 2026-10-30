import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
import {lineArt} from './graph-helpers.js?v=9a67f36b25';
export default define(meta('linegraphs','change',2,'life',['04-02'],'꺾은선그래프 변화량'),{
  input:'number',answerUnit:'°C',answerSpan:seq(2,12),back:'g3s1-addsub',
  texts:['꺾은선그래프에서 {from}에서 {to}까지 기온이 몇 도 올랐을까요?'],
  draw(rng){const change=cycle(rng,'line-change',seq(2,12)),a=rng.int(8,16),b=a+change,labels=['1일','2일','3일','4일'],start=rng.int(0,1),end=start+2,values=[a,a+1,a+2,a+3];values[start]=a;values[start+1]=a+rng.int(1,change-1);values[end]=b;return {a,b,start,end,last:values[end]-values[end-1],labels,values,from:labels[start],to:labels[end],base:5,step:1,...errors(wrong(b,'끝 기온 그대로 답하기','나중 기온 {b}°C를 그대로 썼습니다. 처음 기온 {a}°C를 빼면 {b} − {a} = {answer}이므로 {answer}°C 올랐습니다.'),wrong(values[end]-values[end-1],'마지막 하루만 계산하기',`${labels[end-1]}에서 {to}까지 오른 {last}°C만 구했습니다. {from}부터 {to}까지는 {b} − {a} = {answer}이므로 {answer}°C 올랐습니다.`))};},
  answer:({a,b})=>b-a,check:v=>v.values[v.labels.indexOf(v.to)]-v.values[v.labels.indexOf(v.from)],art:lineArt,
  solution: "꺾은선그래프에서 {from}의 기온은 {a}°C, {to}의 기온은 {b}°C입니다.\n{b} − {a} = {answer}입니다.\n따라서 {from}에서 {to}까지 기온이 {answer}°C 올랐습니다.",
});
