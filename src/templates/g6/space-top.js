import {numeric,meta,wrong,countCells,totalCubes} from './helpers.js?v=9a67f36b25';
import {connectedStack} from '../../art/cube-visibility.js?v=9a67f36b25';

export default numeric(meta('space','top',2,'shape',['03-10'],'위에서 본 칸 수'),{
 minMistakes:2,errorCount:2,cases:Array.from({length:511},(_,i)=>Array.from({length:3},(_,y)=>Array.from({length:3},(_,x)=>(i+1)>>(y*3+x)&1?(y+1):0))).filter(h=>countCells(h)>=2&&countCells(h)<=6&&totalCubes(h)>countCells(h)&&connectedStack(h)).map(heights=>({heights})),
 decorate:v=>({rowCounts:v.heights.map(row=>row.filter(Boolean).length).join(' + ')}),
 texts:['위에서 보면 쌓기나무가 있는 칸은 몇 칸일까요?','위에서 본 모양은 모두 몇 칸을 차지할까요?'],
 answer:v=>countCells(v.heights),check:v=>v.heights.map(row=>row.filter(n=>n!==0).length).reduce((a,b)=>a+b,0),
 errors:v=>[wrong(totalCubes(v.heights),'높이까지 모두 더하기','쌓기나무 {value}개를 모두 세었습니다. 높이를 빼고 자리마다 한 칸씩 세면 {rowCounts} = {answer}칸입니다.'),wrong(v.heights[0].filter(Boolean).length,'맨 앞줄만 세기','위에서 본 맨 앞줄만 {value}칸 세었습니다. 뒷줄도 합하면 {rowCounts} = {answer}칸입니다.')],
 art:v=>({kind:'cubes',heights:v.heights,views:['iso'],wide:true}),solution:'같은 자리에 여러 층으로 쌓여도 한 칸입니다. 앞줄부터 쌓기나무가 있는 칸을 합하면 {rowCounts} = {answer}칸입니다.\n따라서 쌓기나무가 있는 칸은 {answer}칸입니다.',
});
