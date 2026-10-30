import { explain } from '../solution-process.js?v=9a67f36b25';
import { define, flatShapes, names, verticesOf, polygonPoints, item, errors, shapeErrors, cycle } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.shapes.build',unit:'g2s1-shapes',strand:'shape',level:3,label:'빈 조각 모양',std:['[2수03-03]','[2수03-04]']}, {
  answerKind:'text',errorCount:2,texts:['{question}'],
  draw: explain(function(rng) {const type=cycle(rng,'g2-shapes-build',flatShapes),rotation=rng.int(0,35)*10,vertices=verticesOf[type],sides=rng.pick([true,false]);
    const candidates=rng.shuffle([type,...rng.shuffle(flatShapes.filter(s=>s!==type)).slice(0,3)]);
    const points=vertices?polygonPoints(rng,vertices):[];
    const pictures=rng.shuffle(candidates.map(shape=>({...item(shape),rotation:rng.int(0,35)*10,...(verticesOf[shape]?{points:polygonPoints(rng,verticesOf[shape]).map(([x,y])=>[x*3.5,y*3.5])}:{})})));
    return {type,rotation,vertices,points,pictures,question:'빈 곳에 꼭 맞는 조각의 모양은 무엇일까요?',options:candidates.map(s=>names[s]),...errors(...shapeErrors(type,candidates,'빈 곳'))};
  }, v => [v.vertices ? '빈 곳의 테두리는 변 ' + v.vertices + '개와 꼭짓점 ' + v.vertices + '개로 되어 있습니다.' : '빈 곳은 꼭짓점이 없고 테두리가 둥급니다.', v.vertices?'기울어진 방향과 관계없이 변과 꼭짓점의 수로 모양을 가립니다.':'빈 곳에는 꼭짓점도 곧은 선도 없습니다.']),
  answer:({type})=>names[type],check:({vertices})=>names[flatShapes.find(s=>verticesOf[s]===vertices)],
  isCorrect:({vertices},choice)=>flatShapes.some(s=>names[s]===choice&&verticesOf[s]===vertices),
  art:({type,points,rotation})=>{const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2,s=140/Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys));return {kind:'polygon',points:[[0,0],[10,0],[10,10],[0,10]],hole:{shape:type,points:points.map(([x,y])=>[150+(x-cx)*s,150+(y-cy)*s]),rotation}};},
  solution: "{process}\n따라서 {answer:입니다}.",
});
