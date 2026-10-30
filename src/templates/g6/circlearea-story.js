import {numeric,meta,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('circlearea','story',3,'word',['03-16'],'둥근 텃밭 넓이'),{
 answerKind:'decimal',answerUnit:'m²',cases:seq(2,25).map(r=>({r,d:2*r})),
 texts:['둥근 텃밭의 지름은 {d} m입니다. 원주율이 3.14일 때 넓이는 몇 m²일까요?','원주율은 3.14입니다. 지름 {d} m인 원 모양 텃밭의 넓이는 몇 m²일까요?'],
 answer:v=>dec(v.r*v.r*314,2),check:v=>dec(v.d*v.d*314/4,2),decorate:v=>({square:v.r*v.r}),
 errors:v=>[wrong(dec(v.d*v.d*314,2),'지름을 반지름으로 쓰기','지름 {d} m를 반지름처럼 두 번 곱하여 {value:을/를} 썼습니다. 지름을 2로 나눈 반지름 {r:을/를} 두 번 곱하고 3.14를 곱하면 {answer} m²입니다.'),wrong(dec(v.r*314,2),'반지름 한 번만 곱하기','반지름 {r} m에 3.14만 곱하여 {value:을/를} 썼습니다. 빠뜨린 반지름 {r:을/를} 한 번 더 곱하면 {r} × {r} × 3.14 = {answer} m²입니다.')],
 art:()=>({scene:'garden-round'}),solution:'반지름은 {d} ÷ 2 = {r} m입니다. {r} × {r} × 3.14 = {square} × 3.14 = {answer:입니다}.\n따라서 텃밭의 넓이는 {answer} m²입니다.',
});
