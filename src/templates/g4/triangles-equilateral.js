import { explain, j } from '../solution-process.js?v=9a67f36b25';
import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
import {triangle,sideLengths} from './geometry.js?v=9a67f36b25';
const countEqual=ps=>{const ls=sideLengths(ps);return ls.every(l=>Math.abs(l-ls[0])<1e-7)?3:ls.some((l,i)=>ls.some((m,j)=>i!==j&&Math.abs(l-m)<1e-7))?2:0;};
// 길이가 같은 변은 0·2·3개뿐이라 보기도 셋이다. 전엔 답이 될 수 없는 1이 늘 보기에 있어(100%) 지우고 찍었다(검수 2번).
export default define(meta('triangles','equilateral',2,'shape',['03-08'],'같은 길이인 변의 수'),{
  answerSpan:[0,2,3],texts:['그림의 삼각형에서 길이가 같은 변은 몇 개일까요?','길이가 같은 변을 모두 세면 몇 개일까요?'],
  draw: explain(function(rng) {const k=cycle(rng,'triangle-equal',[0,2,3]),a=k===3?60:rng.pick([40,50,65,70]),b=k===0?a+rng.pick([5,10,15]):a,points=triangle(a,b),lengths=sideLengths(points).map(l=>Math.round(l*10)/10);if(k===0&&lengths.some((l,i)=>lengths.some((m,j)=>i!==j&&Math.abs(l-m)<0.3)))return null;return {k,points,lengths,rotation:rng.pick([0,180]),options:[0,2,3],...errors(...[0,2,3].filter(value=>value!==k).map(value=>{
      const repeated=lengths.find((n,i)=>lengths.some((m,j)=>i!==j&&m===n)),different=lengths.find(n=>n!==repeated);
      const first=k===0?(value===2?lengths[0]+' cm와 '+lengths[1]+' cm를 같다고 보아 2개를 골랐습니다.':'서로 다른 세 길이를 모두 같다고 보아 3개를 골랐습니다.'):k===2?(value===3?'나머지 한 변까지 같다고 보아 3개를 골랐습니다.':'같은 길이로 표시된 두 변도 서로 다르다고 보아 0개를 골랐습니다.'):(value===2?'길이가 같은 세 변 중 두 변만 세어 2개를 골랐습니다.':'길이가 같은 세 변도 모두 다르다고 보아 0개를 골랐습니다.');
      const proper=k===0?(value===2?lengths[0]+' cm와 '+lengths[1]+' cm도 다르고 세 길이가 모두 다르므로 길이가 같은 변은 0개입니다.':lengths.join(' cm, ')+' cm는 모두 다르므로 길이가 같은 변은 0개입니다.'):k===2?(value===3?different+' cm인 한 변은 다르고 '+repeated+' cm인 두 변만 같으므로 2개입니다.':repeated+' cm가 두 번 적혀 있으므로 길이가 같은 변은 2개입니다.'):(value===2?'빠뜨린 한 변도 '+lengths[0]+' cm로 같으므로 3개입니다.':lengths[0]+' cm가 세 번 적혀 있으므로 길이가 같은 변은 3개입니다.');
      return wrong(value,'길이가 같은 변의 수 혼동',first+' '+proper);
    }))};}, v => ['세 변에 적힌 길이는 ' + v.lengths.map(n=>n+' cm').join(', ') + '입니다.', v.k===0 ? '길이가 같은 변은 없습니다.' : v.k===2 ? '같은 길이가 2번 적혀 있어 두 변의 길이가 같습니다.' : '같은 길이가 3번 적혀 있어 세 변의 길이가 모두 같습니다.']),
  answer:v=>v.k,check:v=>countEqual(v.points),isCorrect:(v,c)=>c===countEqual(v.points),
  art:v=>({kind:'polygon',points:v.points,labels:{sides:v.lengths.map(n=>`${n} cm`)},rotation:v.rotation,wide:true}),
  solution: "{process}\n따라서 길이가 같은 변은 {answer}개입니다.",
});
