import {numeric,meta,cart,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('volume','surface',1,'shape',['03-17'],'직육면체의 겉넓이'),{
 answerUnit:'cm²',back:'g5s1-perimeter-area',cases:cart({a:seq(2,10),b:seq(2,10),c:seq(2,10)}).filter(v=>2*(v.a*v.b+v.a*v.c+v.b*v.c)!==v.a*v.b*v.c),
 texts:['그림의 직육면체 겉넓이는 몇 cm²일까요?','이 직육면체의 겉넓이는 몇 cm²일까요?'],
 answer:v=>2*(v.a*v.b+v.a*v.c+v.b*v.c),check:v=>v.a*v.b+v.a*v.b+v.a*v.c+v.a*v.c+v.b*v.c+v.b*v.c,
 decorate:v=>({ab:v.a*v.b,ac:v.a*v.c,bc:v.b*v.c}),
 errors:v=>[wrong(v.a*v.b+v.a*v.c+v.b*v.c,'세 면만 더하기','{ab} + {ac} + {bc}만 더했습니다. 마주 보는 면의 넓이가 같으므로 ({ab} + {ac} + {bc}) × 2 = {answer} cm²입니다.'),wrong(v.a*v.b*v.c,'부피 식으로 계산하기','겉넓이 대신 부피 {a} × {b} × {c:을/를} 계산했습니다. 부피 대신 여섯 면의 넓이를 더하면 {answer} cm²입니다.')],
 art:v=>({kind:'solid',type:'cuboid',edgeLengths:[v.a,v.b,v.c],wide:true}),solution:'({a} × {b} + {a} × {c} + {b} × {c}) × 2 = ({ab} + {ac} + {bc}) × 2 = {answer} cm²입니다.\n따라서 직육면체의 겉넓이는 {answer} cm²입니다.',
});
