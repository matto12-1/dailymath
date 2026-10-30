import {define,meta,bank,product,errors,wrong} from './helpers.js?v=9a67f36b25';
const pool=bank(100,999,11,99,(a,b)=>b%10!==0,(a,b)=>a*b);
export default define(meta('muldiv','multiply',2,'calc',['01-04'],'세 자리 수와 두 자리 수의 곱'),{
  input:'number',maxDigits:6,range:{min:0,max:99999},answerSpan:pool.answers,answerCases:()=>pool.cases(),back:'g3s2-multiplication',
  texts:['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw(rng){const {a,b}=pool.draw(rng),t=Math.floor(b/10),u=b%10;return {a,b,t,u,tens:t*10,first:a*t*10,second:a*u,...errors(wrong(a*(t+u),'십의 자리 곱을 왼쪽으로 옮기지 않기',`${a} × ${t}을 10배 하지 않고 더해 ${a*(t+u)}을 썼습니다. 십의 자리 {t:은/는} {tens:을/를} 나타내므로 {first}에 {second:을/를} 더하면 {answer}입니다.`),wrong(a*u,'십의 자리 곱 빠뜨리기','일의 자리와 곱한 값 {second}만 썼습니다. 빠뜨린 {a} × {tens} = {first}도 더하면 {answer}입니다.'))};},
  answer:({a,b})=>a*b,check:({a,b})=>product(a,b),
  solution:'{a} × {b:은/는} {a} × {tens:과/와} {a} × {u:을/를} 더한 값입니다.\n{a} × {tens} = {first}, {a} × {u} = {second}입니다.\n{first} + {second} = {answer}입니다.\n따라서 {a} × {b} = {answer:입니다}.',
});
