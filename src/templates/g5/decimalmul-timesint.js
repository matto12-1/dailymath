import {define,meta,errors,wrong,dec,repeated,decimalProduct} from './helpers.js?v=9a67f36b25';
export default define(meta('decimalmul','timesint',1,'calc',['01-13'],'소수와 자연수의 곱'),{
 input:'number',answerKind:'decimal',texts:['〔{left} × {b} = ?〕계산하면 얼마일까요?'],
 draw(rng){const p=rng.int(1,2),A=rng.int(1,9*10**p),b=rng.int(2,9);if(A%10===0)return null;return {A,p,b,left:dec(A,p),placeName:p===1?'한':'두',product:A*b,productText:decimalProduct(A*b,p),zeroText:A*b%10===0?'소수 끝자리의 0은 수의 크기를 바꾸지 않으므로 생략합니다.':'',...errors(wrong(dec(A*b,0),'소수점 빠뜨리기','소수점을 생각하지 않고 {A} × {b}의 값만 썼습니다. {left:이/가} 소수 {placeName} 자리이므로 자연수 곱 {product}에 소수점을 맞추면 {answer:입니다}.'),wrong(dec(A*b,p+1),'곱의 소수점을 한 자리 잘못 찍기','곱의 소수점을 한 자리 더 왼쪽에 찍었습니다. 소수점을 한 자리 오른쪽으로 옮겨 {left} × {b:을/를} 나타내면 {answer:입니다}.'))};},
 answer:v=>dec(v.A*v.b,v.p),check:v=>dec(repeated(v.A,v.b),v.p),
 solution:'{A} × {b} = {product:입니다}.\n{left:이/가} 소수 {placeName} 자리이므로 자연수 곱을 {placeName} 자리 소수로 나타냅니다. {zeroText}\n따라서 답은 {answer:입니다}.',
});
