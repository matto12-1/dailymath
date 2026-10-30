import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';
import { cycle } from './arithmetic-helpers.js?v=9a67f36b25';

export default define({ id: 'g3.div1.quotient', unit: 'g3s1-div', strand: 'calc', level: 3, label: '곱셈구구 안의 나눗셈', std: ['[4수01-06]'] }, {
  input: 'number', errorCount: 2, maxDigits: 1, range: { min: 0, max: 81 }, answerSpan: seq(2, 9), back: 'g2s2-times',
  texts: ['{question}'],
  draw(rng) {
    const q = cycle(rng, 'div1-quotient', seq(2, 9)), d = rng.pick(seq(2, 9).filter(n => n !== q && n !== q - 1)), a = d * q, multiply=rng.pick([true,false]);
    return { a, d, q, resultName:multiply?"□ 안에 알맞은 수":"몫",factor1:multiply?q:d,factor2:multiply?d:q,question:multiply?`〔□ × ${d} = ${a}〕□에 알맞은 수는 얼마일까요?`:`〔${a} ÷ ${d} = ?〕몫은 얼마일까요?`, ...errors(
      wrong(q - 1, '앞 곱셈구구의 몫 쓰기', `${q-1}을 썼지만 ${q-1} × ${d} = ${d*(q-1)}이므로 ${a}이 되지 않습니다. ${q} × ${d} = ${a}이므로 알맞은 수는 ${q}입니다.`),
      wrong(d, multiply?'곱하는 수를 그대로 쓰기':'나누는 수를 답하기', multiply?`곱하는 수 ${d}를 그대로 썼습니다. ${q} × ${d} = ${a}이므로 □ 안에 알맞은 수는 ${q}입니다.`:`몫 대신 나누는 수 ${d}를 썼습니다. ${d} × ${q} = ${a}이므로 ${a} ÷ ${d}의 몫은 ${q}입니다.`)) };
  },
  answer: ({ a, d }) => a / d, check: ({ a, d }) => seq(2, 9).find(n => n * d === a),
  solution:"{factor1} × {factor2} = {a}입니다.\n따라서 {resultName:은/는} {q:입니다}.",
});
