import {define,meta,errors,wrong,dec,repeated,decimalProduct} from './helpers.js?v=9a67f36b25';
export default define(meta('decimalmul','proper',2,'calc',['01-13'],'한 자리 소수끼리의 곱'),{
 input:'number',answerKind:'decimal',texts:['〔{left} × {right} = ?〕계산하면 얼마일까요?'],
 draw(rng){const A=rng.int(11,99),B=rng.int(11,99);if(A%10===0||B%10===0)return null;return {A,B,left:dec(A,1),right:dec(B,1),product:A*B,productText:decimalProduct(A*B,2),zeroText:A*B%10===0?'소수 끝자리의 0은 수의 크기를 바꾸지 않으므로 생략합니다.':'',...errors(wrong(dec(A*B,1),'소수점 한 자리만 생각하기','두 수가 각각 소수 한 자리인데 한 수의 자리만 생각했습니다. 두 수의 소수 자릿수를 더한 두 자리로 곱을 나타내면 {answer:입니다}.'),wrong(dec(A*B,0),'소수점 빠뜨리기','자연수 {A} × {B}의 값만 쓰고 소수점을 찍지 않았습니다. 빠뜨린 소수점을 오른쪽에서 두 자리 왼쪽에 찍으면 {left} × {right} = {answer:입니다}.'))};},
 answer:v=>dec(v.A*v.B,2),check:v=>dec(repeated(v.A,v.B),2),solution:'{A} × {B} = {product:입니다}.\n두 수의 소수 자릿수는 1 + 1 = 2이므로 자연수 곱에 소수 두 자리를 표시합니다. {zeroText}\n따라서 답은 {answer:입니다}.',
});
