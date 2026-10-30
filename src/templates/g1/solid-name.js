import { explain } from '../solution-process.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';
import { solidFeature } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.solid.name', grade: 1, unit: 'g1s1-solid-shapes', strand: 'shape', level: 1,
  label: '입체 모양 이름', std: ["[2수03-01]"],
  input: 'choice', answerKind: 'text', maxDigits: 2,

  texts: ['그림에 가장 알맞은 이름은 무엇일까요?'],
  make: explain((rng) => {const v=nameVars(rng,SOLID);return {...v,orientation:rng.pick([0,90]),stretch:rng.pick(v.type==='ball'?[[1,1],[.85,.85],[.7,.7]]:[[1,1],[1,.7],[.7,1]])};}, v => [solidFeature[v.type].replace(/^.*? 모양은 /,'')]),
  answer: ({ type }) => NAMES[type],
  check: ({ type }) => ({ box: '상자 모양', tube: '둥근기둥 모양', ball: '공 모양' })[type],
  choices: () => SOLID.map((s) => NAMES[s]),
  isCorrect: ({ type }, choice) => SOLID.some((s) => s === type && NAMES[s] === choice),
  mistakes: nameMistakes,
  art: ({ type,orientation,stretch }) => ({ kind: 'solid', type,orientation,stretch }),
  solution: "{process}\n따라서 {answer:입니다}.",

};
