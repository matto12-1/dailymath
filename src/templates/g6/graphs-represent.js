import {surveys} from './graph-helpers.js?v=9a67f36b25';
import {numeric,meta,cart,seq,wrong,tableArt,fill} from './helpers.js?v=9a67f36b25';
export default numeric(meta('graphs','represent',2,'life',['04-02'],'자료를 백분율로'),{
 answerUnit:'%',cases:cart({A:[20,25,40,50,80],a:seq(1,79)}).filter(v=>v.a<v.A-1&&100*v.a%v.A===0&&v.a*2!==v.A&&v.a!==100*v.a/v.A),
 texts:['표에서 전체 학생 수에 대한 {students} 수의 비율은 몇 %일까요?','표에서 전체 학생 수에 대한 {students} 수의 비율은 몇 %일까요?'],
 answer:v=>100*v.a/v.A,check:v=>v.a*(100/v.A),decorate:(v,rng)=>{const s=rng.pick(surveys),target=rng.int(0,2),rest=v.A-v.a,other=rng.int(1,rest-1),values=[other,rest-other];values.splice(target,0,v.a);return {...s,item:s.labels[target],students:fill(s.header==='등교 방법'?'{item:(이)}라고 답한 학생':'{item:을/를} 좋아하는 학생',{item:s.labels[target]}),rows:[[s.header,'학생 수(명)'],...s.labels.map((label,i)=>[label,values[i]]),['합계',v.A]]};},
 errors:v=>[wrong(v.a,'인원 그대로 쓰기','{students} 수 {a:을/를} 그대로 백분율로 {value:으로/로} 썼습니다. 인원 {a:을/를} 전체 {A:으로/로} 나눈 뒤 100을 곱하면 {answer}%입니다.'),wrong(100*(v.A-v.a)/v.A,'나머지 항목의 비율 구하기','{item} 이외의 항목에 답한 학생 수의 비율을 구하여 {value:을/를} 썼습니다. 나머지 대신 {students} 수 {a:을/를} 기준량 {A:으로/로} 나누어 백분율로 바꾸면 {answer}%입니다.')],
 art:v=>({...tableArt(v.rows),columnWidths:[145,150]}),solution:'{a} ÷ {A} × 100 = {answer:입니다}.\n따라서 전체 학생 수에 대한 {students} 수의 비율은 {answer}%입니다.',
});
