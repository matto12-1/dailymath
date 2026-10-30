// 18까지 받아올림 덧셈과 받아내림 뺄셈 훈련.
import carry from './addsub4-carry.js?v=9a67f36b25';
import borrow from './addsub4-borrow.js?v=9a67f36b25';
import { countingErrors, countSum, countBack } from './helpers.js?v=9a67f36b25';
import { until } from '../../engine/retry.js?v=9a67f36b25';
import { fill } from '../../engine/korean.js?v=9a67f36b25';

const answer = ({ a, b, op }) => op === '+' ? a + b : a - b;
export default {
  ...borrow, id: 'g1.addsub4.drill', label: '18까지 덧셈·뺄셈',
  // 훈련은 빨리 셈하는 연습이라 바탕 틀(십몇에서 빼기)의 그림을 두지 않는다.
  art: null,
  texts: ['〔{a} {symbol} {b} = ?〕계산하면 얼마일까요?'],
  answerSpan: [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18],
  make(rng) {
    const op = rng.pick(['+', '-']), base = op === '+' ? carry : borrow;
    const v = until(() => { const v = base.make(rng); return v.a >= 2 && v.b >= 2 ? v : null; });
    return { ...v, op, symbol: op === '+' ? '+' : '−', steps: fill(base.solution, { ...v, answer: base.answer(v) }) };
  },
  answer, check: ({ a, b, op }) => op === '+' ? countSum(a, b) : countBack(a, b),
  isCorrect: (v, choice) => choice === answer(v),
  mistakes: [
    ...[...carry.mistakes.map(m=>['+',m]), ...borrow.mistakes.map(m=>['-',m])].map(([op, m]) => ({ ...m,id:op+m.id, value: (v) => v.op === op ? m.value(v) : null })),
    ...countingErrors(answer, 1, '수'),
  ],
  solution: '{steps}',
};
