import { explain, placeSteps } from '../solution-process.js?v=9a67f36b25';
import { define, wrong, errors } from './helpers.js?v=9a67f36b25';
import { bank, onesCarry, tensCarry, plusCheck ,additionAt,subtractionAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool = bank(100, 999, 100, 999, (a, b) => onesCarry(a, b) && !tensCarry(a, b) && a + b <= 999, (a, b) => a + b);
export default define({ id: 'g3.addsub.carry1', unit: 'g3s1-addsub', strand: 'calc', level: 2, label: '한 번 받아올리는 세 자리 덧셈', std: ['[4수01-03]'] }, {
  input: 'number', errorCount: 2, maxDigits: 4, range: { min: 0, max: 1998 }, answerSpan: pool.answers, back: 'g2s1-addsub',
  texts: ['〔{a} + {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {
    const { a, b } = pool.draw(rng), ones = a % 10 + b % 10;
    return { a, b, ones, ...errors(
      wrong(a + b - 10, '받아올림 빠뜨리기', `일의 자리 ${a%10} + ${b%10} = ${ones}에서 십의 자리로 받아올린 1을 더하지 않아 ${a+b-10}이 되었습니다. ${additionAt(a,b,1)}`),
      wrong(Number(String(Math.floor(a/10)+Math.floor(b/10))+String(ones)), '일의 자리 합을 그대로 쓰기', `일의 자리 합 ${ones}을 받아올리지 않고 이어 써서 ${Number(String(Math.floor(a/10)+Math.floor(b/10))+String(ones))}이 되었습니다. ${ones%10}은 일의 자리에 쓰고 1은 십의 자리로 받아올리면 ${a} + ${b} = ${a+b}입니다.`)) };
  }, v => placeSteps(v.a, v.b, false, 3)),
  answer: ({ a, b }) => a + b, check: ({ a, b }) => plusCheck(a, b),
  solution: '{process}\n따라서 {a} + {b} = {answer:입니다}.',
});
