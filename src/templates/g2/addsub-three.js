import { explain, placeSteps, j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, sum, wrong, errors } from './helpers.js?v=9a67f36b25';
import { arithmeticWords } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.addsub.three","unit":"g2s1-addsub","strand":"calc","level":4,"label":"세 수의 계산","std":["[2수01-08]"]}, {

  range:{min:0,max:99},operandRange:{min:0,max:99},answerSpan:seq(10,89),errorCount:3,edgeWeight:4,
  texts:['〔{a} + {b} − {c} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {const target=rng.int(10,89),c=rng.int(1,99-target),total=target+c,a=rng.int(1,total-1),b=total-a;
    if(c===a||c===b)return null;
    return {a,b,c,...errors(wrong(a+b+c,'빼기를 더하기로 계산하기',`${c}을 빼야 하는데 더했습니다. ${a}과 ${b}을 더한 ${total}에서 ${c}을 빼면 ${target}입니다.`),
    rng.pick([true,false]) ? wrong(a+b,'마지막 뺄셈 빠뜨리기',`${a}과 ${b}만 더하고 ${c}을 빼지 않았습니다. 먼저 더한 ${total}에서 마지막 수 ${c}까지 계산하면 ${target}입니다.`) : wrong(target-10,'십의 자리 하나 더 빼기',`뺄셈에서 십의 자리를 1 작게 계산했습니다. ${arithmeticWords(total,c,true).tensFact}`),
    wrong(target-1,'뺄셈 하나 더 세기',`${c}을 빼야 하는데 ${c+1}을 뺐습니다. ${arithmeticWords(total,c,true).onesFact}`))};}, v => {const adds=placeSteps(v.a,v.b);return ['먼저 '+j(v.a,'과/와')+' '+j(v.b,'을/를')+' 더합니다. '+adds[0], adds[1]+' '+v.a+' + '+v.b+' = '+(v.a+v.b)+'입니다.', (v.a+v.b)+'에서 '+j(v.c,'을/를')+' 뺍니다. '+placeSteps(v.a+v.b,v.c,true).join(' ')];}),
  answer:({a,b,c})=>a+b-c,check:({a,b,c})=>{let n=sum(a,b);for(let i=0;i<c;i++)n--;return n;},
  solution: "{process}\n따라서 답은 {answer}입니다.",
});
