import { define, product, errors, wrong } from './helpers.js?v=9a67f36b25';

import {bank, multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';
const pool=bank(11,99,11,99,(a,b)=>b%10!==0,(a,b)=>a*b);
export default define({ id:'g3.mul2.twotwo', unit:'g3s2-multiplication', strand:'calc', level:4, label:'두 자리끼리 곱셈', std:['[4수01-04]'] }, {
  input:'number', range:{min:0,max:9999}, errorCount:2, answerSpan:pool.answers,answerCases:pool.cases,
  texts:['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw(rng){const a=rng.int(11,99),b=rng.int(11,99),t=Math.floor(b/10),u=b%10;if(u===0)return null;return {a,b,t,u,ones:a*u,tens:a*t*10,...errors(
    wrong(a*(u+t),'십의 자리 곱을 밀지 않기',`${b}의 십의 자리 ${t}을 ${t*10}이 아니라 ${t}로 보아 ${a*(u+t)}을 썼습니다. ${a} × ${t*10} = ${a*t*10}에 ${a*u}을 더하면 ${a*b}입니다.`),
    wrong(a*u,'십의 자리 곱 빼먹기',`${a} × ${u} = ${a*u}만 썼습니다. 빠뜨린 ${a} × ${t*10} = ${a*t*10}도 더하면 ${a*b}입니다.`))};},
  answer:({a,b})=>a*b, check:({a,b})=>product(a,b),
  solution:'{a} × {b:은/는} {a} × {u:과/와} {a} × {t}0을 더한 값입니다.\n{a} × {u} = {ones}, {a} × {t}0 = {tens}입니다.\n{ones} + {tens} = {answer}입니다.\n따라서 {a} × {b} = {answer:입니다}.',
});
