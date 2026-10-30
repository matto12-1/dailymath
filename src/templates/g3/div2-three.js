import { explain, divideLines } from '../solution-process.js?v=9a67f36b25';
import { define, pair, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define({ id:'g3.div2.three', unit:'g3s2-div', strand:'calc', level:3, label:'몫 가운데 0', std:['[4수01-06]'] }, {
  input:'number', answerKind:'pair', parts:[{before:'몫 '},{before:'나머지 '}], range:{min:0,max:999}, errorCount:2, back:'g2s1-numbers-three-digits',
  texts:['〔{a} ÷ {d}〕몫과 나머지는 얼마일까요?'],
  draw:explain(function(rng){const d=rng.int(2,9),h=rng.int(1,Math.floor(998/d/100)),u=rng.int(0,9),q=h*100+u,r=rng.int(1,d-1),a=q*d+r;if(a>999)return null;return {a,d,h,u,q,r,...errors(
    wrong(pair(h*10+u,r),'몫 가운데 0 빼먹기',`몫 ${q}의 십의 자리 0을 빠뜨려 몫을 ${h*10+u}, 나머지를 ${r}로 썼습니다. 십의 자리에서 나눌 수 없으면 0을 쓰므로 몫은 ${q}, 나머지는 ${r}입니다.`),
    wrong(pair(q,0),'나머지 빼먹기',`몫 ${q}만 쓰고 나머지를 0으로 썼습니다. ${a} − ${d*q} = ${r}이므로 몫은 ${q}, 나머지는 ${r}입니다.`))};},v=>divideLines(v.a,v.d)),
  answer:({a,d})=>pair(Math.floor(a/d),a%d), check:({a,d})=>{let q=0,r=a;for(;r>=d;r-=d)q++;return pair(q,r);},
  solution:"{process}\n따라서 몫은 {q}, 나머지는 {r}입니다.",
});
