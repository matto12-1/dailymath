import {define,meta,cycle,tableArt} from './helpers.js?v=9a67f36b25';
import {likelihood,likelihoodIndex,likelihoodErrors,likelihoodLook} from './average-helpers.js?v=9a67f36b25';
const indices=[1,2,3],options=indices.map(i=>likelihood[i]);
export default define(meta('average','data',4,'life',['04-06'],'자료를 보고 가능성 예상하기'),{
 answerKind:'text',choiceOrder:options,texts:['표는 공을 하나 꺼내 색을 적고 다시 넣기를 반복한 결과입니다. 다음에 빨간 공이 나올 가능성을 나타내는 말은 무엇일까요?'],
 draw(rng){const index=cycle(rng,this,indices),n=rng.int(3,30),m=rng.int(1,Math.floor(n/2)),red=index===1?m:n,blue=index===3?m:n;return {red,blue,index,options,comparison:red===blue?'두 색이 나온 횟수가 같습니다.':red>blue?'빨간 공이 파란 공보다 많이 나왔습니다.':'빨간 공이 파란 공보다 적게 나왔습니다.',...likelihoodErrors(red,blue,indices.filter(i=>i!==index),false,true)};},
 answer:v=>likelihood[v.index],check:v=>likelihood[likelihoodIndex(v.red,v.blue)],isCorrect:(v,c)=>c===likelihood[likelihoodIndex(v.red,v.blue)],choiceLook:likelihoodLook,
 art:v=>tableArt([['색','빨강','파랑'],['횟수',v.red,v.blue]]),solution:'같은 조건에서 빨간 공이 {red}번, 파란 공이 {blue}번 나왔습니다. {comparison} 다음에 나올 색을 확실히 알 수는 없습니다.\n따라서 이 기록으로 예상한 가능성은 「{answer}」입니다.',
});
