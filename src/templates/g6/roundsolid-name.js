import {define,meta,wrong,errors,fill} from './helpers.js?v=9a67f36b25';
import {cycle} from '../g3/arithmetic-helpers.js?v=9a67f36b25';
const types=['cylinder','cone','sphere','prism','pyramid'],names=['원기둥','원뿔','구','삼각기둥','사각뿔'],key={};
const properties=['밑면이 원 모양으로 2개이고 옆면은 굽은 면입니다.','밑면이 원 모양으로 1개이고 뾰족한 꼭짓점이 있습니다.','평평한 면이 없고 어느 쪽에서 보아도 둥급니다.','밑면이 삼각형 모양으로 2개이고 옆면은 사각형입니다.','밑면이 사각형 모양으로 1개이고 옆면은 삼각형입니다.'];
export default define(meta('roundsolid','name',1,'shape',['03-07'],'둥근 입체와 각기둥 각뿔 구별하기'),{
 answerKind:'text',answerValues:names,texts:['그림의 입체도형 이름은 무엇일까요?','이 입체도형의 가장 알맞은 이름은 무엇일까요?'],
 draw(rng){const i=cycle(rng,key,[0,1,2,3,4]),others=rng.shuffle([0,1,2,3,4].filter(j=>j!==i)).slice(0,3);return {i,type:types[i],orientation:0,options:[names[i],...others.map(j=>names[j])],description:properties[i],...errors(...others.slice(0,2).map(j=>wrong(names[j],'입체의 성질과 이름 혼동',fill('{name:을/를} 골랐습니다. {name:과/와} 달리 그림의 입체도형은 ',{name:names[j]})+properties[i]+' 그러므로 {answer:입니다}.')))};},
 answer:v=>names[v.i],check:v=>({cylinder:'원기둥',cone:'원뿔',sphere:'구',prism:'삼각기둥',pyramid:'사각뿔'})[v.type],isCorrect:(v,c)=>names[types.indexOf(v.type)]===c,
 guessHints:[({choices})=>({'long-name':choices.map(s=>s.length),'short-name':choices.map(s=>-s.length)})],
 art:v=>({kind:'solid',type:v.type,n:v.type==='prism'?3:4,orientation:v.orientation,wide:true}),solution:'{description}\n따라서 그림의 입체도형은 {answer:입니다}.',
});
