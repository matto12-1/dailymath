import {until} from '../../engine/retry.js?v=9a67f36b25';
import {j} from '../solution-process.js?v=9a67f36b25';
const frequency=xs=>xs.map(x=>xs.filter(y=>y===x).length);
const chance=xs=>{const max=Math.max(...xs);return xs[0]===max?1/xs.filter(n=>n===max).length:0;};
function clockRisk(options){
 const chunks=options.map(c=>c.match(/\d+/g)),ds=chunks.map(p=>[...p.join('')]),quantities=chunks.map(([h,m=0])=>Number(h)*60+Number(m)),mean=quantities.reduce((a,b)=>a+b,0)/4;
 const alike=ds.map((a,i)=>ds.reduce((n,b,j)=>n+(i===j?0:a.filter((d,k)=>d===b[k]).length),0));
 const scores=[chance(alike),chance(frequency(ds.map(p=>p.at(-1)))),chance(quantities.map(n=>-Math.abs(n-mean))),chance(frequency(options.map(c=>c.length)).map(n=>n===1?1:0))];
 if(chunks.every(p=>p.length===2))scores.push(chance(chunks.map(p=>frequency(chunks.map(q=>q[0]))[chunks.indexOf(p)]+frequency(chunks.map(q=>q[1]))[chunks.indexOf(p)])));
 return scores.reduce((sum,p,k)=>sum+Math.max(0,p-.25)*(k===0?3:1),0);
}
const order=c=>{const [h,m=0]=c.match(/\d+/g).map(Number);return h%12*60+m;};
const slots=[1,2,3].map(i=>({id:'clock-'+i,label:'{label'+i+'}',say:'{say'+i+'}',value:v=>v['wrong'+i]}));
export default {
 id:'g1.shapesclock.half',grade:1,unit:'g1s2-shapes-clock',strand:'life',level:3,label:'몇 시 30분 읽기',std:['[2수03-07]'],
 input:'choice',answerKind:'text',maxDigits:2,parts:[{after:'시'},{after:'분'}],texts:['시계는 몇 시 몇 분일까요?'],
 make(rng){const target=rng.int(0,3);return until(()=>{const h=rng.int(1,12),next=h%12+1,previous=(h+10)%12+1,answer=h+'시 30분';
 const error=(value,label,say)=>({value,label,say});
 const pool=[
 error(next+'시 30분','다음 시로 읽기','짧은바늘이 아직 닿지 않은 '+next+'시를 골랐습니다. 짧은바늘이 '+j(h,'을/를')+' 지나고 긴바늘이 6을 가리키므로 '+answer+'입니다.'),
 error(previous+'시 30분','앞 시로 읽기','짧은바늘이 지난 수보다 앞인 '+previous+'시를 골랐습니다. 짧은바늘이 '+j(h,'과/와')+' '+next+' 사이에 있으므로 '+answer+'입니다.'),
 error(h+'시','30분 빠뜨리기','긴바늘이 가리키는 30분을 빠뜨렸습니다. 짧은바늘로 '+h+'시를 읽고 30분을 함께 읽으면 '+answer+'입니다.'),
 error(next+'시','다음 정각으로 읽기','아직 되지 않은 다음 정각 '+next+'시를 골랐습니다. 짧은바늘은 '+j(h,'을/를')+' 지나고 긴바늘은 6에 있으므로 '+answer+'입니다.'),
 error(previous+'시','앞 정각으로 읽기','앞의 정각 '+previous+'시를 골랐습니다. 짧은바늘이 지난 '+j(h,'과/와')+' 긴바늘의 30분을 함께 읽으면 '+answer+'입니다.'),
 error('6시 30분','긴바늘 숫자를 시로 읽기','긴바늘의 6을 시로 읽었습니다. 시는 짧은바늘로 읽으므로 '+answer+'입니다.'),
 error('6시','긴바늘만 읽기','긴바늘이 가리키는 6만 읽어 6시를 골랐습니다. 시와 분을 각 바늘로 나누어 읽으면 '+answer+'입니다.'),
 ].filter((e,i,xs)=>e.value!==answer&&xs.findIndex(x=>x.value===e.value)===i);
 const sets=[];
 for(let i=0;i<pool.length;i++)for(let j=i+1;j<pool.length;j++)for(let k=j+1;k<pool.length;k++){
 const chosen=[pool[i],pool[j],pool[k]],options=[answer,...chosen.map(e=>e.value)],risk=clockRisk(options);
 sets.push({chosen,options,risk,rank:[...options].sort((a,b)=>order(a)-order(b)).indexOf(answer)});
 }
 const ranked=sets.filter(s=>s.rank===target);if(!ranked.length)return null;const eligible=ranked,best=Math.min(...eligible.map(s=>s.risk)),picked=rng.pick(eligible.filter(s=>s.risk===best));
 const v={h,next,previous,options:picked.options};picked.chosen.forEach((e,i)=>Object.assign(v,{['wrong'+(i+1)]:e.value,['label'+(i+1)]:e.label,['say'+(i+1)]:e.say}));return v;});
 },answer:({h})=>h+'시 30분',check:({h})=>h+'시 '+6*5+'분',choices:({options})=>options,choiceOrder:order,
 isCorrect:({h},c)=>c===h+'시 30분',mistakes:slots,art:({h})=>({kind:'clock',h,m:30}),
 solution:'짧은바늘이 {h:과/와} {next} 사이에 있습니다.\n긴바늘이 6을 가리키면 30분입니다.\n따라서 {h}시 30분입니다.',
};
