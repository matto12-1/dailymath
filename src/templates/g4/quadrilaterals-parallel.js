import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {quad,parallelPairs} from './geometry.js?v=9a67f36b25';
export default define(meta('quadrilaterals','parallel',2,'shape',['03-03','03-10'],'평행한 변 두 쌍 찾기'),{
  answerKind:'text',texts:['평행한 변이 두 쌍인 그림은 어느 것일까요?','서로 평행한 변을 두 쌍 찾을 수 있는 그림은 어느 것일까요?'],
  draw(rng){const types=[rng.pick(['square','rectangle','rhombus','parallelogram']),'trapezoid','일반','일반'],panels=rng.shuffle(types.map(type=>({points:quad(type,rng),rotation:rng.int(0,3)*90}))).map((p,i)=>({...p,number:i+1}));if(panels.filter(p=>parallelPairs(p.points)===2).length!==1)return null;return {panels,options:panels.map(p=>`${p.number}번`),...errors(wrong(`${panels.find(p=>parallelPairs(p.points)===1).number}번`,'한 쌍만 평행한 그림 고르기',`평행한 변이 한 쌍뿐인 ${panels.find(p=>parallelPairs(p.points)===1).number}번을 골랐습니다. 평행한 변이 두 쌍인 그림은 ${panels.find(p=>parallelPairs(p.points)===2).number}번입니다.`),wrong(`${panels.find(p=>parallelPairs(p.points)===0).number}번`,'기울기 다른 변을 평행으로 보기',`${panels.find(p=>parallelPairs(p.points)===0).number}번은 마주 보는 변을 늘이면 만나므로 평행한 변이 없습니다. 두 쌍 모두 늘여도 만나지 않는 그림은 ${panels.find(p=>parallelPairs(p.points)===2).number}번입니다.`))};},
  answer:v=>`${v.panels.find(p=>parallelPairs(p.points)===2).number}번`,check:v=>`${v.panels.filter(p=>parallelPairs(p.points)===2)[0].number}번`,
  isCorrect:(v,c)=>v.panels.some(p=>`${p.number}번`===c&&parallelPairs(p.points)===2),art:v=>({kind:'polygon',panels:v.panels,largePanels:true}),
  solution: "마주 보는 두 변을 늘였을 때 만나지 않으면 두 변은 평행합니다.\n{answer:은/는} 마주 보는 변이 두 쌍 모두 평행합니다.\n따라서 알맞은 그림은 {answer}입니다.",
});
