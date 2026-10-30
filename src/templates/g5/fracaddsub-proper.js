import { explain, fractionConversion, j, say, reduction } from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,fractionVars,addF} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','proper',1,'calc',['01-08'],'다른 분모의 진분수 덧셈'),{
 input:'number',answerKind:'fraction',mixedInput:true,texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
 draw: explain(function(rng) {const v=fractionVars(rng);if(!v)return null;const {a,b,d,e,L}=v,A=a*L/d,B=b*L/e;if(A+B>=L)return null;return {...v,A,B,...errors(wrong(f(a+b,d+e),'분자와 분모 각각 더하기','분자끼리 {a} + {b}, 분모끼리 {d} + {e:을/를} 계산했습니다. {L:으로/로} 통분하여 {A}/{L} + {B}/{L:을/를} 계산하면 {answer:입니다}.'),wrong(f(A+B,2*L),'통분 뒤 분모도 더하기','통분한 뒤 분모 {L}도 두 번 더했습니다. 분모는 {L} 그대로 두고 분자끼리 더하면 {answer:입니다}.'))};}, v => {const n=v.A+v.B,r=reduction(n,v.L);return ['분모를 '+j(v.L,'으로/로')+' 통분합니다. '+fractionConversion(v.left,v.A+'/'+v.L)+' '+fractionConversion(v.right,v.B+'/'+v.L), '분자를 더하면 '+v.A+' + '+v.B+' = '+say(n)+' 합은 '+j(n+'/'+v.L,'입니다')+'.', r.text];}),
 answer:v=>f(v.A+v.B,v.L),check:v=>addF(v.left,v.right),
 solution: "{process}\n따라서 답은 {answer:입니다}.",
});
