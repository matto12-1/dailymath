import {numeric,meta,wrong} from './helpers.js?v=9a67f36b25';
import {shares,graphDecorate} from './graph-helpers.js?v=9a67f36b25';
export default numeric(meta('graphs','pie',2,'life',['04-02'],'원그래프의 비율 읽기'),{
 answerUnit:'%',cases:shares(5).filter(v=>v.p>=15&&100-v.p-v.q>=10),texts:['원그래프에서 {item}의 비율은 몇 %일까요?','{item} 부분은 전체의 몇 %일까요?'],
 answer:v=>v.p,check:v=>v.p/5*5,decorate:graphDecorate,
 errors:v=>[wrong(v.p/5,'눈금 칸 수를 백분율로 쓰기','{item}의 눈금 칸 수만 {value:으로/로} 썼습니다. 전체 20칸이 100%이므로 {item}의 {ticks}칸에 5를 곱하면 {answer}%입니다.'),wrong(v.q,'다른 항목 읽기','{item:이/가} 아닌 다른 항목의 비율 {value}%를 읽었습니다. 다른 항목 대신 {item}의 {ticks}칸을 읽으면 {ticks} × 5 = {answer}%입니다.')],
 art:v=>({kind:'pie',values:v.values,labels:v.labels,title:v.title,percentTicks:5,wide:true}),solution:'전체 20칸은 100%이므로 한 칸은 5%입니다. {item} 부분은 {ticks}칸이므로 {ticks} × 5 = {answer:입니다}.\n따라서 {item}의 비율은 {answer}%입니다.',
});
