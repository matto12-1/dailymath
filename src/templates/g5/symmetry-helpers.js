import {asymmetry,sameCells} from '../g4/geometry.js?v=9a67f36b25';
export {sameCells};
export const normalizeCells=xs=>{const x=Math.min(...xs.map(p=>p[0])),y=Math.min(...xs.map(p=>p[1]));return xs.map(([a,b])=>[a-x,b-y]);};
export function moves(xs){return [false,true].flatMap(flip=>[0,1,2,3].map(turn=>xs.map(([a,b])=>{let x=flip?-a:a,y=b;for(let i=0;i<turn;i++)[x,y]=[-y,x];return [x,y];})));}
const signatures=new WeakMap();
export const signature=xs=>{if(!signatures.has(xs))signatures.set(xs,moves(xs).map(ys=>normalizeCells(ys).map(p=>p.join(',')).sort().join(';')).sort()[0]);return signatures.get(xs);};
export const congruent=(a,b)=>a.length===b.length&&signature(a)===signature(b);
export function distanceCongruent(a,b){
 if(a.length!==b.length)return false;
 const d=(p,q)=>(p[0]-q[0])**2+(p[1]-q[1])**2;
 const match=(used)=>{const i=used.length;if(i===a.length)return true;return b.some((p,j)=>!used.includes(j)&&used.every((k,h)=>d(a[i],a[h])===d(p,b[k]))&&match([...used,j]));};
 return match([]);
}
export function baseShape(rng){const xs=asymmetry(rng);return xs?normalizeCells(xs):null;}
export function cellHints({choices,art}){
 if(!art?.panels)return {};
 const counts=choices.map(c=>{const p=art.panels.find(p=>c===p.number+'번');return p?.cells?.length??0;}),freq=counts.map(n=>counts.filter(m=>m===n).length);
 return {'cells:odd':freq.map(n=>n===1?1:0),'cells:modal':freq};
}
export function reflectCells(cells,line){return cells.map(([x,y])=>line==='v'?[9-x,y]:[x,9-y]);}
export const rotateCells=cells=>cells.map(([x,y])=>[9-x,9-y]);
export function completedPanels(rng,point){
 let raw=baseShape(rng);if(!raw)return null;
 if(point){const candidates=moves(raw).map(normalizeCells).filter(xs=>xs.some(([x,y])=>x===Math.max(...xs.map(p=>p[0]))&&y===Math.max(...xs.map(p=>p[1]))));raw=rng.pick(candidates);}
 const line=rng.pick(['v','h']),maxX=Math.max(...raw.map(p=>p[0])),maxY=Math.max(...raw.map(p=>p[1])),dx=4-maxX,dy=point?4-maxY:rng.int(2,4),base=raw.map(([x,y])=>[x+dx,y+dy]);
 const cells=line==='v'?base:base.map(([x,y])=>[y,x]),target=point?rotateCells(cells):reflectCells(cells,line);
 const atTarget=xs=>{const normalized=normalizeCells(xs),x=Math.min(...target.map(p=>p[0])),y=Math.min(...target.map(p=>p[1]));return normalized.map(([a,b])=>[a+x,b+y]);};
 const translated=atTarget(cells),other=atTarget(reflectCells(cells,line==='v'?'h':'v')),turned=atTarget(point?reflectCells(cells,line):rotateCells(cells));
 const candidates=[target,translated,other,turned];
 if(new Set(candidates.map(xs=>xs.map(p=>p.join(',')).sort().join(';'))).size!==4)return null;
 return {cells,line,target,panels:rng.shuffle(candidates.map((after,i)=>({w:10,h:10,cells,after,variant:['target','translate','other','turn'][i],...(point?{dot:[5,5],dotRadius:16}:{line})}))).map((p,i)=>({...p,number:i+1}))};
}
