import { explain, say, count } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack,FLAT,NAMES,mixPieces } from './helpers.js?v=9a67f36b25';
import { flatFeature } from './helpers.js?v=9a67f36b25';

const answer = ({ b, t, s }) => s;
const mistakes = [
  { id: "mixed", label: "다른 모양까지 세기", say: "{otherName}까지 세어 {value}개가 나왔습니다. {otherName:은/는} 제외하고 {shapeName}만 세면 {s}개입니다.", value: ({ b, t, s }) => s + t },
  ...countingErrors(answer, 1, '{shapeName}').map(m => ({...m, say: '{shapeName} 하나를 {countVerb} {value}개가 나왔습니다. {countFix} {shapeName}만 세면 {answer}개입니다.'})),
  {id:'miss-two',label:'{shapeName} 두 개 빠뜨리기',value:({s})=>s-2,say:'{shapeName} 두 개를 빠뜨려 {value:을/를} 골랐습니다. 빠뜨린 두 개까지 같은 모양만 세면 {answer}개입니다.'},
];

export default {
  id: 'g1.shapesclock.count', grade: 1, unit: 'g1s2-shapes-clock', strand: 'shape', level: 2,
  std: ["[2수03-04]"],
  label: "모양 세기", input: 'choice', answerKind: 'int', maxDigits: 1,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  texts: ["{shapeName:은/는} 몇 개일까요?"],
  // 세는 모양은 1~6개이고 채움 보기도 1~6이다. 전엔 2~5개라 0·1·6이 늘 오답으로만 나와 지우고 찍었다(검수 2번).
  // 세는 수는 1~6을 고르게 뽑고, 하나뿐일 때만 더 세는 실수로 둔다(0이 나오지 않게).
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const s = rng.int(1, 6), b = rng.int(1, Math.min(5, 8 - s)), t = rng.int(1, Math.min(5, 9 - b - s)),type=rng.pick(FLAT),others=FLAT.filter(x=>x!==type);
      return b+t+s<=9?{b,t,s,type,shapeName:NAMES[type],otherName:NAMES[others[1]],otherNames:others.map(x=>NAMES[x]).join('와 '),pieces:mixPieces(rng,{[type]:s,[others[0]]:b,[others[1]]:t})}:null;
    }, answer, mistakes, this.range, { candidates: [1, 2, 3, 4, 5, 6], directionFor: ({ s }) => s <= 1 ? 1 : rng.pick([-1, -1, 1]) });
  }, v => [flatFeature[v.type], v.shapeName + '만 하나씩 세면 ' + v.s + '개입니다.']),
  answer,
  check: ({ b, t, s }) => countSum(s),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ b, t, s }) => countSum(s))(vars),
  mistakes,
  art: ({ pieces }) => ({ kind: 'objects', items: pieces }),
  solution: "{process}\n따라서 {shapeName:은/는} {answer}개입니다.",
};
