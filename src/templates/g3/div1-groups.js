import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';
import { cycle } from './arithmetic-helpers.js?v=9a67f36b25';

export default define({ id: 'g3.div1.groups', unit: 'g3s1-div', strand: 'word', level: 2, label: '몇 개씩 담아 나누기', std: ['[4수01-05]', '[4수01-06]'] }, {
  input: 'number', errorCount: 3, maxDigits: 2, range: { min: 0, max: 81 }, answerSpan: seq(2, 9), answerUnit: '봉지',
  texts: ['{item} {a}개를 한 봉지에 {d}개씩 담습니다. 모두 몇 봉지가 될까요?', '{item} {a}개를 한 봉지에 {d}개씩 담습니다. 모두 몇 봉지가 될까요?'],
  draw(rng) {
    const q = cycle(rng, 'div1-groups', seq(2, 9)), d = rng.pick(seq(2, 9).filter(n => n !== q && n !== q - 1)), a = d * q;
    // 검수 B-18: 실수 말의 물건 이름은 문제와 같게, 답−1 채움은 실제로 하는 실수(한 번만 덜어 내기)로 바꾼다.
    const item = rng.pick(['사탕', '젤리', '초콜릿']);
    return { a, d, q, item, ...errors(
      wrong(d, '한 봉지 개수를 답하기', `봉지 수 대신 한 봉지에 담는 ${d}개를 썼습니다. ${a}개를 ${d}개씩 담으면 ${a} ÷ ${d} = ${q}이므로 ${q}봉지입니다.`),
      wrong(a - d, '한 번만 덜어 내기', `${a}에서 ${d}를 한 번만 빼서 ${a-d}라고 했습니다. ${d}개씩 ${q}번 덜어 내면 0이 되므로 봉지는 ${q}봉지입니다.`),
      wrong(a, '전체 개수를 답하기', `봉지 수 대신 ${item} 전체 개수 ${a}를 썼습니다. 한 봉지에 ${d}개씩 ${q}봉지에 담으면 ${d} × ${q} = ${a}이므로 ${q}봉지입니다.`)) };
  },
  answer: ({ a, d }) => a / d, check: ({ a, d }) => seq(2, 9).find(n => n * d === a),
  art: () => ({ scene: 'candy-bags' }),
  solution: '{a} ÷ {d} = {q}입니다.\n따라서 모두 {q}봉지입니다.',
});
