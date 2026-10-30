import {wrong,errors,names} from './helpers.js?v=9a67f36b25';
export const validNet=p=>p.type==='prism'?Math.abs(p.side-p.stripSide)<1e-8:Math.abs(p.rectWidth-p.diameter*3.14)<1e-8;
export function netVars(rng,type){
 const n=type==='prism'?rng.int(3,6):3,height=rng.int(3,8);
 const offsets=rng.shuffle([-3,-2,-1,1,2,3]),answerIndex=rng.int(0,3),diameter=rng.int(3,10);
 const widths=rng.shuffle([{value:diameter*3.14},{value:diameter,label:'diameter',say:`옆면의 가로를 밑면 지름 ${diameter} cm로 했습니다. 옆면의 가로는 원주입니다.`},{value:diameter*1.57,label:'radius',say:`반지름 ${diameter/2} cm에 3.14를 곱했습니다. 지름에 곱해야 합니다.`},{value:diameter*6.28,label:'double',say:`지름 ${diameter} cm를 반지름으로 보고 ${diameter} × 2 × 3.14를 계산했습니다. 원주는 지름 × 원주율로 구합니다.`}]);
 const panels=Array.from({length:4},(_,i)=>{
   const side=rng.int(4,10),w=widths[i];
   return {type,n,...(type==='prism'?{side,stripSide:side+(i===answerIndex?0:offsets[i])}:{diameter,rectWidth:Math.round(w.value*100)/100,errorLabel:w.label,errorSay:w.say}),height,number:i+1,topIndex:rng.int(0,n-1),bottomIndex:rng.int(0,n-1)};
 });
 // Rounding changes no correct circumference (integer diameter times 3.14).
 const bad=panels.filter(p=>!validNet(p)),good=panels.find(validNet),answer=good.number+'번';
 return {n,name:names[n]+'기둥',panels,options:panels.map(p=>p.number+'번'),...errors(...bad.slice(0,3).map((p,i)=>wrong(p.number+'번',type==='prism'?(i?'붙는 변의 길이 혼동':'밑면과 옆면의 길이 혼동'):({diameter:'지름 그대로 쓰기',radius:'반지름에 원주율 곱하기',double:'지름을 반지름으로 쓰기'})[p.errorLabel],type==='prism'?`${p.number}번은 맞닿는 밑면의 변 ${p.side} cm와 옆면의 변 ${p.stripSide} cm의 길이가 다릅니다. ${p.number}번과 달리 두 변이 모두 ${good.side} cm로 같은 전개도는 ${answer}입니다.`:
 p.errorLabel==='diameter'?`${p.number}번은 옆면의 가로를 지름 ${diameter} cm로 했습니다. 지름에 3.14를 곱한 ${Math.round(diameter*314)/100} cm가 옆면의 가로인 것은 ${answer}입니다.`:
 p.errorLabel==='radius'?`${p.number}번은 반지름 ${diameter/2} cm에 3.14를 곱했습니다. 반지름 대신 지름 ${diameter} cm에 3.14를 곱하면 ${Math.round(diameter*314)/100} cm이므로 ${answer}입니다.`:
 `${p.number}번은 지름을 두 배 하여 원주율을 곱했습니다. 이미 지름인 ${diameter} cm를 두 배 하지 않고 3.14를 곱한 길이는 ${Math.round(diameter*314)/100} cm이므로 ${answer}입니다.`)))};
}
export const netHints=({choices,art})=>{
 const ps=choices.map(c=>art.panels.find(p=>p.number+'번'===c));
 return {'top-position':ps.map(p=>p.topIndex),'bottom-position':ps.map(p=>p.bottomIndex),'base-size':ps.map(p=>p.side??p.diameter),'strip-size':ps.map(p=>p.stripSide??p.rectWidth)};
};
