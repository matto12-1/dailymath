import { explain } from '../solution-process.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';
import { flatFeature } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.shapesclock.flat', grade: 1, unit: 'g1s2-shapes-clock', strand: 'shape', level: 1,
  label: '평면 모양 이름', std: ["[2수03-03]","[2수03-04]"],
  input: 'choice', answerKind: 'text', maxDigits: 2,

  texts: ['그림에 가장 알맞은 이름은 무엇일까요?'],
  make: explain(function(rng) { const v={ ...nameVars(rng, FLAT), rotation: rng.pick([0, 30, 45, 90]) };return v; }, v => [flatFeature[v.type].replace(/^.*?는 /,'')]),
  answer: ({ type }) => NAMES[type],
  check: ({ type }) => ({ triangle: '세모', square: '네모', circle: '동그라미' })[type],
  choices: () => FLAT.map((s) => NAMES[s]),
  isCorrect: ({ type }, choice) => FLAT.some((s) => s === type && NAMES[s] === choice),
  mistakes: nameMistakes,
  art: ({ type, rotation }) => ({ kind: 'objects', items: [{ shape: type, rotation, n: 1 }] }),
  solution: "{process}\n따라서 {answer:입니다}.",

};
