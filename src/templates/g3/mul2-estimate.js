import { define, seq, unique, product, errors, wrong } from './helpers.js?v=9a67f36b25';
import { bank , multiplicationAt} from './arithmetic-helpers.js?v=9a67f36b25';

const nearestTen=n=>Math.round(n/10)*10;
const candidates=unique(seq(10,100,10).flatMap(a=>seq(10,100,10).map(b=>a*b)));
const candidateValues=({exact,rounded,ra,rb,otherA,otherB})=>candidates.filter(n=>n>=Math.min(ra,otherA)*Math.min(rb,otherB)&&n<=Math.max(ra,otherA)*Math.max(rb,otherB)&&Math.abs(n-exact)>Math.abs(rounded-exact));
function estimateCase(a,b){
  if([0,5].includes(a%10)||[0,5].includes(b%10))return null;
  const ra=nearestTen(a),rb=nearestTen(b),otherA=(a%10<5?Math.ceil(a/10):Math.floor(a/10))*10,otherB=(b%10<5?Math.ceil(b/10):Math.floor(b/10))*10,rounded=ra*rb,exact=a*b;
  if(rounded>9999)return null;
  const values=unique([otherA*rb,ra*otherB,otherA*otherB].filter(n=>n<=9999&&n!==rounded));
  if(values.some(n=>Math.abs(n-exact)<=Math.abs(rounded-exact)))return null;
  const wrongs=values.filter(n=>String(n).length===String(rounded).length);
  if(wrongs.length<2||!candidateValues({exact,rounded,ra,rb,otherA,otherB}).some(n=>String(n).length===String(rounded).length&&n!==rounded&&!wrongs.includes(n)))return null;
  return {a,b,ra,rb,otherA,otherB,rounded,exact};
}
const pool=bank(11,99,11,99,(a,b)=>estimateCase(a,b)!==null,(a,b)=>nearestTen(a)*nearestTen(b));
export default define({ id:'g3.mul2.estimate', unit:'g3s2-multiplication', strand:'estimate', level:5, label:'두 자리 곱 어림', std:['[4수01-08]'] }, {
  range:{min:100,max:9999}, operandRange:{min:0,max:9999}, errorCount:3, back:'g2s2-times', answerSpan:pool.answers,
  texts:['〔{a} × {b}〕계산한 값은 어느 수에 가장 가까울까요?'],
  draw(rng){const {a,b}=pool.draw(rng),v=estimateCase(a,b),{ra,rb,otherA,otherB}=v;
    const errorValues=[
      wrong(otherA*rb,'첫 수만 반대로 어림하기',`${a}을 ${otherA}으로 어림하여 ${otherA*rb}을 골랐습니다. ${a}을 가까운 ${ra}으로 어림하면 ${ra} × ${rb} = ${ra*rb}입니다.`),
      wrong(ra*otherB,'둘째 수만 반대로 어림하기',`${b}을 ${otherB}으로 어림하여 ${ra*otherB}을 골랐습니다. ${b}을 가까운 ${rb}으로 어림하면 ${ra} × ${rb} = ${ra*rb}입니다.`),
      wrong(otherA*otherB,'두 수 모두 반대로 어림하기',`${a}을 ${otherA}, ${b}를 ${otherB}으로 어림하여 ${otherA*otherB}을 골랐습니다. 가까운 수는 각각 ${ra}, ${rb}이므로 ${ra} × ${rb} = ${ra*rb}입니다.`),
    ].map(e=>e.value<=9999?e:null);
    return {...v,...errors(...errorValues)};},
  candidates:candidateValues,
  answer:({ra,rb})=>ra*rb,
  check:({a,b})=>{const ra=a-a%10+(a%10>=5?10:0),rb=b-b%10+(b%10>=5?10:0);return product(ra,rb);},
  isCorrect:(v,c)=>v.options.every(x=>x===c||Math.abs(c-v.a*v.b)<Math.abs(x-v.a*v.b)),
  // 검수 A2-29: g3.mul1.estimate처럼 실제 곱과 견주는 줄을 덧붙인다.
  solution:'{a:은/는} 약 {ra}, {b:은/는} 약 {rb:입니다}. {ra} × {rb} = {answer:입니다}.\n따라서 실제 곱 {exact:과/와} 가장 가까운 보기는 {answer:입니다}.',
});
