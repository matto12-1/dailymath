import {pictureRows} from './pictograph-helpers.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({id:'g3.pictograph.represent',unit:'g3s2-picture-graphs',strand:'life',level:2,label:'그림 수로 나타내기',std:['[4수04-01]']},{
  input:'number',answerUnit:'개',range:{min:0,max:9999},answerSpan:seq(2,9),errorCount:2,back:'g2s2-tables-graphs',
  texts:["그림그래프에서 {object} {A}개를 나타내려면 그림은 몇 개 필요할까요?","그림그래프에서 {object} {A}개를 나타내려면 그림은 몇 개 필요할까요?"],
  draw(rng){const n=rng.int(2,9),k=rng.pick([10,100]),A=n*k,object=rng.pick(['사과','배','귤','감']);return {n,k,A,object,...pictureRows(rng,object,0,k),
    ...errors(wrong(A,'자료 수만큼 그림 그리기','실제 개수 {A}개만큼 그림도 {A}개 그리려고 했습니다. 그림 하나가 {k}개를 나타내고 {A:은/는} {k:이/가} {n}개이므로 필요한 그림은 {n}개입니다.'),k===10?wrong(A*k,'나누지 않고 곱하기','그림 수를 구할 때 {A} × {k} = {multiplied:으로/로} 계산했습니다. {A:은/는} {k:이/가} {n}개이므로 그림은 {n}개 필요합니다.'):wrong(k,'범례 수만 답하기','그림 하나가 나타내는 개수 {k:을/를} 썼습니다. {k}개짜리 그림을 {n}개 모으면 {A}개이므로 필요한 그림은 {n}개입니다.')),multiplied:k===10?A*k:k};},
  answer:({A,k})=>A/k,check:({n})=>n,
  art:({object,k,labels,values})=>({kind:'pictograph',title:'과일별 수확한 개수',labels,values,unit:k,unitLabel:'개',blankRows:[labels.indexOf(object)]}),
  solution:"그림 하나는 {k}개를 나타냅니다. {A:은/는} {k:이/가} {n}개입니다.\n따라서 필요한 그림은 {answer}개입니다.",
});
