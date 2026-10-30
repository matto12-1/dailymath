import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.three.zero","unit":"g2s1-numbers-three-digits","strand":"calc","level":2,"label":"빈 자리의 0","std":["[2수01-02]"]}, {

  range: { min: 0, max: 999 }, operandRange: { min: 0, max: 999 }, differentDigits: true,errorCount:3,
  answerSpan: seq(1,9).flatMap((h) => seq(1,9).map((o) => h*100+o*1)),
  texts: ['100이 {h}개, 1이 {o}개인 수는 얼마일까요?'],
  draw(rng) { const h=rng.int(1,9),o=rng.int(1,9), direction=rng.pick([-1,1]);return { h,o,...errors(
    wrong(h*100+o*10,'빈 자리 잘못 채우기',`1이 ${o}개인 것을 십의 자리에 써서 ${h*100+o*10}이 되었습니다. 낱개를 일의 자리에 쓰고 십의 자리에 0을 넣으면 ${h*100+o}입니다.`),
    wrong(h*10+o*1,'숫자 이어 붙이기',`빈 자리를 나타내는 0을 빼고 숫자를 이어 붙였습니다. 이어 붙인 두 숫자 사이에 십의 자리의 0을 넣으면 ${h*100+o}입니다.`),wrong((h+direction)*100+o*1, direction>0?'100 묶음 하나 더 세기':'100 묶음 하나 덜 세기', `${h===1&&direction<0?'100을 세지 않았습니다.':'100 묶음을 하나 '+(direction>0?'더':'덜')+' 세었습니다.'} 100이 ${h}개이고 1이 ${o}개이므로 ${h*100+o}입니다.`)) }; },
  candidates: v => [...[v.e1.value,v.e2.value,v.e3.value], ...seq(-20,20).map(d => v.h*100+v.o+d)],
  answer: ({h,o}) => h*100+o*1,
  check: ({h,o}) => Number(`${h}0${o}`),
  art: ({h,o}) => ({kind:'blocks',hundreds:h,ones:o}),
  solution: "100이 {h}개이므로 백의 자리에 {h:을/를}, 1이 {o}개이므로 일의 자리에 {o:을/를} 씁니다.\n10이 없으므로 십의 자리에는 0을 씁니다.\n따라서 답은 {answer}입니다.",
});
