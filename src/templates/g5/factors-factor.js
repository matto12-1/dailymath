import {define,meta,divisors,errors,wrong,seq,cycle} from './helpers.js?v=9a67f36b25';
const cases=[];for(let n=8;n<=50;n++)for(const a of divisors(n)){
 const pool=seq(1,n-1).filter(x=>n%x!==0&&String(x).length===String(a).length);
 if(pool.length>=3)cases.push({n,a,pool});
}
const span=[...new Set(cases.map(v=>v.a))].sort((a,b)=>a-b);
const slip=(n,x)=>wrong(x,'나머지 보지 않기',`{value:을/를} 약수로 골랐습니다. ${n} ÷ ${x} = ${Math.floor(n/x)} … ${n%x}로 나누어떨어지지 않으므로 {value:은/는} ${n}의 약수가 아니며, ${n} ÷ {answer} = {quotient}로 나누어떨어지는 {answer:이/가} 약수입니다.`);
const banks=seq(0,3).map(rank=>cases.flatMap(v=>{
 const lower=v.pool.filter(x=>x<v.a),upper=v.pool.filter(x=>x>v.a);
 const unit=v.n%5===0&&v.a%5===0?5:v.n%2===0&&v.a%2===0?2:1;
 const eligible=v.pool.filter(x=>x%unit===0&&(x<v.a?rank>0:rank<3));
 const special=eligible.length?eligible:v.a===5?v.pool.filter(x=>x<v.a?rank>0:rank<3):[];
 return lower.length>=rank&&upper.length>=3-rank&&special.length?[{...v,lower,upper,special}]:[];
}));
export default define(meta('factors','factor',1,'calc',['01-04'],'약수 고르기'),{
 texts:['{n}의 약수를 고르시오.','{n}의 약수를 고르시오.'],range:{min:1,max:100},answerSpan:span,answerCases:()=>cases,minMistakes:2,errorCount:3,
 draw(rng){const edge=rng.next()<.1,half=rng.next()<.12,multiple=!edge&&rng.next()<.3,rank=edge?rng.pick([0,3]):rng.int(0,multiple?2:3);
 const available=banks[rank].filter(v=>(edge?v.a===1||v.a===v.n:v.a>1&&v.a<v.n&&(half?v.a*2===v.n:v.a*2!==v.n))&&(!multiple||String(2*v.n).length===String(v.a).length&&v.special.some(x=>rank<2||x<v.a)));
 const v=edge?cycle(rng,banks[rank],available):rng.pick(available.flatMap(v=>Array(v.a===5?1:2).fill(v))),{n,a}=v,first=rng.pick(v.special.filter(x=>!multiple||rank<2||x<a)),others=[first];
 const lower=rng.shuffle(v.lower.filter(x=>x!==first)),upper=rng.shuffle(v.upper.filter(x=>x!==first));
 others.push(...lower.slice(0,rank-(first<a?1:0)),...upper.slice(0,3-rank-(first>a?1:0)));
 if(multiple){const at=others.findLastIndex(x=>x>a&&x!==first);if(at>=0)others[at]=2*n;}
 return {...v,quotient:n/a,options:[a,...others],...errors(...others.map(x=>x===2*n?wrong(x,'배수와 약수 혼동','{n}의 약수 대신 {n} × 2 = {value}인 배수를 골랐습니다. {n}보다 큰 수는 약수가 아니며, {n} ÷ {answer} = {quotient}로 나누어떨어지므로 약수는 {answer:입니다}.'):slip(n,x)))};},
 answer:v=>v.a,check:v=>v.n/(v.n/v.a),isCorrect:(v,c)=>Number.isInteger(c)&&c>0&&v.n%c===0,
 solution:'{n} ÷ {answer} = {quotient}이므로 나누어떨어집니다.\n따라서 {answer:은/는} {n}의 약수입니다.',
});
