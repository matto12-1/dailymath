import {numeric,meta,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('circlearea','perimeter',2,'shape',['03-16'],'지름으로 원주 구하기'),{
 answerKind:'decimal',answerUnit:'cm',cases:seq(2,30).map(d=>({d})),
 texts:['원주율은 3.14입니다. 그림의 원주는 몇 cm일까요?','원주율이 3.14일 때 그림의 원주는 몇 cm일까요?'],
 answer:v=>dec(v.d*314,2),check:v=>dec(v.d*300+v.d*14,2),
 errors:v=>[wrong(dec(v.d*157,2),'지름 대신 반지름 곱하기','지름 {d} cm의 절반에 원주율 3.14를 곱하여 {value:을/를} 썼습니다. 반지름 대신 지름 {d}에 3.14를 곱하면 {answer} cm입니다.'),wrong(dec(v.d*628,2),'지름을 반지름으로 쓰기','지름 {d} cm를 반지름으로 보고 {d} × 2 × 3.14를 계산하여 {value:을/를} 썼습니다. 이미 지름인 {d:을/를} 두 배 하지 않고 3.14만 곱하면 {answer} cm입니다.')],
 art:v=>({kind:'circle',r:1,show:['center','diameter'],diameterLabel:v.d+' cm',wide:true}),solution:'원주는 지름 × 원주율입니다. {d} × 3.14 = {answer} cm입니다.\n따라서 원주는 {answer} cm입니다.',
});
