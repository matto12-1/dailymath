import {explain,divideLines} from '../solution-process.js?v=9a67f36b25';
import {define,meta,pair,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('muldiv','divide',4,'calc',['01-07'],'몫이 두 자리인 나눗셈'),{
  input:'number',answerKind:'pair',parts:[{before:'몫'},{before:'나머지'}],back:'g3s2-div',
  texts:['〔{a} ÷ {d}〕몫과 나머지는 얼마일까요?'],
  draw:explain(function(rng){const q=rng.int(10,89),d=rng.int(10,Math.min(99,Math.floor(998/q))),r=rng.int(1,Math.min(d-1,999-d*q)),a=d*q+r,rounded=Math.round(d/10)*10;return {a,d,q,r,q10:Math.floor(q/10)*10,q20:Math.floor(q/10)*10+10,lower:d*(Math.floor(q/10)*10),upper:d*(Math.floor(q/10)*10+10),rounded,estimate:Math.floor(a/rounded),...errors(
    q%10===0?wrong(pair(q/10,r),'몫의 0 빠뜨리기',`몫의 일의 자리 0을 빠뜨려 몫을 ${q/10}, 나머지를 ${r}로 썼습니다. 일의 자리에서 나눌 수 없으면 0을 쓰므로 몫은 ${q}, 나머지는 ${r}입니다.`):wrong(pair(q-1,r+d),'몫을 한 번 덜 구하기','몫을 {low}, 나머지를 {rem:으로/로} 썼습니다. {rem}에서 {d:을/를} 한 번 더 뺄 수 있으므로 몫은 {q}, 나머지는 {r}입니다.'),wrong(pair(q,0),'나머지 빠뜨리기',`몫 {q}만 쓰고 나머지를 0으로 썼습니다. ${a} − ${d*q} = ${r}이므로 몫은 ${q}, 나머지는 ${r}입니다.`)),low:q-1,rem:r+d};},v=>divideLines(v.a,v.d)),
  answer:({q,r})=>pair(q,r),check:({a,d})=>pair(Math.floor(a/d),a%d),
  solution:'{d} × {q10} = {lower}, {d} × {q20} = {upper}이므로 몫은 {q10}보다 크거나 같고 {q20}보다 작습니다.\n{process}\n나머지 {r:은/는} {d}보다 작습니다.\n따라서 {a} ÷ {d}의 몫은 {q}, 나머지는 {r:입니다}.',
});
