import { explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {quad,parallelPairs,equalSides,isRectangle,propertyMarks} from './geometry.js?v=9a67f36b25';
// 사각형 사이의 관계를 그림 보기로 묻는다(검수 7번). 긴 설명 넷을 읽고 고르던 것을, 「~인 사각형」 하나를 묻고 그림 넷에서 고르게 바꿨다.
// 묻는 것마다 맞는 모양과 틀린 모양을 따로 둔다: 정사각형은 직사각형이고 마름모이며, 평행사변형·직사각형·마름모·정사각형은 사다리꼴이다.
// 평행한 변이 없는 사각형도 그림에 나와 「사다리꼴이 아닌 사각형」의 답이 된다. 「평행한 변이 없습니다」는 늘 오답이었다(검수 2번).
const NAME={square:'정사각형',rectangle:'직사각형',rhombus:'마름모',parallelogram:'평행사변형',trapezoid:'사다리꼴',일반:'평행한 변이 없는 사각형'};
const asks=[
  {ask:'직사각형이라고 할 수 있는 사각형',fits:['rectangle','square'],tempting:['rhombus','parallelogram'],rest:['trapezoid','일반'],test:ps=>isRectangle(ps),rule:'네 각이 모두 직각인 사각형은 직사각형입니다.'},
  {ask:'마름모라고 할 수 있는 사각형',fits:['rhombus','square'],tempting:['rectangle','parallelogram'],rest:['trapezoid','일반'],test:ps=>equalSides(ps),rule:'네 변의 길이가 모두 같은 사각형은 마름모입니다.'},
  {ask:'평행한 변이 한 쌍뿐인 사각형',fits:['trapezoid'],tempting:['parallelogram','일반'],rest:['square','rectangle','rhombus'],test:ps=>parallelPairs(ps)===1,rule:'평행한 변이 한 쌍뿐인 사각형은 사다리꼴입니다.'},
  {ask:'사다리꼴이 아닌 사각형',fits:['일반'],tempting:['parallelogram','trapezoid'],rest:['square','rectangle','rhombus'],test:ps=>parallelPairs(ps)===0,rule:'평행한 변이 한 쌍이라도 있으면 사다리꼴입니다.'},
];
const facts=ps=>{const k=parallelPairs(ps);return `${k?`평행한 변이 ${k}쌍이고`:'평행한 변이 없고'}, ${isRectangle(ps)?'네 각이 모두 직각입니다':'직각이 없습니다'}. ${equalSides(ps)?'네 변의 길이가 모두 같습니다':'네 변의 길이가 모두 같지는 않습니다'}`;};
// 같은 길이 표시는 길이가 같은 변끼리만 단다. 길이가 다 다른 변에 눈금 1~4개를 달면 어지러웠다.
const marks=ps=>({right:propertyMarks(ps).right,equal:propertyMarks(ps).equal.filter(g=>g.length>1),parallel:[[0,2],[1,3]].filter(([a,b])=>{const q=i=>ps[(i+1)%4].map((n,k)=>n-ps[i][k]);return Math.abs(q(a)[0]*q(b)[1]-q(a)[1]*q(b)[0])<1e-6;})});
const fit=v=>v.panels.find(p=>asks[v.ask].test(p.points));
export default define(meta('quadrilaterals','inclusion',3,'shape',['03-10'],'사각형에 맞는 성질'),{
  answerKind:'text',back:'g3s1-plane-shapes',texts:['{askText:은/는} 어느 것일까요?','다음 중 {askText:은/는} 어느 것일까요?'],
  draw: explain(function(rng) {const ask=rng.int(0,asks.length-1),a=asks[ask],type=rng.pick(a.fits),others=[...a.tempting,rng.pick(a.rest)],
    panels=rng.shuffle([type,...others].map(t=>{const points=quad(t,rng);return {type:t,points,rotation:rng.int(0,3)*90,marks:marks(points),markScale:1.7};})).map((p,i)=>({...p,number:i+1}));
    if(panels.filter(p=>a.test(p.points)).length!==1)return null;
    return {ask,askText:a.ask,type,panels,options:panels.map(p=>`${p.number}번`),...errors(...a.tempting.map(t=>{const p=panels.find(p=>p.type===t);return wrong(`${p.number}번`,`${NAME[t]} 고르기`,`${p.number}번을 골랐지만 ${ask===0?"직각이 없습니다":ask===1?"네 변의 길이가 모두 같지는 않습니다":ask===2?parallelPairs(p.points)?`평행한 변이 ${parallelPairs(p.points)}쌍입니다`:"평행한 변이 없습니다":"평행한 변이 있습니다"}. ${p.number}번과 달리 ${ask===0?"네 각이 모두 직각인":ask===1?"네 변의 길이가 모두 같은":ask===2?"평행한 변이 한 쌍뿐인":"평행한 변이 없는"} 사각형은 ${panels.find(p=>a.test(p.points)).number}번입니다.`);}))};},
    v => {const p=fit(v);return [asks[v.ask].rule, `${p.number}번은 ${facts(p.points)}.`+(v.ask<2&&v.type==='square'?` 정사각형도 ${v.ask===0?'직사각형이라고':'마름모라고'} 할 수 있습니다.`:v.ask===3?' 다른 사각형은 모두 평행한 변이 있어 사다리꼴입니다.':'')];}),
  answer:v=>`${fit(v).number}번`,check:v=>`${v.panels.filter(p=>asks[v.ask].test(p.points))[0].number}번`,
  isCorrect:(v,c)=>v.panels.some(p=>`${p.number}번`===c&&asks[v.ask].test(p.points)),
  // 칸마다 도형을 칸에 꽉 차게 그린다(full). 작게 그리면 표시가 안 보였다.
  art:v=>({kind:'polygon',panels:v.panels.map(({type,...p})=>p),largePanels:'full'}),
  solution: "{process}\n따라서 {askText:은/는} {answer}입니다.",
});
