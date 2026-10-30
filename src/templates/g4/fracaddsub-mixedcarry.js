import {define,meta,frac,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','mixedcarry',3,'calc',['01-15'],'받아올림 있는 대분수 덧셈'),{
  input:'number',answerKind:'fraction',mixedInput:true,
  texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
  draw(rng){const d=rng.int(3,12),a=rng.int(2,d-1),b=rng.int(d-a+1,d-1),w=rng.int(1,4),v=rng.int(1,4);return {a,b,d,w,v,whole:w+v,rest:a+b-d,carriedWhole:w+v+1,left:frac(w,a,d),right:frac(v,b,d),total:a+b,...errors(wrong(frac(w+v,a+b-d,d),'받아올린 자연수 빠뜨리기',`분수 부분에서 나온 1을 더하지 않아 ${frac(w+v,a+b-d,d)}을 썼습니다. 자연수 부분 ${w+v}에 1을 더하면 ${frac(w+v+1,a+b-d,d)}입니다.`),wrong(frac(w+v+1,a+b,d),'자연수만 1 올리고 분자는 그대로 두기',`자연수 부분에 1을 올리고도 분자를 그대로 두어 ${frac(w+v+1,a+b,d)}을 썼습니다. ${a+b}/${d}에서 1을 올리고 남은 분수는 ${a+b-d}/${d}이므로 ${frac(w+v+1,a+b-d,d)}입니다.`))};},
  answer:({a,b,d,w,v})=>frac(w+v+1,a+b-d,d),check:({a,b,d,w,v})=>frac(0,w*d+a+v*d+b,d),
  solution: "자연수 부분끼리 더하면 {w} + {v} = {whole}, 분수 부분끼리 더하면 {a}/{d} + {b}/{d} = {total}/{d} = 1 {rest}/{d}입니다.\n{whole}에 분수 부분에서 나온 1을 더하면 {carriedWhole}입니다.\n따라서 {left} + {right} = {answer}입니다.",
});
