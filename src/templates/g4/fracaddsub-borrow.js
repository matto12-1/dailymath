import {define,meta,frac,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','borrow',3,'calc',['01-15'],'받아내림 있는 대분수 뺄셈'),{
  input:'number',answerKind:'fraction',mixedInput:true,
  texts:['〔{left} − {right} = ?〕계산하면 얼마일까요?'],
  draw(rng){const d=rng.int(3,12),a=rng.int(1,d-2),b=rng.int(a+1,d-1),v=rng.int(1,3),w=v+rng.int(1,3);return {a,b,d,w,v,borrowWhole:w-1,whole:w-v-1,rest:d+a-b,one:frac(0,d,d),left:frac(w,a,d),right:frac(v,b,d),borrowed:d+a,borrowedLeft:`${w-1} ${d+a}/${d}`,...errors(wrong(frac(w-v,b-a,d),'자리마다 큰 수에서 작은 수 빼기',`분자끼리 거꾸로 빼서 ${frac(w-v,b-a,d)}을 썼습니다. ${frac(w,a,d)}을 ${w-1} ${d+a}/${d}로 바꾸어 빼면 ${frac(w-v-1,d+a-b,d)}입니다.`),wrong(frac(w-v,d+a-b,d),'받아내린 1을 자연수에서 빼지 않기',`1을 분수로 바꾸고도 자연수를 줄이지 않아 ${frac(w-v,d+a-b,d)}을 썼습니다. 자연수 부분은 ${w-1} − ${v} = ${w-v-1}이므로 ${frac(w-v-1,d+a-b,d)}입니다.`))};},
  answer:({a,b,d,w,v})=>frac(w-v-1,d+a-b,d),check:({a,b,d,w,v})=>frac(0,w*d+a-v*d-b,d),
  solution: "{a}/{d}에서 {b}/{d:을/를} 뺄 수 없으므로 자연수에서 1을 {one:으로/로} 바꾸면 {left} = {borrowedLeft}입니다.\n자연수 부분끼리 빼면 {borrowWhole} − {v} = {whole}, 분수 부분끼리 빼면 {borrowed}/{d} − {b}/{d} = {rest}/{d}입니다.\n따라서 {left} − {right} = {answer}입니다.",
});
