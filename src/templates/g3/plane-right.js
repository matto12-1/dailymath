import {define,errors,wrong} from './helpers.js?v=9a67f36b25';
import {numberedPanels as numbered} from '../g4/geometry.js?v=9a67f36b25';
import {meta} from './shape-helpers.js?v=9a67f36b25';
export default define(meta('plane','right',2,['02'],'직각 찾기'),{
  answerUnit:'번',errorCount:2,range:{min:0,max:9999},answerSpan:[1,2,3,4],
  texts:['그림에서 직각은 어느 것일까요?','그림에서 직각은 어느 것일까요?'],
  draw(rng){const panels=numbered(rng,[90,45,120,60].map(deg=>({deg,rotation:rng.int(0,35)*10,armLengths:[rng.int(85,130),rng.int(85,130)]})),p=>p.deg===90);
    return {panels,options:[1,2,3,4],...errors(wrong(panels.find(p=>p.deg===45).number,'좁게 벌어진 각 고르기',`${panels.find(p=>p.deg===45).number}번은 직각보다 좁게 벌어진 각입니다. 삼각자의 직각 부분을 대어 꼭 맞는 각은 ${panels.find(p=>p.deg===90).number}번입니다.`),wrong(panels.find(p=>p.deg===120).number,'더 넓게 벌어진 각 고르기',`${panels.find(p=>p.deg===120).number}번은 직각보다 넓게 벌어진 각입니다. 삼각자의 직각 부분과 크기가 같은 각은 ${panels.find(p=>p.deg===90).number}번입니다.`))};},
  answer:v=>v.panels.find(p=>p.deg===90).number,
  check:v=>v.panels.find(p=>Math.abs(Math.cos(p.deg*Math.PI/180))<1e-8).number,
  isCorrect:(v,c)=>v.panels.some(p=>p.number===c&&p.deg===90),
  art:v=>({kind:'angle',panels:v.panels,largePanels:true}),solution:"종이를 반듯하게 두 번 접었을 때 생기는 각이 직각입니다. {answer}번에 삼각자의 직각 부분을 대어 보면 꼭 맞습니다.\n따라서 직각은 {answer}번입니다.",
});
