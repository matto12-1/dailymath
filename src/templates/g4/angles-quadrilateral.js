import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
import {normalize,interior} from './geometry.js?v=9a67f36b25';
const cases=seq(50,120,5).flatMap(a=>seq(50,120,5).filter(b=>a!==b&&a+b!==180&&a!==90&&b!==90).map(b=>({a,b})));
export default define(meta('angles','quadrilateral',3,'shape',['03-25'],'사각형의 빈 각'),{
  input:'number',answerUnit:'°',answerSpan:seq(50,130,5).filter(n=>n!==90),errorCount:2,
  texts:["사각형에서 물음표로 표시한 각은 몇 도일까요?","사각형에서 물음표로 표시한 각은 몇 도일까요?"],
  draw(rng){const {a,b}=rng.pick(cases),height=3.8,points=normalize([[0,0],[8,0],[8-height/Math.tan(b*Math.PI/180),-height],[height/Math.tan(a*Math.PI/180),-height]]),angles=[a,b,180-b,180-a],target=rng.int(0,3),given=angles.filter((_,i)=>i!==target);
    return {points,angles,target,given,missing:angles[target],rotation:rng.pick([0,180]),...errors(wrong(angles[(target+2)%4],'마주 보는 각과 같다고 보기','물음표로 표시한 각을 마주 보는 각과 같은 {opposite}°로 보았습니다. 네 각의 합 360°에서 세 각을 빼면 360 − {first} − {second} − {third} = {answer}이므로 {answer}°입니다.'),wrong(360-given[0]-given[1],'주어진 각 중 두 개만 빼기',`세 각 중 두 개만 빼서 ${360-given[0]-given[1]}°라고 했습니다. 빠뜨린 ${given[2]}°도 빼면 360 − ${given[0]} − ${given[1]} − ${given[2]} = ${angles[target]}이므로 ${angles[target]}°입니다.`)),opposite:angles[(target+2)%4],first:given[0],second:given[1],third:given[2]};},
  answer:v=>v.missing,check:v=>Math.round(interior(v.points)[v.target]),
  art:v=>({kind:'polygon',expand:true,points:v.points,labels:{angles:v.angles.map((a,i)=>i===v.target?'?':`${a}°`)},rotation:v.rotation,wide:true}),
  solution:'사각형의 네 각의 합은 360°이므로 360 − {first} − {second} − {third} = {answer}입니다.\n따라서 물음표로 표시한 각은 {answer}°입니다.',
});
