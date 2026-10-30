// 기약분수로 약분하는 훈련.
import { define, meta, frac, gcd, divisors, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define(meta('reduce', 'drill', 3, 'calc', ['01-06'], '약분'), {
  input: 'number', answerKind: 'fraction', mixedInput: true, exactForm: true, speedBonus: true, errorCount:3,
  texts: ['〔{left}〕기약분수로 나타내면 무엇일까요?'],
  draw(rng) {
    const q = rng.int(2, 9), p = rng.int(1, q - 1), k = rng.int(2, 6);
    if (gcd(p, q) !== 1) return null;
    const n = p * k, d = q * k, partial = divisors(k).find(x=>x>1&&x<k);
    return { n, d, p, q, k, partial, left: frac(0, n, d), ...errors(
      ...(partial?[wrong(frac(0,n/partial,d/partial),'공약수 하나로만 나누기','공약수 {partial:으로/로}만 나누었습니다. 분자와 분모에 공약수가 남아 있으므로 최대공약수 {k:으로/로} 끝까지 나누면 {answer:입니다}.')]:[]),
      wrong(frac(0, n, d), '약분을 끝내지 않기', '{left:을/를} 약분하지 않고 그대로 썼습니다. 분자와 분모를 최대공약수 {k:으로/로} 나누면 기약분수는 {answer:입니다}.'),
      wrong(frac(0, n, q), '분모만 나누기', '분모만 {k:으로/로} 나누었습니다. 분자도 {n} ÷ {k} = {p:으로/로} 바꾸면 {answer:입니다}.')) };
  },
  answer: ({ p, q }) => frac(0, p, q),
  check: ({ n, d }) => { const g = gcd(n, d); return frac(0, n / g, d / g); },
  solution: '분자 {n:과/와} 분모 {d:을/를} 최대공약수 {k:으로/로} 나눕니다. {n} ÷ {k} = {p}, {d} ÷ {k} = {q:입니다}.\n따라서 답은 {answer:입니다}.',
});
