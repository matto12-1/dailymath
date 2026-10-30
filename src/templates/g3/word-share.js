import { NAMES, THINGS } from '../../engine/names.js?v=9a67f36b25';

// 3학년 1학기 나눗셈: 똑같이 나누기 문장제 (곱셈구구 안의 수)
export default {
  id: 'g3.div.share', grade: 3, unit: 'g3s1-div', strand: 'word', level: 1,
  std: ['[4수01-06]'],
  label: '똑같이 나누기 문장제', input: 'number',
  range: { min: 2, max: 81 },
  texts: [
    '{name:(이)는} {thing} {totalUnit:을/를} 친구 {people}명에게 똑같이 나누어 주려고 해요. 한 명에게 몇 {unit}씩 줄 수 있을까요?',
    '{thing} {totalUnit:이/가} 있어요. {people}명이 똑같이 나누어 가지면 한 명이 몇 {unit}씩 가지게 될까요?',
  ],
  make(rng) {
    const thing = rng.pick(THINGS);
    const people = rng.int(2, 9);
    const each = rng.int(2, 9);
    const total = people * each;
    return { name: rng.pick(NAMES), thing: thing.word, unit: thing.unit, people, each, total, totalUnit: `${total}${thing.unit}` };
  },
  answer: ({ each }) => each,
  check: ({ total, people }) => { let n = 0; for (let left = total; left >= people; left -= people) n++; return n; },
  mistakes: [
    { id: 'multiplied', label: '나누지 않고 곱하기', say: '똑같이 나누어 가지는 건 나눗셈이에요. 곱하면 수가 오히려 커져요. {total} ÷ {people:을/를} 계산해 보세요.', value: ({ total, people }) => total * people },
    { id: 'subtracted', label: '나누지 않고 빼기', say: '사람 수만큼 빼는 게 아니라 똑같이 나누어야 해요. {total} ÷ {people:을/를} 계산해 보세요.', value: ({ total, people }) => total - people },
  ],
  art: () => ({ scene: 'share' }),
  solution: '{total} ÷ {people} = {answer}. 한 명에게 {answer}{unit}씩이에요.',
};
