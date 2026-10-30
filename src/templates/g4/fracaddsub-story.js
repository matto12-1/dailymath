import {define,meta,frac,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','story',3,'word',['01-15'],'자연수에서 분수만큼 끈 자르기'),{
  input:'number',answerKind:'fraction',mixedInput:true,answerUnit:'m',back:'g3s2-fractions',
  texts:['끈 {w} m에서 {piece} m를 잘랐습니다. 몇 m가 남을까요?','길이가 {w} m인 끈을 {piece} m만큼 썼습니다. 남은 끈은 몇 m일까요?'],
  draw(rng){const d=rng.int(2,12),a=rng.int(1,d-1),w=rng.int(1,4);return {a,d,w,borrowWhole:w-1,one:frac(0,d,d),piece:frac(0,a,d),...errors(wrong(frac(w,d-a,d),'바꿔 준 자연수 줄이지 않기',`1을 분수로 바꾸고도 자연수를 그대로 두어 ${frac(w,d-a,d)} m를 썼습니다. ${w}은 ${w-1} ${d}/${d}이므로 ${w-1} ${d}/${d}에서 ${a}/${d}을 빼면 ${frac(w-1,d-a,d)} m입니다.`),wrong(frac(w-1,a,d),'뺀 분수를 그대로 쓰기',`자연수에서 1을 빼고 분자는 그대로 두어 ${frac(w-1,a,d)} m를 썼습니다. 남은 분자는 ${d} − ${a} = ${d-a}이므로 ${frac(w-1,d-a,d)} m입니다.`)),rest:frac(0,d-a,d)};},
  answer:({w,a,d})=>frac(w-1,d-a,d),check:({w,a,d})=>frac(0,w*d-a,d),art:()=>({scene:'cord-fraction'}),
  solution: "남은 끈은 {w} − {piece:으로/로} 구합니다.\n{w}에서 1을 {one:으로/로} 바꾸면 {w} = {borrowWhole} {one}입니다.\n{borrowWhole} {one} − {piece} = {answer}입니다.\n따라서 남은 끈은 {answer} m입니다.",
});
