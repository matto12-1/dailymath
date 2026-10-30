import { explain, reduction, say } from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,fractionVars,addF} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','subtract',2,'calc',['01-08'],'다른 분모의 분수 뺄셈'),{
 input:'number',answerKind:'fraction',mixedInput:true,minMistakes:2,errorCount:3,texts:['〔{left} − {right} = ?〕계산하면 얼마일까요?'],
 draw: explain(function(rng){const v=fractionVars(rng);if(!v)return null;const {a,b,d,e,L}=v,A=a*L/d,B=b*L/e;if(A<=B)return null;return {...v,A,B,difference:A-B,...errors(wrong(d>e&&a>=b?f(a-b,d-e):null,'분자와 분모 각각 빼기','분자끼리 {a} − {b}, 분모끼리 {d} − {e:을/를} 계산했습니다. {L:으로/로} 통분하여 {A}/{L} − {B}/{L:을/를} 계산하면 {answer:입니다}.'),wrong(a>=b?f(a-b,L):null,'분모만 통분하기','분모만 {L:으로/로} 바꾸고 분자는 {a:과/와} {b} 그대로 뺐습니다. 분자도 같은 수로 곱한 {A}/{L} − {B}/{L:을/를} 계산하면 {answer:입니다}.'),wrong(f(A+B,L),'뺄셈을 덧셈으로 읽기','두 분수의 차 대신 합을 구했습니다. 통분한 뒤 분자를 {A} − {B:으로/로} 빼면 {answer:입니다}.'))};}, v => ['통분하면 '+v.A+'/'+v.L+' − '+say(v.B+'/'+v.L), '분자를 빼면 '+v.A+' − '+v.B+' = '+say(v.difference), reduction(v.difference,v.L).text]),
 answer:v=>f(v.A-v.B,v.L),check:v=>addF(v.left,v.right,-1),solution:'{process}\n따라서 답은 {answer:입니다}.',
});
