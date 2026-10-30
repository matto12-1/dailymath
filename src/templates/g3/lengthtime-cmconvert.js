import { define, seq, sum, errors, wrong } from './helpers.js?v=9a67f36b25';

export default define({ id:'g3.lengthtime.cmconvert', unit:'g3s1-length-time', strand:'calc', level:2, label:'cm를 mm로', std:['[4수03-16]'] }, {
  input:'number', range:{min:0,max:999}, errorCount:2, back:'g2s2-length', answerSpan:seq(10,99), answerUnit:' mm',
  texts:['〔{length} = ? mm〕빈칸에 알맞은 수는 얼마일까요?'],
  draw(rng){const c=rng.int(1,9),m=rng.int(0,9);return {c,m,length:`${c} cm${m?` ${m} mm`:''}`,cmPart:c*10,explanation:`${c===1?"1 cm는 10 mm입니다.":`1 cm는 10 mm이므로 ${c} cm는 ${c*10} mm입니다.`}${m?` ${c*10} mm + ${m} mm = ${c*10+m} mm입니다.`:""}`,...errors(
    wrong(c*100+m,'1 cm를 100 mm로 바꾸기',`1 cm를 100 mm로 보아 ${c*100+m}이라고 했습니다. 1 cm는 10 mm이므로 ${c} cm${m?` ${m} mm`:""}는 ${c*10+m} mm입니다.`),
    wrong(c+m,'cm 숫자를 그대로 더하기',`${c} cm를 mm로 바꾸지 않고 ${m?`${c} + ${m} = ${c+m}로 계산했습니다`:`${c}을 그대로 썼습니다`}. ${c} cm는 ${c*10} mm이므로${m?` ${c*10} + ${m} =`:""} ${c*10+m} mm입니다.`))};},
  answer:({c,m})=>10*c+m, check:({c,m})=>sum(...Array(c).fill(10),m),
  solution:'{explanation}\n따라서 빈칸에 알맞은 수는 {answer}입니다.',
});
