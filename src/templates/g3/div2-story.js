import {explain,divideLines} from '../solution-process.js?v=9a67f36b25';
import { define, seq, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define({ id:'g3.div2.story', unit:'g3s2-div', strand:'word', level:3, label:'똑같이 나누고 남기기', std:['[4수01-05]','[4수01-06]'] }, {
  input:'number', range:{min:0,max:999}, errorCount:2, answerSpan:seq(2,99), answerUnit:'개',
  texts:['사탕 {a}개를 {d}명에게 똑같이 줍니다. 한 명은 최대 몇 개 받을까요?','{d}명이 사탕 {a}개를 똑같이 나눕니다. 한 명이 받는 사탕은 최대 몇 개일까요?'],
  draw:explain(function(rng){const d=rng.int(2,9),q=rng.int(2,99),r=rng.int(1,d-1),a=d*q+r;if(r===q||r===q+1)return null;return {a,d,q,r,used:d*q,...errors(
    wrong(q+1,'남은 사탕도 한 개씩 주기',`남는 사탕 ${r}개까지 모두에게 나누어 줄 수 있다고 보아 ${q+1}개라고 했습니다. ${a} ÷ ${d} = ${q} ··· ${r}이므로 한 명이 ${q}개씩 받고 ${r}개가 남습니다.`),
    wrong(r,'나머지를 받은 수로 쓰기',`한 명이 받는 사탕 수 대신 나머지 ${r}을 썼습니다. ${d} × ${q} = ${d*q}개를 나누어 주면 ${r}개가 남으므로 한 명이 받는 사탕은 ${q}개입니다.`))};},v=>divideLines(v.a,v.d)),
  answer:({a,d})=>Math.floor(a/d), check:({a,d})=>{let q=0;for(let left=a;left>=d;left-=d)q++;return q;},
  art:()=>({scene:'candy-sharing'}),
  solution:"{process}\n따라서 한 명이 받을 수 있는 사탕은 최대 {answer}개입니다.",
});
