import { define, sum, product, errors, wrong } from './helpers.js?v=9a67f36b25';
import { bank } from './arithmetic-helpers.js?v=9a67f36b25';

const pool=bank(2,9,11,998,(d,packed)=>{
  const q=Math.floor(packed/10),r=packed%10;
  return r>=1&&r<d&&q<=99&&d*q!==d+q+r&&d*q+r!==d+q+r;
},(d,packed)=>d*Math.floor(packed/10)+packed%10);

export default define({ id:'g3.div2.check', unit:'g3s2-div', strand:'calc', level:2, label:'나눗셈 확인하기', std:['[4수01-05]','[4수01-06]'] }, {
  input:'number', range:{min:0,max:999}, errorCount:2, answerSpan:pool.answers,
  // 교과서 검산 꼴 한 줄로만 낸다(검수 A2-25). 「나누는 수 / 몫 / 나머지」 세 줄은 식이 아니라 목록처럼 보였다.
  texts:['〔□ ÷ {d} = {q} ··· {r}〕□에 알맞은 수는 얼마일까요?', '〔□ ÷ {d} = {q} ··· {r}〕나누어지는 수는 얼마일까요?'],
  draw(rng){const {a:d,b:packed}=pool.draw(rng),q=Math.floor(packed/10),r=packed%10;return {d,q,r,multiplied:d*q,...errors(
    wrong(d*q,'나머지 더하기 빼먹기',`${d} × ${q} = ${d*q}만 쓰고 나머지 ${r}을 더하지 않았습니다. 곱 ${d*q}에 나머지 ${r}을 더하면 나누어지는 수는 ${d*q+r}입니다.`),
    wrong(d+q+r,'곱 대신 더하기',`나누는 수와 몫을 곱하지 않고 ${d} + ${q} + ${r} = ${d+q+r}로 계산했습니다. ${d} × ${q} = ${d*q}에 ${r}을 더하면 나누어지는 수는 ${d*q+r}입니다.`))};},
  answer:({d,q,r})=>d*q+r, check:({d,q,r})=>sum(product(d,q),r),
  solution:'나누는 수와 몫의 곱에 나머지를 더하면 나누어지는 수가 됩니다.\n{d} × {q} = {multiplied}, {multiplied} + {r} = {answer}입니다.\n따라서 나누어지는 수는 {answer:입니다}.',
});
