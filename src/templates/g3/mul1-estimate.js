import { define, seq, wrong, errors, rankedOptions } from './helpers.js?v=9a67f36b25';
import { bank, roundedTen, closest , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

// 정답은 가까운 몇십과 곱하는 수의 곱이다. 몇십 보기 안에 반대쪽 어림과 구구단 실수를 둘 이상 넣는다.
// 실제 곱의 절반 아래·1.6배 위와, 실제 곱에 정답만큼 가까운 수는 뺀다.
function setup(a, b) {
  const r = roundedTen(a), answer = r * b, actual = a * b, other = a > r ? r + 10 : r - 10;
  const fits = n => n >= 10 && n <= 999 && n >= actual / 2 && n <= 1.6 * actual && String(n).length === String(answer).length && Math.abs(actual - n) > Math.abs(actual - answer) + 4;
  const e = a > r
    ? wrong(other * b, '큰 십으로 어림하기', `${a}을 ${other}으로 어림하여 ${other*b}을 골랐습니다. ${a}은 ${r}에 더 가까우므로 ${r} × ${b} = ${answer}에 가장 가깝습니다.`)
    : wrong(other * b, '일의 자리 버리기', `${a}을 ${other}으로 어림하여 ${other*b}을 골랐습니다. ${a}은 ${r}에 더 가까우므로 ${r} × ${b} = ${answer}에 가장 가깝습니다.`);
  const es=[e,wrong(r*(b-1),'곱하는 수보다 한 번 덜 더하기',`${r}을 ${b-1}번만 더해 ${r*(b-1)}을 골랐습니다. ${a}을 ${r}으로 어림한 뒤 ${b}번 더하면 ${r} × ${b} = ${answer}입니다.`),wrong(r*(b+1),'곱하는 수보다 한 번 더 더하기',`${r}을 ${b+1}번 더해 ${r*(b+1)}을 골랐습니다. ${a}은 ${r}에 가까우며 ${r}을 ${b}번 더한 값은 ${answer}입니다.`)].filter(e=>fits(e.value));
  return { r, answer, actual, es, near: seq(-3, 3).filter(k => k).map(k => (r + 10 * k) * b).filter(fits) };
}
// 일의 자리가 5인 수는 어느 몇십에 가까운지 갈리므로 뺀다.
function valid(a, b) {
  if (a % 10 === 0 || a % 10 === 5) return false;
  const s = setup(a, b);
  return Math.abs(s.actual - s.answer) <= 9 && new Set(s.es.map(e=>e.value)).size >= 2 && s.near.length >= 3;
}
const pool = bank(11, 99, 2, 9, valid, (a, b) => roundedTen(a) * b);
export default define({ id: 'g3.mul1.estimate', unit: 'g3s1-multiplication', strand: 'estimate', level: 4, label: '두 자리 곱셈 어림', std: ['[4수01-08]'] }, {
  errorCount: 3, maxDigits: 3, range: { min: 0, max: 999 }, operandRange: { min: 0, max: 999 }, answerSpan: pool.answers,
  texts: ['〔{a} × {b}〕계산한 값은 어느 수에 가장 가까울까요?'],
  draw(rng) {
    const { a, b } = pool.draw(rng), s = setup(a, b), options = rankedOptions(rng, s.answer, s.es.map(e=>e.value), s.near,4,2);
    if (!options) return null;
    return { a, b, actual: s.actual, rounded: s.r, options, ...errors(...s.es) };
  },
  answer: ({ a, b }) => roundedTen(a) * b,
  check: ({ a, b }) => (Math.floor(a / 10) + Number(a % 10 >= 5)) * 10 * b,
  isCorrect: (v, c) => closest(v, c, v.a * v.b),
  solution: '{a:을/를} 약 {rounded:으로/로} 어림하면 {rounded} × {b} = {answer}입니다.\n따라서 실제 곱 {actual:과/와} 가장 가까운 보기는 {answer:입니다}.',
});
