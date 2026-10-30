import {define,meta,errors,wrong,dec} from './helpers.js?v=9a67f36b25';
export default define(meta('range','round',3,'estimate',['01-03'],'지정한 자리까지 반올림'),{
 input:'number',answerKind:'decimal',minMistakes:2,errorCount:3,texts:['〔{shown}〕반올림하여 {place}까지 나타내면 얼마일까요?', '〔{shown}〕{place}까지 반올림한 어림값은 얼마일까요?'],
 draw(rng){const type=rng.int(0,4),p=type<3?0:3,k=type<3?10**(type+1):type===3?100:10,N=p?rng.int(1001,99999):rng.int(k+1,99*k),digit=Math.floor(N/(k/10))%10,rounded=Math.round(N/k)*k,higher=Math.round(N/(10*k))*10*k;if(N%k===0)return null;return {N,k,p,shown:dec(N,p),place:['십의 자리','백의 자리','천의 자리','소수 첫째 자리','소수 둘째 자리'][type],lower:['일의','십의','백의','소수 둘째','소수 셋째'][type]+' 자리',digit,rounded,higherPlace:['백의 자리','천의 자리','만의 자리','일의 자리','소수 첫째 자리'][type],mistake:digit<5?'올림':'버림',reason:digit<5?'5보다 작으므로 버립니다':'5 이상이므로 올립니다',...errors(wrong(dec((digit<5?Math.ceil(N/k):Math.floor(N/k))*k,p),'올림과 버림 혼동','반올림 대신 {mistake:으로/로} 어림했습니다. {lower} 숫자가 {digit}이므로 반올림하면 {answer:입니다}.'),wrong(higher>0&&higher!==rounded?dec(higher,p):null,'한 자리 높게 반올림하기','{place}가 아니라 {higherPlace}까지 반올림했습니다. {higherPlace} 대신 {place}까지 나타내기 위해 {lower} 숫자 {digit:을/를} 보고 반올림하면 {answer:입니다}.'),wrong(dec(N,p),'어림하지 않은 수 쓰기','주어진 수 {shown:을/를} 어림하지 않고 그대로 썼습니다. {place} 아래의 {lower} 숫자 {digit:을/를} 보고 반올림하면 {answer:입니다}.'))};},
 answerPlaces:v=>v.p?(v.k===100?1:2):0,
 answer:v=>v.p ? (v.rounded/10**v.p).toFixed(v.k===100?1:2) : dec(v.rounded,v.p),check:v=>dec((Math.floor(v.N/v.k)+(v.N%v.k>=v.k/2?1:0))*v.k,v.p),
 solution:'{lower} 숫자가 {digit:입니다}. {reason}.\n따라서 {shown:을/를} {place}까지 반올림한 값은 {answer:입니다}.',
});
