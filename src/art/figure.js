// 좌표로 그리는 수학 그림. 그림 속 글자는 수치와 단위만 쓴다.
import { labelSize } from './labels.js?v=9a67f36b25';
import { detailedNet, spaceDrawing, polyhedronBody } from './solid-details.js?v=9a67f36b25';
const INK = '#8a6a55', SAGE = '#a8bfa0', ORANGE = '#e8a46a', CREAM = '#fbf3e4', PURPLE = '#a99bbd';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const r = (n) => Math.round(n * 1000) / 1000;
const coords = (points) => points.map(([x, y]) => `${r(x)},${r(y)}`).join(' ');
const svg = (w, h, label, body) => `<svg xmlns="http://www.w3.org/2000/svg" class="figure-art" role="img" aria-label="${esc(label)}" viewBox="0 0 ${r(w)} ${r(h)}" font-family="inherit" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const text = (x, y, s, size = 14) => `<text x="${r(x)}" y="${r(y)}" fill="${INK}" stroke="none" text-anchor="middle" font-size="${size}">${esc(s)}</text>`;
const line = (a, b, attrs = '') => `<line ${attrs} x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}"/>`;
const poly = (points, fill = CREAM, attrs = '') => `<polygon ${attrs} points="${coords(points)}" fill="${fill}"/>`;
const unit = ([x, y]) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
// 치수선의 양 끝에 막대를 긋고 글자는 선 바깥에 둔다.
const dimension=(a,b,label,F=20,offset=16)=>{
  const u=unit([b[0]-a[0],b[1]-a[1]]),n=[u[1],-u[0]],at=(p,d)=>[p[0]+n[0]*d,p[1]+n[1]*d],A=at(a,offset),B=at(b,offset),mid=[(A[0]+B[0])/2,(A[1]+B[1])/2],sign=offset<0?-1:1,gap=12+Math.abs(n[0])*String(label).length*F*.28+Math.abs(n[1])*F*.45;
  return `<g data-dimension="1">${line(A,B)}${line(at(A,-5),at(A,5))}${line(at(B,-5),at(B,5))}${text(mid[0]+n[0]*gap*sign,mid[1]+n[1]*gap*sign+F*.32,label,F)}</g>`;
};

const centeredBody=(body,points,w=300,h=300,rotation=0,origin=[150,150])=>{
 const a=rotation*Math.PI/180,ps=points.map(([x,y])=>[origin[0]+(x-origin[0])*Math.cos(a)-(y-origin[1])*Math.sin(a),origin[1]+(x-origin[0])*Math.sin(a)+(y-origin[1])*Math.cos(a)]),xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
 return `<g data-centered="1" transform="translate(${r(w/2-cx)} ${r(h/2-cy)})">${body}</g>`;
};
// Measure the same coordinates that are drawn. Panel polygons have already
// been rotated, so they must not be translated again after this measurement.
function framedPolygon(art) {
  const source=polygon({...art,center:false}),xs=[],ys=[],F=art.fontSize??14;
  for(const [,points] of source.matchAll(/<polygon[^>]*points="([^"]+)"/g))for(const p of points.split(' ')){const [x,y]=p.split(',').map(Number);xs.push(x);ys.push(y);}
  for(const [,x,y,label] of source.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)"[^>]*>([^<]*)<\/text>/g)){
    const half=[...label].reduce((n,c)=>n+(/\s/.test(c)?.4:/[\u3130-\u318f\uac00-\ud7af]/.test(c)?1:.65),0)*F/2;
    xs.push(+x-half,+x+half);ys.push(+y-F,+y+F*.3);
  }
  const x=Math.min(...xs)-6,y=Math.min(...ys)-6,w=Math.max(...xs)-x+6,h=Math.max(...ys)-y+6;
  return {source:source.replace(/viewBox="[^"]+"/,`viewBox="${r(x)} ${r(y)} ${r(w)} ${r(h)}"`),x,y,w,h};
}
function titledPolygons(panels){
  const fontSize=16,gap=16,top=32;
  const parts=panels.map(p=>{
    const a=(p.rotation??0)*Math.PI/180,points=p.points.map(([x,y])=>[5+(x-5)*Math.cos(a)-(y-5)*Math.sin(a),5+(x-5)*Math.sin(a)+(y-5)*Math.cos(a)]);
    return {p,...framedPolygon({...p,points,rotation:0,fontSize})};
  });
  const height=Math.max(...parts.map(p=>p.h));let left=0;
  const body=parts.map(p=>{const x=left;left+=p.w+gap;return text(x+p.w/2,23,p.p.title,20)+inset(p.source,x,top+(height-p.h)/2,p.w,p.h,'data-correspond-triangle="1"');}).join('');
  return svg(left-gap,height+top,'합동인 두 삼각형',body).replace('<svg ','<svg style="width:100%" data-correspond-pair="1" ');
}
function polygon(art) {
  if (art.lines) return svg(300,300,'두 직선 그림',`<g transform="rotate(${art.rotation??0} 150 150)">${art.lines.map(ps=>line(ps[0].map(n=>30+24*n),ps[1].map(n=>30+24*n),'data-straight="1" stroke-width="3"')).join('')}</g>`);
  if (art.pieces) {
    const angle=(art.rotation??0)*Math.PI/180,convert=ps=>ps.map(([x,y])=>{x=30+24*x-150;y=30+24*y-150;return [150+x*Math.cos(angle)-y*Math.sin(angle),150+x*Math.sin(angle)+y*Math.cos(angle)];});
    const outline=convert(art.outline),body=poly(outline,CREAM,'data-outline="1"')+art.pieces.map((ps,i)=>poly(convert(ps),i?PURPLE:SAGE,`data-piece="${i}" fill-opacity="0.65"`)).join('');
    return svg(300,300,'삼각형 두 조각과 빈 곳',centeredBody(body,outline));
  }
  const { points, labels = {}, marks = {}, rotation = 0, hole, open, endpoints = [], extension = [], panels, largePanels, uprightLabels, labelsOutside, fontSize=14, markScale: ms = 1 } = art;
  // markScale: 작은 그림 단추에서도 직각·같은 길이·평행 표시가 보이게 표시만 키운다(검수 7번 사각형 그림 보기).
  const markWidth = ms === 1 ? '' : ' stroke-width="3"', R = 13 * ms;
  if (panels && largePanels === 'full') {
    const columns=art.panelColumns??2;
    const body = panels.map((p, i) => {
      const xs = p.points.map(([x]) => 30 + 24 * x), ys = p.points.map(([, y]) => 30 + 24 * y);
      const side=192;
      const cx=150,cy=150;
      const inner = polygon(p).replace('viewBox="0 0 300 300"', `viewBox="${r(cx-side/2)} ${r(cy-side/2)} ${r(side)} ${r(side)}"`);
      const x=i%columns*170,y=Math.floor(i/columns)*192;
      return `<g data-panel="${p.number}">${text(x+85,y+22,p.number,22)}${inset(inner,x,y+30,170,158)}</g>`;
    }).join('');
    return svg(columns*170, Math.ceil(panels.length/columns)*192, '번호 도형 모음', body);
  }
  if (panels && largePanels === 'tiles') {
    // 길이를 읽고 고르는 보기(마름모 찾기): 폰의 두 칸 보기 단추(폭 약 120px)에서도 길이와 번호가 읽히게 도형을 0.8배로 그리고 글자를 크게(길이 32, 번호 46) 쓴다.
    // 돌린 도형은 꼭짓점을 돌려 그려 글자가 바로 선다. 칸마다 도형·글자를 둘러싼 같은 크기 틀에 담아 칸끼리 같은 비율로 보인다(글자 폭은 한 글자 0.56em로 어림).
    const F = 32, turn = (pts, deg) => { const a = deg * Math.PI / 180; return pts.map(([x, y]) => [5 + (x - 5) * Math.cos(a) - (y - 5) * Math.sin(a), 5 + (x - 5) * Math.sin(a) + (y - 5) * Math.cos(a)]); };
    const parts = panels.map(p => {
      const points = (p.rotation ? turn(p.points, p.rotation) : p.points).map(([x, y]) => [x * .8, y * .8]);
      const frame=framedPolygon({...p,points,rotation:0,fontSize:F,labelsOutside:true});
      return {p,...frame,cx:frame.x+frame.w/2,cy:frame.y+frame.h/2};
    });
    const W = Math.max(...parts.map(t => t.w)), H = Math.max(...parts.map(t => t.h));
    const body = parts.map(({ p, source, cx, cy }, i) => {
      const x = i % 2 * (W + 20), y = Math.floor(i / 2) * (H + 66);
      return `<g data-panel="${p.number}">${text(x + W / 2, y + 40, p.number, 46)}${inset(source.replace(/viewBox="[^"]+"/, `viewBox="${r(cx - W / 2)} ${r(cy - H / 2)} ${r(W)} ${r(H)}"`), x, y + 54, W, H)}</g>`;
    }).join('');
    return svg(2 * W + 20, Math.ceil(panels.length / 2) * (H + 66), '번호 도형 모음', body);
  }
  if(panels&&art.panelTitles)return titledPolygons(panels);
  if (panels) return figurePanels(panels, polygon, '번호 도형 모음', largePanels, art.panelColumns);
  if (open) {
    let body = line([55, 150], [245, 150], 'data-open="1" stroke-width="3"')+`<circle data-line-point="ㄱ" cx="55" cy="150" r="4" fill="${INK}"/><circle data-line-point="ㄴ" cx="245" cy="150" r="4" fill="${INK}"/>`;
    for (const end of extension) body += line(end === 0 ? [55,150] : [245,150], end === 0 ? [8,150] : [292,150], 'data-extension="1"');
    for (const end of endpoints) body += `<circle data-endpoint="${end}" cx="${end === 0 ? 55 : 245}" cy="150" r="5" fill="${INK}"/>`;
    body+=text(55,177,'ㄱ',20)+text(245,177,'ㄴ',20);
    return svg(300,300,'선 그림',`<g transform="rotate(${rotation} 150 150)">${body}</g>`);
  }
  let vertices=points;
  if(uprightLabels&&rotation){const a=rotation*Math.PI/180;vertices=points.map(([x,y])=>[5+(x-5)*Math.cos(a)-(y-5)*Math.sin(a),5+(x-5)*Math.sin(a)+(y-5)*Math.cos(a)]);
    const xs=vertices.map(p=>p[0]),ys=vertices.map(p=>p[1]),s=Math.min(1,7/Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))),cx=(Math.max(...xs)+Math.min(...xs))/2,cy=(Math.max(...ys)+Math.min(...ys))/2;
    vertices=vertices.map(([x,y])=>[5+(x-cx)*s,5+(y-cy)*s]);
  }
  const ps = vertices.map(([x, y]) => [30 + 24 * x, 30 + 24 * y]);
  const center = [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length];
  let body = poly(ps, SAGE);
  ps.forEach((p, i) => {
    const q = ps[(i + 1) % ps.length], prev = ps[(i + ps.length - 1) % ps.length];
    if (labels.sides?.[i]) {
      const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      let away = unit([q[1]-p[1],p[0]-q[0]]);
      if(away[0]*(mid[0]-center[0])+away[1]*(mid[1]-center[1])<0)away=away.map(n=>-n);
      const distance=labelsOutside?Math.max(24,Math.abs(away[0])*String(labels.sides[i]).length*fontSize*0.24+Math.abs(away[1])*fontSize*0.6+10):22;
      body += text(mid[0] + away[0] * distance, mid[1] + away[1] * distance+(uprightLabels?fontSize/3:0), labels.sides[i],fontSize);
    }
    if (labels.angles?.[i]) {
      const inward = unit([center[0] - p[0], center[1] - p[1]]);
      const numeric=/°|[?]/.test(labels.angles[i]),distance=numeric?Math.min(54,Math.min(Math.hypot(prev[0]-p[0],prev[1]-p[1]),Math.hypot(q[0]-p[0],q[1]-p[1]))*.34):(labelsOutside?-26:35);
      if(numeric){const a=unit([prev[0]-p[0],prev[1]-p[1]]),b=unit([q[0]-p[0],q[1]-p[1]]),d=Math.max(14,distance*.5),A=[p[0]+a[0]*d,p[1]+a[1]*d],B=[p[0]+b[0]*d,p[1]+b[1]*d];body+=`<path data-interior-arc="${i}" d="M${coords([A])} A${r(d)},${r(d)} 0 0 ${a[0]*b[1]-a[1]*b[0]>0?1:0} ${coords([B])}"/>`;}
      body += text(p[0] + inward[0] * distance, p[1] + inward[1] * distance+(uprightLabels?fontSize/3:0), labels.angles[i],fontSize);
    }
    if (labels.angleNumbers?.[i]) {
      const away=unit([p[0]-center[0],p[1]-center[1]]),at=[p[0]+away[0]*28,p[1]+away[1]*28];
      body+=`<circle cx="${r(at[0])}" cy="${r(at[1])}" r="13" fill="${CREAM}"/>`+text(at[0],at[1]+6,labels.angleNumbers[i],18);
    }
    if (marks.right?.includes(i)) {
      const R=Math.min(13*ms,Math.min(Math.hypot(prev[0]-p[0],prev[1]-p[1]),Math.hypot(q[0]-p[0],q[1]-p[1]))*.18);
      const a = unit([prev[0] - p[0], prev[1] - p[1]]), b = unit([q[0] - p[0], q[1] - p[1]]);
      body += `<polyline data-right="${i}" points="${coords([[p[0] + a[0] * R, p[1] + a[1] * R], [p[0] + (a[0] + b[0]) * R, p[1] + (a[1] + b[1]) * R], [p[0] + b[0] * R, p[1] + b[1] * R]])}"${markWidth}/>`;
    }
  });
  (marks.equal ?? []).forEach((group, g) => group.forEach((i) => {
    const p = ps[i], q = ps[(i + 1) % ps.length], u = unit([q[0] - p[0], q[1] - p[1]]);
    for (let k = 0; k <= g; k++) {
      const scale=Math.min(ms,Math.hypot(q[0]-p[0],q[1]-p[1])/60),shift=(k-g/2)*6*scale,fraction=(marks.parallel??[]).some(group=>group.includes(i))?.3:.45,x=p[0]+(q[0]-p[0])*fraction+u[0]*shift,y=p[1]+(q[1]-p[1])*fraction+u[1]*shift,t=6*scale;
      body += line([x - u[1] * t, y + u[0] * t], [x + u[1] * t, y - u[0] * t], `data-equal="${g}"${markWidth}`);
    }
  }));
  (marks.angles ?? []).forEach((group,g)=>group.forEach(i=>{
    const p=ps[i],prev=ps[(i+ps.length-1)%ps.length],q=ps[(i+1)%ps.length],a=unit([prev[0]-p[0],prev[1]-p[1]]),b=unit([q[0]-p[0],q[1]-p[1]]),mid=unit([a[0]+b[0],a[1]+b[1]]);
    const side=Math.min(Math.hypot(prev[0]-p[0],prev[1]-p[1]),Math.hypot(q[0]-p[0],q[1]-p[1]));
    const sweep=a[0]*b[1]-a[1]*b[0]>0?1:0;
    for(let k=0;k<=g;k++){const d=Math.min(side*.28,Math.max(side*.15,art.angleRadiusMin??0)+k*Math.min(art.markGap??8,side*.05)),A=[p[0]+a[0]*d,p[1]+a[1]*d],B=[p[0]+b[0]*d,p[1]+b[1]*d];body+=`<path data-angle-mark="${g}" fill="none" d="M${coords([A])} A${r(d)},${r(d)} 0 0 ${sweep} ${coords([B])}"/>`;}
  }));
  // 같은 길이 표시가 있는 변은 평행 표시를 변의 가운데에서 조금 비켜 둔다. 둘이 한 자리에 겹쳐 읽히지 않았다(검수 7번).
  (marks.parallel ?? []).forEach((group,g)=>group.forEach(i=>{
    const p=ps[i],q=ps[(i+1)%ps.length],ref=ps[group[0]],end=ps[(group[0]+1)%ps.length],raw=unit([q[0]-p[0],q[1]-p[1]]),sign=raw[0]*(end[0]-ref[0])+raw[1]*(end[1]-ref[1])<0?-1:1,u=raw.map(n=>n*sign),aside=(marks.equal??[]).some(group=>group.includes(i))?Math.hypot(q[0]-p[0],q[1]-p[1])*.2:0,x=(p[0]+q[0])/2+raw[0]*aside,y=(p[1]+q[1])/2+raw[1]*aside;
    for(let k=0;k<=g;k++){const scale=Math.min(ms,Math.hypot(q[0]-p[0],q[1]-p[1])/65),d=(k-g/2)*7*scale,c=5*scale;body+=`<polyline data-parallel="${g}" points="${coords([[x+u[0]*d-u[1]*c-u[0]*c,y+u[1]*d+u[0]*c-u[1]*c],[x+u[0]*d,y+u[1]*d],[x+u[0]*d+u[1]*c-u[0]*c,y+u[1]*d-u[0]*c-u[1]*c]])}"${markWidth}/>`;}
  }));
  for(const segment of art.segments??[]){
    const at=([x,y])=>[30+24*x,30+24*y],a=at(segment.a),b=at(segment.b);
    body+=line(a,b,'data-measurement="1" stroke-dasharray="4 3"');
    if(segment.measureOutside){
      const vertical=Math.abs(a[0]-b[0])<1e-6,left=Math.min(...ps.map(p=>p[0]))-16,bottom=Math.max(...ps.map(p=>p[1]))+16;
      const A=vertical?[left,Math.min(a[1],b[1])]:[Math.min(a[0],b[0]),bottom],B=vertical?[left,Math.max(a[1],b[1])]:[Math.max(a[0],b[0]),bottom];
      body+=dimension(A,B,segment.label,fontSize,vertical?-1:-1);
    }
    if(segment.label&&!segment.measureOutside){
      const label=at(segment.labelAt??[(segment.a[0]+segment.b[0])/2,(segment.a[1]+segment.b[1])/2]);
      // An exact label position describes its visual center, not its baseline.
      if(segment.labelExact)label[1]+=fontSize*.35;
      if(!segment.labelExact&&Math.abs(a[0]-b[0])<1e-6)label[0]=a[0]+(label[0]>=a[0]?1:-1)*(String(segment.label).length*fontSize*.28+12);
      if(!segment.labelExact&&Math.abs(a[1]-b[1])<1e-6)label[1]=a[1]-(fontSize*.6+4);
      body+=`<text data-measure-label="1" x="${r(label[0])}" y="${r(label[1])}" fill="${INK}" stroke="${CREAM}" stroke-width="4" paint-order="stroke" text-anchor="middle" font-size="${fontSize}">${esc(segment.label)}</text>`;
    }
    if(segment.rightAt==='b'){const u=unit([a[0]-b[0],a[1]-b[1]]),v=[-u[1],u[0]],q=[b[0]+u[0]*10,b[1]+u[1]*10];body+=`<polyline data-height-right="1" points="${coords([q,[q[0]+v[0]*10,q[1]+v[1]*10],[b[0]+v[0]*10,b[1]+v[1]*10]])}"/>`;}
  }
  if (rotation&&!uprightLabels) body = `<g transform="rotate(${rotation} 150 150)">${body}</g>`;
  if (hole) {
    const cut = hole.shape === 'circle' ? '<circle cx="150" cy="150" r="70"/>' : hole.points ? `<polygon points="${coords(hole.points)}"/>` : hole.shape === 'triangle' ? '<polygon points="150,85 98,175 202,175"/>' : '<polygon points="100,90 200,90 200,185 100,185"/>';
    body += `<g data-hole="${hole.shape}" transform="rotate(${hole.rotation ?? 0} 150 150)" fill="${CREAM}" stroke="${INK}" stroke-dasharray="5 3">${cut}</g>`;
  }
  if(art.segments?.some(s=>s.measureOutside)){
    const xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);
    for(const m of body.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)"[^>]*>([^<]*)<\/text>/g)){const half=m[3].length*fontSize*.3;xs.push(+m[1]-half,+m[1]+half);ys.push(+m[2]-fontSize,+m[2]+5);}
    const x=Math.min(...xs)-12,y=Math.min(...ys)-12,w=Math.max(...xs)-x+12,h=Math.max(...ys)-y+12;
    return svg(w,h,'길이와 높이가 표시된 다각형',body).replace(`viewBox="0 0 ${r(w)} ${r(h)}"`,`viewBox="${r(x)} ${r(y)} ${r(w)} ${r(h)}"`);
  }
  return svg(300, 300, '다각형 그림', hole||art.center===false?body:centeredBody(body,ps,300,300,uprightLabels?0:rotation));
}
function angle(art) {
  if(art.tickStep) return readableAngle(art);
  const {deg, protractor = false, arms = 'short', panels, rotation=0, armLengths, largePanels} = art;
  if (panels) return figurePanels(panels, angle, '번호 각 모음', largePanels);
  const cx = 160, cy = 164, len = arms === 'long' ? 135 : 115;
  const at = (d, l) => [cx+l*Math.cos((rotation-d)*Math.PI/180),cy+l*Math.sin((rotation-d)*Math.PI/180)];
  let body = '';
  if (protractor) {
    body += `<path d="M20 164 A140 140 0 0 1 300 164 Z" fill="${CREAM}"/>`;
    for (let d = 0; d <= 180; d++) {
      body += line(at(d, 140), at(d, d % 10 === 0 ? 127 : d % 5 === 0 ? 132 : 136), 'stroke-width="1"');
      if (d % 10 === 0) { const [x, y] = at(d, 109); body += text(x, y + 4, d, 11); }
    }
  }
  const end = at(deg,28),start=at(0,28);
  body += `<path d="M${coords([start])} A28 28 0 ${deg > 180 ? 1 : 0} 0 ${coords([end])}" stroke="${ORANGE}" stroke-width="3"/>`;
  body += line([cx, cy], at(0, armLengths?.[0] ?? len), 'data-arm="base" stroke-width="3"') + line([cx, cy], at(deg, armLengths?.[1] ?? len), 'data-arm="other" stroke-width="3"');
  return svg(320,300,'각 그림',centeredBody(body,[[cx,cy],at(0,armLengths?.[0]??len),at(deg,armLengths?.[1]??len)],320,300,0,[cx,cy]));
}
// 5도 눈금은 작은 화면에서도 8px 이상 떨어지게 그린다.
// 폰에서도 눈금 글자가 14px을 넘게(검수 14번): 바깥 눈금 수는 반원 바깥에, 안쪽 눈금 수는 눈금 안쪽에 두어 두 줄이 붙지 않는다.
// 그림 칸은 반원과 글자에 맞게 잘라 폰에서 카드 여백까지 넓힌다(art-bleed). 10도 사이가 세 자리 수 폭보다 좁은 줄은 세 자리 수만 글자 폭을 줄인다.
function readableAngle({deg,leftBase=false,tickStep=5}) {
  const cx=180,cy=196,R=150,F=16.5,outer=R+13,inner=R-27,at=(d,l)=>[cx+l*Math.cos(d*Math.PI/180),cy-l*Math.sin(d*Math.PI/180)];
  const label=(x,y,s,fit)=>`<text x="${r(x)}" y="${r(y)}" fill="${INK}" stroke="none" text-anchor="middle" font-size="${F}"${String(s).length>2?` textLength="${fit}" lengthAdjust="spacingAndGlyphs"`:''}>${s}</text>`;
  let body=`<path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy} Z" fill="${CREAM}"/>`;
  for(let d=0;d<=180;d+=tickStep){
    body+=line(at(d,R),at(d,R-(d%10===0?15:8)),`data-degree="${d}" stroke-width="1"`);
    if(d%10===0){const p=at(d,outer),q=at(d,inner),dy=d===0||d===180?20:6;body+=label(p[0],p[1]+dy,d,25)+label(q[0],q[1]+dy,180-d,20);}
  }
  body+=line([cx,cy],at(leftBase?180:0,R-3),'data-arm="base" stroke-width="4"')+line([cx,cy],at(leftBase?180-deg:deg,R-48),'data-arm="other" stroke-width="4"')+line(at(leftBase?180-deg:deg,R-12),at(leftBase?180-deg:deg,R-3),'data-arm-tip="1" stroke-width="4"')+`<circle data-protractor-center="1" cx="${cx}" cy="${cy}" r="4" fill="${INK}"/>`;
  return svg(360,224,'양쪽 눈금 각도기',body).replace('viewBox="0 0 360 224"','viewBox="2 20 356 204"');
}
function circle({ compass=false,r: radius, show = [], label, radiusLabel, diameterLabel, rotation=0, target }) {
  const R = 90, c = [130, 130];
  let body = `<circle cx="130" cy="130" r="${R}" fill="${CREAM}" data-radius="${radius}"/>`;
  if (show.includes('diameter')) body += line([40, 130], [220, 130], `data-diameter="1"${target==='diameter'?' stroke="'+ORANGE+'" stroke-width="5"':''}`);
  if (show.includes('radius')) body += line(c, show.includes('diameter') ? [130,40] : [220,130], `data-radius-line="1"${target==='radius'?' stroke="'+ORANGE+'" stroke-width="5"':''}`);
  if (show.includes('center')) body += `<circle data-center="1" cx="130" cy="130" r="${target==='center'?6:3}" fill="${target==='center'?ORANGE:INK}"/>`;
  if (rotation) body = `<g transform="rotate(${rotation} 130 130)">${body}</g>`;
  if (radiusLabel) body += text(show.includes('diameter')?165:175,show.includes('diameter')?80:118,radiusLabel,20);
  if (diameterLabel) body += compass?dimension([40,130],[220,130],diameterLabel,20,-90):text(130,158,diameterLabel,20);
  if (label) body += text(show.includes('diameter') ? 130 : 175, 118, label);
  if(compass)body+=`<g data-compass="1"><path d="M130 130 L175 30 L220 130" stroke-width="5"/><circle cx="175" cy="30" r="8" fill="${CREAM}"/>${dimension([130,137],[220,137],'? cm',18,-20)}</g>`;
  return svg(260,260,'원 그림',body);
}
function grid({ w, h, cells = [], after = [], line: axis, dot, dotRadius=4, showGrid=true, panels, reference, from, to, targets, labels, tiling, fromNumber=1, toName=2, symmetryOutline, distances=[],targetChoices=false }) {
  if(targetChoices)return svg(340,440,'옮긴 점과 색깔 보기',inset(grid({w,h,from,to,targets,fromNumber}),0,0,340,340)+panels.map((p,i)=>`<g data-panel="${p.number}"><circle cx="${42+i*85}" cy="385" r="16" fill="${p.color}"/>${text(42+i*85,420,p.number,26)}</g>`).join(''));
  if(panels){const s=figurePanels(panels,grid,'이동 전후 모눈');return reference?svg(340,Math.ceil(panels.length/2)*190+220,'기준 모양과 네 보기',text(170,20,0,22)+inset(grid(reference),85,25,170,155,'data-reference="1"')+inset(s,0,220,340,Math.ceil(panels.length/2)*190)):s;}
  if(tiling){
    const {n,scale,mirror}=tiling,m=Math.floor(n/2),odd=n%2,width=(m+odd)*scale+40;
    const target=odd?[[0,0],[m+1,0],[m,1],[0,1]]:[[0,0],[m,0],[m,1],[0,1]];
    const left=scale+85,baseY=45;
    let body=text(20+scale/2,24,1,22)+poly([[20,baseY],[20+scale,baseY],[20,baseY+scale]],SAGE,'data-sample="1"')+text(left+width/2-20,24,2,22);
    const points=target.map(([x,y])=>[left+(mirror?m+odd-x:x)*scale,baseY+y*scale]);
    body+=poly(points,CREAM,`data-tiling-area="${n/2}"`);
    for(let i=1;i<=m;i++)if(i<m||odd)body+=line([left+i*scale,baseY],[left+i*scale,baseY+scale],'data-tiling-guide="1" stroke-dasharray="4 5" stroke-opacity="0.5"');
    return svg(left+width,scale+65,'견본 삼각형과 빈 도형',body);
  }
  const X = (x) => 20 + x * 28, Y = (y) => 20 + y * 28;
  let body = showGrid?`<rect x="20" y="20" width="${w * 28}" height="${h * 28}" fill="${CREAM}"/>`:'';
  if(symmetryOutline)body+=poly(symmetryOutline.map(([x,y])=>[X(x),Y(y)]),SAGE,'data-point-symmetric="1" fill-opacity=".5"');
  for (const [set, color, name] of [[cells, SAGE, 'cell'], [after, PURPLE, 'after']]) for (const [x, y] of set) body += `<rect data-${name}="${x},${y}" x="${X(x)}" y="${Y(y)}" width="28" height="28" fill="${color}" fill-opacity="0.7"/>`;
  for (let x = 0; showGrid && x <= w; x++) body += line([X(x), Y(0)], [X(x), Y(h)], 'stroke-width="1"');
  for (let y = 0; showGrid && y <= h; y++) body += line([X(0), Y(y)], [X(w), Y(y)], 'stroke-width="1"');
  if (axis) body += axis === 'v' ? line([X(w / 2), Y(0)], [X(w / 2), Y(h)], 'stroke-dasharray="5 4" stroke-width="3"') : line([X(0), Y(h / 2)], [X(w), Y(h / 2)], 'stroke-dasharray="5 4" stroke-width="3"');
  if (dot) body += `<circle data-symmetry-center="1" cx="${X(dot[0])}" cy="${Y(dot[1])}" r="${dotRadius}" fill="${ORANGE}"/>`;
  for(const [p,n,color] of [[from,fromNumber,SAGE],[to,toName,PURPLE],...(targets??[]).map(p=>[p.to,p.number,p.color??PURPLE])])if(p){body+=`<circle data-point="${n}" cx="${X(p[0])}" cy="${Y(p[1])}" r="6" fill="${color}"/>`+text(Math.min(X(w)-2,X(p[0])+14),Math.max(32,Y(p[1])-10),n,24);}
  if(labels)for(const [set,n] of [[cells,1],[after,2]])if(set.length){const x=(Math.min(...set.map(p=>p[0]))+Math.max(...set.map(p=>p[0]))+1)/2,y=Math.min(...set.map(p=>p[1]));body+=text(X(x),Y(y)-10,n,24);}
  if(distances.length){const a=distances[0].a,b=distances[0].b;body+=line([X(from[0]),Y(from[1])],[X(to[0]),Y(to[1])],'data-distance="1"');if(dot)body+=text(X(dot[0]),Y(dot[1])+25,'중심',18);}
  for(const d of distances)body+=`<g data-distance-dimension="1">${dimension([X(d.a[0]),Y(d.a[1])],[X(d.b[0]),Y(d.b[1])],d.label,20,d.offset??24)}</g>`;
  return svg(w * 28 + 40, h * 28 + 40, showGrid?'모눈 그림':'대응점과 대칭의 중심', body);
}
function cuboid(type) {
  const equal = type === 'cube', left = equal ? 40 : 48, right = equal ? 80 : 110, z = equal ? 80 : 90;
  const p = [[35, 70], [35 + right, 70], [35 + right + left, 35], [35 + left, 35]];
  const down = p.map(([x, y]) => [x, y + z]);
  return poly([p[0], p[1], down[1], down[0]], TOY.sage[0]) + poly([p[1], p[2], down[2], down[1]], TOY.sage[2]) + poly(p, TOY.sage[1])
    + line(p[3], down[3], 'stroke-dasharray="5 4"') + line(down[0], down[3], 'stroke-dasharray="5 4"') + line(down[3], down[2], 'stroke-dasharray="5 4"');
}
// 1학년 물건 모양(상자·둥근기둥·공)은 장난감처럼 한 빛깔을 밝기만 달리해 칠한다: 앞면 그대로, 윗면 밝게, 옆면 어둡게, 공은 빛 한 점.
// 면마다 다른 빛깔(초록 앞면·주황 옆면·크림 윗면)은 눕히면 주황이 밑에 와 표시처럼 보였고, 크림 면은 안 칠한 것 같았다.
// 숨은 모서리·뒤쪽 점선은 5학년 겨냥도부터라 1학년 그림에는 긋지 않는다(10-21 Matto 「주황표시는 뭐야? … 뭐는 색칠되있고 뭐는 안되있냐」).
const TOY = { sage: [SAGE, '#cddbc6', '#8aa682'], orange: [ORANGE, '#f4cba3', '#cd8a50'], purple: [PURPLE, '#cdc3db', '#9182a8'], blue: ['#8fb9d2', '#c3dbe9', '#7398b3'] };
const TOY_HUE = { box: 'sage', tube: 'orange', ball: 'purple' };
function toyOne(type, [base, light, dark]) {
  if (type === 'box') {
    const p = [[35, 70], [145, 70], [193, 35], [83, 35]], q = p.map(([x, y]) => [x, y + 90]);
    return poly([p[0], p[1], q[1], q[0]], base) + poly([p[1], p[2], q[2], q[1]], dark) + poly(p, light);
  }
  if (type === 'tube') return `<path d="M65 55 V155 A65 22 0 0 0 195 155 V55" fill="${base}"/><ellipse cx="130" cy="55" rx="65" ry="22" fill="${light}"/>`;
  return `<circle cx="130" cy="105" r="72" fill="${base}"/><circle cx="97" cy="71" r="15" fill="${light}" stroke="none"/><circle cx="93" cy="67" r="5" fill="${CREAM}" stroke="none"/>`;
}
// 쌓기 그림의 작은 장난감 모양. 놓일 바닥 가운데(bx, by)에 그리고, 위에 올릴 자리(윗면 가운데)와 그린 둘레를 돌려준다.
// 공은 바닥 한 점에 닿고 그 위에는 아무것도 못 올린다.
const PIECE = { w: 50, h: 40, dx: 10, dy: 8, rx: 25, ry: 8, th: 42, R: 23 };
function toyPiece(shape, [bx, by], [base, light, dark] = TOY.sage) {
  const { w, h, dx, dy, rx, ry, th, R } = PIECE;
  if (shape === 'box') {
    const x0 = bx - w / 2 - dx / 2, y0 = by + dy / 2;
    const p = [[x0, y0 - h], [x0 + w, y0 - h], [x0 + w + dx, y0 - h - dy], [x0 + dx, y0 - h - dy]], q = p.map(([x, y]) => [x, y + h]);
    return { svg: poly([p[0], p[1], q[1], q[0]], base) + poly([p[1], p[2], q[2], q[1]], dark) + poly(p, light), top: [bx, by - h], rise: h, cap: dy / 2, below: dy / 2, half: w / 2 + dx / 2 };
  }
  if (shape === 'tube') return { svg: `<path d="M${r(bx - rx)} ${r(by - th)} V${r(by)} A${rx} ${ry} 0 0 0 ${r(bx + rx)} ${r(by)} V${r(by - th)}" fill="${base}"/><ellipse cx="${r(bx)}" cy="${r(by - th)}" rx="${rx}" ry="${ry}" fill="${light}"/>`, top: [bx, by - th], rise: th, cap: ry, below: ry, half: rx };
  return { svg: `<circle cx="${r(bx)}" cy="${r(by - R)}" r="${R}" fill="${base}"/><circle cx="${r(bx - R * .38)}" cy="${r(by - R * 1.38)}" r="${r(R * .22)}" fill="${light}" stroke="none"/>`, top: [bx, by - 2 * R], rise: 2 * R, cap: 0, below: 0, half: R };
}
// 바닥 가운데(gx, gy)부터 맞닿게 쌓는다. 아래 것부터 그려 위 것이 아래 것의 윗면을 가린다. 밑에 바닥 선.
function toyStack(items, [gx, gy]) {
  let at = [gx, gy], body = '', half = 0, below = 0;
  items.forEach((item, i) => {
    const piece = toyPiece(item.shape, at);
    if (!i) below = piece.below;
    half = Math.max(half, piece.half);
    body += `<g data-stack-item="${item.shape}" data-position="${i}">${piece.svg}</g>`;
    at = piece.top;
  });
  return line([gx - half - 3, gy + below + 3], [gx + half + 3, gy + below + 3], 'data-ground="1" stroke-width="3" stroke-opacity="0.55"') + body;
}
const stackHeight = (items) => items.reduce((sum, item) => sum + toyPiece(item.shape, [0, 0]).rise, 0) + toyPiece(items.at(-1).shape, [0, 0]).cap;
// 차례대로 쌓기(1학년 g1.solid.stack): 위 줄에는 놓을 차례(첫째·둘째…)대로 모양을 늘어놓고, 보기 칸마다 바닥에 맞닿게 쌓은 모양을 그린다.
// 전엔 모양을 칸마다 띄워 그려 쌓은 것으로 안 보였고, 위 그림도 쌓은 모양이라 「똑같은 것 고르기」였다(10-21 Matto 「쌓아져있지 않은데 보기가」).
const ORDINALS = ['첫째', '둘째', '셋째', '넷째'];
function orderStack({ order, panels }) {
  const slot = 82, rowTop = 112;
  const row = order.map((shape, i) => {
    const cx = 170 + slot * (i + .5 - order.length / 2);
    return `<g data-order="${i}">${text(cx, 24, ORDINALS[i], 20)}${toyPiece(shape, [cx, rowTop]).svg}</g>`;
  }).join('');
  const tallest = Math.max(...panels.map((p) => stackHeight(p.items))), gy = 44 + tallest, top = rowTop + 30, panelH = gy + 22;
  const body = panels.map((p, i) => `<g data-panel="${p.number}" transform="translate(${i * 85} ${top})">${text(42, 28, p.number, 26)}${toyStack(p.items, [42, gy])}</g>`).join('');
  return svg(340, top + panelH, '차례대로 쌓은 모양', `<g data-order-row="1">${row}</g>${body}`);
}
function solidOne({ type, n = 3, dims = [], edgeLengths, equalEdgeMarks=false, orientation = 0, stretch = [1, 1], diameter, unitGrid, noLabels=false, equator=true, fontSize=20, sideLabels=false, lengthUnit=' cm' }) {
  if(edgeLengths)return measuredCuboid(edgeLengths,equalEdgeMarks,orientation,unitGrid,noLabels,fontSize,sideLabels,lengthUnit);
  let body = '';
  if(type==='box'&&orientation%180!==0){body=toyOne(type,TOY.sage);stretch=[stretch[1]*1.1,stretch[0]*.7];orientation=0;}
  else if (['box', 'tube', 'ball'].includes(type)) body = toyOne(type, TOY.sage);
  else if (['cuboid', 'cube'].includes(type)) body = cuboid(type);
  else if (type === 'sphere') body = `<circle cx="130" cy="105" r="72" fill="${SAGE}"/>${equator?'<ellipse cx="130" cy="105" rx="72" ry="22" stroke-dasharray="5 4" stroke-opacity="0.4"/>':''}<circle cx="91" cy="67" r="7" fill="${CREAM}" stroke="none" fill-opacity="0.8"/>`;
  else if (['cylinder', 'cone'].includes(type)) {
    body = type === 'cone' ? `<path d="M65 155 L130 30 L195 155" fill="${SAGE}"/>` : `<path d="M65 55 V155 A65 22 0 0 0 195 155 V55" fill="${SAGE}"/>`;
    body += `<ellipse cx="130" cy="155" rx="65" ry="22" fill="${SAGE}" stroke-dasharray="5 4"/><path d="M65 155 A65 22 0 0 0 195 155"/>`;
    if (type !== 'cone') body += `<ellipse cx="130" cy="55" rx="65" ry="22" fill="${CREAM}"/>`;
  } else if (['prism', 'pyramid'].includes(type)) {
    body = polyhedronBody(type,n);
  } else return null;
  if (diameter && type === 'sphere') {
    const u=[72,0];
    body+=line([130-u[0],105-u[1]],[130+u[0],105+u[1]],'data-diameter="1"')+`<circle cx="130" cy="105" r="6" fill="${INK}"/>`+dimension([58,105],[202,105],diameter+' cm',22,-88);
  } else if (orientation || stretch.some((s) => s !== 1)) body = `<g transform="translate(130 108) rotate(${r(orientation)}) scale(${stretch.map(r).join(' ')}) translate(-130 -108)">${body}</g>`;
  if (!dims.length) return svg(260, diameter&&type==='sphere'?240:216, '입체 그림', body);
  body = `<g transform="translate(70 0)">${body}</g>`;
  dims.slice(0, 3).forEach((d, i) => {
    body += `<text x="${[160, 320, 8][i]}" y="${[214, 116, 118][i]}" fill="${INK}" stroke="${CREAM}" stroke-width="5" paint-order="stroke" text-anchor="${i === 2 ? 'start' : 'middle'}" font-size="${labelSize(370)}">${esc(d)}</text>`;
  });
  return svg(370, 244, '입체 그림', body);
}
const inset = (source, x, y, w, h, attrs = '') => source.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" ${attrs} `);
function figurePanels(panels, draw, label, large=false, columns=2) {
  // 길이가 적힌 입체 보기: 폰의 두 칸 보기 단추에서도 읽히게 번호 46, 길이 30으로 쓰고 높이 글자를 오른쪽에 둔다(줄이지 않고 제 크기로 담는다).
  if(large==='full')return svg(340,panels.length*320,label,panels.map((p,i)=>`<g data-panel="${p.number}">${text(170,40+i*320,p.number,46)}${inset(draw({...p,fontSize:30,sideLabels:true}),0,52+i*320,340,260,'overflow="visible"')}</g>`).join(''));
  if(large&&panels.some(p=>p.labels?.sides))return svg(340,panels.length*300,label,panels.map((p,i)=>`<g data-panel="${p.number}">${text(170,24+i*300,p.number,22)}${inset(draw(p),10,28+i*300,320,264)}</g>`).join(''));
  // 세 칸씩 놓으면(columns 3) 그림이 낮아진다(검수 12번). 폰에서 줄어드는 만큼 이름표를 키워 14px을 넘긴다.
  if(draw===polygon||draw===angle){
    const drawings=panels.map(p=>{
      const angleKind=draw===angle,source=draw(angleKind?p:{...p,uprightLabels:true});
      let points;
      if(angleKind){const deg=p.deg*Math.PI/180;points=[[0,0],[p.armLengths?.[0]??115,0],[(p.armLengths?.[1]??115)*Math.cos(deg),-(p.armLengths?.[1]??115)*Math.sin(deg)]];}
      else points=(p.outline??p.points).map(([x,y])=>[24*x,24*y]);
      const a=(p.rotation??0)*Math.PI/180,rotated=points.map(([x,y])=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]),xs=rotated.map(p=>p[0]),ys=rotated.map(p=>p[1]);
      let extent=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys));
      if(!angleKind)extent=Math.min(168,extent);
      const side=extent+32,cx=angleKind?160:150;
      return source.replace(/viewBox="[^"]+"/,`viewBox="${r(cx-side/2)} ${r(150-side/2)} ${r(side)} ${r(side)}"`);
    });
    // 같은 크기의 SVG 칸을 유지한다. 번호 때문에 잘린 그림 틀이 위로 치우치지 않게 하고, 실제 도형은 칸 한가운데에 놓는다.
    return svg(340,Math.ceil(panels.length/2)*190,label,panels.map((p,i)=>{
      const x=i%2*170,y=Math.floor(i/2)*190;
      return `<g data-panel="${p.number}"><rect data-panel-bounds="1" x="${x}" y="${y}" width="170" height="190" fill="none" stroke="none"/>${text(x+85,y+28,p.number,30)}${inset(drawings[i],x,y+18,170,155)}</g>`;
    }).join(''));
  }
  if(large){const c=columns,size=c>2?28:22,ty=c>2?26:22,iy=c>2?32:28;
    return svg(c*170,Math.ceil(panels.length/c)*190,label,panels.map((p,i)=>`<g data-panel="${p.number}">${text(85+i%c*170,ty+Math.floor(i/c)*190,p.number,size)}${inset(draw(p),i%c*170,iy+Math.floor(i/c)*190,170,155)}</g>`).join(''));}

  const body = panels.map((p,i) => `<g data-panel="${p.number}">${text(85+i%2*170,22+Math.floor(i/2)*190,p.number,22)}${inset(draw(p),i%2*170,28+Math.floor(i/2)*190,170,155)}</g>`).join('');
  return svg(340, Math.ceil(panels.length/2)*190, label, body);
}
function solid(art) {
  if(art.largePanels==='full')return figurePanels(art.panels,solidOne,'길이가 표시된 입체 모음','full');
  if (art.order) return orderStack(art);
  if (!art.panels && !art.items) return solidOne(art);
  const stack = (items) => items.map((item, i) => inset(solidOne({ type: item.shape ?? item.type }), 0, (items.length - i - 1) * 58, 120, 64, `data-stack-item="${item.shape ?? item.type}" data-position="${i}"`)).join('');
  if (!art.panels) return svg(120, art.items.length * 58 + 12, '쌓은 모양', stack(art.items));
  const isStack = !!art.target;
  const top = isStack ? art.target.length * 58 + 30 : 0;
  let body = isStack ? `<g data-target="1" transform="translate(110 0)">${stack(art.target)}</g>` : '';
  const panelH = isStack ? Math.max(...art.panels.map((p) => p.items.length)) * 58 + 35 : 160;
  art.panels.forEach((p, i) => {
    const x = (i % 2) * 170, y = top + Math.floor(i / 2) * panelH;
    body += `<g data-panel="${p.number}" transform="translate(${x} ${y})">`;
    body += p.items ? `<g transform="translate(25 24)">${stack(p.items)}</g>` : inset(solidOne(p), 12, 20, 146, 122, `data-solid="${p.type}"`);
    body += text(85, 18, p.number, 20) + '</g>';
  });
  return svg(340, top + Math.ceil(art.panels.length / 2) * panelH, '번호 모양 모음', body);
}
function net(art) {
  const { type, dims = [3, 3, 3], faces = [0, 1, 2, 3, 4, 5], cells, panels, faceNumbers }=art;
  if(['prism','cylinder'].includes(type))return detailedNet(art);
  if(panels)return figurePanels(panels,net,'번호 전개도 모음');
  if(cells){
    const minX=Math.min(...cells.map(p=>p[0])),minY=Math.min(...cells.map(p=>p[1])),w=Math.max(...cells.map(p=>p[0]))-minX+1,h=Math.max(...cells.map(p=>p[1]))-minY+1;
    const body=cells.map(([x,y],i)=>{x=20+(x-minX)*48;y=20+(y-minY)*48;return `<rect data-net-cell="${i}" x="${x}" y="${y}" width="48" height="48" fill="${CREAM}"/>`+(faceNumbers?text(x+24,y+32,faceNumbers[i],32):'');}).join('');
    return svg(w*48+40,h*48+40,'정육면체 전개도',body);
  }
  const [a, b, c] = (type === 'cube' ? [3, 3, 3] : dims).map((x) => x * 18);
  const x = 20 + c, y = 20 + b + c;
  const rects = [[x, y, a, b], [x, y - c, a, c], [x, y + b, a, c], [x - c, y, c, b], [x + a, y, c, b], [x, y - c - b, a, b]];
  const body = rects.map(([px, py, w, h], i) => faces.includes(i) ? `<rect data-face="${i}" x="${px}" y="${py}" width="${w}" height="${h}" fill="${i % 2 ? SAGE : CREAM}"/>` : '').join('');
  return svg(a + 2 * c + 40, 2 * b + 2 * c + 40, '전개도 그림', body);
}
// lengthUnit: 길이 뒤 글자. 문제 글에 단위를 쓰는 보기 단추는 ''로 숫자만 단다(글자 폭이 줄어 폰 두 칸에서도 14px를 넘는다).
function measuredCuboid([a,b,c],equalMarks,rotation,unitGrid,noLabels=false,F=20,side=false,lengthUnit=' cm'){
  const scale=(side?110:125)/Math.max(a,b,c),dx=b*scale*.55,dy=b*scale*.35,x=side?55:70,y=50+dy,w=a*scale,h=c*scale;
  const p=[[x,y],[x+w,y],[x+w+dx,y-dy],[x+dx,y-dy]],q=p.map(([x,y])=>[x,y+h]);
  let body=poly([p[0],p[1],q[1],q[0]],TOY.sage[0])+poly([p[1],p[2],q[2],q[1]],TOY.sage[2])+poly(p,TOY.sage[1]);
  if(unitGrid){
    const lerp=(u,v,t)=>u.map((n,i)=>n+(v[i]-n)*t);
    for(let i=1;i<a;i++){body+=line(lerp(p[0],p[1],i/a),lerp(q[0],q[1],i/a),'data-unit-grid-axis="a"');body+=line(lerp(p[0],p[1],i/a),lerp(p[3],p[2],i/a),'data-unit-grid-axis="a"');}
    for(let i=1;i<b;i++){body+=line(lerp(p[0],p[3],i/b),lerp(p[1],p[2],i/b),'data-unit-grid-axis="b"');body+=line(lerp(p[1],p[2],i/b),lerp(q[1],q[2],i/b),'data-unit-grid-axis="b"');}
    for(let i=1;i<c;i++){body+=line(lerp(p[0],q[0],i/c),lerp(p[1],q[1],i/c),'data-unit-grid-axis="c"');body+=line(lerp(p[1],q[1],i/c),lerp(p[2],q[2],i/c),'data-unit-grid-axis="c"');}
  }
  for(const [u,v]of unitGrid?[]:[[p[3],q[3]],[q[0],q[3]],[q[3],q[2]]])body+=line(u,v,'data-hidden-edge="1" stroke-dasharray="5 4"');
  // 길이는 겉 테두리 모서리 셋에 단다: 앞 아래(가로 a), 오른쪽 아래 비스듬한 모서리(세로 b), 높이 c는 앞 왼쪽 모서리(side 보기 단추면 오른쪽 뒤 모서리, 틀 폭이 줄어 폰 두 칸에서도 읽힌다).
  // 모서리 바깥에 나란한 치수선(양 끝에 짧은 막대)을 긋고 글자는 치수선 가운데 바깥에 둔다. 글자가 어느 모서리의 길이인지 선으로 보인다(10-21 Matto 「선이 없어서 이해가 안감」).
  const all=[...p,...q],middle=[all.reduce((s,t)=>s+t[0],0)/8,all.reduce((s,t)=>s+t[1],0)/8],gap=F*.45,cap=F*.25;
  const edges=[[q[0],q[1]],[q[1],q[2]],side?[q[2],p[2]]:[q[0],p[0]]];
  edges.forEach(([u,v],i)=>{const mid=[(u[0]+v[0])/2,(u[1]+v[1])/2],d=unit([v[0]-u[0],v[1]-u[1]]);
    let n=[d[1],-d[0]];if(n[0]*(mid[0]-middle[0])+n[1]*(mid[1]-middle[1])<0)n=n.map(t=>-t);
    if(!noLabels){
      const s=[a,b,c][i]+lengthUnit,far=gap+F*.2+Math.abs(n[0])*s.length*F*.28+Math.abs(n[1])*F*.42,at=(t,k)=>[t[0]+n[0]*k,t[1]+n[1]*k],u2=at(u,gap),v2=at(v,gap);
      body+=`<g data-dimension="${'abc'[i]}" stroke-width="1.3">${line(u2,v2)}${line(at(u2,-cap),at(u2,cap))}${line(at(v2,-cap),at(v2,cap))}</g>`;
      body+=text(mid[0]+n[0]*far,mid[1]+n[1]*far+F*.35,s,F).replace('stroke="none"',`stroke="${CREAM}" stroke-width="5" paint-order="stroke"`);
    }
    if(equalMarks)body+=line([mid[0]-d[1]*5,mid[1]+d[0]*5],[mid[0]+d[1]*5,mid[1]-d[0]*5],'data-edge-equal="1"');});
  if(side)return svg(340,260,'길이가 표시된 직육면체',body);
  const cx=(x+x+w+dx)/2,cy=(50+y+h)/2,xs=[x,x+w+dx],ys=[50,y+h];
  for(const m of body.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)"[^>]*>([^<]*)<\/text>/g)){const half=m[3].length*F*.3;xs.push(+m[1]-half,+m[1]+half);ys.push(+m[2]-F,+m[2]+5);}
  const W=2*Math.max(...xs.map(t=>Math.abs(t-cx)))+24,H=2*Math.max(...ys.map(t=>Math.abs(t-cy)))+24;
  return svg(W,H,'길이가 표시된 직육면체',body).replace(`viewBox="0 0 ${r(W)} ${r(H)}"`,`viewBox="${r(cx-W/2)} ${r(cy-H/2)} ${r(W)} ${r(H)}"`);
}
function cubes(art) {
  if(art.views)return spaceDrawing(art,cubes);
  const { heights, labels = {} }=art;
  // 같은 앞면의 위·아래·왼쪽·오른쪽을 묻는 저학년 그림은 앞에서 본다.
  if(art.front){
    const max=Math.max(...heights.flat()),size=44;
    const body=heights[0].map((h,x)=>Array.from({length:h},(_,z)=>{
      const px=18+x*size,py=18+(max-1-z)*size,label=labels[x+',0,'+z];
      return '<g data-cube="'+x+',0,'+z+'"><rect x="'+px+'" y="'+py+'" width="44" height="44" fill="'+SAGE+'"/>'+ (label?text(px+22,py+29,label,24):'')+'</g>';
    }).join('')).join('');
    return svg(36+heights[0].length*size,36+max*size,'앞에서 본 쌓기나무',body);
  }
  const maxH = Math.max(0, ...heights.flat()), rows = heights.length, cols = Math.max(...heights.map((row) => row.length));
  let body = '';
  const origin = 22 + rows * 22, top = 20 + maxH * 25;
  const cells = heights.flatMap((row, y) => row.map((height, x) => ({ height, x, y }))).sort((a, b) => a.x + a.y - b.x - b.y || a.y - b.y);
  for (const { height, x, y } of cells) for (let z = 0; z < height; z++) {
    const px = origin + (x - y) * 22, py = top + (x + y) * 11 - z * 25;
    const p = [[px, py - 25], [px + 22, py - 14], [px, py - 3], [px - 22, py - 14]];
    body += `<g data-cube="${x},${y},${z}">${poly([p[2], p[3], [px - 22, py + 11], [px, py + 22]], TOY.sage[0])}${poly([p[1], p[2], [px, py + 22], [px + 22, py + 11]], TOY.sage[2])}${poly(p, TOY.sage[1])}${labels[`${x},${y},${z}`] ? text(px - 11, py + 8, labels[`${x},${y},${z}`], 14) : ''} </g>`;
  }
  return svg((rows + cols) * 22 + 44, top + (rows + cols) * 11 + 30, '쌓기나무 그림', body);
}
// n개를 한 줄 max개 이하로 고르게 나눈 줄마다의 개수. 줄 수를 먼저 정하고(ceil(n/max)) 앞줄부터 하나씩 더 준다.
// 앞줄을 꽉 채우고 남은 것을 다음 줄에 두면 9개가 「위 8개·아래 1개」가 되어 하나만 떨어져 보였다(뿌리 6, Matto 「상자 모양 세기」).
// balancedRows(9, 5) → [5, 4], balancedRows(7, 3) → [3, 2, 2], balancedRows(8, 6) → [4, 4]
export function balancedRows(n, max) {
  if (!(n > 0)) return [];
  const rows = Math.ceil(n / Math.max(1, Math.floor(max) || n)), base = Math.floor(n / rows), extra = n % rows;
  return Array.from({ length: rows }, (_, i) => base + (i < extra ? 1 : 0));
}
// 고른 줄에 놓을 자리(칸 단위). row 몇째 줄, col 줄 안 차례, x 가로 자리(가장 긴 줄 왼쪽 끝이 0, 짧은 줄은 가운데로 민다).
// balancedCells(5, 3) → [{row:0,col:0,x:0}, {row:0,col:1,x:1}, {row:0,col:2,x:2}, {row:1,col:0,x:0.5}, {row:1,col:1,x:1.5}]
export function balancedCells(n, max) {
  const rows = balancedRows(n, max), widest = rows[0] ?? 0;
  return rows.flatMap((len, row) => Array.from({ length: len }, (_, col) => ({ row, col, x: col + (widest - len) / 2 })));
}
function objects({ items, columns, panels, groups, groupsLayout,growth }) {
  if (groups) {
    if(growth){
      const {base,step}=growth,baseCols=Math.ceil(base/4),levels=Math.max(Math.min(base,4),step),H=levels*42+50,W=(baseCols+2)*42+24;
      const body=groups.map((_,i)=>{let s=text(i*W+W/2,26,ORDINALS[i],24);const cells=Array.from({length:base},(_,k)=>[Math.floor(k/4),levels-Math.min(4,base-Math.floor(k/4)*4)+k%4,false]);for(let col=0;col<i;col++)for(let row=0;row<step;row++)cells.push([baseCols+col,levels-step+row,col===i-1]);return `<g data-group="${i}">${s}${cells.map(([x,y,added])=>`<rect data-growth="${added?'new':'old'}" x="${i*W+12+x*42}" y="${44+y*42}" width="32" height="32" fill="${added?PURPLE:SAGE}"/>`).join('')}</g>`;}).join('');
      return svg(groups.length*W,H,'한 기둥씩 늘어나는 세 모양',body);
    }
    const rows = Math.max(1, ...groups.map(items => Math.ceil(items.reduce((n, x) => n + x.n, 0) / 4)));
    // 단계마다 한 칸씩 옆으로 놓는다. 세로로 쌓으면 답 칸이 한참 아래였다(검수 12번). 「1번째」는 폰에서도 14px 넘게 30으로 쓴다.
    if(groupsLayout==='columns'){
      const cols=3,most=Math.max(...groups.map(items=>items.reduce((n,x)=>n+x.n,0))),w=cols*44+14,h=Math.max(1,Math.ceil(most/cols))*50+22,gap=24;
      const body=groups.map((items,i)=>`<g data-group="${i}">${text(i*(w+gap)+w/2,28,ORDINALS[i],30)}${inset(objects({items,columns:cols}).replace(/viewBox="[^"]+"/,`viewBox="0 0 ${w} ${h}"`),i*(w+gap),44,w,h)}</g>`).join('');
      return svg(groups.length*(w+gap)-gap,44+h,'늘어나는 세 모양',body);
    }
    if(groupsLayout==='vertical'){
      const height=rows*50+22,step=height+34;
      const body=groups.map((items,i)=>`<g data-group="${i}">${text(101,i*step+24,ORDINALS[i],22)}${inset(objects({items,columns:4}).replace(/viewBox="[^"]+"/,`viewBox="0 0 202 ${height}"`),0,i*step+34,202,height)}</g>`).join('');
      return svg(202,groups.length*step,'늘어나는 세 모양',body);
    }
    const body = groups.map((items, i) => `<g data-group="${i}">${inset(objects({ items, columns: 4 }).replace(/viewBox="[^"]+"/, `viewBox="0 0 202 ${rows * 50 + 22}"`), i * 155, 0, 145, 145)}</g>`).join('');
    return svg(groups.length * 155, 150, '늘어나는 모양', body);
  }
  if (panels) {
    const top = items ? 130 : 0;
    let body = items ? inset(objects({ items, columns:columns??items.reduce((n,p)=>n+p.n,0) }), 0, 0, 440, 120) : '';
    panels.forEach((p, i) => {
      const x = i % 2 * 220, y = top + Math.floor(i / 2) * 120;
      // 번호도 칸 묶음 안에 둔다: 카드가 칸을 오려 보기 단추로 쓴다(app/card.js panelChoices).
      body += `<g data-panel="${p.number}">${text(x + 110, y + 20, p.number, 20)}${inset(objects({ items: p.items, columns: p.items.length }), x + 40, y + 25, 140, 80)}</g>`;
    });
    return svg(440, top + Math.ceil(panels.length / 2) * 120, '번호 모양 모음', body);
  }
  const shapes = items.flatMap((item) => Array.from({ length: item.n }, () => item));
  const mixedHues=shapes.some(item=>(item.hue??TOY_HUE[item.shape]??'sage')!=='orange');
  // 한 줄 칸 수(columns)는 줄마다의 최대다. 줄은 고르게 나누고 짧은 줄은 가운데로 민다(balancedRows).
  // columns를 안 주면 무늬 줄(빈칸 「?」이 있는 줄)은 한 줄로 두고, 세기 그림은 한 줄 5개까지(1학년은 5개씩 묶어 센다: 9 → 5+4, 7 → 4+3).
  const max = columns ?? (shapes.some((s) => s.shape === 'blank') ? shapes.length : 5);
  const rows = balancedRows(shapes.length, max), cells = balancedCells(shapes.length, max);
  let body = '';
  shapes.forEach(({ shape, rotation = 0, color, size = 1, position, points, hue }, i) => {
    const x = position?.[0] ?? 15 + cells[i].x * 44, y = position?.[1] ?? 16 + cells[i].row * 50;
    // 상자·둥근기둥·공은 한 빛깔의 밝기만 달리한다(toyOne과 같은 칠). hue를 주면 그 빛깔, 없으면 모양마다 정한 빛깔.
    const chosenHue=hue??TOY_HUE[shape]??'sage';
    const [base, light, dark] = TOY[chosenHue==='orange'&&mixedHues?'blue':chosenHue];
    let obj;
    if(points||['triangle','square'].includes(shape)){
      const raw=points??(shape==='triangle'?[[16,2],[1,32],[31,32]]:[[2,3],[30,3],[30,31],[2,31]]),a=rotation*Math.PI/180,ps=raw.map(([x,y])=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]),xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]),w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys),s=28/Math.max(w,h),sx=Math.max(s,18/w),sy=Math.max(s,18/h),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
      obj=poly(ps.map(([x,y])=>[16+(x-cx)*sx,18+(y-cy)*sy]),SAGE);
      rotation=0;
    }
    else if (shape === 'ball') obj = `<circle cx="16" cy="18" r="14" fill="${base}"/><circle cx="11" cy="12" r="3.5" fill="${light}" stroke="none"/>`;
    else if (shape === 'circle') obj = `<circle cx="16" cy="18" r="14" fill="${SAGE}"/>`;
    else if (shape === 'tube') obj = `<path d="M3 7 V30 A13 5 0 0 0 29 30 V7" fill="${base}"/><ellipse cx="16" cy="7" rx="13" ry="5" fill="${light}"/>`;
    else if (shape === 'box') obj = poly([[2, 10], [22, 10], [22, 32], [2, 32]], base) + poly([[2, 10], [10, 3], [30, 3], [22, 10]], light) + poly([[22, 10], [30, 3], [30, 25], [22, 32]], dark);
    else if (shape === 'triangle') obj = poly([[16, 2], [1, 32], [31, 32]], SAGE);
    else if (shape === 'blank') obj = `<g data-blank="1"><rect data-blank-box="1" x="0" y="1" width="32" height="34" fill="${CREAM}" stroke-dasharray="4 3"/>${text(16,27,'?',28)}</g>`;
    else obj = `<rect x="2" y="3" width="28" height="28" fill="${SAGE}"/>`;
    if (color) obj = obj.replace(/fill="#[a-fA-F0-9]+"/g, `fill="${({ 빨간: '#d98980', 파란: '#8fb9d2', 노란: '#ead38b', 보라: PURPLE })[color] ?? color}"`);
    if (size !== 1) obj = `<g transform="translate(16 18) scale(${size}) translate(-16 -18)">${obj}</g>`;
    if (rotation) obj = `<g transform="rotate(${r(rotation)} 16 18)">${obj}</g>`;
    body += `<g data-object="${shape}" transform="translate(${x} ${y})">${obj}</g>`;
  });
  if(shapes.length===1)return svg(160,100,'모양 모음',`<g transform="translate(18 -18) scale(2)">${body}</g>`);
  return svg((rows[0] ?? 0) * 44 + 26, rows.length * 50 + 22, '모양 모음', body);
}
// 나중 뺀 점의 보라 빗금: 점 위에 「/」 방향 금 세 줄. 먼저 뺀 점의 갈색 X와 모양·빛깔이 다 달라 한눈에 갈린다.
const LATER_MARK = '#7a679c';
const hatch = (cx, cy, R = 15) => [-7, 0, 7].map((d) => {
  const h = Math.sqrt(R * R - d * d) / Math.SQRT2, ox = cx + d / Math.SQRT2, oy = cy + d / Math.SQRT2;
  return `M${r(ox - h)} ${r(oy + h)} L${r(ox + h)} ${r(oy - h)}`;
}).join(' ');
// crossed: 수 하나면 끝에서 그만큼 갈색 X(전과 같다).
// [b, c]면 두 번 뺀 것이다(세 수 빼기 7−3−1, 10을 갈라 빼기). 먼저 뺀 b개는 끝에서 갈색 X, 나중 뺀 c개는 그 앞에서 보라 빗금이다.
// 전엔 한 수(b + c)만 받아 X가 한 덩어리로 이어져 7−3−1이 7−4처럼 보였다(C-3, Matto 「세 수 빼기」, 「지우는 표시 색을 나눈다」).
// 점은 1~n칸에 그대로 둔다. 십 칸 판은 칸 자리로 수를 읽어서(위 줄 5, 아래 줄 5) 두 무리 사이를 띄우면 「7은 5와 2」 꼴이 깨진다.
// 두 무리는 표시 모양과 빛깔로만 가른다(10-22 검토, FIXPLAN의 「한 칸 띄움」을 바꿈).
function tenframe({ n, groups, crossed = 0, slots }) {
  let body = '';
  // 묶음(groups)마다 빛깔을 바꾼다. 세 수 더하기는 세 빛깔이다(검수 9번, 1학년 식 옆 그림).
  const colors = [SAGE, ADDED, PURPLE], groupOf = (i) => { let k = 0; for (let end = groups[0]; k < groups.length - 1 && i >= end; end += groups[++k]); return k; };
  const twoSteps = Array.isArray(crossed), clamp = (v, hi) => Math.min(hi, Math.max(0, v || 0));
  const [first, later] = twoSteps ? [clamp(crossed[0], n), clamp(crossed[1], n - clamp(crossed[0], n))] : [crossed, 0];
  const split = n - first;
  // 십 칸 판 둘(11~20)은 옆으로 나란히 둔다. 위아래로 쌓으면 폰 첫 화면에서 답 칸이 밀려났다(검수 13번).
  const at = (i) => [15 + i % 5 * 42 + Math.floor(i / 10) * 230, 15 + Math.floor(i % 10 / 5) * 42];
  for (let i = 0; i < (n > 10 ? 20 : 10); i++) {
    const [x, y] = at(i);
    body += `<rect x="${x}" y="${y}" width="42" height="42" fill="${CREAM}"/>`;
    const dot=slots?slots.indexOf(i):i;
    if (dot >= 0 && dot < n) body += `<circle data-dot="${i}"${groups ? ` data-group="${groupOf(i)}"` : ''} cx="${x + 21}" cy="${y + 21}" r="13" fill="${groups ? colors[groupOf(i)] : SAGE}"/>`;
  }
  for (let i = split; i < n; i++) {
    const [x, y] = at(i);
    body += `<path data-crossed="${i}"${twoSteps ? ' data-cross-step="1"' : ''} d="M${x + 8} ${y + 8} l26 26 m0 -26 l-26 26" stroke="${INK}" stroke-width="3"/>`;
  }
  for (let i = Math.max(0, split - later); i < split; i++) {
    const [x, y] = at(i);
    body += `<path data-crossed="${i}" data-cross-step="2" d="${hatch(x + 21, y + 21)}" stroke="${LATER_MARK}" stroke-width="3"/>`;
  }
  return svg(n > 10 ? 470 : 240, 114, '십 칸 판', body);
}
// 수 모형. hundreds·tens·ones는 그릴 전체 수다.
// added {hundreds, tens, ones}: 그 가운데 끝에서 몇 개가 더한 몫인지. 더한 몫은 파랑으로 칠한다(A1-5, 54+5의 5).
// crossed {hundreds, tens, ones}: 그 가운데 끝에서 몇 개를 뺐는지. 뺀 것은 옅게 칠하고 갈색 X를 긋는다. 묶음(10)과 낱개(1)를 따로 센다(A1-5, 87−33).
// 낱개는 한 줄 5개씩, 묶음 아래끝에 맞춰 아래 줄부터 쌓는다. 전엔 오른쪽 위에 한 줄로 붙어 아래가 비었다(C-28).
const ADDED = '#8fb9d2';
function blocks({ hundreds = 0, tens = 0, ones = 0, added = {}, crossed = {}, tensRows = 1 }) {
  let body = '', x = 16;
  const bottom=hundreds?18+Math.ceil(hundreds/3)*99-9:108+(tensRows-1)*102,oneSize=hundreds?28:9;
  const mark = (value, i, count) => {
    const name = { 100: 'hundreds', 10: 'tens', 1: 'ones' }[value];
    return { add: i >= count - (added[name] ?? 0), cross: i >= count - (crossed[name] ?? 0) };
  };
  const piece = (value, i, count, cells, color, box) => {
    const { add, cross } = mark(value, i, count);
    const fill = add ? ADDED : color, fade = cross ? ' fill-opacity="0.35"' : '';
    const cellSize=value===1?oneSize:9;
    const rects = cells.map(([cx, cy]) => `<rect x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" fill="${fill}"${fade} stroke-width="0.8"/>`).join('');
    let x2 = '';
    if (cross) {
      // X 반폭: 백 판은 판 모서리까지, 묶음 막대는 막대 가운데에(나란히 뺀 막대끼리 X가 맞닿지 않게 옆 틈 9의 1/3까지), 낱개는 옆 틈(3) 안에서.
      const [bx, by, bw, bh] = box, mx = bx + bw / 2, my = by + bh / 2;
      const half = value === 100 ? [bw / 2 + 3, bh / 2 + 3] : value === 10 ? [6, 13] : [bw/2, bh/2];
      x2 = `<path data-cross="1" d="M${r(mx - half[0])} ${r(my - half[1])} L${r(mx + half[0])} ${r(my + half[1])} M${r(mx + half[0])} ${r(my - half[1])} L${r(mx - half[0])} ${r(my + half[1])}" stroke="${INK}" stroke-width="${value === 1 ? 2 : 2.5}"/>`;
    }
    return `<g data-block="${value}"${add ? ' data-added="1"' : ''}${cross ? ' data-crossed="1"' : ''}>${rects}${x2}</g>`;
  };
  for (const [count, value, columns, rows, color] of [[hundreds, 100, 10, 10, SAGE], [tens, 10, 1, 10, ORANGE]]) {
    for (let i = 0; i < count; i++) {
      const bx=value===100?16+i%3*99:hundreds?x:25+Math.floor(i/tensRows)*18,by=value===100?18+Math.floor(i/3)*99:hundreds?bottom-90:18+(i%tensRows)*102;
      const cells = [];
      for (let y = 0; y < rows; y++) for (let col = 0; col < columns; col++) cells.push([bx + col * 9, by + y * 9]);
      body += piece(value, i, count, cells, color, [bx, by, columns * 9, rows * 9]);
      if(value!==100)x=hundreds?x+18:25+Math.ceil((i+1)/tensRows)*18;
    }
    if(value===100&&count)x=16+Math.min(count,3)*99;
    x += 9;
  }
  if (ones > 0) {
    // 낱개 한 칸은 묶음 한 칸과 같은 9이고 사이를 3 띄운다. 아래 줄 아래끝이 묶음 아래끝(18 + 90)이다.
    // 표시 무리(지운 몫·더한 몫)는 끝에서 marked개다. 남는 몫과 표시 무리가 둘 다 5개 이하면 줄로 가른다:
    // 아래 줄에 남는 몫, 그 위 줄에 표시 무리(87−33은 아래 4·위 지운 3, 54+5는 아래 보라 4·위 파랑 5).
    // 한 무리가 5를 넘으면 앞에서부터 5개씩 쌓아, 표시 무리가 줄 끝에 이어 붙어 한 덩어리로 보인다.
    // 전엔 5개씩 쌓기만 해서 7−3의 지운 셋이 아래 줄 끝 하나와 위 줄 둘로 흩어졌다(10-22 검토).
    const pitch = oneSize+3,unitBottom=bottom-oneSize,maxCols=hundreds?3:5;
    const marked = Math.min(ones, Math.max(added.ones ?? 0, crossed.ones ?? 0)), rest = ones - marked;
    const split = marked > 0 && rest > 0 && marked <= maxCols && rest <= maxCols;
    const slot = (i) => split ? (i < rest ? [i, 0] : [i - rest, 1]) : [i % maxCols, Math.floor(i / maxCols)];
    let widest = 0;
    for (let i = 0; i < ones; i++) {
      const [col, row] = slot(i), cx = x + col * pitch, cy = unitBottom - row * pitch;
      widest = Math.max(widest, col + 1);
      body += piece(1, i, ones, [[cx, cy]], PURPLE, [cx, cy, oneSize, oneSize]);
    }
    if(hundreds)body+=text(x+Math.max(96,(widest-1)*pitch+oneSize)/2,Math.max(26,unitBottom-Math.ceil(ones/maxCols)*pitch),'낱개 확대',20);
    x += Math.max(hundreds?96:0,(widest - 1) * pitch + oneSize) + 9;
  }
  x += 9;
  return svg(Math.max(100, x), hundreds?bottom+24:bottom+22, '수 모형', body);
}
function numberline({ from, to, step, marks = [], range }) {
  if (!(to > from && step > 0) || (to - from) / step > 200) throw new RangeError('수직선 눈금 범위가 잘못됐어요.');
  const W = Math.max(320, ((to - from) / step) * 36 + 60), X = (v) => 30 + (v - from) / (to - from) * (W - 60);
  const size = labelSize(W), axisY = Math.max(50, size * 1.5 + 12);
  const ticks = Math.floor((to - from) / step + 1e-9);
  const digits = Math.max(String(from).length, String(to).length, String(step).length);
  const stride = Math.max(1, Math.ceil((digits * size * 0.65 + 12) / ((W - 60) / ticks)));
  let body = line([20, axisY], [W - 20, axisY]);
  for (let i = 0; i <= ticks; i++) {
    const v = r(from + i * step), x = X(v);
    body += line([x, axisY - 5], [x, axisY + 5], `data-tick="${v}"`);
    if (range ? Math.abs(v-range.from)<1e-8||Math.abs(v-range.to)<1e-8||([range.from,range.to].every(n=>Math.abs(n-v)>=stride*step)&&i%stride===0) : i % stride === 0 || (i === ticks && ticks % stride >= stride / 2)) body += text(x, axisY + size + 12, v, size);
  }
  if (range) {
    const rangeX=end=>range[`${end}Infinite`]?(end==='from'?8:W-8):X(range[end]);
    body += line([rangeX('from'), axisY], [rangeX('to'), axisY], `stroke="${ORANGE}" stroke-width="6"`);
    for (const end of ['from', 'to']) {
      if(range[`${end}Infinite`]){const x=rangeX(end),d=end==='from'?1:-1;body+=`<polyline data-range-arrow="${end}" points="${coords([[x+d*9,axisY-7],[x,axisY],[x+d*9,axisY+7]])}" stroke="${ORANGE}" stroke-width="3"/>`;}
      else body += `<circle data-end="${end}" cx="${r(X(range[end]))}" cy="${r(axisY)}" r="5" fill="${range[`${end}Open`] ? CREAM : INK}"/>`;
    }
  }
  marks.forEach(({ at, label }) => { body += `<circle data-mark="${at}" cx="${r(X(at))}" cy="${r(axisY)}" r="4" fill="${PURPLE}"/>`; if (label != null) body += text(X(at), axisY - 20, label, size); });
  return svg(W, axisY + size + 30, '수직선 그림', body);
}
const FIGURES = { polygon, angle, circle, grid, solid, net, cubes, objects };
const MODELS = { tenframe, blocks, numberline };
export function drawFigure(art) {
  const source=FIGURES[art?.kind]?.(art)??null;
  if(!source||!art.expand)return source;
  // 남는 가로 칸을 쓰되, 폰·세로 화면과 보기 단추의 배율 제한은 그대로 둔다.
  const style='<style>@media(min-width:1024px) and (min-aspect-ratio:1/1){svg.figure-art[data-expand-art]:not(.picture-rest){width:100%}svg.figure-art[data-expand-art].picture-rest{min-width:100%;max-height:32vh}}</style>';
  return source.replace('<svg ','<svg data-expand-art="1" ').replace(/(<svg[^>]*>)/,`$1${style}`);
}
export function drawModel(art) { return MODELS[art?.kind]?.(art) ?? ''; }
