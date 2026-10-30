import {define,meta,casesSpec,errors,wrong,fill} from './helpers.js?v=9a67f36b25';
const counts={면:6,모서리:12,꼭짓점:8},visible={면:3,모서리:9,꼭짓점:7};
const cases=Object.keys(counts).flatMap(asked=>['all','visible','hidden'].map(scope=>({asked,scope})));
const answer=v=>v.scope==='all'?counts[v.asked]:v.scope==='visible'?visible[v.asked]:counts[v.asked]-visible[v.asked];
export default define(meta('cuboids','edges',2,'shape',['03-03'],'면과 모서리와 꼭짓점'),{
 input:'number',answerUnit:'개',minMistakes:2,errorCount:3,texts:['{question}'],
 ...casesSpec(cases,answer,v=>v.scope==='all'?({면:2+4,모서리:4+4+4,꼭짓점:4+4})[v.asked]:v.scope==='visible'?({면:1+1+1,모서리:3+3+3,꼭짓점:4+3})[v.asked]:({면:3,모서리:3,꼭짓점:1})[v.asked],(v,rng)=>{
  const total=counts[v.asked],seen=visible[v.asked],hidden=total-seen,otherAsked=v.asked==='모서리'?'꼭짓점':'모서리';
  const basis=v.asked==='면'?'위아래 2개와 옆의 4개 면을 합합니다.':v.asked==='모서리'?'위쪽 4개, 아래쪽 4개, 두 면을 잇는 4개 모서리를 합합니다.':'위쪽 4개와 아래쪽 4개 꼭짓점을 합합니다.';
  const visibleBasis=v.asked==='면'?'겨냥도에서 앞면, 윗면, 옆면의 3개 면이 보입니다.':v.asked==='모서리'?'실선으로 그린 모서리를 세면 위쪽 4개, 아래쪽 2개, 세로 3개입니다.':'점선만 만나는 뒤쪽 꼭짓점 1개를 빼고 셉니다.';
  const process=v.scope==='all'?basis:v.scope==='visible'?visibleBasis:fill('직육면체의 {asked:은/는} 모두 {total}개이고 보이는 것은 {seen}개입니다. {total} − {seen} = {hidden}개입니다.',{...v,total,seen,hidden});
  return {...v,total,visible:seen,hidden,otherAsked,process,
   question:v.scope==='all'?fill('직육면체의 {asked}의 수는 모두 몇 개일까요?',v):fill('직육면체의 겨냥도에서 {scope} {asked:은/는} 몇 개일까요?',{...v,scope:v.scope==='visible'?'보이는':'보이지 않는'}),
   scopeName:v.scope==='all'?'전체':v.scope==='visible'?'보이는':'보이지 않는',a:rng.int(2,12),b:rng.int(2,12),c:rng.int(2,12),...errors(
    wrong(v.scope==='all'?seen:total,v.scope==='all'?'보이는 것만 세기':'숨은 부분과 보이는 부분 모두 세기',v.scope==='all'?'보이는 {asked} {visible}개만 세었습니다. 숨은 {hidden}개도 더하면 전체는 {answer}개입니다.':v.scope==='hidden'?'{asked} 전체 {total}개를 답했습니다. 보이는 수를 빼면 {total} − {visible} = {answer}개입니다.':'{asked} 전체 {total}개를 답했습니다. 겨냥도에서 보이는 부분만 세면 {answer}개입니다.'),
    wrong(v.scope==='visible'?hidden:seen,v.scope==='visible'?'보이지 않는 부분만 세기':'보이는 것만 세기',v.scope==='visible'?'보이지 않는 {asked} {hidden}개를 세었습니다. 전체에서 가려진 수를 빼면 {total} − {hidden} = {answer}개입니다.':v.scope==='hidden'?'{asked} 중 보이는 {visible}개를 답했습니다. 가려진 부분은 전체에서 보이는 수를 빼므로 {answer}개입니다.':'{asked} 중 보이는 {visible}개만 세었습니다. 보이는 수와 숨은 수를 합하면 {answer}개입니다.'),
    wrong(counts[otherAsked],'다른 요소의 수로 답하기','{asked} 대신 {otherAsked}의 전체 수 {value}개를 답했습니다. {scopeName} {asked:을/를} 구하면 {answer}개입니다.'))};
 }),
 art:v=>({kind:'solid',type:'cuboid',edgeLengths:[v.a,v.b,v.c],noLabels:true,wide:true}),solution:'{process}\n따라서 {scopeName} {asked:은/는} {answer}개입니다.',
});
