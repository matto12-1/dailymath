import { explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {asymmetry,transforms,sameCells} from './geometry.js?v=9a67f36b25';
// 뒤집기를 배우는 차례(3단계)라 보기는 뒤집기 셋이다: 오른쪽으로, 위쪽으로, 오른쪽으로 뒤집고 위쪽으로. 셋 다 정답이 될 수 있다.
// 늘 오답이던 돌리기 보기 둘은 뺐다(검수 2번). 보기마다 거울 선 그림표와 짧은 말을 붙인다(검수 7번).
const RIGHT='오른쪽으로 뒤집기',UP='위쪽으로 뒤집기',BOTH='오른쪽으로 뒤집고 위쪽으로 뒤집기';
const flips={[RIGHT]:transforms[RIGHT],[UP]:transforms[UP],[BOTH]:p=>transforms[UP](transforms[RIGHT](p))};
const looks={[RIGHT]:{icon:'flip-right',text:'오른쪽으로 뒤집기'},[UP]:{icon:'flip-up',text:'위쪽으로 뒤집기'},[BOTH]:{icon:'flip-both',text:'오른쪽으로, 위쪽으로 뒤집기'}};
const changed={[RIGHT]:'위쪽과 아래쪽은 그대로이고 왼쪽과 오른쪽이 바뀝니다.',[UP]:'왼쪽과 오른쪽은 그대로이고 위쪽과 아래쪽이 바뀝니다.',[BOTH]:'왼쪽과 오른쪽, 위쪽과 아래쪽이 모두 바뀝니다.'};
const mistake=(answer,pick)=>wrong(pick,pick===BOTH?'두 번 뒤집기':'뒤집는 방향 바꾸기',
  '「'+looks[pick].text+'」를 골랐습니다. '+(pick===BOTH?'두 방향이 모두 바뀌는 움직임을 골랐지만 ':pick===RIGHT?'왼쪽과 오른쪽만 바뀌는 움직임을 골랐지만 ':'위쪽과 아래쪽만 바뀌는 움직임을 골랐지만 ')+changed[answer].replace('바뀝니다.','바뀐 모양이므로 ')+ '알맞은 움직임은 「'+looks[answer].text+'」입니다.');

export default define(meta('movement','reverse',2,'shape',['03-04'],'뒤집은 도형 찾기'),{
  answerKind:'text',texts:["1번 도형을 어떻게 뒤집으면 2번 도형이 될까요?","1번 도형을 어떻게 뒤집으면 2번 도형이 될까요?"],
  draw: explain(function(rng) {const cells=asymmetry(rng);if(!cells)return null;const options=Object.keys(flips),answer=rng.pick(options),after=cells.map(flips[answer]);return {cells,after,options,answer,action:answer.replace(/뒤집기$/,"뒤집으면"),...errors(...options.filter(s=>s!==answer).map(s=>mistake(answer,s)))};}, v => {const p=v.cells.find(p=>{const q=flips[v.answer](p);return p[0]!==q[0]||p[1]!==q[1]}),q=flips[v.answer](p);return ['1번의 왼쪽에서 ' + (p[0]+1) + '번째, 위에서 ' + (p[1]+1) + '번째 칸은 2번 도형에서 왼쪽에서 '+(q[0]+1)+'번째, 위에서 '+(q[1]+1)+'번째에 있습니다.', changed[v.answer]];}),
  answer:v=>v.answer,check:v=>Object.keys(flips).find(s=>sameCells(v.cells.map(flips[s]),v.after)),
  isCorrect:(v,c)=>!!flips[c]&&sameCells(v.cells.map(flips[c]),v.after),choiceLook:c=>looks[c],
  art:v=>({kind:'grid',panels:[{number:1,w:5,h:5,cells:v.cells},{number:2,w:5,h:5,cells:v.after}],wide:true}),
  solution: "{process}\n따라서 1번 도형을 {action} 2번 도형이 됩니다.",
});
