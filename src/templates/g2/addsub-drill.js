import { explain, placeSteps } from '../solution-process.js?v=9a67f36b25';
// 두 자리와 한 자리의 받아올림·받아내림 훈련.
import { define, errors, wrong, seq } from './helpers.js?v=9a67f36b25';
import { arithmeticWords } from './helpers.js?v=9a67f36b25';

export default define({ id: 'g2.addsub.drill', unit: 'g2s1-addsub', strand: 'calc', level: 4, label: '두 자리 ± 한 자리', std: ['[2수01-06]'] }, {
  speedBonus: true, maxDigits: 2, range: { min: 0, max: 99 }, errorCount: 3, back: 'g1s2-addsub-one',
  texts: ['〔{a} {symbol} {b} = ?〕계산하면 얼마일까요?'],
  draw: explain(function(rng) {
    const op = rng.pick(['+', '-']), a = rng.int(op === '+' ? 10 : 20, op === '+' ? 89 : 99), b = rng.int(1, 9);
    if (op === '+' ? a % 10 + b < 10 : a % 10 >= b || a - b < 10) return null;
    const result = op === '+' ? a + b : a - b, extra = rng.pick([-1, 1]);
    return { a, b, op, symbol: op === '+' ? '+' : '−', ...errors(
      wrong(result + (op === '+' ? -10 : 10), op === '+' ? '받아올림 빠뜨리기' : '빌린 십 빼먹기', op === '+' ? `받아올림한 1을 십의 자리에 더하지 않았습니다. ${arithmeticWords(a,b).tensFact}` : `받아내림을 하고도 십의 자리를 ${Math.floor(a/10)} 그대로 계산했습니다. ${arithmeticWords(a,b,true).borrowFact}`),
      wrong(result + (op === '+' ? 10 : -10), op === '+' ? '받아올림 두 번 더하기' : '십 두 번 빌리기', op === '+' ? `받아올림한 1을 십의 자리에 두 번 더했습니다. ${arithmeticWords(a,b).carryTwiceFact}` : `십의 자리에서 1을 두 번 받아내렸습니다. ${arithmeticWords(a,b,true).borrowTwiceFact}`),
      op==='-'&&result%10!==5?wrong(Math.floor(a/10)*10+b-a%10,'일의 자리 거꾸로 빼기',`일의 자리에서 ${b}에서 ${a%10}을 뺐습니다. ${arithmeticWords(a,b,true).onesFact}`):wrong(result+extra,`일의 자리 하나 ${extra>0?'더':'덜'} 세기`,`일의 자리를 1 ${extra>0?'크게':'작게'} 계산했습니다. ${arithmeticWords(a,b,op==='-').onesFact}`)) };
  }, v => placeSteps(v.a,v.b,v.op==='-')),
  requiredChoices:({a,b,op})=>op==='+'?[a+b-10]:(a-b)%10===5?[]:[Math.floor(a/10)*10+b-a%10],
  candidates: seq(10, 99),
  answer: ({ a, b, op }) => op === '+' ? a + b : a - b,
  check: ({ a, b, op }) => op === '+' ? (Math.floor(a / 10) + 1) * 10 + a % 10 + b - 10 : (Math.floor(a / 10) - 1) * 10 + a % 10 + 10 - b,
  solution: "{process}\n따라서 답은 {answer}입니다.",
});
