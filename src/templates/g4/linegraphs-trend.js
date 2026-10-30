import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {lineArt} from './graph-helpers.js?v=9a67f36b25';
export default define(meta('linegraphs','trend',3,'life',['04-03'],'기온이 많이 또는 조금 오른 때'),{
  answerKind:'text',errorCount:3,choiceOrder:c=>Number(c.match(/^\d+/)[0]),
  texts:['꺾은선그래프에서 기온이 오른 때 가운데 가장 {direction} 오른 때는 언제일까요?'],
  draw(rng){
    const changes=rng.shuffle([rng.int(1,3),rng.int(4,7),-rng.int(2,4),-rng.int(5,8)]),values=[rng.int(20,25)];
    for(const d of changes)values.push(values.at(-1)+d);
    const large=rng.int(0,1)===1,labels=['1일','2일','3일','4일','5일'],options=changes.map((_,i)=>`${i+1}일→${i+2}일`),positive=changes.filter(n=>n>0),target=changes.indexOf((large?Math.max:Math.min)(...positive)),answer=options[target];
    return {changes,values,labels,options,target,large,base:5,step:1,direction:large?'많이':'조금',answerText:`${target+1}일과 ${target+2}일 사이`,...errors(...changes.flatMap((d,i)=>i===target?[]:[wrong(options[i],d<0?'내린 때 고르기':large?'가장 조금 오른 때 고르기':'가장 많이 오른 때 고르기',
      `${options[i]}을 골랐습니다. ${d<0?`이때는 ${-d}°C 내려 오른 때가 아니며, ${answer}에는 ${changes[target]}°C 올랐으므로 답은 ${answer}입니다.`:`이때 오른 ${d}°C보다 ${answer}에 오른 ${changes[target]}°C가 더 ${large?'크므로':'작으므로'} 답은 ${answer}입니다.`}`)])),
      listed:changes.map((n,i)=>`${i+1}일에서 ${i+2}일 사이에는 ${Math.abs(n)}°C ${n>0?'올랐습니다':'내렸습니다'}.`).join(' ')};
  },
  answer:v=>v.options[v.target],check:v=>{const ds=v.values.slice(1).map((n,i)=>n-v.values[i]);return v.options[ds.indexOf((v.large?Math.max:Math.min)(...ds.filter(n=>n>0)))];},
  isCorrect:(v,c)=>{const i=v.options.indexOf(c);return i>=0&&v.changes[i]>0&&v.changes.filter(n=>n>0).every(n=>v.large?v.changes[i]>=n:v.changes[i]<=n);},
  art:lineArt,solution:'{listed}\n따라서 기온이 가장 {direction} 오른 때는 {answerText}입니다.',
});
