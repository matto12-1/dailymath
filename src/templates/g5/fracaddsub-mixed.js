import {explain,fractionConversion,reduction,j,say} from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,frac,fractionVars,addF} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','mixed',3,'calc',['01-08'],'받아내림 없는 대분수 뺄셈'),{
 input:'number',answerKind:'fraction',mixedInput:true,back:'g4s1-fraction-addsub',texts:['〔{left} − {right} = ?〕계산하면 얼마일까요?'],
 draw:explain(function(rng){const v=fractionVars(rng);if(!v)return null;const {a,b,d,e,L}=v,A=a*L/d,B=b*L/e;if(A<=B)return null;const w=rng.int(2,7),z=rng.int(1,w-1);return {...v,A,B,w,z,left:frac(w,a,d),right:frac(z,b,e),whole:w-z,...errors(wrong(f(A-B,L),'자연수 부분 빠뜨리기','자연수끼리의 차 {whole:을/를} 빠뜨리고 분수끼리만 뺐습니다. 통분한 분수 부분의 차에 자연수 부분의 차 {w} − {z} = {whole:을/를} 더하면 {answer:입니다}.'),wrong(f((w-z)*d+a,d),'첫 분수 부분 그대로 쓰기','자연수만 빼고 첫 수의 분수 부분 {a}/{d:을/를} 그대로 썼습니다. 분수 부분도 통분하여 {A}/{L} − {B}/{L:을/를} 구한 뒤 자연수 부분의 차와 더하면 {answer:입니다}.'))};},v=>['분모를 '+j(v.L,'으로/로')+' 통분합니다. '+fractionConversion(v.a+'/'+v.d,v.A+'/'+v.L)+' '+fractionConversion(v.b+'/'+v.e,v.B+'/'+v.L),'자연수끼리 '+v.w+' − '+v.z+' = '+say(v.whole),'분자는 '+v.A+' − '+v.B+' = '+say(v.A-v.B)+' 분수 부분은 '+j((v.A-v.B)+'/'+v.L,'입니다')+'.',reduction(v.A-v.B,v.L).text]),
 answer:v=>f((v.w-v.z)*v.L+v.A-v.B,v.L),check:v=>addF(v.left,v.right,-1),solution:'{process}\n따라서 답은 {answer:입니다}.',
});
