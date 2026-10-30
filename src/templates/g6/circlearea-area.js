import {numeric,meta,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('circlearea','area',3,'shape',['03-16'],'원의 넓이'),{
 answerKind:'decimal',answerUnit:'cm²',cases:seq(1,25).filter(r=>r!==2).map(r=>({r})),
 texts:['원주율은 3.14입니다. 그림에서 원의 넓이는 몇 cm²일까요?','원주율이 3.14일 때 그림에서 원의 넓이는 몇 cm²일까요?'],
 answer:v=>dec(v.r*v.r*314,2),check:v=>dec(Array(v.r).fill(v.r*314).reduce((a,b)=>a+b,0),2),decorate:v=>({square:v.r*v.r}),
 errors:v=>[wrong(dec(v.r*628,2),'원주 식 쓰기','원의 넓이 대신 {r} × 2 × 3.14로 원주를 구하여 {value:을/를} 썼습니다. 원주 대신 반지름을 두 번 곱한 뒤 원주율을 곱하면 {r} × {r} × 3.14 = {answer} cm²입니다.'),wrong(String(v.r*v.r),'원주율 곱하기 빠뜨리기','{r} × {r}만 구하여 {value:을/를} 썼습니다. 빠뜨린 원주율 3.14도 곱하면 {square} × 3.14 = {answer} cm²입니다.')],
 art:v=>({kind:'circle',r:1,show:['center','radius'],radiusLabel:v.r+' cm',wide:true}),solution:'반지름 × 반지름 × 원주율 = {r} × {r} × 3.14 = {square} × 3.14 = {answer} cm²입니다.\n따라서 원의 넓이는 {answer} cm²입니다.',
});
