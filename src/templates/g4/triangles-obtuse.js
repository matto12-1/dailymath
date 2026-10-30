import { explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong,cycle} from './helpers.js?v=9a67f36b25';
import {triangle,interior} from './geometry.js?v=9a67f36b25';
export default define(meta('triangles','obtuse',3,'shape',['03-09'],'가장 큰 각과 작은 각'),{
  answerSpan:[1,2,3],orderAsked:true,answerUnit:'번',
  texts:['삼각형에서 가장 {direction} 각은 몇 번일까요?','그림의 각 중 가장 {direction} 것은 몇 번일까요?'],
  draw: explain(function(rng) {const a=rng.int(20,65),b=rng.int(20,65),angles=[a,b,180-a-b];if(angles.some((n,i)=>angles.some((m,j)=>i!==j&&Math.abs(n-m)<=20)))return null;
    const large=rng.int(0,1)===1,points=triangle(a,b),target=angles.indexOf((large?Math.max:Math.min)(...angles)),others=[0,1,2].filter(i=>i!==target);
    // 정답 각의 번호를 세 자리에 고르게 둔다.
    const rightNumber=cycle(rng,'b5-angle-number',[1,2,3]),numbers=rng.shuffle([1,2,3].filter(n=>n!==rightNumber));numbers.splice(target,0,rightNumber);
    return {angles,numbers,points,large,target,options:[1,2,3],direction:large?'큰':'작은',rotation:rng.int(0,3)*90,...errors(...others.map(i=>wrong(numbers[i],`${numbers[i]}번 각 고르기`,`${numbers[i]}번 각을 골랐습니다. ${numbers[i]}번보다 ${numbers[target]}번에서 두 변이 더 ${large?"넓게":"좁게"} 벌어져 있으므로 가장 ${large?"큰":"작은"} 각은 ${numbers[target]}번입니다.`)))};}, v => ['각을 이루는 두 변이 벌어진 정도를 비교합니다.', '두 변이 좁게 벌어진 순서대로 '+[...v.angles.keys()].sort((a,b)=>v.angles[a]-v.angles[b]).map(i=>v.numbers[i]+'번').join(', ')+'입니다.']),
  answer:v=>v.numbers[v.target],check:v=>{const as=interior(v.points);return v.numbers[as.indexOf((v.large?Math.max:Math.min)(...as))];},
  isCorrect:(v,c)=>{const i=v.numbers.indexOf(c);return i>=0&&v.angles.every(a=>v.large?v.angles[i]>=a:v.angles[i]<=a);},
  art:v=>({kind:'polygon',points:v.points,labels:{angleNumbers:v.numbers},rotation:v.rotation,wide:true}),
  solution: "{process}\n따라서 가장 {direction} 각은 {answer}번입니다.",
});
