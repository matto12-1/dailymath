import { define, seq, sum, item, wrong, errors, cycle } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.patterns.grow',unit:'g2s2-patterns',strand:'shape',level:2,label:'늘어나는 모양',std:['[2수02-01]']},{
  range:{min:4,max:15},operandRange:{min:0,max:24},answerSpan:seq(4,15),errorCount:3,
  texts:['같은 규칙으로 늘어나는 그림입니다. 넷째 모양에는 사각형이 몇 개일까요?'],
  draw(rng){const target=cycle(rng,'b5-growing-count',seq(4,15)),d=rng.int(target<7?1:2,Math.min(4,Math.floor((target-1)/3))),n=target-d,counts=[n-2*d,n-d,n],over=target===10||target!==9&&rng.next()<.7;
    const less=n+d-1===n?n+d-2:n+d-1;
    return {n,d,counts,sequence:counts.join(', '),...errors(
      wrong(n,'직전 개수 그대로 고르기',`셋째 모양의 사각형 수를 그대로 골랐습니다. 셋째 모양의 ${n}개에 ${d}개를 더하면 넷째 모양은 ${target}개입니다.`),
      over?wrong(target+2,'늘어나는 수를 두 개 더 세기',`새로 늘어나는 사각형을 두 개 더 세었습니다. 더 센 사각형 두 개를 제외하고 ${d}개만 늘리면 ${target}개입니다.`):wrong(less,'늘어나는 수를 적게 세기',`새로 늘어나는 사각형을 빠뜨리고 세었습니다. 빠뜨린 사각형까지 넣어 ${d}개를 늘리면 ${target}개입니다.`),
      target===9?wrong(target-3,'늘어나는 수를 세 개 덜 세기',`새로 늘어나는 사각형을 세 개 빠뜨렸습니다. 누락한 세 개까지 살펴 늘어나는 수를 ${d}개로 세면 ${target}개입니다.`):wrong(n+d+1,'늘어나는 수를 하나 더 세기',`새로 늘어나는 사각형을 하나 더 세었습니다. 기존 ${n}개에 새로 생긴 ${d}개를 한 번씩 세면 ${target}개입니다.`))};},
  candidates:v=>seq(Math.max(4,v.n+v.d-3),v.n+v.d+3),
  answer:({n,d})=>n+d,check:({counts})=>sum(counts.at(-1),counts[1]-counts[0]),back:'g1s2-patterns',
  // 세 단계를 옆으로 나란히 놓는다(검수 12번, 세로로 쌓으면 답 칸이 한참 아래였다).
  art:({counts,d})=>({kind:'objects',expand:true,groupsLayout:'columns',growth:{base:counts[0],step:d},groups:counts.map(n=>[item('square',undefined,n)])}),
  solution: "각 모양의 사각형은 {sequence}개로 {d}개씩 늘어납니다.\n{n} + {d} = {answer}입니다.\n따라서 넷째 모양의 사각형은 {answer}개입니다.",
});
