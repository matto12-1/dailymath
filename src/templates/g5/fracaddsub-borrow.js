import {define,meta,errors,wrong,f,frac,fractionVars,addF,gcd,fill} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','borrow',4,'calc',['01-08'],'받아내림 있는 대분수 뺄셈'),{
 input:'number',answerKind:'fraction',mixedInput:true,texts:['〔{left} − {right} = ?〕계산하면 얼마일까요?'],
 draw(rng){const v=fractionVars(rng);if(!v)return null;const {a,b,d,e,L}=v,A=a*L/d,B=b*L/e;if(A>=B)return null;const w=rng.int(2,7),z=rng.int(1,w-1);return {...v,A,B,w,z,borrowed:w-1,newN:L+A,raw:frac(w-z-1,L+A-B,L),reductionText:gcd(L+A-B,L)>1?fill('{raw:을/를} 약분하면 {reduced:입니다}.',{raw:(L+A-B)+'/'+L,reduced:f(L+A-B,L)}):'',left:frac(w,a,d),right:frac(z,b,e),...errors(wrong(f((w-z+1)*L+A-B,L),'빌려준 자연수 줄이지 않기','자연수 부분에서 1을 받아내림하고 {w:을/를} {borrowed:으로/로} 줄이지 않았습니다. 받아내림한 자연수 부분을 {borrowed:으로/로} 줄여 {borrowed} {newN}/{L} − {z} {B}/{L:을/를} 계산하면 {answer:입니다}.'),wrong(f((w-z)*L+B-A,L),'분수 부분을 큰 수에서 작은 수로 빼기','분수 부분 {A}/{L}에서 {B}/{L:을/를} 뺄 수 없어 {B}/{L} − {A}/{L:으로/로} 거꾸로 뺐습니다. 자연수 부분에서 1을 받아내림하여 분수 부분을 {newN}/{L:으로/로} 바꾼 뒤 빼면 {answer:입니다}.'))};},
 answer:v=>f((v.w-v.z)*v.L+v.A-v.B,v.L),check:v=>addF(v.left,v.right,-1),
 solution:'분모를 {L:으로/로} 통분하면 {w} {A}/{L} − {z} {B}/{L:입니다}.\n{A}/{L}에서 {B}/{L:을/를} 뺄 수 없으므로 자연수 부분에서 1을 받아내림하여 {w} {A}/{L:을/를} {borrowed} {newN}/{L:으로/로} 바꿉니다.\n{borrowed} {newN}/{L} − {z} {B}/{L} = {raw:입니다}. {reductionText}\n따라서 답은 {answer:입니다}.',
});
