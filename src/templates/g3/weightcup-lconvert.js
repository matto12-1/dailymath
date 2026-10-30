import {define,seq,wrong,errors} from './helpers.js?v=9a67f36b25';
import {cycle} from './arithmetic-helpers.js?v=9a67f36b25';
const smalls=[...seq(1,99),...seq(100,999,10)];
const measurements=seq(1,9).flatMap(L=>smalls.map(m=>({L,m})));
// 검수 A2-17: 실수가 하나뿐이던 세 자리 mL 문제에 「mL만 쓰기」를 더한다. 검수 A2-12: 풀이는 L를 mL로 바꾼 줄과 더하는 줄로 나눈다.
export default define({id:'g3.weightcup.lconvert',unit:'g3s2-weight-capacity',strand:'calc',level:2,label:'L를 mL로 바꾸기',std:['[4수03-18]']},{
  input:'number',answerUnit:'mL',range:{min:0,max:9999},answerSpan:measurements.map(v=>v.L*1000+v.m),errorCount:3,back:'g2s2-length',
  texts:['〔{L} L {m} mL = ? mL〕빈칸에 알맞은 수는 얼마일까요?'],
  draw(rng){const {L,m}=cycle(rng,'weightcup-lconvert',measurements),joined=Number(String(L)+String(m)),padded=Number((String(L)+String(m)).padEnd(4,'0'));return {L,m,mL:L*1000,conversion:L===1?`1 L는 1000 mL입니다.`:`1 L는 1000 mL이므로 ${L} L는 ${L*1000} mL입니다.`,...errors(
    m<100?wrong(joined,'빈 자리 0 빠뜨리기',`${L} L를 mL로 바꾸지 않고 ${L}와 ${m}을 이어 써서 ${joined}이라고 했습니다. 1 L는 1000 mL이므로 ${L*1000} mL + ${m} mL = ${L*1000+m} mL입니다.`):null,
    m<100?wrong(padded,'이어 쓴 뒤 끝에 0 채우기',`${L} 뒤에 ${m}을 붙이고 끝에 0을 채워 ${padded}이라고 했습니다. ${L} L는 ${L*1000} mL이므로 ${L*1000+m} mL입니다.`):wrong(m,'mL만 쓰기',`${L} L를 빠뜨리고 ${m} mL만 썼습니다. 빠뜨린 ${L*1000} mL도 더하면 ${L*1000+m} mL입니다.`),
    wrong(L*100+m,'1 L를 100 mL로 보기',`1 L를 100 mL로 보아 ${L*100+m}이라고 했습니다. 1 L는 1000 mL이므로 ${L*1000} mL에 ${m} mL를 더하면 ${L*1000+m} mL입니다.`))};},
  answer:v=>v.L*1000+v.m,check:v=>Array(v.L).fill(1000).reduce((a,b)=>a+b,v.m),
  solution:'{conversion}\n{mL} mL + {m} mL = {answer} mL입니다.\n따라서 빈칸에 알맞은 수는 {answer}입니다.',
});
