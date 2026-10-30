import { explain, j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac, valueOf } from '../../engine/answer.js?v=9a67f36b25';

export default define({id:'g3.fracdec.unitcompare',unit:'g3s1-fractions-decimals',strand:'calc',level:3,label:'단위분수 크기 비교',std:['[4수01-11]']},{
  answerKind:'fraction',orderAsked:true,errorCount:2,choiceBox:true, texts:['가장 {direction} 수는 어느 것일까요?'],
  draw: explain(function(rng){const ds=rng.shuffle(seq(2,9)).slice(0,4).sort((a,b)=>a-b),large=rng.int(0,1)===1,answer=frac(0,1,ds[large?0:3]),opposite=frac(0,1,ds[large?3:0]),next=frac(0,1,ds[large?1:2]),options=rng.shuffle(ds.map(d=>frac(0,1,d)));
    return {ds,large,answer,opposite,next,options,listed:options.join(', '),direction:large?'큰':'작은',
      ...errors(wrong(opposite,'분모 크기대로 고르기','분모가 {oppositeDen}인 {opposite:을/를} 골랐습니다. 단위분수는 분모가 클수록 작으므로 가장 {direction} 수는 {answer}입니다.'),wrong(next,'두 번째 크기 고르기','분모를 모두 비교하지 않고 {next:을/를} 골랐습니다. 네 분모의 크기를 비교하면 가장 {direction} 수는 {answer}입니다.')),oppositeDen:ds[large?3:0]};}, v => ['분모는 '+j(v.options.map(s=>s.split('/')[1]).join(', '),'입니다')+'.', '단위분수는 분모가 클수록 작습니다. 가장 '+(v.large?'작은':'큰')+' 분모는 '+(v.large?Math.min:Math.max)(...v.ds)+'입니다.']),
  answer:v=>v.answer,check:({ds,large})=>`1/${large?Math.min(...ds):Math.max(...ds)}`,
  isCorrect:(v,c)=>valueOf('fraction',c)===1/(v.large?Math.min(...v.ds):Math.max(...v.ds)),
  solution:'{process}\n따라서 가장 {direction} 수는 {answer:입니다}.',
});
