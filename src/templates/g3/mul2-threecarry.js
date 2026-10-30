import { explain, multiplySteps } from '../solution-process.js?v=9a67f36b25';
import { define, product, errors, wrong } from './helpers.js?v=9a67f36b25';
import { bank , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool=bank(100,999,2,9,(a,b)=>Math.floor(((Math.floor(a/10)%10)*b+Math.floor((a%10)*b/10))/10)>0,(a,b)=>a*b);
export default define({ id:'g3.mul2.threecarry', unit:'g3s2-multiplication', strand:'calc', level:2, label:'세 자리 받아올림 곱셈', std:['[4수01-04]'] }, {
  input:'number', range:{min:0,max:9999}, errorCount:3, answerSpan:pool.answers,answerCases:pool.cases,
  texts:['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {const {a,b}=pool.draw(rng),oneCarry=Math.floor((a%10)*b/10),tenCarry=Math.floor(((Math.floor(a/10)%10)*b+oneCarry)/10);return {a,b,oneCarry,tenCarry,...errors(
    wrong(a*b-100*tenCarry,'십의 자리 받아올림 빼먹기',`십의 자리에서 백의 자리로 받아올린 ${tenCarry}을 더하지 않아 ${a*b-100*tenCarry}이 되었습니다. ${multiplicationAt(a,b,2)}`),
    wrong(a*b-10*oneCarry,'일의 자리 받아올림 빼먹기',`일의 자리에서 십의 자리로 받아올린 ${oneCarry}을 더하지 않아 ${a*b-10*oneCarry}이 되었습니다. ${multiplicationAt(a,b,1)}`),
    wrong(a+b,'곱하지 않고 더하기',`${a}에 ${b}를 곱해야 하는데 더해서 ${a+b}이 되었습니다. ${a}을 ${b}번 더한 값은 ${a*b}이므로 ${a} × ${b} = ${a*b}입니다.`))};}, v => multiplySteps(v.a,v.b)),
  answer:({a,b})=>a*b, check:({a,b})=>product(a,b),
  solution: "{process}\n따라서 {a} × {b} = {answer:입니다}.",
});
