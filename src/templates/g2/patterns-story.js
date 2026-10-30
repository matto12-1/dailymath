import { define, seq, sum, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.patterns.story',unit:'g2s2-patterns',strand:'word',level:3,label:'늘어나는 의자',std:['[2수02-01]']},{
  range:{min:0,max:81},operandRange:{min:0,max:81},answerSpan:seq(7,81),errorCount:3,differentDigits:true,
  texts:['의자가 {first}개, {second}개, {n}개로 늘어납니다. 같은 규칙으로 늘어나면 다음에는 의자가 모두 몇 개일까요?'],
  draw(rng){const target=rng.int(7,81),d=rng.int(2,Math.min(9,Math.floor((target-1)/3))),n=target-d,over=rng.pick([true,false]);
    return {n,d,first:n-2*d,second:n-d,...errors(
      wrong(n+1,'1씩 늘리기',`${d}개씩 늘려야 하는데 1개만 늘렸습니다. ${n}개에 ${d}개를 더하면 ${n+d}개입니다.`),
      wrong(n+2*d,'두 번 늘리기',`${d}개를 두 번 더했습니다. 한 번에 ${d}개만 늘리면 ${n+d}개입니다.`),
      wrong(n+d+(over?1:-1),over?'하나 더 늘리기':'하나 덜 늘리기',`${d}개씩이 아니라 ${d+(over?1:-1)}개씩 늘렸습니다. ${n}개에서 ${d}개씩 늘리면 ${n+d}개입니다.`))};},
  candidates:v=>[...seq(v.n+1,Math.min(81,v.n+2*v.d+2)),v.e1.value,v.e2.value,v.e3.value],
  answer:({n,d})=>n+d,check:({n,first,second})=>sum(n,second-first),back:'g1s2-patterns',
  art:()=>({scene:'classroom-chairs'}),solution: "의자가 {first}개, {second}개, {n}개로 {d}개씩 늘어납니다.\n{n} + {d} = {answer}입니다.\n따라서 다음에는 의자가 모두 {answer}개입니다.",
});
