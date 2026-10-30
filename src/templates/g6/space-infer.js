import { explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,pictureHints,frontHeights,sideHeights} from './helpers.js?v=9a67f36b25';
import {inferVars,signature,spaceHints} from './space-helpers.js?v=9a67f36b25';
const processByShape = new WeakMap();
export default define(meta('space','infer',3,'shape',['03-10'],'세 방향으로 쌓은 모양 추측하기'),{
 errorCount:3,answerKind:'text',answerValues:['1번','2번','3번','4번'],texts:['위, 앞, 옆에서 본 모양이 그림과 같도록 쌓기나무를 쌓은 것은 어느 것일까요?','위, 앞, 옆에서 본 모양의 그림에 모두 맞는 모양은 어느 것일까요?'],
 draw:explain(rng=>inferVars(rng), v => {let lines=processByShape.get(v.heights);if(lines)return lines;const row=r=>r.every(n=>n===0)?'2칸 모두 비어 있습니다.':r.every(Boolean)?'왼쪽과 오른쪽 2칸을 차지합니다.':r[0]?'왼쪽 1칸만 차지합니다.':'오른쪽 1칸만 차지합니다.';lines=['위에서 본 앞줄은 '+row(v.heights[0])+' 뒷줄은 '+row(v.heights[1]),'앞에서 본 모양은 왼쪽부터 '+frontHeights(v.heights).map(n=>n+'층').join(', ')+', 옆에서 본 모양은 앞쪽부터 '+sideHeights(v.heights).map(n=>n+'층').join(', ')+'입니다.'];processByShape.set(v.heights,lines);return lines;}),answer:v=>v.panels.find(p=>signature(p.heights)===signature(v.heights)).number+'번',check:v=>v.panels.find(p=>JSON.stringify(p.heights)===JSON.stringify(v.heights)).number+'번',isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&signature(p.heights)===signature(v.heights)),guessHints:[pictureHints,spaceHints],
 art:v=>({kind:'cubes',expand:true,heights:v.heights,views:['top','front','side'],panels:v.panels,wide:true}),solution:'{process}\n따라서 세 방향에서 본 모양이 모두 같은 것은 {answer:입니다}.',
});
