import {define,meta,casesSpec,errors,wrong,pairs,gcd,lcm,divisors} from './helpers.js?v=9a67f36b25';
const cases=pairs(4,100,4,100,(a,b)=>a!==b&&gcd(a,b)>1&&gcd(a,b)<a&&lcm(a,b)!==a),answer=v=>gcd(v.a,v.b);
export default define(meta('factors','story',3,'word',['01-04'],'가장 많은 꾸러미'),{
 input:'number',answerUnit:'꾸러미',texts:['빵 {a}개와 사탕 {b}개를 남김없이 담습니다. 꾸러미마다 빵 수도 같고 사탕 수도 같게 하려면 가장 많이 몇 꾸러미를 만들 수 있을까요?','빵 {a}개와 사탕 {b}개를 꾸러미에 남김없이 똑같이 나누어 담으려고 합니다. 꾸러미를 가장 많이 만들면 몇 꾸러미일까요?'],
 ...casesSpec(cases,answer,v=>divisors(v.a).filter(n=>v.b%n===0).at(-1),v=>({...v,bread:v.a/gcd(v.a,v.b),common:divisors(gcd(v.a,v.b)).join(', '),candy:v.b/gcd(v.a,v.b),...errors(wrong(lcm(v.a,v.b),'최소공배수와 혼동','꾸러미 수는 {a:과/와} {b}의 공약수여야 하는데 최소공배수를 구했습니다. 꾸러미 수는 두 수의 공약수이므로 가장 많은 꾸러미 수는 최대공약수 {answer}꾸러미입니다.'),wrong(v.a,'빵 수만 생각하기','빵 {a}개만 생각했습니다. 사탕 {b}개도 남김없이 나누는 수 중 가장 큰 수는 두 수의 최대공약수 {answer}꾸러미입니다.'))})),
 art:()=>({scene:'gift-packs'}),solution:'두 종류를 남김없이 똑같이 나누려면 꾸러미 수는 {a:과/와} {b}의 공약수입니다. 가장 많이 만들 때는 최대공약수를 구합니다. 두 수의 공약수는 {common:입니다}. 한 꾸러미에 빵 {bread}개와 사탕 {candy}개씩 담을 수 있습니다.\n따라서 꾸러미는 가장 많이 {answer}꾸러미 만들 수 있습니다.',
});
