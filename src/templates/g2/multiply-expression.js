import { define, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.multiply.expression","unit":"g2s1-multiplication","strand":"calc","level":3,"label":"곱셈식 고르기","std":["[2수01-10]"]}, {

  answerKind:'text',errorCount:3,texts:['{a}개씩 {b}묶음을 나타내는 곱셈식을 고르시오.'],
  draw(rng){const a=rng.int(2,9),b=rng.int(2,5),delta=rng.pick([-2,-1,1,2].filter(d=>b+d>=1&&b+d<=9)),one=rng.pick([-1,1].filter(d=>a+d>=2&&a+d<=9));
    if(a+one===b&&b+delta===a)return null;
    const slips=[wrong(`${a+one} × ${b}`,'한 묶음의 수 달리 읽기',`한 묶음에 ${a}개인데 ${a+one}개씩으로 나타낸 식을 골랐습니다. 묶음 수 ${b}는 그대로 두고 한 묶음의 수를 ${a}로 읽으면 ${a} × ${b}입니다.`),
      wrong(`${a} × ${b+delta}`,'묶음 수 달리 읽기',`${b}묶음인데 ${b+delta}묶음인 식을 골랐습니다. 한 묶음의 ${a}개를 ${b}번 모으는 식이므로 ${a} × ${b}입니다.`),
      wrong(`${a+one} × ${b+delta}`,'두 수 모두 달리 읽기',`${a+one} × ${b+delta}인 식을 골랐습니다. 한 묶음의 수 ${a}에 묶음 수 ${b}를 곱하는 식은 ${a} × ${b}입니다.`)];
    return {a,b,options:[`${a} × ${b}`,...slips.map(e=>e.value)],...errors(...slips)};},
  answer:({a,b})=>`${a} × ${b}`,
  check:({a,b})=>[a,'×',b].join(' '),
  isCorrect:({a,b},c)=>{const parts=c.split(' ');return parts[1]==='×'&&Number(parts[0])===a&&Number(parts[2])===b;},
  solution: "한 묶음에 {a}개씩 있고 묶음은 {b}개입니다.\n따라서 곱셈식은 {a} × {b}입니다.",
});
