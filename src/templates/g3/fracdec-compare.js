import { explain, j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac, valueOf } from '../../engine/answer.js?v=9a67f36b25';

export default define({id:'g3.fracdec.compare',unit:'g3s1-fractions-decimals',strand:'calc',level:2,label:'같은 분모의 분수 비교',std:['[4수01-11]']},{
  answerKind:'fraction',orderAsked:true,errorCount:2,choiceBox:true, texts:['가장 {direction} 수는 어느 것일까요?','가장 {direction} 수는 어느 것일까요?'],
  draw: explain(function(rng) {const d=rng.int(5,9),ns=rng.shuffle(seq(1,d-1)).slice(0,4).sort((a,b)=>a-b),large=rng.int(0,1)===1;
    const options=rng.shuffle(ns.map(n=>frac(0,n,d))),answer=frac(0,ns[large?3:0],d),opposite=frac(0,ns[large?0:3],d),next=frac(0,ns[large?2:1],d);
    return {d,ns,large,answer,options,listed:options.join(', '),oppositeDirection:large?'작은':'큰',direction:large?'큰':'작은',next,
      ...errors(wrong(opposite,'반대 크기 고르기','가장 {oppositeDirection} 수 {opposite:을/를} 골랐습니다. 분모가 같으면 분자가 클수록 큰 수이므로 가장 {direction} 수는 {answer}입니다.'),wrong(next,'두 번째 크기 고르기','분자를 모두 비교하지 않고 {next:을/를} 골랐습니다. 네 분자를 크기순으로 비교하면 가장 {direction} 수는 {answer}입니다.')),opposite};}, v => ['분모가 모두 ' + j(v.d,'입니다') + '. 같은 크기의 조각이니 조각 수인 분자를 비교합니다.', '분자는 '+v.options.map(n=>n.split('/')[0]).join(', ')+'이고 이 가운데 '+j((v.large?Math.max:Math.min)(...v.ns),'이/가')+' 가장 '+(v.large?'큽니다.':'작습니다.')]),
  answer:v=>v.answer,check:({ns,d,large})=>`${large?Math.max(...ns):Math.min(...ns)}/${d}`,
  isCorrect:(v,c)=>valueOf('fraction',c)===(v.large?Math.max(...v.ns):Math.min(...v.ns))/v.d,
  solution: "{process}\n따라서 가장 {direction} 수는 {answer:입니다}.",
});
