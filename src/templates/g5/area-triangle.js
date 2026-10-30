import {define,meta,casesSpec,errors,wrong,pairs} from './helpers.js?v=9a67f36b25';
import {areaArt} from './area-art.js?v=9a67f36b25';
const cases=pairs(3,20,2,14,(a,b)=>b/a>=.3&&b/a<=1&&a*b%2===0&&a*b/2!==a+b).map(({a,b:h})=>({a,h})),answer=v=>v.a*v.h/2;
export default define(meta('area','triangle',4,'shape',['03-14'],'삼각형의 넓이'),{
 input:'number',answerUnit:' cm²',texts:['그림의 삼각형의 넓이는 몇 cm²일까요?','밑변과 높이를 보고 삼각형의 넓이를 구하면 몇 cm²일까요?'],
 ...casesSpec(cases,answer,v=>Number(BigInt(v.a)*BigInt(v.h)/2n),v=>({...v,...errors(wrong(v.a*v.h,'2로 나누지 않기','밑변 {a:과/와} 높이 {h:을/를} 곱한 뒤 2로 나누지 않았습니다. 빠뜨린 나눗셈까지 하면 {a} × {h} ÷ 2 = {answer} cm²입니다.'),wrong(v.a+v.h,'밑변과 높이 더하기','밑변 {a:과/와} 높이 {h:을/를} 더했습니다. 덧셈 대신 곱셈을 한 뒤 2로 나누면 {a} × {h} ÷ 2 = {answer} cm²입니다.'))})),
 art:v=>areaArt([[0,v.h],[v.a,v.h],[v.a/3,0]],[v.a+' cm'],[{a:[v.a/3,0],b:[v.a/3,v.h],label:v.h+' cm',labelAt:[v.a/3+1,v.h/2],rightAt:'b'}]),
 solution:'삼각형의 넓이는 (밑변) × (높이) ÷ 2이므로 {a} × {h} ÷ 2 = {answer:입니다}.\n따라서 삼각형의 넓이는 {answer} cm²입니다.',
});
