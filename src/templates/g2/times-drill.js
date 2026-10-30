import { explain, say, j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, product, multiplication, products, factCandidates } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.times.drill","unit":"g2s2-times","strand":"calc","level":3,"label":"곱셈구구 2~9단","std":["[2수01-11]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:products(seq(2,9),seq(2,9)),speedBonus:true,
  texts:['〔{a} × {b} = ?〕계산하면 얼마일까요?'],back:'g1s2-addsub-one',
  draw: explain((rng) => multiplication(rng,seq(2,9),seq(2,9)), v => [v.a + ' × ' + (v.b-1) + ' = ' + say(v.a*(v.b-1)), v.a+' × '+j(v.b,'은/는')+' '+v.a+' × '+(v.b-1)+'보다 '+v.a+' 큽니다. ' + (v.a*(v.b-1)) + ' + ' + v.a + ' = ' + say(v.a*v.b)]),
  candidates:factCandidates,edgeWeight:2,
  answer:({a,b})=>a*b,check:({a,b})=>product(a,b),

  solution: "{process}\n따라서 답은 {answer}입니다.",
});
