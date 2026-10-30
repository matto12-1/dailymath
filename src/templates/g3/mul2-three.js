import { explain, multiplySteps } from '../solution-process.js?v=9a67f36b25';
import { define, product, errors, wrong } from './helpers.js?v=9a67f36b25';
import { bank , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool=bank(100,499,2,9,(a,b)=>[Math.floor(a/100),Math.floor(a/10)%10,a%10].every(n=>n*b<10),(a,b)=>a*b);
export default define({ id:'g3.mul2.three', unit:'g3s2-multiplication', strand:'calc', level:1, label:'세 자리 곱셈', std:['[4수01-04]'] }, {
  input:'number', range:{min:0,max:9999}, errorCount:3, back:'g2s2-times', answerSpan:pool.answers,
  texts:['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {const {a,b}=pool.draw(rng),h=Math.floor(a/100)*100,u=a%10;return {a,b,h,u,...errors(
    wrong(h+(a%100)*b,'백의 자리 곱 빼먹기',`백의 자리에 ${b}를 곱하지 않아 ${h+(a%100)*b}이 되었습니다. ${multiplicationAt(a,b,2)}`),
    wrong((a-u)*b+u,'일의 자리 곱 빼먹기',`일의 자리 ${u}에 ${b}를 곱하지 않아 ${(a-u)*b+u}이 되었습니다. ${multiplicationAt(a,b,0)}`),
    wrong(a+b,'곱하지 않고 더하기',`${a}에 ${b}를 곱해야 하는데 더해서 ${a+b}이 되었습니다. ${a}을 ${b}번 더한 값은 ${a*b}이므로 ${a} × ${b} = ${a*b}입니다.`))};}, v => multiplySteps(v.a,v.b)),
  answer:({a,b})=>a*b, check:({a,b})=>product(a,b),
  solution: "{process}\n따라서 {a} × {b} = {answer:입니다}.",
});
