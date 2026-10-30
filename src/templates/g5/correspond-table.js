import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import {define,meta,casesSpec,errors,wrong,pairs,tableArt} from './helpers.js?v=9a67f36b25';
const cases=pairs(2,9,1,20).map(({a:k,b:x})=>({k,x})),answer=v=>v.k*(v.x+2);
export default define(meta('correspond','table',1,'life',['02-01'],'표의 빈 수 찾기'),{
 input:'number',texts:['표는 {topName:과/와} {bottomName} 사이의 대응 관계를 나타낸 것입니다. 빈칸에 알맞은 수는 몇일까요?','표는 {topName:과/와} {bottomName} 사이의 대응 관계를 나타낸 것입니다. 빈칸에 알맞은 수는 몇일까요?'],
 ...casesSpec(cases,answer,v=>v.k*v.x+v.k+v.k,explain((v,rng)=>{const head=v.k===2&&rng.next()<.5?'자전거 수|바퀴 수':'상자 수|연필 수';return {...v,topName:head.split('|')[0],bottomName:head.split('|')[1],next:v.x+2,head,previous:v.k*(v.x+1),...errors(wrong(v.k*(v.x+1)+1,'입력이 늘어난 만큼만 더하기','{topName:이/가} 1 커지므로 {bottomName}도 {previous}에서 1만 더했습니다. {bottomName:은/는} {topName}의 {k}배이므로 {next} × {k} = {answer:입니다}.'),wrong(v.k*(v.x+1),'앞의 값 그대로 쓰기','바로 앞 칸의 {bottomName} {previous:을/를} 그대로 썼습니다. {topName:이/가} 1 늘 때 {bottomName:은/는} {k} 늘어나므로 앞 칸 {previous}에 {k:을/를} 더하면 {answer:입니다}.'))};}, v => {v.topName=v.head.split('|')[0];v.bottomName=v.head.split('|')[1];return [v.topName+'에 '+j(v.k,'을/를')+' 곱하면 '+v.bottomName+'가 됩니다. '+v.x+' × '+v.k+' = '+say(v.k*v.x)+' '+(v.x+1)+' × '+v.k+' = '+say(v.previous), v.topName+'가 '+(v.x+2)+'일 때 '+v.bottomName+'는 '+(v.x+2)+' × '+v.k+' = '+say(v.k*(v.x+2))];})),
 art:v=>({...tableArt([[v.head.split('|')[0],v.x,v.x+1,v.x+2],[v.head.split('|')[1],v.k*v.x,v.previous,'□']]),fontSize:28,columnWidths:[128,72,72,72]}),
 solution:"{process}\n따라서 빈칸에 알맞은 수는 {answer:입니다}.",
});
