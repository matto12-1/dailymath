// The same 22/11/25 projection and painter order as figure.js, with front row first.
const signedArea=ps=>ps.reduce((s,p,i)=>{const q=ps[(i+1)%ps.length];return s+p[0]*q[1]-q[0]*p[1];},0)/2;
const area=ps=>Math.abs(signedArea(ps));
const cross=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
function halfPlane(ps,a,b,inside){
 const out=[],side=p=>cross(a,b,p)*(inside?1:-1);
 for(let i=0;i<ps.length;i++){
  const p=ps[i],q=ps[(i+1)%ps.length],u=side(p),v=side(q);
  if(u>=-1e-8)out.push(p);
  if((u>1e-8&&v< -1e-8)||(u< -1e-8&&v>1e-8)){const t=u/(u-v);out.push([p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t]);}
 }
 return out;
}
function subtract(ps,cover){
 let inside=ps;const pieces=[];
 for(let i=0;i<cover.length&&inside.length>=3;i++){
  const a=cover[i],b=cover[(i+1)%cover.length],outside=halfPlane(inside,a,b,false);
  if(outside.length>=3&&area(outside)>1e-6)pieces.push(outside);
  inside=halfPlane(inside,a,b,true);
 }
 return pieces;
}
const cache=new Map();
export function cubeVisibility(heights){
 const key=JSON.stringify(heights);if(cache.has(key))return cache.get(key);
 const rows=heights.length,drawn=heights.slice().reverse(),faces=[];
 const cells=drawn.flatMap((row,y)=>row.map((height,x)=>({height,x,y}))).sort((a,b)=>a.x+a.y-b.x-b.y||a.y-b.y);
 for(const {height,x,y}of cells)for(let z=0;z<height;z++){
  const px=(x-y)*22,py=(x+y)*11-z*25,p=[[px,py-25],[px+22,py-14],[px,py-3],[px-22,py-14]],id=x+','+(rows-1-y)+','+z;
  for(const [type,points]of [['left',[p[2],p[3],[px-22,py+11],[px,py+22]]],['right',[p[1],p[2],[px,py+22],[px+22,py+11]]],['top',p]])faces.push({id,type,points:signedArea(points)<0?points.slice().reverse():points,upper:z===height-1});
 }
 const visible=new Set(),tops=new Set(),topAreas={};
 faces.forEach((face,i)=>{
  let fragments=[face.points];
  for(let j=i+1;j<faces.length&&fragments.length;j++)fragments=fragments.flatMap(ps=>subtract(ps,faces[j].points));
  const exposed=fragments.reduce((s,ps)=>s+area(ps),0);
  if(exposed>1)visible.add(face.id);
  if(face.type==='top'&&face.upper){const cell=face.id.split(',').slice(0,2).join(',');topAreas[cell]=exposed;if(exposed>=area(face.points)*.05)tops.add(cell);}
 });
 const result={visibleCubes:visible.size,visibleTops:tops.size,topAreas};cache.set(key,result);return result;
}
export function connectedStack(h){
 const cells=h.flatMap((row,y)=>row.flatMap((n,x)=>n?[[x,y]]:[]));if(!cells.length)return false;
 const reached=new Set(),queue=[cells[0]];
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i],key=x+','+y;if(reached.has(key))continue;reached.add(key);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])if(h[y+dy]?.[x+dx]>0&&!reached.has((x+dx)+','+(y+dy)))queue.push([x+dx,y+dy]);}
 return reached.size===cells.length;
}
