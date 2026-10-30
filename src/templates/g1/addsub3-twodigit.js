import { explain, say } from '../solution-process.js?v=9a67f36b25';
import { numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a + b;
const mistakes = [
  { id: "miss-tens", label: "10개씩 묶음 더하기 빠뜨리기", say: "더할 수의 10개씩 묶음을 빠뜨려 {value:이/가} 나왔습니다. 10개씩 묶음을 {tensSum}개로 세고 낱개 {onesSum}개와 모으면 {answer}입니다.", value: ({ a, v }) => a + v },
  { id: "miss-ones", label: "{onesLabel}", say: "{onesSay}", value: v => v.useExtra ? v.a + v.b + 1 : v.a + 10 * v.u },
  { id: "extra-bundle", label: "10개씩 묶음 하나 더 세기", say: "10개씩 묶음을 하나 더 세어 {value:이/가} 나왔습니다. 묶음을 한 번씩만 더하여 {tensSum}개로 읽고 낱개와 모으면 {answer}입니다.", value: ({ a, b }) => a + b + 10 },
];

export default {
  id: 'g1.addsub3.twodigit', grade: 1, unit: 'g1s2-addsub-two', strand: 'calc', level: 2,
  std: ["[2수01-06]"],
  label: "몇십몇끼리 더하기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 99 }, operandRange: { min: -2, max: 100 },
  answerSpan: [22,23,24,25,26,27,28,29,32,33,34,35,36,37,38,39,42,43,44,45,46,47,48,49,52,53,54,55,56,57,58,59,62,63,64,65,66,67,68,69,72,73,74,75,76,77,78,79,82,83,84,85,86,87,88,89,92,93,94,95,96,97,98,99],
  texts: ["〔{a} + {b} = ?〕계산하면 얼마일까요?"],
  make: explain(function(rng) {

    return numberVars(rng, () => {
      const total = rng.pick(this.answerSpan);
      const tens = Math.floor(total / 10), ones = total % 10;
      const t = rng.int(1, tens - 1), u = tens - t, o = rng.int(1, ones - 1), v = ones - o;
      const useExtra = rng.pick([true, false]);
      return { a: 10 * t + o, b: 10 * u + v, t, u, o, v, useExtra, tensSum:t+u, onesSum:o+v,
        onesLabel: useExtra ? '낱개 하나 더 세기' : '낱개 더하기 빠뜨리기',
        onesSay: useExtra ? `낱개끼리 더할 때 하나를 더 세었습니다. 낱개를 빠짐없이 ${o+v}개로 세고 묶음 ${t+u}개와 모으면 ${10*(t+u)+o+v}입니다.` : `더할 수의 낱개를 빠뜨렸습니다. 더할 낱개 ${v}개까지 모으면 낱개는 ${o+v}개이므로 모두 ${10*(t+u)+o+v}입니다.` };
    }, answer, mistakes, this.range, { edgeWeight: 2 });
  }, v => ['낱개끼리 더하면 ' + v.o + ' + ' + v.v + ' = ' + say(v.o+v.v), '10개씩 묶음끼리 더하면 ' + v.t + ' + ' + v.u + ' = ' + say(v.t+v.u), '묶음은 '+v.tensSum+'개, 낱개는 '+v.onesSum+'개가 됩니다.']),
  answer,
  check: ({ t, u, o, v }) => countSum(t, u) * 10 + countSum(o, v),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ t, u, o, v }) => countSum(t, u) * 10 + countSum(o, v))(vars),
  mistakes,
  art:({a,b,u,v})=>({kind:'blocks',tens:Math.floor((a+b)/10),ones:(a+b)%10,added:{tens:u,ones:v}}),
  solution: "{process}\n따라서 {a} + {b} = {answer}입니다.",
};
