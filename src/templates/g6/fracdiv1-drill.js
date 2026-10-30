// 진분수를 자연수로 나누는 훈련.
import { define, meta, f, gcd, fractionSteps, errors, wrong, fill } from './helpers.js?v=9a67f36b25';

export default define(meta('fracdiv1', 'drill', 3, 'calc', ['01-11'], '분수 ÷ 자연수'), {
  input: 'number', answerKind: 'fraction', mixedInput: true, speedBonus: true, back: 'g5s2-fraction-multiply',
  texts: ['〔{a}/{d} ÷ {c} = ?〕계산하면 얼마일까요?'],
  draw(rng) {
    const d = rng.int(2, 9), a = rng.int(1, d - 1), c = rng.int(2, 6);
    if (gcd(a, d) !== 1) return null;
    const answer = f(a, d * c), stepsEnding = fill('{answer:입니다}', { answer }).slice(answer.length);
    return { a, d, c, D: d * c, steps: fractionSteps(a, d * c), stepsEnding, ...errors(
      wrong(f(a * c, d), '분자에 곱하기', '분모 대신 분자 {a}에 {c:을/를} 곱하여 {value:을/를} 썼습니다. 분모 {d}에 나누는 수 {c:을/를} 곱하면 {answer:입니다}.'),
      wrong(f(a, d), '나누는 수 무시하기', '{c:으로/로} 나누지 않고 원래 분수를 그대로 {value:으로/로} 썼습니다. {a}/{d:을/를} {c}등분한 한 부분은 {answer:입니다}.')) };
  },
  answer: ({ a, d, c }) => f(a, d * c), check: ({ a, d, c }) => f(a * 2, d * c * 2),
  solution: '{c:으로/로} 나누려면 1/{c:을/를} 곱합니다.\n{a}/{d} ÷ {c} = {a}/{d} × 1/{c} = {steps}{stepsEnding}.\n따라서 답은 {answer:입니다}.',
});
