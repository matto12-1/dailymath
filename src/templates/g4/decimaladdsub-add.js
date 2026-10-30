import {decimalAddLines} from './decimal-helpers.js?v=9a67f36b25';
import { explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,dec,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('decimaladdsub','add',2,'calc',['01-16'],'받아올림 없는 소수 덧셈'),{
  input:'number',answerKind:'decimal',errorCount:2,back:'g3s1-addsub',
  texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {const a=rng.int(101,499),b=rng.int(101,499);if(a%10+b%10>=10||Math.floor(a/10)%10+Math.floor(b/10)%10>=10||a%10===0||b%10===0)return null;return {a,b,left:dec(a,2),right:dec(b,2),// 검수 A2-17: 실수가 하나뿐이라 소수점 자리를 잘못 센 실수를 더한다.
    wrongDot:dec(a+b,1),...errors(wrong(dec(a+b,0),'소수점 빠뜨리기',`소수점을 쓰지 않고 ${a} + ${b} = ${a+b}을 썼습니다. 소수점을 맞추어 더하면 {left} + {right} = {answer}입니다.`),wrong(dec(a+b,1),'소수점 자리 잘못 찍기','소수점을 한 자리 오른쪽에 찍어 {wrongDot:을/를} 썼습니다. 소수 둘째 자리까지 맞추어 더하면 {answer}입니다.'))};}, v => decimalAddLines(v.a,v.b)),
  answer:({a,b})=>dec(a+b,2),check:({left,right})=>dec(Math.round(Number(left)*100)+Math.round(Number(right)*100),2),
  solution: "{process}\n따라서 {left} + {right} = {answer:입니다}.",
});
