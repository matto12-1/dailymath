import {numeric,meta,wrong,totalCubes,countCells} from './helpers.js?v=9a67f36b25';

import {uniqueStacks} from './space-helpers.js?v=9a67f36b25';
export default numeric(meta('space','hidden',3,'shape',['03-09'],'숨은 쌓기나무 세기'),{
 minMistakes:2,cases:uniqueStacks.filter(h=>countCells(h)>=3&&h.flat().some(n=>n>=2)&&countCells(h)!==h.flat().filter(n=>n>=2).length).map(heights=>({heights})),
 texts:['위, 앞, 옆에서 본 모양을 보고 가려진 것까지 세면 쌓기나무는 모두 몇 개일까요?','위, 앞, 옆에서 본 모양이 그림과 같도록 쌓은 쌓기나무는 모두 몇 개일까요?'],
 answer:v=>totalCubes(v.heights),check:v=>v.heights[0].reduce((a,b)=>a+b,0)+v.heights[1].reduce((a,b)=>a+b,0),decorate:v=>({amounts:v.heights.flat().filter(Boolean).map(n=>n+'개').join(', '),counts:v.heights.flat().filter(Boolean).join(' + ')}),
 errors:v=>[wrong(countCells(v.heights),'위에서 차지하는 칸만 세기','위에서 본 모양의 칸 수만 세었습니다. 각 자리에 쌓인 수를 모두 더하면 {counts} = {answer}개입니다.'),wrong(Math.max(...v.heights.flat())*countCells(v.heights),'모든 자리를 가장 높은 층으로 세기','모든 자리에 가장 높은 탑만큼 쌓인 것으로 보아 {value}개를 썼습니다. 낮은 자리의 층수도 그림대로 세면 {counts} = {answer}개입니다.')],
 art:v=>({kind:'cubes',heights:v.heights,views:['iso','top','front','side'],wide:true}),solution:'앞과 옆에서 본 모양으로 위에서 본 모양의 자리마다 쌓인 쌓기나무의 수를 알아보면 {amounts:입니다}. {counts} = {answer:입니다}.\n따라서 쌓기나무는 모두 {answer}개입니다.',
});
