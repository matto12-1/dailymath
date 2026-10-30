import {numeric,meta,cart,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('volume','volume',2,'shape',['03-19'],'직육면체의 부피'),{
 answerUnit:'cm³',back:'g5s1-perimeter-area',cases:cart({a:seq(2,12),b:seq(2,10),c:seq(2,8)}).filter(v=>v.a*v.b*v.c!==2*(v.a*v.b+v.a*v.c+v.b*v.c)),
 texts:['그림의 직육면체의 부피는 몇 cm³일까요?','이 직육면체의 부피를 구하면 몇 cm³일까요?'],
 answer:v=>v.a*v.b*v.c,check:v=>Array(v.c).fill(v.a*v.b).reduce((s,n)=>s+n,0),decorate:v=>({base:v.a*v.b}),
 errors:v=>[wrong(v.a*v.b,'높이 곱하기 빠뜨리기','가로 {a} cm와 세로 {b} cm만 곱했습니다. 밑넓이 {base}에 높이 {c:을/를} 곱하면 {answer} cm³입니다.'),wrong(2*(v.a*v.b+v.a*v.c+v.b*v.c),'겉넓이 식으로 계산하기','여섯 면의 넓이를 더했습니다. 넓이를 더하는 대신 {a} × {b} × {c:을/를} 계산하면 부피는 {answer} cm³입니다.')],
 art:v=>({kind:'solid',type:'cuboid',edgeLengths:[v.a,v.b,v.c],wide:true}),solution:'{a} × {b} × {c} = {base} × {c} = {answer} cm³입니다.\n따라서 직육면체의 부피는 {answer} cm³입니다.',
});
