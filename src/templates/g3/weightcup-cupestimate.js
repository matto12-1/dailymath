import { explain } from '../solution-process.js?v=9a67f36b25';
import { josa } from '../../engine/korean.js?v=9a67f36b25';
import {define,wrong,errors,numbered} from './helpers.js?v=9a67f36b25';
// [이름, 대표값, 생활에서 그럴 법한 최솟값, 최댓값]. 단위는 kg와 L이다.
// 정답은 정수 목표값으로 묻고, 모든 오답 범위는 목표의 절반 아래나 두 배 위다.
// 그림 카드에 번호를 붙여 카드가 곧 단추다(검수 8번). 전엔 카드에 쓴 이름을 아래 단추가 또 말해 화면만 길었다.
export const weights=[
  ['연필 한 자루',0.01,0.004,0.015],['달걀 한 개',0.06,0.04,0.08],['사과 한 개',0.2,0.12,0.3],
  ['가로 20 cm쯤인 벽돌 한 개',2,1.6,2.4],['지름 25 cm쯤인 수박 한 통',5,4,6],
  ['성인용 자전거 한 대',15,12,18],['소형 자동차 한 대',1000,700,1300],['대형 관광버스 한 대',10000,8000,15000],
];
export const capacities=[
  ['작은 찻숟가락 하나',0.005,0.004,0.006],['작은 종이컵 하나',0.18,0.15,0.21],
  ['높이 20 cm쯤인 우유갑',1,0.9,1.1],['높이 30 cm쯤인 큰 생수병',2,1.8,2.2],
  ['지름과 높이가 25 cm쯤인 양동이',10,8,12],['어른이 누울 수 있는 욕조',200,150,250],['한 변이 1 m쯤인 물탱크',1000,800,1200],
];
const measureText=(capacity,value)=>value<1?Math.round(value*1000)+' '+(capacity?'mL':'g'):!capacity&&value>=1000?value/1000+' t':value+' '+(capacity?'L':'kg');
export default define({id:'g3.weightcup.cupestimate',unit:'g3s2-weight-capacity',strand:'life',level:2,label:'무게와 들이 어림하기',std:['[4수03-17]','[4수03-20]']},{
  answerKind:'text',errorCount:2,
  texts:['{question} 어느 것일까요?'],
  draw: explain(function(rng) {const capacity=rng.pick([true,false]),entries=capacity?capacities:weights,entry=rng.pick(entries.filter(e=>Number.isInteger(e[1]))),[target,n]=entry,others=rng.shuffle(entries.filter(e=>e!==entry&&(e[3]<=n/2||e[2]>=n*2))).slice(0,3);if(others.length!==3)return null;
    const all=numbered(rng,[entry,...others],e=>e===entry),unit=capacity?'L':'kg',measure=capacity?'들이':'무게';
    return {capacity,n,target,unit,measure,targetMeasure:measureText(capacity,n),targetShort:target.includes("쯤인 ")?target.split("쯤인 ").at(-1):target,asUnit:capacity?'로':'으로',options:all.map(e=>e.number+'번'),panels:all.map(({0:object,1:value,2:min,3:max,number})=>({object,label:object,value,min,max,number})),question:`${measure}가 약 ${measureText(capacity,n)}인 ${capacity?"용기는":"물건은"}`,
      ...errors(...all.filter(e=>e[0]!==target).slice(0,2).map(({0:name,1:value,number})=>wrong(number+'번',`${name}의 ${measure} 어림하기`,`${number}번 ${josa(name,'을/를')} 골랐지만 ${measure}가 약 ${measureText(capacity,n)}인 ${capacity?'용기는':'물건은'} 아닙니다. ${name}의 ${measure}는 약 ${measureText(capacity,value)}이고, 약 ${measureText(capacity,n)}인 것은 ${all.find(e=>e[0]===target).number}번 ${target}입니다.`)))};}, v => {const describe=p=>p.object+'의 '+v.measure+'는 '+(p.object.includes('쯤')?measureText(v.capacity,p.value)+' 정도':'약 '+measureText(v.capacity,p.value))+'입니다.';return [v.panels.slice(0,2).map(describe).join(' '),v.panels.slice(2).map(describe).join(' ')];}),

  answer:({panels,n})=>panels.find(p=>p.value===n).number+'번',check:({panels,n})=>panels.find(p=>p.min<=n&&p.max>=n).number+'번',
  isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&p.value===v.n),
  art:({capacity,panels})=>({kind:capacity?'cup':'scale',panels,hideValues:true}),
  solution: "{process}\n따라서 {measure}가 약 {targetMeasure}인 것은 {answer} {targetShort:입니다}.",
});
