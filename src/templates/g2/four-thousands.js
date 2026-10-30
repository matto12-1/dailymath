import { explain, j, count } from '../solution-process.js?v=9a67f36b25';
import { define, seq, sum, wrong, errors,fill } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.four.thousands","unit":"g2s2-numbers-four-digits","strand":"calc","level":1,"label":"몇천","std":["[2수01-02]"]}, {

  range: { min: 0, max: 9999 }, operandRange: { min: 0, max: 9999 },
  errorCount:3,differentDigits:true,answerSpan: seq(2, 9).map((n) => n * 1000),
  edgeWeight:[3,4],
  texts: ['{question}'],
  draw: explain(function(rng) { const h = rng.int(2, 9), direction = rng.pick([-1, 1]),split=h>1&&rng.next()<.85,left=split?rng.int(1,h-1):h,right=h-left;
    return { h,left,right,split,question:fill(split?'1000개씩 묶음 {left}개와 1000개씩 묶음 {right}개를 모았습니다. 모두 몇 개일까요?':'1000개씩 묶음이 {h}개 있습니다. 모두 몇 개일까요?',{h,left,right}),...errors(
    wrong(1000*(h-direction),direction>0?'묶음 하나 빠뜨리기':'묶음 하나 두 번 세기',`1000개씩 묶음을 ${h-direction}개로 세었습니다. 묶음을 ${direction>0?'하나 더 넣어':'중복 없이'} ${h}개로 세면 ${h*1000}개입니다.`),
    wrong(1000*(h+direction),direction>0?'묶음 하나 더 세기':'묶음 하나 덜 세기',`1000개짜리 묶음을 하나 ${direction>0?'더':'덜'} 세었습니다. 1000개씩 묶음 하나를 잘못 센 것을 바로잡으면 ${h*1000}개입니다.`),
    wrong(1000 * (h + direction * 2), direction > 0 ? '묶음 두 개 더 세기' : '묶음 두 개 덜 세기', `${h+direction*2===0?'묶음을 모두 빠뜨렸습니다.':'1000개씩 묶음을 '+(h+direction*2)+'개 세었습니다.'} 두 묶음을 ${direction>0?'더':'덜'} 센 것을 바로잡아 ${h}개로 세면 ${h*1000}개입니다.`)) }; }, v => [v.split?'1000개씩 묶음 '+v.left+'개와 '+v.right+'개를 모으면 묶음은 '+v.h+'개입니다.':null,'천의 자리에 ' + j(v.h,'을/를') + (' 쓰고, 백의 자리와 십의 자리와 일의 자리에는 ' + j("0", "을/를") + ' 씁니다.')]),
  answer: ({ h }) => h * 1000, check: ({ h }) => sum(...Array(h).fill(1000)),
  candidates: seq(1, 9).map((n) => n * 1000),

  solution: "{process}\n따라서 모두 {answer}개입니다.",
});
