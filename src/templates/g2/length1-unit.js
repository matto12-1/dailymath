import { explain, j, count } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.length1.unit","unit":"g2s1-length","strand":"life","level":2,"label":"같은 조각으로 재기","std":["[2수03-10]"]}, {

  range:{min:1,max:13},operandRange:{min:0,max:15},differentDigits:true,errorCount:3,answerSpan:seq(1,12),
  texts:['{object}의 길이는 {small} 몇 개를 이은 길이와 같을까요?'],
  requiredChoices:({n,includeCore})=>includeCore?[n+1]:[],
  candidates:({n})=>seq(Math.max(1,n-3),Math.min(12,n+3)),
  draw: explain(function(rng) {const n=rng.int(1,12),from=0,to=n,object=rng.pick(['연필','크레파스','끈','막대']),small=rng.pick(['클립','조각']),direction=rng.pick([-1,1]);
    return {n,from,to,object,small,includeCore:rng.next()<.65,...errors(
    wrong(n+1,'조각 하나 두 번 세기',`${small} 하나를 두 번 세었습니다. 같은 ${small}을 한 번씩만 세면 ${n}개입니다.`),
    wrong(n-1,'조각 하나 빠뜨리기',`${small} 하나를 빠뜨렸습니다. 빠뜨린 ${small} 하나까지 넣어 세면 ${n}개입니다.`)
    ,wrong(n+direction*2,direction>0?'조각 두 개 더 세기':'조각 두 개 빠뜨리기',`${small}을 2개 ${direction>0?'더 세었습니다':'빠뜨렸습니다'}. 이은 ${small}을 ${direction>0?'중복하지 않고':'빠뜨리지 않고'} 모두 세면 ${n}개입니다.`))};}, v => [v.object+'의 왼쪽 끝부터 '+j(v.small,'을/를')+' 빈틈없이 이었습니다.', '이은 '+j(v.small,'을/를')+' 하나씩 세면 '+v.n+'개입니다.']),
  answer:({to,from})=>to-from,check:({to,from})=>seq(from,to-1).length,
  art:({n,object,small})=>({kind:'ruler',segments:n,unitLabel:'조각',targetLabel:object,segmentObject:small,caption:'같은 길이의 '+small}),
  solution: "{process}\n따라서 {object}의 길이는 {small} {answer}개를 이은 길이와 같습니다.",
});
