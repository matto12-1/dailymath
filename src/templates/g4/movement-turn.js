import { explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {asymmetry,transforms,sameCells} from './geometry.js?v=9a67f36b25';
// 보기는 돌리기 셋과 뒤집기 하나이고, 넷 다 정답이 될 수 있다. 뒤집기 보기가 늘 오답이던 것을 고쳤고 묻는 글도 돌리기라고 알려 주지 않는다(검수 2번).
// 보기마다 시곗바늘 그림표(돌리기)와 거울 선 그림표(뒤집기)를 붙인다(검수 7번).
const looks={'시계 방향으로 90°만큼 돌리기':{icon:'turn-cw-90',text:'시계 방향으로 90°만큼'},'시계 방향으로 180°만큼 돌리기':{icon:'turn-180',text:'시계 방향으로 180°만큼'},'시계 반대 방향으로 90°만큼 돌리기':{icon:'turn-ccw-90',text:'시계 반대 방향으로 90°만큼'},'오른쪽으로 뒤집기':{icon:'flip-right',text:'오른쪽으로 뒤집기'},'위쪽으로 뒤집기':{icon:'flip-up',text:'위쪽으로 뒤집기'}};
export default define(meta('movement','turn',3,'shape',['03-04'],'도형 돌리기'),{
  answerKind:'text',errorCount:3,texts:["1번 도형을 어떻게 움직이면 2번 도형이 될까요?","1번 도형을 어떻게 움직이면 2번 도형이 될까요?"],
  draw: explain(function(rng) {const cells=asymmetry(rng);if(!cells)return null;const turns=Object.keys(transforms).slice(2),other=rng.pick(Object.keys(transforms).slice(0,2)),options=[...turns,other],answer=rng.pick(options),after=cells.map(transforms[answer]),near=rng.pick(turns.filter(s=>s!==answer));return {cells,after,options,answer,action:answer.replace(/돌리기$/,"돌리면").replace(/뒤집기$/,"뒤집으면"),...errors(...(answer===other?turns.map(near=>wrong(near,'뒤집기를 돌리기로 보기',`「${looks[near].text}」을 골랐습니다. 「${looks[near].text}」처럼 돌린 모양과 달리 2번 도형은 ${answer.includes("오른쪽")?"왼쪽과 오른쪽":"위쪽과 아래쪽"}이 거울처럼 바뀌었으므로 알맞은 움직임은 「${answer}」입니다.`)):[wrong(near,'돌린 각이나 방향 혼동',`「${near}」를 골랐습니다. 가운데 점을 중심으로 칸이 옮겨 간 자리를 따라가면 알맞은 움직임은 「${answer}」입니다.`),wrong(other,'돌리기를 뒤집기로 보기',`「${looks[other].text}」를 골랐습니다. 2번 도형은 거울처럼 바뀐 모양이 아니라 돌린 모양이므로 알맞은 움직임은 「${answer}」입니다.`)]))};}, v => {const p=v.cells.find(p=>{const q=transforms[v.answer](p);return p[0]!==q[0]||p[1]!==q[1]}),q=transforms[v.answer](p);return ['1번의 왼쪽에서 ' + (p[0]+1) + '번째, 위에서 ' + (p[1]+1) + '번째 칸이 2번에서는 왼쪽에서 ' + (q[0]+1) + '번째, 위에서 ' + (q[1]+1) + '번째로 갑니다.', v.answer.includes('뒤집')?(v.answer.includes('오른쪽')?'위쪽과 아래쪽은 그대로이고 왼쪽과 오른쪽이 거울처럼 바뀌었습니다.':'왼쪽과 오른쪽은 그대로이고 위쪽과 아래쪽이 거울처럼 바뀌었습니다.')+' 돌린 것이 아니라 뒤집은 모양입니다.':'가운데 점을 중심으로 ' + (v.answer.includes('180')?'반 바퀴인 180°':'4분의 1바퀴인 90°') + '만큼 ' + (v.answer.includes('반대')?'시계 반대 방향':'시계 방향') + '으로 돌린 모양입니다.'];}),
  answer:v=>v.answer,check:v=>Object.keys(transforms).find(s=>sameCells(v.cells.map(transforms[s]),v.after)),
  isCorrect:(v,c)=>!!transforms[c]&&sameCells(v.cells.map(transforms[c]),v.after),choiceLook:c=>looks[c],
  art:v=>({kind:'grid',expand:true,panels:[{number:1,w:5,h:5,cells:v.cells,dot:[2.5,2.5]},{number:2,w:5,h:5,cells:v.after,dot:[2.5,2.5]}],wide:true}),
  solution: "{process}\n따라서 1번 도형을 {action} 2번 도형이 됩니다.",
});
