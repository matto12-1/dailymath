import {define,meta,seq,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
import {triangle,interior} from './geometry.js?v=9a67f36b25';
const values=seq(20,140,10).filter(v=>v!==60),cases=values.flatMap(v=>[false,true].map(reverse=>({v,reverse})));
export default define(meta('triangles','baseangle',2,'shape',['03-08'],'이등변삼각형의 빈 각'),{
  input:'number',errorCount:3,answerUnit:'°',
  texts:["이등변삼각형에서 물음표로 표시한 각은 몇 도일까요?","이등변삼각형에서 물음표로 표시한 각은 몇 도일까요?"],
  ...casesSpec(cases,({v,reverse})=>reverse?v:(180-v)/2,({v,reverse})=>Math.round(interior(triangle((180-v)/2,(180-v)/2))[reverse?2:0]),(v,rng)=>{const a=(180-v.v)/2;return {...v,a,points:triangle(a,a),rotation:rng.pick([0,180]),...errors(
    v.reverse?wrong(180-a,'같은 두 각 중 하나만 빼기',`180°에서 ${a}°를 한 번만 빼서 ${180-a}°를 썼습니다. 크기가 같은 두 각을 모두 빼면 180 − ${a} − ${a} = ${v.v}이므로 ${v.v}°입니다.`):wrong(180-v.v,'남은 각을 둘로 나누지 않기',`180°에서 ${v.v}°를 뺀 ${180-v.v}°를 그대로 썼습니다. ${180-v.v}°는 크기가 같은 두 각의 합이므로 반으로 나누면 ${a}°입니다.`),
    wrong(v.reverse?a:v.v,'주어진 각과 같다고 보기',`주어진 각 ${v.reverse?a:v.v}°를 그대로 썼습니다. ${v.reverse?`같은 두 각 ${a}°를 모두 빼면 ${v.v}°입니다`:`크기가 같은 나머지 두 각은 각각 ${a}°입니다`}.`),wrong(180,'세 각의 합만 답하기',`빈 각 대신 세 각의 합 180°를 썼습니다. ${v.reverse?`주어진 두 각 ${a}°를 180°에서 빼면 ${v.v}`:`180°에서 ${v.v}°를 뺀 ${180-v.v}°를 둘로 똑같이 나누면 ${a}`}°입니다.`)),
    explanation:v.reverse?`크기가 같은 두 각은 각각 ${a}°입니다. 세 각의 합 180°에서 두 각을 빼면 180 − ${a} − ${a} = ${v.v}입니다.`:`이등변삼각형은 두 각의 크기가 같습니다.\n세 각의 합 180°에서 ${v.v}°를 빼면 180 − ${v.v} = ${180-v.v}입니다.\n크기가 같은 두 각의 합이 ${180-v.v}°이므로 한 각은 ${180-v.v} ÷ 2 = ${a}입니다.`};}),
  art:v=>({kind:'polygon',points:v.points,labels:{angles:v.reverse?[`${v.a}°`,'','?']:['?','',`${v.v}°`]},marks:{equal:[[1,2]]},rotation:v.rotation,wide:true}),
  solution:"{explanation}\n따라서 물음표로 표시한 각은 {answer}°입니다.",
});
