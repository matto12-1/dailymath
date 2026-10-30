import { j, explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {cubeNets,invalidNets,fold,orient,foldedNormals} from './net-helpers.js?v=9a67f36b25';
const overlappingFaces=cells=>{
 const neg=v=>v.map(x=>-x),keys=cells.map(p=>p.join(',')),frames=new Map([[keys[0],{u:[1,0,0],v:[0,1,0],n:[0,0,1]}]]),queue=[0];
 for(let k=0;k<queue.length;k++){const i=queue[k],[x,y]=cells[i],{u,v,n}=frames.get(keys[i]);for(const [p,f]of [[[x+1,y],{u:neg(n),v,n:u}],[[x-1,y],{u:n,v,n:neg(u)}],[[x,y+1],{u,v:neg(n),n:v}],[[x,y-1],{u,v:n,n:neg(v)}]]){const j=keys.indexOf(p.join(','));if(j>=0&&!frames.has(keys[j])){frames.set(keys[j],f);queue.push(j);}}}
 for(let i=0;i<cells.length;i++)for(let j=i+1;j<cells.length;j++)if(frames.get(keys[i]).n.join(',')===frames.get(keys[j]).n.join(','))return '가나다라마바'[i]+' 면과 '+'가나다라마바'[j]+' 면';
 throw new Error('겹치는 면을 찾을 수 없습니다.');
};
const subtle=invalidNets.filter(cells=>{const has=(x,y)=>cells.some(p=>p[0]===x&&p[1]===y);return !cells.some(([x,y])=>has(x+1,y)&&has(x,y+1)&&has(x+1,y+1))&&!cells.some(([x,y])=>[0,1,2,3,4].every(k=>has(x+k,y))||[0,1,2,3,4].every(k=>has(x,y+k)));});
export default define(meta('cuboids','net',3,'shape',['03-04'],'정육면체 전개도 찾기'),{
 answerKind:'text',texts:['접으면 정육면체가 되는 전개도는 어느 것일까요?','면이 겹치지 않게 정육면체로 접히는 그림은 어느 것일까요?'],
 draw: explain(function(rng) {const valid=orient(rng,rng.pick(cubeNets)),bad=rng.shuffle(subtle).slice(0,3).map(c=>orient(rng,c)),panels=rng.shuffle([valid,...bad].map(cells=>({type:'cube',cells}))).map((p,i)=>({...p,number:i+1}));return {panels,options:panels.map(p=>p.number+'번'),...errors(...panels.filter(p=>!fold(p.cells)).slice(0,2).map(p=>wrong(p.number+'번','면이 겹치는 배치 고르기',p.number+'번을 접으면 '+overlappingFaces(p.cells)+'이 같은 자리에 겹치는 '+p.number+'번을 골랐습니다. '+overlappingFaces(p.cells)+'이 '+p.number+'번처럼 겹치지만, 여섯 면이 서로 다른 자리를 이루어 정육면체가 되는 전개도는 {answer:입니다}.')))};}, v => {const p=v.panels.find(p=>fold(p.cells)),ns=fold(p.cells),bottom=ns.findIndex(n=>n[2]===-1),top=p.cells[0],b=p.cells[bottom];return [p.number+'번의 가 면을 밑면으로 놓습니다.', '그 면에서 모서리를 따라 접으면 '+ '가나다라마바'[bottom]+' 면은 가 면과 평행한 밑면이 됩니다. 나머지 4개 면은 옆면이 됩니다.', '밑면 2개와 옆면 4개가 서로 겹치지 않습니다.'];}),
 answer:v=>v.panels.find(p=>fold(p.cells)).number+'번',check:v=>v.panels.filter(p=>foldedNormals(p.cells)).map(p=>p.number+'번')[0],isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&!!fold(p.cells)),
 art:v=>({kind:'net',panels:v.panels.map(p=>({...p,faceNumbers:p.cells.map((_,i)=>'가나다라마바'[i])})),wide:true}),solution: "{process}\n따라서 정육면체의 전개도는 {answer:입니다}.",
});
