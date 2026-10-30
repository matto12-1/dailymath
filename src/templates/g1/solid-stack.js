import { explain, say, solidNames, ordinal } from '../solution-process.js?v=9a67f36b25';
import {numberedPanels as panelNumbers} from '../g4/geometry.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.solid.stack', grade: 1, unit: 'g1s1-solid-shapes', strand: 'shape', level: 2,
  label: '차례대로 쌓은 모양 찾기', std: ["[2수03-01]"],
  answerUnit: '번', input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 1, max: 4 },
  // 위 그림은 놓을 차례(첫째·둘째…)대로 늘어놓은 모양이고, 보기는 쌓은 모양이다. 먼저 놓은 것이 맨 아래에 온다는 것을 알아야 고른다.
  // 전엔 위 그림도 쌓은 모양이라 똑같은 것을 고르기만 했다(10-21 Matto 「그냥 똑같은거 고르기아님?」).
  texts: ['그림의 물건을 첫째부터 차례로 쌓으면 어느 모양이 될까요?'],
  make: explain(function(rng) {
    return until(() => {
      const target = Array.from({ length: rng.int(2, 4) }, () => rng.pick(['box', 'tube']));
      if (rng.pick([true, false])) target[target.length - 1] = 'ball';
      const base = target.at(-1) === 'ball' ? target.slice(0, -1) : target;
      const cap = target.at(-1) === 'ball' ? ['ball'] : [];
      const reversed = base.slice().reverse().concat(cap);
      const changed = target.slice(); changed[0] = rng.pick(['box', 'tube'].filter((s) => s !== target[0]));
      const turned = base.slice(1).concat(base[0], ...cap);
      if (new Set([target, reversed, changed, turned].map((xs) => xs.join(','))).size !== 4) return null;
      const candidates = rng.shuffle([{ tag: 'correct', xs: target }, { tag: 'reverse', xs: reversed }, { tag: 'replace', xs: changed }, { tag: 'shift', xs: turned }]);
      const panels = panelNumbers(rng, candidates.map((p) => ({ tag: p.tag, items: p.xs.map((shape, position) => ({ shape, position })) })), (p) => p.tag === 'correct');
      return { target, panels, wrong1: panels.find((p) => p.tag === 'reverse').number, wrong2: panels.find((p) => p.tag === 'replace').number };
    });
  }, v => ['첫째인 ' + solidNames[v.target[0]] + '을 맨 아래에 놓고, 그 위에 ' + (v.target.length === 2 ? '둘째를 올립니다.' : v.target.slice(1).map((s, i) => ordinal(i + 2)).join(', ') + '를 차례로 올립니다.'),
    '아래부터 ' + v.target.map((s) => solidNames[s]).join(', ') + ' 순서로 쌓인 것을 찾습니다.']),
  answer: ({ target, panels }) => panels.find((p) => p.items.map((s) => s.shape).join(',') === target.join(',')).number,
  check: ({ target, panels }) => panels.find((p) => p.items.every((s, i) => s.shape === target[i])).number,
  choices: () => [1, 2, 3, 4],
  isCorrect: ({ target, panels }, choice) => panels.some((p) => p.number === choice && p.items.length === target.length && p.items.every((s, i) => s.shape === target[i])),
  mistakes: [
    { id: 'reverse', label: '쌓는 차례 거꾸로 보기', value: ({ wrong1 }) => wrong1, say: '{value}번 그림은 쌓는 차례가 거꾸로입니다. 첫째를 맨 아래에 놓고 차례로 쌓은 것은 {answer}번입니다.' },
    { id: 'replace', label: '물건 하나 바꾸기', value: ({ wrong2 }) => wrong2, say: '고른 {value}번 그림에는 다른 모양의 물건이 하나 섞여 있습니다. 놓을 차례와 각 물건의 모양이 모두 같은 것은 {answer}번입니다.' },
  ],
  art: ({ target, panels }) => ({ kind: 'solid',expand:true, order: target, panels, oneRow: true }),
  solution: "{process}\n따라서 답은 {answer}번입니다.",

};
