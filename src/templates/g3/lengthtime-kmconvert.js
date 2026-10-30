import { define, sum, errors, wrong } from './helpers.js?v=9a67f36b25';
import { bank } from './arithmetic-helpers.js?v=9a67f36b25';

const pool=bank(1,9,1,99,()=>true,(k,m)=>k*1000+m);

export default define({ id:'g3.lengthtime.kmconvert', unit:'g3s1-length-time', strand:'calc', level:2, label:'km를 m로', std:['[4수03-16]'] }, {
  input:'number', range:{min:0,max:9999}, errorCount:2, answerSpan:pool.answers, answerUnit:' m',
  texts:['〔{k} km {m} m = ? m〕빈칸에 알맞은 수는 얼마일까요?'],
  draw(rng){const {a:k,b:m}=pool.draw(rng);return {k,m,kmPart:k*1000,...errors(
    wrong(Number(`${k}${m}`),'빈자리 0 빼먹기',`${k}와 ${m}을 빈자리에 0을 쓰지 않고 이어 써서 ${Number(`${k}${m}`)}이라고 했습니다. ${k} km는 ${k*1000} m이므로 ${k*1000} + ${m} = ${k*1000+m} m입니다.`),
    wrong(1000*k+10*m,'m를 열 배로 바꾸기',`${m} m를 ${m*10} m로 바꾸어 ${1000*k+10*m}이라고 했습니다. ${m} m는 그대로 더하면 ${k*1000} + ${m} = ${1000*k+m} m입니다.`))};},
  answer:({k,m})=>1000*k+m, check:({k,m})=>sum(...Array(k).fill(1000),m),
  solution:'{k} km는 {kmPart} m입니다.\n{kmPart} m + {m} m = {answer} m입니다.\n따라서 빈칸에 알맞은 수는 {answer}입니다.',
});
