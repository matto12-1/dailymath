import {numeric,meta,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('circlearea','diameter',2,'calc',['03-16'],'원주로 지름 구하기'),{
 answerKind:'decimal',answerUnit:'cm',cases:seq(2,40).map(d=>({d,C:d*314})),
 texts:['원주가 {circumference} cm이고 원주율이 3.14일 때 원의 지름은 몇 cm일까요?'],
 answer:v=>String(v.d),check:v=>dec(v.C/314*100,2),decorate:v=>({circumference:dec(v.C,2)}),
 errors:v=>[wrong(dec(v.d*50,2),'반지름 답하기','원주를 3.14로 나눈 뒤 다시 2로 나누어 {value:을/를} 썼습니다. 2로 나누기 전의 {circumference} ÷ 3.14가 지름이므로 {answer} cm입니다.'),wrong(dec(v.C*314,4),'나누기 대신 곱하기','원주 {circumference} cm에 3.14를 곱하여 {value:을/를} 썼습니다. 원주 {circumference:을/를} 원주율 3.14로 나누면 지름은 {answer} cm입니다.')],
 solution:'지름은 원주 ÷ 원주율입니다. {circumference} ÷ 3.14 = {answer} cm입니다.\n따라서 원의 지름은 {answer} cm입니다.',
});
