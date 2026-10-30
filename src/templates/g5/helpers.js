import {define as baseDefine} from '../g3/helpers.js?v=9a67f36b25';
export {seq,errors,wrong,until,fill} from '../g3/helpers.js?v=9a67f36b25';
export {cycle} from '../g3/arithmetic-helpers.js?v=9a67f36b25';
export {casesSpec} from '../g4/helpers.js?v=9a67f36b25';
export {dec,frac,same,valueOf,parseAnswer} from '../../engine/answer.js?v=9a67f36b25';
import {frac,parseAnswer} from '../../engine/answer.js?v=9a67f36b25';
import {pictureHints} from '../../engine/guess.js?v=9a67f36b25';
import {fill} from '../../engine/korean.js?v=9a67f36b25';

const units={mixed:'g5s1-mixed-operations',factors:'g5s1-factors-multiples',reduce:'g5s1-reduce-common-denominators',correspond:'g5s1-correspondence',fracaddsub:'g5s1-fraction-addsub',area:'g5s1-perimeter-area',range:'g5s2-range-rounding',fracmul:'g5s2-fraction-multiply',symmetry:'g5s2-congruence-symmetry',decimalmul:'g5s2-decimal-multiply',cuboids:'g5s2-cuboids',average:'g5s2-average-likelihood'};
export const meta=(family,name,level,strand,std,label)=>({id:`g5.${family}.${name}`,grade:5,unit:units[family],level,strand,std:std.map(s=>`[6수${s}]`),label});
export function define(meta,spec){
  const t=baseDefine(meta,{maxDigits:8,errorCount:2,minMistakes:2,...spec,draw(rng){
    const v=spec.draw(rng);
    if(v)for(const key of ['e1','e2','e3'])if(v[key])v[key]={...v[key],say:v[key].say.replace(/\{value(?::[^}]+)?\}/g,token=>fill(token,{value:v[key].value}))};
    return v;
  }});
  if(t.input==='choice')t.guessHints=spec.guessHints??[pictureHints];
  return t;
}
export const gcd=(a,b)=>b?gcd(b,a%b):a;
export const lcm=(a,b)=>a/gcd(a,b)*b;
export const divisors=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
export function f(n,d){const g=gcd(n,d);n/=g;d/=g;return frac(Math.floor(n/d),n%d,d);}
export function improper(s){const p=parseAnswer('fraction',s);return [(p.w*p.d+p.n),p.d];}
// 두 번째 계산은 공통분모 대신 교차곱, 곱셈 대신 반복 덧셈으로 검산한다.
export const addF=(x,y,sign=1)=>{const [a,d]=improper(x),[b,e]=improper(y);return f(a*e+sign*b*d,d*e);};
export const multiplyF=(x,y)=>{const [a,d]=improper(x),[b,e]=improper(y);let n=0;for(let i=0;i<b;i++)n+=a;return f(n,d*e);};
export const nth=['','첫','두','세','네','다섯','여섯','일곱','여덟','아홉','열'];
export const count=(xs)=>xs.reduce((a,b)=>a+b,0);
export const repeated=(a,b)=>Array.from({length:b},()=>a).reduce((s,n)=>s+n,0);
export function pairs(aMin,aMax,bMin,bMax,accept=()=>true){const out=[];for(let a=aMin;a<=aMax;a++)for(let b=bMin;b<=bMax;b++)if(accept(a,b))out.push({a,b});return out;}
const fractionBanks=new Map();
// 분모부터 뽑으면 1/2에 쏠리므로, 조건에 맞는 기약분수의 짝에서 고른다.
export function fractionVars(rng,multiplication=false){
 if(!fractionBanks.has(multiplication)){
  const rows=[];
  for(let d=2;d<=12;d++)for(let e=2;e<=12;e++){
   if(multiplication?d*e>60:d===e||lcm(d,e)>30)continue;
   for(let a=1;a<d;a++)for(let b=1;b<e;b++)if(gcd(a,d)===1&&gcd(b,e)===1)rows.push({a,b,d,e,L:lcm(d,e),left:frac(0,a,d),right:frac(0,b,e)});
  }
  fractionBanks.set(multiplication,rows);
 }
 return {...rng.pick(fractionBanks.get(multiplication))};
}
// 소수 자릿수를 모두 보여 준 뒤, 끝의 0을 지우는 까닭을 쓴다.
export function decimalProduct(product,places){
 const raw=(product/10**places).toFixed(places),answer=String(Number(raw));
 return fill(raw===answer?'{raw:입니다}.':'{raw:입니다}. 소수 끝자리의 0은 생략하여 {answer:으로/로} 씁니다.',{raw,answer});
}
export const tableArt=(rows)=>({kind:'table',rows,fontSize:23,wide:true});
export const numericSort=(values,kind)=>[...values].sort((a,b)=>{const val=s=>kind==='fraction'?improper(s).reduce((n,d)=>n/d):Number(s);return val(a)-val(b);});
