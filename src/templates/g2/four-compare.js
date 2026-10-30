import { explain, comparePlaces } from '../solution-process.js?v=9a67f36b25';
import { define, seq, unique, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.four.compare","unit":"g2s2-numbers-four-digits","strand":"calc","level":3,"label":"네 자리 수 비교","std":["[2수01-03]"]}, {

  range: { min: 1000, max: 9999 }, operandRange: { min: 0, max: 9999 }, orderAsked: true,
  choiceBox:true, texts: ['가장 {asked} 수는 어느 것일까요?'],
  draw: explain(function(rng) {
    const values=unique(seq(1,4).map(()=>rng.int(1000,9999)));if(values.length!==4)return null;
    const big=rng.pick([true,false]), target=big?Math.max(...values):Math.min(...values),opposite=big?Math.min(...values):Math.max(...values);
    const extremum=big?Math.max(...values.map(x=>x%10)):Math.min(...values.map(x=>x%10));
    const tails=values.filter(x=>x%10===extremum);if(tails.length!==1||[target,opposite].includes(tails[0]))return null;
    return { values, big, asked:big?'큰':'작은', list:values.join(' · '),options:values,
      ...errors(wrong(tails[0],'일의 자리만 비교하기',`일의 자리만 보고 ${tails[0]}을 골랐습니다. 가장 높은 자리부터 비교하면 가장 ${big?'큰':'작은'} 수는 ${target}입니다.`),
      wrong(opposite,'큰 수와 작은 수 반대로 고르기',`가장 ${big?'작은':'큰'} 수 ${opposite}을 골랐습니다. 작은 수부터 ${[...values].sort((a,b)=>a-b).join(', ')} 순서로 놓으면 ${big?'맨 뒤':'맨 앞'}의 수는 ${target}입니다.`)) };
  }, v => comparePlaces(v.values,v.big,4)),
  answer: ({values,big}) => big?Math.max(...values):Math.min(...values),
  check: ({values,big}) => [...values].sort((a,b)=>big?b-a:a-b)[0],
  isCorrect: ({values,big},c) => values.includes(c)&&values.every(x=>big?c>=x:c<=x),
  solution: "{process}\n따라서 가장 {asked} 수는 {answer}입니다.",
});
