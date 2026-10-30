import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
const description=(a,b,x,y)=>a+' '+(x?'초과':'이상')+' '+b+' '+(y?'미만':'이하');
export default define(meta('range','open',2,'estimate',['01-02'],'두 끝이 있는 수의 범위'),{
 answerKind:'text',texts:['수직선에 나타낸 수의 범위는 무엇일까요?','수직선에 나타낸 수의 범위는 무엇일까요?'],
 draw(rng){const a=rng.int(3,80),b=a+rng.int(2,6),x=rng.next()<.5,y=rng.next()<.5;return {a,b,x,y,leftDot:x?'빈 점':'색칠한 점',rightDot:y?'빈 점':'색칠한 점',leftInclude:x?'포함하지 않습니다':'포함합니다',rightInclude:y?'포함하지 않습니다':'포함합니다',options:[false,true].flatMap(u=>[false,true].map(v=>description(a,b,u,v))),...errors(wrong(description(a,b,!x,!y),'두 끝의 포함 여부 바꾸기','{value} 범위를 골라 두 끝점의 포함 여부를 모두 반대로 읽었습니다. {a}에 있는 {leftDot:은/는} {a:을/를} {leftInclude}. {b}에 있는 {rightDot:은/는} {b:을/를} {rightInclude}. 두 끝의 뜻을 함께 쓰면 {answer:입니다}.'),wrong(description(a,b,!x,y),'왼쪽 끝의 포함 여부 바꾸기','{value} 범위를 골라 왼쪽 끝점의 뜻을 반대로 읽었습니다. {a}에 있는 {leftDot:은/는} {a:을/를} {leftInclude}. 오른쪽 끝의 뜻도 이어 쓰면 {answer:입니다}.'))};},
 answer:v=>description(v.a,v.b,v.x,v.y),check:v=>v.a+' '+(v.x?'초과':'이상')+' '+v.b+' '+(v.y?'미만':'이하'),isCorrect:(v,c)=>c===description(v.a,v.b,v.x,v.y),
 art:v=>({kind:'numberline',from:v.a-1,to:v.b+1,step:1,range:{from:v.a,to:v.b,fromOpen:v.x,toOpen:v.y},wide:true}),
 solution:'{a}에 있는 점은 {leftDot:이/가}므로 {a:을/를} {leftInclude}. {b}에 있는 점은 {rightDot:이/가}므로 {b:을/를} {rightInclude}.\n따라서 수직선에 나타낸 수의 범위는 {answer:입니다}.',
});
