import { explain, say } from '../solution-process.js?v=9a67f36b25';
import { numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b, add }) => add ? a + b : a - b;
const mistakes = [
  { id: "opposite", label: "더하기와 빼기 바꾸기", say: "더하기와 빼기를 바꾸어 {value:이/가} 나왔습니다. {a} {op} {b} = {answer}입니다.", value: ({ a, b, add }) => add ? a - b : a + b },
  { id: "extra-ten", label: "10개씩 묶음 하나 더 세기", say: "10개씩 묶음을 하나 더 세어 {value:이/가} 나왔습니다. 두 번 센 묶음을 하나 빼고 세면 {bundleResult}개이므로 {answer}입니다.", value: ({ a, b, add }) => (add ? a + b : a - b) + 10 },
  { id: "miss-ten", label: "10개씩 묶음 하나 덜 세기", say: "10개씩 묶음을 하나 덜 세어 {value:이/가} 나왔습니다. 빠뜨린 묶음 하나까지 포함하면 {bundleResult}개이므로 {answer}입니다.", value: ({ a, b, add }) => (add ? a + b : a - b) - 10 },
];

export default {
  id: 'g1.addsub3.tens', grade: 1, unit: 'g1s2-addsub-two', strand: 'calc', level: 1,
  std: ["[2수01-06]"],
  label: "몇십끼리 더하고 빼기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 99 }, operandRange: { min: -2, max: 100 },
  answerSpan: [10,20,30,40,50,60,70,80,90],
  texts: ["〔{a} {op} {b} = ?〕계산하면 얼마일까요?"],
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const a = rng.int(2, 8) * 10, b = rng.int(2, 8) * 10, add = rng.pick([true, false]); const total = add ? a + b : a - b; return total >= 10 && total <= 90 && (add ? a > b : a + b <= 90) ? { a, b, add, bundleResult:(add?a+b:a-b)/10, op: add ? "+" : "−" } : null;
    }, answer, mistakes, this.range, { candidates: [10, 20, 30, 40, 50, 60, 70, 80, 90] });
  }, v => ['10개씩 묶음 ' + v.a/10 + '개' + (v.add?'에 ':'에서 ') + '10개씩 묶음 ' + v.b/10 + '개를 ' + (v.add?'더하면 ':'빼면 ') + '10개씩 묶음 ' + (v.add?v.a+v.b:v.a-v.b)/10 + '개' + (v.add?'가 됩니다.':'가 남습니다.'), '묶음마다 낱개 10개씩 들어 있습니다.']),
  answer,
  check: ({ a, b, add }) => add ? countSum(...Array((a + b) / 10).fill(10)) : countBack(a, ...Array(b / 10).fill(10)),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b, add }) => add ? countSum(...Array((a + b) / 10).fill(10)) : countBack(a, ...Array(b / 10).fill(10)))(vars),
  mistakes,
  art:({a,b,add})=>({kind:'blocks',tens:(add?a+b:a)/10,ones:0,...(add?{added:{tens:b/10}}:{crossed:{tens:b/10}})}),
  solution: "{process}\n따라서 {a} {op} {b} = {answer}입니다.",
};
