import { explain, multiplyLines } from '../solution-process.js?v=9a67f36b25';
import { define, product, wrong, errors } from './helpers.js?v=9a67f36b25';
import { bank , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool = bank(11, 99, 2, 9, (a, b) => a % 10 * b >= 10 && a * b < 100, (a, b) => a * b);
export default define({ id: 'g3.mul1.carry', unit: 'g3s1-multiplication', strand: 'calc', level: 3, label: '일의 자리에서 받아올리는 곱셈', std: ['[4수01-04]'] }, {
  input: 'number', errorCount: 2, maxDigits: 3, range: { min: 0, max: 999 }, answerSpan: pool.answers, back: 'g2s1-addsub',
  texts: ['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {
    const { a, b } = pool.draw(rng), ones = a % 10 * b, carry = Math.floor(ones / 10);
    return { a, b, ones, carry, ...errors(
      wrong(a * b - 10 * carry, '일의 자리 받아올림 빠뜨리기', `일의 자리 곱 ${ones}에서 십의 자리로 받아올린 ${carry}을 더하지 않아 ${a*b-10*carry}이 되었습니다. ${multiplicationAt(a,b,1)}`),
      wrong(Number(String(Math.floor(a/10)*b)+String(ones)), '곱을 나란히 쓰기', `십의 자리 곱과 일의 자리 곱을 나란히 써서 ${Number(String(Math.floor(a/10)*b)+String(ones))}이 되었습니다. 일의 자리 곱 ${ones}에서 ${carry}을 십의 자리로 받아올리면 ${a} × ${b} = ${a*b}입니다.`)) };
  }, v => multiplyLines(v.a, v.b)),
  answer: ({ a, b }) => a * b, check: ({ a, b }) => product(a, b),
  solution: '{process}\n따라서 {a} × {b} = {answer:입니다}.',
});
