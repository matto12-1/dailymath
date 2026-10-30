import {define,meta,casesSpec,errors,wrong,repeated} from './helpers.js?v=9a67f36b25';
const cases=[];for(let r=1;r<=30;r++)for(const reverse of [false,true])cases.push({r,reverse});
const answer=v=>v.reverse?v.r:2*v.r;
export default define(meta('symmetry','centerdistance',3,'shape',['03-02'],'대응점과 대칭의 중심 사이 거리'),{
 input:'number',answerUnit:'cm',errorCount:2,minMistakes:2,texts:['{question}'],
 ...casesSpec(cases,answer,v=>v.reverse?(v.r+v.r)/2:repeated(v.r,2),(v,rng)=>({...v,question:v.reverse?'점대칭도형에서 두 점은 서로 대응점입니다. 대칭의 중심에서 한 점까지의 거리는 몇 cm일까요?':'점대칭도형에서 두 점은 서로 대응점입니다. 두 점 사이의 거리는 몇 cm일까요?',explanation:v.reverse?'대칭의 중심은 두 대응점을 이은 선분을 똑같이 둘로 나눕니다. 두 점 사이의 거리를 반으로 나누면 '+(2*v.r)+' ÷ 2 = '+v.r+' cm입니다.':'대칭의 중심에서 두 대응점까지의 거리는 같습니다. '+v.r+' + '+v.r+' = '+(2*v.r)+' cm입니다.',...errors(wrong(v.reverse?2*v.r:v.r,v.reverse?'두 점 사이를 반으로 나누지 않기':'중심까지 거리만 답하기',v.reverse?'두 점 사이의 거리 {whole} cm를 그대로 답했습니다. 대칭의 중심이 두 점 사이를 반으로 나누므로 {whole} ÷ 2 = {answer} cm입니다.':'한 점에서 중심까지의 {r} cm만 답했습니다. 반대쪽 거리 {r} cm도 더하면 {r} + {r} = {answer} cm입니다.'),wrong(4*v.r,v.reverse?'두 점 사이 거리를 두 배 하기':'중심에서 두 점까지의 거리를 다시 두 배 하기',v.reverse?'두 점 사이의 거리 {whole} cm를 두 배 하였습니다. 중심에서 한 점까지는 전체의 반이므로 {whole} ÷ 2 = {answer} cm입니다.':'두 점 사이의 거리 {whole} cm를 구한 뒤 다시 두 배 하였습니다. 중심에서 양쪽으로 {r} cm씩이므로 두 점 사이 거리는 {answer} cm입니다.')),whole:2*v.r})),
 art:v=>({kind:'grid',showGrid:false,w:10,h:7,from:[2,3.5],to:[8,3.5],fromNumber:'ㄱ',toName:'ㄴ',symmetryOutline:[[2,3.5],[4,1.5],[8,3.5],[6,5.5]],dot:[5,3.5],dotRadius:6,distances:v.reverse?[{a:[2,3.5],b:[8,3.5],label:2*v.r+' cm',offset:64},{a:[2,3.5],b:[5,3.5],label:'? cm',offset:-64}]:[{a:[2,3.5],b:[5,3.5],label:v.r+' cm',offset:64},{a:[2,3.5],b:[8,3.5],label:'? cm',offset:-64}],wide:true}),
 solution:'{explanation}\n따라서 답은 {answer} cm입니다.',
});
