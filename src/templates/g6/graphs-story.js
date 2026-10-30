import {numeric,meta,cart,seq,wrong} from './helpers.js?v=9a67f36b25';
import {graphDecorate} from './graph-helpers.js?v=9a67f36b25';
export default numeric(meta('graphs','story',3,'word',['04-03'],'그래프를 읽어 학생 수 구하기'),{
 answerUnit:'명',referenceArt:'band',cases:cart({A:[40,60,80,100,120,160],p:seq(1,9).map(n=>n*10),q:[10,20,30]}).filter(v=>v.p+v.q<100&&v.p!==v.q&&v.p!==50&&v.A*v.p/100!==v.p),
 texts:['학생 {A}명을 조사하여 나타낸 띠그래프입니다. {item:(이)}라고 답한 학생은 몇 명일까요?','학생 {A}명을 조사하여 나타낸 띠그래프입니다. 그래프에서 {item:(이)}라고 답한 학생은 몇 명일까요?'],
 answer:v=>v.A*v.p/100,check:v=>v.A/100*v.p,decorate:graphDecorate,
 errors:v=>[wrong(v.p,'백분율을 인원으로 쓰기','백분율 {p}%의 {p:을/를} 그대로 학생 수로 썼습니다. 전체 {A}명에 {p}/100을 곱하면 {answer}명입니다.'),wrong(v.A*(100-v.p)/100,'다른 학생 수 구하기','{item:이/가} 아닌 다른 항목에 답한 학생 수를 구했습니다. 다른 항목을 빼고 {item}에 해당하는 {p}%의 학생 수만 구하면 {answer}명입니다.')],
 art:v=>({kind:'band',values:v.values,labels:v.labels,title:v.title,percentTicks:10,wide:true}),solution:'띠그래프에서 {item}의 비율은 {p}%입니다. {A} × {p}/100 = {answer:입니다}.\n따라서 {item:(이)}라고 답한 학생은 {answer}명입니다.',
});
