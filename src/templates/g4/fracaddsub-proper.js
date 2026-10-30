import {define,meta,frac,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','proper',1,'calc',['01-15'],'진분수의 덧셈'),{
  input:'number',answerKind:'fraction',mixedInput:true,errorCount:3,
  texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
  draw(rng){const d=rng.int(4,12),a=rng.int(1,d-2),b=rng.int(1,d-a-1);if(a===b)return null;return {a,b,d,left:frac(0,a,d),right:frac(0,b,d),...errors(wrong(frac(0,a+b,2*d),'분모도 더하기',`분모도 더해 ${frac(0,a+b,2*d)}을 썼습니다. 분모는 ${d} 그대로 두고 분자끼리 더하면 ${frac(0,a+b,d)}입니다.`),wrong(frac(0,Math.abs(a-b),d),'더하기를 빼기로 계산하기',`분자끼리 빼서 ${frac(0,Math.abs(a-b),d)}을 썼습니다. 분자끼리 더하면 ${a} + ${b} = ${a+b}이므로 ${frac(0,a+b,d)}입니다.`),
    // 검수 A2-17: 분모 빠뜨리기를 더한다.
    wrong(String(a+b),'분모 빠뜨리기','분자끼리 더한 {sum}만 썼습니다. 분모 {d:을/를} 그대로 쓰면 {answer}입니다.')),sum:a+b};},
  answer:({a,b,d})=>frac(0,a+b,d),check:({a,b,d})=>frac(0,Number(BigInt(a)+BigInt(b)),d),
  solution: "분모 {d:은/는} 그대로 두고 분자끼리 더하면 {a} + {b} = {sum}입니다.\n따라서 {left} + {right} = {answer}입니다.",
});
