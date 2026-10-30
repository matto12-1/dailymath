import { j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, errors, wrong } from './helpers.js?v=9a67f36b25';
import {cycle} from './arithmetic-helpers.js?v=9a67f36b25';
const values=seq(11,79).filter(n=>n%10!==0);
export default define({ id:'g3.lengthtime.mm', unit:'g3s1-length-time', strand:'life', level:1, label:'mm 눈금 읽기', std:['[4수03-15]'] }, {
  input:'number', range:{min:0,max:200}, errorCount:3, backs:['g2s1-length'], answerSpan:values, answerUnit:' mm',
  texts:['자 위의 {object:은/는} 길이가 몇 mm일까요?','그림의 {object:은/는} 길이가 몇 mm일까요?'],
  draw(rng){const n=cycle(rng,'mm',values),start=rng.pick([0,0,2,3]),object=rng.pick(['막대','끈','종이띠']);return {n,start,startMm:start*10,end:start*10+n,object,explanation:`${j(object,"은/는")} ${start} cm 눈금에서 시작하여 ${start+Math.floor(n/10)} cm에서 작은 눈금 ${n%10}칸 더 간 곳에서 끝납니다.${start?` ${start} cm는 ${start*10} mm이고 끝 눈금은 ${start*10+n} mm이므로 ${start*10+n} − ${start*10} = ${n}입니다.`:` 끝 눈금은 ${n} mm입니다.`}`,...errors(
    wrong(Math.floor(n/10),'cm 숫자만 읽기',`cm 눈금 수만 보고 ${Math.floor(n/10)} mm라고 했습니다. 작은 눈금 한 칸이 1 mm이고 ${j(object,"은/는")} 작은 눈금 ${n}칸이므로 ${n} mm입니다.`),
    start?wrong(start*10+n,'끝 눈금만 읽기',`끝 눈금 ${start*10+n} mm만 읽었습니다. ${j(object,"은/는")} ${start*10} mm 눈금에서 시작하므로 ${start*10+n} − ${start*10} = ${n} mm입니다.`):null,
    wrong(n-1,'작은 눈금 하나 덜 세기',`끝의 작은 눈금을 하나 덜 세어 ${n-1} mm라고 했습니다. 끝 눈금의 작은 눈금 한 칸까지 세면 ${n-1} mm보다 1 mm 긴 ${n} mm입니다.`))};},
  answer:({n})=>n, check:({end,start})=>end-start*10,
  art:({n,start,object})=>({kind:'ruler',cm:Math.ceil(n/10)+1,startCm:start,from:start,to:start+n/10,object,mmSpacing:9}),
  solution:"{explanation}\n따라서 {object}의 길이는 {answer} mm입니다.",
});
