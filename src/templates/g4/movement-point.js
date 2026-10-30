import { j, explain, count } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
const directions=[['오른쪽',1,0],['왼쪽',-1,0],['위쪽',0,-1],['아래쪽',0,1]];
// 보기에 방향 화살표를 붙여 방향은 한눈에, 칸 수는 글로 견준다(검수 7번).
const arrows={오른쪽:'arrow-right',왼쪽:'arrow-left',위쪽:'arrow-up',아래쪽:'arrow-down'};
export default define(meta('movement','point',2,'shape',['03-05'],'점이 움직인 방향과 칸 수'),{
  answerKind:'text',texts:["점 1을 점 2의 자리로 옮기려면 어느 쪽으로 몇 칸 옮겨야 할까요?","점 1을 점 2의 자리로 옮기려면 어느 쪽으로 몇 칸 옮겨야 할까요?"],
  draw: explain(function(rng) {const i=rng.int(0,3),[direction,dx,dy]=directions[i],k=rng.int(2,5),delta=rng.pick([-1,1]),from=[6+rng.int(-1,1),6+rng.int(-1,1)],to=[from[0]+dx*k,from[1]+dy*k],answer=`${direction}으로 ${k}칸`,options=[answer,`${directions[i^1][0]}으로 ${k}칸`,`${direction}으로 ${k+delta}칸`,`${directions[i^1][0]}으로 ${k+delta}칸`];return {from,to,k,direction,options,answer,...errors(wrong(options[1],'이동 방향 반대로 읽기',`방향을 반대로 보고 「${options[1]}」을 골랐습니다. 점 2는 점 1의 ${direction}에 있으므로 ${answer} 옮기면 점 2의 자리에 갑니다.`),wrong(options[2],delta<0?'도착 점 빼고 세기':'출발 점까지 세기',`점을 하나 ${delta<0?"덜":"더"} 세어 「${options[2]}」을 골랐습니다. ${delta<0?"도착한 점까지 세면":"출발한 점을 빼고 세면"} ${k}칸이므로 ${answer} 옮깁니다.`))};}, v => [('점 ' + j("2", "은/는") + ' 점 1의 ') + v.direction + '에 있습니다.', '출발한 점을 빼고 점 2까지 지나간 칸을 세면 ' + v.k + '칸입니다.']),
  answer:v=>v.answer,check:v=>{const dx=v.to[0]-v.from[0],dy=v.to[1]-v.from[1];return `${dx>0?'오른쪽':dx<0?'왼쪽':dy<0?'위쪽':'아래쪽'}으로 ${Math.abs(dx)+Math.abs(dy)}칸`;},
  isCorrect:(v,c)=>{const d=directions.find(([name])=>c===`${name}으로 ${v.k}칸`);return !!d&&v.from[0]+d[1]*v.k===v.to[0]&&v.from[1]+d[2]*v.k===v.to[1];},
  choiceLook:c=>({icon:arrows[c.split('으로')[0]],text:c}),
  art:v=>({kind:'grid',w:12,h:12,from:v.from,to:v.to,wide:true}),solution: "{process}\n따라서 점 1을 {answer} 옮기면 점 2의 자리에 갑니다.",
});
