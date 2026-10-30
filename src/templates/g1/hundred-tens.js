import { explain, say, count } from '../solution-process.js?v=9a67f36b25';
import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ t }) => 10 * t;
const mistakes = [
  { id: "miss-bundle", label: "10개씩 묶음 하나 빠뜨리기", say: "10개씩 묶음을 하나 덜 세어 {value:이/가} 나왔습니다. 10개씩 묶음 {t}개는 {answer}개입니다.", value: ({ t }) => 10 * (t - 1) },
  {id:'extra-bundle',label:'10개씩 묶음 하나 더 세기',value:({t})=>10*(t+1),say:'묶음 하나를 두 번 세어 {value:이/가} 나왔습니다. 10개씩 묶음 {t}개를 한 번씩만 세면 {answer}개입니다.'},
  {id:'two-bundles',label:'묶음 두 개 달리 세기',value:({t,twoDirection})=>10*(t+twoDirection*2),say:'묶음을 두 개 달리 세어 {value:이/가} 나왔습니다. 묶음을 {t}개로 정확히 세면 {answer}개입니다.'},
];

export default {
  id: 'g1.hundred.tens', grade: 1, unit: 'g1s2-numbers-hundred', strand: 'calc', level: 1,
  std: ["[2수01-01]"],
  label: "60부터 90까지 묶음 세기", input: 'choice', answerKind: 'int', maxDigits: 3, speedBonus: true,
  range: { min: 0, max: 100 }, operandRange: { min: -2, max: 100 },
  differentDigits: true,
  answerSpan: [60,70,80,90],
  texts: ["10개씩 묶음이 {t}개 있습니다. 모두 몇 개일까요?"],
  make: explain(function(rng) {
    return numberVars(rng, () => {
      return { t: rng.int(6, 9),tensRows:rng.pick([1,2]),twoDirection:rng.pick([-1,1]) };
    // 50과 100은 실수(묶음 덜·더 세기)로 자주 나오니 채움 보기로는 쓰지 않는다. 채움으로도 끼면 늘 오답인 보기가 30% 넘게 나왔다(검수 2번).
    // 묶음이 적으면 더 세는 실수로, 9묶음은 덜 세는 실수로 기울여 정답이 가장 작은·큰 보기인 문제가 고르게 나온다.
    }, answer, mistakes, this.range, { differentDigits: true, edgeWeight: 3, candidates: [10, 20, 30, 40, 60, 70, 80, 90], directionFor: ({ t }) => t <= 7 ? 1 : t >= 9 ? -1 : rng.pick([-1, 1]) });
  }, v => ['10개씩 묶음을 하나씩 세면 ' + count(v.t,10) + '입니다.']),
  answer,
  check: ({ t }) => countSum(...Array(t).fill(10)),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ t }) => countSum(...Array(t).fill(10)))(vars),
  mistakes,
  art: ({ t,tensRows }) => ({ kind: 'blocks', tens: t, ones: 0,tensRows }),
  solution: "{process}\n따라서 모두 {answer}개입니다.",
};
