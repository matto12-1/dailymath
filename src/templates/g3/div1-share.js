import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';
import { cycle } from './arithmetic-helpers.js?v=9a67f36b25';

export default define({ id: 'g3.div1.share', unit: 'g3s1-div', strand: 'word', level: 1, label: '똑같이 나누기', std: ['[4수01-05]'] }, {
  input: 'number', errorCount: 2, maxDigits: 2, range: { min: 0, max: 81 }, answerSpan: seq(2, 9), answerUnit: '개',
  texts: ["{item} {a}개를 {d}명이 똑같이 나누어 가집니다. 한 명이 가지는 {item:은/는} 몇 개일까요?"],
  draw(rng) {
    const q = cycle(rng, 'div1-share', seq(2, 9)), d = rng.pick(seq(2, 9).filter(n => n !== q)), a = d * q;
    return { a, d, q, item: rng.pick(['사탕', '초콜릿', '젤리']), ...errors(
      q === 2 ? wrong(a, '나누기 전 개수를 답하기', `${a}개를 ${d}명에게 나누지 않고 전체 개수 ${a}를 썼습니다. ${a}개를 ${d}명이 똑같이 나누면 ${a} ÷ ${d} = ${q}이므로 한 명이 ${q}개씩 가집니다.`)
        : wrong(a - d, '나누지 않고 빼기', `${a}에서 ${d}를 한 번만 빼서 ${a-d}를 썼습니다. ${d}개씩 ${q}번 덜어 내면 0이 되므로 ${a} ÷ ${d} = ${q}입니다.`),
      wrong(d, '사람 수를 답하기', `한 명이 가지는 개수 대신 사람 수 ${d}를 썼습니다. ${d}명이 ${q}개씩 가지면 ${d} × ${q} = ${a}이므로 한 명이 ${q}개씩 가집니다.`)) };
  },
  answer: ({ a, d }) => a / d, check: ({ a, d }) => seq(2, 9).find(n => n * d === a),
  art: () => ({ scene: 'candy-sharing' }),
  solution: "{a} ÷ {d} = {q}입니다.\n따라서 한 명이 가지는 {item:은/는} {q}개입니다.",
});
