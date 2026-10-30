import {define,meta,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
const cases=[];for(let M=3;M<=30;M++)for(let missing=Math.ceil(M*.5);missing<=Math.floor(M*1.5);missing++)if(missing!==M&&missing<4*M-2)cases.push({M,missing,k:4});const answer=v=>v.missing;
export default define(meta('average','use',4,'calc',['04-01'],'평균으로 빠진 수 찾기'),{
 input:'number',answerUnit:'번',texts:['줄넘기를 네 번 한 기록과 평균입니다. 네 번째 기록은 몇 번일까요?'],
 // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
 numberRow:v=>({lines:['기록 '+v.values.map(n=>n+'번').join(', ') + ', ?번','평균 '+v.M+'번']}),
 ...casesSpec(cases,answer,v=>v.values?4*v.M-v.values.reduce((s,n)=>s+n,0):v.missing,(v,rng)=>{const known=4*v.M-v.missing,lo=Math.ceil(v.M*.5),hi=Math.floor(v.M*1.5),a=rng.int(Math.max(lo,known-2*hi),Math.min(hi,known-2*lo)),b=rng.int(Math.max(lo,known-a-hi),Math.min(hi,known-a-lo)),values=rng.shuffle([a,b,known-a-b]);return {...v,known,total:4*v.M,values,addition:values.join(' + '),shown:values.join(', '),...errors(wrong(v.M,'평균을 빠진 수로 답하기','평균 {M:을/를} 빠진 기록으로 그대로 썼습니다. 평균으로 전체 합을 구한 뒤 세 기록의 합을 빼면 {total} − {known} = {answer}번입니다.'),wrong(4*v.M,'전체 합만 답하기','평균에 4를 곱한 전체 합 {total}에서 알고 있는 기록을 빼지 않았습니다. 전체 합에서 알려진 기록을 빼면 {total} − {known} = {answer}번입니다.'))};}),
 solution:'평균이 {M}번이고 기록이 4개이므로 네 기록의 합은 {M} × 4 = {total}번입니다.\n알고 있는 세 기록의 합은 {addition} = {known}번입니다.\n전체 합에서 세 기록의 합을 빼면 {total} − {known} = {answer}번입니다.\n따라서 네 번째 기록은 {answer}번입니다.',
});
