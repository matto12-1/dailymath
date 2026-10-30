import { say } from '../solution-process.js?v=9a67f36b25';
import {connectedStack} from '../../art/cube-visibility.js?v=9a67f36b25';
import {numeric,meta,seq,wrong,countCells} from './helpers.js?v=9a67f36b25';
const cases=seq(1,511).map(mask=>({heights:Array.from({length:3},(_,y)=>Array.from({length:3},(_,x)=>mask>>(y*3+x)&1))})).filter(v=>countCells(v.heights)>=4&&countCells(v.heights)<=8&&v.heights[0].some(Boolean)&&connectedStack(v.heights));
export default numeric(meta('space','visible',1,'shape',['03-09'],'한 층 쌓기나무 세기'),{
 minMistakes:2,errorCount:2,cases:cases.filter(v=>v.heights.at(-1).some(Boolean)&&v.heights[0].filter(Boolean).length!==countCells(v.heights)-v.heights.at(-1).filter(Boolean).length),texts:['한 층으로 놓은 쌓기나무는 모두 몇 개일까요?','쌓기나무를 한 층으로 놓았습니다. 모두 몇 개일까요?'],
 decorate:v=>{const rows=v.heights.map(row=>row.filter(Boolean).length).filter(Boolean);return {process:['앞줄부터 줄마다 쌓기나무를 세면 '+rows.map(n=>n+'개').join(', ')+'입니다.', rows.join(' + ')+' = '+say(rows.reduce((a,b)=>a+b,0))].join('\n')};},
 answer:v=>countCells(v.heights),check:v=>v.heights.reduce((s,row)=>s+row.reduce((a,b)=>a+b,0),0),
 errors:v=>[wrong(v.heights[0].filter(Boolean).length,'맨 앞줄만 세기','맨 앞줄의 쌓기나무만 세었습니다. 뒤에 놓인 줄도 더하여 한 칸씩 세면 {answer}개입니다.'),wrong(v.heights.flat().filter(Boolean).length-v.heights.at(-1).filter(Boolean).length,'맨 뒷줄 빠뜨리기','맨 뒷줄의 쌓기나무를 빼고 {value}개만 세었습니다. 빠뜨린 뒷줄까지 합하면 {answer}개입니다.')],
 art:v=>({kind:'cubes',heights:v.heights,views:['iso'],wide:true}),solution:'{process}\n따라서 쌓기나무는 모두 {answer}개입니다.',
});
