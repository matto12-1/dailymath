import { explain, say, count } from '../solution-process.js?v=9a67f36b25';
import { numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';
import { countFrom } from './helpers.js?v=9a67f36b25';

const answer = ({ t, o }) => 10 * t + o;
const mistakes = [
 {id:'reverse',label:'묶음과 낱개 뒤바꾸기',value:({t,o})=>10*o+t,say:'묶음 수와 낱개 수를 바꾸어 {value:이/가} 나왔습니다. 10개씩 묶음 {t}개에서 낱개 {o}개를 이어 세면 {answer}입니다.'},
 {id:'bundle',label:'묶음 하나 달리 세기',value:({t,o,bundleDelta})=>10*(t+bundleDelta)+o,say:'10개씩 묶음을 하나 {bundleAction} 세어 {value:이/가} 나왔습니다. 묶음을 {t}개로 맞추고 {onesCountWords} {answer}입니다.'},
 {id:'one',label:'낱개 하나 달리 세기',value:({t,o,oneDelta})=>10*t+o+oneDelta,say:'낱개를 하나 {oneAction} 세어 {value:이/가} 나왔습니다. 묶음은 그대로 두고 {onesReadWords} {answer}입니다.'},
];

export default {
  id: 'g1.fifty.bundles', grade: 1, unit: 'g1s1-numbers-fifty', strand: 'calc', level: 2,
  std: ["[2수01-01]"],
  label: "50까지 묶음과 낱개", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 50 }, operandRange: { min: -2, max: 100 },
  answerSpan: {min:10,max:50},
  texts: ["10개씩 묶음이 {t}개, {onesDescription} 모두 몇 개일까요?"],
  make: explain(function(rng) {
    return numberVars(rng, () => {
      const n=rng.int(10,50),t=Math.floor(n/10),o=n%10,bundleDelta=rng.pick([-1,1]),oneDelta=rng.pick([-1,1]); return {t,o,onesCountWords:o?'낱개 '+o+'개를 모으면':'더할 낱개가 없으므로',onesReadWords:o?'낱개를 '+o+'개로 세면':'낱개가 없음을 확인하면',onesDescription:o?"낱개가 "+o+"개 있습니다.":"낱개는 없습니다.",bundleDelta,oneDelta,bundleAction:bundleDelta>0?'더':'덜',oneAction:oneDelta>0?'더':'덜'};
    }, answer, mistakes, this.range);
  }, v => [v.o?'10개씩 묶음 '+v.t+'개는 '+v.t*10+'개입니다.':'10개씩 묶음 '+v.t+'개만 있습니다.', ...(v.o?[ (v.t*10) + ' 다음부터 낱개 ' + v.o + '개를 ' + countFrom(v.t*10,v.o) + ' 하고 이어 셉니다.']:['낱개는 없습니다.'])]),
  answer,
  check: ({ t, o }) => countSum(...Array(t).fill(10), o),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ t, o }) => countSum(...Array(t).fill(10), o))(vars),
  mistakes,
  art: ({ t, o }) => ({ kind: 'blocks', tens: t, ones: o }),
  solution: "{process}\n따라서 모두 {answer}개입니다.",
};
