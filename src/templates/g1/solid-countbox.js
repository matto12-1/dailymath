import { explain, say, count } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack, mixPieces } from './helpers.js?v=9a67f36b25';

const answer = ({ b, t, s }) => b;
const mistakes = [
  { id: "mixed", label: "다른 모양까지 세기", say: "{alsoName}까지 세어 {value}개가 나왔습니다. 다른 모양을 빼고 상자 모양만 골라 세면 {b}개입니다.", value: ({ b, t, s, also }) => b + (also === 't' ? t : s) },
  ...countingErrors(answer, 1, '상자 모양').map(m => ({...m, say: '상자 모양 하나를 {countVerb} {value}개가 나왔습니다. {countFix} 상자 모양만 세면 {answer}개입니다.'})),
  {id:'miss-two',label:'상자 모양 두 개 빠뜨리기',value:({b})=>b-2,say:'상자 모양 두 개를 빠뜨려 {value:을/를} 골랐습니다. 빠뜨린 두 개까지 같은 모양만 세면 {answer}개입니다.'},
];

export default {
  id: 'g1.solid.countbox', grade: 1, unit: 'g1s1-solid-shapes', strand: 'shape', level: 3,
  std: ["[2수03-01]"],
  label: "상자 모양 세기", input: 'choice', answerKind: 'int', maxDigits: 1,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  texts: ["상자 모양은 몇 개일까요?"],
  // 세는 모양은 1~6개이고 채움 보기도 1~6이다. 전엔 2~5개라 0·1이 늘 오답으로만 나와 지우고 찍었다(검수 2번).
  // 상자 수는 1~6을 고르게 뽑는다. 「다른 모양까지 세기」는 다른 모양 하나만 더 센 수라 값이 퍼진다(모두 더하면 늘 7~9라 붙박이 오답이었다).
  // 하나뿐일 때만 더 세는 실수로 둔다(0이 나오지 않게).
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const b = rng.int(1, 6), t = rng.int(1, Math.min(5, 8 - b)), s = rng.int(1, Math.min(5, 9 - b - t)), also = rng.pick(['t', 's']); return b + t + s <= 9 ? { b, t, s, also,alsoName:also==='t'?'둥근기둥 모양':'공 모양',pieces: mixPieces(rng, { box: b, tube: t, ball: s }) } : null;
    }, answer, mistakes, this.range, { edgeWeight: 3, candidates: [1, 2, 3, 4, 5, 6], directionFor: ({ b }) => b <= 1 ? 1 : rng.pick([-1, -1, 1]) });
  }, v => ['상자 모양은 평평한 부분과 뾰족한 부분이 있습니다.', '상자 모양만 하나씩 세면 ' + v.b + '개입니다.']),
  answer,
  check: ({ b, t, s }) => countSum(b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ b, t, s }) => countSum(b))(vars),
  mistakes,
  art: ({ pieces }) => ({ kind: 'objects', items: pieces }),
  solution: "{process}\n따라서 상자 모양은 {answer}개입니다.",
};
