import {numberVars,options,countBack} from './helpers.js?v=9a67f36b25';
const answer=({b})=>10-b;
const mistakes=[
 {id:'removed',label:'뺀 수 고르기',value:({b})=>b,say:'남은 수 대신 뺀 수 {b:을/를} 골랐습니다. 10에서 {b}개를 지우고 남은 점을 세면 {answer}입니다.'},
 {id:'start-included',label:'처음 수도 세기',value:({b})=>11-b,say:'거꾸로 셀 때 10부터 다시 세어 {value:이/가} 나왔습니다. 10 바로 앞의 수부터 {b}번 거꾸로 세면 {answer}입니다.'},
 {id:'extra-subtract',label:'하나 더 빼기',value:({b})=>9-b,say:'{b}개보다 하나 더 빼서 {value:이/가} 나왔습니다. 10에서 {b}개만 빼면 {answer}입니다.'},
];
export default {
 id:'g1.addsub1.from10',grade:1,unit:'g1s1-addsub',strand:'calc',level:3,std:['[2수01-06]'],label:'10에서 빼기',
 input:'choice',answerKind:'int',maxDigits:1,speedBonus:true,range:{min:0,max:9},answerSpan:{min:1,max:9},
 texts:['〔10 − {b} = ?〕그림을 보고 계산하면 얼마일까요?'],
 make(rng){return numberVars(rng,()=>{const b=rng.int(1,9);return {b,backwards:Array.from({length:b},(_,i)=>9-i).join(', ')};},answer,mistakes,this.range);},
 answer,check:({b})=>countBack(10,b),choices:options,isCorrect:(v,c)=>c===answer(v),mistakes,
 art:({b})=>({kind:'tenframe',n:10,crossed:b}),
 solution:'10에서 {b}개를 지웁니다.\n10 바로 앞의 수부터 {backwards} 하고 거꾸로 셉니다.\n따라서 10에서 {b:을/를} 빼면 {answer}입니다.',
};
