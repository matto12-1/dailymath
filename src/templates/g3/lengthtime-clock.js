import { explain, j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, errors, wrong } from './helpers.js?v=9a67f36b25';
import { clearClockHands } from '../../art/life.js?v=9a67f36b25';
export default define({ id:'g3.lengthtime.clock', unit:'g3s1-length-time', strand:'life', level:2, label:'초침 읽기', std:['[4수03-13]'] }, {
  input:'number', range:{min:0,max:59}, errorCount:3, back:'g2s2-time', answerSpan:seq(5,59), answerUnit:'초',
  texts:['가장 가는 초침이 가리키는 곳은 몇 초일까요?'],
  draw: explain(function(rng){const h=rng.int(1,12),m=rng.int(1,59),s=rng.int(5,59),big=Math.floor(s/5)*5;if(!clearClockHands(h,m,s))return null;return {h,m,s,big,small:s%5,squares:Math.floor(s/5),...errors(
    wrong(Math.floor(s/5),'시계 숫자를 초로 읽기',`초침이 지난 숫자 ${Math.floor(s/5)}를 초로 읽었습니다. 숫자 ${Math.floor(s/5)}까지 ${big}초이고${s%5?` 작은 눈금 ${s%5}칸을 더하면`:""} ${s}초입니다.`),
    wrong(m,'분침이 가리키는 곳을 초로 읽기',`초침 대신 분침이 가리키는 곳을 ${m}초로 읽었습니다. 가장 가는 초침의 큰 눈금 ${Math.floor(s/5)}칸은 ${big}초이고 작은 눈금은 ${s%5}칸이므로 ${s}초입니다.`),
    s%5?wrong(big,'작은 눈금 빠뜨리기',`큰 눈금까지 ${big}초만 세고 작은 눈금 ${s%5}칸을 빠뜨렸습니다. 작은 눈금 한 칸이 1초이므로 ${big}초에 ${s%5}초를 더하면 ${s}초입니다.`):null)};}, v => ['초침이 숫자 '+j(v.squares,'을/를')+(v.small?' 지났습니다.':' 가리킵니다.')+' 숫자 눈금 한 칸은 5초이므로 숫자 '+v.squares+'까지는 '+v.big+'초입니다.', v.small ? '작은 눈금 '+v.small+'칸은 '+v.small+'초이므로 '+v.big+' + '+v.small+' = '+v.s+'초입니다.' : null]),
  answer:({s})=>s,check:({squares,small})=>squares*5+small,
  art:({h,m,s})=>({kind:'clock',h,m,seconds:s}),
  solution:"{process}\n따라서 초침이 가리키는 초는 {answer}초입니다.",
});
