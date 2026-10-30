import {define,meta,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
import {regular} from './geometry.js?v=9a67f36b25';
export default define(meta('polygons','diagonal',2,'shape',['03-11'],'다각형의 대각선 수'),{
  input:'number',answerUnit:'개',answerSpan:[2,5,9,14,20],
  texts:['이 다각형에서 그을 수 있는 대각선은 모두 몇 개일까요?'],
  draw(rng){const n=cycle(rng,'polygon-diagonal',[4,5,6,7,8]),points=regular(n,rng.int(0,359));return {n,points,countWords:Array.from({length:n-2},(_,i)=>(i<2?n-3:n-2-i)+'개').join(', '),fromOne:n-3,counts:Array.from({length:n-2},(_,i)=>i<2?n-3:n-2-i).join(' + '),...errors(wrong(n-3,'한 꼭짓점에서 그은 것만 세기','한 꼭짓점에서 그은 대각선 {fromOne}개만 세었습니다. 다른 꼭짓점에서 새로 그을 수 있는 대각선까지 세면 {answer}개입니다.'),wrong(n*(n-3),'같은 대각선을 두 번 세기',`한 대각선을 양 끝 꼭짓점에서 두 번 세어 ${n*(n-3)}개라고 했습니다. 같은 대각선을 한 번씩만 세면 ${n*(n-3)/2}개입니다.`))};},
  answer:({n})=>n*(n-3)/2,check:({n})=>{let count=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(j-i>1&&j-i<n-1)count++;return count;},
  art:v=>({kind:'polygon',points:v.points,wide:true}),solution: "한 꼭짓점에서 이웃하지 않은 꼭짓점으로 대각선을 {fromOne}개 그을 수 있습니다.\n이미 그은 대각선을 빼고 꼭짓점마다 새로 그을 수 있는 대각선을 세면 {countWords}입니다.\n{counts} = {answer}입니다.\n따라서 대각선은 모두 {answer}개입니다.",
});
