import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
import {lineArt} from './graph-helpers.js?v=9a67f36b25';
export default define(meta('linegraphs','survey',3,'word',['04-03'],'강낭콩이 자란 길이'),{
  input:'number',answerUnit:'cm',referenceArt:'line',answerSpan:seq(4,16),back:'g3s1-addsub',
  texts:["꺾은선그래프에서 월요일부터 금요일까지 강낭콩의 키는 몇 cm 자랐을까요?"],
  draw(rng){const change=cycle(rng,'line-survey',seq(4,16)),a=rng.int(8,15),b=a+change,values=[a,a+Math.floor(change/4),a+Math.floor(change/2),a+Math.floor(change*3/4),b];return {a,b,last:b-values[3],title:'강낭콩의 키',xLabel:'요일',yLabel:'키 (cm)',values,labels:['월','화','수','목','금'],base:5,step:1,unit:'cm',...errors(wrong(b-values[3],'마지막 하루만 계산하기','목요일부터 금요일까지 자란 {last} cm만 구했습니다. 월요일 {a} cm부터 금요일 {b} cm까지는 {b} − {a} = {answer}이므로 {answer} cm 자랐습니다.'),wrong(b,'끝 키 그대로 답하기','금요일 키 {b} cm를 그대로 썼습니다. 월요일 키 {a} cm를 빼면 {b} − {a} = {answer}이므로 {answer} cm 자랐습니다.'))};},
  answer:({a,b})=>b-a,check:v=>v.values.at(-1)-v.values[0],art:lineArt,
  solution: "꺾은선그래프에서 월요일 키는 {a} cm, 금요일 키는 {b} cm입니다.\n{b} − {a} = {answer}입니다.\n따라서 월요일부터 금요일까지 강낭콩은 {answer} cm 자랐습니다.",
});
