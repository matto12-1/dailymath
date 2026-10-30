import { explain } from '../solution-process.js?v=9a67f36b25';
import { define, flatShapes, names, verticesOf, polygonPoints, item, errors, shapeErrors, cycle } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.shapes.triangle',unit:'g2s1-shapes',strand:'shape',level:1,label:'도형 이름',std:['[2수03-03]','[2수03-04]']}, {
  answerKind:'text',errorCount:2,texts:['{question}'],
  draw: explain(function(rng) {const type=cycle(rng,'g2-shapes-triangle',flatShapes),rotation=rng.int(0,35)*10,vertices=verticesOf[type],sides=rng.pick([true,false]);
    const candidates=rng.shuffle([type,...rng.shuffle(flatShapes.filter(s=>s!==type)).slice(0,3)]);
    const points=vertices?polygonPoints(rng,vertices):[];
    const pictures=rng.shuffle(candidates.map(shape=>({...item(shape),rotation:rng.int(0,35)*10,...(verticesOf[shape]?{points:polygonPoints(rng,verticesOf[shape]).map(([x,y])=>[x*3.5,y*3.5])}:{})})));
    return {type,rotation,vertices,points,pictures,question:'그림의 도형 이름은 무엇일까요?',options:candidates.map(s=>names[s]),...errors(...shapeErrors(type,candidates))};
  }, v => [v.vertices ? '변이 ' + v.vertices + '개이고 꼭짓점도 ' + v.vertices + '개입니다.' : '꼭짓점도 곧은 선도 없고 둥근 선으로 이어져 있습니다.']),
  answer:({type})=>names[type],check:({vertices})=>names[flatShapes.find(s=>verticesOf[s]===vertices)],
  isCorrect:({vertices},choice)=>flatShapes.some(s=>names[s]===choice&&verticesOf[s]===vertices),
  art:({type,points,rotation})=>type==='circle'?{kind:'circle',r:1}:{kind:'polygon',points,rotation},
  solution: "{process}\n따라서 {answer:입니다}.",
});
