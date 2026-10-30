import { until } from '../../engine/retry.js?v=9a67f36b25';

// 3학년 1학기 덧셈과 뺄셈: 일·십의 자리 모두 받아내림이 있는 세 자리 − 세 자리
const d = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];

export default {
  id: 'g3.sub3.borrow2', grade: 3, unit: 'g3s1-addsub', strand: 'calc', level: 3,
  std: ['[4수01-03]'],
  label: '받아내림 두 번 세 자리 뺄셈', input: 'number', speedBonus: true,
  range: { min: 100, max: 999 },
  texts: ['{a} − {b} = ?'],
  make(rng) {
    return until(() => {
      const a = rng.int(301, 999);
      const b = rng.int(101, a - 1);
      const [, at, ao] = d(a);
      const [, bt, bo] = d(b);
      return ao < bo && at - 1 < bt && a - b >= 100 ? { a, b } : null;
    });
  },
  answer: ({ a, b }) => a - b,
  check({ a, b }) {
    const [ah, at, ao] = d(a);
    const [bh, bt, bo] = d(b);
    const o = ao + 10 - bo;
    const t = at - 1 + 10 - bt;
    const h = ah - 1 - bh;
    return h * 100 + t * 10 + o;
  },
  mistakes: [
    {
      id: 'no-borrow', label: '받아내림 빼먹기', back: 'g2s1-addsub',
      say: '자리마다 큰 수에서 작은 수를 빼면 안 돼요. 위의 수가 더 작으면 윗자리에서 10을 빌려 와서 빼요.',
      value: ({ a, b }) => { const x = d(a), y = d(b); return Math.abs(x[0] - y[0]) * 100 + Math.abs(x[1] - y[1]) * 10 + Math.abs(x[2] - y[2]); },
    },
    {
      id: 'tens-not-reduced', label: '빌려 준 1을 안 빼기', back: 'g2s1-addsub',
      say: '일의 자리에 10을 빌려 주면 십의 자리 수는 1 작아져요. 그걸 깜빡해서 {value:이/가} 나왔어요.',
      value: ({ a, b }) => { const [ah, at, ao] = d(a), [bh, bt, bo] = d(b); return (ah - 1 - bh) * 100 + (at + 10 - bt) * 10 + (ao + 10 - bo); },
    },
  ],
  solution: '일의 자리, 십의 자리 모두 빌려 와야 해요. {a} − {b} = {answer}',
};
