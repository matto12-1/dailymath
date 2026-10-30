import {numeric,meta,cart,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('volume','story',3,'word',['03-19'],'상자의 부피'),{
 answerUnit:'cm³',cases:cart({a:seq(5,20),b:seq(4,15),c:seq(3,12)}).filter(v=>v.a*v.b*v.c!==2*(v.a*v.b+v.a*v.c+v.b*v.c)),
 texts:['직육면체 모양 상자의 가로는 {a} cm, 세로는 {b} cm, 높이는 {c} cm입니다. 이 상자의 부피는 몇 cm³일까요?','가로 {a} cm, 세로 {b} cm, 높이 {c} cm인 직육면체 모양 상자의 부피는 몇 cm³일까요?'],
 answer:v=>v.a*v.b*v.c,check:v=>Array(v.c).fill(v.a*v.b).reduce((s,n)=>s+n,0),decorate:v=>({base:v.a*v.b}),
 errors:v=>[wrong(2*(v.a*v.b+v.a*v.c+v.b*v.c),'겉넓이 구하기','상자의 여섯 면 넓이를 더했습니다. 겉넓이 대신 가로 {a}, 세로 {b}, 높이 {c:을/를} 곱하면 부피는 {answer} cm³입니다.'),wrong(v.a*v.b,'높이 빠뜨리기','가로 {a:과/와} 세로 {b}만 곱했습니다. 밑넓이 {base}에 빠뜨린 높이 {c:을/를} 곱하면 {answer} cm³입니다.')],
 art:()=>({scene:'shipping-box'}),solution:'직육면체의 부피는 가로 × 세로 × 높이이므로 {a} × {b} × {c} = {answer:입니다}.\n따라서 상자의 부피는 {answer} cm³입니다.',
});
