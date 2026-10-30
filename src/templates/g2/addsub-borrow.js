import { explain, placeSteps } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors, until } from './helpers.js?v=9a67f36b25';
import { arithmeticWords } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.addsub.borrow","unit":"g2s1-addsub","strand":"calc","level":3,"label":"받아내림 한 번","std":["[2수01-06]"]}, {


  range:{min:0,max:99},operandRange:{min:0,max:99},answerSpan:seq(11,79).filter(n=>n%10!==0),errorCount:3,
  texts:['〔{a} − {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {const target=rng.pick(seq(11,79).filter(n=>n%10!==0)),chosen=until(()=>{const tens=rng.pick([true,false]), a=tens?rng.int(Math.ceil((target+11)/10),9)*10:rng.int(target+11,99), b=a-target;return a%10<b%10?{a,b}:null;}),{a,b}=chosen;
    const useReverse=rng.next()<.65&&target%10!==5;return {a,b,useReverse,...errors(
      wrong(target+10,'빌린 십 빼먹기',`받아내림을 하고도 십의 자리를 ${Math.floor(a/10)} 그대로 계산했습니다. ${arithmeticWords(a,b,true).borrowFact}`),
      wrong(target-10,'십 두 번 빌리기',`십의 자리에서 1을 두 번 받아내렸습니다. ${arithmeticWords(a,b,true).borrowTwiceFact}`),
      useReverse ? wrong(Math.abs(a%10-b%10)+(Math.floor(a/10)-Math.floor(b/10))*10,'일의 자리 거꾸로 빼기',`일의 자리 ${a%10} − ${b%10}을 거꾸로 ${b%10} − ${a%10}로 뺐습니다. ${arithmeticWords(a,b,true).onesFact}`) : wrong(target-1,'일의 자리 하나 더 빼기',`일의 자리를 1 작게 계산했습니다. ${arithmeticWords(a,b,true).onesFact}`))};}, v => placeSteps(v.a,v.b,true)),
  requiredChoices:v=>v.useReverse?[v.e3.value]:[],
  candidates: ({a}) => seq(0,a-1),
  answer:({a,b})=>a-b,check:({a,b})=>(Math.floor(a/10)-1-Math.floor(b/10))*10+(a%10+10-b%10),
  solution: "{process}\n따라서 답은 {answer}입니다.",
});
