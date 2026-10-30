import { explain, j, say, commonDenominator } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {comparison,fractionSet,extreme,comparisonErrors} from './comparison.js?v=9a67f36b25';
export default define(meta('reduce','compare',3,'calc',['01-07'],'분모가 다른 분수 비교'),{
 answerKind:'fraction',orderAsked:true,minMistakes:2,errorCount:3,back:'g3s1-fractions-decimals',
 choiceBox:true, texts:['가장 {asked} 수는 어느 것일까요?'],
 draw: explain(function(rng) {const v=comparison(rng,fractionSet);return v&&{...v,options:v.xs.map(x=>x.shown),...comparisonErrors(v)};}, v => {
   let best=v.xs[0];
   return v.xs.slice(1).map((next,i)=>{
     const L=commonDenominator([best.d,next.d]),A=best.a*(L/best.d),B=next.a*(L/next.d),winner=(v.big?A>B:A<B)?best:next;
     // 분모가 같은 짝은 통분하지 않고 분자만 비교합니다.
     const how=best.d===next.d?j(best.shown,'과/와')+' '+j(next.shown,'은/는')+' 분모가 같아 분자 '+best.a+', '+j(next.a,'을/를')+' 비교합니다.':j(best.shown,'과/와')+' '+j(next.shown,'을/를')+' '+j(L,'으로/로')+' 통분하면 '+j(A+'/'+L,'과/와')+' '+j(B+'/'+L,'입니다')+'.';
     const line=(i===0?'먼저 ':'이어서 ')+how+' '+j(winner.shown,'이/가')+' 더 '+(v.big?'큽니다.':'작습니다.');
     best=winner;return line;
   });
 }),
 answer:v=>v.target.shown,check:v=>extreme(v.xs,v.big).shown,isCorrect:(v,c)=>v.xs.some(x=>x.shown===c&&v.xs.every(y=>v.big?x.a*y.d>=y.a*x.d:x.a*y.d<=y.a*x.d)),
 solution: "{process}\n따라서 가장 {asked} 수는 {answer:입니다}.",
});
