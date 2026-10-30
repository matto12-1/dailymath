import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { define, seq, product, multiplication, products, factCandidates } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.times.story","unit":"g2s2-times","strand":"word","level":3,"label":"꽃 묶음","std":["[2수01-10]","[2수01-11]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:products(seq(2,9),seq(2,9)),
  texts:['꽃이 {a}송이씩 {b}묶음 있습니다. 모두 몇 송이일까요?'],back:'g1s2-addsub-one',
  draw: explain((rng) => multiplication(rng,seq(2,9),seq(2,9),{mode:'fact',unit:'송이',bundle:'묶음'}), v => ['꽃이 '+v.a+'송이씩 '+v.b+'묶음이므로 곱셈식은 '+v.a+' × '+v.b+'입니다.',v.a+'단 곱셈구구에서 '+v.a+' × '+v.b+' = '+v.a*v.b+'입니다.']),
  candidates:factCandidates,edgeWeight:2,
  answer:({a,b})=>a*b,check:({a,b})=>product(a,b),
  art:()=>({scene:'flower-bundles'}),
  solution: "{process}\n따라서 꽃은 {answer}송이입니다.",
});
