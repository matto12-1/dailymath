import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {triangle,sideLengths} from './geometry.js?v=9a67f36b25';
const NAMES=['정삼각형','이등변삼각형','세 변의 길이가 모두 다른 삼각형'];
const nameOf=ps=>{const ls=sideLengths(ps),same=(a,b)=>Math.abs(a-b)<1e-7;return same(Math.max(...ls),Math.min(...ls))?NAMES[0]:ls.some((l,i)=>ls.some((m,j)=>i!==j&&same(l,m)))?NAMES[1]:NAMES[2];};
const reason=['세 변의 길이가 모두 같습니다.','두 변의 길이만 같습니다.','세 변의 길이가 모두 다릅니다.'];
const tenth=n=>Math.round(n*10)/10,sin=d=>Math.sin(d*Math.PI/180);
export default define(meta('triangles','isosceles',1,'shape',['03-08'],'변의 길이로 삼각형 분류'),{
  answerKind:'text',errorCount:2,
  texts:['그림의 삼각형을 변의 길이로 분류하면 가장 알맞은 이름은 무엇일까요?'],
  draw(rng){
    const type=rng.int(0,2),length=rng.int(3,9);let points,sides;
    if(type===0){points=triangle(60,60);sides=[length,length,length];}
    else if(type===1){const a=rng.pick([40,50,65,70]);points=triangle(a,a);sides=[tenth(length*2*Math.cos(a*Math.PI/180)),length,length];}
    else{const [a,b]=rng.pick([[40,75],[50,70],[35,65],[45,80]]),c=180-a-b,base=rng.int(5,9);points=triangle(a,b);sides=[base,tenth(base*sin(a)/sin(c)),tenth(base*sin(b)/sin(c))];if(sides.some((x,i)=>sides.some((y,j)=>i!==j&&Math.abs(x-y)<.3)))return null;}
    return {points,sides,rotation:rng.pick([0,180]),answer:NAMES[type],options:NAMES,reason:reason[type],...errors(...NAMES.filter(n=>n!==NAMES[type]).map(n=>wrong(n,n+' 고르기',`${n}을 골랐습니다. ${type===0?(n===NAMES[1]?'같은 두 변 외에 나머지 한 변의 길이도 같으므로':'세 변의 길이를 견주면 모두 같으므로'):type===1?(n===NAMES[0]?'세 변이 모두 같지 않고 두 변의 길이만 같으므로':'길이가 같은 두 변이 있으므로'):(n===NAMES[0]?'세 변의 길이가 모두 같지 않고 둘씩 견주어도 길이가 다르므로':'둘씩 견주어도 길이가 같은 변이 없으므로')} 가장 알맞은 이름은 ${NAMES[type]}입니다.`)))};
  },
  answer:v=>v.answer,check:v=>nameOf(v.points),isCorrect:(v,c)=>c===nameOf(v.points),
  art:v=>({kind:'polygon',points:v.points,labels:{sides:v.sides.map(n=>n+' cm')},rotation:v.rotation,wide:true}),
  solution:'{reason}\n따라서 가장 알맞은 이름은 {answer:입니다}.',
});
