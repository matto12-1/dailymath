import { define, seq, unique, wrong, errors } from './helpers.js?v=9a67f36b25';

const gcd=(a,b)=>b?gcd(b,a%b):a;
const cases=seq(3,9).flatMap(d=>seq(2,d-1).flatMap(n=>seq(2,9).map(k=>({d,n,k,A:d*k,answer:n*k}))))
  .filter(v=>v.n!==v.k&&gcd(v.n,v.d)===1);
const span=unique(cases.map(v=>v.answer)).sort((a,b)=>a-b);
export default define({id:'g3.fractions.amount',unit:'g3s2-fractions',strand:'word',level:2,label:'전체의 분수만큼',std:['[4수01-09]']},{
  input:'number',answerUnit:'개',range:{min:0,max:81},answerSpan:span,errorCount:2,
  texts:['사탕 {A}개 중 {fraction:을/를} 선물 상자에 담습니다. 상자에 담는 사탕은 몇 개일까요?'],
  draw(rng){const answer=rng.pick(span),v=rng.pick(cases.filter(c=>c.answer===answer));return {...v,fraction:`${v.n}/${v.d}`,
    ...errors(wrong(v.k,'분자만큼 모으기 빠뜨리기','전체의 1/{d}만큼인 {k}개만 구했습니다. {fraction:은/는} {d}묶음 중 {n}묶음이므로 {k} × {n} = {answer}개입니다.'),wrong(v.n,'분자를 개수로 답하기','분자 {n:을/를} 개수로 썼습니다. 한 묶음은 {k}개이고 {n}묶음을 모으므로 {k} × {n} = {answer}개입니다.')),minus:v.A-v.d};},
  answer:v=>v.answer,check:({A,d,n})=>Array(n).fill(A/d).reduce((a,b)=>a+b,0),
  art:()=>({scene:'candy-fractions'}),solution:"{A}개를 똑같이 {d}묶음으로 나누면 한 묶음은 {A} ÷ {d} = {k}개입니다.\n{fraction:은/는} {d}묶음 중 {n}묶음이므로 {k} × {n} = {answer}개입니다.\n따라서 상자에 담는 사탕은 {answer}개입니다.",
});
