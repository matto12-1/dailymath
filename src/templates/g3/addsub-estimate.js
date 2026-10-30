import { define, seq, wrong, errors, rankedOptions } from './helpers.js?v=9a67f36b25';
import {cycle,rounded,closest} from './arithmetic-helpers.js?v=9a67f36b25';
const hundreds=n=>Math.floor(n/100)*100;
function setup(a,b){
  const actual=a+b,answer=rounded(actual),ra=rounded(a),rb=rounded(b),down=hundreds(a)+hundreds(b),up=down+200;
  // 두 수가 같은 쪽으로 어림될 때만 「한 수를 반대로」가 따로 나온다. 백 아래가 50에 더 가까운 수를 반대로 본 것으로 한다.
  const sameWay=(ra>a)===(rb>b),[x,rx]=Math.abs(a%100-50)<=Math.abs(b%100-50)?[a,ra]:[b,rb],ox=rx>x?rx-100:rx+100;
  const es=[
    down!==answer?wrong(down,'두 수 모두 몇백으로 버리기',`${a}을 ${hundreds(a)}, ${b}를 ${hundreds(b)}으로 어림하여 ${down}을 골랐습니다. ${a}은 ${ra}에, ${b}는 ${rb}에 더 가까우므로 ${ra} + ${rb} = ${answer}입니다.`):null,
    up!==answer?wrong(up,'두 수 모두 몇백으로 올리기',`${a}을 ${hundreds(a)+100}, ${b}를 ${hundreds(b)+100}으로 어림하여 ${up}을 골랐습니다. ${a}과 ${b}를 가까운 몇백으로 어림하면 ${ra} + ${rb} = ${answer}입니다.`):null,
    sameWay?wrong(answer+ox-rx,'한 수를 반대로 어림하기',`${x}를 ${rx} 대신 ${ox}으로 어림하여 ${answer+ox-rx}을 골랐습니다. ${x}는 ${rx}에 더 가까우므로 ${ra} + ${rb} = ${answer}입니다.`):null];
  // 보기는 모두 몇백(검수 A2-3). 실제 합의 절반 아래·1.6배 위는 계산 없이 지워지므로 빼고, 자리 수가 다른 몇백도 뺀다.
  const fits=n=>n>=100&&n>=actual/2&&n<=1.6*actual&&String(n).length===String(answer).length;
  return {actual,answer,ra,rb,es,wrongs:es.filter(e=>e&&fits(e.value)).map(e=>e.value),near:seq(answer-300,answer+300,100).filter(fits)};
}
// 두 수를 각각 몇백으로 어림한 합과 실제 합에 가장 가까운 몇백이 같은 문제만 낸다(검수 A2-2). 교과서대로 어림한 아이가 틀리지 않는다.
// 백 아래가 50인 수는 어느 몇백에 가까운지 갈리므로 뺀다.
function valid(a,b){
  if(a%100===0||b%100===0||a%100===50||b%100===50||Math.abs(a+b-rounded(a+b))>20||rounded(a)+rounded(b)!==rounded(a+b))return false;
  const s=setup(a,b);
  return (rounded(a)>a)===(rounded(b)>b)&&s.wrongs.length>=2&&new Set([...s.wrongs,...s.near]).size>=3;
}
// 답마다 조건에 맞는 수를 조금씩 모은다. 81만 쌍을 전부 셀 필요가 없다.
const groups=new Map();
for(const target of seq(200,2000,100)){
  const cases=[],counts=[0,0];
  for(let a=101;a<=999&&counts.some(n=>n<10);a+=7)for(const delta of [-19,-13,-7,-1,1,7,13,19]){
    const b=target+delta-a;
    if(b>=100&&b<=999&&valid(a,b)){const dir=Number(rounded(a)>a);if(counts[dir]<10){cases.push({a,b});counts[dir]++;}}
  }
  if(cases.length)groups.set(target,cases);
}
const pool={answers:[...groups.keys()],draw(rng){return rng.pick(groups.get(cycle(rng,groups,this.answers)));}};
export default define({id:'g3.addsub.estimate',unit:'g3s1-addsub',strand:'estimate',level:5,label:'세 자리 덧셈 어림',std:['[4수01-08]']},{
  errorCount:3,range:{min:0,max:4000},operandRange:{min:0,max:4000},answerSpan:pool.answers,back:'g2s1-numbers-three-digits',
  texts:['〔{a} + {b}〕어림하여 계산하면 약 얼마일까요?'],
  draw(rng){
    const {a,b}=pool.draw(rng),s=setup(a,b),options=rankedOptions(rng,s.answer,s.wrongs,s.near,4,2,true);
    if(!options)return null;
    return {a,b,actual:s.actual,ra:s.ra,rb:s.rb,options,...errors(...s.es)};
  },
  answer:({a,b})=>rounded(a+b),check:({a,b})=>seq(0,2000,100).reduce((v,n)=>Math.abs(a+b-n)<Math.abs(a+b-v)?n:v,0),
  isCorrect:(v,c)=>closest(v,c,v.a+v.b),
  solution:'{a:은/는} 약 {ra}, {b:은/는} 약 {rb:으로/로} 어림합니다.\n{ra} + {rb} = {answer:입니다}. 실제로 더하면 {actual:으로/로} {answer}에 가깝습니다.\n따라서 약 {answer:입니다}.',
});
