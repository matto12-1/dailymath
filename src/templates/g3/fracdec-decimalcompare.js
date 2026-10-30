import { explain, j, comparisonSubjects } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';
import { dec, valueOf } from '../../engine/answer.js?v=9a67f36b25';

export default define({id:'g3.fracdec.decimalcompare',unit:'g3s1-fractions-decimals',strand:'calc',level:3,label:'소수 크기 비교',std:['[4수01-14]']},{
  answerKind:'decimal',orderAsked:true,errorCount:2,choiceBox:true, texts:['가장 {direction} 수는 어느 것일까요?','가장 {direction} 수는 어느 것일까요?'],
  draw: explain(function(rng) {const w=rng.int(1,9),tails=rng.shuffle(seq(1,9)).slice(0,4).sort((a,b)=>a-b),[a,b,c,d]=tails,scaled=[10*w+a,10*w+b,10*(w-1)+c,10*(w-1)+d],large=rng.int(0,1)===1;
    const answer=dec(scaled[large?1:2],1),opposite=dec(scaled[large?2:1],1),tailOnly=dec(scaled[large?3:0],1),options=rng.shuffle(scaled.map(n=>dec(n,1)));
    return {scaled,large,answer,opposite,tailOnly,options,listed:options.join(', '),direction:large?'큰':'작은',
      ...errors(wrong(opposite,'반대 크기 고르기',`가장 ${large?"작은":"큰"} 수 ${opposite}을 골랐습니다. 소수점 왼쪽의 수부터 차례로 비교하면 가장 ${large?"큰":"작은"} 수는 ${answer}입니다.`),wrong(tailOnly,'소수점 뒤 숫자만 비교하기','소수점 왼쪽을 보지 않고 오른쪽의 수만 비교하여 {tailOnly:을/를} 골랐습니다. 소수점 왼쪽의 수를 먼저 비교한 뒤 오른쪽을 비교하면 가장 {direction} 수는 {answer}입니다.'))};}, v => {const whole=(v.large?Math.max:Math.min)(...v.scaled.map(n=>Math.floor(n/10)));const tails=v.options.map(n=>Math.round(Number(n)*10)).filter(n=>Math.floor(n/10)===whole).map(n=>n%10);return ['소수점 왼쪽의 수는 ' + j(v.options.map(n=>Math.floor(Number(n))).join(', '),'입니다') + '. ' + j(whole,'이/가') + ' 가장 ' + v.direction + ' 소수점 왼쪽의 수입니다.', comparisonSubjects(v.options.filter(n=>Math.floor(Number(n))===whole)) + '의 소수점 오른쪽의 수 ' + j(tails.join(', '),'을/를') + ' 비교합니다. ' + j((v.large?Math.max:Math.min)(...tails),'이/가') + ' 더 ' + (v.large?'큽니다.':'작습니다.')];}),
  answer:v=>v.answer,check:({scaled,large})=>dec(large?Math.max(...scaled):Math.min(...scaled),1),
  isCorrect:(v,c)=>Math.round(valueOf('decimal',c)*10)===(v.large?Math.max(...v.scaled):Math.min(...v.scaled)),
  solution: "{process}\n따라서 가장 {direction} 수는 {answer:입니다}.",
});
