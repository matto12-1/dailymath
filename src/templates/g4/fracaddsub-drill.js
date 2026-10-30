// 분모가 같은 진분수의 덧셈·뺄셈 훈련.
import { define, meta, frac, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define(meta('fracaddsub', 'drill', 3, 'calc', ['01-15'], '분수 덧셈·뺄셈'), {
  input: 'number', answerKind: 'fraction', mixedInput: true, speedBonus: true,
  texts: ['〔{left} {symbol} {right} = ?〕계산하면 얼마일까요?'],
  draw(rng) {
    const d = rng.int(3, 12), op = rng.pick(['+', '-']);
    const a = rng.int(op === '+' ? 1 : 2, op === '+' ? d - 2 : d - 1), b = rng.int(1, op === '+' ? d - a - 1 : a - 1);
    return { a, b, d, op,numerator:op==="+"?a+b:a-b, symbol: op === '+' ? '+' : '−', action: op === '+' ? '더합니다' : '뺍니다', left: frac(0, a, d), right: frac(0, b, d), ...errors(
      op === '+' ? wrong(frac(0, a + b, d * 2), '분모도 더하기', `분모까지 더하여 ${frac(0,a+b,2*d)}을 썼습니다. 분모는 ${d} 그대로 두고 분자끼리 더하면 ${frac(0,a+b,d)}입니다.`)
        : wrong(String(a - b), '분모 빠뜨리기', `분자끼리 뺀 ${a-b}만 썼습니다. 분모 ${d}을 그대로 두면 ${frac(0,a-b,d)}입니다.`),
      wrong(frac(0, op === '+' ? Math.abs(a - b) : a + b, d), op === '+' ? '더하기를 빼기로 계산하기' : '빼지 않고 더하기', `계산 기호를 반대로 보아 ${frac(0,op==="+"?Math.abs(a-b):a+b,d)}을 썼습니다. 분자끼리 ${op==="+"?"더하면":"빼면"} ${a} ${op==="+"?"+":"−"} ${b} = ${op==="+"?a+b:a-b}이므로 ${frac(0,op==="+"?a+b:a-b,d)}입니다.`)) };
  },
  answer: ({ a, b, d, op }) => frac(0, op === '+' ? a + b : a - b, d),
  check: ({ a, b, d, op }) => frac(0, Number(op === '+' ? BigInt(a) + BigInt(b) : BigInt(a) - BigInt(b)), d),
  solution: "분모 {d:은/는} 그대로 두고 분자끼리 계산하면 {a} {symbol} {b} = {numerator}입니다.\n따라서 {left} {symbol} {right} = {answer}입니다.",
});
