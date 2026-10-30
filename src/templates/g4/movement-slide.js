import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
const directions=[['오른쪽',1,0],['왼쪽',-1,0],['위쪽',0,-1],['아래쪽',0,1]],shapes=[[[0,0],[0,1],[1,1],[1,2]],[[0,0],[0,1],[0,2],[1,2]],[[0,0],[1,0],[2,0],[1,1]],[[0,0],[1,0],[1,1],[2,1]]];
export default define(meta('movement','slide',1,'shape',['03-04'],'도형을 민 칸 수'),{
  input:'number',answerUnit:'칸',answerSpan:seq(4,7),
  texts:["1번 도형을 {direction}으로 몇 칸 밀면 2번 도형이 될까요?","1번 도형을 {direction}으로 몇 칸 밀면 2번 도형이 될까요?"],
  draw(rng){const k=cycle(rng,'movement-slide',seq(4,7)),[direction,dx,dy]=rng.pick(directions),shape=rng.pick(shapes),x=dx<0?k+1:1,y=dy<0?k+1:1,cells=shape.map(([a,b])=>[a+x,b+y]),extent=Math.max(...shape.map(p=>dx?p[0]:p[1]))+1;
    return {k,direction,cells,after:cells.map(([a,b])=>[a+dx*k,b+dy*k]),...errors(wrong(k+1,'출발 칸도 세기','출발한 칸까지 세어 {over}칸이라고 했습니다. 출발한 칸을 빼고 옮긴 칸만 세면 {answer}칸입니다.'),wrong(k-extent,'도형 사이 빈 칸만 세기',`두 도형 사이의 빈칸만 세어 ${k-extent}칸이라고 했습니다. 같은 꼭짓점이 옮겨 간 칸을 세면 ${k}칸입니다.`)),over:k+1};},
  answer:v=>v.k,check:v=>Math.abs(v.after[0][0]-v.cells[0][0])+Math.abs(v.after[0][1]-v.cells[0][1]),
  art:v=>({kind:'grid',w:11,h:11,cells:v.cells,after:v.after,labels:true,wide:true}),
  solution: "1번 도형의 한 꼭짓점에서 2번 도형의 같은 꼭짓점까지 {direction}으로 옮긴 칸을 세면 {answer}칸입니다.\n따라서 1번 도형을 {direction}으로 {answer}칸 밀면 2번 도형이 됩니다.",
});
