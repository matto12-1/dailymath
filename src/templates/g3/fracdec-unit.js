import { explain, j } from '../solution-process.js?v=9a67f36b25';
import { define, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac } from '../../engine/answer.js?v=9a67f36b25';

// 검수 A2-7: 「1/6이 4개」를 식 상자에 크게 둔다. 검수 A2-9: 3학년 교과서처럼 「1/6이 4개이면 4/6」으로 센다(분수 덧셈은 4학년).
export default define({id:'g3.fracdec.unit',unit:'g3s1-fractions-decimals',strand:'calc',level:2,label:'단위분수 몇 개',std:['[4수01-10]']},{
  input:'number',answerKind:'fraction',errorCount:2,
  texts:["〔{unit:이/가} {n}개인 수〕상자의 수를 분수로 나타내면 얼마일까요?","〔{unit:을/를} {n}개 모은 수〕상자의 수를 분수로 나타내면 얼마일까요?"],
  draw: explain(function(rng) {const d=rng.int(3,9),n=rng.int(2,d-1);return {d,n,unit:frac(0,1,d),wrongD:d*n,
    ...errors(wrong(frac(0,d,n),'분자와 분모 바꾸어 쓰기','분자와 분모를 바꾸어 {d}/{n:을/를} 썼습니다. 전체를 나눈 조각 수 {d:은/는} 분모에, 고른 조각 수 {n:은/는} 분자에 쓰므로 {n}/{d}입니다.'),
      wrong(String(n),'분수를 자연수로 쓰기','1/{d:이/가} {n}개인 것을 {n:으로/로} 썼습니다. {d}조각 중 {n}조각이므로 {n}/{d}입니다.'))};}, v => ['전체를 똑같이 ' + v.d + '조각으로 나눈 것 중 1조각이 ' + j(v.unit,'입니다') + '.', j(v.unit,'이/가') + ' ' + v.n + '개이면 ' + v.d + '조각 중 ' + v.n + '조각입니다.']),
  answer:({n,d})=>frac(0,n,d),check:({n,d})=>`${n}/${d}`,
  solution: "{process}\n따라서 {unit:을/를} {n}개 모은 수는 {answer:입니다}.",
});
