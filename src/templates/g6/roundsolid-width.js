import {numeric,meta,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('roundsolid','width',2,'shape',['03-08'],'원기둥 옆면의 가로'),{
 answerKind:'decimal',answerUnit:'cm',cases:seq(2,12).map(d=>({d})),
 texts:['원주율은 3.14입니다. 원기둥의 전개도에서 옆면의 가로는 몇 cm일까요?','원주율이 3.14일 때 원기둥의 옆면을 펼친 직사각형의 가로는 몇 cm일까요?'],
 answer:v=>dec(v.d*314,2),check:v=>dec(v.d*300+v.d*14,2),decorate:(v,rng)=>({height:rng.int(3,9)}),
 errors:v=>[wrong(String(v.d),'밑면 지름 그대로 쓰기','밑면의 지름 {d} cm를 그대로 썼습니다. 옆면의 가로는 밑면의 원주이므로 {d} × 3.14 = {answer} cm입니다.'),wrong(dec(v.d*157,2),'반지름에 원주율 곱하기','지름 {d} cm의 절반에 3.14를 곱했습니다. 반지름 대신 지름 {d}에 3.14를 곱하면 옆면의 가로는 {answer} cm입니다.')],
 art:v=>({kind:'net',type:'cylinder',diameter:v.d,height:v.height,rectWidth:v.d*3.14,hideWidth:true,wide:true}),solution:'옆면의 가로는 밑면의 원주와 같습니다. 밑면의 원주는 지름 × 원주율이므로 {d} × 3.14 = {answer} cm입니다.\n따라서 펼친 옆면의 가로는 {answer} cm입니다.',
});
