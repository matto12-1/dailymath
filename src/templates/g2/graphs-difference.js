import { define, seq, wrong, errors, fill } from './helpers.js?v=9a67f36b25';

// 실수 값과 채움 보기 모두 답이 될 수 있는 1~8에서 고른다(C-9).
export default define({id:'g2.graphs.difference',unit:'g2s2-tables-graphs',strand:'life',level:3,label:'그래프의 차',std:['[2수04-03]']},{
  range:{min:1,max:8},operandRange:{min:0,max:9},errorCount:3,answerSpan:seq(1,8),texts:['{question}'],edgeWeight:3,candidates:seq(1,8),
  draw(rng){const target=rng.int(1,8),b=rng.int(1,9-target),a=b+target,labels=rng.shuffle(['사과','배','귤','포도']).slice(0,2),less=rng.pick([true,false]),direction=rng.pick([-1,1]);
    if(a===2*b)return null;
    return {a,b,labels,less,high:labels[0],low:labels[1],conclusion:fill(less?'{low:을/를} 고른 사람이 {diff}명 더 적습니다.':'{high:을/를} 고른 사람이 {diff}명 더 많습니다.',{high:labels[0],low:labels[1],diff:a-b}),question:fill(less?'그래프에서 {low:을/를} 고른 사람은 {high:을/를} 고른 사람보다 몇 명 더 적을까요?':'그래프에서 {high:을/를} 고른 사람은 {low:을/를} 고른 사람보다 몇 명 더 많을까요?',{high:labels[0],low:labels[1]}),
      ...errors(wrong(a,'많은 항목 그대로 고르기',fill('{fruit:을/를} 고른 사람 수를 그대로 골랐습니다. 많은 {a}명에서 적은 {b}명을 빼면 {difference}명입니다.',{fruit:labels[0],difference:a-b,a,b})),
      wrong(b,'적은 항목 그대로 고르기',fill('{fruit:을/를} 고른 사람 수를 그대로 골랐습니다. 적은 {b}명과 많은 {a}명을 짝지어 남는 수를 세면 {difference}명입니다.',{fruit:labels[1],difference:a-b,a,b})),
      wrong(a-b+direction,'남은 표시 하나 달리 세기',`${fill('{high:과/와} {low}',{high:labels[0],low:labels[1]})}의 동그라미를 하나씩 짝짓고 남은 동그라미를 하나 ${direction>0?'더':'덜'} 세었습니다. 남은 동그라미 하나가 한 명을 나타내므로 차이는 ${a-b}명입니다.`))};},
  answer:({a,b})=>a-b,check:({a,b})=>seq(b,a-1).length,back:'g1s1-addsub',
  art:({a,b,labels})=>({kind:'pictograph',labels,values:[a,b],unit:1,unitLabel:'명'}),
  solution: "그래프에서 {high:을/를} 고른 사람은 {a}명, {low:을/를} 고른 사람은 {b}명입니다.\n{a} − {b} = {answer}입니다.\n따라서 {conclusion}",
});
