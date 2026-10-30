import {normalizeCells,signature,moves} from './symmetry-helpers.js?v=9a67f36b25';
export function fold(cells){
 const key=([x,y])=>x+','+y,neg=v=>v.map(x=>-x),frames=new Map([[key(cells[0]),{u:[1,0,0],v:[0,1,0],n:[0,0,1]}]]),queue=[cells[0]],occupied=new Set(cells.map(key));
 for(let i=0;i<queue.length;i++){
   const [x,y]=queue[i],{u,v,n}=frames.get(key(queue[i]));
   const neighbors=[[[x+1,y],{u:neg(n),v,n:u}],[[x-1,y],{u:n,v,n:neg(u)}],[[x,y+1],{u,v:neg(n),n:v}],[[x,y-1],{u,v:n,n:neg(v)}]];
   for(const [p,f]of neighbors){if(!occupied.has(key(p)))continue;const old=frames.get(key(p));if(old){if(JSON.stringify(old)!==JSON.stringify(f))return null;}else{frames.set(key(p),f);queue.push(p);}}
 }
 if(frames.size!==6||new Set([...frames.values()].map(f=>f.n.join(','))).size!==6)return null;
 return cells.map(p=>frames.get(key(p)).n);
}
let shapes=[[[0,0]]];
for(let n=1;n<6;n++){
 const grown=new Map();for(const cells of shapes)for(const [x,y]of cells)for(const p of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){
  if(cells.some(q=>q[0]===p[0]&&q[1]===p[1]))continue;
  const next=normalizeCells([...cells,p]);grown.set(signature(next),next);
 }shapes=[...grown.values()];
}
export const hexominoes=shapes;
export const cubeNets=shapes.filter(s=>fold(s));
export const invalidNets=shapes.filter(s=>!fold(s));
export const orient=(rng,cells)=>normalizeCells(rng.pick(moves(cells)));
export function opposite(cells,index){const ns=fold(cells);return ns.findIndex(n=>n.every((x,i)=>x===-ns[index][i]));}
// 별도 검산: 모서리 축 주위의 90도 회전을 벡터 외적으로 계산한다.
export function foldedNormals(cells){
 const dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],turn=(v,axis,sign)=>{const c=cross(axis,v),d=dot(axis,v);return axis.map((n,i)=>n*d+sign*c[i]);};
 const keys=cells.map(p=>p.join(',')),frames=new Map([[keys[0],[[1,0,0],[0,1,0],[0,0,1]]]]),queue=[0];
 for(let at=0;at<queue.length;at++){const i=queue[at],p=cells[i],basis=frames.get(keys[i]);for(const [dx,dy,axis,sign]of [[1,0,1,1],[-1,0,1,-1],[0,1,0,-1],[0,-1,0,1]]){const j=keys.indexOf([p[0]+dx,p[1]+dy].join(','));if(j<0)continue;const next=basis.map(v=>turn(v,basis[axis],sign)),old=frames.get(keys[j]);if(old){if(JSON.stringify(old)!==JSON.stringify(next))return null;}else{frames.set(keys[j],next);queue.push(j);}}}
 const normals=keys.map(k=>frames.get(k)?.[2]);return normals.every(Boolean)&&new Set(normals.map(n=>n.join(','))).size===6?normals:null;
}
