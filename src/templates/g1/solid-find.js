import { explain, say } from '../solution-process.js?v=9a67f36b25';
import {numberedPanels as panelNumbers} from '../g4/geometry.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';
import { solidFeature } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.solid.find', grade: 1, unit: 'g1s1-solid-shapes', strand: 'shape', level: 2,
  label: '눕히거나 길쭉한 모양 찾기', std: ["[2수03-01]"],
  answerUnit: '번', input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 1, max: 4 }, operandRange: { min: 0, max: 4 },
  texts: ['{targetName:은/는} 어느 것일까요?'],
  make: explain(function(rng) {
    const target = rng.pick(SOLID), others = SOLID.filter((s) => s !== target);
    const types = rng.shuffle([target, ...others, rng.pick(others)]);
    const panels = panelNumbers(rng, types.map((type) => ({ type, orientation: rng.pick([0, 90]), stretch: type === 'ball' ? [1, 1] : rng.pick([[1, 0.7], [0.7, 1]]) })), (p) => p.type === target);
    const wrong = panels.filter((p) => p.type !== target);
    const vars = { target, targetName: NAMES[target], panels };
    wrong.forEach((p, i) => { vars['wrong' + (i + 1)] = p.number; const [label, say] = NAME_ERRORS[target + ':' + p.type]; vars['label' + (i + 1)] = label; vars['say' + (i + 1)] = p.number+'번 '+NAMES[p.type]+'을 골랐습니다. '+p.number+'번과 달리 '+NAME_ERRORS[target+':'+p.type][1].split('. ')[1].replace(/입니다\.$/,'인 '+panels.find(p=>p.type===target).number+'번입니다.'); });
    return vars;
  }, v => [solidFeature[v.target]]),
  answer: ({ panels, target }) => panels.find((p) => p.type === target).number,
  check: ({ panels, target }) => panels.reduce((n, p) => n + (p.type === target ? p.number : 0), 0),
  choices: () => [1, 2, 3, 4],
  isCorrect: ({ panels, target }, choice) => panels.some((p) => p.number === choice && p.type === target),
  mistakes: [1, 2, 3].map((i) => ({ id: 'shape-confusion-' + i, label: '{label' + i + '}', say: '{say' + i + '}', value: (v) => v['wrong' + i] })),
  art: ({ panels }) => ({ kind: 'solid', panels }),
  solution: "{process}\n따라서 {targetName:은/는} {answer}번입니다.",

};
