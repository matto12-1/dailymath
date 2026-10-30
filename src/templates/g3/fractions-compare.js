import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac, parseAnswer } from '../../engine/answer.js?v=9a67f36b25';

export default define({id:'g3.fractions.compare',unit:'g3s2-fractions',strand:'calc',level:3,label:'가분수와 대분수 비교',std:['[4수01-11]']},{
  answerKind:'fraction',orderAsked:true,errorCount:2,choiceBox:true, texts:['가장 {direction} 수는 어느 것일까요?','가장 {direction} 수는 어느 것일까요?'],
  draw: explain(function(rng) {const d=rng.int(3,9),large=rng.int(0,1)===1,ns=rng.shuffle(seq(d+1,4*d-1).filter(n=>n%d)).slice(0,4),items=ns.map((n,i)=>({total:n,n:i<2?n:n%d,shown:i<2?frac(0,n,d):frac(Math.floor(n/d),n%d,d)}));
    const ordered=[...items].sort((a,b)=>a.total-b.total),right=ordered[large?3:0],opposite=ordered[large?0:3],byNumerator=[...items].sort((a,b)=>a.n-b.n),mistaken=byNumerator[large?3:0];
    const near=ordered[large?2:1],useNumerator=mistaken.total!==right.total&&mistaken.total!==opposite.total&&byNumerator[large?2:1].n!==mistaken.n;
    const options=rng.shuffle(items.map(p=>p.shown));return {d,large,items,answer:right.shown,opposite:opposite.shown,mistaken:mistaken.shown,options,listed:options.join(', '),oppositeDirection:large?'작은':'큰',direction:large?'큰':'작은',
      ...errors(wrong(opposite.shown,'반대 크기 고르기','가장 {oppositeDirection} 수 {opposite:을/를} 골랐습니다. 대분수를 가분수로 바꾸어 분자를 비교하면 가장 {direction} 수는 {answer}입니다.'),useNumerator?wrong(mistaken.shown,'적힌 분자만 비교하기','대분수의 자연수 부분을 빠뜨리고 분자만 비교하여 {mistaken:을/를} 골랐습니다. 자연수 부분도 가분수의 분자에 넣어 비교하면 가장 {direction} 수는 {answer}입니다.'):wrong(near.shown,'두 번째 크기 고르기',`둘째로 ${large?'큰':'작은'} 수 ${near.shown}을 골랐습니다. ${near.shown}은 ${near.total}/${d}, ${right.shown}은 ${right.total}/${d}이므로 가장 ${large?'큰':'작은'} 수는 ${right.shown}입니다.`))};}, v => ['대분수를 가분수로 바꿉니다. ' + v.options.map(s=>v.items.find(p=>p.shown===s)).filter(p=>p.shown.includes(' ')).map(p=>p.shown+' = '+say(p.total+'/'+v.d)).join(' '), '분모가 '+j(v.d,'으로/로')+' 같으므로 분자는 ' + j(v.options.map(s=>v.items.find(p=>p.shown===s).total).join(', '),'입니다') + '. 가장 ' + v.direction + ' 분자는 ' + j((v.large?Math.max:Math.min)(...v.items.map(p=>p.total)),'입니다') + '.']),
  answer:v=>v.answer,check:({items,large,d})=>`${(large?Math.max:Math.min)(...items.map(p=>p.total))}/${d}`,
  isCorrect:(v,c)=>{const p=parseAnswer('fraction',c);return p!==null&&(p.w*p.d+p.n)*v.d===(v.large?Math.max:Math.min)(...v.items.map(p=>p.total))*p.d;},
  solution: "{process}\n따라서 가장 {direction} 수는 {answer:입니다}.",
});
