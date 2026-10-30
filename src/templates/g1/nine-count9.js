import { explain, say } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';
import { countFrom } from './helpers.js?v=9a67f36b25';

const answer = ({ n }) => n;
const mistakes = [
  { id: "repeat-or-miss-two", label: "{label1}", say: "{action1} {value:이/가} 나왔습니다. 윗줄 다섯 점에 아랫줄 점을 모두 이어 세면 {n}개입니다.", value: ({ n }) => n === 9 ? n - 2 : n + 1 },
  {id:'miss-one',label:'점 하나 빠뜨리기',value:({n})=>n-1,say:'점 하나를 빠뜨려 {value:이/가} 나왔습니다. 윗줄 다섯 점 다음부터 아랫줄 점을 빠짐없이 이어 세면 {answer}개입니다.'},
  {id:'count-several',label:'{label3}',value:({n,skip})=>n===9?n-3:n+skip,say:'{action3} {value:이/가} 나왔습니다. 윗줄과 아랫줄의 점을 빠짐없이 한 번씩 세면 {answer}개입니다.'},
];

export default {
  id: 'g1.nine.count9', grade: 1, unit: 'g1s1-numbers-nine', strand: 'calc', level: 2,
  std: ["[2수01-01]"],
  label: "9까지 점 세기", input: 'choice', answerKind: 'int', maxDigits: 1, speedBonus: true,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  answerSpan: [6,7,8,9],
  texts: ["점은 모두 몇 개일까요?"],
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const n = rng.pick([6, 6, 7, 7, 8, 8, 9]), skip = n===6?2:rng.pick([-2, 2]);
      return { n, skip, slots:rng.shuffle([5,6,7,8,9]).slice(0,n-5), label1: n === 9 ? '점 두 개 빠뜨리기' : '점 하나 두 번 세기', action1: n === 9 ? '점 두 개를 빠뜨려' : '점 하나를 두 번 세어',
        label3: n === 9 ? '점 세 개 빠뜨리기' : skip < 0 ? '점 두 개 빠뜨리기' : '점 두 개 두 번 세기', action3: n === 9 ? '점 세 개를 빠뜨려' : skip < 0 ? '점 두 개를 빠뜨려' : '점 두 개를 두 번 세어' };
    }, answer, mistakes, this.range, {
      candidates: Array.from({length:9},(_,i)=>i+1),
      // 9는 늘 가장 큰 보기라 덜 낸다. 고르게 내면 「가장 큰 수 찍기」가 40%를 넘는 씨앗이 있었다.
      // 6만 정답보다 큰 보기 셋을 둘 수 있어요. 더 센 실수도 충분히 고르게 해요.
      directionFor: ({ n }) => n === 6 ? rng.pick([-1, 1, 1, 1]) : rng.pick([-1, 1]),
    });
  }, v => ['윗줄의 점은 5개입니다.', '아랫줄의 점을 ' + countFrom(5,v.n-5) + ' 하고 이어 셉니다.']),
  answer,
  check: ({ n }) => countSum(n),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ n }) => countSum(n))(vars),
  mistakes,
  art: ({ n, slots }) => ({ kind: 'tenframe', n, slots:[0,1,2,3,4,...slots] }),
  solution: "{process}\n따라서 점은 {answer}개입니다.",
};
