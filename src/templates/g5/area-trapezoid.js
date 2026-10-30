import {define,meta,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
import {areaArt} from './area-art.js?v=9a67f36b25';
const cases=[];for(let a=2;a<=10;a++)for(let b=a+2;b<=18;b+=2)for(let h=2;h<=10;h+=2)if(h/b>=.3&&h/b<=1)cases.push({a,b,h});
const answer=v=>(v.a+v.b)*v.h/2;
export default define(meta('area','trapezoid',5,'shape',['03-14'],'사다리꼴의 넓이'),{
 input:'number',answerUnit:' cm²',texts:['그림의 사다리꼴의 넓이는 몇 cm²일까요?','높이 표시를 보고 사다리꼴의 넓이를 구하면 몇 cm²일까요?'],
 ...casesSpec(cases,answer,v=>v.a*v.h/2+v.b*v.h/2,v=>({...v,...errors(wrong((v.a+v.b)*v.h,'2로 나누지 않기','윗변 {a} cm와 아랫변 {b} cm를 더하고 높이 {h} cm를 곱한 뒤 2로 나누지 않았습니다. 빠뜨린 나눗셈까지 하면 ({a} + {b}) × {h} ÷ 2 = {answer} cm²입니다.'),wrong(v.b*v.h/2,'평행한 변 하나 빠뜨리기','아랫변 {b} cm만 써서 삼각형의 넓이처럼 구했습니다. 빠뜨린 윗변도 더하여 ({a} + {b}) × {h} ÷ 2를 계산하면 {answer} cm²입니다.'))})),
 art:v=>areaArt([[0,v.h],[v.b,v.h],[(v.b+v.a)/2,0],[(v.b-v.a)/2,0]],[v.b+' cm',null,v.a+' cm'],[{a:[(v.b-v.a)/2+v.a*.25,0],b:[(v.b-v.a)/2+v.a*.25,v.h],label:v.h+' cm',labelAt:[(v.b-v.a)/2+v.a*.25+1,v.h/2],rightAt:'b'}],{parallel:[[0,2]]}),
 solution:'사다리꼴의 넓이는 (윗변 + 아랫변) × (높이) ÷ 2입니다. 윗변 {a} cm, 아랫변 {b} cm, 높이 {h} cm이므로 ({a} + {b}) × {h} ÷ 2 = {answer:입니다}.\n따라서 사다리꼴의 넓이는 {answer} cm²입니다.',
});
