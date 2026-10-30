import {seq,cycle} from './helpers.js?v=9a67f36b25';
export {isRightAt,isRectangle,isSquare,hasRight,length2,rect} from '../g3/shape-helpers.js?v=9a67f36b25';
const rad = d=>d*Math.PI/180;
export const normalize = points => {
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys),s=7/Math.max(w,h);
  return points.map(([x,y])=>[5+(x-(Math.min(...xs)+Math.max(...xs))/2)*s,5+(y-(Math.min(...ys)+Math.max(...ys))/2)*s]);
};
export const triangle = (a,b) => normalize([[0,0],[8,0],[8*Math.sin(rad(b))/Math.sin(rad(180-a-b))*Math.cos(rad(a)),-8*Math.sin(rad(b))/Math.sin(rad(180-a-b))*Math.sin(rad(a))]]);
export function interior(points) {
  return points.map((p,i)=>{const a=points[(i+points.length-1)%points.length],b=points[(i+1)%points.length],u=[a[0]-p[0],a[1]-p[1]],v=[b[0]-p[0],b[1]-p[1]];return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/Math.hypot(...u)/Math.hypot(...v))))*180/Math.PI;});
}
export const regular = (n,rotation=0) => seq(0,n-1).map(i=>[5+3.5*Math.cos(rad(i*360/n-90+rotation)),5+3.5*Math.sin(rad(i*360/n-90+rotation))]);
export function numberedPanels(rng,panels,matches){
 const good=panels.filter(matches);if(good.length!==1)throw new Error('정답 그림은 하나여야 해요.');
 const rest=rng.shuffle(panels.filter(p=>!matches(p)));rest.splice(cycle(rng,'b5-numbered-four',[0,1,2,3]),0,good[0]);return rest.map((p,i)=>({...p,number:i+1}));
}
export const integerSides=ps=>{
 const ls=sideLengths(ps);let scale=1;
 while(scale<20&&ls.some(a=>ls.some(b=>Math.abs(a-b)>1e-6&&Math.round(a*scale)===Math.round(b*scale))))scale++;
 return ls.map(n=>Math.round(n*scale));
};
export const sideLengths = ps => ps.map((p,i)=>Math.hypot(p[0]-ps[(i+1)%ps.length][0],p[1]-ps[(i+1)%ps.length][1]));
export const parallelPairs = ps => [[0,2],[1,3]].filter(([i,j])=>{const a=ps[(i+1)%4].map((v,k)=>v-ps[i][k]),b=ps[(j+1)%4].map((v,k)=>v-ps[j][k]);return Math.abs(a[0]*b[1]-a[1]*b[0])<1e-7;}).length;
export const equalSides = ps => {const ls=sideLengths(ps);return ls.every(l=>Math.abs(l-ls[0])<1e-7);};
export const quad = (type,rng) => {
  const w=rng.int(6,7),h=rng.int(2,3),s=rng.int(1,2);
  if(type==='square')return normalize([[0,0],[w,0],[w,w],[0,w]]);
  if(type==='rectangle')return normalize([[0,0],[w,0],[w,h],[0,h]]);
  if(type==='rhombus'){const a=rad(rng.pick([45,55,65]));return normalize([[0,0],[w,0],[w+w*Math.cos(a),w*Math.sin(a)],[w*Math.cos(a),w*Math.sin(a)]]);}
  if(type==='parallelogram')return normalize([[0,0],[w,0],[w+s,h],[s,h]]);
  if(type==='trapezoid')return normalize([[0,0],[w+3,0],[w,h],[s,h]]);
  return normalize([[0,0],[w+2,0],[w,h+1],[s,h+2]]);
};
export const quadNames = {square:'정사각형',rectangle:'직사각형',rhombus:'마름모',parallelogram:'평행사변형',trapezoid:'사다리꼴'};
export const shapeFacts = ps => ({parallel:ps.length===4?parallelPairs(ps):0,equal:equalSides(ps),angles:interior(ps)});
export const sameCells = (a,b)=>a.map(p=>p.join(',')).sort().join(';')===b.map(p=>p.join(',')).sort().join(';');
export const signedArea = ps=>ps.reduce((s,p,i)=>s+p[0]*ps[(i+1)%ps.length][1]-p[1]*ps[(i+1)%ps.length][0],0)/2;
// 볼록 조각을 다른 볼록 조각으로 잘라 실제 겹친 넓이를 구한다.
export function overlapArea(subject,clip) {
  let out=subject.map(p=>[...p]);const orientation=Math.sign(signedArea(clip));
  for(let i=0;i<clip.length;i++){
    const a=clip[i],b=clip[(i+1)%clip.length],side=p=>orientation*((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])),input=out;out=[];
    for(let j=0;j<input.length;j++){
      const p=input[j],q=input[(j+1)%input.length],sp=side(p),sq=side(q);
      if(sp>=-1e-9)out.push(p);
      if((sp>=0)!==(sq>=0)){const t=sp/(sp-sq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}
    }
  }
  return out.length<3?0:Math.abs(signedArea(out));
}
export const transforms = {
  '오른쪽으로 뒤집기':([x,y])=>[4-x,y], '위쪽으로 뒤집기':([x,y])=>[x,4-y],
  '시계 방향으로 90°만큼 돌리기':([x,y])=>[4-y,x], '시계 방향으로 180°만큼 돌리기':([x,y])=>[4-x,4-y],
  '시계 반대 방향으로 90°만큼 돌리기':([x,y])=>[y,4-x],
};
export function asymmetry(rng) {
  const bases=[[[0,0],[0,1],[0,2],[0,3],[1,3]],[[0,0],[1,0],[0,1],[1,1],[0,2]],[[1,0],[0,1],[1,1],[1,2],[2,2]],[[0,0],[0,1],[1,1],[0,2],[0,3]]];
  const base=rng.pick(bases),turn=rng.int(0,3),flip=rng.int(0,1),moved=base.map(([x,y])=>{if(flip)x=4-x;for(let i=0;i<turn;i++)[x,y]=[4-y,x];return [x,y];}),minX=Math.min(...moved.map(p=>p[0])),minY=Math.min(...moved.map(p=>p[1])),dx=rng.int(0,4-Math.max(...moved.map(p=>p[0]))+minX),dy=rng.int(0,4-Math.max(...moved.map(p=>p[1]))+minY),cells=moved.map(([x,y])=>[x-minX+dx,y-minY+dy]);
  const signatures=Object.values(transforms).map(fn=>cells.map(fn).map(p=>p.join(',')).sort().join(';'));
  return new Set(signatures).size===signatures.length?cells:null;
}
export function propertyMarks(points){
  const groups=values=>{const bins=[];values.forEach((n,i)=>{let bin=bins.find(g=>Math.abs(values[g[0]]-n)<1e-5);if(!bin)bins.push(bin=[]);bin.push(i);});return bins;};
  return {equal:groups(sideLengths(points)),angles:groups(interior(points)),right:interior(points).flatMap((a,i)=>Math.abs(a-90)<1e-6?[i]:[])};
}
