import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
const names=['예각','직각','둔각'];
const classify=d=>d<90?'예각':d===90?'직각':'둔각';
export default define(meta('angles','kind',2,'shape',['03-02'],'예각과 직각과 둔각'),{
  answerKind:'text',choiceOrder:['예각','직각','둔각'],texts:['그림의 각은 어떤 각일까요?','그림의 각에 가장 알맞은 이름은 무엇일까요?'],
  draw(rng){const category=rng.int(0,2),deg=category===1?90:category===0?rng.int(20,70):rng.int(110,160),options=names,wrongNames=names.filter(n=>n!==classify(deg));return {deg,comparison:deg<90?"직각보다 작습니다":deg===90?"90°입니다":"직각보다 큽니다",options,rotation:rng.int(0,35)*10,length:rng.int(90,125),...errors(...wrongNames.map(n=>wrong(n,'직각과 비교하지 않기',`${n}을 골랐습니다. ${n==="예각"?"예각은 90°보다 작은 각이지만":n==="직각"?"직각은 90°인 각이지만":"둔각은 90°보다 크고 180°보다 작은 각이지만"} 그림의 각은 ${deg<90?"90°보다 작으므로":deg===90?"90°이므로":"90°보다 크고 180°보다 작으므로"} ${classify(deg)}입니다.`)))};},
  answer:v=>classify(v.deg),check:v=>v.deg===90?'직각':v.deg>90?'둔각':'예각',isCorrect:(v,c)=>c===classify(v.deg),
  art:v=>({kind:'angle',expand:true,deg:v.deg,rotation:v.rotation,armLengths:[v.length,v.length]}),
  solution:'90°보다 작으면 예각, 90°이면 직각, 90°보다 크고 180°보다 작으면 둔각입니다. 그림의 각은 {comparison}.\n따라서 이 각은 {answer:입니다}.',
});
