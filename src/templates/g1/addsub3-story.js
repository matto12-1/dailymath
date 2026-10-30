import { explain, say } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a - b;
const mistakes = [
  { id: "miss-tens", label: "10개씩 묶음 빼기 빠뜨리기", say: "뺄 수의 10개씩 묶음을 빠뜨려 {value:이/가} 나왔습니다. 10개씩 묶음끼리도 빼고 남은 낱개와 모으면 {answer}입니다.", value: ({ a, v }) => a - v },
  {id:'ones-or-bundle',label:'{label2}',value:({a,b,u,missOnes})=>missOnes?a-10*u:a-b-10,say:'{action2} {value:이/가} 나왔습니다. 뺄 수의 묶음과 낱개를 한 번씩만 정확히 빼면 {answer}입니다.'},
  {id:'count-one',label:'거꾸로 세기에서 한 수 달리 세기',value:({a,b,slip})=>a-b+slip,say:'거꾸로 셀 때 한 수를 달리 세어 {value:이/가} 나왔습니다. 낱개끼리 {o}에서 {v:을/를} 정확히 빼고 묶음과 모으면 {answer}입니다.'},
];

export default {
  id: 'g1.addsub3.story', grade: 1, unit: 'g1s2-addsub-two', strand: 'word', level: 3,
  std: ["[2수01-05]"],
  label: "스티커 주고 남은 수", input: 'choice', answerKind: 'int', maxDigits: 2,
  range: { min: 0, max: 99 }, operandRange: { min: -2, max: 100 },
  answerSpan: [10,11,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,46,47,48,50,51,52,53,54,55,56,57,58,60,61,62,63,64,65,66,67,68,70,71,72,73,74,75,76,77,78,80,81,82,83,84,85,86,87,88],
  texts: ["스티커 {a}개 중 {b}개를 주었습니다. 몇 개가 남을까요?"],
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const dt = rng.int(1, 8), d = rng.int(0, 8), u = rng.int(1, 9 - dt), v = rng.int(1, 9 - d);
      const t = u + dt, o = v + d,missOnes=rng.pick([true,false]); return {missOnes,slip:rng.pick([-1,1]),label2:missOnes?'낱개 빼기 빠뜨리기':'묶음 하나 더 빼기',action2:missOnes?'뺄 수의 낱개를 빼지 않아':'묶음을 하나 더 빼서', a: 10 * t + o, b: 10 * u + v, t, u, o, v, tensLeft:t-u };
    }, answer, mistakes, this.range, { acceptChoices:(v,xs)=>xs.every(n=>n<v.a),candidates: ({ a }) => Array.from({ length: a }, (_, i) => i) });
  }, v => ['낱개끼리 빼면 ' + v.o + ' − ' + v.v + ' = ' + say(v.o-v.v), '10개씩 묶음끼리 빼면 ' + v.t + ' − ' + v.u + ' = ' + say(v.t-v.u), (v.o===v.v?'10개씩 묶음 '+(v.t-v.u)+'개만 남습니다.':'10개씩 묶음 '+(v.t-v.u)+'개와 낱개 '+(v.o-v.v)+'개가 남습니다.')]),
  answer,
  check: ({ t, u, o, v }) => countBack(t, u) * 10 + countBack(o, v),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ t, u, o, v }) => countBack(t, u) * 10 + countBack(o, v))(vars),
  mistakes,
  art: () => ({ scene: 'sticker-share' }),
  solution: "{process}\n따라서 남은 스티커는 {answer}개입니다.",
};
