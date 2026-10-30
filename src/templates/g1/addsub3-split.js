import { numberVars, options, countSum, countBack } from './helpers.js?v=9a67f36b25';

const answer = ({ o }) => o;
const mistakes = [
  { id: "tens-digit", label: "10개씩 묶음의 수 답하기", say: "10개씩 묶음의 수 {t:을/를} 골랐습니다. {n:은/는} 10개씩 묶음 {t}개와 낱개 {o}개입니다.", value: ({ t }) => t },
  { id: "extra-one", label: "낱개 하나 더 세기", say: "낱개 하나를 더 세어 {value:이/가} 나왔습니다. 같은 낱개를 두 번 세지 않고 읽으면 {o}개입니다.", value: ({ o }) => o + 1 },
  { id: "miss-one", label: "낱개 하나 빠뜨리기", say: "낱개 하나를 빠뜨려 {value:이/가} 나왔습니다. 빠뜨린 낱개 하나까지 넣어 세면 {o}개입니다.", value: ({ o }) => o - 1 },
];

export default {
  id: 'g1.addsub3.split', grade: 1, unit: 'g1s2-addsub-two', strand: 'calc', level: 2,
  std: ["[2수01-04]"],
  label: "몇십몇 가르기", input: 'choice', answerKind: 'int', maxDigits: 2, speedBonus: true,
  range: { min: 0, max: 99 }, operandRange: { min: -2, max: 100 },
  answerSpan: [1,2,3,4,5,6,7,8,9],
  texts: ["{n:을/를} {ten:과/와} 몇으로 가를 수 있을까요?"],
  make(rng) {
    return numberVars(rng, () => {
      const t = rng.int(1, 9), o = rng.int(1, 9); return t !== o && t !== o + 1 ? { t, o, n: 10 * t + o, ten: 10 * t } : null;
    }, answer, mistakes, this.range, { edgeWeight: 2 });
  },
  // 1학년은 식 옆에 그림을 둔다: 더하면 빛깔이 다른 점, 빼면 지운 점(검수 9번).
  art: ({ t, o }) => ({ kind: 'blocks', tens: t, ones: o }),
  answer,
  check: ({ n, ten }) => countBack(n, ten),
  choices: options,
  isCorrect: (vars, choice) => choice === (({ n, ten }) => countBack(n, ten))(vars),
  mistakes,
  solution: "{n:은/는} 10개씩 묶음 {t}개와 낱개 {o}개입니다. 10개씩 묶음 {t}개는 {ten}입니다.\n따라서 {n:은/는} {ten:과/와} {answer:으로/로} 가를 수 있습니다.",
};
