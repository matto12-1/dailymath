import { define, seq, unique, errors, wrong } from './helpers.js?v=9a67f36b25';
import {cycle} from './arithmetic-helpers.js?v=9a67f36b25';
const cases=[];
for(const d of seq(2,9))for(const q of seq(20,490,10))for(const delta of seq(-d,d)){
  const a=d*q+delta,hundred=Math.round(a/100)*100/d;
  if(a<100||a>999||delta===0||Number.isInteger(hundred)&&hundred!==q)continue;
  cases.push({a,d,q});
}
const answers=unique(cases.map(v=>v.q));
export default define({ id:'g3.div2.estimate', unit:'g3s2-div', strand:'estimate', level:3, label:'나눗셈 몫 어림', std:['[4수01-08]'] }, {
  range:{min:10,max:990}, operandRange:{min:0,max:9999}, errorCount:3, back:'g2s2-times', answerSpan:answers,
  texts:['〔{a} ÷ {d}〕몫은 어느 수에 가장 가까울까요?'],
  // 오답마다 어디서 틀렸는지 말할 수 있다(검수 15번). 전엔 어림 실수가 자주 걸러져 보기 대부분이 말 없는 몇십이었다.
  // 어림 실수를 먼저 쓰고 나머지는 이웃한 몇십이며, 정답을 사이에 둔 같은 거리의 두 보기는 함께 두지 않는다.
  draw(rng){const q=cycle(rng,'div2-estimate',answers),{a,d}=rng.pick(cases.filter(v=>v.q===q));
    const up=Math.ceil(a/100)*100,down=Math.floor(a/10)*10,byValue=new Map();
    const add=e=>{const n=e.value;if(Number.isInteger(n)&&n>=10&&String(n).length===String(q).length&&n<a&&n!==q&&Math.abs(n-a/d)-Math.abs(q-a/d)>=5&&!byValue.has(n))byValue.set(n,e);};
    add(wrong(up/d,'몇백으로 올려 어림하기',`${a}을 ${up}으로 어림하여 ${up/d}을 골랐습니다. ${up}으로 올려 어림한 수보다 ${d*q}이 ${a}에 더 가까우므로 ${d*q} ÷ ${d} = ${q}, 몫은 약 ${q}입니다.`));
    add(wrong(down/d,'몇십으로 버려 어림하기',`${a}을 ${down}으로 어림하여 ${down/d}을 골랐습니다. ${down}으로 버려 어림한 수보다 ${d*q}이 ${a}에 더 가까우므로 ${d*q} ÷ ${d} = ${q}, 몫은 약 ${q}입니다.`));
    add(wrong(Math.floor(a/100)*100/d,'몇백으로 버려 어림하기',`${a}을 ${Math.floor(a/100)*100}으로 어림하여 ${Math.floor(a/100)*100/d}을 골랐습니다. ${Math.floor(a/100)*100}으로 버려 어림한 수보다 ${d*q}이 ${a}에 더 가까우므로 ${d*q} ÷ ${d} = ${q}, 몫은 약 ${q}입니다.`));
    for(const divisor of [d-2,d-1,d+1,d+2].filter(n=>n>=2&&n<=9)){const n=Math.round(a/divisor/10)*10;add(wrong(n,`${divisor}단으로 몫 어림하기`,`${d}단 대신 ${divisor}단으로 어림하여 ${n}을 골랐습니다. ${divisor}단 대신 나누는 수 ${d}단으로 계산하면 ${d} × ${q} = ${d*q}이 ${a}에 가까우므로 몫은 약 ${q}입니다.`));}
    for(const n of [q-10,q+10,q-20,q+20,q-30,q+30])add(wrong(n,'몫을 몇십 어긋나게 어림하기',`${n}을 골랐지만 ${d} × ${n} = ${d*n}은 ${a}와 많이 차이 납니다. ${d*n}보다 ${d*q}이 ${a}에 더 가까우므로 몫은 ${n}이 아니라 약 ${q}입니다.`));
    const values=[...byValue.keys()],groups=new Map(),real=x=>!byValue.get(x).label.startsWith('몫을');
    for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)for(let k=j+1;k<values.length;k++){
      const xs=[values[i],values[j],values[k]],rank=xs.filter(x=>x<q).length;
      if(xs.filter(real).length<2||xs.some(x=>xs.includes(2*q-x)))continue;
      if(!groups.has(rank))groups.set(rank,[]);groups.get(rank).push(xs);
    }
    if(!groups.size)return null;
    const sets=groups.get(rng.pick([...groups.keys()])),best=Math.max(...sets.map(xs=>xs.filter(real).length));
    const chosen=rng.pick(sets.filter(xs=>xs.filter(real).length===best)).map(x=>byValue.get(x));
    return {a,d,q,roundedDividend:d*q,options:[q,...chosen.map(e=>e.value)],...errors(...chosen)};},
  answer:({q})=>q,check:({a,d})=>Math.round(a/d/10)*10,
  isCorrect:(v,c)=>v.options.every(x=>x===c||Math.abs(c-v.a/v.d)<Math.abs(x-v.a/v.d)),
  solution:'{a:은/는} {roundedDividend}에 가깝고 {roundedDividend} ÷ {d} = {q}입니다.\n따라서 몫은 약 {answer:입니다}.',
});
