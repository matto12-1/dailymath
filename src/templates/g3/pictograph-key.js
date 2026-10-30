import {pictureRows} from './pictograph-helpers.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({id:'g3.pictograph.key',unit:'g3s2-picture-graphs',strand:'life',level:1,label:'그림 한 개의 뜻',std:['[4수04-01]']},{
  input:'number',answerUnit:'개',range:{min:0,max:999},answerSpan:[...seq(20,90,10),...seq(200,900,100)],errorCount:2,back:'g2s2-tables-graphs',
  texts:['그림그래프에서 {object:은/는} 모두 몇 개일까요?'],
  draw(rng){const n=rng.int(2,9),k=rng.pick([10,100]),object=rng.pick(['사과','배','귤','감']);return {n,k,object,...pictureRows(rng,object,n*k,k),
    ...errors(wrong(n,'그림 수만 답하기','그림 수 {n}개만 썼습니다. 그림 하나가 {k}개를 나타내고 그림이 {n}개이므로 {k} × {n} = {answer}개입니다.'),wrong(k,'그림 하나의 값만 답하기','그림 하나의 값 {k}개만 썼습니다. {k}개씩 {n}개의 그림이 있으므로 모두 {answer}개입니다.'))};},
  answer:({n,k})=>n*k,check:({n,k})=>Array(n).fill(k).reduce((a,b)=>a+b,0),
  art:({k,labels,values})=>({kind:'pictograph',title:'과일별 수확한 개수',labels,values,unit:k,unitLabel:'개'}),
  solution:'{object} 그림 하나는 {k}개를 나타냅니다.\n{object} 그림이 {n}개이므로 {k} × {n} = {answer}입니다.\n따라서 {object:은/는} 모두 {answer}개입니다.',
});
