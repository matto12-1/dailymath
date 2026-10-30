import {cart,seq,totalCubes,countCells,frontHeights,sideHeights,wrong,errors} from './helpers.js?v=9a67f36b25';
export const signature=h=>JSON.stringify([h.map(row=>row.map(n=>+(n>0))),frontHeights(h),sideHeights(h)]);
export const allStacks=cart({a:seq(0,3),b:seq(0,3),c:seq(0,3),d:seq(0,3)}).map(v=>[[v.a,v.b],[v.c,v.d]]);
const signatures=new Map();for(const h of allStacks){const s=signature(h);signatures.set(s,(signatures.get(s)??0)+1);}
export const uniqueStacks=allStacks.filter(h=>signatures.get(signature(h))===1);
export const rotate=h=>[[h[1][0],h[0][0]],[h[1][1],h[0][1]]];
export const rotations=h=>{const out=[h];for(let i=1;i<4;i++)out.push(rotate(out.at(-1)));return out;};
// 2×2 겨냥도에서는 뒤 왼쪽 탑만 가려질 수 있다.
// 대각선 앞 탑보다 낮거나, 양옆 두 탑보다 모두 낮으면 윗면이 가려진다.
// 전체 256배치를 실제 투영의 가림 검사와 맞대는 시험으로 이 조건을 확인한다.
export const stackTopsVisible=h=>!h[1][0]||(h[1][0]>=h[0][1]&&(h[1][0]>=h[0][0]||h[1][0]>=h[1][1]));
const visibleStacks=uniqueStacks.filter(stackTopsVisible),viewCache=new WeakMap();
const views=h=>{if(!viewCache.has(h))viewCache.set(h,[h.map(row=>row.map(n=>+(n>0))),frontHeights(h),sideHeights(h)]);return viewCache.get(h);};
const keys=h=>views(h).map(v=>JSON.stringify(v)),viewKeys=new Map(visibleStacks.map(h=>[h,keys(h)]));
const pools=new Map(visibleStacks.map(h=>[h,viewKeys.get(h).map((_,i,vs)=>visibleStacks.filter(g=>viewKeys.get(g).every((b,j)=>(vs[j]===b)===(i!==j))))]));
export const inferStacks=visibleStacks.filter(h=>pools.get(h).every(p=>p.length));
export function inferVars(rng){
 const heights=rng.pick(inferStacks),panels=rng.shuffle([heights,...pools.get(heights).map(p=>rng.pick(p))]).map((h,i)=>({heights:h,number:i+1})),bad=panels.filter(p=>signature(p.heights)!==signature(heights));
 const answer=panels.find(p=>p.heights===heights).number+'번';
 return {heights,panels,options:panels.map(p=>p.number+'번'),...errors(...bad.map(p=>{
  const i=views(p.heights).findIndex((v,j)=>JSON.stringify(v)!==JSON.stringify(views(heights)[j])),name=['위','앞','옆'][i],shown=views(p.heights)[i],expected=views(heights)[i];
  if(i===0){
   const y=shown.findIndex((row,y)=>row.some((n,x)=>n!==expected[y][x])),x=shown[y].findIndex((n,x)=>n!==expected[y][x]),place=(y?'뒷줄':'앞줄')+' '+(x?'오른쪽':'왼쪽');
   return wrong(p.number+'번','위 모양 비교 빠뜨리기',p.number+'번을 위에서 보면 '+place+'에 쌓기나무가 '+(shown[y][x]?'있습니다.':'없습니다.')+' 그림에서는 그 자리에 쌓기나무가 '+(expected[y][x]?'있으므로':'없으므로')+' 세 방향이 모두 맞는 것은 '+answer+'입니다.');
  }
  return wrong(p.number+'번',name+' 모양 비교 빠뜨리기',p.number+'번을 '+name+'에서 보면 '+(i===1?'왼쪽부터 ':'앞쪽부터 ')+shown.map(n=>n+'층').join(', ')+'입니다. 그림의 '+name+' 모양은 '+expected.map(n=>n+'층').join(', ')+'이므로 이 방향도 맞는 것은 '+answer+'입니다.');
 }))};
}
export const spaceHints=({choices,art})=>{
 if(!art.panels)return {};
 const hs=choices.map(c=>art.panels.find(p=>p.number+'번'===c).heights);
 return {'cube-total':hs.map(totalCubes),'top-count':hs.map(countCells),'front-left':hs.map(h=>h[0][0]),'front-right':hs.map(h=>h[0][1])};
};
