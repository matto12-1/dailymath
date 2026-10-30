import {define,errors,wrong} from './helpers.js?v=9a67f36b25';
import {numberedPanels as numbered} from '../g4/geometry.js?v=9a67f36b25';
import {meta,rect,hasRight,isRightAt} from './shape-helpers.js?v=9a67f36b25';
export default define(meta('plane','triangle',3,['09'],'직각삼각형 찾기'),{
  answerUnit:'번',errorCount:2,back:'g2s1-shapes',range:{min:0,max:9999},answerSpan:[1,2,3,4],
  texts:['직각삼각형은 어느 것일까요?'],
  draw(rng){const a=rng.int(3,6),b=rng.int(3,6),near=rng.pick([70,110])*Math.PI/180;
    const panels=numbered(rng,[{points:[[2,2],[2+a,2],[2,2+b]]},{points:[[2,7],[2+a,7],[2+b*Math.cos(near),7-b*Math.sin(near)]],nearRight:true},{points:[[2,7],[2+a,7],[2+b*Math.cos(65*Math.PI/180),7-b*Math.sin(65*Math.PI/180)]]},{points:[[2,7],[8,7],[rng.int(3,5),5]]}].map(p=>({...p,rotation:rng.int(0,35)*10})),p=>hasRight(p.points));
    if(panels.filter(p=>hasRight(p.points)).length!==1)return null;
    return {panels,options:[1,2,3,4],...errors(wrong(panels.find(p=>p.nearRight).number,'직각과 비슷한 각 혼동',`${panels.find(p=>p.nearRight).number}번은 직각처럼 보이지만 삼각자의 직각 부분이 꼭 맞지 않습니다. 한 각이 직각인 삼각형은 ${panels.find(p=>hasRight(p.points)).number}번입니다.`),wrong(panels.find(p=>!p.nearRight&&!hasRight(p.points)).number,'직각 없는 삼각형 고르기',`${panels.find(p=>!p.nearRight&&!hasRight(p.points)).number}번은 삼각형이지만 직각이 없습니다. 삼각자의 직각 부분이 꼭 맞는 각이 있는 삼각형은 ${panels.find(p=>hasRight(p.points)).number}번입니다.`))};},
  answer:v=>v.panels.find(p=>hasRight(p.points)).number,
  check:v=>v.panels.find(p=>p.points.length===3&&p.points.some((_,i)=>isRightAt(p.points,i))).number,
  isCorrect:(v,c)=>v.panels.some(p=>p.number===c&&hasRight(p.points)),
  art:v=>({kind:'polygon',panels:v.panels,largePanels:true}),solution:"{answer}번은 변이 세 개이고 직각이 하나 있습니다.\n따라서 직각삼각형은 {answer}번입니다.",
});
