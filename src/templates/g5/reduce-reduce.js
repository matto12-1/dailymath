import {define,meta,errors,wrong,frac,f,gcd,divisors} from './helpers.js?v=9a67f36b25';
export default define(meta('reduce','reduce',2,'calc',['01-06'],'기약분수로 약분하기'),{
 input:'number',answerKind:'fraction',mixedInput:true,exactForm:true,texts:['〔{left}〕기약분수로 나타내면 무엇일까요?', '〔{left}〕기약분수로 나타내면 무엇일까요?'],
 draw(rng){const d=rng.int(2,12),a=rng.int(1,d-1),g=rng.pick([4,6,8]);if(gcd(a,d)!==1||d*g>60)return null;const n=a*g,D=d*g,c=rng.pick(divisors(g).filter(x=>x>1&&x<g));return {a,d,g,n,D,c,left:frac(0,n,D),...errors(wrong(frac(0,n/c,D/c),'약분을 끝내지 않기','분자와 분모를 공약수 {c:으로/로}만 나누었습니다. 분자와 분모를 최대공약수 {g:으로/로} 나누면 기약분수는 {answer:입니다}.'),wrong(frac(0,n,d),'분모만 나누기','분모 {D}만 {g:으로/로} 나누었습니다. 분자도 {n} ÷ {g} = {a:으로/로} 바꾸면 {answer:입니다}.'))};},
 answer:v=>f(v.n,v.D),check:v=>{let n=v.n,d=v.D;for(let k=2;k<=Math.min(n,d);k++)while(n%k===0&&d%k===0){n/=k;d/=k;}return frac(0,n,d);},
 solution:'분자 {n:과/와} 분모 {D:을/를} 최대공약수 {g:으로/로} 나눕니다. {n} ÷ {g} = {a}, {D} ÷ {g} = {d:입니다}.\n따라서 답은 {answer:입니다}.',
});
