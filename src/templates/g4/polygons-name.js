import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {regular} from './geometry.js?v=9a67f36b25';
const names={3:'삼각형',4:'사각형',5:'오각형',6:'육각형',7:'칠각형',8:'팔각형'};
export default define(meta('polygons','name',1,'shape',['03-11'],'변의 수로 다각형 이름 찾기'),{
  answerKind:'text',texts:['변의 수로 이름을 붙이면 어떤 다각형일까요?'],
  choiceOrder:Object.values(names),
  draw(rng){const n=rng.int(3,8),points=regular(n,rng.int(0,359)).map(([x,y],i)=>{const factor=i===0?(n===8?.92:n===7?.88:.8):1;return [5+(x-5)*factor,5+(y-5)*factor];}),other=n===3?[4,5]:n===8?[7,6]:[n-1,n+1],fills=[3,4,5,6,7,8].filter(k=>k!==n&&!other.includes(k)&&Math.abs(k-n)<=3),fill=rng.pick(fills),options=[names[n],...other.map(k=>names[k]),names[fill]];return {n,points,options,...errors(...other.map(k=>wrong(names[k],'변의 수 잘못 세기',`변을 ${k}개로 세어 ${names[k]}을 골랐습니다. ${names[k]}과 달리 변이 ${n}개인 다각형이므로 ${names[n]}입니다.`)))};},
  answer:v=>names[v.n],check:v=>names[v.points.length],isCorrect:(v,c)=>c===names[v.points.length],art:v=>({kind:'polygon',points:v.points,wide:true}),
  solution:"변의 수를 세면 {n}개입니다.\n따라서 이 다각형의 이름은 {answer:입니다}.",
});
