const INK='#8a6a55',COLORS=['#a8bfa0','#e8a46a','#a99bbd'],CREAM='#fbf3e4';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const r=n=>Math.round(n*1000)/1000;
const text=(x,y,s,size=20)=>`<text x="${r(x)}" y="${r(y)}" text-anchor="middle" fill="${INK}" stroke="none" font-size="${size}">${esc(s)}</text>`;
export function percentGraph({kind,values,labels,title='항목별 비율',percentTicks:step}){
 if(values.reduce((a,b)=>a+b,0)!==100||values.some(n=>n<=0||n%step!==0))throw Error('Percentage segments must sum to 100 and align with ticks');
 const pie=kind==='pie',legendY=pie?370:188;
 let body=text(180,25,title,22),start=0;
 if(pie){
  const point=(p,radius)=>[180+radius*Math.cos((p*3.6-90)*Math.PI/180),185+radius*Math.sin((p*3.6-90)*Math.PI/180)];
  values.forEach((n,i)=>{const a=point(start,105),b=point(start+n,105);body+=`<path data-percent="${n}" data-share="${r(n*3.6)}" d="M180 185 L${a.map(r).join(' ')} A105 105 0 ${n>50?1:0} 1 ${b.map(r).join(' ')} Z" fill="${COLORS[i]}"/>`;start+=n;});
  for(let p=0;p<100;p+=step){const a=point(p,108),b=point(p,119);body+=`<line data-tick-unit="${step}" x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}"/>`;if(p%25===0){const q=point(p,140);body+=text(q[0],q[1]+6,p+'%',18);}}
 }else{
  for(let p=0;p<=100;p+=step)body+=`<line data-tick-unit="${step}" x1="${20+3.2*p}" x2="${20+3.2*p}" y1="88" y2="145"/>${p%Math.max(step,10)===0?text(20+3.2*p,78,p,18):''}`;
  values.forEach((n,i)=>{body+=`<rect data-percent="${n}" x="${20+3.2*start}" y="94" width="${3.2*n}" height="50" fill="${COLORS[i]}"/>`;start+=n;});
  for(let p=0;p<=100;p+=step)body+=`<line x1="${20+3.2*p}" x2="${20+3.2*p}" y1="94" y2="104"/>`;
  body+=text(326,54,'(%)',18);
 }
 labels.forEach((s,i)=>{body+=`<rect x="${12+i*118}" y="${legendY-16}" width="17" height="17" fill="${COLORS[i]}"/>${text(69+i*118,legendY,s,20)}`;});
 return `<svg xmlns="http://www.w3.org/2000/svg" class="life-art" role="img" aria-label="${pie?'원':'띠'}그래프" viewBox="0 0 360 ${legendY+24}" fill="${CREAM}" stroke="${INK}" stroke-width="1.5">${body}</svg>`;
}
