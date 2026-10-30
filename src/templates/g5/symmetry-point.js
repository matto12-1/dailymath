import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {completedPanels,rotateCells,sameCells} from './symmetry-helpers.js?v=9a67f36b25';
export default define(meta('symmetry','point',3,'shape',['03-02'],'점대칭으로 완성하기'),{
 answerKind:'text',back:'g4s1-shape-movement',texts:['가운데 점을 대칭의 중심으로 하여 완성한 그림은 어느 것일까요?','가운데 점을 대칭의 중심으로 하는 점대칭도형을 완성한 그림은 어느 것일까요?'],
 draw(rng){const v=completedPanels(rng,true);if(!v)return null;return {...v,options:v.panels.map(p=>p.number+'번'),...errors(wrong(v.panels.find(p=>p.variant==='other').number+'번','선대칭으로 뒤집기','{value} 그림은 선대칭도형처럼 뒤집은 그림입니다. 가운데 점을 중심으로 180° 돌려 처음 부분과 겹치는 그림은 {answer:입니다}.'),wrong(v.panels.find(p=>p.variant==='translate').number+'번','돌리지 않고 옮기기','{value} 그림은 돌리지 않고 반대쪽으로 옮긴 그림입니다. 가운데 점에서 서로 반대쪽으로 같은 거리에 있는 칸끼리 짝을 이루는 그림은 {answer:입니다}.'))};},
 answer:v=>v.panels.find(p=>sameCells(rotateCells(p.cells),p.after)).number+'번',check:v=>v.panels.find(p=>sameCells(p.after,rotateCells(p.cells))).number+'번',
 isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&sameCells(rotateCells(p.cells),p.after)),
 art:v=>({kind:'grid',panels:v.panels,wide:true}),solution:'가운데 점에서 서로 반대쪽으로 같은 거리에 있는 칸끼리 짝짓습니다. {answer} 그림의 더한 부분을 가운데 점을 중심으로 180° 돌리면 처음 부분과 완전히 겹칩니다.\n따라서 점대칭도형을 완성한 그림은 {answer:입니다}.',
});
