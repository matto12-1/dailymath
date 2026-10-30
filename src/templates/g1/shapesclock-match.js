import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, panelNumbers, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.shapesclock.match', grade: 1, unit: 'g1s2-shapes-clock', strand: 'life', level: 3,
  label: '같은 시각의 시계 찾기', std: ["[2수03-07]"],
  answerUnit: '번', input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 1, max: 4 }, operandRange: { min: 0, max: 30 },
  texts: ['{time:을/를} 나타내는 시계는 어느 것일까요?'],
  make: explain(function(rng) {
    const h = rng.int(1, 12), m = rng.pick([0, 30]), next = h % 12 + 1;
    const panels = panelNumbers(rng, [{ h, m }, { h, m: 30 - m }, { h: next, m }, { h: next, m: 30 - m }], (p) => p.h === h && p.m === m);
    return { h, m, panels, next, otherTime: h+'시'+(m?'':' 30분'), nextTime: next+'시'+(m?' 30분':''), minuteHand:m?6:12, hourFact:m?'짧은바늘이 '+j(h,'과/와')+' '+next+' 사이에 있습니다':'짧은바늘이 '+j(h,'을/를')+' 가리킵니다', time: h + '시' + (m ? ' 30분' : ''),
      wrong1: panels.find((p) => p.h === h && p.m !== m).number,
      wrong2: panels.find((p) => p.h === next && p.m === m).number };
  }, v => [v.m ? '짧은바늘이 ' + j(v.h,'과/와') + ' ' + (v.h%12+1) + ' 사이에 있는 시계를 찾습니다.' : '짧은바늘이 ' + j(v.h,'을/를') + ' 가리키는 시계를 찾습니다.', '그중 긴바늘이 ' + j(v.m?6:12,'을/를') + ' 가리키면 ' + j(v.time,'입니다') + '.']),
  answer: ({ h, m, panels }) => panels.find((p) => p.h === h && p.m === m).number,
  check: ({ h, m, panels }) => panels.find((p) => p.h * 60 + p.m === h * 60 + m).number,
  choices: () => [1, 2, 3, 4],
  isCorrect: ({ h, m, panels }, choice) => panels.some((p) => p.number === choice && p.h === h && p.m === m),
  mistakes: [
    { id: 'minutes', label: '정각과 30분 바꾸기', say: '{otherTime:을/를} 나타내는 시계를 골랐습니다. 긴바늘이 {minuteHand:을/를} 가리키는 {time}의 시계는 {answer}번입니다.', value: ({ wrong1 }) => wrong1 },
    { id: 'next-hour', label: '다음 시로 읽기', say: '{nextTime:을/를} 나타내는 시계를 골랐습니다. {hourFact}인 시계를 찾으면 {answer}번입니다.', value: ({ wrong2 }) => wrong2 },
  ],
  art: ({ panels }) => ({ kind: 'clock', panels }),
  solution: "{process}\n따라서 {time:을/를} 나타내는 시계는 {answer}번입니다.",

};
