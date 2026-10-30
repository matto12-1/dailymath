import { define, seq, wrong, errors, fill } from './helpers.js?v=9a67f36b25';
import { cycle } from './arithmetic-helpers.js?v=9a67f36b25';

export default define({ id: 'g3.div1.relation', unit: 'g3s1-div', strand: 'calc', level: 2, label: '곱셈과 나눗셈 관계', std: ['[4수01-05]', '[4수01-06]'] }, {
  input: 'number', errorCount: 2, maxDigits: 1, range: { min: 0, max: 81 }, answerSpan: seq(2, 9), back: 'g2s2-times',
  texts: ['{question}'],
  draw(rng) {
    const q = cycle(rng, 'div1-relation', seq(2, 9)), d = rng.pick(seq(2, 9).filter(n => n !== q && n !== q - 1)), a = d * q,missing=rng.pick([true,false]);
    return { a, d, q,resultName:missing?"□ 안에 알맞은 수":"몫",question:fill(missing?'〔{q} × {d} = {a}〕〔{a} ÷ □ = {d}〕곱셈식을 보면 □에 알맞은 수는 얼마일까요?':'〔{d} × {q} = {a}〕〔{a} ÷ {d} = ?〕곱셈식을 보고 나눗셈의 몫을 구하면 얼마일까요?',{a,d,q}), explanation:fill(missing?'{q} × {d} = {a}이므로 {a} ÷ {q} = {d:입니다}.':'{d} × {q} = {a}이므로 {a} ÷ {d} = {q:입니다}.',{a,d,q}), ...errors(
      wrong(d, '다른 곱하는 수를 답하기', `알맞은 수 대신 곱셈식의 ${d}를 썼습니다. ${q} × ${d} = ${a}이므로 ${missing?'□ 안에 알맞은 수는':'몫은'} ${q}입니다.`),
      wrong(q - 1, '앞 곱셈구구의 몫 쓰기', `${q-1}을 썼지만 ${d} × ${q-1} = ${d*(q-1)}이므로 ${a}이 되지 않습니다. ${d} × ${q} = ${a}이므로 알맞은 수는 ${q}입니다.`)) };
  },
  answer: ({ a, d }) => a / d, check: ({ a, d }) => seq(2, 9).find(n => n * d === a),
  solution: "{explanation}\n따라서 {resultName:은/는} {answer:입니다}.",
});
