import {explain,divideLines,j} from '../solution-process.js?v=9a67f36b25';
import {define,meta,pair,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('muldiv','onequotient',3,'calc',['01-07'],'몫이 한 자리인 나눗셈'),{
  input:'number',answerKind:'pair',parts:[{before:'몫'},{before:'나머지'}],
  texts:['〔{a} ÷ {d}〕몫과 나머지는 얼마일까요?'],
  draw:explain(function(rng){const d=rng.int(10,99),q=rng.int(2,9),r=rng.int(1,d-1),a=d*q+r,rounded=Math.round(d/10)*10;return {a,d,q,r,rounded,estimate:Math.floor(a/rounded),...errors(
    wrong(pair(q-1,r+d),'몫을 작게 어림하기','몫을 {low}, 나머지를 {rem:으로/로} 썼습니다. {rem}에서 {d:을/를} 한 번 더 뺄 수 있으므로 몫은 {q}, 나머지는 {r}입니다.'),
    wrong(pair(q,0),'나머지 빠뜨리기',`몫 {q}만 쓰고 나머지를 0으로 썼습니다. ${a} − ${d*q} = ${r}이므로 몫은 ${q}, 나머지는 ${r}입니다.`)),low:q-1,rem:r+d};},v=>[
  j(v.d,'을/를')+' 약 '+j(v.rounded,'으로/로')+' 보면 '+v.a+' ÷ '+v.rounded+'의 몫은 약 '+v.estimate+'입니다.',
  v.d+' × '+v.q+' = '+v.d*v.q+'이고 '+v.d+' × '+(v.q+1)+' = '+j(v.d*(v.q+1),'은/는')+' '+v.a+'보다 크므로 몫은 '+v.q+'입니다.',
  v.a+' − '+v.d*v.q+' = '+v.r+'입니다.'
]),
  answer:({q,r})=>pair(q,r),check:({a,d})=>pair(Math.floor(a/d),a%d),
  solution:'{process}\n따라서 {a} ÷ {d}의 몫은 {q}, 나머지는 {r:입니다}.',
});
