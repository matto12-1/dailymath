import {explain,multiplyLines} from '../solution-process.js?v=9a67f36b25';
import {define,meta,bank,product,errors,wrong} from './helpers.js?v=9a67f36b25';
const pool=bank(100,999,1,9,()=>true,(a,b)=>a*b*10);
export default define(meta('muldiv','tens',1,'calc',['01-04'],'세 자리 수와 몇십의 곱'),{
  input:'number',range:{min:0,max:99999},maxDigits:6,answerSpan:pool.answers,answerCases:()=>pool.cases(),back:'g3s2-multiplication',
  texts:['〔{a} × {b}0 = ?〕계산하면 얼마일까요?'],
  draw:explain(function(rng){const {a,b}=pool.draw(rng);return {a,b,partial:a*b,...errors(wrong(a*b,'몇십의 0 빠뜨리기',`{b}0 대신 {b:을/를} 곱해 ${a*b}을 썼습니다. {b}0은 {b}의 10배이므로 ${a*b}의 10배인 ${a*b*10}입니다.`),wrong(a*b*100,'0을 두 번 붙이기',`{a} × {b}의 값에 0을 두 번 붙여 ${a*b*100}을 썼습니다. {b}0은 {b}의 10배이므로 0을 한 번 붙인 ${a*b*10}입니다.`))};},v=>multiplyLines(v.a,v.b)),
  answer:({a,b})=>a*b*10,check:({a,b})=>product(a,b)*10,
  solution:'{process}\n{a} × {b} = {partial:입니다}.\n{b}0은 {b}의 10배이므로 {a} × {b}0은 {partial}의 10배입니다.\n따라서 {a} × {b}0 = {answer:입니다}.',
});
