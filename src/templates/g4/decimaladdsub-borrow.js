import { explain, j, placeSteps } from '../solution-process.js?v=9a67f36b25';
import {define,meta,dec,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('decimaladdsub','borrow',3,'calc',['01-16'],'두 번 받아내리는 소수 뺄셈'),{
  input:'number',answerKind:'decimal',back:'g3s1-addsub',
  texts:['〔{left} − {right} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {const h=rng.int(2,8),t=rng.int(1,7),v=rng.int(1,h-1),u=rng.int(t+1,9),n=rng.int(1,9),a=h*100+t*10,b=v*100+u*10+n;return {a,b,left:dec(a,2),right:dec(b,2),...errors(wrong(dec((h-v)*100+(u-t)*10+n,2),'자리마다 큰 수에서 작은 수 빼기',`자리마다 큰 숫자에서 작은 숫자를 빼서 ${dec((h-v)*100+(u-t)*10+n,2)}을 썼습니다. 뺄 수 없는 자리는 윗자리에서 받아내림하여 빼면 ${dec(a-b,2)}입니다.`),wrong(dec(a-b+100,2),'자연수에서 빌려준 1 빼먹기',`일의 자리에서 받아내림한 1을 빼지 않아 ${dec(a-b+100,2)}을 썼습니다. 일의 자리도 ${h}에서 1을 줄이면 ${h-1}이므로 차는 ${dec(a-b,2)}입니다.`))};}, v => {const lines=placeSteps(v.a,v.b,true,3,2);lines[0]=j(v.left,'을/를')+' '+(v.a/100).toFixed(2)+'으로 보고 소수점을 맞춥니다. '+lines[0];return lines;}),
  answer:({a,b})=>dec(a-b,2),check:({left,right})=>dec(Math.round(Number(left)*100)-Math.round(Number(right)*100),2),
  solution: "{process}\n따라서 {left} − {right} = {answer:입니다}.",
});
