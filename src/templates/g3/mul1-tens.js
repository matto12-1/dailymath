import { define, product, wrong, errors } from './helpers.js?v=9a67f36b25';
import { bank , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool = bank(20, 90, 2, 9, (a, b) => a % 10 === 0 && a / 10 * b !== a + b, (a, b) => a * b);
export default define({ id: 'g3.mul1.tens', unit: 'g3s1-multiplication', strand: 'calc', level: 1, label: '몇십과 한 자리 수의 곱셈', std: ['[4수01-04]'] }, {
  input: 'number', errorCount: 2, maxDigits: 3, range: { min: 0, max: 999 }, answerSpan: pool.answers, back: 'g2s2-times',
  texts: ['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw(rng) {
    const { a, b } = pool.draw(rng);
    return { a, b, tens: a / 10, small: a / 10 * b, ...errors(
      wrong(a / 10 * b, '곱의 끝 0 빠뜨리기', `${a/10} × ${b} = ${a/10*b}만 쓰고 끝의 0을 빠뜨렸습니다. ${a} × ${b}는 10이 ${a/10*b}개이므로 ${a*b}입니다.`),
      wrong(a + b, '곱셈 대신 덧셈하기', `${a} × ${b} 대신 ${a} + ${b} = ${a+b}로 계산했습니다. ${a}을 ${b}번 모으면 10이 ${a/10*b}개이므로 ${a*b}입니다.`)) };
  },
  answer: ({ a, b }) => a * b, check: ({ a, b }) => product(a, b),
  solution: '{a:은/는} 10이 {tens}개입니다.\n{a} × {b:은/는} 10이 {tens} × {b} = {small}개입니다.\n따라서 {a} × {b} = {answer:입니다}.',
});
