import {define,meta,casesSpec,errors,wrong,pairs} from './helpers.js?v=9a67f36b25';
const cases=pairs(20,100,2,18).flatMap(v=>[2,3,5,7,9].filter(c=>v.a>=v.b+c&&v.b!==c).map(c=>({...v,c})));
const answer=({a,b,c})=>a-b+c;
export default define(meta('mixed','addsubleft',1,'calc',['01-01'],'왼쪽부터 덧셈과 뺄셈'),{
 input:'number',texts:['〔{a} − {b} + {c} = ?〕계산하면 얼마일까요?'],
 ...casesSpec(cases,answer,({a,b,c})=>a-(b-c),v=>({...v,first:v.a-v.b,...errors(wrong(v.a-v.b-v.c,'덧셈부터 계산하기','{b} + {c}부터 계산해 {a}에서 뺐습니다. 왼쪽부터 {a} − {b} = {first}, {first} + {c} = {answer:입니다}.'),wrong(v.a-v.b,'마지막 덧셈 빠뜨리기','{a} − {b} = {first}에서 멈췄습니다. 남은 {c:을/를} 더하면 {first} + {c} = {answer:입니다}.'))})),
 solution:'{a} − {b} = {first}, {first} + {c} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
