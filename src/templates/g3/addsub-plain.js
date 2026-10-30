import { explain, placeSteps } from '../solution-process.js?v=9a67f36b25';
import { define, wrong, errors } from './helpers.js?v=9a67f36b25';
import { bank, digits, plusCheck ,additionAt,subtractionAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool = bank(100, 999, 111, 999, (a, b) => b % 10 > 0 && Math.floor(b / 10) % 10 > 0 && digits(a).every((d, i) => d + digits(b)[i] < 10), (a, b) => a + b);
export default define({ id: 'g3.addsub.plain', unit: 'g3s1-addsub', strand: 'calc', level: 1, label: '받아올림 없는 세 자리 덧셈', std: ['[4수01-03]'] }, {
  input: 'number', errorCount: 2, maxDigits: 3, range: { min: 0, max: 1998 }, answerSpan: pool.answers, back: 'g2s1-addsub',
  texts: ['〔{a} + {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {
    const { a, b } = pool.draw(rng);
    return { a, b, ...errors(
      wrong(a + b - 10 * (Math.floor(b / 10) % 10), '십의 자리 더하기 빠뜨리기', `${b}의 십의 자리 ${Math.floor(b/10)%10}을 더하지 않아 ${a+b-10*(Math.floor(b/10)%10)}이 되었습니다. ${additionAt(a,b,1)}`),
      wrong(a + b - b % 10, '일의 자리 더하기 빠뜨리기', `${b}의 일의 자리 ${b%10}을 더하지 않아 ${a+b-b%10}이 되었습니다. ${additionAt(a,b,0)}`)) };
  }, v => placeSteps(v.a,v.b,false,3)),
  answer: ({ a, b }) => a + b, check: ({ a, b }) => plusCheck(a, b),
  solution: "{process}\n따라서 {a} + {b} = {answer:입니다}.",
});
