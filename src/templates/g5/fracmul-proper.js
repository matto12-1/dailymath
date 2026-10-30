import {explain,reduction,j,say} from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,frac,multiplyF,gcd,fractionVars} from './helpers.js?v=9a67f36b25';
export default define(meta('fracmul','proper',2,'calc',['01-09'],'분수끼리의 곱'),{
 input:'number',answerKind:'fraction',mixedInput:true,texts:['〔{left} × {right} = ?〕계산하면 얼마일까요?'],
 draw:explain(function(rng){const {a,b,d,e}=fractionVars(rng,true);if(a*b===a+b||d*e===d+e)return null;return {a,b,d,e,left:frac(0,a,d),right:frac(0,b,e),n:a*b,D:d*e,...errors(wrong(f(a*b,d+e),'분모 더하기','분모를 {d} × {e:이/가} 아니라 {d} + {e:으로/로} 계산했습니다. 분모끼리도 곱하면 {n}/{D:이/가} 되므로 곱을 기약분수로 나타내면 {answer:입니다}.'),wrong(f(a+b,d*e),'분자 더하기','분자를 {a} × {b:이/가} 아니라 {a} + {b:으로/로} 계산했습니다. 분자끼리도 곱하여 {n}/{D:으로/로} 나타낸 뒤 약분하면 {answer:입니다}.'))};},v=>['분자끼리 '+v.a+' × '+v.b+' = '+say(v.n)+' 분모끼리 '+v.d+' × '+v.e+' = '+say(v.D),'곱은 '+j(v.n+'/'+v.D,'입니다')+'.',reduction(v.n,v.D).text]),
 answer:v=>f(v.a*v.b,v.d*v.e),check:v=>multiplyF(v.left,v.right),solution:'{process}\n따라서 답은 {answer:입니다}.',
});
