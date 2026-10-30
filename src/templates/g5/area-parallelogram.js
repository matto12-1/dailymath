import {define,meta,casesSpec,errors,wrong,repeated} from './helpers.js?v=9a67f36b25';
import {areaArt} from './area-art.js?v=9a67f36b25';
const cases=[];for(let a=5;a<=20;a++)for(const [t,h,s]of [[3,4,5],[4,3,5],[6,8,10],[8,6,10],[5,12,13],[12,5,13]])if(a>t&&h/a>=.3&&h/a<=1)cases.push({a,t,h,s});
const answer=v=>v.a*v.h;
export default define(meta('area','parallelogram',3,'shape',['03-14'],'평행사변형의 넓이'),{
 input:'number',answerUnit:' cm²',texts:['그림의 평행사변형의 넓이는 몇 cm²일까요?','높이 표시를 보고 평행사변형의 넓이를 구하면 몇 cm²일까요?'],
 ...casesSpec(cases,answer,v=>repeated(v.a,v.h),v=>({...v,...errors(wrong(v.a*v.s,'높이 대신 기울어진 변 쓰기','높이 {h} cm 대신 기울어진 변 {s} cm를 곱했습니다. 기울어진 변 대신 수직인 높이로 {a} × {h:을/를} 계산하면 {answer} cm²입니다.'),wrong(v.a+v.h,'밑변과 높이 더하기','밑변 {a} cm와 높이 {h} cm를 더했습니다. 밑변과 높이를 더하는 대신 곱하면 {a} × {h} = {answer} cm²입니다.'))})),
 art:v=>({...areaArt([[0,v.h],[v.a,v.h],[v.a+v.t,0],[v.t,0]],[v.a+' cm',v.s+' cm',null,null],[{a:[v.t,0],b:[v.t,v.h],label:v.h+' cm',labelAt:[v.t+1,v.h/2],rightAt:'b'}],{parallel:[[0,2],[1,3]]}),expand:true}),
 solution:'밑변 {a} cm에 수직인 높이는 {h} cm입니다. {a} × {h} = {answer} cm²입니다.\n따라서 평행사변형의 넓이는 {answer} cm²입니다.',
});
