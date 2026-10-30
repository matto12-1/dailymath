import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
const names=['이상','이하','초과','미만'],meaning=(right,open)=>right?(open?'초과':'이상'):(open?'미만':'이하');
export default define(meta('range','closed',1,'estimate',['01-02'],'한쪽으로 이어지는 수의 범위'),{
 answerKind:'text',texts:['수직선에 나타낸 수의 범위는 무엇일까요?','수직선에 나타낸 수의 범위는 무엇일까요?'],
 draw(rng){const n=rng.int(5,95),right=rng.next()<.5,open=rng.next()<.5;return {n,right,open,dot:open?'빈 점':'색칠한 점',otherDot:open?'색칠한 점':'빈 점',include:open?'포함하지 않습니다':'포함합니다',direction:right?'오른쪽':'왼쪽',size:right?'큰':'작은',options:names.map(s=>n+' '+s),...errors(wrong(n+' '+meaning(right,!open),'끝점 포함 여부 바꾸기','{n}에 있는 {dot:을/를} {otherDot:으로/로} 보았습니다. {dot:은/는} 끝점 {n:을/를} {include}. 화살표 방향도 함께 읽으면 {answer:입니다}.'),wrong(n+' '+meaning(!right,open),'범위의 방향 바꾸기','{value} 범위를 골라 화살표 방향을 반대로 읽었습니다. 화살표가 {direction:을/를} 가리키는 방향과 {dot}의 뜻을 함께 읽으면 {answer:입니다}.'))};},
 answer:v=>v.n+' '+meaning(v.right,v.open),check:v=>v.n+' '+names[v.open?(v.right?2:3):(v.right?0:1)],isCorrect:(v,c)=>c===v.n+' '+meaning(v.right,v.open),
 art:v=>({kind:'numberline',from:v.n-4,to:v.n+4,step:1,range:{from:v.right?v.n:v.n-4,to:v.right?v.n+4:v.n,fromOpen:v.open,toOpen:v.open,fromInfinite:!v.right,toInfinite:v.right},wide:true}),
 solution:'{n}에 있는 점이 {dot:이/가}므로 {n:을/를} {include}. 화살표가 {direction:을/를} 가리키므로 {n}보다 {size} 수를 나타냅니다.\n따라서 수직선에 나타낸 수의 범위는 {answer:입니다}.',
});
