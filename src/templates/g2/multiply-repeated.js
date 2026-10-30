import { explain, j, say, count } from '../solution-process.js?v=9a67f36b25';
import { define, seq, product, multiplication, products, factCandidates } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.multiply.repeated","unit":"g2s1-multiplication","strand":"calc","level":1,"label":"반복 덧셈","std":["[2수01-10]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:products(seq(2,9),seq(3,5)),
  texts:['〔{repeated} = ?〕계산하면 얼마일까요?', '〔{repeated} = ?〕같은 수를 더하면 얼마일까요?'],back:'g1s2-addsub-one',
  draw: explain((rng) => multiplication(rng,seq(2,9),seq(3,5),{mode:'repeated',unit:'개',bundle:'묶음'}), v => ['같은 수 ' + j(v.a,'을/를') + ' ' + v.b + '번 더합니다.', Array.from({length:v.b-1},(_,i)=>(i+1)*v.a+' + '+v.a+' = '+(i+2)*v.a+'입니다.').join(' ')]),
  candidates:factCandidates,
  answer:({a,b})=>a*b,check:({a,b})=>product(a,b),

  solution: "{process}\n따라서 답은 {answer}입니다.",
});
