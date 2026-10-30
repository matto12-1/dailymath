import { explain, j, say, reduction, mixedStep } from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,frac,multiplyF,gcd} from './helpers.js?v=9a67f36b25';
export default define(meta('fracmul','timesint',1,'calc',['01-09'],'분수와 자연수의 곱'),{
 input:'number',answerKind:'fraction',mixedInput:true,minMistakes:2,errorCount:2,texts:['〔{left} × {n} = ?〕계산하면 얼마일까요?'],
 draw: explain(function(rng) {const d=rng.int(2,12),a=rng.int(1,d-1),n=rng.int(2,5);if(gcd(a,d)!==1)return null;return {a,d,n,left:frac(0,a,d),product:a*n,...errors(wrong(frac(0,a*n,d*n),'분모에도 자연수 곱하기','분자 {a}뿐 아니라 분모 {d}에도 {n:을/를} 곱했습니다. 분모 {d:은/는} 그대로 두고 분자에 {n:을/를} 곱하면 {answer:입니다}.'),wrong(f(a+n*d,d),'곱셈을 덧셈으로 읽기','{left} × {n} 대신 {left} + {n:을/를} 계산했습니다. {left:을/를} {n}번 더하면 분자는 {a} × {n}, 분모는 {d:이/가} 되어 {answer:입니다}.'))};}, v => {const r=reduction(v.product,v.d);return ['분모는 그대로 두고 분자에 '+j(v.n,'을/를')+' 곱하면 '+v.left+' × '+v.n+' = '+say(v.product+'/'+v.d),r.text,mixedStep(r.n,r.d)];}),
 answer:v=>f(v.a*v.n,v.d),check:v=>multiplyF(v.left,String(v.n)),solution: "{process}\n따라서 답은 {answer:입니다}.",
});
