import { explain, placeSteps } from '../solution-process.js?v=9a67f36b25';
import { define, wrong, errors } from './helpers.js?v=9a67f36b25';
import { bank, onesBorrow, tensBorrow, minusCheck, reverseSubtract ,additionAt,subtractionAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool = bank(100, 999, 100, 999, (a, b) => a > b && onesBorrow(a, b) && tensBorrow(a, b) && reverseSubtract(a, b) !== a - b + 100, (a, b) => a - b);
export default define({ id: 'g3.addsub.borrow2', unit: 'g3s1-addsub', strand: 'calc', level: 3, label: '두 번 받아내리는 세 자리 뺄셈', std: ['[4수01-03]'] }, {
  input: 'number', errorCount: 2, maxDigits: 3, range: { min: 0, max: 1998 }, answerSpan: pool.answers, back: 'g2s1-addsub',
  texts: ['〔{a} − {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {
    const { a, b } = pool.draw(rng);
    return { a, b, ...errors(
      wrong(reverseSubtract(a, b), '자리마다 큰 숫자에서 빼기', `받아내림하지 않고 자리마다 큰 숫자에서 작은 숫자를 빼서 ${reverseSubtract(a,b)}이 되었습니다. ${subtractionAt(a,b,0)}`),
      wrong(a - b + 100, '빌려준 백 빼기 빠뜨리기', `백의 자리에서 받아내림하고도 백의 자리 ${Math.floor(a/100)}를 줄이지 않아 ${a-b+100}이 되었습니다. ${subtractionAt(a,b,2)}`)) };
  }, v => placeSteps(v.a,v.b,true,3)),
  answer: ({ a, b }) => a - b, check: ({ a, b }) => minusCheck(a, b),
  solution: "{process}\n따라서 {a} − {b} = {answer:입니다}.",
});
