import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {integerSides,quad,equalSides,sideLengths} from './geometry.js?v=9a67f36b25';
export default define(meta('quadrilaterals','rhombus',3,'shape',['03-10'],'네 변의 길이가 같은 사각형'),{
  answerKind:'text',texts:['단위는 cm입니다. 네 변의 길이가 모두 같은 그림은 어느 것일까요?','단위는 cm입니다. 네 변의 길이가 같은 사각형은 어느 것일까요?'],
  draw(rng){const panels=rng.shuffle([rng.pick(['square','rhombus']),'parallelogram','rectangle','trapezoid'].map(type=>({points:quad(type,rng),type,rotation:rng.int(0,3)*90}))).map((p,i)=>({...p,number:i+1}));return {panels,options:panels.map(p=>`${p.number}번`),...errors(wrong(`${panels.find(p=>p.type==='parallelogram').number}번`,'평행하면 변도 같다고 보기',`평행한 변이 두 쌍인 것만 보고 ${panels.find(p=>p.type==="parallelogram").number}번을 골랐습니다. 이웃한 두 변의 길이까지 같아 네 변의 길이가 모두 같은 그림은 ${panels.find(p=>equalSides(p.points)).number}번입니다.`),wrong(`${panels.find(p=>p.type==='rectangle').number}번`,'직각이면 네 변도 같다고 보기',`네 각이 모두 직각인 것만 보고 ${panels.find(p=>p.type==="rectangle").number}번을 골랐습니다. 네 각의 크기와 관계없이 네 변의 길이가 모두 같은 그림은 ${panels.find(p=>equalSides(p.points)).number}번입니다.`))};},
  answer:v=>`${v.panels.find(p=>equalSides(p.points)).number}번`,check:v=>`${v.panels.find(p=>{const ls=sideLengths(p.points);return Math.max(...ls)-Math.min(...ls)<1e-7;}).number}번`,
  isCorrect:(v,c)=>v.panels.some(p=>`${p.number}번`===c&&equalSides(p.points)),
  // 변 길이에는 cm를 붙이지 않고 단위는 문제 글에 한 번 쓴다. 「4.9 cm」 넷이 단추 폭을 차지해 폰 두 칸 단추에서 글자가 11px였다(검수 14번).
  art:v=>({kind:'polygon',panels:v.panels.map(p=>({...p,labels:{sides:integerSides(p.points).map(String)}})),largePanels:'tiles'}),
  solution: "그림마다 네 변의 길이를 비교하면 {answer}만 네 변의 길이가 모두 같습니다.\n네 변의 길이가 모두 같은 사각형은 마름모입니다.\n따라서 알맞은 그림은 {answer}입니다.",
});
