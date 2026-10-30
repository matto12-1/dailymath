import {decimalAddLines} from './decimal-helpers.js?v=9a67f36b25';
import {explain} from '../solution-process.js?v=9a67f36b25';
import {define,meta,dec,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('decimaladdsub','align',3,'calc',['01-16'],'자릿수가 다른 소수 덧셈'),{
  input:'number',answerKind:'decimal',
  texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
  draw:explain(function(rng){const a=rng.int(11,89),b=rng.int(11,599);if(a%10===0||b%10===0)return null;const reverse=rng.int(0,1),short=dec(a,1),long=dec(b,2);return {a,b,padded:short+"0",left:reverse?long:short,right:reverse?short:long,short,...errors(wrong(dec(a+b,2),'오른쪽 끝자리끼리 맞추기',`오른쪽 끝을 맞추어 {short:을/를} {small:으로/로} 놓고 더해 ${dec(a+b,2)}을 썼습니다. 소수점을 맞추면 {left} + {right} = {answer}입니다.`),wrong(dec(a+b,0),'소수점 없이 더하기',`소수점을 지우고 ${a} + ${b} = ${a+b}을 썼습니다. {short:은/는} {padded:과/와} 같으므로 같은 자리끼리 더하면 {answer}입니다.`)),small:dec(a,2)};},v=>decimalAddLines(Math.round(Number(v.left)*100),Math.round(Number(v.right)*100))),
  answer:({a,b})=>dec(a*10+b,2),check:({left,right})=>dec(Math.round(Number(left)*100)+Math.round(Number(right)*100),2),
  solution:'{short:을/를} {padded:으로/로} 보고 소수점을 맞추어 같은 자리끼리 더합니다.\n{process}\n따라서 {left} + {right} = {answer:입니다}.',
});
