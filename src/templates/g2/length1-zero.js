import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.length1.zero","unit":"g2s1-length","strand":"life","level":2,"label":"0에서 길이 재기","std":["[2수03-10]"]}, {

  range:{min:1,max:13},operandRange:{min:0,max:15},differentDigits:true,errorCount:3,answerSpan:seq(1,12),
  texts:['{object}의 길이는 몇 cm일까요?'],
  requiredChoices:({n,includeCore})=>includeCore?[n+1]:[],
  candidates:({n})=>seq(Math.max(1,n-3),Math.min(12,n+3)),
  draw(rng){const n=rng.int(1,12),from=0,to=n,object=rng.pick(['연필','크레파스','끈','막대']),small=rng.pick(['클립','조각']),direction=rng.pick([-1,1]);
    return {n,from,to,object,small,includeCore:rng.next()<.65,...errors(
    wrong(n+1,'눈금 대신 선 개수 세기',`눈금 칸 대신 눈금 선을 세었습니다. 눈금 선 대신 사이의 칸을 세면 ${n} cm입니다.`),
    wrong(n-1,'마지막 칸 빠뜨리기',`마지막 한 칸을 빠뜨리고 세었습니다. 빠뜨린 마지막 한 칸까지 세면 ${n} cm입니다.`)
    ,wrong(n+direction*2,direction>0?'두 개 더 세기':'두 개 빠뜨리기',`칸을 두 개 ${direction>0?'더':'덜'} 세었습니다. 눈금 0에서 끝까지 칸을 ${direction>0?'한 번씩만':'빠짐없이'} 세면 ${n} cm입니다.`))};},
  answer:({to,from})=>to-from,check:({to,from})=>seq(from,to-1).length,
  art:({from,to,object})=>({kind:'ruler',cm:15,from,to,object}),
  solution: "{object}의 한쪽 끝이 자의 눈금 0에 맞춰져 있습니다. 다른 쪽 끝의 눈금은 {n}입니다.\n따라서 길이는 {n} cm입니다.",
});
