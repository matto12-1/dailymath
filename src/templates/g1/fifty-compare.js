import { explain, say, comparePlaces } from '../solution-process.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';
import { compareNumbers } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.fifty.compare', grade: 1, unit: 'g1s1-numbers-fifty', strand: 'calc', level: 3,
  label: '수의 크기 비교', std: ["[2수01-03]"],
  input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 10, max: 50 }, orderAsked: true,
  answerSpan: [11,50],
  choiceBox:true, texts: ['가장 {asked} 수는 어느 것일까요?'],
  make: explain(function(rng) {
    return until(() => {
      const values = Array.from({ length: 4 }, () => rng.int(10, 50));
      if (new Set(values).size !== 4) return null;
      const largest = rng.pick([true, false]), sorted = values.slice().sort((a, b) => a - b);
      const correct = largest ? sorted[3] : sorted[0], opposite = largest ? sorted[0] : sorted[3];
      const first=values.map(n=>String(n)[0]);if(first.filter(d=>d===String(correct)[0]).length===1&&new Set(first).size<4)return null;
      const ones = values.map((n) => n % 10);
      const edge = largest ? Math.max(...ones) : Math.min(...ones);
      if (ones.filter((n) => n === edge).length !== 1) return null;
      const wrong2 = values.find((n) => n % 10 === edge);
      if (wrong2 === correct || wrong2 === opposite) return null;
      const wrong3 = values.find((n) => ![correct, opposite, wrong2].includes(n));
      // 한 번 섞은 차례 하나를 보기 칸·단추·풀이가 같이 쓴다(검수 뿌리 2).
      const shown = rng.shuffle(values);
      return { values: shown, largest, asked: largest ? '큰' : '작은', oppositeAsked: largest ? '작은' : '큰', end: largest ? '맨 뒤' : '맨 앞', numbers: shown.join(', '), wrong1: opposite, wrong2, wrong3 };
    });
  }, v => compareNumbers(v.values, v.largest)),
  answer: ({ values, largest }) => largest ? Math.max(...values) : Math.min(...values),
  check: ({ values, largest }) => values.reduce((best, n) => (largest ? n > best : n < best) ? n : best),
  choices: ({ values }) => values,
  isCorrect: ({ values, largest }, choice) => values.includes(choice) && values.every((n) => largest ? choice >= n : choice <= n),
  mistakes: [
    { id: 'opposite', label: '큰 수와 작은 수 반대로 고르기', value: ({ wrong1 }) => wrong1, say: '가장 {oppositeAsked} 수 {value:을/를} 골랐습니다. 작은 수부터 차례로 놓았을 때 {end}에 오는 수는 {answer}이므로 가장 {asked} 수는 {answer}입니다.' },
    { id: 'ones-only', label: '낱개로만 비교하기', value: ({ wrong2 }) => wrong2, say: '낱개의 수만 보고 {value:을/를} 골랐습니다. 10개씩 묶음의 수부터 비교하면 가장 {asked} 수는 {answer}입니다.' },
  ],
  solution: "{process}\n따라서 가장 {asked} 수는 {answer}입니다.",

};
