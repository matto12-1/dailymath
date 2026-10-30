import { define as baseDefine } from '../g3/helpers.js?v=9a67f36b25';
import { cycle } from '../g3/arithmetic-helpers.js?v=9a67f36b25';
import { fill as fillText, josa } from '../../engine/korean.js?v=9a67f36b25';
import { seq, errors, wrong } from '../g3/helpers.js?v=9a67f36b25';
export { cycle, bank, closest } from '../g3/arithmetic-helpers.js?v=9a67f36b25';
export { seq, unique, sum, product, errors, wrong, until, fill } from '../g3/helpers.js?v=9a67f36b25';
export { dec, frac, pair, same, valueOf } from '../../engine/answer.js?v=9a67f36b25';

const units = {
  large:'g4s1-large-numbers', angles:'g4s1-angles', muldiv:'g4s1-multiply-divide',
  movement:'g4s1-shape-movement', fracaddsub:'g4s1-fraction-addsub', bargraphs:'g4s1-bar-graphs',
  decimaladdsub:'g4s2-decimal-addsub', triangles:'g4s2-triangles', patterns:'g4s2-patterns-equations',
  quadrilaterals:'g4s2-quadrilaterals', linegraphs:'g4s2-line-graphs', polygons:'g4s2-polygons',
};
export const meta = (family,name,level,strand,std,label) => ({
  id:`g4.${family}.${name}`, grade:4, unit:units[family], level,strand,label,
  std:std.map(s=>`[4수${s}]`),
});
export function define(meta, spec) {
  const t=baseDefine(meta,{maxDigits:6,errorCount:2,...spec});
  if(meta.id.startsWith('g4.large.')) {
    const make=t.make;
    t.make=rng=>{
      const v=make(rng);
      v.largeSolution=largeHelp(fillText(spec.solution,{...v,answer:t.answer(v)}));
      for(let i=1;i<=t.mistakes.length;i++)if(v[`say${i}`])v[`say${i}`]=largeHelp(v[`say${i}`]);
      return v;
    };
    t.solution='{largeSolution}';
  }
  if(spec.art)t.art=v=>{
    const art=spec.art(v);
    if(art.kind!=='polygon')return art;
    const style=(p,panel=false)=>({...p,uprightLabels:true,labelsOutside:true,fontSize:panel?26:20});
    return {...style(art),...(art.panels?{panels:art.panels.map(p=>style(p,true))}:{})};
  };
  return t;
}
// 유한한 제작값을 전수 검산하며, 작은 답 목록은 난수마다 섞어 빠짐없이 꺼낸다.
export function casesSpec(cases, answer, check, draw) {
  const groups=new Map();
  for(const v of cases){const a=answer(v);if(!groups.has(a))groups.set(a,[]);groups.get(a).push(v);}
  const answers=[...groups.keys()].sort((a,b)=>a-b);
  return {answer,check,answerSpan:answers,answerCases:()=>cases,
    draw(rng){const a=cycle(rng,groups,answers);return draw({...rng.pick(groups.get(a))},rng);}};
}
export const range = {min:0,max:99999};
export const largeText = n => {
  const groups=[['조',1e12],['억',1e8],['만',1e4],['',1]];
  let left=n;
  return groups.flatMap(([label,size])=>{const count=Math.floor(left/size);left%=size;return count?[`${count}${label}`]:[];}).join(' ');
};
export const spaced = n => String(n);
// 한글 단위가 이미 있는 읽는 말은 그대로 두고 숫자로 쓴 큰 수만 돕는다.
export const largeHelp = text => text.replace(/\d+(?:원)?/g, (s,at)=>{
  const n=Number(s.replace(/원$/,''));
  if(/^[만억조]/.test(text.slice(at+s.length)))return s;
  // 바로 앞에 같은 읽는 말이 있으면(「5억 = 500000000」) 괄호로 되풀이하지 않는다(검수 A2-23).
  if(n<10000)return s;
  const spoken=largeText(n),before=text.slice(0,at).trimEnd();
  const lead=before.endsWith('=')?before.slice(0,-1).trimEnd():/[은는이가]$/.test(before)?before.slice(0,-1):before;
  if(lead.endsWith(spoken))return s;
  return `${s}(${spoken}${s.endsWith('원')?' 원':''})`;
});
const placeNames=['일','십','백','천','만','십만','백만','천만','억','십억','백억','천억','조','십조','백조','천조'];
// 큰 수의 자릿값 틀. 묻는 숫자는 수 안에 한 번만 두고 다른 자리는 0 아닌 숫자로 채운다.
// base는 답을 세는 단위(일 0, 억 8, 조 12)다. 16자리 수는 맨 앞을 8 이하로 두어 컴퓨터가 정확히 다루는 수(약 9007조) 안에 둔다.
export function placeSpec({key,base,first,last,maxLength,unit}) {
  const group=placeNames[base||4],ask=unit?`몇 ${josa(unit,'을/를')} 나타낼까요`:'얼마를 나타낼까요';
  // placeGuide: 한 번 틀려 다시 풀 때 식 상자의 긴 수에 네 자리마다 옅은 금을 긋는 틀(10-22 판단 2, 검수 A2-14). 금은 화면(묶음 1)이 긋는다.
  // readTyped: 숫자판에 쓰는 큰 수 답 위에 읽는 말(「5억 100만」)을 늘 보이는 틀. 몇 억·몇 조로 받는 틀은 답이 네 자리 이하라 달지 않는다.
  const spans=seq(first,last).flatMap(p=>seq(1,p===15?8:9).map(d=>d*10**(p-base)));
  return {
    input:'number',maxDigits:String(Math.max(...spans)).length,answerSpan:spans,...(unit?{answerUnit:unit}:{readTyped:true}),placeGuide:true,
    texts:[`〔{shown}〕숫자 {digit:은/는} ${ask}?`,`〔{shown}〕{place} 숫자는 ${ask}?`],
    draw(rng){
      const value=cycle(rng,key,spans),k=String(value).length-1,digit=value/10**k,position=base+k,length=rng.int(position+1,maxLength);
      const others=seq(1,9).filter(n=>n!==digit),shown=seq(0,length-1).map(i=>length-1-i===position?digit:rng.pick(length-1-i===15?others.filter(n=>n<9):others)).join('');
      const near=value/10===digit?value*10:value/10,dir=near>value?'높게':'낮게';
      return {value,digit,shown,position,power:10**position,place:placeNames[position]+'의 자리',unitName:placeNames[position],nearPlace:placeNames[position+(near>value?1:-1)]+"의 자리",nearValue:String(near)+(unit??""),answerValue:String(value)+(unit??""),group:shown.slice(0,length-(base||4)),...errors(
        wrong(digit,'숫자만 답하기',`{place} 숫자 {digit:을/를} 그대로 썼습니다. {place} 숫자 {digit:은/는} {unitName:이/가} {digit}개이므로 {answerValue:을/를} 나타냅니다.`),
        wrong(near,`한 자리 ${dir} 읽기`,`{digit:을/를} {nearPlace} 숫자로 보아 {nearValue:을/를} 썼습니다. {digit:은/는} {place} 숫자이므로 {answerValue:을/를} 나타냅니다.`))};
    },
    answer:v=>v.value,check:v=>Number(v.shown.at(-1-v.position))*10**(v.position-base),
    solution:`{shown:을/를} 오른쪽부터 네 자리씩 끊어 읽습니다.\n{shown}에서 {digit:은/는} {place} 숫자입니다.\n{unitName:이/가} {digit}개 있습니다.\n따라서 이 자리 숫자가 나타내는 값은 {answer}${unit??''}입니다.`,
  };
}
export const numberWords = ['첫째','둘째','셋째','넷째','다섯째','여섯째','일곱째','여덟째'];
const optionBanks=new Map();
export function balancedOptions(rng,answer,pool,required=[],pairedDigits=false) {
  const key=JSON.stringify([answer,pool,required,pairedDigits]);
  if(optionBanks.has(key)){const groups=optionBanks.get(key);return rng.pick(groups.get(rng.pick([...groups.keys()])));}
  const values=[...new Set(pool)].filter(n=>n!==answer),groups=new Map();
  for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)for(let k=j+1;k<values.length;k++){
    const options=[answer,values[i],values[j],values[k]];
    if(!required.every(n=>options.includes(n)))continue;
    if(pairedDigits&&options.filter(n=>n<100).length!==2)continue;
    const rank=options.filter(n=>n<answer).length;
    if(!groups.has(rank))groups.set(rank,[]);groups.get(rank).push(options);
  }
  if(!groups.size)return null;
  optionBanks.set(key,groups);
  return rng.pick(groups.get(rng.pick([...groups.keys()])));
}
