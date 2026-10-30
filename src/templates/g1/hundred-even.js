import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.hundred.even', grade: 1, unit: 'g1s2-numbers-hundred', strand: 'calc', level: 3,
  label: '짝수와 홀수 찾기', std: ["[2수01-01]"],
  input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 51, max: 99 }, operandRange: { min: 0, max: 99 },
  answerSpan: [51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99],
  choiceBox: true, texts: ['{asked:을/를} 고르시오.'],
  make(rng) {
    const parity = rng.pick([0, 1]);
    const candidates = Array.from({ length: 49 }, (_, i) => i + 51);
    const correct = rng.pick(candidates.filter((n) => n % 2 === parity));
    const wrong = rng.shuffle(candidates.filter((n) => n % 2 !== parity && Math.floor(n / 10) % 2 === parity)).slice(0, 3);
    return {parity,condition:parity===0?'남는 것이 없는':'하나가 남는',oppositeAsked:parity===0?'홀수':'짝수',asked: parity === 0 ? '짝수' : '홀수', values: rng.shuffle([correct, ...wrong]), wrong1: wrong[0], wrong2: wrong[1], ones: correct%10, pairing: parity===0?'남는 것이 없습니다':'하나가 남습니다', onesExplanation:correct%10===0?'낱개가 없으므로 둘씩 짝지어도 남는 것이 없습니다.':`${correct}의 낱개 ${correct%10}개는 둘씩 짝지으면 ${parity===0?'남는 것이 없습니다':'하나가 남습니다'}.` };
  },
  answer: ({ values, parity }) => values.find((n) => n % 2 === parity),
  check: ({ values, parity }) => values.find((n) => (Math.floor(n / 2) * 2 === n) === (parity === 0)),
  choices: ({ values }) => values,
  isCorrect: ({ values, parity }, choice) => values.includes(choice) && choice % 2 === parity,
  mistakes: [
    { id: 'tens-only', label: '묶음의 수로 짝홀 판단하기', value: ({ wrong1 }) => wrong1, say: '10개씩 묶음의 수만 보고 {value:을/를} 골랐습니다. 묶음은 모두 짝이 되고 낱개까지 짝지어 {condition} 수가 {answer}이므로 {asked}는 {answer}입니다.' },
    { id: 'opposite-parity', label: '짝수와 홀수 반대로 고르기', value: ({ wrong2 }) => wrong2, say: '{oppositeAsked} {value:을/를} 골랐습니다. 둘씩 짝지었을 때 {condition} 수를 찾으면 {answer}입니다.' },
  ],
  solution: "10개씩 묶음은 둘씩 짝지으면 남는 것이 없습니다.\n{onesExplanation}\n따라서 {asked}는 {answer}입니다.",

};
