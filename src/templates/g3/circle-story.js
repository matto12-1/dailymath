import {define,wrong,errors,seq} from './helpers.js?v=9a67f36b25';
import {meta} from './shape-helpers.js?v=9a67f36b25';
// 검수 B-32: 반지름이 2·4·6·8 넷뿐이던 것을 2~15 cm로 넓힌다. 검수 B-31: 말끝은 「일까요?」로 맞춘다.
export default define(meta('circle','story',3,['06'],'둥근 나무판의 지름','word'),{
  input:'number',errorCount:2,answerUnit:'cm',answerSpan:seq(2,15).map(x=>x*2),
  texts:['{thing}의 반지름은 {r} cm입니다. 지름은 몇 cm일까요?','반지름이 {r} cm인 {thing}입니다. 지름은 몇 cm일까요?'],
  draw(rng){const r=rng.int(2,15);return {r,thing:rng.pick(['둥근 나무판','원 모양 나무판','나무로 만든 둥근 판']),...errors(wrong(r,'반지름을 그대로 답하기',`반지름 ${r} cm를 그대로 썼습니다. 지름은 반지름의 2배이므로 ${r} + ${r} = ${2*r} cm입니다.`),r%2===0?wrong(r/2,'거꾸로 반으로 나누기',`반지름 ${r} cm를 반으로 나누어 ${r/2} cm라고 했습니다. 지름은 반지름 두 개의 길이이므로 ${r} + ${r} = ${2*r} cm입니다.`):wrong(r+2,'두 배 대신 2 더하기',`반지름에 2를 더해 ${r+2} cm라고 했습니다. 지름은 반지름을 두 번 이은 길이이므로 ${r} + ${r} = ${r*2} cm입니다.`))};},
  answer:v=>2*v.r,check:v=>v.r+v.r,art:()=>({scene:'wooden-disc'}),
  solution:'지름은 반지름 두 개의 길이이므로 {r} + {r} = {answer}입니다.\n따라서 지름은 {answer} cm입니다.',
});
