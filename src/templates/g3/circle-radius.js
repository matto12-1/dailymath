import {define,wrong,errors} from './helpers.js?v=9a67f36b25';
import {meta,circleNames} from './shape-helpers.js?v=9a67f36b25';
const definitions={center:'원의 한가운데에 있는 점',radius:'원의 중심과 원 위의 한 점을 이은 선분',diameter:'원의 중심을 지나도록 원 위의 두 점을 이은 선분'};
export default define(meta('circle','radius',1,['06'],'중심과 반지름과 지름'),{
  answerKind:'text',errorCount:2,
  texts:['주황색으로 표시한 것의 이름은 무엇일까요?','주황색으로 표시한 것의 알맞은 이름은 무엇일까요?'],
  draw(rng){const target=rng.pick(['center','radius','diameter']),options=Object.values(circleNames),others=Object.entries(circleNames).filter(([key])=>key!==target);
    return {target,definition:definitions[target],rotation:rng.int(0,35)*10,options,...errors(...others.map(([key,name])=>wrong(name,`${name}을 ${circleNames[target]}으로 보기`,`${name}을 골랐지만 ${name}은 ${definitions[key]}입니다. ${name}과 달리 주황색으로 표시한 것은 ${definitions[target]}이므로 ${circleNames[target]}입니다.`)))};},
  answer:v=>circleNames[v.target],check:v=>v.target==='center'?'원의 중심':v.target==='diameter'?'지름':'반지름',
  isCorrect:(v,c)=>circleNames[v.target]===c,
  art:v=>({kind:'circle',r:3,show:['center','radius','diameter'],target:v.target,rotation:v.rotation}),
  solution:'주황색으로 표시한 것은 {definition}입니다.\n따라서 표시한 것은 {answer:입니다}.',
});
