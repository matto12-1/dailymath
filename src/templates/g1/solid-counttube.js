import { explain, say, count } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack, mixPieces } from './helpers.js?v=9a67f36b25';

const answer = ({ b, t, s }) => t;
const mistakes = [
  { id: "mixed", label: "다른 모양까지 세기", say: "공 모양까지 세어 {value}개가 나왔습니다. 공 모양을 제외하고 둥근기둥 모양만 세면 {t}개입니다.", value: ({ b, t, s }) => t + s },
  ...countingErrors(answer, 1, '둥근기둥 모양').map(m => ({...m, say: '둥근기둥 모양 하나를 {countVerb} {value}개가 나왔습니다. {countFix} 둥근기둥 모양만 세면 {answer}개입니다.'})),
  {id:'miss-two',label:'둥근기둥 모양 두 개 빠뜨리기',value:({t})=>t-2,say:'둥근기둥 모양 두 개를 빠뜨려 {value:을/를} 골랐습니다. 빠뜨린 두 개까지 같은 모양만 세면 {answer}개입니다.'},
];

export default {
  id: 'g1.solid.counttube', grade: 1, unit: 'g1s1-solid-shapes', strand: 'shape', level: 3,
  std: ["[2수03-01]"],
  label: "둥근기둥 모양 세기", input: 'choice', answerKind: 'int', maxDigits: 1,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  texts: ["둥근기둥 모양은 몇 개일까요?"],
  // 세는 모양은 1~6개이고 채움 보기도 1~6이다. 전엔 2~5개라 0·1이 늘 오답으로만 나와 지우고 찍었다(검수 2번).
  // 세는 수는 1~6을 고르게 뽑고, 하나뿐일 때만 더 세는 실수로 둔다(0이 나오지 않게).
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const t = rng.int(1, 6), b = rng.int(1, Math.min(5, 8 - t)), s = rng.int(1, Math.min(5, 9 - b - t)); return b + t + s <= 9 ? { b, t, s, pieces: mixPieces(rng, { box: b, tube: t, ball: s }) } : null;
    }, answer, mistakes, this.range, { directionFor: ({ t }) => t <= 1 ? 1 : rng.pick([-1, -1, 1]), candidates: [1, 2, 3, 4, 5, 6] });
  }, v => ['둥근기둥 모양은 평평한 부분과 둥근 부분이 있습니다.', '둥근기둥 모양만 하나씩 세면 ' + v.t + '개입니다.']),
  answer,
  check: ({ b, t, s }) => countSum(t),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ b, t, s }) => countSum(t))(vars),
  mistakes,
  art: ({ pieces }) => ({ kind: 'objects', items: pieces }),
  solution: "{process}\n따라서 둥근기둥 모양은 {answer}개입니다.",
};
