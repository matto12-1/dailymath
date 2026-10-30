import { numberVars, options } from './helpers.js?v=9a67f36b25';

const answer = ({ n }) => n;
const mistakes = [
  { id: 'crossed-too', label: '지운 점까지 세기', value: ({ a }) => a, say: '지운 점까지 세어 {value}개가 나왔습니다. {remainingFact}' },
  { id: 'empty-cells', label: '점 대신 빈칸 세기', value: ({ a }) => 10 - a, say: '점 대신 빈칸을 세어 {value}개가 나왔습니다. {emptyFact}' },
  { id:'all-gone',label:'모두 지운 것으로 보기',value:()=>0,say:'지운 표시를 보고 남은 점까지 모두 없어졌다고 생각했습니다. 지우지 않은 점만 하나씩 세면 {answer}개입니다.' },
];
export default {
  id: 'g1.nine.zero', grade: 1, unit: 'g1s1-numbers-nine', strand: 'calc', level: 2,
  std: ['[2수01-01]'], label: '0과 9까지 점 세기', input: 'choice', answerKind: 'int', maxDigits: 1,
  range: { min: 0, max: 9 }, answerSpan: { min: 0, max: 8 },
  texts: ['지우지 않은 점은 몇 개일까요?'],
  make(rng) {
    return numberVars(rng, () => {
      const n = rng.next()<1/3?0:rng.int(1,8), a = rng.int(n+1, 9);
      return {n,a,emptyFact:n===0?'빈칸 수와 관계없이 모든 점을 지웠으므로 0입니다.':`빈칸이 아니라 지우지 않은 점만 세면 ${n}개입니다.`,remainingFact:n===0?'모든 점을 지웠으므로 남은 점의 수는 0입니다.':`지운 점을 빼고 남은 점을 하나씩 세면 ${n}개입니다.`,explanation:n===0?'남은 점이 없습니다.\n따라서 답은 0입니다.':`지우지 않은 점을 하나씩 세면 ${n}개입니다.\n따라서 답은 ${n}입니다.` };
    }, answer, mistakes, this.range,{requiredChoices:({n})=>n?[0]:[]});
  },
  answer, check: ({ a, n }) => a - (a - n), choices: options,
  isCorrect: ({ n }, c) => c === n, mistakes,
  art: ({ n, a }) => ({ kind: 'tenframe', n: a, crossed: a - n }),
  solution: '{explanation}',
};
