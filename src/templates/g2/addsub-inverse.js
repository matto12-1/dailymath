import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.addsub.inverse","unit":"g2s1-addsub","strand":"calc","level":4,"label":"덧셈과 뺄셈 관계","std":["[2수01-07]"]}, {

  range:{min:0,max:99},operandRange:{min:0,max:99},answerSpan:seq(11,79),errorCount:3,
  texts:['〔{a} + {b} = {total}〕〔{total} − {b} = ?〕덧셈식을 이용하여 뺄셈식을 계산하면 얼마일까요?'],
  requiredChoices:v=>[v.b],
  edgeWeight:[6,2],
  draw(rng){const a=rng.int(11,79),b=rng.int(10,Math.min(39,Math.floor((99-a)/2))),total=a+b;if(a===b)return null;
    const direction=rng.pick([-1,1]); return {a,b,total,...errors(wrong(total+b,'빼기를 더하기로 계산하기',`${total}에서 ${b}을 빼야 하는데 더했습니다. ${total}에서 더한 수 ${b}을 빼면 더하기 전의 수 ${a}이 됩니다.`),
    wrong(b,'뺀 수를 답으로 고르기',`빼는 수 ${b}을 골랐습니다. ${total}에서 ${b}을 빼면 ${a}입니다.`),
    wrong(a+direction,direction<0?'거꾸로 뺄 때 하나 더 빼기':'거꾸로 뺄 때 하나 덜 빼기',`${total}에서 ${b}을 뺄 때 1을 ${direction<0?'더':'덜'} 뺐습니다. ${total} − ${b} = ${a}입니다.`))};},
  answer:({total,b})=>total-b,check:({a,b,total})=>a+b===total?a:-1,
  solution: "{a} + {b} = {total}입니다.\n{total}에서 더한 수 {b:을/를} 빼면 더하기 전의 수 {a:이/가} 됩니다.\n따라서 답은 {answer}입니다.",
});
