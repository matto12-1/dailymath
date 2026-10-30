// Extra solid/net contracts. Existing drawings keep their original fields and dimensions.
const INK='#8a6a55',SAGE='#a8bfa0',LIGHT='#cddbc6',DARK='#8aa682',CREAM='#fbf3e4';
const r=n=>Math.round(n*1000)/1000;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const svg=(w,h,label,body)=>`<svg xmlns="http://www.w3.org/2000/svg" class="figure-art" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round">${body}</svg>`;
const text=(x,y,s,size=16)=>`<text x="${r(x)}" y="${r(y)}" font-size="${size}" text-anchor="middle" fill="${INK}" stroke="${CREAM}" stroke-width="3" paint-order="stroke">${esc(s)}</text>`;
const inset=(s,x,y,w,h)=>s.replace('<svg ',`<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
const polygon=ps=>`<polygon points="${ps.map(p=>p.map(r).join(',')).join(' ')}" fill="${CREAM}"/>`;
export function polyhedronBody(type,n){
 let phase=({3:90,4:30,5:50,6:15})[n]??20;
 if(type==='pyramid'){
  let best=-1;
  for(let p=.5;p<360/n;p+=.5){const angles=Array.from({length:n},(_,i)=>{const a=(i*360/n+p)*Math.PI/180;return Math.atan2(137+34*Math.sin(a),78*Math.cos(a));}).sort((a,b)=>a-b),gap=Math.min(...angles.slice(1).map((a,i)=>a-angles[i]));if(gap>best){best=gap;phase=p;}}
 }
 const base=Array.from({length:n},(_,i)=>{const a=(i*360/n+phase)*Math.PI/180;return [130+78*Math.cos(a),151+34*Math.sin(a)];}),top=base.map(([x,y])=>[x,y-100]),apex=[130,14];
 const visible=base.map((p,i)=>(p[1]+base[(i+1)%n][1])/2>151);
 const edge=(a,b,hidden=false)=>`<line data-solid-edge="1"${hidden?' data-hidden-edge="1" stroke-dasharray="5 4"':''} x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}"/>`;
 let body='',visibleIndex=0;
 base.forEach((p,i)=>{const j=(i+1)%n;if(visible[i])body+=polygon(type==='prism'?[p,base[j],top[j],top[i]]:[p,base[j],apex]).replace(`fill="${CREAM}"`,`fill="${visibleIndex++%2?DARK:SAGE}"`);});
 if(type==='prism')body+=polygon(top).replace(`fill="${CREAM}"`,`fill="${LIGHT}"`);
 base.forEach((p,i)=>{const j=(i+1)%n;body+=edge(p,base[j],!visible[i])+edge(p,type==='prism'?top[i]:apex,!visible[i]&&!visible[(i+n-1)%n]);});
 if(type==='prism')top.forEach((p,i)=>body+=edge(p,top[(i+1)%n]));
 return `<g data-base-sides="${n}">${body}</g>`;
}
// widthOnly: 옆면 가로 길이만 쓴다(보기 넷이 지름·높이를 같이 쓸 때, 그 길이는 문제 글에 있다).
function oneNet(p,commonScale,panelWidth=180,size=19,widthOnly=false){
 const cylinder=p.type==='cylinder',n=cylinder?1:p.n,side=cylinder?p.rectWidth:p.stripSide,width=side*n,height=p.height,U=p.lengthUnit??' cm';
 const baseSize=cylinder?p.diameter:p.side/(2*Math.sin(Math.PI/n))*2;
 const scale=commonScale??Math.min(250/(width+baseSize),180/(height+2*baseSize)),x=20+baseSize*scale/2,y=(widthOnly?8:22+size)+baseSize*scale;
 const H=height*scale;
 let body='',bottomEdge=null,maxY=y+H;
 for(let i=0;i<n;i++)body+=`<rect data-net-side="${i}" x="${r(x+i*side*scale)}" y="${r(y)}" width="${r(side*scale)}" height="${r(H)}" fill="${SAGE}"/>`;
 if(cylinder){
  const radius=p.diameter*scale/2,cx=x+width*scale*(.25+.25*(p.topIndex??1)),bottomX=x+width*scale*(.25+.25*(p.bottomIndex??1));
  for(const [center,cy] of [[cx,y-radius],[bottomX,y+H+radius]])body+=`<circle data-net-base="1" cx="${r(center)}" cy="${r(cy)}" r="${r(radius)}" fill="${CREAM}"/>`;
  body+=`<line data-diameter="${p.diameter}" x1="${r(cx-radius)}" x2="${r(cx+radius)}" y1="${r(y-radius)}" y2="${r(y-radius)}"/>`;
  if(!widthOnly)body+=text(cx,y-2*radius-10,p.diameter+' cm',size);
 }else{
  for(const [index,bottom] of [[p.topIndex??0,false],[p.bottomIndex??0,true]]){
   let px=x+index*side*scale,py=y+(bottom?H:0);const ps=[[px,py]];
   for(let i=0;i<n-1;i++){px+=p.side*scale*Math.cos(i*2*Math.PI/n);py+=(bottom?1:-1)*p.side*scale*Math.sin(i*2*Math.PI/n);ps.push([px,py]);}
   body+=`<g data-net-base="1">${polygon(ps)}</g>`;
   maxY=Math.max(maxY,...ps.map(p=>p[1]));
   if(bottom){const edges=ps.map((a,i)=>[a,ps[(i+1)%ps.length]]).sort((a,b)=>(b[0][1]+b[1][1])-(a[0][1]+a[1][1]));bottomEdge=edges[0];}
  }
  if(bottomEdge){const [a,b]=bottomEdge,dy=18;body+=`<path data-base-dimension="1" d="M${r(a[0])} ${r(a[1]+dy)} L${r(b[0])} ${r(b[1]+dy)} M${r(a[0])} ${r(a[1]+dy-4)} v8 M${r(b[0])} ${r(b[1]+dy-4)} v8"/>`+text((a[0]+b[0])/2,(a[1]+b[1])/2+dy+size,p.side+U,size);}
 }
 if(cylinder){
  const bottom=y+H+baseSize*scale+18;
  body+=`<path data-net-width-dimension="1" d="M${r(x)} ${r(bottom-5)} v10 M${r(x)} ${r(bottom)} h${r(width*scale)} M${r(x+width*scale)} ${r(bottom-5)} v10"/>`+text(x+width*scale/2,bottom+size+5,p.hideWidth?'? cm':`${r(width)} cm`,size);
 }
 else{
  const index=(p.topIndex??0)<n/2?n-1:0,left=x+index*side*scale,right=left+side*scale,dy=y-10;
  body+=`<path data-strip-measure="${r(side)}" d="M${r(left)} ${r(dy+4)} V${r(dy-4)} M${r(left)} ${r(dy)} H${r(right)} M${r(right)} ${r(dy+4)} V${r(dy-4)}"/>`+text((left+right)/2,dy-6,r(side)+U,size);
 }
 // 원기둥 높이 글자는 옆면 오른쪽에 둔다. 옆면이 좁아 가로 길이 글자가 옆면 밖으로 나오면 그 글자 끝보다 오른쪽에 둔다(글자 폭은 한 글자 0.56em로 어림).
 const half=s=>String(s).length*size*.28,widthEnd=x+width*scale/2+half(p.hideWidth?'? cm':`${r(width)} cm`);
 const heightX=cylinder?Math.max(x+width*scale+14+size,widthEnd+8+half(height+U)):x+width*scale+8+half(height+U);
 if(!widthOnly)body+=text(heightX,y+H/2+size*.3,height+U,size);
 // 높이 글자가 그림 칸 밖으로 나가면 칸을 넓힌다(한 장짜리 원기둥 전개도에서 「8 cm」가 「8 c」로 잘렸다).
 return svg(Math.max(panelWidth,Math.ceil(widthOnly?widthEnd+6:heightX+half(height+U)+6)),Math.ceil(cylinder?y+H+baseSize*scale+size+50:maxY+size+40),'밑면과 옆면의 길이가 표시된 전개도',body);
}
export function detailedNet(art){
 if(!art.panels)return oneNet(art);
 const cylinder=art.type==='cylinder',columns=cylinder?1:2,panelWidth=360;
 const scale=cylinder?Math.min(...art.panels.map(p=>Math.min(280/(p.rectWidth+p.diameter),170/(p.height+2*p.diameter)))):Math.min(...art.panels.map(p=>Math.min(360/(p.stripSide*p.n+p.side/Math.sin(Math.PI/p.n)),250/(p.height+2*p.side/Math.sin(Math.PI/p.n)))));
 if(cylinder){
  // 원기둥 전개도 보기: 번호를 칸 왼쪽에 두면 보기 단추가 낮아져 폰 한 화면에 넷이 든다. 길이 글자는 28(화면이 낮으면 카드가 그림을 줄이는데, 글자가 클수록 더 줄일 수 있다).
  // 줄여도 글자는 14px 아래로 안 내려가서(검수 14번) 22로는 넷이 한 화면에 안 들었다.
  const drawings=art.panels.map(p=>oneNet(p,scale,400,28,!!art.widthOnly)),sizes=drawings.map(s=>+s.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1]),rowHeight=Math.max(...sizes)+16;
  return svg(450,art.panels.length*rowHeight,'번호 전개도',art.panels.map((p,i)=>`<g data-panel="${p.number}">${text(22,i*rowHeight+rowHeight/2+10,p.number,30)}${inset(drawings[i],50,i*rowHeight+8,400,sizes[i])}</g>`).join(''));
 }
 // 두 칸 보기 단추(폭 약 124px)에서도 길이 글자가 14px 넘게 22로 쓴다(검수 14번).
 const raw=art.panels.map(p=>oneNet({...p,lengthUnit:''},scale,panelWidth,30)),tileWidth=Math.max(...raw.map(s=>+s.match(/viewBox="0 0 ([\d.]+)/)[1]));
 const drawings=raw.map(s=>s.replace(/viewBox="0 0 [\d.]+ /,`viewBox="0 0 ${tileWidth} `)),sizes=drawings.map(s=>+s.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1]),rowHeight=Math.max(...sizes)+58;
 const body=art.panels.map((p,i)=>`<g data-panel="${p.number}">${text(i%columns*tileWidth+tileWidth/2,Math.floor(i/columns)*rowHeight+40,p.number,46)}${inset(drawings[i],i%columns*tileWidth,Math.floor(i/columns)*rowHeight+58,tileWidth,sizes[i])}</g>`).join('');
 return svg(tileWidth*columns,Math.ceil(art.panels.length/columns)*rowHeight,'번호 전개도',body);
}
function planar(heights,view,showHeights){
 const rows=heights.length,cols=heights[0].length,front=heights[0].map((_,x)=>Math.max(...heights.map(row=>row[x]))),side=heights.map(row=>Math.max(...row));
 const values=view==='top'?heights.slice().reverse():view==='front'?front:side;
 const columns=view==='top'?cols:values.length,levels=view==='top'?rows:Math.max(...values,1),size=28,x=(160-columns*size)/2,y=32;
 let body=text(80,22,{top:'위',front:'앞',side:'옆'}[view],22);
 for(let row=0;row<levels;row++)for(let col=0;col<columns;col++){
  const on=view==='top'?values[row][col]>0:values[col]>=levels-row;
  body+=`<rect data-view-cell="${col},${row}" data-occupied="${on}" x="${x+col*size}" y="${y+row*size}" width="${size}" height="${size}" fill="${on?SAGE:CREAM}" stroke-opacity="${on?1:.2}"/>`;
  if(view==='top'&&showHeights&&on)body+=text(x+(col+.5)*size,y+(row+.7)*size,values[row][col],22);
 }
 if(view==='top')body+=text(80,y+rows*size+24,'앞',22);
 if(view==='side')body+=text(x+size/2,y+levels*size+24,'앞',18);
 return svg(160,164,'방향에서 본 모양',`<g data-view="${view}">${body}</g>`);
}
export function spaceDrawing(art,drawIso){
 const iso=h=>{
  const source=drawIso({heights:h.slice().reverse()}),vb=source.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/),w=+vb[1],height=+vb[2];
  const body=inset(source,18,0,w,height)+text(w*.25+18,height+16,'앞',18)+text(w*.8+18,height+16,'옆',18);
  return svg(w+36,height+34,'앞과 옆이 표시된 쌓기나무',body);
 };
 const views=art.views??['iso'];
 if(views.length===1&&!art.panels)return iso(art.heights);
 const width=art.panels?480:360,cell=art.panels?160:180,rows=Math.ceil(views.length/(width/cell)),top=rows*184;
 let body=views.map((view,i)=>inset(view==='iso'?iso(art.heights):planar(art.heights,view,art.topHeightLabels),i%(width/cell)*cell,Math.floor(i/(width/cell))*184,cell,174)).join('');
 if(art.panels)body+=art.panels.map((p,i)=>`<g data-panel="${p.number}">${text(i%2*240+120,top+22+Math.floor(i/2)*220,p.number,24)}${inset(iso(p.heights),i%2*240+30,top+30+Math.floor(i/2)*220,180,180)}</g>`).join('');
 return svg(width,top+(art.panels?Math.ceil(art.panels.length/2)*220:0),'쌓기나무와 여러 방향의 모양',body);
}
