// 곱셈구구 안에서 나눗셈 몫을 구하는 훈련.
import { define, seq, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define({ id: 'g3.div1.drill', unit: 'g3s1-div', strand: 'calc', level: 3, label: '나눗셈 몫', std: ['[4수01-06]'] }, {
  input: 'number', speedBonus: true, maxDigits: 1, errorCount: 2, back: 'g2s2-times',
  texts: ['〔{a} ÷ {b} = ?〕계산하면 얼마일까요?'],
  draw(rng) {
    const b = rng.int(2, 9), q = rng.int(2, 9), a = b * q;
    return { a, b, q, ...errors(
      wrong(q - 1, '앞 곱셈구구의 몫 쓰기', `몫을 ${q-1}로 썼지만 ${b} × ${q-1} = ${b*(q-1)}이므로 ${a}이 되지 않습니다. ${b} × ${q} = ${a}이므로 ${a} ÷ ${b} = ${q}입니다.`),
      wrong(b, '나누는 수를 답하기', '몫 대신 나누는 수 {b:을/를} 썼습니다. {b} × {q} = {a}이므로 {a} ÷ {b}의 몫은 {q}입니다.')) };
  },
  answer: ({ a, b }) => a / b, check: ({ a, b }) => seq(2, 9).find((q) => b * q === a),
  solution:"{b} × {q} = {a}입니다.\n따라서 {a} ÷ {b} = {answer:입니다}.",
});
