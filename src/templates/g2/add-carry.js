import { define, seq, until } from './helpers.js?v=9a67f36b25';
import { arithmeticWords } from './helpers.js?v=9a67f36b25';
import { explain, placeSteps } from '../solution-process.js?v=9a67f36b25';

export default define({"id":"g2.add2.carry1","unit":"g2s1-addsub","strand":"calc","level":2,"label":"받아올림 한 번","std":["[2수01-06]"]}, {

  range:{min:0,max:99},operandRange:{min:0,max:99},answerSpan:seq(30,88).filter(n=>n%10!==9),errorCount:3,
  texts:['〔{a} + {b} = ?〕계산하면 얼마일까요?'],speedBonus:true,
  draw:explain(function(rng){const target=rng.pick(seq(30,88).filter(n=>n%10!==9));return until(()=>{const single=rng.pick([true,false]), b=single?rng.int(1,9):rng.int(11,target-11), a=target-b,extra=rng.pick([true,false]);return a%10&&b%10&&a%10+b%10>=10?{a,b,includeCore:rng.next()<.65,...arithmeticWords(a,b),onesA:a%10,onesB:b%10,onesSum:a%10+b%10,extra,countLabel:extra?'일의 자리 하나 더 세기':'일의 자리 하나 덜 세기',countSay:`일의 자리를 1 ${extra?'크게 계산했습니다':a%10+b%10===10?'작게 계산해서 받아올림을 하지 않았습니다':'작게 계산했습니다'}. ${arithmeticWords(a,b).onesFact}`}:null;});},v=>placeSteps(v.a,v.b)),
  requiredChoices:({a,b,includeCore})=>includeCore?[a+b-10]:[],
  candidates: ({a,b}) => seq(Math.max(a,b)+1,99),
  answer:({a,b})=>a+b,check:({a,b})=>(Math.floor(a/10)+Math.floor(b/10)+1)*10+(a%10+b%10-10),
  mistakes:[
    {id:'no-carry',label:'받아올림 빠뜨리기',say:'받아올림한 1을 십의 자리에 더하지 않았습니다. {tensFact}',value:({a,b})=>a+b-10},
    {id:'carry-twice',label:'받아올림 두 번 더하기',say:'받아올림한 1을 십의 자리에 두 번 더했습니다. {carryTwiceFact}',value:({a,b})=>a+b+10},
    {id:'ones-one',label:'{countLabel}',say:'{countSay}',value:({a,b,extra})=>a+b+(extra?1:-1)},
  ],
  solution:'{process}\n따라서 답은 {answer}입니다.',
});
