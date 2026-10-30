// 소수나 분수로 나타낸 비율을 백분율로 바꾸는 훈련.
import { define, meta, dec, frac, gcd, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define(meta('ratio', 'drill', 3, 'calc', ['02-03'], '백분율'), {
  input: 'number', answerKind: 'int', speedBonus: true, maxDigits: 3, answerUnit: '%', minMistakes: 2, errorCount: 3,
  texts: ['〔비율 {rate}〕백분율로 나타내면 몇 %일까요?'],
  draw(rng) {
    const form = rng.pick(['decimal', 'fraction']), b = form === 'decimal' ? 100 : rng.pick([2, 4, 5, 10, 20, 25, 50]), a = rng.int(1, b - 1);
    if (form === 'fraction' && gcd(a, b) !== 1) return null;
    const p = 100 * a / b;
    return { form, a, b, rate: form === 'decimal' ? dec(a, 2) : frac(0, a, b), ...errors(
      wrong(p * 10, '소수점을 한 자리 더 옮기기', '비율 {rate}에 100 대신 1000을 곱하여 {value:을/를} 썼습니다. 비율 {rate}에 100을 곱하면 {answer}%입니다.'),
      wrong(100 - p, '남은 비율 구하기', '비율을 백분율로 바꾼 뒤 100%에서 빼고 {value:을/를} 썼습니다. 전체에서 빼기 전의 {rate} × 100이 주어진 비율의 백분율이므로 {answer}%입니다.'),wrong(100, '전체의 백분율 답하기', '부분 대신 전체를 나타내는 100%를 썼습니다. 주어진 비율 {rate}만 백분율로 바꾸면 {answer}%입니다.')) };
  },
  answer: ({ a, b }) => 100 * a / b, check: ({ a, b }) => a * (100 / b),
  solution: '비율에 100을 곱하면 {rate} × 100 = {answer:입니다}.\n따라서 백분율은 {answer}%입니다.',
});
