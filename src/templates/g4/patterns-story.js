import {define,meta,seq,casesSpec,errors,wrong,numberWords} from './helpers.js?v=9a67f36b25';
const cases=seq(1,9).flatMap(a=>seq(2,9).flatMap(d=>seq(4,8).map(k=>({a,d,k}))));
export default define(meta('patterns','story',3,'word',['02-01'],'날마다 늘어나는 화분'),{
  input:'number',answerUnit:'개',referenceArt:'table',
  texts:["표의 규칙대로 화분 수가 늘어납니다. {day} 날의 화분은 몇 개일까요?","표의 규칙대로 화분 수가 늘어납니다. {day} 날의 화분은 몇 개일까요?"],
  ...casesSpec(cases,({a,d,k})=>a+d*(k-1),({a,d,k})=>Array(k-1).fill(d).reduce((s,n)=>s+n,a),v=>({...v,day:numberWords[v.k-1],increase:v.d*(v.k-1),times:v.k-1,...errors(wrong(v.a+v.d*v.k,'첫날에도 늘어난 것으로 세기',`첫날에도 늘었다고 보아 ${v.k}번 늘어난 ${v.a+v.d*v.k}개를 썼습니다. 첫날부터 {day} 날까지는 {times}번 늘어나므로 ${v.a}에 ${v.d*(v.k-1)}을 더한 {answer}개입니다.`),wrong(v.d*(v.k-1),'첫날 개수 빠뜨리기',`늘어난 ${v.d*(v.k-1)}개만 쓰고 첫날의 {a}개를 빠뜨렸습니다. 첫날의 {a}개에 늘어난 ${v.d*(v.k-1)}개도 더하면 {answer}개입니다.`))})),
  art:v=>({kind:'table',labels:['첫날','둘째 날','셋째 날'],values:[v.a,v.a+v.d,v.a+2*v.d],rows:[['날','첫날','둘째 날','셋째 날'],['화분 수 (개)',v.a,v.a+v.d,v.a+2*v.d]],fontSize:16,wide:true}),solution: "화분은 하루에 {d}개씩 늘어납니다.\n첫날부터 {day} 날까지 {times}번 늘어나므로 {d} × {times} = {increase}개가 늘어납니다.\n{a} + {increase} = {answer}입니다.\n따라서 {day} 날의 화분은 {answer}개입니다.",
});
