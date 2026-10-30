import { explain, say } from '../solution-process.js?v=9a67f36b25';
import {define,meta,cycle} from './helpers.js?v=9a67f36b25';
import {likelihood,likelihoodIndex,likelihoodErrors,likelihoodLook} from './average-helpers.js?v=9a67f36b25';
export default define(meta('average','words',2,'word',['04-04'],'가능성을 말로 나타내기'),{
 answerKind:'text',choiceOrder:likelihood,texts:['{contents}에서 공을 하나 꺼냅니다. 빨간 공이 나올 가능성에 알맞은 말은 무엇일까요?'],
 draw: explain(function(rng) {const index=cycle(rng,this,[0,1,2,3,4]),n=rng.int(1,20),small=rng.int(1,n),large=n+small;const [red,blue]=index===0?[0,n]:index===4?[n,0]:index===2?[n,n]:index===1?[small,large]:[large,small];const wrongIndices=rng.shuffle([0,1,2,3,4].filter(i=>i!==index)).slice(0,3);return {red,blue,index,contents:red===0?'파란 공만 '+blue+'개 든 주머니':blue===0?'빨간 공만 '+red+'개 든 주머니':'빨간 공 '+red+'개와 파란 공 '+blue+'개가 든 주머니',options:[likelihood[index],...wrongIndices.map(i=>likelihood[i])],...likelihoodErrors(red,blue,wrongIndices.slice(0,2))};}, v => [v.red&&v.blue?'주머니에 든 공의 수는 '+v.red+' + '+v.blue+' = '+say(v.red+v.blue):null, v.red===0?'주머니에는 파란 공만 '+v.blue+'개 있으므로 빨간 공은 꺼낼 수 없습니다.':v.blue===0?'빨간 공만 '+v.red+'개 있으므로 어떤 공을 꺼내도 빨간 공입니다.':v.red===v.blue?'빨간 공과 파란 공이 각각 '+v.red+'개로 같습니다.':'빨간 공 '+v.red+'개가 파란 공 '+v.blue+'개보다 '+(v.red>v.blue?'많습니다.':'적습니다.')]),
 answer:v=>likelihood[v.index],check:v=>likelihood[likelihoodIndex(v.red,v.blue)],isCorrect:(v,c)=>c===likelihood[likelihoodIndex(v.red,v.blue)],choiceLook:likelihoodLook,
 art:()=>({scene:'chance-bag'}),solution: "{process}\n따라서 알맞은 말은 「{answer}」입니다.",
});
