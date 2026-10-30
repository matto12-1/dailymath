import {numeric,meta,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('roundsolid','radius',2,'shape',['03-07'],'구의 반지름'),{
 answerUnit:'cm',cases:seq(3,12).map(r=>({r,d:2*r})),
 texts:['그림의 구에서 반지름은 몇 cm일까요?','구의 중심을 지나는 지름의 길이를 보고 구의 반지름을 구하면 몇 cm일까요?'],
 answer:v=>v.r,check:v=>v.d/2,decorate:(v,rng)=>({orientation:0}),
 errors:v=>[wrong(v.d,'지름 그대로 쓰기','구의 지름 {d} cm를 그대로 썼습니다. 구의 지름 {d:을/를} 반으로 나누면 반지름은 {answer} cm입니다.'),wrong(v.d*2,'나누기 대신 두 배 하기','지름 {d} cm를 2로 나누지 않고 2배 했습니다. 지름 {d:을/를} 두 배 하는 대신 2로 나누면 반지름은 {answer} cm입니다.')],
 art:v=>({kind:'solid',type:'sphere',diameter:v.d,orientation:v.orientation,wide:true}),solution:'구의 반지름은 지름의 절반입니다. {d} ÷ 2 = {answer} cm입니다.\n따라서 구의 반지름은 {answer} cm입니다.',
});
