import {define,errors,wrong} from './helpers.js?v=9a67f36b25';
import {meta} from './shape-helpers.js?v=9a67f36b25';
const names=['직선','반직선','선분'];
const definitions=['양쪽으로 끝없이 늘인 곧은 선','한 점에서 시작하여 한쪽으로 끝없이 늘인 곧은 선','두 점을 곧게 이은 선'];
export default define(meta('plane','lines',1,['01'],'선의 종류'),{
  answerKind:'text',errorCount:2,
  texts:['그림과 같은 선의 이름은 무엇일까요?','이 선의 알맞은 이름은 무엇일까요?'],
  draw(rng){const ends=rng.int(0,2),options=names,others=names.filter((_,i)=>i!==ends);
    return {ends,definition:definitions[ends],rotation:rng.int(0,35)*10,options,...errors(...others.map(name=>wrong(name,`${name}을 ${names[ends]}으로 보기`,`${name}을 골랐지만 ${name}은 ${definitions[names.indexOf(name)]}입니다. ${name}과 달리 그림의 선은 ${definitions[ends]}이므로 ${names[ends]}입니다.`)))};},
  answer:v=>names[v.ends], check:v=>v.ends===2?'선분':v.ends===1?'반직선':'직선',
  isCorrect:(v,c)=>names.indexOf(c)===v.ends,
  art:v=>({kind:'polygon',expand:true,open:true,endpoints:v.ends===2?[0,1]:v.ends===1?[0]:[],extension:v.ends===0?[0,1]:v.ends===1?[1]:[],arrows:false,rotation:v.rotation}),
  solution:'그림의 선은 {definition}입니다.\n따라서 이 선의 이름은 {answer:입니다}.',
});
