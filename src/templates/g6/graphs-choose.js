import {define,meta,errors,wrong,tableArt,fill} from './helpers.js?v=9a67f36b25';
import {cycle} from '../g3/arithmetic-helpers.js?v=9a67f36b25';
import {surveys} from './graph-helpers.js?v=9a67f36b25';
const types=['꺾은선그래프','막대그래프','원그래프'],options=[...types,'그림그래프'],key={};
const icons={꺾은선그래프:'graph-line',막대그래프:'graph-bar',원그래프:'graph-pie',그림그래프:'graph-picture'};
const uses={
 꺾은선그래프:'시간에 따른 수량의 변화를 나타내는',
 막대그래프:'항목별 수량의 많고 적음을 나타내는',
 원그래프:'전체에서 각 항목이 차지하는 정도를 나타내는',
 그림그래프:'같은 그림 하나가 나타내는 수를 정하여 수량을 나타내는',
};
export default define(meta('graphs','choose',3,'life',['04-03'],'목적에 맞는 그래프'),{
 answerKind:'text',answerValues:types,errorCount:3,texts:['{question}'],
 draw(rng){
  const type=cycle(rng,key,[0,1,2]),answer=types[type],count=rng.int(3,5),variant=rng.int(0,2);
  let rows,subject,goals;
  if(type===0){
   const data=rng.pick([['월','도서관 방문자 수(명)'],['요일','급식 이용자 수(명)'],['연도','마을 쓰레기양(kg)'],['월','운동장 이용자 수(명)']]);
   rows=[['기간',data[1]],...Array.from({length:count},(_,i)=>[data[0]==='요일'?['월','화','수','목','금'][i]+'요일':(data[0]==='연도'?2020+i:i+1)+data[0],rng.int(15,90)])];
   subject=data[1].replace(/\([^)]*\)/g,'');
   goals=['시간이 지남에 따라 어떻게 변하는지 알아보려면','시간에 따라 늘고 줄어드는 모습을 살펴보려면','시간의 순서대로 어떻게 달라지는지 알아보려면'];
  }else{
   const survey=rng.pick(surveys);
   rows=[['항목','학생 수(명)'],...survey.labels.map(label=>[label,rng.int(15,90)])];
   subject=survey.title;
   goals=type===1?['같은 눈금을 기준으로 항목별 수의 차이를 나란히 알아보려면','항목별 수의 많고 적음을 같은 눈금에서 살펴보려면','각 항목의 크기를 같은 눈금에서 나란히 살펴보려면']:
    ['합계에서 각 항목이 차지하는 부분을 살펴보려면','합계를 100으로 보고 각 항목이 얼마나 차지하는지 알아보려면','전체에서 각 항목이 차지하는 정도를 알아보려면'];
  }
  const question='표의 '+subject+'에서 '+goals[variant]+' 어떤 그래프로 나타내는 것이 가장 알맞을까요?';
  const reason=type===0?'시간에 따른 수량의 흐름을 알아보는 목적':type===1?'같은 눈금에서 항목별 크기의 차이를 나란히 살펴보는 목적':'전체에서 각 항목이 차지하는 정도를 알아보는 목적';
  return {type,rows,question,description:fill('{answer:은/는} {use} 그래프입니다.',{answer,use:uses[answer]}),options,
   ...errors(...options.filter(name=>name!==answer).map(name=>wrong(name,name+'의 쓰임 혼동',
    fill('{name:을/를} 골랐습니다. {name:은/는} {use} 그래프이므로, {reason}에는 {answer:이/가} 알맞습니다.',{name,use:uses[name],reason,answer}))))};
 },
 answer:v=>types[v.type],check:v=>types.at(v.type),isCorrect:(v,c)=>c===types[v.type],
 choiceLook:c=>({icon:icons[c],text:c.replace('그래프','\u200b그래프')}),
 guessHints:[({choices})=>({'short-name':choices.map(s=>-s.length),'long-name':choices.map(s=>s.length)})],
 art:v=>({...tableArt(v.rows),columnWidths:[135,200]}),solution:'{description}\n따라서 가장 알맞은 그래프는 {answer:입니다}.',
});
