import { j, explain, fractionConversion, say, reduction } from './solution-text.js?v=9a67f36b25';
import {define,meta,errors,wrong,f,frac,fractionVars,addF} from './helpers.js?v=9a67f36b25';
export default define(meta('fracaddsub','story',4,'word',['01-08'],'끈의 남은 길이'),{
 input:'number',answerKind:'fraction',mixedInput:true,answerUnit:'m',back:'g4s1-fraction-addsub',
 texts:['끈 {left} m에서 {right} m를 잘랐습니다. 남은 길이는 몇 m일까요?','길이가 {left} m인 끈을 {right} m 잘라 냈습니다. 몇 m가 남을까요?'],
 draw: explain(function(rng) {const v=fractionVars(rng);if(!v)return null;const {a,b,d,e,L}=v,A=a*L/d,B=b*L/e;if(A>=B)return null;const w=rng.int(1,6);return {...v,A,B,w,left:frac(w,a,d),right:frac(0,b,e),borrowed:w-1,newN:L+A,regrouped:frac(w-1,L+A,L),...errors(wrong(f(w*L+B-A,L),'분수 부분을 큰 수에서 작은 수로 빼기','분수 부분 {A}/{L}에서 {B}/{L:을/를} 뺄 수 없어 {B}/{L} − {A}/{L:으로/로} 거꾸로 빼고 자연수 {w:을/를} 그대로 두었습니다. 자연수 부분에서 1을 받아내림하여 {regrouped} − {B}/{L:을/를} 계산하면 {answer} m입니다.'),wrong(f((w+1)*L+A-B,L),'빌려준 자연수 줄이지 않기','자연수 부분에서 1을 받아내림하고 {w:을/를} {borrowed:으로/로} 줄이지 않았습니다. 받아내림한 자연수 부분을 {borrowed:으로/로} 줄인 뒤 빼면 남은 길이는 {answer} m입니다.'))};}, v => {const raw=v.newN-v.B,r=reduction(raw,v.L),before=frac(v.borrowed,raw,v.L);return ['남은 길이는 '+v.left+' − '+j(v.right,'으로/로')+' 구합니다. 통분하면 '+fractionConversion(v.left,frac(v.w,v.A,v.L))+' '+fractionConversion(v.right,v.B+'/'+v.L), (v.A+'/'+v.L+'에서 '+j(v.B+'/'+v.L,'을/를')+' 뺄 수 없으므로 자연수 부분에서 1을 받아내림하면 ')+frac(v.w,v.A,v.L)+' = '+say(v.regrouped)+' 분자끼리 빼면 '+v.newN+' − '+v.B+' = '+say(raw), v.regrouped+' − '+v.B+'/'+v.L+' = '+say(before)+' '+r.text];}),
 answer:v=>f(v.w*v.L+v.A-v.B,v.L),check:v=>addF(v.left,v.right,-1),art:()=>({scene:'cord-fraction'}),
 solution: "{process}\n따라서 남은 길이는 {answer} m입니다.",
});
