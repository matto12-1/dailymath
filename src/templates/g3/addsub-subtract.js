import {define,errors,wrong} from './helpers.js?v=9a67f36b25';
import {bank,minusCheck,additionAt,subtractionAt} from './arithmetic-helpers.js?v=9a67f36b25';
const pool=bank(100,999,100,999,(a,b)=>a>b && a%10>=b%10 && Math.floor(a/10)%10>=Math.floor(b/10)%10 && Math.floor(a/100)>=Math.floor(b/100),(a,b)=>a-b);
export default define({id:'g3.addsub.subtract',unit:'g3s1-addsub',strand:'calc',level:1,label:'받아내림 없는 세 자리 뺄셈',std:['[4수01-03]']},{
  // 숫자판은 정답·실수 값(더한 값은 네 자리) 가운데 가장 긴 것보다 한 자리 넉넉히(검수 A2-16). 「N개까지」 안내가 답 자리 수를 알려 주지 않는다.
  input:'number',maxDigits:5,errorCount:2,answerSpan:pool.answers,back:'g2s1-addsub',
  texts:['〔{a} − {b} = ?〕계산하면 얼마일까요?'],
  draw(rng){const {a,b}=pool.draw(rng),ah=Math.floor(a/100),at=Math.floor(a/10)%10,ao=a%10,bh=Math.floor(b/100),bt=Math.floor(b/10)%10,bo=b%10;
    return {a,b,ah,at,ao,bh,bt,bo,h:ah-bh,t:at-bt,o:ao-bo,...errors(
      wrong(a+b,'빼야 할 수 더하기',`${a}에서 ${b}를 빼야 하는데 더해서 ${a+b}이 되었습니다. 빼면 일의 자리 ${ao} − ${bo} = ${ao-bo}, 십의 자리 ${at} − ${bt} = ${at-bt}, 백의 자리 ${ah} − ${bh} = ${ah-bh}이므로 ${a} − ${b} = ${a-b}입니다.`),
      wrong(a-b%100,'백의 자리 빼기 빠뜨리기',`${b}의 백의 자리 ${bh}를 빼지 않아 ${a-b%100}이 되었습니다. ${subtractionAt(a,b,2)}`))};},
  answer:({a,b})=>a-b,check:({a,b})=>minusCheck(a,b),
  solution:'일의 자리 {ao} − {bo} = {o}, 십의 자리 {at} − {bt} = {t}, 백의 자리 {ah} − {bh} = {h:입니다}.\n따라서 {a} − {b} = {answer:입니다}.',
});
