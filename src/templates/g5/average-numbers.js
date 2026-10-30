import { explain, say } from '../solution-process.js?v=9a67f36b25';
import {likelihoodErrors} from './average-helpers.js?v=9a67f36b25';
import {define,meta,cycle,tableArt} from './helpers.js?v=9a67f36b25';
export default define(meta('average','numbers',3,'life',['04-05'],'가능성을 수로 나타내기'),{
 answerKind:'fraction',choiceOrder:['0','1/2','1'],texts:['표는 주머니에 든 공의 수입니다. 공을 하나 꺼낼 때 빨간 공이 나올 가능성을 수로 나타내면 얼마일까요?','표는 주머니에 든 공의 수입니다. 공을 하나 꺼낼 때 빨간 공이 나올 가능성은 어떤 수일까요?'],
 draw: explain(function(rng) {const which=cycle(rng,this,[0,1,2]),n=rng.int(1,30),red=which===0?0:n,blue=which===2?0:n,options=['0','1/2','1'],a=options[which];return {red,blue,which,options,...likelihoodErrors(red,blue,[0,2,4].filter(i=>['0',null,'1/2',null,'1'][i]!==a),true)};}, v => ['전체 공의 수는 '+v.red+' + '+v.blue+' = '+say(v.red+v.blue), v.red===0?'빨간 공이 하나도 없어 빨간 공을 꺼낼 수 없습니다.':v.blue===0?'공 '+v.red+'개가 모두 빨간 공이므로 반드시 빨간 공이 나옵니다.':'빨간 공과 파란 공이 '+v.red+'개씩 같으므로 전체의 반이 빨간 공입니다.']),
 answer:v=>v.options[v.which],check:v=>v.red===0?'0':v.blue===0?'1':'1/2',isCorrect:(v,c)=>c===(v.red===0?'0':v.blue===0?'1':'1/2'),
 art:v=>tableArt([['색','빨강','파랑'],['개수',v.red,v.blue]]),solution: "{process}\n따라서 빨간 공이 나올 가능성을 수로 나타내면 {answer:입니다}.",
});
