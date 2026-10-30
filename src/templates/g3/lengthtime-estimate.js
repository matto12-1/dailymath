import { define, seq, errors, wrong, rankedOptions } from './helpers.js?v=9a67f36b25';
export default define({ id:'g3.lengthtime.estimate', unit:'g3s1-length-time', strand:'life', level:3, label:'km 어림하기', std:['[4수03-15]'] }, {
  range:{min:1,max:30}, operandRange:{min:0,max:30}, errorCount:4, back:'g2s2-length', answerSpan:seq(2,8), answerUnit:' km',
  texts:['위 막대의 길이는 1 km입니다. 아래 {object}의 길이는 약 몇 km일까요?'],
  draw(rng){const n=rng.int(2,8),measured=n+rng.pick([-0.15,0.15]),object=rng.pick(['길','산책로','강변길']);
    const half=Math.round(measured/2),double=Math.round(measured*2),errorsBelow=[half,Math.round(measured/3)].filter((x,i,xs)=>x>=1&&x!==n&&xs.indexOf(x)===i);
    const es=[wrong(half,'기준 막대를 두 배로 잡기',`위 막대 두 개를 이은 길이를 1 km로 보아 약 ${half} km라고 했습니다. 위 막대 하나가 1 km이므로 ${object}에 약 ${n}번 들어가면 약 ${n} km입니다.`),wrong(double,'기준 막대를 반 길이로 잡기',`위 막대의 반을 1 km로 보아 약 ${double} km라고 했습니다. 위 막대의 반이 아니라 하나가 1 km이므로 ${object}에 약 ${n}번 들어가면 약 ${n} km입니다.`),wrong(Math.round(measured/3),'기준 막대를 세 배로 잡기',`위 막대 세 개를 이은 길이를 1 km로 보아 약 ${Math.round(measured/3)} km라고 했습니다. 위 막대 세 개가 아니라 하나가 1 km이므로 ${object}에 약 ${n}번 들어가면 약 ${n} km입니다.`)];
    const triple=Math.round(measured*3);es.push(wrong(triple,'기준 막대를 세 도막으로 세기',`위 막대를 똑같이 세 도막으로 나눈 한 도막을 1 km로 보아 약 ${triple} km라고 했습니다. 세 도막을 모두 합친 막대 전체가 1 km이므로 ${object}의 길이는 약 ${n} km입니다.`));
    const high=es[1].value,low=errorsBelow[0],other=errorsBelow[1];
    const options=rankedOptions(rng,n,es.map(e=>e.value).filter(x=>x>=2&&x<=8),seq(2,8),4,2);
    if(!options||es.filter(e=>options.includes(e.value)).length<2)return null;
    return {n,measured,object,options,...errors(...es)};},
  answer:({n})=>n,check:({measured})=>Math.round(measured),
  isCorrect:(v,c)=>v.options.every(x=>x===c||Math.abs(c-v.measured)<Math.abs(x-v.measured)),
  art:({measured,object})=>({kind:'ruler',estimate:measured,reference:1,unitLabel:'km',targetLabel:object,wide:true}),
  solution:'1 km 막대를 {object}에 이어 놓으면 약 {n}번 들어갑니다.\n따라서 아래 {object:은/는} 약 {answer} km입니다.',
});
