import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {completedPanels,reflectCells,sameCells} from './symmetry-helpers.js?v=9a67f36b25';
export default define(meta('symmetry','line',2,'shape',['03-02'],'선대칭으로 완성하기'),{
 answerKind:'text',back:'g4s1-shape-movement',texts:['점선을 대칭축으로 하여 완성한 그림은 어느 것일까요?','점선을 대칭축으로 하는 선대칭도형을 완성한 그림은 어느 것일까요?'],
 draw(rng){const v=completedPanels(rng,false);if(!v)return null;return {...v,options:v.panels.map(p=>p.number+'번'),...errors(wrong(v.panels.find(p=>p.variant==='turn').number+'번','뒤집는 대신 반 바퀴 돌리기','{value} 그림은 대칭축을 따라 접어 뒤집는 대신 반 바퀴 돌린 그림입니다. 대칭축에서 같은 거리에 있는 칸끼리 포개지는 그림은 {answer:입니다}.'),wrong(v.panels.find(p=>p.variant==='translate').number+'번','뒤집지 않고 옮기기','{value} 그림은 뒤집지 않고 반대쪽으로 옮긴 그림입니다. 대칭축을 따라 뒤집어 대응하는 칸이 완전히 겹치는 그림은 {answer:입니다}.'))};},
 answer:v=>v.panels.find(p=>sameCells(reflectCells(p.cells,p.line),p.after)).number+'번',check:v=>v.panels.find(p=>sameCells(p.after,reflectCells(p.cells,p.line))).number+'번',
 isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&sameCells(reflectCells(p.cells,p.line),p.after)),
 art:v=>({kind:'grid',panels:v.panels,wide:true}),solution:'대칭축에서 같은 거리에 있는 칸끼리 짝짓습니다. 대칭축을 따라 접으면 대응하는 칸이 완전히 겹쳐야 합니다.\n따라서 선대칭도형을 완성한 그림은 {answer:입니다}.',
});
