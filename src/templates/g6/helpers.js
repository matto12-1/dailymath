import {fill} from '../../engine/korean.js?v=9a67f36b25';
import {define as baseDefine,cycle,f,gcd,seq,errors as pack,same,parseAnswer} from '../g5/helpers.js?v=9a67f36b25';
export {seq,wrong,errors,gcd,lcm,f,improper,tableArt,dec,frac,fill} from '../g5/helpers.js?v=9a67f36b25';
export {pair} from '../../engine/answer.js?v=9a67f36b25';
export {pictureHints} from '../../engine/guess.js?v=9a67f36b25';
const units={fracdiv1:'g6s1-fraction-divide',prisms:'g6s1-prisms-pyramids',decimaldiv1:'g6s1-decimal-divide',ratio:'g6s1-ratio-rate',graphs:'g6s1-graphs',volume:'g6s1-cuboid-area-volume',fracdiv2:'g6s2-fraction-divide',space:'g6s2-space-solids',decimaldiv2:'g6s2-decimal-divide',proportion:'g6s2-proportion-distribution',circlearea:'g6s2-circle-perimeter-area',roundsolid:'g6s2-cylinders-cones-spheres'};
export const meta=(family,name,level,strand,std,label)=>({id:`g6.${family}.${name}`,grade:6,unit:units[family],level,strand,std:std.map(s=>`[6수${s}]`),label});
export function define(metadata,spec){
 const fractions=new Map();
 const rewrite=s=>s?.replace(/(?:\{(\w+)\} )?\{(\w+)\}\/\{(\w+):([^}]+)\}/g,(_,w,n,d,particle)=>{
   const key=`fraction_${w??''}_${n}_${d}`;fractions.set(key,{w,n,d});return `{${key}:${particle}}`;
 });
 return baseDefine(metadata,{...spec,texts:spec.texts.map(rewrite),solution:rewrite(spec.solution),draw(rng){
   const v=spec.draw(rng);if(!v)return null;
   for(const key of ['e1','e2','e3'])if(v[key])v[key]={...v[key],say:rewrite(v[key].say)};
   for(const [key,{w,n,d}]of fractions)if(n in v&&d in v)v[key]=`${w?v[w]+' ':''}${v[n]}/${v[d]}`;
   return v;
 }});
}
export function cart(fields){return Object.entries(fields).reduce((rows,[key,values])=>rows.flatMap(row=>values.map(value=>({...row,[key]:value}))),[{}]);}
// Enumerate the input domain first; cycle the actual answer domain without losing endpoints.
export function numeric(metadata,spec){
  const kind=spec.answerKind??'int',minimum=spec.minMistakes??2;
  const validRows=spec.cases.filter(v=>{
    const a=spec.answer(v),es=spec.errors(v).map(e=>e.value).filter(x=>parseAnswer(kind,x)!==null&&!same(kind,x,a));
    return es.filter((x,i)=>!es.slice(0,i).some(y=>same(kind,x,y))).length>=minimum;
  });
  if(!validRows.length)throw Error(`${metadata.id}: empty input domain`);
  const answers=[...new Set(validRows.map(spec.answer))];
  const groups=new Map();for(const v of validRows){const a=spec.cycleBy?v[spec.cycleBy]:spec.answer(v);if(!groups.has(a))groups.set(a,[]);groups.get(a).push(v);}
 const keys=[...groups.keys()].flatMap(key=>Array(spec.cycleWeights?.[String(key)]??1).fill(key)),subgroups=new Map([...groups].map(([key,vs])=>[key,new Map([...new Set(vs.map(spec.answer))].map(a=>[a,vs.filter(v=>spec.answer(v)===a)]))]));
  const t=define(metadata,{input:'number',maxDigits:9,answerKind:kind,mixedInput:kind==='fraction',range:{min:0,max:100000000},operandRange:{min:0,max:100000000},...spec,
    ...(kind==='int'?{answerSpan:answers,answerCases:()=>validRows}:{answerValues:answers}),
    draw(rng){const key=cycle(rng,groups,keys),sub=subgroups.get(key),a=cycle(rng,sub,[...sub.keys()]),v={...rng.pick(sub.get(a))};Object.assign(v,spec.decorate?.(v,rng)??{});if(v.steps)v.stepsEnding=fill('{answer:입니다}',{answer:spec.answer(v)}).slice(String(spec.answer(v)).length);return {...v,...pack(...spec.errors(v)),...spec.extra?.(v,rng)};},
  });
  delete t.cases;delete t.errors;delete t.decorate;delete t.extra;
  return t;
}
export const proper=cart({d:seq(2,12)}).flatMap(({d})=>seq(1,d-1).filter(a=>gcd(a,d)===1).map(a=>({a,d})));
// Check division by equalising the denominators, then divide the resulting counts.
export function divideCheck(a,d,b,e){const L=d*e/gcd(d,e);return f(a*(L/d),b*(L/e));}
export const moneylessScene=scene=>()=>({scene});
export const names=['','','','삼각','사각','오각','육각','칠각','팔각'];
export const sum=xs=>xs.reduce((a,b)=>a+b,0);
export const countCells=h=>h.flat().filter(n=>n>0).length;
export const totalCubes=h=>sum(h.flat());
export const frontHeights=h=>h[0].map((_,x)=>Math.max(...h.map(row=>row[x])));
export const sideHeights=h=>h.map(row=>Math.max(...row));
// Keep the unreduced fraction, reduced improper fraction and mixed answer once each.
export function fractionSteps(n,d){
 const g=gcd(n,d),parts=[d===1?String(n):`${n}/${d}`,d/g===1?String(n/g):`${n/g}/${d/g}`,f(n,d)];
 return parts.filter((s,i)=>!parts.slice(0,i).includes(s)&&!(s.endsWith('/1')&&i>0)).join(' = ');
}
// 유한소수의 몫을 분모가 10의 거듭제곱인 분수로 나타낸다.
export function decimalDivision(n,d){
 if(n%d===0)return fill('{n} ÷ {d} = {answer:입니다}.',{n,d,answer:n/d});
 const g=gcd(n,d),a=n/g,b=d/g;
 let power=10;while(power%b!==0)power*=10;
 const scaled=a*power/b,answer=String(n/d),reduction=g>1?fill('{n}/{d:을/를} 약분하면 {a}/{b:입니다}.\n',{n,d,a,b}):'';
 return fill('{n} ÷ {d}의 몫을 분수로 나타내면 {n}/{d:입니다}.\n{reduction}{a}/{b} = {scaled}/{power} = {answer:입니다}.',{n,d,a,b,scaled,power,answer,reduction});
}
