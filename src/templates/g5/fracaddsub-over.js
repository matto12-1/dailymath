import { explain, fractionConversion, j, say, reduction, mixedStep } from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,fractionVars,addF} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','over',2,'calc',['01-08'],'1이 넘는 분수의 합'),{
 input:'number',answerKind:'fraction',mixedInput:true,back:'g4s1-fraction-addsub',texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
 draw: explain(function(rng) {const v=fractionVars(rng);if(!v)return null;const {a,b,d,e,L}=v,A=a*L/d,B=b*L/e;if(A+B<=L)return null;return {...v,A,B,total:A+B,...errors(wrong(f(A+B,2*L),'통분 뒤 분모도 더하기','통분한 뒤 분모도 {L} + {L:으로/로} 더했습니다. 분모는 {L} 그대로 두고 분자끼리 더한 뒤 대분수로 나타내면 {answer:입니다}.'),wrong(f((A+B)%L,L),'자연수 부분 빠뜨리기','{total}/{L}에서 자연수 부분 1을 빠뜨렸습니다. 자연수 부분 1과 남은 분수 부분을 함께 쓰면 {answer:입니다}.'))};}, v => {const r=reduction(v.total,v.L);return ['분모를 '+j(v.L,'으로/로')+' 통분하면 '+fractionConversion(v.left,v.A+'/'+v.L)+' '+fractionConversion(v.right,v.B+'/'+v.L), '분자끼리 '+v.A+' + '+v.B+' = '+say(v.total)+' 합은 '+j(v.total+'/'+v.L,'입니다')+'. '+r.text, mixedStep(r.n,r.d)];}),
 answer:v=>f(v.A+v.B,v.L),check:v=>addF(v.left,v.right),solution: "{process}\n따라서 답은 {answer:입니다}.",
});
