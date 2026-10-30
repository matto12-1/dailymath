import {frac,dec,gcd,errors,wrong,fill} from './helpers.js?v=9a67f36b25';
import {makeRng} from '../../engine/rng.js?v=9a67f36b25';
const pool=[];for(let d=2;d<=25;d++)for(let a=1;a<d;a++)if(gcd(a,d)===1&&a/d>=.5)pool.push({a,d,shown:frac(0,a,d),value:a/d,gap:d-a});
export const extreme=(xs,big,key='value')=>xs.reduce((best,x)=>(big?x[key]>best[key]:x[key]<best[key])?x:best);
const fractionPool=pool.filter(x=>x.d<=12);
const banks=new Map();
// Balance visible numerator, denominator and gap ranks in both question directions.
// 고정 난수의 800개 후보로도 모든 요령의 기대 비율 30% 미만을 맞춘다.
// The arithmetic and correct answer are unchanged; only input sampling is weighted.
function rankScores(xs,target,big,mixed){
 return [...['a','d','gap'].flatMap(key=>xs.map(x=>x[key]).sort((a,b)=>(big?1:-1)*(a-b)).map(n=>target[key]===n?1/xs.filter(x=>x[key]===n).length:0)),big?.5:0,big?0:.5,...(mixed?[target.decimal?.5:0,target.decimal?0:.5]:[])];
}
function bank(mixed){
 if(banks.has(mixed))return banks.get(mixed);
 const rng=makeRng(500),groups=new Map();
 for(let i=0;i<800;i++){
  let xs;
  if(!mixed){const low=rng.pick(fractionPool).value;xs=rng.shuffle(fractionPool.filter(x=>x.value>=low&&x.value<=low+.25)).slice(0,4);}
  else{
   const decimals=rng.shuffle([5,6,7,8,9]).slice(0,2).map(a=>({a,d:10,gap:10-a,shown:dec(a,1),value:a/10,decimal:true})),low=Math.min(...decimals.map(x=>x.value)),high=Math.max(...decimals.map(x=>x.value));
   xs=[...decimals,...rng.shuffle(pool.filter(x=>[2,4,5,8,10,20,25].includes(x.d)&&!decimals.some(y=>y.value===x.value)&&Math.max(high,x.value)-Math.min(low,x.value)<=.25)).slice(0,2)];
  }
  if(xs.length!==4||new Set(xs.map(x=>x.value)).size!==4||Math.max(...xs.map(x=>x.value))-Math.min(...xs.map(x=>x.value))>.25)continue;
  if(!mixed&&xs.some(x=>xs.some(y=>x.d/gcd(x.d,y.d)*y.d>60)))continue;
  for(const big of [false,true]){
   const target=extreme(xs,big);
   if([extreme(xs,!big,'gap'),extreme(xs,!big,'d'),extreme(xs,big,'a')].every(x=>x===target))continue;
   const scores=rankScores(xs,target,big,mixed),key=scores.join(',');
   if(!groups.has(key))groups.set(key,{scores,cases:[],weight:1});
   groups.get(key).cases.push({xs,big});
  }
 }
 const gs=[...groups.values()];let calibrated=false;
 for(let i=0;i<5000;i++){
  const total=gs.reduce((s,g)=>s+g.weight,0),means=gs[0].scores.map((_,j)=>gs.reduce((s,g)=>s+g.weight*g.scores[j],0)/total),highest=Math.max(...means);
  if(highest<.30){calibrated=true;break;}
  const j=means.indexOf(highest);for(const g of gs)g.weight*=Math.exp(-.15*g.scores[j]);
 }
 if(!calibrated)throw Error('Comparison input ranks could not be balanced');
 const total=gs.reduce((s,g)=>s+g.weight,0);let cumulative=0;
 for(const g of gs){cumulative+=g.weight/total;g.end=cumulative;}
 banks.set(mixed,gs);return gs;
}
function sample(rng,mixed){const groups=bank(mixed),draw=rng.next(),group=groups.find(g=>draw<g.end)??groups.at(-1),v=rng.pick(group.cases);return {big:v.big,xs:rng.shuffle(v.xs.map(x=>({...x})))};}
export const fractionSet=rng=>sample(rng,false);
export const mixedSet=rng=>sample(rng,true);
export function comparison(rng,make){
 const {xs,big}=make(rng),target=extreme(xs,big);
 return {xs,big,target,gapPick:extreme(xs,!big,'gap'),byD:extreme(xs,!big,'d'),fake:extreme(xs,big,'a'),asked:big?'큰':'작은',shown:xs.map(x=>x.shown).join(', ')};
}
// 분모가 10·100·1000의 약수인 분수를 소수로: 11/20 → { tenth: '55/100', decimal: '0.55' }. 소수 보기는 그대로.
export function asDecimal(x){
 if(x.decimal)return {tenth:null,decimal:x.shown};
 for(let k=1;k<=3;k++)if(10**k%x.d===0){const scaled=x.a*10**k/x.d;return {tenth:x.d===10**k?null:`${scaled}/${10**k}`,decimal:dec(scaled,k)};}
 throw new RangeError(`${x.shown}: 소수로 끝나는 분수만 비교합니다.`);
}
// 「11/20 = 55/100 = 0.55」(분모가 이미 10이면 「7/10 = 0.7」).
export const decimalStep=x=>{const {tenth,decimal}=asDecimal(x);return [x.shown,tenth,decimal].filter(Boolean).join(' = ');};
const josa2=(word,pair)=>fill(`{w:${pair}}`,{w:word});
// 틀린 보기마다 실수 말을 단다(검수 A3-11). 전엔 둘만 남겨 넷째 보기를 고르면 말이 없었다.
// 소수와 견줄 때는 「통분」 대신 소수로 바꾸어 견준다. 0.5에는 분모도 조각도 없다.
export function comparisonErrors(v,key='shown'){
 const mixed=v.xs.some(x=>x.decimal),T=v.target,than=v.big?'작습니다':'큽니다',asked=v.big?'큰':'작은';
 const fix=x=>{
  if(mixed){
   const X=asDecimal(x).decimal,Y=asDecimal(T).decimal;
   const conversions=[x,T].filter(y=>!y.decimal).map(y=>josa2(y.shown,'을/를')+' 소수로 바꾸면 '+asDecimal(y).decimal+'입니다. ').join('');
   if(x.decimal&&T.decimal){const a=X.split('.')[1]??'',b=Y.split('.')[1]??'';let i=0;while((a[i]??'0')===(b[i]??'0'))i++;return josa2(X,'과/와')+' '+Y+'의 소수 '+['첫째','둘째','셋째'][i]+' 자리 숫자를 비교하면 '+josa2(X,'은/는')+' '+Y+'보다 '+than+'.';}
   return conversions+josa2(X,'은/는')+' '+Y+'보다 '+than+'.';
  }
  const L=x.d/gcd(x.d,T.d)*T.d,A=x.a*L/x.d,B=T.a*L/T.d;
  return x.d===T.d?josa2(x.shown,'과/와')+' '+josa2(T.shown,'은/는')+' 분모가 같으므로 분자 '+josa2(x.a,'과/와')+' '+josa2(T.a,'을/를')+' 비교하면 '+josa2(x.shown,'은/는')+' '+T.shown+'보다 '+than+'.'
   :josa2(x.shown,'과/와')+' '+josa2(T.shown,'을/를')+' '+josa2(L,'으로/로')+' 통분하면 '+josa2(A+'/'+L,'과/와')+' '+B+'/'+L+'이므로 '+josa2(x.shown,'은/는')+' '+T.shown+'보다 '+than+'.';
 };
 return errors(...v.xs.filter(x=>x!==T).map(x=>{
  const subject=x.name?x.name+' '+x.shown+' L':x.shown;
  const target=x.name?'양이 가장 '+(v.big?'많은':'적은')+' 음료':'가장 '+asked+' 수';
  const reason=!x.decimal&&x===v.byD?'분모가 가장 '+(v.big?'작은':'큰')+' ':!x.decimal&&x===v.fake?'분자가 가장 '+(v.big?'큰':'작은')+' ':'';
  return wrong(x[key],'크기를 잘못 견주기',reason+josa2(subject,'을/를')+' '+target+'로 보았습니다. '+fix(x)+(x.name?' '+fill('양이 가장 {asked} 음료는 {choice:입니다}.',{asked:v.big?'많은':'적은',choice:T.choice}):''));
 }));
}
