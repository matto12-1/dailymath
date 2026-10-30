import {explain,divideLines} from '../solution-process.js?v=9a67f36b25';
import {define,seq,errors,wrong} from './helpers.js?v=9a67f36b25';
const cases=seq(2,9).flatMap(d=>seq(11,49).map(q=>({a:q*d,d,q}))).filter(v=>v.a<=99);
export default define({id:'g3.div2.exact',unit:'g3s2-div',strand:'calc',level:1,label:'두 자리 나눗셈',std:['[4수01-06]']},{
  input:'number',range:{min:0,max:999},errorCount:2,answerSpan:[...new Set(cases.map(v=>v.q))],
  texts:['〔{a} ÷ {d} = ?〕몫은 얼마일까요?'],
  draw:explain(function(rng){const {a,d,q}=rng.pick(cases),t=Math.floor(q/10),u=q%10;
    return {a,d,q,t,u,...errors(
      u?wrong(t*10,'일의 자리 몫 빠뜨리기',`십의 자리 몫만 써서 ${t*10}이라고 했습니다. 일의 자리에서 ${u*d} ÷ ${d} = ${u}도 계산하면 몫은 ${q}입니다.`):wrong(t,'몫의 끝 0 빠뜨리기',`몫의 일의 자리 0을 빠뜨려 ${t}을 썼습니다. 일의 자리에서 더 나눌 수 없으므로 몫의 일의 자리에 0을 쓰면 ${q}입니다.`),
      wrong(u,'십의 자리 몫 빠뜨리기',`일의 자리 몫 ${u}만 썼습니다. 십의 자리에서 구한 몫 ${t}도 제자리에 쓰면 몫은 ${q}입니다.`))};},v=>divideLines(v.a,v.d)),
  answer:({a,d})=>a/d,check:({a,d})=>{let q=0;for(let left=a;left>=d;left-=d)q++;return q;},
  solution:'{process}\n따라서 몫은 {q:입니다}.',
});
