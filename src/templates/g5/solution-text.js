export {explain, j, say, fractionConversion} from '../solution-process.js?v=9a67f36b25';
import {josa as j} from '../../engine/korean.js?v=9a67f36b25';
import {gcd, f} from './helpers.js?v=9a67f36b25';

export function reduction(n,d){
 const g=gcd(n,d),a=n/g,b=d/g,raw=`${n}/${d}`;
 const text=b===1?`${raw} = ${a}입니다.`:g===1
  ?`${j(n,'과/와')} ${d}의 공약수는 1뿐이므로 ${j(raw,'은/는')} 기약분수입니다.`
  :`${raw}의 분자와 분모를 ${j(g,'으로/로')} 나누어 약분하면 ${a}/${b}입니다.`;
 return {n:a,d:b,text};
}
export function mixedStep(n,d){
 return d>1&&n>=d?`${n}/${d} = ${f(n,d)}입니다.`:null;
}
