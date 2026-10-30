import { define, product, wrong, errors } from './helpers.js?v=9a67f36b25';
import { bank , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

const pool = bank(11, 99, 2, 9, (a, b) => a % 10 * b >= 10, (a, b) => a * b);
export default define({ id: 'g3.mul1.story', unit: 'g3s1-multiplication', strand: 'word', level: 4, label: '상자에 든 빵 곱셈 이야기', std: ['[4수01-04]'] }, {
  input: 'number', errorCount: 2, maxDigits: 3, range: { min: 0, max: 999 }, answerSpan: pool.answers, back: 'g2s1-addsub', answerUnit: '개',
  texts: ["{item:이/가} {a}개씩 든 상자가 {b}개 있습니다. {item:은/는} 모두 몇 개일까요?","{item:이/가} {a}개씩 든 상자가 {b}개 있습니다. {item:은/는} 모두 몇 개일까요?"],
  draw(rng) {
    const { a, b } = pool.draw(rng), item = rng.pick(['빵', '단팥빵', '크림빵']), ones = a % 10 * b, carry = Math.floor(ones / 10);
    return { a, b, item, ...errors(
      wrong(a * b - 10 * carry, '일의 자리 받아올림 빠뜨리기', `일의 자리 곱 ${ones}에서 십의 자리로 받아올린 ${Math.floor(ones/10)}을 더하지 않아 ${a*b-10*Math.floor(ones/10)}이 되었습니다. ${multiplicationAt(a,b,1)}`),
      a * b - 10 * carry === Math.floor(a / 10) * 10 + a % 10 * b
        ? wrong(a + b, '곱셈 대신 덧셈하기', `한 상자의 개수와 상자 수를 더하여 ${a+b}개라고 했습니다. ${a}개씩 ${b}상자이므로 ${a} × ${b} = ${a*b}개입니다.`)
        : wrong(Math.floor(a / 10) * 10 + a % 10 * b, '십의 자리에 곱하기 빠뜨리기', `일의 자리에만 ${b}를 곱하여 ${Math.floor(a/10)*10+a%10*b}개라고 했습니다. 십의 자리에도 ${b}를 곱하면 ${a} × ${b} = ${a*b}개입니다.`)) };
  },
  answer: ({ a, b }) => a * b, check: ({ a, b }) => product(a, b),
  art: () => ({ scene: 'bread-boxes' }),
  solution: '{a}개씩 {b}상자이므로 {a} × {b} = {answer}입니다.\n따라서 {item:은/는} 모두 {answer}개입니다.',
});
