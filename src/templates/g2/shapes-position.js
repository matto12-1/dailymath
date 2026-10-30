import { explain } from '../solution-process.js?v=9a67f36b25';
import { define, wrong, errors, panelAnswer, panelCheck, fill } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.shapes.position',unit:'g2s1-shapes',strand:'shape',level:3,label:'쌓기나무 위치',std:['[2수03-02]']},{
  errorCount:3,answerKind:'text',texts:['{ref}번 쌓기나무의 바로 {direction}에 있는 쌓기나무는 몇 번일까요?'],
  draw: explain(function(rng) {
    const direction=rng.pick(['위','아래','왼쪽','오른쪽']),heights=[[rng.int(3,4),rng.int(3,4),rng.int(3,4)]],nums=rng.shuffle([1,2,3,4,5]);
    const vertical=['위','아래'].includes(direction),x=vertical?rng.int(0,2):1,base=[x,0,1];
    const delta={위:[0,0,1],아래:[0,0,-1],왼쪽:[-1,0,0],오른쪽:[1,0,0]}[direction];
    const target=base.map((v,i)=>v+delta[i]),opposite=base.map((v,i)=>v-delta[i]);
    const side=vertical?[(x+1)%3,0,1]:[x,0,2];
    const labels=Object.fromEntries([base,target,opposite,side].map((pos,i)=>[pos.join(','),nums[i]]));
    const empty=heights[0].flatMap((height,column)=>Array.from({length:height},(_,z)=>[column,0,z]))
      .filter(pos=>!labels[pos.join(',')]&&Math.abs(pos[0]-base[0])+Math.abs(pos[2]-base[2])>1);
    const extra=rng.pick(empty);labels[extra.join(',')]=nums[4];
    const panels=[nums[1],nums[2],nums[3],nums[4]].map(number=>({number,right:number===nums[1]}));
    return {ref:nums[0],direction,delta,heights,labels,panels,options:panels.map(p=>p.number+'번'),...errors(
      wrong(nums[2]+'번','반대 방향 고르기',fill('{ref}번의 바로 {opposite}에 있는 쌓기나무를 골랐습니다. {opposite}에 있는 것과 반대로 {ref}번의 {direction} 면에 맞닿은 것은 {target}번입니다.',{direction,ref:nums[0],opposite:{위:'아래',아래:'위',왼쪽:'오른쪽',오른쪽:'왼쪽'}[direction],target:nums[1]})),
      wrong(nums[3]+'번','다른 방향 고르기',fill('{picked}번은 {ref}번의 {side}에 있는 쌓기나무입니다. {picked}번과 달리 {ref}번의 {direction} 면에 맞닿은 쌓기나무는 {target}번입니다.',{ref:nums[0],direction,target:nums[1],picked:nums[3],side:vertical?(side[0]<x?'왼쪽':'오른쪽'):'위'})),
      wrong(nums[4]+'번','바로 맞닿지 않은 자리 고르기',nums[4]+'번은 기준 쌓기나무와 면이 맞닿지 않은 자리입니다. 면이 맞닿은 바로 '+direction+' 쌓기나무는 '+nums[1]+'번입니다.')) };
  }, v => [v.ref+'번 쌓기나무의 바로 '+v.direction+'에 붙어 있는 쌓기나무를 찾습니다.']),answer:panelAnswer,check:({labels,ref,delta})=>{const base=Object.keys(labels).find(k=>labels[k]===ref).split(',').map(Number);return labels[base.map((v,i)=>v+delta[i]).join(',')]+'번';},
  isCorrect:panelCheck,art:({heights,labels})=>({kind:'cubes',heights,labels,front:true}),
  solution: "{process}\n따라서 답은 {answer}입니다.",
});
