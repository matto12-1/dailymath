import {define,meta,errors,wrong,dec,repeated,decimalProduct} from './helpers.js?v=9a67f36b25';
export default define(meta('decimalmul','inttimes',2,'calc',['01-13'],'자연수와 두 자리 소수의 곱'),{
 input:'number',answerKind:'decimal',texts:['〔{a} × {right} = ?〕계산하면 얼마일까요?'],
 draw(rng){const a=rng.int(2,20),B=rng.int(1,99);if(B%10===0)return null;return {a,B,right:dec(B,2),product:a*B,productText:decimalProduct(a*B,2),zeroText:a*B%10===0?'소수 끝자리의 0은 수의 크기를 바꾸지 않으므로 생략합니다.':'',...errors(wrong(dec(a*B,1),'소수점 한 자리만 옮기기','두 자리 소수인데 곱의 소수점 아래를 한 자리로만 생각했습니다. {right:이/가} 소수 두 자리이므로 자연수 곱 {product}에 소수점을 맞추면 {answer:입니다}.'),wrong(dec(a*B,0),'소수점 빠뜨리기','{a} × {B}의 값에 소수점을 찍지 않았습니다. 빠뜨린 소수점을 오른쪽에서 두 자리 왼쪽에 찍으면 {a} × {right} = {answer:입니다}.'))};},
 answer:v=>dec(v.a*v.B,2),check:v=>dec(repeated(v.B,v.a),2),solution:'{a} × {B} = {product:입니다}.\n{right:이/가} 소수 두 자리이므로 자연수 곱에 소수 두 자리를 표시합니다. {zeroText}\n따라서 답은 {answer:입니다}.',
});
