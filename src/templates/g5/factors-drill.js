// 최대공약수와 최소공배수를 구하는 훈련.
import { define, meta, gcd, lcm, divisors, seq, errors, wrong, fill } from './helpers.js?v=9a67f36b25';

export default define(meta('factors', 'drill', 3, 'calc', ['01-04', '01-05'], '최대공약수·최소공배수'), {
  input: 'number', speedBonus: true, maxDigits: 3, texts: ['{question}'],
  draw(rng) {
    const kind = rng.pick(['gcd', 'lcm']);
    let a,b;
    if(kind==='gcd'){
      const common=rng.int(3,12),pairs=[];
      for(let p=2;p<=Math.floor(60/common);p++)for(let q=2;q<=Math.floor(60/common);q++)if(p!==q&&gcd(p,q)===1)pairs.push([p,q]);
      const [p,q]=rng.pick(pairs);a=common*p;b=common*q;
    }else{
      // 최소공배수도 짝을 만들어 고른다: 공약수 × 서로소인 두 몫(둘 다 2 이상이라 한 수가 다른 수의 배수가 아니다), 두 수 15 이하 · 답 100 이하
      const pairs=[];
      for(let common=2;common<=7;common++)for(let p=2;p*common<=15;p++)for(let q=2;q*common<=15;q++)if(p!==q&&gcd(p,q)===1&&common*p*q<=100)pairs.push([common*p,common*q]);
      [a,b]=rng.pick(pairs);
    }
    const g = gcd(a, b), L = lcm(a, b);
    if (a === b || g < 2 || (kind === 'lcm' && (L > 100 || L === Math.max(a, b)))) return null;
    const common = divisors(g).join(', '), explanation = fill(kind === 'gcd' ? '{a}의 약수는 {left:입니다}.\n{b}의 약수는 {right:입니다}.\n두 수의 공약수는 {common:입니다}.'
      : '두 수의 최대공약수는 {g:입니다}.\n{a} ÷ {g} = {p}, {b} ÷ {g} = {q}이므로 {g} × {p} × {q} = {L:입니다}.', { a, b, g, L, common, left:divisors(a).join(', '),right:divisors(b).join(', '),p: a / g, q: b / g });
    return { a, b, kind, g, L, p: a / g, q: b / g, common, explanation,asked:kind==='gcd'?'최대공약수':'최소공배수', question: fill(kind === 'gcd' ? '〔{a:과/와} {b}〕두 수의 최대공약수는 무엇일까요?' : '〔{a:과/와} {b}〕두 수의 최소공배수는 무엇일까요?', { a, b }), ...errors(
      wrong(kind === 'gcd' ? L : g, '최대공약수와 최소공배수 혼동', kind==='gcd'?'최대공약수 대신 최소공배수 {L:을/를} 구했습니다. 두 수의 공약수 {common} 중 가장 큰 수는 {answer:입니다}.':'최소공배수 대신 최대공약수 {g:을/를} 구했습니다. {a} ÷ {g}와 {b} ÷ {g}의 몫에 {g:을/를} 곱하면 최소공배수는 {answer:입니다}.'),
      kind === 'gcd' ? wrong(1, '작은 공약수에서 멈추기', '공약수 중 가장 작은 수 1을 답했습니다. 1에서 멈추지 않고 공약수 {common} 중 가장 큰 수를 찾으면 {answer:입니다}.')
        : wrong(a * b, '공약수를 생각하지 않고 곱하기', '공약수를 생각하지 않고 {a} × {b}만 계산했습니다. 두 수를 최대공약수 {g:으로/로} 나눈 몫 {p}, {q:과/와} 최대공약수 {g:을/를} 곱하면 {g} × {p} × {q} = {answer:입니다}.')) };
  },
  answer: ({ a, b, kind }) => kind === 'gcd' ? gcd(a, b) : lcm(a, b),
  check: ({ a, b, kind }) => kind === 'gcd' ? divisors(a).filter((n) => b % n === 0).at(-1) : seq(1, b).map((n) => a * n).find((n) => n % b === 0),
  solution: '{explanation}\n따라서 {a:과/와} {b}의 {asked:은/는} {answer:입니다}.',
});
