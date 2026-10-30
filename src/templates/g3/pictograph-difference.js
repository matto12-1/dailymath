import { define, seq, unique, wrong, errors } from './helpers.js?v=9a67f36b25';

const cases=seq(2,6).flatMap(a=>seq(1,a-1).flatMap(c=>seq(1,9).flatMap(b=>seq(1,9).map(d=>({a,b,c,d,diff:10*(a-c)+b-d}))))).filter(v=>v.a+v.b>v.c+v.d);
const span=unique(cases.map(v=>v.diff)).sort((a,b)=>a-b);
export default define({id:'g3.pictograph.difference',unit:'g3s2-picture-graphs',strand:'life',level:3,label:'그림그래프의 차',std:['[4수04-01]']},{
  input:'number',answerUnit:'개',range:{min:1,max:99},answerSpan:span,errorCount:2,back:'g2s2-tables-graphs',
  texts:['그림그래프에서 {more:은/는} {less}보다 몇 개 많을까요?'],
  draw(rng){const diff=rng.pick(span),v=rng.pick(cases.filter(x=>x.diff===diff)),[more,less]=rng.shuffle(['사과','배','귤','감']).slice(0,2),counts=[10*v.a+v.b,10*v.c+v.d],labels=rng.shuffle([more,less,...rng.shuffle(['사과','배','귤','감'].filter(s=>s!==more&&s!==less)).slice(0,1)]),values=labels.map(s=>s===more?counts[0]:s===less?counts[1]:rng.int(2,6)*10+rng.int(1,8));return {...v,more,less,counts,symbolDifference:v.a+v.b-v.c-v.d,total:counts[0],
    ...errors(wrong(v.a+v.b-v.c-v.d,'그림 수의 차만 구하기','그림 수의 차 {symbolDifference}만 썼습니다. {more:은/는} {total}개, {less:은/는} {other}개이므로 차는 {total} − {other} = {answer}개입니다.'),wrong(counts[0],'많은 쪽의 전체 수 답하기','차 대신 {more}의 전체 수 {total}개를 썼습니다. {less}의 {other}개를 빼면 {total} − {other} = {answer}개입니다.')),other:counts[1],labels,values};},
  answer:({diff})=>diff,check:({counts})=>counts[0]-counts[1],
  art:({labels,values})=>({kind:'pictograph',title:'과일별 수확한 개수',labels,values,unit:10,smallUnit:1,unitLabel:'개'}),
  solution:"{more:은/는} 큰 그림 {a}개와 작은 그림 {b}개이므로 {total}개이고, {less:은/는} 큰 그림 {c}개와 작은 그림 {d}개이므로 {other}개입니다. {total} − {other} = {answer}입니다.\n따라서 {more:은/는} {less}보다 {answer}개 많습니다.",
});
