import {pictureRows} from './pictograph-helpers.js?v=9a67f36b25';
import {define,seq,wrong,errors} from './helpers.js?v=9a67f36b25';
import {cycle} from './arithmetic-helpers.js?v=9a67f36b25';
const cases=[10,100].flatMap(k=>seq(1,9).flatMap(a=>seq(1,9).map(b=>({k,a,b}))));
export default define({id:'g3.pictograph.mixed',unit:'g3s2-picture-graphs',strand:'life',level:2,label:'큰 그림과 작은 그림 읽기',std:['[4수04-01]']},{
  input:'number',answerUnit:'개',range:{min:0,max:9999},answerSpan:cases.map(({a,b,k})=>a*k+b*k/10),errorCount:3,back:'g2s2-tables-graphs',
  texts:["그림그래프에 나타낸 {object:은/는} 모두 몇 개일까요?","그림그래프에 나타낸 {object:은/는} 모두 몇 개일까요?"],
  draw(rng){const {k,a,b}=cycle(rng,'pictograph-mixed',cases),object=rng.pick(['사과','배','귤','감']);return {k,a,b,small:k/10,object,...pictureRows(rng,object,a*k+b*k/10,k,k/10),big:a*k,little:b*k/10,count:a+b,
    ...errors(wrong(a+b,'큰 그림과 작은 그림을 같게 세기','큰 그림과 작은 그림이 나타내는 수를 보지 않고 그림 {count}개를 {count}개로 세었습니다. 큰 그림 {a}개는 {big}개, 작은 그림 {b}개는 {little}개이므로 {big} + {little} = {answer}개입니다.'),wrong(a*k,'작은 그림 빠뜨리기','큰 그림이 나타내는 {big}개만 썼습니다. 빠뜨린 작은 그림 {b}개가 나타내는 {little}개도 더하면 {answer}개입니다.'),wrong((a+b)*k,'작은 그림도 큰 그림으로 계산하기',`작은 그림도 하나에 ${k}개로 세어 ${(a+b)*k}개라고 했습니다. 작은 그림 하나는 ${k/10}개이므로 ${a*k} + ${b*k/10} = ${a*k+b*k/10}개입니다.`))};},
  answer:({big,little})=>big+little,check:({a,b,k})=>Array(a).fill(k).reduce((x,y)=>x+y,b*k/10),
  art:({labels,values,k,small})=>({kind:'pictograph',title:'과일별 수확한 개수',labels,values,unit:k,smallUnit:small,unitLabel:'개'}),
  solution:'큰 그림 하나는 {k}개, 작은 그림 하나는 {small}개를 나타냅니다.\n큰 그림 {a}개는 {big}개, 작은 그림 {b}개는 {little}개이므로 {big} + {little} = {answer}입니다.\n따라서 {object:은/는} 모두 {answer}개입니다.',
});
