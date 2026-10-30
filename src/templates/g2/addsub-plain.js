import { explain, placeSteps } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';
import { arithmeticWords } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.addsub.plain","unit":"g2s1-addsub","strand":"calc","level":1,"label":"받아올림 없는 덧셈","std":["[2수01-06]"]}, {

  range:{min:0,max:99},operandRange:{min:0,max:99},errorCount:3,answerSpan:seq(22,88).filter(n=>Math.floor(n/10)>=2&&n%10>=2&&n%10<=8),
  texts:['〔{a} + {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {const direction=rng.pick([-1,1]), t=rng.int(2,8),o=rng.int(2,8),u=rng.int(1,t-1),v=rng.int(1,o-1),a=10*u+v,b=10*(t-u)+o-v;
    return {a,b,...errors(wrong(a+b%10,'십 자리 덧셈 빠뜨리기',`${b}에서 일의 자리 ${b%10}만 더했습니다. ${arithmeticWords(a,b).tensFact.replace('십의 자리는','더할 수의 십의 자리까지 더하면')}`),
      direction<0 ? wrong(a+Math.floor(b/10)*10,'일 자리 덧셈 빠뜨리기',`${b}에서 십의 자리만 더했습니다. ${arithmeticWords(a,b).onesFact.replace('일의 자리는','더할 수의 일의 자리까지 더하면')}`) : wrong(a+b+10,'십의 자리 하나 더 세기',`십의 자리를 1 크게 계산했습니다. ${arithmeticWords(a,b).tensFact}`),
      wrong(a+b+1,'더할 때 하나 더 세기',`일의 자리를 1 크게 계산했습니다. ${arithmeticWords(a,b).onesFact}`))};}, v => placeSteps(v.a,v.b)),
  candidates: ({a,b}) => seq(Math.max(a,b)+1,99),
  answer:({a,b})=>a+b,check:({a,b})=>(Math.floor(a/10)+Math.floor(b/10))*10+a%10+b%10,
  solution: "{process}\n따라서 답은 {answer}입니다.",
});
