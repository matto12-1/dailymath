import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

// 검수 A2-18: 「5 t = ? kg」 아홉 문제만 되풀이되던 것을 「4000 kg = ? t」 반대 방향과 섞는다.
export default define({id:'g3.weightcup.ton',unit:'g3s2-weight-capacity',strand:'calc',level:2,label:'t과 kg 바꾸기',std:['[4수03-22]']},{
  input:'number',maxDigits:5,answerUnit:v=>v.back?'t':'kg',range:{min:0,max:9999},answerSpan:[...seq(1,9),...seq(1000,9000,1000)],errorCount:2,
  texts:['{question}'],
  draw(rng){const t=rng.int(1,9),back=rng.int(0,1)===1,kg=1000*t;
    return back?{t,back,kg,question:`〔${kg} kg = ? t〕빈칸에 알맞은 수는 얼마일까요?`,explanation:t===1?'1000 kg은 1 t입니다.':`1000 kg은 1 t입니다. ${kg} kg은 1000 kg이 ${t}개이므로 ${t} t입니다.`,
      ...errors(wrong(kg/100,'1 t을 100 kg으로 보기','1 t을 100 kg으로 보아 {hundred} t이라고 했습니다. {kg} kg은 1000 kg이 {t}개이므로 {t} t입니다.'),wrong(kg/10,'1 t을 10 kg으로 보기','1 t을 10 kg으로 보아 {ten} t이라고 했습니다. 1000 kg을 1 t으로 바꾸면 {kg} kg은 {t} t입니다.')),hundred:kg/100,ten:kg/10}
      :{t,back,kg,question:`〔${t} t = ? kg〕빈칸에 알맞은 수는 얼마일까요?`,explanation:t===1?'1 t은 1000 kg입니다.':`1 t은 1000 kg입니다. ${t} t은 ${kg} kg입니다.`,
      ...errors(wrong(t*100,'1 t을 100 kg으로 보기','1 t을 100 kg으로 보아 {hundred} kg이라고 했습니다. 1 t은 1000 kg이므로 {t} t은 {kg} kg입니다.'),wrong(t*10,'1 t을 10 kg으로 보기','1 t을 10 kg으로 보아 {ten} kg이라고 했습니다. {t} t은 1000 kg이 {t}개이므로 {kg} kg입니다.')),hundred:t*100,ten:t*10};},
  answer:({t,back})=>back?t:1000*t,check:({t,back,kg})=>back?seq(1,kg).filter(n=>n%1000===0).length:Array(t).fill(1000).reduce((a,b)=>a+b,0),
  solution:"{explanation}\n따라서 빈칸에 알맞은 수는 {answer:입니다}.",
});
