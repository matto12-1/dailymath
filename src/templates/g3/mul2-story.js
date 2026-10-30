import { define, product, errors, wrong } from './helpers.js?v=9a67f36b25';

import {bank, multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';
const pool=bank(11,99,11,99,(a,b)=>b%10!==0,(a,b)=>a*b);
export default define({ id:'g3.mul2.story', unit:'g3s2-multiplication', strand:'word', level:5, label:'공책 상자 곱셈', std:['[4수01-04]'] }, {
  input:'number', range:{min:0,max:9999}, errorCount:2, answerSpan:pool.answers,answerCases:pool.cases, answerUnit:'권',
  texts:["한 상자에 공책을 {a}권씩 담습니다. {b}상자에 담은 공책은 모두 몇 권일까요?","한 상자에 공책을 {a}권씩 담습니다. {b}상자에 담은 공책은 모두 몇 권일까요?"],
  draw(rng){const a=rng.int(11,99),b=rng.int(11,99),t=Math.floor(b/10),u=b%10;if(u===0)return null;return {a,b,t,u,...errors(
    wrong(a*(u+t),'십의 자리 곱을 밀지 않기',`${b}의 십의 자리 ${t}을 ${t*10}이 아니라 ${t}로 보아 ${a*(u+t)}을 썼습니다. ${a} × ${t*10} = ${a*t*10}에 ${a*u}을 더하면 ${a*b}입니다.`),
    wrong(a*u,'십의 자리 곱 빼먹기',`${a} × ${u} = ${a*u}만 썼습니다. 빠뜨린 ${a} × ${t*10} = ${a*t*10}도 더하면 ${a*b}입니다.`))};},
  answer:({a,b})=>a*b, check:({a,b})=>product(a,b),
  art:()=>({scene:'notebook-boxes'}),
  solution:"한 상자에 {a}권씩 {b}상자이므로 {a} × {b} = {answer}입니다.\n따라서 공책은 모두 {answer}권입니다.",
});
