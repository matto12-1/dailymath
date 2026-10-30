import { define, product, errors, wrong } from './helpers.js?v=9a67f36b25';
import { bank , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool=bank(10,99,1,9,(a,t)=>a*t!==a+t*10,(a,t)=>a*t*10);

export default define({ id:'g3.mul2.tens', unit:'g3s2-multiplication', strand:'calc', level:3, label:'두 자리와 몇십 곱셈', std:['[4수01-04]'] }, {
  input:'number', range:{min:0,max:9999}, errorCount:2, answerSpan:pool.answers,
  texts:['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw(rng){const {a,b:t}=pool.draw(rng),b=t*10;return {a,b,t,partial:a*t,...errors(
    wrong(a*t,'곱의 끝 0 빼먹기',`${a} × ${t}만 계산하여 ${a*t}이라고 했습니다. ${b}는 ${t}의 10배이므로 ${a*t}의 10배인 ${a*b}입니다.`),
    wrong(a+b,'곱하지 않고 더하기',`${a}에 ${b}를 곱해야 하는데 더하여 ${a+b}라고 했습니다. ${a} × ${t} = ${a*t}의 10배를 구하면 ${a*b}입니다.`))};},
  answer:({a,b})=>a*b, check:({a,b})=>product(a,b),
  solution:'{a} × {t} = {partial:입니다}.\n{a} × {b:은/는} {a} × {t}의 10배입니다.\n따라서 {a} × {b} = {answer:입니다}.',
});
