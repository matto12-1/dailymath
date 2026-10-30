import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {overlapArea} from './geometry.js?v=9a67f36b25';
const area=ps=>Math.abs(ps.reduce((s,p,i)=>s+p[0]*ps[(i+1)%ps.length][1]-p[1]*ps[(i+1)%ps.length][0],0))/2;
const congruent=pieces=>{const lengths=pieces.map(ps=>ps.map((p,i)=>(p[0]-ps[(i+1)%3][0])**2+(p[1]-ps[(i+1)%3][1])**2).sort((a,b)=>a-b));return lengths[0].every((n,i)=>Math.abs(n-lengths[1][i])<1e-7);};
const fits=p=>congruent(p.pieces)&&Math.abs(p.pieces.reduce((s,ps)=>s+area(ps),0)-area(p.outline))<1e-7&&overlapArea(...p.pieces)<1e-7;
export default define(meta('polygons','compose',3,'shape',['03-12'],'두 삼각형으로 빈 곳 채우기'),{
  answerKind:'text',texts:['모양과 크기가 같은 두 삼각형으로 사각형을 채운 그림은 어느 것일까요?','두 조각의 모양과 크기가 모두 같은 그림은 어느 것일까요?'],
  draw(rng){const height=rng.int(4,6),a=[1,1],b=[7,1],shift=rng.int(0,4)?1:0,c=[7+shift,1+height],d=[1+shift,1+height],panels=rng.shuffle([
    {type:'fit',outline:[a,b,c,d]},
    {type:'unequal',outline:[a,b,[6,1+height],[2,1+height]]},
    {type:'different',outline:[a,b,[7,1+height],[2,1+height]]},
    {type:'skew',outline:[a,b,[6,1+height],[1,1+height-1]]},
  ]).map((p,i)=>({...p,pieces:[[p.outline[0],p.outline[1],p.outline[2]],[p.outline[0],p.outline[2],p.outline[3]]],number:i+1,rotation:rng.int(0,3)*90}));
    return {panels,options:panels.map(p=>`${p.number}번`),...errors(wrong(`${panels.find(p=>p.type==='unequal').number}번`,'모양만 비슷하면 같은 조각으로 보기',`${panels.find(p=>p.type==="unequal").number}번은 빈틈없이 채웠지만 두 삼각형의 크기가 다릅니다. 두 삼각형의 크기까지 같은 그림은 ${panels.find(fits).number}번입니다.`),wrong(`${panels.find(p=>p.type==='different').number}번`,'사각형만 채우면 된다고 보기',`사각형을 채운 것만 보고 ${panels.find(p=>p.type==="different").number}번을 골랐습니다. 두 삼각형의 모양까지 같은 그림은 ${panels.find(fits).number}번입니다.`))};},
  answer:v=>`${v.panels.find(fits).number}번`,check:v=>`${v.panels.find(p=>congruent(p.pieces)&&Math.abs(area(p.outline)-p.pieces.reduce((s,ps)=>s+overlapArea(ps,p.outline),0))<1e-7&&overlapArea(...p.pieces)<1e-7).number}번`,isCorrect:(v,c)=>v.panels.some(p=>`${p.number}번`===c&&fits(p)),
  art:v=>({kind:'polygon',panels:v.panels,largePanels:true}),solution:"모든 그림이 빈틈없이 채워져 있습니다. {answer:은/는} 두 삼각형의 모양과 크기가 모두 같습니다.\n따라서 알맞은 그림은 {answer:입니다}.",
});
