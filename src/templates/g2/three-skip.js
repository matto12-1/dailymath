import { define, seq, sum, wrong, errors,until,cycle } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.three.skip","unit":"g2s1-numbers-three-digits","strand":"calc","level":3,"label":"세 자리 뛰어 세기","std":["[2수01-03]"]}, {

  range: { min: 0, max: 999 }, operandRange: { min: 0, max: 999 }, errorCount: 3,
  answerSpan: [...seq(120,990,10),999],
  texts: ['{step}씩 {way}뛰어 세면 다음 수는 무엇일까요?'],
  requiredChoices: v => [v.n + (v.backward?-v.step:v.step) / 10],
  // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
  numberRow: v => ({ items: [v.before, v.n, '?'], arrows: true }),
  draw(rng) {
    const target=cycle(rng,'g2-three-skip-target',[...seq(120,990,10),999]);
    return until(()=>{
      const step=rng.pick([10,100]),direction=rng.pick([-1,1]),delta=direction*step,rank=rng.int(1,3),way=direction<0?'거꾸로 ':'',n=target-delta,before=n-delta;
      const stop=value=>wrong(value,'앞의 수에서 멈추기',value===n?`${n}에서 멈추고 다음 수로 가지 않았습니다. ${n}보다 ${step}만큼 더 ${direction<0?'작은':'큰'} 수는 ${target}입니다.`:`앞의 수인 ${before}에서 멈추었습니다. ${before}에서 두 번 ${way}뛰면 다음 수 ${target}입니다.`);
      const jump=k=>wrong(target+delta*k,'한 차례 이상 더 뛰기',`${step}씩 ${way}${k+1}번 뛰었습니다. ${target+delta*k}에서 더 뛴 ${step*k}만큼 ${direction<0?'더하면':'빼면'} ${target}입니다.`);
      const unitError=wrong(n+delta/10,'뛰는 단위 작게 보기',`${step}씩이 아니라 ${step/10}씩 ${way}뛰었습니다. ${n+delta/10}에서 ${step-step/10}만큼 더 ${way}뛰면 ${target}입니다.`);
      const shortJump=k=>wrong(target-direction*k,'뛰는 수에서 '+k+' 빠뜨리기',`${step}이 아니라 ${step-k}만큼 ${way}뛰었습니다. ${target-direction*k}에서 ${k}만큼 더 ${way}뛰면 ${target}입니다.`);
      const slips=rng.pick([true,false])?[unitError,shortJump(1),shortJump(2)]:[unitError,rank>=2?stop(before):jump(1),rank===3?stop(n):jump(rank===1?2:1)];
      if([before,n,...slips.map(e=>e.value)].some(n=>n<100||n>999))return null;
      return {before,n,step,backward:direction<0,way,action:direction<0?'작은':'큰',...errors(...slips)};
    });
  },
  candidates: v => [...seq(-2,12).map(k=>v.n+k*v.step),v.e1.value,v.e2.value,v.e3.value],
  answer: ({n,step,backward}) => backward?n-step:n+step, check: ({before,n}) => 2*n-before,
  solution: "{n}보다 {step}만큼 더 {action} 수를 찾습니다.\n따라서 다음 수는 {answer}입니다.",
});
