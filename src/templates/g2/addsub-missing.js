import { fill, define, seq, sum, wrong, errors } from './helpers.js?v=9a67f36b25';
import { arithmeticWords } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.addsub.missing","unit":"g2s1-addsub","strand":"calc","level":4,"label":"네모에 알맞은 수","std":["[2수01-09]"]}, {

  range:{min:0,max:99},operandRange:{min:0,max:99},answerSpan:seq(31,99),errorCount:3,edgeWeight:[2,6],
  texts:['〔{equation}〕□에 알맞은 수는 얼마일까요?'],
  draw(rng){const total=rng.int(31,99),add=total<90&&rng.pick([true,false]),direction=rng.pick([-1,1]);
    const b=add?rng.int(1,99-total):rng.int(10,Math.floor((total-1)/2)),c=add?total+b:total-b;
    return {b,c,total,add,equation:fill(add?'{b} + □ = {c}':'□ − {b} = {c}',{b,c}),
      explanation:fill(add?'{b} + □ = {c:은/는} 뺄셈식 {c} − {b} = □로 나타낼 수 있습니다.\n{c} − {b} = {total}입니다.\n따라서 □에 알맞은 수는 {total}입니다.':'□ − {b} = {c:은/는} 덧셈식 {c} + {b} = □로 나타낼 수 있습니다.\n{c} + {b} = {total}입니다.\n따라서 □에 알맞은 수는 {total}입니다.',{b,c,total}),
      ...errors(wrong(add?c+b:c-b,'거꾸로 계산할 때 덧셈과 뺄셈 바꾸기',add?`합 ${c}에서 ${b}을 빼야 하는데 더했습니다. ${c} − ${b} = ${total}입니다.`:`남은 ${c}에서 뺀 수 ${b}을 또 뺐습니다. ${c} + ${b} = ${total}입니다.`),
      wrong(total+direction*10,'십의 자리 하나 달리 세기',`십의 자리를 1 ${direction>0?'크게':'작게'} 계산했습니다. ${arithmeticWords(c,b,add).tensFact}`),
      wrong(total+1,'네모 구할 때 하나 더 세기',`□를 구하면서 일의 자리를 1 크게 계산했습니다. ${arithmeticWords(c,b,add).onesFact}`))};},
  answer:({total})=>total,check:({b,c,add})=>add?c-b:sum(b,c),
  solution:'{explanation}',
});
