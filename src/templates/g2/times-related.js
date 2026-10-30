import { define, seq, product, multiplication, products, factCandidates, fill } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.times.related","unit":"g2s2-times","strand":"calc","level":2,"label":"이어지는 구구","std":["[2수01-11]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:products([3,4,6,8],seq(1,9)),
  texts:['{question}'],back:'g1s2-addsub-one',
  draw(rng){const linked=rng.pick([true,false]),v=multiplication(rng,[3,4,6,8],seq(linked?2:1,9)),previous=v.b-1,before=v.a*previous;
    return {...v,previous,before,question:fill(linked?'〔{a} × {previous} = {before}〕〔{a} × {b} = ?〕첫째 곱셈식을 이용하여 둘째 곱셈식을 계산하면 얼마일까요?':'〔{a} × {b} = ?〕계산하면 얼마일까요?',{...v,previous,before}),
      explanation:v.b===1?fill('{a} × 1은 {a:을/를} 한 번 모으는 식입니다.\n따라서 답은 {answer}입니다.',{...v,answer:v.a}):linked?fill('{a} × {previous} = {before}입니다.\n{a} × {b:은/는} {a} × {previous}보다 {a} 큽니다. {before} + {a} = {answer}입니다.\n따라서 답은 {answer}입니다.',{...v,previous,before,answer:v.a*v.b}):fill('{a} × {previous} = {before}입니다.\n{a} × {b:은/는} {a} × {previous}보다 {a} 큽니다. {before} + {a} = {answer}입니다.\n따라서 답은 {answer}입니다.',{...v,previous,before,answer:v.a*v.b})};},
  candidates:factCandidates,edgeWeight:2,
  answer:({a,b})=>a*b,check:({a,b})=>product(a,b),

  solution:'{explanation}',
});
