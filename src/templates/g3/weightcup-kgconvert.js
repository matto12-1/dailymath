import {define,seq,wrong,errors} from './helpers.js?v=9a67f36b25';
import {cycle} from './arithmetic-helpers.js?v=9a67f36b25';
const smalls=[...seq(1,99),...seq(100,999,10)];
const measurements=seq(1,9).flatMap(k=>smalls.map(g=>({k,g})));
// 검수 A2-17: 실수가 하나뿐이던 세 자리 g 문제에 「g만 쓰기」를 더한다. 검수 A2-12: 풀이는 kg을 g으로 바꾼 줄과 더하는 줄로 나눈다.
export default define({id:'g3.weightcup.kgconvert',unit:'g3s2-weight-capacity',strand:'calc',level:2,label:'kg을 g으로 바꾸기',std:['[4수03-21]']},{
  input:'number',answerUnit:'g',range:{min:0,max:9999},answerSpan:measurements.map(v=>v.k*1000+v.g),errorCount:3,back:'g2s2-length',
  texts:['〔{k} kg {g} g = ? g〕빈칸에 알맞은 수는 얼마일까요?'],
  draw(rng){const {k,g}=cycle(rng,'weightcup-kgconvert',measurements),joined=Number(String(k)+String(g)),padded=Number((String(k)+String(g)).padEnd(4,'0'));return {k,g,kg:k*1000,conversion:k===1?`1 kg은 1000 g입니다.`:`1 kg은 1000 g이므로 ${k} kg은 ${k*1000} g입니다.`,...errors(
    g<100?wrong(joined,'빈 자리 0 빠뜨리기',`${k} kg을 g으로 바꾸지 않고 ${k}와 ${g}을 이어 써서 ${joined}이라고 했습니다. 1 kg은 1000 g이므로 ${k*1000} g + ${g} g = ${k*1000+g} g입니다.`):null,
    g<100?wrong(padded,'이어 쓴 뒤 끝에 0 채우기',`${k} 뒤에 ${g}을 붙이고 끝에 0을 채워 ${padded}이라고 했습니다. ${k} kg은 ${k*1000} g이므로 ${k*1000+g} g입니다.`):wrong(g,'g만 쓰기',`${k} kg을 빠뜨리고 ${g} g만 썼습니다. 빠뜨린 ${k*1000} g도 더하면 ${k*1000+g} g입니다.`),
    wrong(k*100+g,'1 kg을 100 g으로 보기',`1 kg을 100 g으로 보아 ${k*100+g}이라고 했습니다. 1 kg은 1000 g이므로 ${k*1000} g에 ${g} g을 더하면 ${k*1000+g} g입니다.`))};},
  answer:v=>v.k*1000+v.g,check:v=>Array(v.k).fill(1000).reduce((a,b)=>a+b,v.g),
  solution:'{conversion}\n{kg} g + {g} g = {answer} g입니다.\n따라서 빈칸에 알맞은 수는 {answer}입니다.',
});
