import {define,seq,errors,wrong} from './helpers.js?v=9a67f36b25';
import {cycle} from '../g3/arithmetic-helpers.js?v=9a67f36b25';
import {explain,placeSteps} from '../solution-process.js?v=9a67f36b25';
export default define({id:'g2.addsub.subtract',unit:'g2s1-addsub',strand:'calc',level:1,label:'받아내림 없는 두 자리 뺄셈',std:['[2수01-06]']},{
 range:{min:0,max:99},operandRange:{min:0,max:99},errorCount:3,answerSpan:seq(13,86),texts:['〔{a} − {b} = ?〕계산하면 얼마일까요?'],
 draw:explain(function(rng){const answer=cycle(rng,'g2-subtract-answer',seq(13,86)),bs=seq(4,99-answer).filter(b=>answer%10+b%10<10),b=rng.pick(bs),a=answer+b,at=Math.floor(a/10),bt=Math.floor(b/10),ao=a%10,bo=b%10,tens=at-bt,ones=ao-bo;
 const pool=[
 wrong(a+b,'빼야 할 수 더하기',b+'를 빼야 하는데 더했습니다. '+a+'에서 '+b+'를 빼면 '+answer+'입니다.'),
 ...(bt?[wrong(a-bo,'십의 자리 빼기 빠뜨리기',b+'의 일의 자리 '+bo+'만 뺐습니다. 십의 자리 '+bt+'도 빼고 낱개와 모으면 '+answer+'입니다.')]:[]),
 ...(bo?[wrong(a-bt*10,'일의 자리 빼기 빠뜨리기',b+'의 십의 자리만 뺐습니다. 일의 자리 '+bo+'도 빼면 '+answer+'입니다.')]:[]),
 ...(ones<9?[wrong(answer+1,'일의 자리 하나 크게 계산하기',ao+'에서 '+bo+'를 뺀 수를 '+(ones+1)+'로 계산했습니다. 일의 자리는 '+ones+'이고 십의 자리는 '+tens+'이므로 '+answer+'입니다.')]:[]),
 ...(ones>0?[wrong(answer-1,'일의 자리 하나 작게 계산하기',ao+'에서 '+bo+'를 뺀 수를 '+(ones-1)+'로 계산했습니다. '+ao+'에서 '+bo+'를 빼고 십의 자리와 모으면 '+answer+'입니다.')]:[]),
 wrong(answer+10,'십의 자리 하나 크게 계산하기',at+'에서 '+bt+'를 뺀 수를 '+(tens+1)+'로 계산했습니다. 십의 자리는 '+tens+'이고 일의 자리는 '+ones+'이므로 '+answer+'입니다.'),
 wrong(answer-10,'십의 자리 하나 작게 계산하기',at+'에서 '+bt+'를 뺀 수를 '+(tens-1)+'로 계산했습니다. '+at+'에서 '+bt+'를 정확히 빼고 일의 자리와 모으면 '+answer+'입니다.'),
 ].filter((e,i,xs)=>e.value>=10&&e.value<=99&&e.value!==answer&&xs.findIndex(x=>x.value===e.value)===i);
 return {a,b,at,bt,ao,bo,ones,tens,...errors(...rng.shuffle(pool).slice(0,3))};},v=>placeSteps(v.a,v.b,true)),
 candidates:({a})=>seq(10,a-1),answer:({a,b})=>a-b,check:({at,bt,ao,bo})=>(at-bt)*10+ao-bo,solution:'{process}\n따라서 답은 {answer}입니다.',
});
