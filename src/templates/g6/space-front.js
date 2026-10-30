import {define,meta,wrong,errors,frontHeights} from './helpers.js?v=9a67f36b25';
import {cubeVisibility} from '../../art/cube-visibility.js?v=9a67f36b25';
const label=p=>p.join('층 · ')+'층';
export default define(meta('space','front',2,'shape',['03-10'],'앞에서 본 높이'),{
 answerKind:'text',choiceOrder:c=>{const [a,b]=c.match(/\d+/g).map(Number);return a*100+b;},errorCount:3,answerValues:[2,3,4,5].flatMap(a=>[2,3,4,5].map(b=>label([a,b]))),texts:['앞에서 본 모양에서 왼쪽 줄과 오른쪽 줄은 각각 몇 층일까요?','앞에서 본 모양에서 왼쪽 줄과 오른쪽 줄은 각각 몇 층일까요?'],
 // 앞뒤 높이가 같은 답(3층 · 3층)도 네 문제 중 하나쯤 나온다. 전엔 늘 달라서 「가장 높은 높이를 모든 자리에 쓰기」(같은 두 수)가 늘 오답으로만 나왔다(검수 2번).
 draw(rng){
 const a=rng.int(2,5),b=rng.int(2,5),lowA=rng.int(1,a-1),lowB=rng.int(1,b-1);
 const candidates=[[[a,lowB],[lowA,b]],[[lowA,b],[a,lowB]]].filter(h=>{
   const visible=cubeVisibility(h).topAreas;
   return h[0].every((_,x)=>h.some((row,y)=>row[x]===Math.max(...h.map(r=>r[x]))&&(visible[`${x},${y}`]??0)>=242)) && !(h[1][0]>h[0][0]&&h[1][0]<=h[0][1]);
 });
 const heights=rng.pick(candidates),correct=frontHeights(heights);
 const lower=rng.pick([lowA,lowB]),altA=a===b?lower:b,altB=a===b?lower:a,pairs=[[a,b],[altA,b],[a,altB],[altA,altB]];
 const reason=(q,i)=>{
  const focus=q[0]!==a&&q[1]!==b?'두 줄을 각각 앞뒤로 비교하면':q[0]!==a?'왼쪽 줄을 앞뒤로 비교하면':'오른쪽 줄을 앞뒤로 비교하면';
  return label(q)+'으로 층수를 읽었습니다. '+focus+' 왼쪽은 '+a+'층, 오른쪽은 '+b+'층이므로 {answer:입니다}.';
 };
 return {heights,frontLeft:heights[0][0],backLeft:heights[1][0],frontRight:heights[0][1],backRight:heights[1][1],left:a,right:b,options:pairs.map(label),...errors(...pairs.slice(1).map((q,i)=>wrong(label(q),'앞뒤 높이 잘못 읽기',reason(q,i+1))))};
 },
 answer:v=>label(frontHeights(v.heights)),check:v=>label(v.heights[0].map((n,x)=>Math.max(n,v.heights[1][x]))),isCorrect:(v,c)=>c===label(frontHeights(v.heights)),
 guessHints:[({choices})=>{const pairs=choices.map(s=>s.match(/\d+/g).map(Number));return {'largest-height':pairs.map(p=>p[0]+p[1]),'smallest-height':pairs.map(p=>-p[0]-p[1]),'same-heights':pairs.map(p=>+(p[0]===p[1]))};}],
 art:v=>({kind:'cubes',heights:v.heights,views:['iso'],wide:true}),solution:'왼쪽 줄은 앞 {frontLeft}층과 뒤 {backLeft}층 중 높은 {left}층까지 보입니다. 오른쪽 줄은 앞 {frontRight}층과 뒤 {backRight}층 중 높은 {right}층까지 보입니다.\n따라서 왼쪽부터 {answer:입니다}.',
});
