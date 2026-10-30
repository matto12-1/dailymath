import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {regular,normalize,sideLengths,interior,propertyMarks} from './geometry.js?v=9a67f36b25';
const isRegular=ps=>{const ls=sideLengths(ps),as=interior(ps);return Math.max(...ls)-Math.min(...ls)<1e-7&&Math.max(...as)-Math.min(...as)<1e-7;};
const edges=(angles,lengths)=>{let x=0,y=0;return angles.map((a,i)=>{const p=[x,y];x+=lengths[i]*Math.cos(a*Math.PI/180);y+=lengths[i]*Math.sin(a*Math.PI/180);return p;});};
export default define(meta('polygons','regular',2,'shape',['03-11'],'정다각형 찾기'),{
  answerKind:'text',texts:['정다각형은 어느 것일까요?','변의 길이와 각의 크기를 보면 정다각형은 어느 것일까요?'],
  draw(rng){const n=rng.pick([4,6,8]),angles=Array.from({length:n},(_,i)=>i*360/n),sidesAngles=angles.map((a,i)=>a+(i%(n/2)===1?18:0)),panels=rng.shuffle([
    {points:regular(n),type:'regular'},
    {points:normalize(edges(sidesAngles,angles.map(()=>1))),type:'sides'},
    {points:normalize(edges(angles,angles.map((_,i)=>i%2?1.65:1))),type:'angles'},
    {points:normalize(regular(n).map(([x,y],i)=>i===0?[x,y-2.2]:[x,y])),type:'irregular'},
  ]).map((p,i)=>({...p,number:i+1,rotation:rng.pick([0,180]),marks:propertyMarks(p.points),markGap:8,angleRadiusMin:12}));
    return {panels,options:panels.map(p=>`${p.number}번`),...errors(wrong(`${panels.find(p=>p.type==='sides').number}번`,'변의 길이만 비교하기',`${panels.find(p=>p.type==="sides").number}번은 변의 길이는 모두 같지만 각의 크기가 모두 같지는 않습니다. 각의 크기까지 모두 같은 정다각형은 ${panels.find(p=>p.type==="regular").number}번입니다.`),wrong(`${panels.find(p=>p.type==='angles').number}번`,'각의 크기만 비교하기',`${panels.find(p=>p.type==="angles").number}번은 각의 크기는 모두 같지만 변의 길이가 모두 같지는 않습니다. 변의 길이까지 모두 같은 정다각형은 ${panels.find(p=>p.type==="regular").number}번입니다.`))};},
  answer:v=>`${v.panels.find(p=>isRegular(p.points)).number}번`,check:v=>`${v.panels.find(p=>isRegular(p.points)).number}번`,isCorrect:(v,c)=>v.panels.some(p=>`${p.number}번`===c&&isRegular(p.points)),
  art:v=>({kind:'polygon',panels:v.panels,largePanels:'full'}),solution: "변에 같은 표시가 있으면 길이가 같은 변이고 각에 같은 표시가 있으면 크기가 같은 각입니다.\n{answer:은/는} 모든 변의 길이가 같고 모든 각의 크기가 같습니다.\n따라서 정다각형은 {answer}입니다.",
});
