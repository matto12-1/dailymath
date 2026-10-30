import { explain, j, say, flatNames, ordinal } from '../solution-process.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { FLAT, panelNumbers } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.patterns.own', grade: 1, unit: 'g1s2-patterns', strand: 'shape', level: 2,
  std: ['[2수02-01]'], label: '규칙의 빈칸 채우기',
  input: 'choice', answerKind: 'text', maxDigits: 1,
  texts: ['빈칸 두 곳에 차례로 들어갈 모양은 어느 것일까요?'],
  make: explain(function(rng) {
    return until(() => {
      const [a, b, c] = rng.shuffle(FLAT);
      const cycle = rng.pick([[a, b], [a, a, b], [a, b, b]]);
      const position = rng.int(1, 7);
      const expected = [cycle[position % cycle.length], cycle[(position + 1) % cycle.length]];
      if (expected[0] === expected[1]) return null;
      const previous = cycle[(position - 1) % cycle.length];
      const candidates = [
        { tag: 'correct', xs: expected },
        { tag: 'copy', xs: [previous, previous] },
        { tag: 'reverse', xs: expected.slice().reverse() },
        { tag: 'repeat-next', xs: Array(2).fill(expected.find((s) => s !== previous)) },
      ];
      if (new Set(candidates.map((p) => p.xs.join(','))).size !== 4) return null;
      const panels = panelNumbers(rng, candidates.map((p) => ({ tag: p.tag, items: p.xs.map((shape) => ({ shape, n: 1 })) })), (p) => p.tag === 'correct');
      const length = 10;
      const items = Array.from({ length }, (_, i) => ({ shape: [position, position + 1].includes(i) ? 'blank' : cycle[i % cycle.length], n: 1 }));
      return { cycle, position, panels, items, leftName:flatNames[expected[0]], rightName:flatNames[expected[1]], wrong1: panels.find((p) => p.tag === 'copy').number + '번', wrong2: panels.find((p) => p.tag === 'reverse').number + '번' };
    });
  }, v => [j(v.cycle.map(s=>flatNames[s]).join(', '), '이/가') + ' 되풀이됩니다.', '왼쪽 빈칸에는 ' + flatNames[v.cycle[v.position%v.cycle.length]] + ', 오른쪽 빈칸에는 ' + j(flatNames[v.cycle[(v.position+1)%v.cycle.length]],'이/가') + ' 들어갑니다.']),
  answer: ({ panels }) => panels.find((p) => p.tag === 'correct').number + '번',
  check: ({ cycle, position, panels }) => panels.find((p) => p.items.every((s, i) => s.shape === cycle[(position + i) % cycle.length])).number + '번',
  choices: () => ['1번', '2번', '3번', '4번'],
  isCorrect: ({ cycle, position, panels }, choice) => panels.some((p) => p.number + '번' === choice && p.items.every((s, i) => s.shape === cycle[(position + i) % cycle.length])),
  mistakes: [
    { id: 'copy-previous', label: '앞 모양 두 번 복사하기', value: ({ wrong1 }) => wrong1, say: '{value} 그림은 빈칸 바로 앞의 모양을 두 번 넣은 것입니다. 왼쪽 빈칸에는 {leftName}, 오른쪽 빈칸에는 {rightName:이/가} 들어가므로 {answer}입니다.' },
    { id: 'reverse-pair', label: '두 모양 순서 바꾸기', value: ({ wrong2 }) => wrong2, say: '{value} 그림은 들어갈 두 모양의 순서가 바뀌었습니다. 규칙에 맞게 {leftName}, {rightName} 차례로 놓은 것은 {answer}입니다.' },
  ],
  art: ({ items, panels }) => ({ kind: 'objects',expand:true, items, columns: 10, panels }),
  solution: "{process}\n따라서 답은 {answer}입니다.",
};
