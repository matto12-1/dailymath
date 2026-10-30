import { define, product, wrong, errors } from './helpers.js?v=9a67f36b25';
import { bank , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool = bank(12, 99, 2, 9, (a, b) => a % 10 > 0 && a % 10 * b < 10 && Math.floor(a / 10) * b < 10, (a, b) => a * b);
export default define({ id: 'g3.mul1.plain', unit: 'g3s1-multiplication', strand: 'calc', level: 2, label: '받아올림 없는 두 자리 곱셈', std: ['[4수01-04]'] }, {
  input: 'number', errorCount: 2, maxDigits: 2, range: { min: 0, max: 999 }, answerSpan: pool.answers, back: 'g2s2-times',
  texts: ['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw(rng) {
    const { a, b } = pool.draw(rng);
    return { a, b, tens:Math.floor(a/10),ones:a%10, tensProduct: Math.floor(a / 10) * b, onesProduct: a % 10 * b, ...errors(
      wrong(Math.floor(a / 10) * 10 + a % 10 * b, '십의 자리에 곱하기 빠뜨리기', `${a}의 십의 자리에는 ${b}를 곱하지 않아 ${Math.floor(a/10)*10+a%10*b}이 되었습니다. ${multiplicationAt(a,b,1)}`),
      wrong(Math.floor(a / 10) * 10 * b + a % 10, '일의 자리에 곱하기 빠뜨리기', `${a}의 일의 자리 ${a%10}에 ${b}를 곱하지 않아 ${Math.floor(a/10)*10*b+a%10}이 되었습니다. ${multiplicationAt(a,b,0)}`)) };
  },
  answer: ({ a, b }) => a * b, check: ({ a, b }) => product(a, b),
  solution:"일의 자리는 {ones} × {b} = {onesProduct}입니다.\n십의 자리는 {tens} × {b} = {tensProduct}입니다.\n따라서 {a} × {b} = {answer:입니다}.",
});
