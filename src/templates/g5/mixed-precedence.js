import {define,meta,casesSpec,errors,wrong,repeated,pairs} from './helpers.js?v=9a67f36b25';
const cases=pairs(10,35,3,9).flatMap(v=>[3,4,5,6,7,8,9].map(c=>({...v,c}))),answer=({a,b,c})=>a+b*c;
export default define(meta('mixed','precedence',2,'calc',['01-01'],'곱셈 먼저 계산하기'),{
 input:'number',texts:['〔{a} + {b} × {c} = ?〕계산하면 얼마일까요?'],
 ...casesSpec(cases,answer,v=>v.a+repeated(v.b,v.c),v=>({...v,first:v.b*v.c,...errors(wrong((v.a+v.b)*v.c,'왼쪽부터 계산하기','{a} + {b}부터 더한 뒤 {c:을/를} 곱했습니다. {b} × {c} = {first}부터 구한 뒤 {a:을/를} 더하면 {answer:입니다}.'),wrong(v.a+v.b,'곱하는 수 빠뜨리기','{c:을/를} 곱하지 않고 {a} + {b}만 계산했습니다. 빠뜨린 곱셈을 넣어 {a} + {b} × {c:을/를} 계산하면 {answer:입니다}.'))})),
 solution:'{b} × {c} = {first}부터 구합니다. {a} + {first} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
