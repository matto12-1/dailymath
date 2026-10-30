import {define,meta,errors,wrong,dec,frac,gcd} from './helpers.js?v=9a67f36b25';
export default define(meta('reduce','todecimal',3,'calc',['01-12'],'분수를 소수로 나타내기'),{
 input:'number',answerKind:'decimal',texts:['〔{left}〕소수로 나타내면 무엇일까요?', '〔{left}〕크기가 같은 소수는 무엇일까요?'],
 draw(rng){const d=rng.pick([4,5,20,25]),a=rng.int(1,d-1);if(gcd(a,d)!==1)return null;const denominator=d===5?10:100,k=denominator/d,numerator=a*k;return {a,d,k,left:frac(0,a,d),denominator,numerator,places:denominator===10?'한':'두',...errors(wrong(dec(a,denominator===10?1:2),'분자에는 곱하지 않기','분모에 {k:을/를} 곱하면서 분자에는 곱하지 않았습니다. 분자에도 {k:을/를} 곱하면 {numerator}/{denominator:이/가} 되어 소수로는 {answer:입니다}.'),wrong(dec(numerator,denominator===10?2:3),'소수점 한 자리 더 옮기기','{numerator}/{denominator:을/를} 소수로 나타낼 때 소수점을 한 자리 더 왼쪽에 찍었습니다. 분모 {denominator}에 맞게 소수 {places} 자리까지 나타내면 {answer:입니다}.'))};},
 answer:v=>dec(v.a*(100/v.d),2),check:v=>dec(Math.round(100*Number(v.a)/Number(v.d)),2),
 solution:'분모 {d}에 {k:을/를} 곱하면 {denominator:이/가} 되므로 분모와 분자에 각각 {k:을/를} 곱합니다.\n{left} = {numerator}/{denominator} = {answer:입니다}.\n따라서 {left:을/를} 소수로 나타내면 {answer:입니다}.',
});
