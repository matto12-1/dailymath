import {define,meta,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
const cases=[];for(let a=2;a<=12;a++)for(let b=2;b<=12;b++)for(let c=2;c<=12;c++)cases.push({a,b,c});const answer=v=>4*(v.a+v.b+v.c);
export default define(meta('cuboids','faces',2,'shape',['03-03'],'모든 모서리 길이의 합'),{
 input:'number',answerUnit:'cm',texts:['그림에 있는 직육면체의 모든 모서리 길이의 합은 몇 cm일까요?','그림의 모서리 12개의 길이를 모두 더하면 몇 cm일까요?'],
 ...casesSpec(cases,answer,v=>4*v.a+4*v.b+4*v.c,v=>({...v,subtotal:v.a+v.b+v.c,...errors(wrong(v.a+v.b+v.c,'세 모서리만 더하기','한 꼭짓점에서 만나는 세 모서리의 길이 {a}, {b}, {c:을/를} 한 번씩만 더했습니다. 빠뜨린 모서리까지 같은 길이 4개씩 더하면 ({a} + {b} + {c}) × 4 = {answer} cm입니다.'),wrong(12*(v.a+v.b+v.c),'모서리 전체 수를 곱하기','세 모서리의 길이를 더한 {subtotal}에 4 대신 모서리 전체의 수 12를 곱했습니다. 각 길이의 모서리는 12개가 아니라 4개씩이므로 {subtotal} × 4 = {answer} cm입니다.'))})),
 art:v=>({kind:'solid',type:'cuboid',edgeLengths:[v.a,v.b,v.c],wide:true}),solution:'직육면체에는 길이가 같은 모서리가 4개씩 있습니다. 한 꼭짓점에서 만나는 세 모서리의 길이를 더한 뒤 4를 곱하면 ({a} + {b} + {c}) × 4 = {answer:입니다}.\n따라서 모서리 길이의 합은 {answer} cm입니다.',
});
