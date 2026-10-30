// 몇백과 몇십의 곱을 구하는 훈련.
import {define,meta,product,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('muldiv','drill',4,'calc',['01-04'],'몇백 × 몇십'),{
  input:'number',speedBonus:true,maxDigits:7,
  texts:['〔{a} × {b} = ?〕계산하면 얼마일까요?'],
  draw(rng){const left=rng.int(2,9),right=rng.int(2,9),a=left*100,b=right*10,small=left*right;return {a,b,left,right,small,...errors(
    wrong(a*b/10,'0을 하나 빠뜨리기',`0을 하나 빠뜨려 ${a*b/10}을 썼습니다. ${a}은 ${left}의 100배, ${b}는 ${right}의 10배이므로 ${small}에 0을 세 개 붙이면 ${a*b}입니다.`),
    wrong(a*b*10,'0을 하나 더 붙이기',`0을 네 개 붙여 ${a*b*10}을 썼습니다. 두 수의 0은 모두 세 개이므로 ${left} × ${right} = ${small}에 0을 세 개 붙인 ${a*b}입니다.`))};},
  answer:v=>v.a*v.b,check:v=>product(v.left,v.right)*1000,
  solution:'{left} × {right} = {small}입니다.\n{a:은/는} {left}의 100배, {b:은/는} {right}의 10배이므로 곱은 {small}의 1000배입니다.\n따라서 {a} × {b} = {answer:입니다}.',
});
