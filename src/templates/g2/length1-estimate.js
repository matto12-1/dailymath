import { explain, j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.length1.estimate',unit:'g2s1-length',strand:'life',level:3,label:'cm 어림하기',std:['[2수03-12]']},{
  range:{min:1,max:40},operandRange:{min:0,max:40},differentDigits:true,separation:0.2,edgeWeight:3,errorCount:3,
  choiceRiskCaps:[.5,.5,1],answerSpan:seq(1,12),candidates:({n})=>seq(Math.max(1,n-10),Math.min(12,n+10)),
  texts:['위 막대의 길이는 {reference} cm입니다. 아래 {object}의 길이는 약 몇 cm일까요?'],
  draw: explain(function(rng) {const n=rng.pick(seq(1,12)),reference=n===1?2:1,object=rng.pick(['연필','크레파스','끈']),measured=n+rng.pick([-0.2,-0.1,0.1,0.2]);
    const pool=[
      wrong(reference,'위 막대 길이만 답하기',`위 막대의 길이를 골랐습니다. 위 막대 대신 아래 ${object}를 기준 길이와 비교하면 약 ${n} cm입니다.`),
      wrong(Math.ceil(n/2),'절반만 보고 어림하기',`아래 ${object}의 절반쯤만 보고 길이를 골랐습니다. 아래 ${object} 전체의 길이는 약 ${n} cm입니다.`),
      wrong(n+reference,'두 길이를 합해서 답하기',`위 막대와 아래 ${object}의 길이를 더했습니다. 기준 막대의 길이는 합하지 않고 아래 ${object}만 재면 약 ${n} cm입니다.`),
      wrong(n*2,'위 막대의 단위를 두 배로 읽기',`위 막대의 ${reference} cm를 ${reference*2} cm로 보고 길이를 어림했습니다. 위 막대의 길이를 기준으로 어림하면 아래 ${object}의 길이는 약 ${n} cm입니다.`),
    ].filter((e,i,xs)=>e.value!==n&&xs.findIndex(x=>x.value===e.value)===i);
    return {n,reference,object,measured,...errors(...rng.shuffle(pool).slice(0,3))};
  }, v => [v.reference===2?'위 막대는 2 cm이므로 그 절반은 1 cm입니다.':'위 막대의 길이가 1 cm의 기준입니다.', '아래 '+j(v.object,'은/는')+' '+(v.n===1?'1 cm보다':'1 cm를 '+v.n+'번 이은 길이보다')+' 조금 ' + (v.measured<v.n?'짧습니다.':'깁니다.')]),
  answer:({n})=>n,check:({measured})=>Math.round(measured),
  art:({measured,reference,object})=>({kind:'ruler',estimate:measured,reference,unitLabel:'cm',targetLabel:object}),
  solution: "{process}\n따라서 약 {answer} cm입니다.",
});
