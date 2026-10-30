import { countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b }) => a + b;
const mistakes = [
  {id:'received-operation',label:'{operationLabel}',say:'{operationAction} {value:이/가} 나왔습니다. 처음 사탕과 받은 사탕을 각각 한 번씩만 더하면 {answer}입니다.',value:({a,b,showSub,repeatInitial})=>showSub?a-b:a+b+(repeatInitial?a:b)},
  { id:'start-included',label:'이어 세기에서 처음 수도 세기',say:'이어 셀 때 {a}부터 다시 세어 {value:이/가} 나왔습니다. 처음의 {a}개 다음부터 받은 {b}개만 빠짐없이 세면 {answer}입니다.',value:({a,b})=>a+b-1 },
  { id:'extra-step',label:'이어 세기에서 한 번 더 세기',say:'이어 셀 때 하나를 더 세어 {value:이/가} 나왔습니다. 받은 사탕은 {b}개이므로 처음 수에서 {b}번만 이어 세면 {answer}입니다.',value:({a,b})=>a+b+1 },
];

export default {
  id: 'g1.addsub1.receive', grade: 1, unit: 'g1s1-addsub', strand: 'word', level: 3,
  std: ["[2수01-05]"],
  label: "사탕 더 받기", input: 'choice', answerKind: 'int', maxDigits: 1,
  range: { min: 0, max: 9 }, operandRange: { min: -2, max: 100 },
  answerSpan: [3,4,5,6,7,8,9],
  texts: ["사탕이 {a}개 있었는데 {b}개를 더 받았습니다. 사탕은 모두 몇 개일까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const a = rng.int(2, 7), b = rng.int(1, a - 1); return a + b <= 9 ? (()=>{const showSub=rng.pick([true,false,false]),repeatInitial=rng.pick([true,false]),repeated=repeatInitial?'처음 사탕':'받은 사탕';return {a,b,showSub,repeatInitial,operationLabel:showSub?'받은 수 빼기':repeated+' 두 번 더하기',operationAction:showSub?'받은 사탕을 빼서':repeated+'을 두 번 더해서'};})() : null;
    // 합은 9까지다. 받은 수 빼기와 처음·받은 사탕을 중복해서 더하기를 섞는다.
    // 전엔 합이 8까지라 9가, 빼기 실수와 채움으로 1·2가 늘 오답으로만 나와 지우고 찍었다(검수 2번).
    }, answer, mistakes, this.range, { candidates: [3, 4, 5, 6, 7, 8, 9], edgeWeight: 3, directionFor: () => rng.pick([-1, 1, 1]) });
  },
  answer,
  check: ({ a, b }) => countSum(a, b),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b }) => countSum(a, b))(vars),
  mistakes,
  art: () => ({ scene: 'candy-receive' }),
  solution: "더 받았으므로 더합니다.\n{a} + {b} = {answer}입니다.\n따라서 사탕은 모두 {answer}개입니다.",
};
