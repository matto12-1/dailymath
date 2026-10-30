// 소수 한 자리와 자연수를 곱하는 훈련.
import { define, meta, dec, repeated, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define(meta('decimalmul', 'drill', 3, 'calc', ['01-13'], '소수 × 자연수'), {
  input: 'number', answerKind: 'decimal', speedBonus: true,
  texts: ['〔{left} × {b} = ?〕계산하면 얼마일까요?'],
  draw(rng) {
    const a = rng.int(2, 99), b = rng.int(2, 9), product = a * b;
    if (a % 10 === 0 || product % 10 === 0) return null;
    return { a, b, product, left: dec(a, 1), ...errors(
      wrong(dec(product, 0), '소수점 빠뜨리기', '소수점을 생각하지 않고 {a} × {b}의 값만 썼습니다. {left:이/가} 소수 한 자리이므로 자연수 곱 {product}에 소수 한 자리를 표시하면 {answer:입니다}.'),
      wrong(dec(product, 2), '곱의 소수점을 한 자리 잘못 찍기', '곱의 소수점을 한 자리 더 왼쪽에 찍었습니다. 소수점을 한 자리 오른쪽으로 옮겨 {left} × {b:을/를} 나타내면 {answer:입니다}.')) };
  },
  answer: ({ a, b }) => dec(a * b, 1), check: ({ a, b }) => dec(repeated(a, b), 1),
  solution: '{a} × {b} = {product:입니다}.\n{left:이/가} 소수 한 자리 수이므로 곱도 소수 한 자리 수입니다.\n따라서 답은 {answer:입니다}.',
});
