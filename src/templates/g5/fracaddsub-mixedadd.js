import {define,meta,errors,wrong,f,frac,fractionVars,addF,gcd} from './helpers.js?v=9a67f36b25';
import {josa} from '../../engine/korean.js?v=9a67f36b25';
export default define(meta('fracaddsub','mixedadd',3,'calc',['01-08'],'분모가 다른 대분수 덧셈'),{
  input:'number',answerKind:'fraction',mixedInput:true,back:'g4s1-fraction-addsub',
  texts:['〔{left} + {right} = ?〕계산하면 얼마일까요?'],
  draw(rng){const q=fractionVars(rng);if(!q)return null;const {a,b,d,e,L}=q,w=rng.int(1,4),v=rng.int(1,4),A=a*L/d,B=b*L/e,N=A+B,g=gcd(N,L),whole=w+v,carry=Math.floor(N/L),rest=N%L;
    return {...q,w,v,A,B,N,whole,left:frac(w,a,d),right:frac(v,b,e),
      conversion:carry?`${N}/${L} = ${rest?`${carry} ${rest}/${L}`:carry}이므로 자연수 ${whole}에 ${josa(String(carry),'을/를')} 더합니다. `:'',
      reduction:rest && g>1?`${rest}/${L}의 분자와 분모를 ${josa(String(g),'으로/로')} 나누면 ${josa(`${rest/g}/${L/g}`,'입니다')}. `:'',...errors(
      wrong(f(whole*(d+e)+a+b,d+e),'분자와 분모 각각 더하기',`분자 ${a} + ${b}, 분모 ${d} + ${e}를 각각 더했습니다. 분모를 ${josa(String(L),'으로/로')} 통분하여 ${A}/${L} + ${B}/${L}에 자연수 ${whole}을 더하면 {answer:입니다}.`),
      wrong(f(N,L),'자연수 부분 빠뜨리기',`자연수 ${w} + ${v} = ${whole}을 빠뜨리고 분수끼리만 더했습니다. 빠뜨린 자연수 부분 ${whole}을 분수 부분의 합에 더하면 {answer:입니다}.`))};},
  answer:({whole,L,N})=>f(whole*L+N,L),check:({left,right})=>addF(left,right),
  solution:'분모를 {L:으로/로} 통분하면 {w} {A}/{L} + {v} {B}/{L:입니다}. 자연수끼리 {w} + {v} = {whole}, 분수끼리 {A}/{L} + {B}/{L} = {N}/{L:입니다}. {conversion}{reduction}\n따라서 답은 {answer:입니다}.',
});
