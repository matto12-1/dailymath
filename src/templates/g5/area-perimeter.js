import {define,meta,casesSpec,errors,wrong,pairs} from './helpers.js?v=9a67f36b25';
import {areaArt} from './area-art.js?v=9a67f36b25';
const cases=pairs(1,20,1,16,(a,b)=>2*(a+b)!==a*b&&a+b!==a*b&&Math.max(a,b)/Math.min(a,b)<=4),answer=v=>2*(v.a+v.b);
export default define(meta('area','perimeter',1,'shape',['03-11'],'직사각형의 둘레'),{
 input:'number',answerUnit:'cm',back:'g3s1-addsub',texts:['그림에 있는 도형의 둘레는 몇 cm일까요?','그림에 있는 도형의 둘레는 몇 cm일까요?'],
 ...casesSpec(cases,answer,v=>v.a+v.b+v.a+v.b,v=>({...v,...errors(wrong(v.a+v.b,'두 변만 더하기','가로 {a} cm와 세로 {b} cm를 한 번씩만 더했습니다. 마주 보는 두 변도 있으므로 ({a} + {b}) × 2 = {answer} cm입니다.'),wrong(v.a*v.b,'넓이와 둘레 혼동','둘레를 구하는데 {a} × {b:으로/로} 넓이를 구했습니다. 넓이 대신 네 변을 모두 더하면 {a} + {b} + {a} + {b} = {answer} cm입니다.'))})),
 art:v=>areaArt([[0,0],[v.a,0],[v.a,v.b],[0,v.b]],[v.a+' cm',v.b+' cm'],[],{right:[0,1,2,3]}),
 solution:'네 변의 길이를 모두 더하면 {a} + {b} + {a} + {b} = {answer:입니다}.\n따라서 도형의 둘레는 {answer} cm입니다.',
});
