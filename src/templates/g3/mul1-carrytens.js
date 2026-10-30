import {explain,multiplyLines} from '../solution-process.js?v=9a67f36b25';
import {define,product,errors,wrong} from './helpers.js?v=9a67f36b25';
import {bank} from './arithmetic-helpers.js?v=9a67f36b25';
const pool=bank(11,99,2,9,(a,b)=>a%10>0&&a%10*b<10&&a*b>=100,(a,b)=>a*b);
export default define({id:'g3.mul1.carrytens',unit:'g3s1-multiplication',strand:'calc',level:4,label:'십의 자리에서 받아올리는 곱셈',std:['[4수01-04]']},{
  input:'number',errorCount:3,maxDigits:3,answerSpan:pool.answers,
  texts:['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw:explain(function(rng){
    const {a,b}=pool.draw(rng),answer=a*b,tens=Math.floor(a/10)*b,ones=a%10*b,carry=Math.floor(tens/10);
    return {a,b,...errors(
      wrong(answer%100,'백의 자리 받아올림 빠뜨리기',`십의 자리 곱 ${tens}에서 백의 자리로 올릴 ${carry}을 빠뜨려 ${answer%100}을 썼습니다. 십의 자리 곱 ${tens}은 백 ${carry}개와 십 ${tens%10}개이므로 일의 자리 ${ones}까지 쓰면 ${answer}입니다.`),
      wrong(Math.floor(a/10)*10+ones,'십의 자리 곱하기 빠뜨리기',`십의 자리에는 ${b}를 곱하지 않아 ${Math.floor(a/10)*10+ones}을 썼습니다. 십의 자리 ${Math.floor(a/10)}에도 ${b}를 곱하면 ${tens}이므로 ${a} × ${b} = ${answer}입니다.`),
      wrong(answer-carry*90,'백으로 올릴 수를 십에 쓰기',`백의 자리로 올릴 ${carry}을 십의 자리에 더해 ${answer-carry*90}을 썼습니다. 십의 자리 곱 ${tens}에서 ${carry}은 백의 자리에 쓰므로 곱은 ${answer}입니다.`))};
  },v=>multiplyLines(v.a,v.b)),
  answer:v=>v.a*v.b,check:v=>product(v.a,v.b),solution:'{process}\n따라서 {a} × {b} = {answer:입니다}.',
});
