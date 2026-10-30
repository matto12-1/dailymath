import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {comparison,mixedSet,extreme,comparisonErrors,decimalStep,asDecimal} from './comparison.js?v=9a67f36b25';
import {j} from '../solution-process.js?v=9a67f36b25';
export default define(meta('reduce','decimal',3,'calc',['01-12'],'분수와 소수의 크기 비교'),{
 answerKind:'text',orderAsked:true,minMistakes:2,errorCount:3,choiceBox:true, texts:['가장 {asked} 수는 어느 것일까요?'],
 // 풀이는 보기 차례 그대로 분수마다 「11/20 = 55/100 = 0.55」로 바꾸어 보인다(검수 A3-2). 틀린 보기 셋에 모두 실수 말(A3-11).
 draw(rng){const v=comparison(rng,mixedSet);return v&&{...v,options:v.xs.map(x=>x.shown),
  steps:j(v.xs.filter(x=>!x.decimal).map(decimalStep).join(', '),'입니다'),
  converted:j(v.xs.map(x=>asDecimal(x).decimal).join(', '),'입니다'),
  ...comparisonErrors(v)};},
 answer:v=>v.target.shown,check:v=>extreme(v.xs,v.big).shown,isCorrect:(v,c)=>v.xs.some(x=>x.shown===c&&v.xs.every(y=>v.big?x.a*y.d>=y.a*x.d:x.a*y.d<=y.a*x.d)),
 solution:'분수를 소수로 바꾸면 {steps}.\n네 수를 모두 소수로 나타내면 {converted}.\n따라서 가장 {asked} 수는 {answer:입니다}.',
});
