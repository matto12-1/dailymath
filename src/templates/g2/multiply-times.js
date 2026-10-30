import { define, seq, product, multiplication, products, factCandidates } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.multiply.times","unit":"g2s1-multiplication","strand":"calc","level":2,"label":"몇 배","std":["[2수01-10]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:products(seq(2,9),seq(2,5)),
  texts:['{a}의 {b}배는 얼마일까요?'],back:'g1s2-addsub-one',
  draw(rng){const v=multiplication(rng,seq(2,9),seq(2,5),{mode:'repeated',unit:'개',bundle:'묶음'});return v;},
  candidates:factCandidates,
  answer:({a,b})=>a*b,check:({a,b})=>product(a,b),

  solution: "{a}의 {b}배는 {a:을/를} {b}번 더한 수입니다.\n{repeated} = {answer}입니다.\n따라서 답은 {answer}입니다.",
});
