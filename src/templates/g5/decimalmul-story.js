import {define,meta,errors,wrong,dec,repeated,decimalProduct} from './helpers.js?v=9a67f36b25';
export default define(meta('decimalmul','story',3,'word',['01-13'],'잘라 놓은 리본의 길이'),{
 input:'number',answerKind:'decimal',answerUnit:'m',
 texts:['리본을 한 도막에 {left} m씩 {b}도막 잘랐습니다. 자른 리본의 길이는 모두 몇 m일까요?','길이가 {left} m인 리본 {b}도막이 있습니다. 리본의 길이는 모두 몇 m일까요?'],
 draw(rng){const A=rng.int(11,399),b=rng.int(2,9);if(A%10===0)return null;return {A,b,left:dec(A,2),product:A*b,productText:decimalProduct(A*b,2),zeroText:A*b%10===0?'소수 끝자리의 0은 수의 크기를 바꾸지 않으므로 생략합니다.':'',...errors(wrong(dec(A*b,1),'소수점 한 자리만 생각하기','리본 길이 {left:은/는} 소수 두 자리인데 한 자리로만 생각했습니다. 한 도막의 길이가 소수 두 자리이므로 곱에 소수 두 자리를 표시하면 {answer} m입니다.'),wrong(dec(A*b,0),'소수점 빠뜨리기','{A} × {b}의 값에 소수점을 찍지 않았습니다. 빠뜨린 소수점을 오른쪽에서 두 자리 왼쪽에 찍으면 {left} × {b} = {answer} m입니다.'))};},
 answer:v=>dec(v.A*v.b,2),check:v=>dec(repeated(v.A,v.b),2),art:()=>({scene:'craft'}),solution:'{left} m씩 {b}도막이므로 {left} × {b:을/를} 계산합니다.\n{A} × {b} = {product:입니다}. {left:이/가} 소수 두 자리이므로 자연수 곱에 소수 두 자리를 표시합니다. {zeroText}\n따라서 리본의 전체 길이는 {answer} m입니다.',
});
