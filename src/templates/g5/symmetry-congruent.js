import { explain, say } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {baseShape,moves,normalizeCells,congruent,distanceCongruent,cellHints} from './symmetry-helpers.js?v=9a67f36b25';
import {pictureHints} from '../../engine/guess.js?v=9a67f36b25';
export default define(meta('symmetry','congruent',1,'shape',['03-01'],'합동인 모양 찾기'),{
 answerKind:'text',back:'g4s1-shape-movement',guessHints:[pictureHints,cellHints],texts:['0번 도형과 합동인 도형은 어느 것일까요?','0번과 모양과 크기가 모두 같은 도형은 어느 것일까요?'],
 draw: explain(function(rng) {const base=baseShape(rng),other=baseShape(rng),third=baseShape(rng);if(!base||!other||!third||congruent(base,other)||congruent(base,third)||congruent(other,third))return null;
 const correct=normalizeCells(rng.pick(moves(base))),enlarged=base.flatMap(([x,y])=>[[2*x,2*y],[2*x+1,2*y],[2*x,2*y+1],[2*x+1,2*y+1]]);
 const panels=rng.shuffle([correct,enlarged,other,third].map((cells,i)=>{const dx=Math.floor((7-Math.max(...cells.map(p=>p[0])))/2),dy=Math.floor((7-Math.max(...cells.map(p=>p[1])))/2);return {w:8,h:8,source:i,cells:cells.map(([x,y])=>[x+dx,y+dy])};})).map((p,i)=>({...p,number:i+1}));
 return {base,panels,options:panels.map(p=>p.number+'번'),...errors(wrong(panels.find(p=>p.source===1).number+'번','모양만 보고 확대한 그림 고르기','모양은 같지만 크기가 다른 {value} 그림을 골랐습니다. 한 칸의 크기가 같은 모눈에서 칸 수와 모양이 모두 같아 포개지는 그림은 {answer:입니다}.'),wrong(panels.find(p=>p.source===2).number+'번','칸 수만 보고 고르기','칸 수는 같지만 모양이 다른 {value} 그림을 골랐습니다. 칸 수뿐 아니라 이어진 모양도 같아 옮기거나 돌리거나 뒤집어 포개지는 그림은 {answer:입니다}.'))};}, v => {const p=v.panels.find(p=>p.source===0),sig=xs=>normalizeCells(xs).map(q=>q.join(',')).sort().join(';'),m=moves(v.base).findIndex(xs=>sig(xs)===sig(p.cells)),rows=[...new Set(p.cells.map(q=>q[1]))].sort((a,b)=>a-b).map(y=>p.cells.filter(q=>q[1]===y).length);return ['0번 도형은 모눈 1칸짜리 '+v.base.length+'개를 이어 만든 모양입니다.', '0번 도형을 '+(m>=4?'좌우로 뒤집고 ':'')+(m%4?'시계 방향으로 '+m%4*90+'°만큼 돌려서 ':'')+p.number+'번 도형에 포개면 완전히 겹칩니다.', p.number+'번의 칸은 위에서부터 '+rows.map(n=>n+'개').join(', ')+'입니다. '+rows.join(' + ')+' = '+say(v.base.length)+' 칸 수와 이어진 모양이 모두 같습니다.'];}),
 answer:v=>v.panels.find(p=>congruent(v.base,p.cells)).number+'번',check:v=>v.panels.find(p=>distanceCongruent(p.cells,v.base)).number+'번',
 isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&congruent(v.base,p.cells)),
 art:v=>({kind:'grid',reference:{w:8,h:8,cells:v.base.map(([x,y])=>[x+Math.floor((7-Math.max(...v.base.map(p=>p[0])))/2),y+Math.floor((7-Math.max(...v.base.map(p=>p[1])))/2)])},panels:v.panels,wide:true,sameScale:true}),solution: "{process}\n따라서 0번 도형과 합동인 도형은 {answer:입니다}.",
});
