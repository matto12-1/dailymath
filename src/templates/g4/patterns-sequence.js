import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
const answers=seq(7,1000);
export default define(meta('patterns','sequence',1,'calc',['02-01'],'늘어나는 수의 규칙'),{
  input:'number',answerSpan:answers,texts:["규칙에 따라 수를 늘어놓았습니다. 다음에 올 수는 얼마일까요?","규칙에 따라 수를 늘어놓았습니다. 다음에 올 수는 얼마일까요?"],
  // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
  numberRow:v=>({items:[v.a,v.second,v.third,'?'],arrows:true}),
  draw(rng){const answer=cycle(rng,'patterns-sequence',answers),d=rng.int(2,Math.floor((answer-1)/3)),a=answer-3*d;const second=a+d,third=a+2*d,wrongDiff=Number(String(second).padStart(4,'0').split('').map((n,i)=>Math.abs(+n-+String(a).padStart(4,'0')[i])).join(''));return {a,d,second,third,wrongDiff,...errors(wrong(third+2*d,'첫째와 셋째 수의 차 더하기',`첫째 수와 셋째 수의 차 ${2*d}을 더해 ${third+2*d}을 썼습니다. 수는 ${d}씩 커지므로 ${third} + ${d} = ${third+d}입니다.`),wrongDiff===d?wrong(third,'마지막 수 그대로 쓰기',`마지막 수 ${third}을 그대로 썼습니다. 수가 ${d}씩 커지므로 ${third}에 ${d}을 더하면 ${third+d}입니다.`):wrong(third+wrongDiff,'차를 자리마다 큰 숫자에서 작은 숫자로 빼기',`자리마다 큰 숫자에서 작은 숫자를 빼서 차를 ${wrongDiff}으로 보고 ${third+wrongDiff}을 썼습니다. 이웃한 두 수의 차는 ${second} − ${a} = ${d}이므로 다음 수는 ${third+d}입니다.`)),double:2*d};},
  answer:({a,d})=>a+3*d,check:({a,d})=>a+d+d+d,
  solution: "{a}, {second}, {third:으로/로} {d}씩 커집니다.\n{third} + {d} = {answer}입니다.\n따라서 다음에 올 수는 {answer}입니다.",
});
