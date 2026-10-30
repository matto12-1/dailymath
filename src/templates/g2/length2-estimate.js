import { explain, j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.length2.estimate',unit:'g2s2-length',strand:'life',level:2,label:'m 어림하기',std:['[2수03-12]']},{
  range:{min:1,max:40},operandRange:{min:0,max:40},differentDigits:true,separation:0.2,edgeWeight:4,errorCount:3,
  answerSpan:seq(2,9),candidates:seq(2,9),
  texts:['위 막대의 길이는 {reference} m입니다. 아래 {measure}는 약 몇 m일까요?'],
  draw: explain(function(rng) {const n=rng.pick(seq(2,9)),reference=1,object=rng.pick(['끈','줄','천막']),measured=n+rng.pick([-0.2,-0.1,0.1,0.2]),measure=object==='천막'?'천막의 너비':object+'의 길이';
    const pool=[
      wrong(n-2,'기준 길이 두 번 빠뜨리기',`기준 막대를 두 번 덜 세었습니다. 빠뜨린 두 번까지 길이를 재면 약 ${n} m입니다.`),
      // 위 막대 길이(늘 1)를 고르는 실수 대신 한 번 덜 세는 실수를 쓴다. 1이 63%로 붙박이 오답이라 지우고 찍었다(검수 2번).
      wrong(n-1,'한 번 덜 세기',`위 막대 ${reference} m를 한 번 덜 세었습니다. 아래 ${object}의 끝까지 1 m가 약 ${n}번 들어가므로 약 ${n} m입니다.`),
      wrong(Math.ceil(n/2),'절반만 보고 어림하기',`아래 ${object}의 절반쯤만 보고 길이를 골랐습니다. 아래 ${measure} 전체는 약 ${n} m입니다.`),
      wrong(n+reference,'두 길이를 합해서 답하기',`위 막대와 아래 ${measure}를 더했습니다. 아래 ${measure}는 약 ${n} m입니다.`),
      wrong(n*2,'위 막대의 단위를 두 배로 읽기',`위 막대의 ${reference} m를 ${reference*2} m로 보고 길이를 어림했습니다. 위 막대의 길이를 기준으로 어림하면 아래 ${measure}는 약 ${n} m입니다.`),
    ].filter((e,i,xs)=>e.value!==n&&xs.findIndex(x=>x.value===e.value)===i);
    return {n,reference,object,measure,measured,...errors(...rng.shuffle(pool).slice(0,3))};
  }, v => ['위 막대 1개의 길이를 1 m의 기준으로 삼습니다.', '아래 ' + j(v.measure,'은/는') + ' 그 막대 ' + v.n + '개를 이은 길이보다 조금 ' + (v.measured<v.n?'짧습니다.':'깁니다.')]),
  answer:({n})=>n,check:({measured})=>Math.round(measured),
  art:({measured,reference,object})=>({kind:'ruler',estimate:measured,reference,unitLabel:'m',targetLabel:object}),
  solution: "{process}\n따라서 약 {answer} m입니다.",
});
