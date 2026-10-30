import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors, until } from './helpers.js?v=9a67f36b25';

const quotient = p => p.a / p.d;
const meets = (v, p) => v.greater ? quotient(p) > v.k : quotient(p) < v.k;
const expr = p => `${p.a} ÷ ${p.d}`;
const line = ps => ps.map(p => expr(p) + ' = ' + say(quotient(p))).join(' ');
const make = (rng, qs, extra = {}) => { const q = rng.pick(qs), d = rng.int(2, 9); return { a: d * q, d, ...extra }; };
// 보기 단추에 식 넷을 그대로 담고 식을 고른다. 글에 「1번 27 ÷ 9 …」로 늘어놓고 번호로 받지 않는다(10-20 Matto 「다른 문제집이나 어플들 레퍼런스좀 참고해」).
// 검수 A2-4: 「÷ 9」가 늘 오답이던 함정을 바꾼다. 함정은 작은 몫을 물으면 나누는 수가 가장 큰 식, 큰 몫을 물으면 나누어지는 수가 가장 큰 식이고,
// 네 번에 한 번은 함정 없이 그 자리에 정답이 온다(가장 큰 수만 보고 지우면 맞힘이 아무거나와 같다). 몫이 기준 수와 같은 식을 늘 하나 둔다.
export default define({ id: 'g3.div1.estimate', unit: 'g3s1-div', strand: 'estimate', level: 3, label: '몫의 크기 어림하기', std: ['[4수01-08]'] }, {
  answerKind: 'text', choiceBox:true, errorCount: 3, operandRange: { min: 0, max: 81 },
  texts: ["〔몫 {sign} {k}〕몫이 {k}보다 {word} 식을 고르시오."],
  draw: explain(function(rng) {
    const greater = rng.pick([false, true]), word = greater ? '큰' : '작은', sign = greater ? '>' : '<';
    // 「작은 몫이면 나누어지는 수가 가장 작은 식」, 「큰 몫이면 나누는 수가 가장 작은 식」도 계산 없이 찍는 길이라 같은 방법으로 막는다.
    const size = greater ? p => p.a : p => p.d, small = greater ? p => -p.d : p => -p.a, trapped = rng.next() < 0.75, smallWrong = rng.next() < 0.75;
    const alone = (items, holder, f) => items.every(p => p === holder || f(p) < f(holder));
    // 함정을 넣을지는 한 번만 정하고 기준 수와 식만 다시 뽑는다(다시 뽑기가 쉬운 쪽으로 쏠리지 않게). 큰 몫 8처럼 안 되는 묶음도 있다.
    const { k, right, equal, others, trap, items } = until(() => {
      const k = rng.int(3, 8), rightQs = greater ? seq(k + 1, 9) : seq(2, k - 1), wrongQs = greater ? seq(2, k - 1) : seq(k + 1, 9);
      const right = make(rng, rightQs, { right: true }), equal = make(rng, [k], { equal: true });
      const others = Array.from({ length: trapped ? 1 : 2 }, () => make(rng, wrongQs));
      const trap = trapped ? make(rng, wrongQs, { trap: true }) : null;
      const items = [right, equal, ...others, ...(trap ? [trap] : [])];
      if (new Set(items.map(expr)).size !== 4) return null;
      // 함정(없으면 정답)이 혼자 가장 큰 수를 가진다. 가장 작은 수는 네 번에 세 번 오답, 한 번 정답이 혼자 가진다.
      if (!alone(items, trap ?? right, size)) return null;
      const smallest = items.find(p => alone(items, p, small));
      return smallest && (smallest === right) !== smallWrong ? { k, right, equal, others, trap, items } : null;
    }, 100000);
    const shuffled = rng.shuffle(items);
    return { greater, k, word, sign, items: shuffled, options: shuffled.map(expr), ...errors(
      wrong(expr(others[0]), '몫 크기를 반대로 비교하기', `${expr(others[0])}을 골랐지만 몫은 ${quotient(others[0])}이므로 ${k}보다 ${greater?"작습니다":"큽니다"}. ${expr(right)} = ${quotient(right)}이므로 몫이 ${k}보다 ${word} 식은 ${expr(right)}입니다.`),
      trap ? wrong(expr(trap), greater ? '나누어지는 수만 보고 고르기' : '나누는 수만 보고 고르기',
        `${greater?"나누어지는 수":"나누는 수"}만 보고 ${expr(trap)}을 골랐습니다. ${expr(trap)}의 몫은 ${quotient(trap)}이고 ${expr(right)}의 몫은 ${quotient(right)}이므로 알맞은 식은 ${expr(right)}입니다.`) : null,
      wrong(expr(equal), '기준 수와 같은 몫 고르기', `${expr(equal)} = ${k}이므로 몫이 ${k}와 같아 ${k}보다 ${greater?"크지":"작지"} 않습니다. ${word} 몫 ${quotient(right)}이 나오는 식은 ${expr(right)}입니다.`)) };
  }, v => [line(v.items), '기준 몫은 ' + v.k + '이고, 같은 몫의 식은 ' + expr(v.items.find(p=>p.equal)) + '입니다.']),
  answer: v => expr(v.items.find(p => p.right)),
  check: v => expr(v.items.find(p => meets(v, p))),
  isCorrect: (v, c) => v.items.some(p => expr(p) === c && meets(v, p)),
  solution: '{process}\n따라서 몫이 {k}보다 {word} 식은 {answer:입니다}.',
});
