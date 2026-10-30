import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { numberVars, options, NAMES, SOLID, FLAT, NAME_ERRORS, nameVars, nameMistakes } from './helpers.js?v=9a67f36b25';

export default {
  id: 'g1.nine.larger', grade: 1, unit: 'g1s1-numbers-nine', strand: 'calc', level: 3,
  label: '수의 크기 비교', std: ["[2수01-03]"],
  input: 'choice', answerKind: 'int', maxDigits: 2,

  range: { min: 0, max: 9 }, orderAsked: true,
  answerSpan: [0,1,2,3,4,5,6,7,8,9],
  choiceBox:true, texts: ['가장 {asked} 수는 어느 것일까요?'],
  make: explain(function(rng) {
    return until(() => {
      const values = Array.from({ length: 4 }, () => rng.int(0, 9));
      if (new Set(values).size !== 4) return null;
      const largest = rng.pick([true, false]), sorted = values.slice().sort((a, b) => a - b);
      const correct = largest ? sorted[3] : sorted[0], opposite = largest ? sorted[0] : sorted[3];
      const wrong2 = largest ? sorted[2] : sorted[1];
      const wrong3 = values.find((n) => ![correct, opposite, wrong2].includes(n));
      // 한 번 섞은 차례 하나를 보기 칸·단추·풀이가 같이 쓴다(검수 뿌리 2).
      const shown = rng.shuffle(values);
      return { values: shown, largest, asked: largest ? '큰' : '작은', oppositeAsked: largest ? '작은' : '큰', end: largest ? '맨 뒤' : '맨 앞', numbers: shown.join(', '), wrong1: opposite, wrong2, wrong3 };
    });
  }, v => ['보기의 수는 ' + j(v.numbers, '입니다') + '.', '작은 수부터 차례로 놓으면 ' + j([...v.values].sort((a,b)=>a-b).join(', '), '입니다') + '. ' + (v.largest ? '맨 뒤' : '맨 앞') + '에 오는 수가 가장 ' + v.asked + ' 수입니다.']),
  answer: ({ values, largest }) => largest ? Math.max(...values) : Math.min(...values),
  check: ({ values, largest }) => values.reduce((best, n) => (largest ? n > best : n < best) ? n : best),
  choices: ({ values }) => values,
  isCorrect: ({ values, largest }, choice) => values.includes(choice) && values.every((n) => largest ? choice >= n : choice <= n),
  mistakes: [
    { id: 'opposite', label: '큰 수와 작은 수 반대로 고르기', value: ({ wrong1 }) => wrong1, say: '가장 {oppositeAsked} 수 {value:을/를} 골랐습니다. 작은 수부터 차례로 놓았을 때 {end}에 오는 수는 {answer}이므로 가장 {asked} 수는 {answer}입니다.' },
    { id: 'next-rank', label: '다음 순위 수 고르기', value: ({ wrong2 }) => wrong2, say: '둘째로 {asked} 수 {value:을/를} 골랐습니다. 보기에 {value}보다 더 {asked} {answer:이/가} 있으므로 가장 {asked} 수는 {answer}입니다.' },
  ],
  solution: "{process}\n따라서 가장 {asked} 수는 {answer}입니다.",

};
