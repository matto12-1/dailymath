import {explain,divideLines} from '../solution-process.js?v=9a67f36b25';
import { define, pair, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define({ id:'g3.div2.remainder', unit:'g3s2-div', strand:'calc', level:2, label:'몫과 나머지', std:['[4수01-06]'] }, {
  input:'number', answerKind:'pair', parts:[{before:'몫 '},{before:'나머지 '}], range:{min:0,max:999}, errorCount:2, back:'g2s2-times',
  texts:['〔{a} ÷ {d}〕몫과 나머지는 얼마일까요?'],
  // 검수 A2-28: 있을 법하지 않은 「몫에 나머지 더하기(11|0)」 대신 가장 흔한 「몫을 하나 덜 구하기(8|8)」를 둔다.
  draw:explain(function(rng){const a=rng.int(10,99),d=rng.int(2,9),q=Math.floor(a/d),r=a%d;if(!r)return null;return {a,d,q,r,used:q*d,...errors(
    q>1?wrong(pair(q-1,r+d),'몫을 하나 덜 구하기',`몫을 ${q-1}, 나머지를 ${r+d}로 썼습니다. ${r+d}에서 ${d}를 한 번 더 빼면 몫은 ${q}, 나머지는 ${r}입니다.`):null,
    wrong(pair(q,0),'나머지 빼먹기',`몫 ${q}만 쓰고 나머지를 0으로 썼습니다. ${d} × ${q} = ${q*d}이고 ${a} − ${q*d} = ${r}이므로 몫은 ${q}, 나머지는 ${r}입니다.`))};},v=>divideLines(v.a,v.d)),
  answer:({a,d})=>pair(Math.floor(a/d),a%d), check:({a,d})=>{let q=0,r=a;for(;r>=d;r-=d)q++;return pair(q,r);},
  solution:"{process}\n따라서 몫은 {q}, 나머지는 {r}입니다.",
});
