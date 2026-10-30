import { multiplicationAt } from './arithmetic-helpers.js?v=9a67f36b25';
// 두 자리와 한 자리 곱셈 훈련.
import { define, product, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define({ id: 'g3.mul1.drill', unit: 'g3s1-multiplication', strand: 'calc', level: 4, label: '두 자리 × 한 자리', std: ['[4수01-04]'] }, {
  input: 'number', speedBonus: true, maxDigits: 3, errorCount: 2, back: 'g2s2-times',
  texts: ['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw(rng) {
    const a = rng.int(11, 99), b = rng.int(2, 9);
    if (a % 10 === 0) return null;
    const ones = a % 10 * b, carry = Math.floor(ones / 10), tens = Math.floor(a / 10) * b;
    return { a, b, ones, carry, tens,tenValue:Math.floor(a/10)*10,oneDigit:a%10,tenProduct:tens*10, ...errors(
      carry ? wrong(a * b - carry * 10, '일의 자리 받아올림 빠뜨리기', `일의 자리 곱 ${ones}에서 십의 자리로 받아올린 ${carry}을 더하지 않아 ${a*b-10*carry}이 되었습니다. ${multiplicationAt(a,b,1)}`)
        : wrong(Math.floor(a / 10) * 10 + ones, '십의 자리에 곱하기 빠뜨리기', `${a}의 십의 자리에는 ${b}를 곱하지 않아 ${Math.floor(a/10)*10+a%10*b}이 되었습니다. ${multiplicationAt(a,b,1)}`),
      wrong(tens * 10 + a % 10, '일의 자리에 곱하기 빠뜨리기', `${a}의 일의 자리 ${a%10}에 ${b}를 곱하지 않아 ${Math.floor(a/10)*10*b+a%10}이 되었습니다. ${multiplicationAt(a,b,0)}`)) };
  },
  answer: ({ a, b }) => a * b, check: ({ a, b }) => product(a, b),
  solution: '{tenValue} × {b} = {tenProduct}, {oneDigit} × {b} = {ones}입니다.\n{tenProduct} + {ones} = {answer}입니다.\n따라서 {a} × {b} = {answer:입니다}.',
});
