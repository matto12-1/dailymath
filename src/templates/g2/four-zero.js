import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.four.zero","unit":"g2s2-numbers-four-digits","strand":"calc","level":2,"label":"빈 자리의 0","std":["[2수01-02]"]}, {

  range: { min: 0, max: 9999 }, operandRange: { min: 0, max: 9999 }, differentDigits: true,errorCount:3,
  answerSpan: seq(1,9).flatMap((h) => seq(1,9).map((o) => h*1000+o*10)),
  texts: ['1000이 {h}개, 10이 {o}개인 수는 얼마일까요?'],
  edgeWeight:[2,1],
  draw(rng) { const h=rng.int(1,9),o=rng.int(1,9), direction=rng.pick([-1,1]);return { h,o,...errors(
    wrong(h*1000+o*100,'빈 자리 잘못 채우기',`10이 ${o}개인 것을 백의 자리에 써서 ${h*1000+o*100}이 되었습니다. 백의 자리를 0으로 쓰고 십의 자리에 ${o}를 넣으면 ${h*1000+o*10}입니다.`),
    wrong(h*100+o*10,'숫자 이어 붙이기',`빈 자리를 나타내는 0을 빼고 숫자를 이어 붙였습니다. 백의 자리와 일의 자리에 0을 넣으면 ${h*1000+o*10}입니다.`),wrong(h*1000+(o+direction)*10,direction>0?'10 하나 더 세기':'10 하나 빠뜨리기',`10을 1개 ${direction>0?'더 세었습니다':'빠뜨렸습니다'}. 10이 ${o}개인 것을 정확히 세면 ${h*1000+o*10}입니다.`)) }; },
  candidates: v => [...[v.e1.value,v.e2.value,v.e3.value], ...seq(-3,3).map(d => v.h*1000+v.o*10+d*10)],
  answer: ({h,o}) => h*1000+o*10,
  check: ({h,o}) => Number(`${h}0${o}0`),

  solution: "1000이 {h}개이므로 천의 자리에 {h:을/를}, 10이 {o}개이므로 십의 자리에 {o:을/를} 씁니다.\n100과 1은 없으므로 백의 자리와 일의 자리에는 0을 씁니다.\n따라서 답은 {answer}입니다.",
  guessHints:[],
});
