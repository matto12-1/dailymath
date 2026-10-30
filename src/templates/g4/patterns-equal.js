import {define,meta,seq,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
const cases=seq(3,30).flatMap(a=>seq(3,30).flatMap(b=>seq(1,Math.min(a+b,20)).map(c=>({a,b,c}))));
export default define(meta('patterns','equal',3,'calc',['02-03'],'같은 양의 등식'),{
  input:'number',texts:['〔{a} + {b} = □ + {c}〕□에 알맞은 수는 얼마일까요?', '〔{c} + □ = {a} + {b}〕등호(=) 양쪽의 값이 같습니다. □에 알맞은 수는 얼마일까요?'],
  ...casesSpec(cases,({a,b,c})=>a+b-c,({a,b,c})=>Number(BigInt(a)+BigInt(b)-BigInt(c)),v=>({...v,total:v.a+v.b,...errors(wrong(v.a+v.b,'합을 □에 그대로 쓰기','{a} + {b}의 값 {total:을/를} □에 그대로 썼습니다. □와 {c:을/를} 더한 값이 {total}이 되려면 □는 {total} − {c} = {answer}입니다.'),wrong(v.a+v.b+v.c,'□ 옆 수 더하기',`합 ${v.a+v.b}에 ${v.c}을 더해 ${v.a+v.b+v.c}을 썼습니다. □는 합에서 옆의 수를 뺀 {total} − {c} = {answer}입니다.`))})),
  solution: "{a} + {b} = {total}이므로 □와 {c:을/를} 더한 값도 {total:이/가} 되어야 합니다.\n{total} − {c} = {answer}입니다.\n따라서 □ 안에 알맞은 수는 {answer}입니다.",
});
