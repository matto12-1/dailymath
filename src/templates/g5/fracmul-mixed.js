import { explain, j, say, reduction, mixedStep } from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,frac,multiplyF,gcd,fractionVars} from './helpers.js?v=9a67f36b25';
export default define(meta('fracmul','mixed',3,'calc',['01-09'],'대분수가 있는 곱셈'),{
 input:'number',answerKind:'fraction',mixedInput:true,back:'g3s2-fractions',texts:['〔{left} × {right} = ?〕계산하면 얼마일까요?'],
 draw: explain(function(rng) {const w=rng.int(1,5),{a,b,d,e}=fractionVars(rng,true);return {w,a,b,d,e,left:frac(w,a,d),right:frac(0,b,e),improper:w*d+a,product:(w*d+a)*b,D:d*e,...errors(wrong(f((w+a)*b,d*e),'자연수와 분자 그냥 더하기','가분수로 바꿀 때 {w} × {d} + {a} 대신 {w} + {a:을/를} 분자로 썼습니다. {left:을/를} 가분수 {improper}/{d:으로/로} 바꾸어 {b}/{e:과/와} 곱하면 {answer:입니다}.'),wrong(f(a*b,d*e),'자연수 부분 빠뜨리기','자연수 부분 {w:을/를} 빠뜨리고 {a}/{d}만 곱했습니다. 자연수 부분까지 포함한 {improper}/{d:을/를} 곱하면 {improper}/{d} × {b}/{e} = {answer:입니다}.'))};}, v => {const r=reduction(v.product,v.D);return [j(v.left,'을/를')+' 가분수로 나타내면 '+v.w+' × '+v.d+' + '+v.a+' = '+v.improper+'이므로 '+say(v.improper+'/'+v.d), '분자끼리 '+v.improper+' × '+v.b+' = '+say(v.product)+' 분모끼리 '+v.d+' × '+v.e+' = '+say(v.D)+' 곱은 '+j(v.product+'/'+v.D,'입니다')+'. '+r.text, mixedStep(r.n,r.d)];}),
 answer:v=>f((v.w*v.d+v.a)*v.b,v.d*v.e),check:v=>multiplyF(v.left,v.right),
 solution: "{process}\n따라서 답은 {answer:입니다}.",
});
