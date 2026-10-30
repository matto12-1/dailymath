import { explain, j, say, count } from '../solution-process.js?v=9a67f36b25';
import { define, seq, product, multiplication, products, factCandidates, fill, missingProductErrors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.times.sevennine","unit":"g2s2-times","strand":"calc","level":3,"label":"7단과 9단","std":["[2수01-11]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:[...new Set([...products([7,9],seq(1,9)),...seq(1,9)])],
  texts:['{question}'],back:'g1s2-addsub-one',
  draw: explain(function(rng) {const v=multiplication(rng,[7,9],seq(1,9)),missing=rng.pick([true,false]);
    if(!missing)return {...v,missing,resultName:missing?'□에 알맞은 수는':'답은',total:v.a*v.b,question:fill('〔{a} × {b} = ?〕계산하면 얼마일까요?',v)};
    return {...v,missing,resultName:missing?'□에 알맞은 수는':'답은',total:v.a*v.b,question:fill('〔{a} × □ = {total}〕□에 알맞은 수는 얼마일까요?',{...v,total:v.a*v.b}),...missingProductErrors(rng,v)};}, v => [v.missing?v.a+'단 곱셈구구에서 곱이 '+v.total+'인 것을 찾습니다.':j(v.a+' × '+v.b,'은/는')+' '+v.a+'단 곱셈구구입니다.', ...(!v.missing&&v.b>1?[v.a+'씩 '+v.b+'번 뛰어 세면 '+count(v.b,v.a)+'입니다.']:[]), v.a+' × '+v.b+' = '+say(v.total)]),
  candidates:factCandidates,edgeWeight:2,
  answer:({a,b,missing})=>missing?b:a*b,check:({a,b,missing})=>missing?product(a,b)/a:product(a,b),

  solution: "{process}\n따라서 {resultName} {answer}입니다.",
});
