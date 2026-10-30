import {define,meta,casesSpec,errors,wrong,pairs,repeated} from './helpers.js?v=9a67f36b25';
const cases=pairs(2,12,2,12,(a,b)=>a!==b&&a*b!==2*(a+b)),answer=v=>v.a*v.b;
export default define(meta('area','rectangle',2,'shape',['03-13'],'직사각형의 넓이'),{
 input:'number',answerUnit:' cm²',texts:['한 칸은 1 cm²입니다. 색칠한 직사각형의 넓이는 몇 cm²일까요?','한 칸의 넓이가 1 cm²일 때 직사각형의 넓이는 몇 cm²일까요?'],
 ...casesSpec(cases,answer,v=>repeated(v.a,v.b),v=>({...v,...errors(wrong(2*(v.a+v.b),'둘레와 넓이 혼동','{a} + {b:을/를} 두 번 더해 둘레를 구했습니다. 넓이는 둘레 대신 한 줄의 칸 수와 줄 수를 곱하므로 {a} × {b} = {answer} cm²입니다.'),wrong(v.a,'한 줄의 칸만 세기','한 줄의 {a}칸만 세었습니다. 빠뜨린 나머지 줄까지 세면 {a}칸씩 {b}줄이므로 {a} × {b} = {answer} cm²입니다.'))})),
 art:v=>({kind:'grid',w:v.a+2,h:v.b+2,cells:Array.from({length:v.a*v.b},(_,i)=>[1+i%v.a,1+Math.floor(i/v.a)]),wide:true}),
 solution:'한 줄에 {a}칸씩 {b}줄입니다. {a} × {b} = {answer} cm²입니다.\n따라서 직사각형의 넓이는 {answer} cm²입니다.',
});
