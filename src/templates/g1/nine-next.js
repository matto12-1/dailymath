import { numberVars, options } from './helpers.js?v=9a67f36b25';
const answer=({n,direction})=>n+direction;
const mistakes=[
 {id:'opposite',label:'앞과 다음 반대로 고르기',value:({n,direction})=>n-direction,say:'{n}보다 1만큼 더 {opposite} 수 {value:을/를} 골랐습니다. {n}에서 하나 {action} 세면 {answer}입니다.'},
 {id:'given',label:'처음 수 그대로 고르기',value:({n})=>n,say:'처음 수 {n:을/를} 그대로 골랐습니다. {n} 바로 {where}에 오는 수는 {answer}입니다.'},
 {id:'two-steps',label:'두 수 건너가기',value:({n,direction})=>n+2*direction,say:'두 수를 건너가서 {value:을/를} 골랐습니다. 한 수만 {action} 세면 {answer}입니다.'},
];
export default {
 id:'g1.nine.next',grade:1,unit:'g1s1-numbers-nine',strand:'calc',level:3,std:['[2수01-03]'],
 label:'1만큼 더 큰 수와 1만큼 더 작은 수',input:'choice',answerKind:'int',maxDigits:1,speedBonus:true,
 range:{min:1,max:9},operandRange:{min:-2,max:100},answerSpan:{min:1,max:9},texts:['{question}'],
 make(rng){return numberVars(rng,()=>{const direction=rng.pick([-1,1]),n=rng.int(direction>0?1:2,direction>0?8:9),where=direction>0?'다음':'앞';
 return {n,direction,where,action:direction>0?'이어':'거꾸로',opposite:direction>0?'작은':'큰',question:rng.pick([n+'보다 1만큼 더 '+(direction>0?'큰':'작은')+' 수는 무엇일까요?',n+' 바로 '+where+'의 수는 무엇일까요?'])};
 },answer,mistakes,this.range);},
 answer,check:({n,direction})=>direction>0?n+1:n-1,choices:options,isCorrect:(v,c)=>c===answer(v),mistakes,
 art:({n})=>({kind:'tenframe',n}),solution:'{n}에서 한 수만 {action} 셉니다.\n따라서 {n} 바로 {where}의 수는 {answer}입니다.',
};
