import { remainingMistake, countingErrors, numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ a, b, c }) => a + b + c;
const mistakes = [
  {id:'only-ten',label:'{firstLabel}',say:'{firstAction} {value:이/가} 나왔습니다. 10 다음부터 남은 {rest}개만 정확히 세면 {answer}입니다.',value:({rest,showTen,offset})=>showTen?10:10+rest+offset},
  { id:'start-included',label:'10을 다시 세며 이어 세기',say:'10을 만든 뒤 10부터 다시 세어 {value:이/가} 나왔습니다. 11부터 남은 사탕 {rest}개를 이어 세면 {answer}입니다.',value:({rest})=>10+rest-1 },
  { id:'extra-step',label:'이어 세기에서 한 번 더 세기',say:'10에서 이어 셀 때 하나를 더 세어 {value:이/가} 나왔습니다. 남은 {rest}개만 한 번씩 모아 10에 더하면 {answer}입니다.',value:({rest})=>10+rest+1 },
];

export default {
  id: 'g1.addsub2.story', grade: 1, unit: 'g1s2-addsub-one', strand: 'word', level: 3,
  std: ["[2수01-05]","[2수01-08]"],
  label: "세 번 모은 사탕", input: 'choice', answerKind: 'int', maxDigits: 2,
  range: { min: 0, max: 19 }, operandRange: { min: -2, max: 100 },
  answerSpan: [11,12,13,14,15,16,17,18],
  texts: ["사탕이 {a}개 있었습니다. 사탕을 {b}개 받고, 또 {c}개를 받았습니다. 사탕은 모두 몇 개일까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const x = rng.int(1, 9), rest = rng.int(1, 8), pairAt = rng.int(0, 2); const nums = pairAt === 0 ? [x, 10 - x, rest] : pairAt === 1 ? [x, rest, 10 - x] : [rest, x, 10 - x]; // 「10만 더하기」 실수(늘 10)는 열 문제 중 셋에만 낸다. 늘 내면 10이 60%로 붙박이 오답이 되어 10부터 지웠다(검수 2번).
      const [a, b, c] = nums; return { a, b, c, rest, pairAt,pairX:x,pairY:10-x, ...remainingMistake(rng) };
      // 채움 보기도 답이 될 수 있는 11~18이다(검수 2번).
    }, answer, mistakes, this.range, { edgeWeight: 6, candidates: [11, 12, 13, 14, 15, 16, 17, 18] });
  },
  answer,
  check: ({ a, b, c }) => countSum(a, b, c),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ a, b, c }) => countSum(a, b, c))(vars),
  mistakes,
  art: () => ({ scene: 'candy-receive' }),
  solution: "{pairX}개와 {pairY}개를 모아 10개를 만듭니다.\n10개에 남은 {rest}개를 더하면 10 + {rest} = {answer}입니다.\n따라서 사탕은 모두 {answer}개입니다.",
};
