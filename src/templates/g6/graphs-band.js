import {numeric,meta,wrong} from './helpers.js?v=9a67f36b25';
import {shares,graphDecorate} from './graph-helpers.js?v=9a67f36b25';
export default numeric(meta('graphs','band',1,'life',['04-02'],'띠그래프의 비율 읽기'),{
 answerUnit:'%',cases:shares(10),texts:['띠그래프에서 {item}의 비율은 몇 %일까요?','{item} 부분은 전체의 몇 %일까요?'],
 answer:v=>v.p,check:v=>v.p/10*10,decorate:(v,rng)=>({...graphDecorate(v,rng),ticks:v.p/10}),
 errors:v=>[wrong(v.q,'다른 항목 읽기','{item:이/가} 아닌 다른 항목의 비율 {value}%를 읽었습니다. {item} 부분 {ticks}칸에 한 칸의 비율 10%를 곱하면 {answer}%입니다.'),wrong(v.p/10,'눈금 칸 수만 답하기','{item}의 눈금 칸 수만 {value:으로/로} 썼습니다. 칸 수 {ticks}에 10을 곱하여 백분율로 나타내면 {answer}%입니다.')],
 art:v=>({kind:'band',values:v.values,labels:v.labels,title:v.title,percentTicks:10,wide:true}),solution:'눈금 한 칸은 10%입니다. {item} 부분은 {ticks}칸이므로 {ticks} × 10 = {answer:입니다}.\n따라서 {item}의 비율은 {answer}%입니다.',
});
