import {define,meta,frac,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','subtract',1,'calc',['01-15'],'진분수의 뺄셈'),{
  input:'number',answerKind:'fraction',mixedInput:true,errorCount:2,
  texts:['〔{left} − {right} = ?〕계산하면 얼마일까요?'],
  draw(rng){const d=rng.int(3,12),a=rng.int(2,d-1),b=rng.int(1,a-1);return {a,b,d,left:frac(0,a,d),right:frac(0,b,d),...errors(wrong(frac(0,a+b,d),'빼지 않고 더하기',`분자끼리 더해 ${frac(0,a+b,d)}을 썼습니다. 분자끼리 빼면 ${a} − ${b} = ${a-b}이므로 ${frac(0,a-b,d)}입니다.`),wrong(String(a-b),'분모 빠뜨리기','분자끼리 뺀 {difference}만 썼습니다. 분모 {d:을/를} 그대로 쓰면 {answer}입니다.')),difference:a-b};},
  answer:({a,b,d})=>frac(0,a-b,d),check:({a,b,d})=>frac(0,Number(BigInt(a)-BigInt(b)),d),
  solution: "분모 {d:은/는} 그대로 두고 분자끼리 빼면 {a} − {b} = {difference}입니다.\n따라서 {left} − {right} = {answer}입니다.",
});
