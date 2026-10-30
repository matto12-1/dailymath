import { explain } from '../solution-process.js?v=9a67f36b25';
import { define, flatShapes, names, verticesOf, polygonPoints, item, errors, shapeErrors, cycle } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.shapes.circle',unit:'g2s1-shapes',strand:'shape',level:2,label:'꼭짓점과 변으로 찾기',std:['[2수03-04]','[2수03-05]']}, {
  answerKind:'text',errorCount:2,texts:['{question}'],
  draw: explain(function(rng) {const type=cycle(rng,'g2-shapes-circle',flatShapes),rotation=rng.int(0,35)*10,vertices=verticesOf[type],sides=rng.pick([true,false]);
    const candidates=rng.shuffle([type,...rng.shuffle(flatShapes.filter(s=>s!==type)).slice(0,3)]);
    const points=vertices?polygonPoints(rng,vertices):[];
    const pictures=rng.shuffle(candidates.map(shape=>({...item(shape),rotation:rng.int(0,35)*10,...(verticesOf[shape]?{points:polygonPoints(rng,verticesOf[shape]).map(([x,y])=>[x*3.5,y*3.5])}:{})})));
    return {type,rotation,vertices,points,pictures,question:type==='circle'?'꼭짓점이 없는 도형의 이름은 무엇일까요?':`${sides?'변':'꼭짓점'}이 ${vertices}개인 도형의 이름은 무엇일까요?`,options:candidates.map(s=>names[s]),...errors(...shapeErrors(type,candidates,'찾는 도형'))};
  }, v => [v.vertices ? '삼각형은 변과 꼭짓점이 각각 3개이고, 사각형은 각각 4개입니다.' : '삼각형에는 꼭짓점이 3개, 사각형에는 4개 있습니다. 꼭짓점이 없는 둥근 도형을 찾습니다.']),
  answer:({type})=>names[type],check:({vertices})=>names[flatShapes.find(s=>verticesOf[s]===vertices)],
  isCorrect:({vertices},choice)=>flatShapes.some(s=>names[s]===choice&&verticesOf[s]===vertices),
  art:({pictures})=>({kind:'objects',expand:true,items:pictures}),
  solution: "{process}\n따라서 {answer:입니다}.",
});
