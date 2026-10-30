// 소수를 자연수로 나누어 소수 한 자리 몫을 구하는 훈련.
import { define, meta, dec, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define(meta('decimaldiv1', 'drill', 3, 'calc', ['01-15'], '소수 ÷ 자연수'), {
  input: 'number', answerKind: 'decimal', speedBonus: true, back: 'g5s2-decimal-multiply',
  texts: ['〔{left} ÷ {b} = ?〕계산하면 얼마일까요?'],
  draw(rng) {
    const q = rng.int(2, 99), b = rng.int(2, 9), a = q * b;
    if (q % 10 === 0) return null;
    return { a, b, q, left: dec(a, 1), ...errors(
      wrong(dec(q, 0), '소수점 빠뜨리기', '{left} ÷ {b} 대신 {a} ÷ {b}의 몫 {q:을/를} 그대로 썼습니다. {left:은/는} {a}의 1/10배이므로 {q}의 1/10배인 {answer:입니다}.'),
      wrong(dec(a * b, 1), '나누기 대신 곱하기', '{left} ÷ {b} 대신 {left} × {b:을/를} 계산하여 {value:을/를} 썼습니다. {left:을/를} {b}등분하여 한 부분의 크기를 구하면 {answer:입니다}.')) };
  },
  answer: ({ a, b }) => dec(a / b, 1), check: ({ a, b }) => dec(a * 10 / b, 2),
  solution: '{left:은/는} {a}의 1/10배이므로 {left} ÷ {b}의 몫은 {a} ÷ {b} = {q}의 1/10배입니다. {left} ÷ {b} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
