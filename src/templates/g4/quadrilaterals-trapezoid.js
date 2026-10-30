import { j, explain } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
import {integerSides,quad,quadNames,parallelPairs,equalSides,isRectangle,sideLengths,propertyMarks} from './geometry.js?v=9a67f36b25';
const primary=ps=>isRectangle(ps)?equalSides(ps)?'정사각형':'직사각형':equalSides(ps)?'마름모':parallelPairs(ps)===2?'평행사변형':'사다리꼴';
const choices={
  square:['정사각형','직사각형','마름모','평행사변형'],
  rectangle:['직사각형','정사각형','마름모','평행사변형'],
  rhombus:['마름모','정사각형','직사각형','평행사변형'],
  parallelogram:['평행사변형','직사각형','마름모','정사각형'],
  trapezoid:['사다리꼴','평행사변형','마름모','직사각형'],
};
const nameFeedback=(points,pick)=>{
  const answer=primary(points),square=answer==='정사각형',rectangle=isRectangle(points),equal=equalSides(points),pairs=parallelPairs(points);
  const facts=rectangle?(equal?'네 각이 모두 직각이고 네 변의 길이가 모두 같으므로':'네 각이 모두 직각이고 이웃한 두 변의 길이가 다르므로'):equal?'네 변의 길이가 모두 같고 직각이 없으므로':pairs===2?'평행한 변이 두 쌍이고 같은 길이의 변은 마주 보는 변끼리뿐이므로':'평행한 변이 한 쌍뿐이므로';
  const valid=square&&['직사각형','마름모','평행사변형'].includes(pick)||['직사각형','마름모'].includes(answer)&&pick==='평행사변형';
  if(valid)return j(pick,'을/를')+' 골랐습니다. '+answer+'도 '+j(pick,'(이)')+'라고 할 수 있지만, '+facts+' 가장 알맞은 이름은 '+answer+'입니다.';
  const why=['정사각형','직사각형'].includes(pick)&&!rectangle?'직각이 없습니다':pick==='평행사변형'&&pairs!==2?'평행한 변이 한 쌍뿐입니다':'네 변의 길이가 모두 같지는 않습니다';
  return j(pick,'을/를')+' 골랐지만 이 사각형은 '+why+'. '+(pick==='직사각형'?'네 각이 모두 직각이어야 하는 직사각형과 달리 ':pick==='마름모'?'네 변의 길이가 모두 같아야 하는 마름모와 달리 ':pick==='정사각형'?'네 각과 네 변의 조건이 모두 필요한 정사각형과 달리 ':'평행한 변이 두 쌍이어야 하는 평행사변형과 달리 ')+facts+' 가장 알맞은 이름은 '+answer+'입니다.';
};
export default define(meta('quadrilaterals','trapezoid',2,'shape',['03-10'],'사각형의 가장 알맞은 이름'),{
  answerKind:'text',texts:['그림의 사각형에 가장 알맞은 이름은 무엇일까요?','그림에 가장 알맞은 사각형 이름은 무엇일까요?'],
  draw: explain(function(rng) {const type=rng.pick(Object.keys(quadNames)),points=quad(type,rng),options=choices[type],facts=isRectangle(points)?equalSides(points)?'네 변이 같고 네 각이 모두 직각입니다': '네 각이 직각이지만 네 변이 모두 같지는 않습니다':equalSides(points)?'네 변의 길이가 같지만 직각은 없습니다':parallelPairs(points)===2?'평행한 변이 두 쌍이고 네 변이 모두 같지는 않습니다. 직각도 없습니다':'평행한 변이 한 쌍뿐입니다';
    return {points,options,rotation:rng.pick([0,180]),...errors(wrong(options[1],'변과 각의 성질 혼동',nameFeedback(points,options[1])),wrong(options[2],'같은 변과 직각 혼동',nameFeedback(points,options[2])))};}, v => ['변에 적힌 길이는 ' + integerSides(v.points).map(l=>l+' cm').join(', ') + '입니다.', '평행한 변은 ' + parallelPairs(v.points) + '쌍입니다. ' + (isRectangle(v.points)?'네 각이 모두 직각이고, ': '직각이 없고, ') + (equalSides(v.points)?'네 변의 길이가 모두 같습니다.':'네 변의 길이가 모두 같지는 않습니다.')]),
  answer:v=>primary(v.points),check:v=>primary(v.points),isCorrect:(v,c)=>c===primary(v.points),
  art:v=>({kind:'polygon',points:v.points,rotation:v.rotation,marks:{right:propertyMarks(v.points).right,equal:propertyMarks(v.points).equal},labels:{sides:integerSides(v.points).map(l=>`${l} cm`)},wide:true}),
  solution: "{process}\n따라서 가장 알맞은 이름은 {answer:입니다}.",
});
