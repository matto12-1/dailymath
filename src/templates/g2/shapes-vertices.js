import { explain, j, say, count } from '../solution-process.js?v=9a67f36b25';
import {wrong,errors,polygonPoints,item,verticesOf,seq} from './helpers.js?v=9a67f36b25';
import {define} from './helpers.js?v=9a67f36b25';
import {cycle,balancedOptions} from '../g4/helpers.js?v=9a67f36b25';
const totals=Array.from({length:11},(_,i)=>i+6);
const countHints=({choices,art})=>{
  const polygons=art.items.filter(p=>p.points),n=polygons.length,first=polygons[0].points.length;
  return {...Object.fromEntries([['all-triangles',3*n],['all-quadrilaterals',4*n],['double-first',2*first],['count-circles-as-triangles',3*art.items.length]].map(([name,value])=>[name,choices.map(c=>+(c===value))])), 'vertex-range':choices.map(c=>+(c>=3*n&&c<=4*n))};
};
export default define({id:'g2.shapes.vertices',grade:2,unit:'g2s1-shapes',strand:'shape',level:2,label:'꼭짓점 세기',std:['[2수03-05]']},{
  range:{min:3,max:17},differentDigits:true,errorCount:3,answerSpan:totals,guessHints:[countHints],
  texts:['그림에 있는 도형들의 {part:은/는} 모두 몇 개일까요?'],
  draw: explain(function(rng) {const n=cycle(rng,'g2-vertices-total',totals),count=rng.pick([2,3,4].filter(k=>3*k<=n&&4*k>=n)),shapes=Array.from({length:count},(_,i)=>i<n-3*count?'square':'triangle');
    const items=rng.shuffle(shapes).map(shape=>({...item(shape),rotation:rng.int(0,35)*10,...(shape==='circle'?{}:{points:polygonPoints(rng,verticesOf[shape]).map(([x,y])=>[x*3.5,y*3.5])})}));
    const part=rng.pick(['꼭짓점','변']),missed=verticesOf[items[0].shape];
    const doubled=2*verticesOf[items[0].shape],pool=totals.filter(v=>v>=3*count&&v<=4*count);
    return {n,part,items,...errors(
      wrong(n+1,'시작점 다시 세기',`처음 세었던 ${part}을 한 번 더 세었습니다. ${part}마다 한 번씩만 세면 ${n}개입니다.`),
      wrong(n-missed,'도형 하나 빠뜨리기',`${part}이 ${missed}개인 도형 하나를 빼고 세었습니다. 그림에 있는 도형 ${count}개의 ${part}을 모두 더하면 ${n}개입니다.`),
      rng.pick([true,false])?wrong(n+missed,'도형 하나 두 번 세기',`한 도형의 ${part}을 두 번 세었습니다. 각 도형을 한 번씩만 세어 더하면 ${n}개입니다.`):wrong(n-1,'꼭짓점이나 변 하나 빠뜨리기',`${part} 하나를 빠뜨려 ${n-1}개를 골랐습니다. 모든 ${part}을 빠짐없이 세면 ${n}개입니다.`))};}, v => ['왼쪽부터 각 도형의 ' + j(v.part,'을/를') + ' 세면 ' + v.items.map(p=>(p.points?.length??0)+'개').join(', ') + '입니다.', v.items.map(p=>p.points?.length??0).join(' + ') + ' = ' + say(v.n)]),
  acceptChoices:({items},options)=>options.filter(n=>n>=3*items.length&&n<=4*items.length).length>=3,
  candidates:seq(3,17),
  answer:({n})=>n,check:({items})=>items.reduce((s,p)=>s+(p.points?.length??0),0),
  art:({items})=>({kind:'objects',expand:true,items,columns:3}),
  solution: "{process}\n따라서 {part:은/는} 모두 {answer}개입니다.",
});
