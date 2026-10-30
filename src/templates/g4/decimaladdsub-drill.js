import { explain, placeSteps } from '../solution-process.js?v=9a67f36b25';
// 소수 첫째 자리 덧셈·뺄셈 훈련.
import { define, meta, dec, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define(meta('decimaladdsub', 'drill', 3, 'calc', ['01-16'], '소수 덧셈·뺄셈'), {
  input: 'number', answerKind: 'decimal', speedBonus: true, back: 'g3s1-addsub',
  texts: ['〔{left} {symbol} {right} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {
    const a = rng.int(1, 99), b = rng.int(1, 99), op = rng.pick(['+', '-']), result = op === '+' ? a + b : a - b;
    if (a % 10 === 0 || b % 10 === 0 || result <= 0 || result % 10 === 0) return null;
    return { a, b, op, result, symbol: op === '+' ? '+' : '−', left: dec(a, 1), right: dec(b, 1), ...errors(
      wrong(dec(result, 0), '소수점 빠뜨리기', `소수점을 쓰지 않고 ${a} {symbol} ${b} = ${result}을 썼습니다. 소수점을 맞추어 계산하면 {left} {symbol} {right} = {answer}입니다.`),
      wrong(dec(result, 2), '소수점을 한 자리 잘못 찍기', `소수 한 자리 수끼리 계산했는데 ${dec(result,2)}을 썼습니다. 소수 첫째 자리까지 맞추어 ${op==="+"?"더하면":"빼면"} {answer}입니다.`)) };
  }, v => placeSteps(v.a,v.b,v.op==='-',2,1)),
  answer: ({ result }) => dec(result, 1),
  check: ({ left, right, op }) => dec(Math.round(Number(left) * 10) + (op === '+' ? 1 : -1) * Math.round(Number(right) * 10), 1),
  solution: "{process}\n따라서 {left} {symbol} {right} = {answer:입니다}.",
});
