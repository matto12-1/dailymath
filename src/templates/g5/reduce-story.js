import { explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {comparison,mixedSet,extreme,comparisonErrors} from './comparison.js?v=9a67f36b25';
const names=['주스','우유','차','물'];
export default define(meta('reduce','story',3,'word',['01-12'],'음료 양 비교'),{
 answerKind:'text',choiceOrder:(c,v)=>v.options.indexOf(c),orderAsked:true,minMistakes:2,errorCount:3,back:'g3s1-fractions-decimals',texts:['양이 가장 {asked} 음료는 어느 것일까요?'],
 draw: explain(function(rng) {const v=comparison(rng,mixedSet);if(!v)return null;v.xs.forEach((x,i)=>{x.name=names[i];x.choice=x.name+' '+x.shown+' L';});return {...v,asked:v.big?'많은':'적은',question:v.big?'많습니다':'적습니다',options:v.xs.map(x=>x.choice),amount:v.target.shown,targetName:v.target.name,...comparisonErrors(v,'choice')};}, v => {const conv=x=>x.name+'의 양은 '+(x.decimal?x.shown+' L입니다.':x.shown+' = '+Number((x.a/x.d).toFixed(3))+' L입니다.');return ['분수를 소수로 바꾸어 비교합니다. '+v.xs.slice(0,2).map(conv).join(' '), v.xs.slice(2).map(conv).join(' '), '양을 작은 순서로 놓으면 '+v.xs.map(x=>Number((x.a/x.d).toFixed(3))).sort((a,b)=>a-b).map(n=>n+' L').join(', ')+'입니다.'];}),
 answer:v=>v.target.choice,check:v=>extreme(v.xs,v.big).choice,isCorrect:(v,c)=>v.xs.some(x=>x.choice===c&&v.xs.every(y=>v.big?x.a*y.d>=y.a*x.d:x.a*y.d<=y.a*x.d)),
 art:()=>({scene:'drink-bottles'}),solution: "{process}\n따라서 양이 가장 {asked} 음료는 {targetName:입니다}.",
});
