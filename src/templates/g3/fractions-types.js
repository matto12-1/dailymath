import { define, fill, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac, parseAnswer } from '../../engine/answer.js?v=9a67f36b25';

const names=['진분수','가분수','대분수'];
export default define({id:'g3.fractions.types',unit:'g3s2-fractions',strand:'calc',level:2,label:'분수의 종류',std:['[4수01-10]']},{
  answerKind:'text',errorCount:2,choiceOrder:names,texts:["〔{shown}〕상자의 분수는 진분수, 가분수, 대분수 가운데 어느 것일까요?","〔{shown}〕상자의 분수는 진분수, 가분수, 대분수 가운데 어느 것일까요?"],
  draw(rng){const type=rng.int(0,2),d=rng.int(2,9),n=type===1?rng.int(d,3*d):rng.int(1,d-1),w=type===2?rng.int(1,3):0,shown=frac(w,n,d),others=names.filter((_,i)=>i!==type);
    // 풀이는 뜻 문장(「크거나 같습니다」) 대신 이 수에 맞게 「큽니다」·「같습니다」로 말한다(검수 A2-20).
    const relation=fill(type===0?'분모 {d}보다 작습니다':n===d?'분모 {d:과/와} 같습니다':'분모 {d}보다 큽니다',{d}),reason=fill(type===2?'{shown:은/는} 자연수 {w:과/와} 진분수 {n}/{d:으로/로} 이루어진 분수입니다.':'분자 {n:은/는} {relation}.',{w,n,d,shown,relation});
    return {type,d,n,w,shown,options:names,reason,
      ...errors(...others.map((pick,i)=>wrong(pick,i?'자연수 부분 혼동하기':'분자와 분모의 관계 혼동하기',fill(type===2
      ? (i?'자연수와 진분수가 함께 있는데 {pick:으로/로} 골랐습니다. {shown:은/는} 자연수 {w:과/와} 진분수 {n}/{d:으로/로} 이루어졌으므로 대분수입니다.':'자연수 {w:을/를} 빠뜨리고 {pick:으로/로} 골랐습니다. 자연수 부분을 함께 보면 {shown:은/는} 대분수입니다.')
      : '{shown:을/를} {pick:으로/로} 골랐습니다. {pick}의 조건과 달리 분자 {n:은/는} '+(type===0?'분모 {d}보다 작으므로 진분수입니다.':n===d?'분모 {d:과/와} 같으므로 가분수입니다.':'분모 {d}보다 크므로 가분수입니다.'),{shown,pick,w,n,d})))),first:others[0],second:others[1],relation};},
  answer:({type})=>names[type],check:({shown})=>{const p=parseAnswer('fraction',shown);return p.w?names[2]:p.n<p.d?names[0]:names[1];},
  isCorrect:({w,n,d},choice)=>choice===(w?names[2]:n<d?names[0]:names[1]),
  solution:'{reason}\n따라서 {shown:은/는} {answer:입니다}.',
});
