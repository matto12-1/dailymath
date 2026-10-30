import { define, seq, sum, wrong, errors,until } from './helpers.js?v=9a67f36b25';

// 전엔 정답이 늘 몇백(…00)이라 끝이 0인 보기만 고르면 맞았다(검수 1번).
// 이제 받아올림이 있는 뛰어 세기(3499 → 3500)와 없는 것을 반씩 내고, 받아올림이 있으면 받아올림을 빠뜨린 수(정답만큼 끝이 0인 수)를 오답에 넣는다.
const zeros = n => String(n).match(/0*$/)[0].length;
export default define({"id":"g2.four.skip","unit":"g2s2-numbers-four-digits","strand":"calc","level":3,"label":"네 자리 뛰어 세기","std":["[2수01-03]"]}, {

  range: { min: 0, max: 9999 }, operandRange: { min: 0, max: 9999 }, errorCount: 3,
  texts: ['{step}씩 {way}뛰어 세면 다음 수는 무엇일까요?'],
  requiredChoices: v => v.step >= 10 ? [v.n + (v.backward?-v.step:v.step) / 10] : [],
  // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
  numberRow: v => ({ items: [v.before, v.n, '?'], arrows: true }),
  draw(rng) {
    const step=rng.pick([1,10,100,1000]),direction=rng.pick([-1,1]),delta=direction*step,way=direction<0?'거꾸로 ':'',carry=direction>0&&step<1000&&rng.pick([true,false]), unit=step*10;
    const rank=rng.int(1,3);
    return until(()=>{
    const target=carry ? unit*rng.int(Math.ceil(1001/unit),Math.floor(9999/unit)) : step===1000 ? rng.int(3000,9999) : step*rng.int(Math.ceil(1000/step),Math.floor(9999/step));
    if(!carry&&step<1000&&target%unit===0) return null;
    const n=target-delta, before=n-delta, z=zeros(target);
    const stop=value=>wrong(value,'앞의 수에서 멈추기',value===n?`${n}에서 멈추고 다음 수로 가지 않았습니다. ${n}보다 ${step}만큼 더 ${direction<0?'작은':'큰'} 수는 ${target}입니다.`:`앞의 수인 ${before}에서 멈추었습니다. ${before}에서 두 번 ${way}뛰면 다음 수 ${target}입니다.`);
    const jump=k=>wrong(target+delta*k,'한 차례 이상 건너뛰기',`${step}씩 ${way}${k+1}번 뛰었습니다. ${target+delta*k}에서 더 뛴 ${step*k}만큼 ${direction<0?'더하면':'빼면'} ${target}입니다.`);
    const back=wrong(n-delta,'반대 방향으로 뛰기',`${n}에서 ${step}씩 ${direction<0?'커지는':'작아지는'} 쪽으로 한 번 뛰었습니다. 방향을 바꾸어 ${n}보다 ${step}만큼 더 ${direction<0?'작은':'큰'} 수를 찾으면 ${target}입니다.`);
    let slips=carry ? [wrong(target-10**z,'받아올림 빠뜨리기',`받아올림을 빠뜨렸습니다. ${n}에서 ${step}만큼 뛰면 ${['','십','백','천'][z]}의 자리 숫자가 1 커지므로 ${target}입니다.`),...rng.pick([[stop(n),jump(1)],[stop(before),stop(n)],[stop(n),jump(2)]])]
      : rng.pick([true,false]) ? [stop(n),jump(1),jump(2)] : [stop(before),stop(n),back];
    if(step>=10)slips=[wrong(n+delta/10,'뛰는 단위 작게 보기',`${step}씩이 아니라 ${step/10}씩 ${way}뛰었습니다. ${n+delta/10}에서 ${step-step/10}만큼 더 ${way}뛰면 ${target}입니다.`),rank>=2?stop(before):jump(1),rank===3?stop(n):jump(rank===1?2:1)];
    // 받아올림으로 끝의 0이 늘어나는 문제는 같은 만큼 0이 붙은 오답도 둔다. 「0이 많은 수」만 골라도 맞지 않게 한다.
    if(step>=10&&carry){
      const slipped=k=>wrong(target+k*10**z,k>0?'받아올림 더 하기':k===-1?'받아올림 빠뜨리기':'받아올림을 거꾸로 하기',k>0?`받아올림한 1을 ${k===1?'두 번':'세 번'} 더했습니다. ${target+k*10**z}에서 잘못 더한 ${k*10**z}만큼 빼면 ${target}입니다.`:k===-1?`받아올림한 1을 더하지 않았습니다. ${target-10**z}에 빠뜨린 ${10**z}을 더하면 ${target}입니다.`:`받아올림한 1을 더해야 하는데 뺐습니다. ${target-2*10**z}에 ${2*10**z}을 더하면 ${target}입니다.`);
      slips=[slips[0],slipped(rank>=2?-1:1),slipped(rank===3?-2:rank===1?2:1)];
    }
    if([before,n,...slips.map(e=>e.value)].some(n=>n<1000||n>9999)) return null;
    return {before,n,step,backward:direction<0,way,action:direction<0?'작은':'큰',...errors(...slips)};
    });
  },
  candidates: v => [...seq(-2,12).map(k=>v.n+k*v.step),v.e1.value,v.e2.value,v.e3.value],
  answer: ({n,step,backward}) => backward?n-step:n+step, check: ({before,n}) => 2*n-before,
  solution: "{n}보다 {step}만큼 더 {action} 수를 찾습니다.\n따라서 다음 수는 {answer}입니다.",
});
