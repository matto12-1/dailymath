export const length2 = (a,b) => (a[0]-b[0])**2+(a[1]-b[1])**2;
export const isRightAt = (ps,i) => {
  const p=ps[i],a=ps[(i+ps.length-1)%ps.length],b=ps[(i+1)%ps.length];
  return Math.abs((a[0]-p[0])*(b[0]-p[0])+(a[1]-p[1])*(b[1]-p[1]))<1e-7;
};
export const isRectangle = ps => ps.length===4&&ps.every((_,i)=>isRightAt(ps,i));
export const isSquare = ps => isRectangle(ps)&&ps.every((p,i)=>Math.abs(length2(p,ps[(i+1)%4])-length2(ps[0],ps[1]))<1e-7);
export const hasRight = ps => ps.length===3&&ps.some((_,i)=>isRightAt(ps,i));
export const rect = (w,h) => [[5-w/2,5-h/2],[5+w/2,5-h/2],[5+w/2,5+h/2],[5-w/2,5+h/2]];
export const meta = (family, name, level, std, label, strand='shape') => ({id:`g3.${family}.${name}`,unit:family==='plane'?'g3s1-plane-shapes':'g3s2-circles',strand,level,label,std:std.map(x=>`[4수03-${x}]`)});
export const circleNames = {center:'원의 중심',radius:'반지름',diameter:'지름'};
export const things = ['원','둥근 판','둥근 종이','원 모양 종이'];
