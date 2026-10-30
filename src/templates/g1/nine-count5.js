import { explain, say, count } from '../solution-process.js?v=9a67f36b25';
import { numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ n }) => n;
const mistakes = [
  { id: "miss-one", label: "마지막 점 빠뜨리기", say: "점 하나를 빠뜨려 {value:이/가} 나왔습니다. 빠뜨린 점까지 왼쪽부터 모두 세면 {n}개입니다.", value: ({ n }) => n - 1 },
  { id: "count-twice", label: "점 두 번 세기", say: "점 하나를 두 번 세어 {value:이/가} 나왔습니다. 같은 점을 한 번씩만 세면 {n}개입니다.", value: ({ n }) => n + 1 },
  { id: "miss-or-repeat-two", label: "{label3}", say: "{action3} {value:이/가} 나왔습니다. 두 점을 잘못 센 것을 바로잡아 모두 세면 {n}개입니다.", value: ({ n, skip }) => n + skip },
];

export default {
  id: 'g1.nine.count5', grade: 1, unit: 'g1s1-numbers-nine', strand: 'calc', level: 1,
  std: ["[2수01-01]"],
  label: "5까지 점 세기", input: 'choice', answerKind: 'int', maxDigits: 1, speedBonus: true,
  range: { min: 1, max: 6 }, operandRange: { min: -2, max: 100 },
  answerSpan: [1,2,3,4,5],
  texts: ["점은 모두 몇 개일까요?"],
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const n = rng.int(1, 5), skip = rng.pick([-2, 2]);
      return { n, skip, slots:rng.shuffle(Array.from({length:10},(_,i)=>i)).slice(0,n), label3: skip < 0 ? '점 두 개 빠뜨리기' : '점 두 개 더 세기', action3: skip < 0 ? '점 두 개를 빠뜨려' : '점을 두 개 더 세어' };
    // 채움 보기는 답이 될 수 있는 수에서만 고른다. 답이 못 되는 수가 채움으로도 끼면 늘 오답인 보기가 30% 넘게 나와 그 보기부터 지우고 찍었다(검수 2번).
    }, answer, mistakes, this.range, { candidates: [1, 2, 3, 4, 5] });
  }, v => ['왼쪽 점부터 하나씩 짚으며 ' + count(v.n) + ' 하고 셉니다.']),
  answer,
  check: ({ n }) => countSum(n),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ n }) => countSum(n))(vars),
  mistakes,
  art: ({ n, slots }) => ({ kind: 'tenframe', n, slots:slots }),
  solution: "{process}\n따라서 점은 {answer}개입니다.",
};
