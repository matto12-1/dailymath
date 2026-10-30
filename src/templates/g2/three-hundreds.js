import { explain, j, count } from '../solution-process.js?v=9a67f36b25';
import { define, seq, sum, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.three.hundreds","unit":"g2s1-numbers-three-digits","strand":"calc","level":1,"label":"몇백","std":["[2수01-02]"]}, {

  range: { min: 0, max: 999 }, operandRange: { min: 0, max: 999 },
  errorCount:3,answerSpan: seq(1, 9).map((n) => n * 100),
  texts: ['100개씩 묶음이 {h}개 있습니다. 모두 몇 개일까요?', '100이 {h}개이면 얼마일까요?', '100을 {h}개 모았습니다. 모두 몇 개일까요?', '100씩 {h}번 뛰어 세면 얼마일까요?'],
  draw: explain(function(rng) { const h = rng.int(1, 9), direction = rng.pick([-1, 1]); return { h, ...errors(
    wrong(100 * (h - 1), '묶음 하나 덜 세기', `100을 ${h - 1}번만 세었습니다. 빠뜨린 100 묶음 하나까지 세면 ${h*100}입니다.`),
    wrong(100 * (h + 1), '묶음 하나 더 세기', `100을 ${h + 1}번 세었습니다. 두 번 센 100 묶음 하나를 빼고 세면 ${h*100}입니다.`),
    wrong(100 * (h + direction * 2), direction > 0 ? '묶음 두 개 더 세기' : '묶음 두 개 덜 세기', `100을 ${h + direction * 2}번 세었습니다. 100 묶음 두 개를 잘못 센 것을 바로잡으면 ${h*100}입니다.`)) }; }, v => ['100을 '+v.h+'번 모은 수입니다.', '백의 자리에 ' + j(v.h,'을/를') + (' 쓰고, 십의 자리와 일의 자리에는 ' + j("0", "을/를") + ' 씁니다.')]),
  answer: ({ h }) => h * 100, check: ({ h }) => sum(...Array(h).fill(100)),
  candidates: seq(1, 9).map((n) => n * 100),
  art: ({ h }) => ({ kind: 'blocks', hundreds: h }),
  solution: "{process}\n따라서 모두 {answer}개입니다.",
});
