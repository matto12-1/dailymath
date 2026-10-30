import { until } from '../../engine/retry.js?v=9a67f36b25';
import { ordinal } from '../solution-process.js?v=9a67f36b25';
import { SOLID,arrangeChoices } from './helpers.js?v=9a67f36b25';
// 1단원에서는 아직 「상자 모양」「둥근기둥 모양」 같은 모양 이름을 배우지 않았다(2단원 여러 가지 모양). 아이가 늘 쓰는 말로 묻고, 둥근기둥은 줄 채우기에만 쓴다.
const EVERYDAY={box:'상자',ball:'공'};
export default {
 id:'g1.nine.ordinal',grade:1,unit:'g1s1-numbers-nine',strand:'shape',level:3,std:['[2수01-01]'],label:'몇째인지 알아보기',
 input:'choice',answerKind:'text',maxDigits:1,texts:['{targetName:은/는} {side}부터 몇째일까요?'],
 make(rng){return until(()=>{const length=rng.int(5,8),index=rng.int(0,length-1),target=rng.pick(['box','ball']),others=SOLID.filter(s=>s!==target),fromLeft=rng.pick([true,false]);
 const rank=fromLeft?index+1:length-index,reverse=length+1-rank;
 const wrongs=[...new Set([reverse,rank-1,rank+1])].filter(n=>n>=1&&n<=length&&n!==rank);
 const items=Array.from({length},(_,i)=>({shape:i===index?target:rng.pick(others),n:1,hue:'sage'}));
 return {items,index,length,rank,targetName:EVERYDAY[target],side:fromLeft?'왼쪽':'오른쪽',count:Array.from({length:rank},(_,i)=>ordinal(i+1)).join(', '),
 options:arrangeChoices(rng,rank,wrongs,[Array.from({length},(_,i)=>i+1).filter(n=>n!==rank)]).map(ordinal),wrong1:reverse===rank?null:ordinal(reverse),wrong2:rank>1?ordinal(rank-1):null,wrong3:rank<length?ordinal(rank+1):null};});},
 answer:({rank})=>ordinal(rank),check:({items,index,side})=>ordinal(side==='왼쪽'?index+1:items.length-index),
 choices:({options})=>options,choiceOrder:c=>Array.from({length:9},(_,i)=>ordinal(i+1)).indexOf(c),
 isCorrect:(v,c)=>c===ordinal(v.rank),
 mistakes:[
 {id:'reverse',label:'반대쪽부터 세기',value:v=>v.wrong1,say:'반대쪽부터 세어 {value:을/를} 골랐습니다. {side}부터 차례로 세면 {targetName:은/는} {answer}입니다.'},
 {id:'skip-first',label:'맨 처음 물건 빠뜨리기',value:v=>v.wrong2,say:'맨 처음 물건을 빼고 세어 {value:을/를} 골랐습니다. 맨 처음을 첫째로 넣어 세면 {answer}입니다.'},
 {id:'repeat-first',label:'맨 처음 물건 두 번 세기',value:v=>v.wrong3,say:'맨 처음 물건을 두 번 세어 {value:을/를} 골랐습니다. 물건마다 한 번씩 차례를 붙이면 {answer}입니다.'},
 ],art:({items})=>({kind:'objects',items,columns:items.length}),
 solution:'{side} 맨 처음 물건부터 {count} 하고 차례로 셉니다.\n따라서 {targetName:은/는} {answer}입니다.',
};
