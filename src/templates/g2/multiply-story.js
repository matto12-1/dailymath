import { explain, count } from '../solution-process.js?v=9a67f36b25';
import { define, seq, product, multiplication, products, factCandidates } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.multiply.story","unit":"g2s1-multiplication","strand":"word","level":3,"label":"연필 묶음","std":["[2수01-10]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:products(seq(2,9),seq(2,5)),
  texts:['연필이 {a}자루씩 {b}묶음 있습니다. 모두 몇 자루일까요?'],back:'g1s2-addsub-one',
  draw: explain((rng) => multiplication(rng,[3,4,5,6,7,8,9,2],seq(2,5),{mode:'groups',unit:'자루',bundle:'묶음'}), v => ['연필은 한 묶음에 '+v.a+'자루씩 있습니다.',v.a+'씩 '+v.b+'번 뛰어 세면 '+count(v.b,v.a)+'입니다.','곱셈식으로 나타내면 '+v.a+' × '+v.b+' = '+v.a*v.b+'입니다.']),
  candidates:factCandidates,
  answer:({a,b})=>a*b,check:({a,b})=>product(a,b),
  art:()=>({scene:'pencil-bundles'}),
  solution: "{process}\n따라서 연필은 {answer}자루입니다.",
});
