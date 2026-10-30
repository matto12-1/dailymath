import {define,meta,casesSpec,errors,wrong,repeated} from './helpers.js?v=9a67f36b25';
const cases=[];for(let k=2;k<=9;k++)for(let q=2;q<=9;q++)cases.push({k,x:k*q});const answer=v=>v.x*v.k;
export default define(meta('correspond','value',3,'calc',['02-01'],'대응식에 수 넣기'),{
 input:'number',back:'g4s2-patterns-equations',texts:['〔△ = □ × {k}〕□가 {x}이면 △는 몇일까요?'],
 ...casesSpec(cases,answer,v=>repeated(v.x,v.k),v=>({...v,...errors(wrong(v.x+v.k,'곱셈을 덧셈으로 계산하기','{x} × {k} 대신 {x} + {k:을/를} 계산했습니다. 식의 곱셈대로 □에 {x:을/를} 넣으면 {x} × {k} = {answer:입니다}.'),wrong(v.x/v.k,'두 양을 거꾸로 넣기','□에 {x:을/를} 넣어야 하는데 △에 넣고 나누었습니다. {x:은/는} □의 값이므로 △는 {x} × {k} = {answer:입니다}.'))})),
 solution:'□ 자리에 {x:을/를} 넣습니다. △ = {x} × {k} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
