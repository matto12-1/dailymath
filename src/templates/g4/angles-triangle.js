import {define,meta,seq,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
import {triangle,interior} from './geometry.js?v=9a67f36b25';
const cases=seq(20,120,5).flatMap(a=>seq(20,140-a,5).map(b=>({a,b})));
export default define(meta('angles','triangle',3,'shape',['03-25'],'삼각형의 빈 각'),{
  input:'number',answerUnit:'°',texts:["삼각형에서 물음표로 표시한 각은 몇 도일까요?","삼각형에서 물음표로 표시한 각은 몇 도일까요?"],
  ...casesSpec(cases,({a,b})=>180-a-b,({a,b})=>Math.round(interior(triangle(a,b))[2]),(v,rng)=>({...v,points:triangle(v.a,v.b),rotation:rng.pick([0,180]),...errors(
    wrong(360-v.a-v.b,'사각형의 각도 합 사용하기',`삼각형의 세 각의 합을 360°로 보아 ${360-v.a-v.b}°를 썼습니다. 세 각의 합 180°에서 주어진 두 각을 빼면 180 − {a} − {b} = {answer}이므로 {answer}°입니다.`),wrong(180-v.a,'주어진 각 하나만 빼기',`180°에서 {a}°만 빼서 ${180-v.a}°를 썼습니다. 빠뜨린 {b}°도 빼면 180 − {a} − {b} = {answer}이므로 {answer}°입니다.`))})),
  art:v=>({kind:'polygon',expand:true,points:v.points,labels:{angles:[`${v.a}°`,`${v.b}°`,'?']},rotation:v.rotation,wide:true}),
  solution:'삼각형의 세 각의 합은 180°이므로 180 − {a} − {b} = {answer}입니다.\n따라서 물음표로 표시한 각은 {answer}°입니다.',
});
