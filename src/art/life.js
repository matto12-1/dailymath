// 생활 수학 옆 간단한 그림을 코드(SVG)로 그린다. 숫자가 문제와 정확히 맞아야 하므로 그림 파일을 쓰지 않는다(DECISIONS 10-14).
// 실제 지폐·동전 도안을 쓰지 않는다. 그림체 A1: 따뜻한 갈색 얇은 선, 옅은 색.
import { labelSize } from './labels.js?v=9a67f36b25';
import { percentGraph } from './percent-graphs.js?v=9a67f36b25';
import { drawFigure, balancedRows, balancedCells } from './figure.js?v=9a67f36b25';
const INK = '#8a6a55';
const CREAM = '#fbf3e4';
const SAGE = '#a8bfa0';
const ORANGE = '#e8a46a';
const PURPLE = '#a99bbd';
const SKY = '#cfe0e8';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const r1 = (n) => Math.round(n * 1000) / 1000;
const svg = (w, h, label, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="life-art" role="img" aria-label="${esc(label)}" viewBox="0 0 ${w} ${h}" font-family="Jua, sans-serif" fill="none" stroke-linecap="round">${body}</svg>`;
const text = (x, y, s, size = 14, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="${INK}" stroke="none"${extra}>${esc(s)}</text>`;

function money({ bills = [], coins = [], tag = null }) {
  const parts = [];
  let x = 8;
  for (const b of bills) {
    parts.push(`<g data-bill="${b}"><rect x="${x}" y="16" width="104" height="52" rx="6" fill="${SAGE}" stroke="${INK}" stroke-width="2"/><circle cx="${x + 24}" cy="42" r="11" stroke="${INK}" stroke-width="1.5"/>${text(x + 66, 48, `${b}원`, 16)}</g>`);
    x += 112;
  }
  for (const c of coins) {
    parts.push(`<g data-coin="${c}"><circle cx="${x + 22}" cy="42" r="20" fill="${ORANGE}" stroke="${INK}" stroke-width="2"/>${text(x + 22, 47, String(c), 13)}</g>`);
    x += 48;
  }
  if (tag !== null) {
    parts.push(`<g data-tag="${tag}"><path d="M${x + 4} 42 L${x + 20} 20 H${x + 92} V64 H${x + 20} Z" fill="${CREAM}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle cx="${x + 22}" cy="42" r="3.5" stroke="${INK}" stroke-width="1.5"/>${text(x + 58, 48, `${tag}원`, 16)}</g>`);
    x += 100;
  }
  return svg(x + 8, 84, '돈 그림', parts.join(''));
}

export function clockAngles(h, m) {
  return { hour: r1(((h % 12) * 30 + m * 0.5) % 360), minute: (m * 6) % 360 };
}
export function clearClockHands(h,m,s) {
  const a=clockAngles(h,m),gap=(a,b)=>Math.min(Math.abs(a-b)%360,360-Math.abs(a-b)%360);
  const hour=a.hour+(s??0)/120,minute=a.minute+(s??0)/10;
  return gap(hour,minute)>=10 && (s===undefined || (gap(s*6,hour)>=12 && gap(s*6,minute)>=12));
}

function clock({ h, m, seconds, secondDuration, panels, duration, remainingMinutes }) {
  if (secondDuration) {
    const turns=Array.from({length:secondDuration/60},(_,i)=>{const radius=50-i*4;return `<g data-second-turn="${i+1}"><path d="M70 ${70-radius} A${radius} ${radius} 0 1 1 ${r1(70-radius/Math.sqrt(2))} ${r1(70-radius/Math.sqrt(2))}" stroke="${PURPLE}" stroke-width="2"/><path d="M${r1(62-radius/Math.sqrt(2))} ${r1(71-radius/Math.sqrt(2))} l8 -1 l-1 8" stroke="${PURPLE}" stroke-width="2"/></g>`;}).join('');
    return clock({h:12,m:0,seconds:0}).replace('</svg>',turns+'</svg>');
  }
  if (duration) {
    const turns=Array.from({length:duration/60},(_,i)=>{const r=32-i*10,end=r1(70-r/Math.sqrt(2));return `<g data-duration="${duration}" data-turn="${i+1}"><path d="M70 ${70-r} A${r} ${r} 0 1 1 ${end} ${end}" stroke="${PURPLE}" stroke-width="3"/><path d="M${end-8} ${end+1} L${end} ${end} L${end-1} ${end+8}" stroke="${PURPLE}" stroke-width="3"/></g>`;}).join('');
    return clock({h:12,m:0}).replace(/<line data-hand="[^"]+"[^>]*\/>/g,'').replace('</svg>',turns+'</svg>');
  }
  if (panels) {
    const body = panels.map((p, i) => `<g data-panel="${p.number}" transform="translate(${(i % 2) * 160} ${Math.floor(i / 2) * 170})">${text(80, 22, p.number, 20)}${clock(p).replace('<svg ', '<svg x="10" y="28" width="140" height="140" ')}</g>`).join('');
    return svg(320, Math.ceil(panels.length / 2) * 170, '번호 시계 모음', body);
  }
  const a = clockAngles(h, m);
  if(seconds!==undefined){a.hour=r1(a.hour+seconds/120);a.minute=r1(a.minute+seconds/10);}
  // 긴바늘은 작은 눈금까지 닿는다. 숫자 고리에서는 선을 끊어 수를 가리지 않는다.
  const nums = [];
  for (let i = 1; i <= 12; i++) {
    const rad = ((i * 30 - 90) * Math.PI) / 180;
    nums.push(`<text class="clock-num" x="${r1(70 + Math.cos(rad) * 42)}" y="${r1(76 + Math.sin(rad) * 42)}" font-size="18" text-anchor="middle" fill="${INK}" stroke="none">${i}</text>`);
  }
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const len = i % 5 === 0 ? 6 : 3;
    ticks.push(`<line x1="70" y1="10" x2="70" y2="${10 + len}" stroke="${INK}" stroke-width="${i % 5 === 0 ? 2 : 1}" transform="rotate(${i * 6} 70 70)"/>`);
  }
  return svg(140, 140, '시계 그림',
    `<circle cx="70" cy="70" r="62" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>${ticks.join('')}` +
    `<line data-hand="hour" data-angle="${a.hour}" x1="70" y1="70" x2="70" y2="42" stroke="${INK}" stroke-width="5" transform="rotate(${a.hour} 70 70)"/>` +
    `<line data-hand="minute" data-angle="${a.minute}" x1="70" y1="70" x2="70" y2="12" stroke="${INK}" stroke-width="3.5" stroke-linecap="butt" stroke-dasharray="32 24 2" transform="rotate(${a.minute} 70 70)"/>` +
    `${seconds===undefined?'':`<line data-hand="second" data-angle="${seconds*6}" x1="70" y1="78" x2="70" y2="12" stroke="${ORANGE}" stroke-width="1.8" stroke-linecap="butt" stroke-dasharray="40 24 2" transform="rotate(${seconds*6} 70 70)"/>`}<circle cx="70" cy="70" r="4" fill="${INK}" stroke="none"/>${nums.join('')}`);
}

function ruler({ cm, from = null, to = null, estimate, reference = 1, unitLabel, segments, caption, lengths, targetLabel, segmentObject, object, hundredMarks, fontSize=17, startCm=0, mmSpacing, wide }) {
  if (estimate) {
    const factor = 290 / Math.max(estimate,reference);
    return svg(340, 160, '기준과 어림할 막대', `<rect data-reference="${reference}" x="25" y="28" width="${r1(reference*factor)}" height="15" rx="3" fill="${SAGE}" stroke="${INK}"/>${text(Math.max(52,25+reference*factor/2),20,reference+' '+unitLabel,22)}<rect data-estimate="${estimate}" x="25" y="100" width="${r1(estimate*factor)}" height="15" rx="3" fill="${ORANGE}" stroke="${INK}"/>${targetLabel?text(170,142,targetLabel,22):''}`);
  }
  if (segments) {
    const segmentW=unitLabel==='m'?46:24,start=targetLabel?94:20,W=Math.max(340,start+segments*segmentW+20);
    const body = Array.from({length:segments}, (_,i)=>{const x=start+i*segmentW;return `<g data-segment="${i}">${segmentObject==='클립'?`<path d="M${x+5} 100 V82 Q${x+12} 71 ${x+19} 82 V96 Q${x+12} 107 ${x+5} 96 V85 Q${x+12} 78 ${x+14} 85 V95" stroke="${INK}" stroke-width="2"/>`:`<rect x="${x}" y="78" width="${segmentW}" height="32" fill="${i%2?SAGE:CREAM}" stroke="${INK}"/>`}${unitLabel==='m'?text(x+segmentW/2,101,'1 m',22):''}</g>`;}).join('');
    const end=start+segments*24,tip=targetLabel==='연필'||targetLabel==='크레파스';
    const target=targetLabel?`${text(42,62,targetLabel,20)}<rect x="${start}" y="48" width="${segments*24}" height="16" rx="${tip?1:8}" fill="${ORANGE}" stroke="${INK}"/>${tip?`<path d="M${end-14} 48 L${end} 56 L${end-14} 64 Z" fill="${CREAM}" stroke="${INK}"/>`:''}${text(42,97,segmentObject,20)}`:'';
    return svg(W,124,'같은 길이 조각',body+target+(targetLabel?'':text(W/2,28,caption??('한 칸 1 '+unitLabel),22)));
  }
  if (lengths) {
    const factor = 280 / Math.max(...lengths.map(x=>x.value));
    return svg(340,lengths.length*65+(hundredMarks?50:20),'길이 막대',lengths.map((p,i)=>`<g data-length="${p.value}">${text(170,i*65+20,p.label,fontSize)}<rect x="25" y="${i*65+32}" width="${r1(p.value*factor)}" height="16" rx="4" fill="${i%2?SAGE:PURPLE}" stroke="${INK}"/>${hundredMarks?Array.from({length:Math.floor(p.value/100)},(_,j)=>`<line data-hundred="${j+1}" x1="${r1(25+(j+1)*100*factor)}" y1="${i*65+30}" x2="${r1(25+(j+1)*100*factor)}" y2="${i*65+50}" stroke="${INK}"/>`).join('')+`<path d="M25 ${i*65+56} v6 h${r1(100*factor)} v-6" stroke="${INK}"/>`+text(25+50*factor,i*65+82,'100 cm',fontSize):''}</g>`).join(''));
  }
  const spacing=mmSpacing?mmSpacing*10:30;
  const X = (c) => 20 + (c-startCm) * spacing;
  const w = cm*spacing+40;
  const size = mmSpacing?18:cm<=15?22:labelSize(w), digits = String(Math.max(0, cm - 1)).length;
  const stride = cm<=15?1:Math.max(1, Math.ceil((digits * size * 0.65 + 6) / spacing));
  const endAnchor = String(cm).length * size * 0.65 / 2 > 20;
  const tailGap = cm<=15?1:endAnchor ? Math.ceil((String(cm).length * size * 0.975 + 6) / spacing) : stride;
  const rulerHeight = Math.max(44, size + 24), labelY = 72 + size;
  const parts = [`<rect x="10" y="50" width="${w - 20}" height="${rulerHeight}" rx="4" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>`];
  for (let mm = 0; mm <= cm * 10; mm++) {
    const x = r1(20+mm/10*spacing);
    const len = mm % 10 === 0 ? 16 : mm % 5 === 0 ? 11 : 6;
    parts.push(`<line x1="${x}" y1="50" x2="${x}" y2="${50 + len}" stroke="${INK}" stroke-width="${mm % 10 === 0 ? 1.6 : 1}"/>`);
  }
  for (let c = 0; c <= cm; c++) {
    if (c === 0 || c === cm || (c % stride === 0 && cm - c >= tailGap)) parts.push(`<text class="cm-num" x="${20+c*spacing}" y="${labelY}" font-size="${size}" text-anchor="${c === cm && endAnchor ? 'end' : c === 0 && endAnchor ? 'start' : 'middle'}" fill="${INK}" stroke="none">${c+startCm}</text>`);
  }
  const tip=object==='연필'||object==='크레파스';
  const bar = from !== null && to !== null
    ? `<g data-from="${from}" data-to="${to}"><rect class="bar" x="${X(from)}" y="${object==='끈'?42:32}" width="${X(to) - X(from)}" height="${object==='끈'?8:18}" rx="${tip?1:9}" fill="${ORANGE}" stroke="${INK}" stroke-width="2"/>${tip?`<path d="M${X(to)-16} 32 L${X(to)} 41 L${X(to)-16} 50 Z" fill="${CREAM}" stroke="${INK}"/>`:''}${object==='연필'?`<rect x="${X(from)}" y="32" width="5" height="18" fill="${PURPLE}" stroke="${INK}"/>`:''}</g>`
    : '';
  const result=svg(w, 60 + rulerHeight, '자 그림', bar + parts.join(''));
  return mmSpacing?`<div class="ruler-layout" style="display:flex;flex-direction:column;width:100%;min-width:0;align-items:center"><p class="ruler-hint" hidden style="font-size:14px">옆으로 밀어 눈금을 읽어요.</p><div class="ruler-scroll" style="width:100%;overflow-x:auto;display:flex">${result.replace('<svg ',`<svg style="width:${w}px;max-width:none;height:${60+rulerHeight}px;flex-shrink:0;margin-inline:auto" `)}</div></div>`:result;
}

function scale(art) {
  const {g,max,step,object,blankUnit,panels}=art;
  if(panels||blankUnit)return objectCards(art);
  if(step){
    const labelStep=art.labelStep??step*2,angle=r1(g/max*360),ticks=[];
    for(let value=0;value<max;value+=step){const deg=value/max*360,rad=(deg-90)*Math.PI/180;
      ticks.push(`<line data-tick="${value}" x1="150" y1="20" x2="150" y2="${value%labelStep===0?36:28}" stroke="${INK}" transform="rotate(${deg} 150 150)"/>`);
      if(value%labelStep===0)ticks.push(text(r1(150+99*Math.cos(rad)),r1(159+99*Math.sin(rad)),value,28));}
    const fruitColor=object?.includes('사과')?'#d98980':object?.includes('감자')?'#cfae85':object?.includes('귤')?ORANGE:'#ead38b';
    const fruit=object?.includes('바나나')?[0,1,2].map(i=>`<path transform="translate(${i*7} ${i*2})" d="M22 23 Q31 49 53 35 Q45 62 27 48 Q19 38 22 23 Z"/>`).join(''):[0,1,2].map(i=>`<ellipse cx="${29+i*13}" cy="${37+i%2*8}" rx="10" ry="10"/>`).join('');
    const bag=`<g data-bag="${esc(object)}" transform="translate(316 64)"><path d="M20 0 H64 L58 12 Q84 38 70 62 H14 Q0 38 26 12 Z" fill="${CREAM}" stroke="${INK}" stroke-width="2"/><path d="M23 9 H61" stroke="${INK}"/><g fill="${fruitColor}" stroke="${INK}">${fruit}</g></g>`;
    const dial=`<circle cx="150" cy="150" r="130" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>${ticks.join('')}<line data-angle="${angle}" x1="150" y1="150" x2="150" y2="29" stroke="${ORANGE}" stroke-width="3" transform="rotate(${angle} 150 150)"/><circle cx="150" cy="150" r="4" fill="${INK}"/><path d="M285 204 H358 V139 M310 128 H410 V139 H310 Z" fill="${SAGE}" stroke="${INK}" stroke-width="2"/>`;
    // 다이얼(y 18.5~281.5) 위아래의 빈 띠를 잘라 세로 화면에서도 작은 눈금 사이가 8px을 넘게 한다.
    return svg(440,266,'무게 저울',`<g transform="translate(0 -17)">${dial+bag+text(358,180,object??'',28)+text(150,200,'g',28)}</g>`);
  }
  const angle = r1((g / max) * 360);
  const ticks = [];
  for (let i = 0; i < 10; i++) {
    const rad = ((i * 36 - 90) * Math.PI) / 180;
    ticks.push(`<line x1="70" y1="22" x2="70" y2="32" stroke="${INK}" stroke-width="2" transform="rotate(${i * 36} 70 78)"/>`);
    if (i % 2 === 0) ticks.push(`<text x="${r1(70 + Math.cos(rad) * 30)}" y="${r1(82 + Math.sin(rad) * 30)}" font-size="14" text-anchor="middle" fill="${INK}" stroke="${CREAM}" stroke-width="3" paint-order="stroke">${(max / 10) * i}</text>`);
  }
  return svg(140, 150, '저울 그림',
    `<rect x="30" y="4" width="80" height="10" rx="5" fill="${SAGE}" stroke="${INK}" stroke-width="2"/><rect x="62" y="14" width="16" height="8" fill="${SAGE}" stroke="${INK}" stroke-width="2"/>` +
    `<circle cx="70" cy="78" r="56" fill="${CREAM}" stroke="${INK}" stroke-width="3"/>${ticks.join('')}` +
    `<line data-angle="${angle}" x1="70" y1="78" x2="70" y2="34" stroke="${ORANGE}" stroke-width="3.5" transform="rotate(${angle} 70 78)"/><circle cx="70" cy="78" r="4" fill="${INK}" stroke="none"/>` +
    `<rect x="40" y="136" width="60" height="10" rx="4" fill="${SAGE}" stroke="${INK}" stroke-width="2"/>`);
}

function cup(art) {
  const {ml,max,step,object,panels,blankUnit}=art;
  if(panels||blankUnit)return objectCards(art);
  if(step){const height=240,y=280,labelStep=art.labelStep??step*2,water=ml/max*height;let body=text(130,24,object??'',22)+`<rect data-ml="${ml}" x="45" y="${r1(y-water)}" width="155" height="${r1(water)}" fill="${SKY}"/><path d="M45 34 V280 H200 V34 M200 80 h18 v125 h-18" stroke="${INK}" stroke-width="3"/>`;
    for(let v=0;v<=max;v+=step){const at=r1(y-v/max*height);body+=`<line data-tick="${v}" x1="45" y1="${at}" x2="${v%labelStep===0?68:v%50===0?61:54}" y2="${at}" stroke="${INK}"/>`;if(v%labelStep===0)body+=text(98,v===0?at-4:at+5,v,18,' stroke-width="3" paint-order="stroke"').replace('stroke="none"',`stroke="${CREAM}"`);}
    return svg(280,320,'들이 그릇',body+text(130,312,'mL',20));}
  const H = 120;
  const water = r1((ml / max) * H);
  const ticks = [];
  for (let i = 1; i <= 10; i++) {
    const y = r1(140 - (H * i) / 10);
    ticks.push(`<line x1="40" y1="${y}" x2="${i % 2 === 0 ? 56 : 50}" y2="${y}" stroke="${INK}" stroke-width="1.5"/>`);
    if (i % 2 === 0) ticks.push(`<text x="60" y="${r1(y + 4)}" font-size="14" text-anchor="start" fill="${INK}" stroke="none">${(max / 10) * i}</text>`);
  }
  return svg(150, 156, '들이 그릇 그림',
    `<rect class="water" x="40" y="${r1(140 - water)}" width="80" height="${water}" fill="${SKY}" stroke="none"/>` +
    `<path d="M40 14 V140 H120 V14" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M120 40 h16 v50 h-16" stroke="${INK}" stroke-width="3"/>${ticks.join('')}`);
}

function calendar({ year, month, marks = [] }) {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const W = 40;
  const rows = Math.ceil((first + days) / 7);
  const parts = [`<rect x="4" y="4" width="${W * 7 + 8}" height="${52 + rows * W}" rx="8" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>`];
  // 요일·날짜는 폰에서 14px 넘게 15로 쓴다(검수 14번).
  parts.push(text(4 + (W * 7 + 8) / 2, 26, `${year}년 ${month}월`, 17));
  ['일', '월', '화', '수', '목', '금', '토'].forEach((d, i) => parts.push(text(8 + W * i + W / 2, 46, d, 15)));
  for (let d = 1; d <= days; d++) {
    const cell = first + d - 1;
    const col = cell % 7;
    const row = Math.floor(cell / 7);
    const x = 8 + col * W;
    const y = 52 + row * W;
    const mark = marks.includes(d);
    parts.push(`<g data-day="${d}" data-col="${col}"${mark ? ' data-mark="1"' : ''}>${mark ? `<circle cx="${x + W / 2}" cy="${y + W / 2 - 4}" r="14" fill="${ORANGE}" fill-opacity="0.45" stroke="${INK}" stroke-width="1.5"/>` : ''}${text(x + W / 2, y + W / 2 + 1, String(d), 15)}</g>`);
  }
  return svg(W * 7 + 16, 60 + rows * W + 4, '달력 그림', parts.join(''));
}

function bars({ labels, values, step, readable, blankBars=[], maxValue=0, unitLabel='', ...details }) {
  if(readable)return readableGraph({...details,labels,values,step,blankBars,maxValue,unitLabel,type:'bars'});
  const top = Math.max(step, Math.ceil(Math.max(...values) / step) * step);
  const H = 140;
  const BW = 46;
  const left = 36;
  const unitH = H / top;
  const right = left + labels.length * (BW + 18) + 10;
  const parts = [];
  for (let v = 0; v <= top; v += step) {
    const y = r1(20 + H - v * unitH);
    parts.push(`<g class="tick"><line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${INK}" stroke-opacity="0.25" stroke-width="1"/>${text(left - 14, y + 4, String(v), 11)}</g>`);
  }
  values.forEach((v, i) => {
    const x = left + 14 + i * (BW + 18);
    const h = r1(v * unitH);
    parts.push(`<rect data-value="${v}" x="${x}" y="${r1(20 + H - h)}" width="${BW}" height="${h}" rx="3" fill="${[SAGE, SKY, PURPLE][i % 3]}" stroke="${INK}" stroke-width="1.5"/>`);
    parts.push(text(x + BW / 2, 20 + H + 18, labels[i], 12));
  });
  parts.push(`<line x1="${left}" y1="20" x2="${left}" y2="${20 + H}" stroke="${INK}" stroke-width="2"/><line x1="${left}" y1="${20 + H}" x2="${right}" y2="${20 + H}" stroke="${INK}" stroke-width="2"/>`);
  return svg(right + 10, H + 48, '막대그래프 그림', parts.join(''));
}

// 그림기호 한 줄: 한 개는 동그라미, 반 개는 반원.
const symbolRow = (x0, y, v, unit) => Array.from({ length: Math.ceil(v / unit) }, (_, j) => {
  const x = x0 + j * 30, share = Math.min(1, v / unit - j);
  if (share !== 1 && share !== 0.5) throw new RangeError('그림기호는 한 개 또는 반 개로 나타내요.');
  return `<g data-symbol="${unit * share}">${share === 1 ? `<circle cx="${x}" cy="${y}" r="10" fill="${SAGE}" stroke="${INK}"/>` : `<path d="M${x} ${y - 10} A10 10 0 0 0 ${x} ${y + 10} Z" fill="${SAGE}" stroke="${INK}"/>`}</g>`;
}).join('');
// 새 그래프는 labels/values, 그림그래프는 unit(기호 하나의 값)을 쓴다.
const COLORS = [SAGE, '#8fb9d2', PURPLE, '#d98980'];
function pictograph({ values, labels = values.map((_, i) => String(i + 1)), unit = 1, unitLabel = '', sourceTable, panels, smallUnit, blankRows, symbol, title }) {
  if(smallUnit||symbol||title)return mixedPictograph({values,labels,unit,unitLabel,smallUnit:smallUnit??1,showSmallLegend:!!smallUnit,blankRows,symbol,title});
  if (panels) {
    let body = table({...sourceTable,fontSize:23}).replace('<svg ', '<svg x="10" y="0" width="320" height="100" ');
    body += `<g data-legend="1"><rect x="120" y="108" width="100" height="34" rx="6" fill="${CREAM}" stroke="${INK}"/><circle cx="138" cy="125" r="10" fill="${SAGE}" stroke="${INK}"/>${text(182, 133, String(unit) + unitLabel, 24)}</g>`;
    const panelH = labels.length * 38 + 24;
    panels.forEach((p,i)=>{
      const y=156+i*panelH;
      body += `<g data-panel="${p.number}">${text(22,y+labels.length*19+11,p.number,30)}<line x1="44" y1="${y+2}" x2="44" y2="${y+labels.length*38}" stroke="${INK}" stroke-opacity=".3"/>`
        + p.values.map((v,k)=>text(74,y+26+k*38,labels[k],24)+symbolRow(118,y+20+k*38,v,unit)).join('') + '</g>';
    });
    return svg(340,156+panels.length*panelH,'표와 번호 그래프',body);
  }
  if (!(unit > 0)) throw new RangeError('그림기호 단위는 0보다 커야 해요.');
  let body = '';
  const max = Math.max(0, ...values);
  values.forEach((v, i) => { body += text(30, 38 + i * 38, labels[i], 24) + symbolRow(80, 32 + i * 38, v, unit); });
  body += `<g data-legend="1"><rect x="42" y="${values.length*38+25}" width="100" height="34" rx="6" fill="${CREAM}" stroke="${INK}"/>`;
  body += text(100, values.length * 38 + 47, String(unit) + unitLabel,24);
  body += `<circle cx="60" cy="${values.length * 38 + 42}" r="10" fill="${SAGE}" stroke="${INK}"/></g>`;
  return svg(Math.max(180, Math.ceil(max / unit) * 30 + 90), values.length * 38 + 72, '그림그래프', body);
}
function lineGraph({ values, labels = values.map((_, i) => String(i + 1)), step = 1, base=0, readable, unitLabel='', ...details }) {
  if(readable)return readableGraph({...details,values,labels,step,base,unitLabel,type:'line'});
  const top = Math.max(step, Math.ceil(Math.max(...values) / step) * step), X = (i) => 40 + i * 65, Y = (v) => r1(160 - v / top * 140);
  let body = '';
  for (let v = 0; v <= top; v += step) body += `<line x1="40" y1="${Y(v)}" x2="${X(values.length - 1)}" y2="${Y(v)}" stroke="${INK}" stroke-opacity="0.25"/>${text(22, Y(v) + 4, v, 11)}`;
  body += `<polyline points="${values.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" stroke="${ORANGE}" stroke-width="3"/>`;
  values.forEach((v, i) => { body += `<circle data-value="${v}" cx="${X(i)}" cy="${Y(v)}" r="4" fill="${ORANGE}" stroke="${INK}"/>${text(X(i), 184, labels[i], 12)}`; });
  return svg(X(values.length - 1) + 30, 200, '꺾은선그래프', body);
}
// labelEvery를 틀이 정하지 않으면 눈금이 많을 때 교과서처럼 수는 2칸·5칸마다 달고 눈금 사이를 좁힌다.
// 칸마다 수를 달면 글자 14px를 지키느라 그래프가 폰 화면보다 길었다(검수 13번).
function readableGraph({values,labels,step,base=0,type,blankBars=[],maxValue=0,unitLabel='',title,xLabel='종류',yLabel,labelEvery,minCount=0}) {
  if(type==='line'&&step===1)base=Math.max(base,Math.min(...values)-1);
  const rawCount=Math.ceil((Math.max(maxValue,...values)-base)/step)+(blankBars.length?1:0),every=labelEvery??(rawCount>12?5:rawCount>6?2:1),unit=type==='line'?22:({1:20,2:14}[every]??11);
  const count=Math.max(every,minCount,type==='line'?rawCount:Math.ceil(rawCount/every)*every),top=base+count*step,H=count*unit,W=360,left=66,right=338,plotTop=64,Y=v=>plotTop+H-(v-base)/step*unit,bottom=base>0?40:26;
  const X=i=>values.length===2?left+(right-left)*(i+1)/3:left+26+i*(right-left-52)/Math.max(1,values.length-1);
  let body=`<g data-graph-title="1">${text(180,24,title??(type==='line'?'날짜별 기록':'항목별 기록'),21)}</g><g data-y-label="1">${text(76,58,yLabel??unitLabel,18)}</g>`;
  for(let v=base;v<=top;v+=step){const labeled=v%(step*every)===0;body+=`<g data-tick="${v}"><line x1="${left}" x2="${right}" y1="${Y(v)}" y2="${Y(v)}" stroke="${INK}" stroke-opacity="0.25"/>${labeled?text(left-27,Y(v)+6,v,18):''}</g>`;}
  body+=`<path d="M${left} ${plotTop} V${Y(base)} H${right}" fill="none" stroke="${INK}" stroke-width="2"/>`;
  if(base>0)body+=`<path d="M${left} ${Y(base)} V${Y(base)+34}" stroke="${INK}"/><path data-axis-break="1" d="M${left-7} ${Y(base)+11} l14 5 l-14 5 l14 5" fill="none" stroke="${INK}" stroke-width="2.5"/>${text(left-27,Y(base)+40,0,18)}`;
  if(type==='line')body+=`<polyline data-series="1" points="${values.map((v,i)=>`${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="${ORANGE}" stroke-width="3"/>`;
  values.forEach((v,i)=>{
    if(type==='line')body+=`<circle data-value="${v}" cx="${X(i)}" cy="${Y(v)}" r="4" fill="${ORANGE}" stroke="${INK}"/>`;
    else if(blankBars.includes(i))body+=`<g data-blank-bar="${i}"><rect x="${X(i)-17}" y="${plotTop}" width="34" height="${H}" fill="none" stroke="${INK}" stroke-dasharray="4 4"/>${text(X(i),plotTop+28,'?',22)}</g>`;
    else body+=`<rect data-value="${v}" x="${X(i)-17}" y="${Y(v)}" width="34" height="${(v-base)/step*unit}" fill="${[SAGE,SKY,PURPLE][i%3]}" stroke="${INK}"/>`;
    body+=text(X(i),Y(base)+bottom,labels[i],18);
  });
  body+=`<g data-x-label="1">${text(195,Y(base)+bottom+30,xLabel,18)}</g>`;
  return svg(W,Y(base)+bottom+46,type==='line'?'꺾은선그래프':'막대그래프',body);
}
function pie(art) {
  if(art.percentTicks)return percentGraph(art);
  const { values, labels = [] }=art;
  const sum = values.reduce((a, b) => a + b, 0);
  if (!(sum > 0) || values.some((v) => v < 0)) throw new RangeError('원그래프 값이 잘못됐어요.');
  const point = (deg, radius = 90) => [r1(130 + radius * Math.cos(deg * Math.PI / 180)), r1(130 + radius * Math.sin(deg * Math.PI / 180))];
  let at = -90, body = '';
  values.forEach((v, i) => {
    const share = v / sum * 360, [x1, y1] = point(at), [x2, y2] = point(at + share);
    if (share === 360) body += `<circle data-share="360" cx="130" cy="130" r="90" fill="${COLORS[i % 4]}" stroke="${INK}"/>`;
    else if (share > 0) body += `<path data-share="${r1(share)}" d="M130 130 L${x1} ${y1} A90 90 0 ${share > 180 ? 1 : 0} 1 ${x2} ${y2} Z" fill="${COLORS[i % 4]}" stroke="${INK}"/>`;
    if (labels[i] && share) { const [x, y] = point(at + share / 2, 115); body += text(x, y + 4, labels[i], labelSize(260)); }
    at += share;
  });
  return svg(260, 260, '원그래프', body);
}
function band(art) {
  if(art.percentTicks)return percentGraph(art);
  if(art.parts||art.groupedObjects)return fractionBand(art);
  const {values,labels=[]}=art;
  const sum = values.reduce((a, b) => a + b, 0);
  if (!(sum > 0)) throw new RangeError('띠그래프 합은 0보다 커야 해요.');
  let x = 20, body = '';
  values.forEach((v, i) => {
    const w = v / sum * 300;
    body += `<rect data-value="${v}" x="${r1(x)}" y="25" width="${r1(w)}" height="50" fill="${COLORS[i % 4]}" stroke="${INK}"/>`;
    if (labels[i]) body += text(x + w / 2, 99, labels[i], labelSize(340));
    x += w;
  });
  return svg(340, 120, '띠그래프', body);
}
function table({ labels, values, rows = null, fontSize = 14, columnWidths }) {
  const cells = rows ?? [labels, values], cols = Math.max(...cells.map((row) => row.length));
  const widths=Array.from({length:cols},(_,i)=>columnWidths?.[i]??66),starts=widths.map((_,i)=>15+widths.slice(0,i).reduce((a,b)=>a+b,0));
  let body = '';const rowH=Math.max(36,Math.ceil(fontSize*1.45));
  cells.forEach((row, y) => row.forEach((v, x) => { body += `<rect x="${starts[x]}" y="${15 + y * rowH}" width="${widths[x]}" height="${rowH}" fill="${y ? CREAM : SAGE}" stroke="${INK}"/>${text(starts[x]+widths[x]/2,15+rowH*(y+.5)+fontSize*.35,v,fontSize)}`; }));
  return svg(widths.reduce((a,b)=>a+b,0)+30, cells.length * rowH + 30, '표', body);
}
function compare({ type = 'length', values = [6, 4], sizes, thickness = [1, 1], panels, pairs }) {
  if (panels) return comparePanels({ type, panels, pairs });
  let body = '';
  if (type === 'weight') {
    const delta = values[1] === values[0] ? 0 : values[1] > values[0] ? 18 : -18;
    body = `<path d="M140 65 L115 175 H165 Z" fill="${CREAM}" stroke="${INK}"/><line x1="45" y1="${65 - delta}" x2="235" y2="${65 + delta}" stroke="${INK}" stroke-width="4"/>`;
    for (const [i, x, y] of [[0, 45, 65 - delta], [1, 235, 65 + delta]]) body += `<path data-weight="${values[i]}" d="M${x} ${y} L${x - 25} ${y + 60} H${x + 25} Z" stroke="${INK}"/><path d="M${x - 25} ${y + 60} Q${x} ${y + 82} ${x + 25} ${y + 60}" fill="${i ? ORANGE : SAGE}" stroke="${INK}"/>`;
    return svg(280, 200, '무게 비교', body);
  }
  if (type === 'area') {
    const pairs = sizes ?? values.map((v) => [v, 1]);
    const factor = 90 / Math.max(...pairs.flat());
    pairs.forEach(([w, h], i) => { body += `<rect data-area="${w * h}" x="${20 + i * 130}" y="25" width="${r1(w * factor)}" height="${r1(h * factor)}" fill="${i ? ORANGE : SAGE}" stroke="${INK}"/>`; });
  } else if (type === 'capacity') {
    values.forEach((v, i) => {
      for (let j = 0; j < v; j++) { const x = 20 + j * 36, y = 20 + i * 65; body += `<path data-cup="${i}" d="M${x} ${y} V${y + 42} H${x + 26} V${y}" fill="${i ? ORANGE : SAGE}" stroke="${INK}"/>`; }
    });
  } else {
    const factor = 220 / Math.max(...values);
    values.forEach((v, i) => { body += `<rect data-length="${v}" x="20" y="${30 + i * 60}" width="${r1(v * factor)}" height="${thickness[i] * 10}" rx="4" fill="${i ? ORANGE : SAGE}" stroke="${INK}"/>`; });
  }
  return svg(280, 165, '크기 비교', body);
}
function comparePanels({ type, panels, pairs }) {
  let body = '';
  if (type === 'weight') {
    const pairStep=325;
    pairs.forEach(([left, right], i) => {
      const a = panels.find((p) => p.number === left), b = panels.find((p) => p.number === right);
      const delta = a.measure > b.measure ? -18 : 18;
      body += `<g data-pair="${left},${right}" transform="translate(${i*pairStep-10} -40)"><path d="M140 65 L115 185 H165 Z" fill="${CREAM}" stroke="${INK}"/><line x1="45" y1="${65 - delta}" x2="235" y2="${65 + delta}" stroke="${INK}" stroke-width="4"/>`;
      for (const [p, x, y] of [[a, 45, 65 - delta], [b, 235, 65 + delta]]) {
        body += `<g data-weight="${p.measure}" data-pan-y="${y + 70}" data-number="${p.number}"><path d="M${x-30} ${y+70} L${x} ${y} L${x+30} ${y+70}" stroke="${INK}"/><path d="M${x - 30} ${y + 70} Q${x} ${y + 90} ${x + 30} ${y + 70}" fill="${SAGE}" stroke="${INK}"/><circle cx="${x}" cy="${y + 72 - p.size}" r="${p.size}" fill="${ORANGE}" stroke="${INK}"/>${text(x, y + 130, p.number, 42)}</g>`;
      }
      body += '</g>';
    });
    // 천칭 폭 250 사이에 접시 폭 60보다 큰 75의 틈을 두고 문제 칸 너비로 보인다.
    return svg((pairs.length-1)*pairStep+260, 190, '천칭 비교', body).replace('<svg ', '<svg style="width:100%" ');
  }
  if (type === 'area') {
    panels.forEach((p, i) => {
      const x = 16 + i % 2 * 166, y = 32 + Math.floor(i / 2) * 142;
      body += `<g data-panel="${p.number}"><rect data-area="${p.w * p.h}" x="${x+66-p.w*19/2}" y="${y+58-p.h*19/2}" width="${p.w * 19}" height="${p.h * 19}" fill="${COLORS[i]}" stroke="${INK}" stroke-width="2"/>${text(x + 66, y - 10, p.number, 20)}</g>`;
    });
    return svg(340, 306, '종이 넓이 비교', body);
  }
  panels.forEach((p, i) => {
    const y = 16 + i * (type === 'capacity' ? 94 : 60);
    body += `<g data-panel="${p.number}">${text(24, y + 30, p.number, 20)}`;
    if (type === 'capacity') {
      const h=p.height,w=p.width??(30+p.measure*6),top=y+80-h,x=100-w/2,bottom=y+80;
      const shapes={
        cup:`M${x} ${top} L${x+w*.12} ${bottom} H${x+w*.88} L${x+w} ${top}`,
        bottle:`M${x+w*.3} ${top} V${top+h*.2} Q${x} ${top+h*.3} ${x} ${top+h*.45} V${bottom-5} Q${x+w/2} ${bottom+5} ${x+w} ${bottom-5} V${top+h*.45} Q${x+w} ${top+h*.3} ${x+w*.7} ${top+h*.2} V${top}`,
        bowl:`M${x} ${top} Q${x+w*.08} ${bottom} ${x+w/2} ${bottom} Q${x+w*.92} ${bottom} ${x+w} ${top}`,
        vase:`M${x+w*.2} ${top} Q${x+w*.5} ${top+h*.3} ${x+w*.05} ${top+h*.55} Q${x-w*.1} ${bottom} ${x+w*.25} ${bottom} H${x+w*.75} Q${x+w*1.1} ${bottom} ${x+w*.95} ${top+h*.55} Q${x+w*.5} ${top+h*.3} ${x+w*.8} ${top}`,
      };
      const path=shapes[p.shape??['cup','bottle','bowl','vase'][i]];
      body += `<g data-container="${p.measure}" data-width="${w}"><path d="${path}" fill="${SKY}" transform="translate(${x+w/2} ${top+h/2}) scale(.92 .94) translate(${-x-w/2} ${-top-h/2})"/><path d="${path}" stroke="${INK}" stroke-width="2"/></g><path d="M170 ${y + 42} h28 m-8 -6 l8 6 l-8 6" stroke="${INK}" stroke-width="2"/>`;
      body += `<rect data-water="${p.measure}" x="240" y="${y + 80 - p.measure * 9}" width="50" height="${p.measure * 9}" fill="${SKY}"/><path d="M240 ${y + 8} V${y + 80} H290 V${y + 8}" stroke="${INK}" stroke-width="2"/>`;
    } else body += `<rect data-length="${p.measure}" x="60" y="${y + 30-7}" width="${p.measure * 30}" height="14" rx="7" fill="${COLORS[i]}" stroke="${INK}" stroke-width="2"/>`;
    body += '</g>';
  });
  return svg(340, panels.length * (type === 'capacity' ? 94 : 60) + 12, '번호 물건 비교', body);
}

function sort({ items, groups, panels, groupLabels }) {
  const total=items=>items.reduce((n,item)=>n+item.n,0);
  // 한 물건 전용 확대를 빼고, 분류 상자에서도 같은 44×50 좌표를 쓴다.
  const groupObjects = (items, columns) => drawFigure({kind:'objects',items,columns}).replace('<g transform="translate(18 -18) scale(2)">', '<g>');
  const objects = (items, w=330, h=130) => drawFigure({kind:'objects',items:items.map(p=>p.color==='초록'?{...p,color:SAGE}:p),columns:6}).replace('<svg ', `<svg width="${w}" height="${h}" `);
  const grouped = (groups) => {
    const rows = Math.max(1,...groups.map(g=>balancedRows(total(g),3).length));
    const h = rows*50+20, w = groups.length*150;
    return svg(w,h,'분류한 물건',groups.map((g,i)=>{
      const rs=balancedRows(total(g),3),iw=((rs[0]??1)-1)*44+46,ih=(Math.max(1,rs.length)-1)*50+48;
      return `<g data-group="${i}" transform="translate(${i*150} 0)"><rect x="3" y="3" width="144" height="${h-6}" rx="8" fill="${CREAM}" stroke="${INK}"/>${groupObjects(g,3).replace(/viewBox="[^"]+"/, `viewBox="9 10 ${iw} ${ih}"`).replace('<svg ', `<svg x="${75-iw/2}" y="${(h-ih)/2}" width="${iw}" height="${ih}" `)}</g>`;
    }).join(''));
  };
  if (panels) {
    const per=6,layouts=panels.flatMap(p=>p.groups.map(g=>balancedRows(total(g),per))),rows=Math.max(1,...layouts.map(r=>r.length)),cols=Math.max(1,...layouts.map(r=>r[0]??0));
    // 물건 칸은 44×50 간격, 물건은 칸 안 (13~49, 14~52)에 그려진다. 그 둘레만 남겨 자른다.
    const labelH=groupLabels?28:0,innerW=(cols-1)*44+46,innerH=(rows-1)*50+48,boxW=Math.max(innerW+16,groupLabels?112:0),groupH=innerH+16+labelH,count=Math.max(...panels.map(p=>p.groups.length));
    const panelW=boxW+10,panelH=44+count*(groupH+6),W=Math.max(440,2*panelW+20);
    let body = objects(items,440,125);
    panels.forEach((p,i)=>{
      const x=(W-2*panelW-20)/2+i%2*(panelW+20),y=140+Math.floor(i/2)*panelH;
      const contents=p.groups.map((g,j)=>{
        const rs=balancedRows(total(g),per),iw=((rs[0]??1)-1)*44+46,ih=(Math.max(1,rs.length)-1)*50+48;
        return `<g data-group="${j}" transform="translate(${x+5} ${y+40+j*(groupH+6)})"><rect width="${boxW}" height="${groupH}" rx="8" fill="${CREAM}" stroke="${INK}"/>${groupLabels?text(boxW/2,24,groupLabels[j],22):''}${groupObjects(g,per).replace(/viewBox="[^"]+"/,`viewBox="9 10 ${iw} ${ih}"`).replace('<svg ',`<svg x="${(boxW-iw)/2}" y="${labelH+(groupH-labelH-ih)/2}" width="${iw}" height="${ih}" `)}</g>`;
      }).join('');
      body += `<g data-panel="${p.number}">${text(x+5+boxW/2,y+32,p.number,34)}${contents}</g>`;
    });
    return svg(W,140+Math.ceil(panels.length/2)*panelH,'분류 보기',body);
  }
  return groups?grouped(groups):svg(340,150,'분류할 물건',objects(items));
}

function fractionBand({parts,shaded,start=0,orientation,groupedObjects,groups,groupSize,selectedGroups,object='circle'}) {
  if(groupedObjects){
    const groupRows=balancedRows(groups,3),groupCells=balancedCells(groups,3),itemCells=balancedCells(groupSize,3),itemRows=balancedRows(groupSize,3),perRow=groupRows[0],cellW=100,cellH=itemRows.length*23+22;
    let body='';
    for(let i=0;i<groups;i++){
      const x=10+groupCells[i].x*cellW,y=10+groupCells[i].row*cellH;
      body+=`<g data-group="${i}" data-selected="${i<selectedGroups}"><rect x="${x}" y="${y}" width="92" height="${cellH-7}" rx="7" fill="${CREAM}" stroke="${i<selectedGroups?ORANGE:INK}" stroke-width="${i<selectedGroups?3:1.5}"/>`;
      for(let j=0;j<groupSize;j++){
        const px=x+46-(itemRows[0]-1)*13+itemCells[j].x*26,py=y+17+itemCells[j].row*23,fill=i<selectedGroups?ORANGE:CREAM;
        const shape=object==='square'?`<rect x="${px-7}" y="${py-7}" width="14" height="14"/>`:object==='triangle'?`<path d="M${px} ${py-8} l8 15 h-16 Z"/>`:`<circle cx="${px}" cy="${py}" r="7"/>`;
        body+=`<g data-item="${j}" fill="${fill}" stroke="${INK}">${shape}</g>`;
      }body+='</g>';
    }
    return svg(perRow*cellW+10,groupRows.length*cellH+10,'같은 수씩 묶은 물건',body);
  }
  const vertical=orientation==='vertical',long=300,short=64;let body='';
  for(let i=0;i<parts;i++){
    const selected=(i-start+parts)%parts<shaded;
    body+=`<rect data-part="${i}" data-shaded="${selected}" x="${r1(20+(vertical?0:i*long/parts))}" y="${r1(20+(vertical?i*long/parts:0))}" width="${r1(vertical?short:long/parts)}" height="${r1(vertical?long/parts:short)}" fill="${selected?ORANGE:CREAM}" stroke="${INK}" stroke-width="2"/>`;
  }
  return svg(vertical?short+40:long+40,vertical?long+40:short+40,'같은 크기로 나눈 분수 그림',body);
}
function mixedPictograph({values,labels,unit,smallUnit,unitLabel='',blankRows,symbol,showSmallLegend=true,title}){
  const count=Math.max(1,...values.map(v=>Math.floor(v/unit)),...values.map(v=>v%unit/smallUnit)),W=Math.max(350,110+count*34),rowH=showSmallLegend?72:50;
  let body='';
  const icon=(x,y,big,name)=>{
    const radius=big?10:5,color=name==='사과'?'#d98980':name==='배'?'#ead38b':name==='책'?SAGE:ORANGE;
    if(!name)return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="${INK}"/>`;
    const fruit=name==='책'?'<path d="M-12 -9 Q-5 -12 0 -7 Q5 -12 12 -9 V10 Q5 7 0 12 Q-5 7 -12 10 Z M0 -7 V12"/>':name==='감'?'<path d="M-11 -3 Q-14 12 0 12 Q14 12 11 -3 Q0 -10 -11 -3 Z"/><path d="M-6 -5 L0 -12 L6 -5 L0 -3 Z"/>':name==='배'?'<path d="M-3 -8 Q-4 -2 -8 3 Q-11 12 0 12 Q11 12 8 3 Q4 -2 3 -8 Z"/>':name==='귤'?'<ellipse cx="0" cy="2" rx="10" ry="8"/>':'<path d="M0 -7 C-12 -14 -15 6 -5 11 Q0 8 5 11 C15 6 12 -14 0 -7 Z"/>';
    return `<g data-fruit="${esc(name)}" transform="translate(${x} ${y}) scale(${big?1:.5})" fill="${color}" stroke="${INK}">${fruit}${name==='책'?'':'<path d="M0 -7 Q1 -14 5 -12" fill="none"/>'}</g>`;
  };
  values.forEach((v,i)=>{
    body+=text(48,(showSmallLegend?42:34)+i*rowH,labels[i],labelSize(W));
    body+=`<rect x="92" y="${8+i*rowH}" width="${W-104}" height="${rowH-10}" rx="4" stroke="${INK}" stroke-opacity=".3"/>`;
    if(!blankRows||Array.isArray(blankRows)&&!blankRows.includes(i)){
      for(let n=0;n<Math.floor(v/unit);n++)body+=`<g data-symbol="${unit}">${icon(110+n*34,28+i*rowH,true,symbol??labels[i])}</g>`;
      for(let n=0;n<v%unit/smallUnit;n++)body+=`<g data-symbol="${smallUnit}">${icon(110+n*34,54+i*rowH,false,symbol??labels[i])}</g>`;
    }
  });
  const y=values.length*rowH+10;
  const symbols=[...new Set(symbol?[symbol]:labels)];
  body+=`<g data-legend="1"><rect x="10" y="${y}" width="${W-20}" height="${showSmallLegend?74:48}" rx="6" fill="${CREAM}" stroke="${INK}"/>${symbols.map((s,i)=>icon(34+i*32,y+22,true,s)).join('')}${text(W/2+25,y+29,`${symbols.length>1?'각각 ':''}${unit}${unitLabel}`,labelSize(W))}${showSmallLegend?symbols.map((s,i)=>icon(34+i*32,y+55,false,s)).join('')+text(W/2+25,y+62,`${symbols.length>1?'각각 ':''}${smallUnit}${unitLabel}`,labelSize(W)):''}</g>`;
  return svg(W,y+(showSmallLegend?90:66)+(title?34:0),'그림그래프',title?text(W/2,26,title,labelSize(W))+'<g transform="translate(0 34)">'+body+'</g>':body);
}
function objectCards({object,panels}) {
  const longLabels = panels?.some(p => String(p.label ?? p.object).length > 10);
  const linesFor = label => {
    // 수와 단위(「20 cm쯤인」)는 한 덩이로 줄을 나눈다. 전엔 「높이 20 / cm쯤인」처럼 수와 단위가 갈라졌다.
    const words = [];
    for (const word of String(label).split(' ')) {
      if (/^[\d.]+$/.test(words.at(-1) ?? '')) words[words.length - 1] += ' ' + word;
      else words.push(word);
    }
    const lines = [''];
    for (const word of words) {
      if (lines.at(-1) && (lines.at(-1) + ' ' + word).length > 7) lines.push(word);
      else lines[lines.length - 1] += (lines.at(-1) ? ' ' : '') + word;
    }
    return lines;
  };
  const rowHeight = longLabels ? 153 + Math.max(...panels.map(p => linesFor(p.label ?? p.object).length)) * 25 : 168;
  const items=panels??[{object,label:object}],body=items.map((p,i)=>{
    const x=i%2*170,y=Math.floor(i/2)*rowHeight,name=p.object??p.label;
    let picture;
    const pictures={
      '수영장':`<rect x="24" y="36" width="120" height="68" rx="6" fill="${SKY}"/><path d="M45 32 V84 M60 32 V84 M45 46 H60 M45 62 H60 M45 78 H60" fill="none"/>`,
      '자동차':`<path d="M30 80 V60 H45 L59 40 H94 L111 60 H132 V80 Z"/><path d="M59 43 V60 H104 L92 43 Z" fill="${SKY}"/><circle cx="50" cy="83" r="10"/><circle cx="111" cy="83" r="10"/>`,
      '트럭':`<path d="M18 34 H92 V79 H18 Z M92 49 H121 L140 67 V79 H92 Z"/><circle cx="43" cy="84" r="11"/><circle cx="119" cy="84" r="11"/>`,
      '버스':`<rect x="20" y="35" width="126" height="55" rx="10"/><path d="M30 46 H126 V63 H30 Z M50 46 V63 M76 46 V63 M102 46 V63" fill="${SKY}"/><circle cx="45" cy="91" r="10"/><circle cx="119" cy="91" r="10"/>`,
      '연필':`<path d="M42 40 L116 78 L108 94 L34 56 Z M116 78 L132 98 L108 94 Z"/>`,
      '숟가락':`<ellipse cx="65" cy="45" rx="14" ry="22"/><path d="M65 67 V105" stroke-width="8"/>`,
      '고양이':`<ellipse cx="88" cy="79" rx="35" ry="23"/><circle cx="55" cy="54" r="22"/><path d="M36 40 L35 22 L49 31 M63 31 L77 22 L75 43 M120 80 Q147 63 132 49"/><path d="M42 55 H50 M61 55 H69 M53 65 H59"/>`,
      '강아지':`<ellipse cx="90" cy="81" rx="37" ry="23"/><ellipse cx="56" cy="54" rx="25" ry="22"/><path d="M34 39 Q16 73 36 76 M74 39 Q94 74 75 76 M122 80 L144 64" fill="${ORANGE}"/>`,
      '코끼리':`<ellipse cx="87" cy="65" rx="49" ry="30"/><ellipse cx="48" cy="57" rx="20" ry="27"/><path d="M31 60 Q12 106 36 101 M62 85 V107 M105 85 V107" stroke-width="9"/>`,
      '고래':`<path d="M24 72 Q35 25 91 45 Q117 55 132 73 L151 53 L147 87 L132 93 Q64 131 24 72 Z"/><path d="M65 45 V21 M65 24 Q51 11 44 21 M65 24 Q77 10 86 20" fill="none"/><circle cx="44" cy="67" r="3" fill="${INK}"/>`,
      '욕조':`<path d="M22 55 H145 L134 88 Q82 118 32 87 Z"/><path d="M37 95 V108 M126 95 V108 M127 54 V30 Q114 20 107 36" fill="none"/>`,
      '양동이':`<path d="M35 44 L45 103 H119 L129 44 Z"/><path d="M46 43 Q81 1 118 43" fill="none"/>`,
      '물탱크':`<ellipse cx="83" cy="30" rx="51" ry="17"/><path d="M32 30 V91 Q83 119 134 91 V30 M32 58 Q83 87 134 58" fill="none"/><path d="M134 85 H150 V100" fill="none"/>`,
      '물통':`<path d="M57 33 V23 H105 V37 L125 49 V106 H39 V47 Z"/><path d="M67 31 H95 V43 H67 Z" fill="${CREAM}"/>`,
      '생수병':`<path d="M68 24 H94 V40 L108 52 V105 H54 V52 L68 40 Z"/><path d="M54 65 H108 V87 H54" fill="${SKY}"/>`,
      '우유갑':`<path d="M52 43 L70 24 H102 L118 43 V105 H52 Z M52 43 H118 M70 24 V43"/><path d="M63 64 H106 V88 H63 Z" fill="${CREAM}"/>`,
      '주전자':`<path d="M50 52 Q79 35 109 52 V96 Q79 113 50 96 Z M109 58 L138 41 L122 82 M50 58 Q16 52 25 91 H50 M59 45 Q79 16 101 45" fill="none"/><path d="M51 50 H109" />`,
      '물뿌리개':`<path d="M49 52 H105 V104 H49 Z M105 74 L140 49 L148 61 L105 93 M49 64 Q12 49 25 93 H49" fill="none"/><ellipse cx="146" cy="54" rx="6" ry="12" transform="rotate(-35 146 54)"/>`,
      '큰 냄비':`<path d="M40 53 H125 V97 Q82 113 40 97 Z M40 65 H23 V80 H40 M125 65 H143 V80 H125 M36 50 Q82 31 130 50 M71 37 V28 H93 V37" fill="none"/>`,
      '찻잔':`<path d="M45 48 H104 V85 Q74 110 45 85 Z M104 57 Q140 48 124 82 H104"/><path d="M32 110 H121"/>`,
      '종이컵':`<path d="M45 35 H119 L107 108 H57 Z"/><ellipse cx="82" cy="35" rx="37" ry="10" fill="${CREAM}"/>`,
      '찻숟가락':`<ellipse cx="65" cy="45" rx="14" ry="22"/><path d="M65 67 V105" stroke-width="8"/>`,
      '자전거':`<circle cx="42" cy="87" r="23" fill="none"/><circle cx="123" cy="87" r="23" fill="none"/><path d="M42 87 L65 50 L89 87 H42 M65 50 H105 L123 87 M89 87 L105 42 H119 M58 43 H75" fill="none"/>`,
      '바나나':`<path d="M35 35 Q76 94 134 57 Q108 126 55 91 Q33 70 35 35 Z"/>`,
      '달걀':`<path d="M80 28 C42 28 22 105 80 108 C138 105 118 28 80 28 Z"/>`,
      '공책':`<path d="M39 34 H120 V106 H39 Z M52 34 V106"/><path d="M62 55 H106 M62 68 H106 M62 81 H106" fill="none"/>`,
      '노트북':`<path d="M44 27 H121 V82 H44 Z M44 82 L24 105 H142 L121 82 Z"/><path d="M51 34 H114 V75 H51 Z" fill="${SKY}"/>`,
      '벽돌':`<path d="M28 60 L66 39 H133 V82 L96 105 H28 Z M28 60 H96 V105 M96 60 L133 39" fill="${ORANGE}"/><path d="M54 49 H116 M79 41 L46 60"/>`,
      '지우개':`<path d="M29 81 L58 47 H130 L103 81 Z M29 81 V98 H103 L130 64 V47 M103 81 V98 M77 47 L49 81 V98" fill="${CREAM}"/>`,
      '쌀 포대':`<path d="M52 28 H111 L101 42 Q135 85 110 109 H50 Q23 85 61 42 Z"/><path d="M58 39 H105 M60 67 H105 M73 56 V91" fill="none"/>`,
      '책가방':`<rect x="45" y="40" width="77" height="69" rx="13"/><path d="M62 40 V27 H103 V40 M57 75 H111 V98 H57 Z" fill="none"/>`,
      '설탕 한 봉지':`<path d="M48 28 H119 L113 43 L124 106 H40 L52 43 Z" fill="${CREAM}"/><rect x="55" y="57" width="54" height="32" fill="${ORANGE}"/><path d="M48 35 H119"/>`,
      '멜론':`<ellipse cx="82" cy="73" rx="44" ry="36"/><path d="M82 36 V22 H99 M43 56 L112 91 M58 43 L124 78 M42 84 L104 43 M61 105 L125 62" fill="none"/>`,
      '수박':`<ellipse cx="82" cy="72" rx="52" ry="34"/><path d="M58 44 Q35 72 58 100 M79 39 Q56 72 79 105 M100 42 Q77 72 100 103 M120 50 Q102 74 120 94" fill="none" stroke-width="4"/>`,
      '사과':`<path d="M80 45 C33 18 22 98 64 107 Q80 98 96 107 C137 96 127 18 80 45 Z"/><path d="M80 44 Q77 23 94 22" fill="none"/>`,
      '감자':`<path d="M38 64 Q26 35 73 39 Q124 25 134 73 Q137 114 82 106 Q36 115 38 64 Z"/><path d="M59 55 l3 3 M103 77 l3 3 M63 90 l3 2 M117 54 l2 2"/>`,
      '귤':`<ellipse cx="82" cy="77" rx="44" ry="32" fill="${ORANGE}"/><path d="M72 43 L81 31 L94 44 L82 49 Z" />`,
      '딸기':`<path d="M47 53 Q81 28 119 53 Q117 88 82 110 Q47 88 47 53 Z" fill="${ORANGE}"/><path d="M63 46 L66 31 L80 44 L91 30 L101 48 M65 67 l1 3 M93 70 l1 3 M80 89 l1 3"/>`,
      '호박':`<path d="M82 45 C45 26 23 62 36 89 Q47 113 70 106 Q82 113 94 106 Q122 114 131 86 C144 54 115 28 82 45 Z" fill="${ORANGE}"/><path d="M76 45 Q70 29 85 22 L94 28 Q83 31 87 44 M66 45 Q45 74 66 105 M94 45 Q116 75 94 106 M82 48 V107" fill="none"/>`,
      '볼링공':`<circle cx="83" cy="72" r="41" fill="${PURPLE}"/><circle cx="70" cy="52" r="5"/><circle cx="87" cy="48" r="5"/><circle cx="82" cy="65" r="5"/>`
    };
    const key=Object.keys(pictures).find(key=>name.includes(key));
    picture=pictures[key]??pictures['사과'];
    const label = longLabels ? linesFor(p.label ?? name).map((line, j) => text(85, 155 + j * 25, line, labelSize(340))).join('') : text(85,161,p.label??name,Math.max(20,labelSize(panels?340:170)));
    const color=name.includes('달걀')?CREAM:name.includes('연필')?'#ead38b':name.includes('자전거')?PURPLE:name.includes('자동차')?'#8fb9d2':COLORS[i%COLORS.length];
    return `<g data-object="${esc(name)}"${p.number?` data-panel="${p.number}"`:''} transform="translate(${x} ${y})">${p.number?text(85,22,p.number,22):''}<g transform="translate(0 16)" fill="${color}" stroke="${INK}" stroke-width="2">${picture}</g>${label}</g>`;
  }).join('');
  return svg(panels?340:170,Math.ceil(items.length/(panels?2:1))*rowHeight,'물건과 용기',body);
}
const DRAW = { sort, money, clock, ruler, scale, cup, calendar, bars, pictograph, line: lineGraph, pie, band, table, compare };

export function drawLife(art) {
  const f = DRAW[art?.kind];
  return f ? f(art) : '';
}
