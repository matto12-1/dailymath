import {explain} from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {alignedPointHints} from '../../engine/guess.js?v=9a67f36b25';
export default define(meta('movement','direction',3,'shape',['03-05'],'두 번 옮긴 점 찾기'),{
  answerKind:'text',errorCount:3,guessHints:[alignedPointHints],
  texts:['점 0을 {horizontal}으로 {a}칸, {vertical}으로 {b}칸 옮긴 점은 어느 것일까요?'],
  draw:explain(function(rng){
    const a=rng.int(2,4),b=rng.int(2,4),dx=rng.pick([-1,1]),dy=rng.pick([-1,1]),from=[5,5];
    const targets=rng.shuffle([{sx:dx,sy:dy,type:'correct'},{sx:-dx,sy:dy,type:'horizontal'},{sx:dx,sy:-dy,type:'vertical'},{sx:-dx,sy:-dy,type:'both'}]).map((p,i)=>({...p,to:[5+p.sx*a,5+p.sy*b],number:i+1,color:['#a8bfa0','#a99bbd','#8fb9d2','#d98980'][i]}));
    const answer=targets.find(p=>p.type==='correct').number+'번',horizontal=dx>0?'오른쪽':'왼쪽',vertical=dy>0?'아래쪽':'위쪽';
    return {a,b,dx,dy,from,targets,answer,horizontal,vertical,options:targets.map(p=>p.number+'번'),...errors(...targets.filter(p=>p.type!=='correct').map(p=>wrong(p.number+'번',p.type==='both'?'두 방향 모두 반대로 옮기기':p.type==='horizontal'?'가로 방향 반대로 옮기기':'세로 방향 반대로 옮기기',
      `${p.number}번은 점 0을 ${p.sx>0?'오른쪽':'왼쪽'}으로 ${a}칸, ${p.sy>0?'아래쪽':'위쪽'}으로 ${b}칸 옮긴 점입니다. ${p.type==='horizontal'?'가로 방향을':p.type==='vertical'?'세로 방향을':'두 방향을'} 바로잡아 ${horizontal}으로 ${a}칸, ${vertical}으로 ${b}칸 옮기면 ${answer}입니다.`)))};
  },v=>['점 0에서 '+v.horizontal+'으로 '+v.a+'칸 옮깁니다.','도착한 곳에서 '+v.vertical+'으로 '+v.b+'칸 옮깁니다.']),
  answer:v=>v.answer,check:v=>v.targets.find(p=>p.to[0]===5+v.dx*v.a&&p.to[1]===5+v.dy*v.b).number+'번',
  isCorrect:(v,c)=>v.targets.some(p=>p.number+'번'===c&&p.to[0]===5+v.dx*v.a&&p.to[1]===5+v.dy*v.b),
  art:v=>({kind:'grid',expand:true,w:10,h:10,fromNumber:0,from:v.from,targets:v.targets,targetChoices:true,panels:v.targets,wide:true}),
  solution:'{process}\n따라서 도착한 점은 {answer:입니다}.',
});
