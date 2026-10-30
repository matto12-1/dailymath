import {define,meta,casesSpec,errors,wrong,pairs} from './helpers.js?v=9a67f36b25';
import {areaArt} from './area-art.js?v=9a67f36b25';
const cases=pairs(4,18,4,18,(a,b)=>a!==b&&b/a>=.3&&b/a<=1&&a*b%2===0&&a*b/2!==a+b),answer=v=>v.a*v.b/2;
export default define(meta('area','rhombus',5,'shape',['03-14'],'마름모의 넓이'),{
 input:'number',answerUnit:' cm²',texts:['그림의 마름모의 넓이는 몇 cm²일까요?','그림의 마름모 넓이는 몇 cm²일까요?'],
 ...casesSpec(cases,answer,v=>Number(BigInt(v.a)*BigInt(v.b)/2n),v=>({...v,...errors(wrong(v.a*v.b,'2로 나누지 않기','두 대각선 {a:과/와} {b:을/를} 곱한 뒤 2로 나누지 않았습니다. 빠뜨린 나눗셈까지 하면 {a} × {b} ÷ 2 = {answer} cm²입니다.'),wrong(v.a+v.b,'두 대각선 더하기','대각선 {a} cm와 {b} cm를 더했습니다. 두 대각선의 길이를 더하는 대신 곱한 뒤 2로 나누면 {a} × {b} ÷ 2 = {answer} cm²입니다.'))})),
 art:v=>areaArt([[0,v.b/2],[v.a/2,0],[v.a,v.b/2],[v.a/2,v.b]],[],[{a:[0,v.b/2],b:[v.a,v.b/2],label:v.a+' cm',labelAt:[v.a*.32,v.b/2-.3],labelExact:true},{a:[v.a/2,0],b:[v.a/2,v.b],label:v.b+' cm',labelAt:[v.a/2+.3,v.b*.3],labelExact:true}],{equal:[[0,1,2,3]]}),
 solution:'마름모의 넓이는 두 대각선의 곱의 반입니다. {a} × {b} ÷ 2 = {answer} cm²입니다.\n따라서 마름모의 넓이는 {answer} cm²입니다.',
});
