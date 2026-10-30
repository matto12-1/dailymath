import { explain, say } from '../solution-process.js?v=9a67f36b25';
import { define, seq, product, multiplication, products, factCandidates } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.multiply.groups","unit":"g2s1-multiplication","strand":"word","level":2,"label":"사탕 봉지","std":["[2수01-10]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:products(seq(2,9),seq(2,5)),
  texts:['사탕이 {a}개씩 {b}봉지 있습니다. 모두 몇 개일까요?'],back:'g1s2-addsub-one',
  draw: explain((rng) => multiplication(rng,seq(2,9),seq(2,5),{mode:'groups',unit:'개',bundle:'봉지'}), v => ['사탕은 1봉지에 ' + v.a + '개씩, ' + v.b + '봉지입니다.', v.repeated + ' = ' + say(v.a*v.b)]),
  candidates:factCandidates,
  answer:({a,b})=>a*b,check:({a,b})=>product(a,b),
  art:()=>({scene:'candy-bags'}),
  solution: "{process}\n따라서 사탕은 {answer}개입니다.",
});
