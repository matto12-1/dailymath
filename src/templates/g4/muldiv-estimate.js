import {define,meta,seq,cycle,closest,errors,wrong} from './helpers.js?v=9a67f36b25';
// 보기는 모두 몇십이고 오답마다 어디서 틀렸는지 말할 수 있다(검수 1·15번).
// 전엔 정답만 몇십이고 나머지는 아무 두 자리 수라, 나눗셈 없이 끝이 0인 수를 고르면 맞았다.
// 오답은 나누는 수를 몇십으로 내려(몫이 커짐)·올려(몫이 작아짐) 어림하기를 먼저 쓰고, 나머지는 이웃한 몇십이다.
// 정답을 사이에 둔 같은 거리의 두 보기(정답 −10과 +10)는 함께 두지 않는다. 가운데 수만 골라도 맞기 때문이다.
const tens=n=>Math.round(n/10)*10;
export default define(meta('muldiv','estimate',4,'estimate',['01-08'],'두 자리 수로 나누기 어림'),{
  answerSpan:seq(20,90,10),range:{min:10,max:99},operandRange:{min:0,max:1500},back:'g3s2-div',errorCount:3,
  texts:['〔{a} ÷ {d}〕몫은 어느 수에 가장 가까울까요?'],
  draw(rng){const q=cycle(rng,'muldiv-estimate',seq(20,90,10)),d=rng.int(11,Math.min(40,Math.floor(997/q))),a=q*d+rng.pick([-2,-1,1,2]);
    if(d%10===0)return null;
    const low=Math.floor(d/10)*10,high=low+10,byValue=new Map(),near=`${d} × ${q} = ${q*d}이 ${a}에 가장 가까우므로 몫은 ${q}에 가장 가깝습니다.`;
    const add=e=>{if(e.value>=10&&e.value<=90&&e.value!==q&&!byValue.has(e.value))byValue.set(e.value,e);};
    add(wrong(tens(a/low),'나누는 수를 작게 어림하기',`나누는 수 ${d}을 ${low}로 줄여 어림해서 ${tens(a/low)}을 골랐습니다. ${d}를 ${low}로 줄이면 몫을 크게 어림하게 되지만 ${d} × ${tens(a/low)} = ${d*tens(a/low)}보다 ${d*q}이 ${a}에 더 가까우므로 몫은 약 ${q}입니다.`));
    add(wrong(tens(a/high),'나누는 수를 크게 어림하기',`나누는 수 ${d}을 ${high}로 늘려 어림해서 ${tens(a/high)}을 골랐습니다. ${d} × ${q} = ${d*q}이 ${a}에 더 가까우므로 몫은 약 ${q}입니다.`));
    for(const n of [q-10,q+10,q-20,q+20,q-30,q+30])add(wrong(n,'몫을 몇십 어긋나게 어림하기',`${n}을 골랐지만 ${d} × ${n} = ${d*n}은 ${a}와 차이가 큽니다. ${d*n}보다 ${d*q}이 ${a}에 더 가까우므로 몫은 ${n}이 아니라 약 ${q}입니다.`));
    const values=[...byValue.keys()],groups=new Map(),real=x=>!byValue.get(x).label.startsWith('몫을');
    for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)for(let k=j+1;k<values.length;k++){
      const xs=[values[i],values[j],values[k]],rank=xs.filter(x=>x<q).length;
      if(xs.some(x=>xs.includes(2*q-x)))continue;
      if(!groups.has(rank))groups.set(rank,[]);groups.get(rank).push(xs);
    }
    if(!groups.size)return null;
    const sets=groups.get(rng.pick([...groups.keys()])),best=Math.max(...sets.map(xs=>xs.filter(real).length));
    const chosen=rng.pick(sets.filter(xs=>xs.filter(real).length===best)).map(x=>byValue.get(x));
    return {a,d,q,previous:q-10,next:q+10,previousProduct:d*(q-10),nextProduct:d*(q+10),near:q*d,options:[q,...chosen.map(e=>e.value)],...errors(...chosen)};},
  answer:({q})=>q,check:({a,d})=>Math.round(a/d/10)*10,isCorrect:(v,c)=>closest(v,c,v.a/v.d),
  solution:"{d} × {previous} = {previousProduct}, {d} × {q} = {near}, {d} × {next} = {nextProduct}입니다.\n이웃한 몇십을 곱한 세 수 중 {a}에 가장 가까운 수는 {near}입니다.\n따라서 몫에 가장 가까운 수는 {q:입니다}.",
});
