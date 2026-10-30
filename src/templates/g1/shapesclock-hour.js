import {numberVars,options} from './helpers.js?v=9a67f36b25';
const answer=({h})=>h;
const mistakes=[
 {id:'long-hand',label:'긴바늘로 시 읽기',value:()=>12,say:'긴바늘이 가리키는 12를 시로 읽었습니다. 몇 시는 짧은바늘로 읽으므로 {h}시입니다.'},
 {id:'other-hour',label:'{otherLabel}',value:({other})=>other,say:'{otherAction} {value}시로 읽었습니다. 시는 짧은바늘이 가리키는 숫자를 그대로 읽으므로 {h}시입니다.'},
 {id:'previous-hour',label:'앞 시로 읽기',value:({h})=>(h+10)%12+1,say:'짧은바늘이 가리키는 곳보다 앞의 수 {value:을/를} 읽었습니다. 앞뒤 수 대신 바늘 끝의 수를 읽으면 {h}시입니다.'},
];
export default {
 id:'g1.shapesclock.hour',grade:1,unit:'g1s2-shapes-clock',strand:'life',level:2,label:'몇 시 읽기',std:['[2수03-07]'],
 input:'choice',answerKind:'int',maxDigits:2,range:{min:1,max:12},differentDigits:true,answerUnit:'시',answerSpan:{min:1,max:12},
 texts:['시계는 몇 시일까요?'],make(rng){return numberVars(rng,()=>{const h=rng.int(1,12),mirror=12-h,fallback=mirror===h||!mirror;return {h,other:fallback?h%12+1:mirror,otherLabel:fallback?'다음 시로 읽기':'시계 수를 거꾸로 세기',otherAction:fallback?'짧은바늘보다 다음 수를 골라':'12에서 반대 방향으로 세어'};},answer,mistakes,this.range,{differentDigits:true});},
 answer,check:({h})=>h%12||12,choices:options,isCorrect:(v,c)=>c===v.h,mistakes,art:({h})=>({kind:'clock',h,m:0}),
 solution:'긴바늘이 12를 가리킵니다.\n짧은바늘이 가리키는 수로 시를 읽습니다.\n따라서 {h}시입니다.',
};
