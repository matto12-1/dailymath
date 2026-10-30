import { explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {triangle,interior} from './geometry.js?v=9a67f36b25';
const names=['예각삼각형','직각삼각형','둔각삼각형'];
const classify=angles=>Math.abs(Math.max(...angles)-90)<1e-7?names[1]:Math.max(...angles)>90?names[2]:names[0];
export default define(meta('triangles','acute',3,'shape',['03-09'],'각의 크기로 삼각형 분류'),{
  answerKind:'text',choiceOrder:names,texts:['각의 크기로 보면 이 삼각형의 이름은 무엇일까요?','이 삼각형의 이름은 무엇일까요?'],
  draw: explain(function(rng) {const k=rng.int(0,2),a=k===0?rng.int(45,70):rng.int(20,40),c=k===0?rng.int(55,75):k===1?90:rng.int(100,130),b=180-a-c;if(b<10)return null;const angles=[a,b,c],points=triangle(a,b),answer=classify(angles),options=names,others=names.filter(n=>n!==answer);return {angles,points,options,rotation:rng.int(0,35)*10,...errors(...others.map(n=>wrong(n,k===2&&n===names[0]?'두 작은 각만 보기':'가장 큰 각 잘못 읽기',`${n}을 골랐지만 가장 큰 각은 ${Math.max(...angles)}°입니다. ${n==="직각삼각형"?"직각삼각형에는 90°인 각이 있지만":n==="둔각삼각형"?"둔각삼각형에는 90°보다 큰 각이 있지만":"예각삼각형은 세 각이 모두 90°보다 작지만"}, 이 삼각형은 가장 큰 각이 ${Math.max(...angles)}°이므로 ${answer}입니다.`)))};}, v => ['세 각의 크기는 ' + v.angles.map(a=>a+'°').join(', ') + '입니다.', '가장 큰 각은 ' + Math.max(...v.angles) + '°입니다. ' + (Math.max(...v.angles)<90?'세 각이 모두 90°보다 작습니다.':Math.max(...v.angles)===90?'한 각이 90°인 직각입니다.':'한 각이 90°보다 큰 둔각입니다.')]),
  answer:v=>classify(v.angles),check:v=>classify(interior(v.points)),isCorrect:(v,c)=>c===classify(interior(v.points)),
  art:v=>({kind:'polygon',expand:true,points:v.points,labels:{angles:v.angles.map(a=>`${a}°`)},rotation:v.rotation,wide:true}),solution: "{process}\n따라서 이 삼각형은 {answer:입니다}.",
});
