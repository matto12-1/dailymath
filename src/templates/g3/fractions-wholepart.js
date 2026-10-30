import { define, wrong, errors } from './helpers.js?v=9a67f36b25';
import { frac } from '../../engine/answer.js?v=9a67f36b25';

export default define({id:'g3.fractions.wholepart',unit:'g3s2-fractions',strand:'life',level:1,label:'전체와 부분의 분수',std:['[4수01-09]']},{
  input:'number',answerKind:'fraction',mixedInput:true,errorCount:2,
  texts:["그림의 {A}개를 {k}개씩 묶었습니다. 색칠한 {selected}개는 전체의 몇 분의 몇일까요?","그림의 {A}개를 {k}개씩 묶었습니다. 색칠한 {selected}개는 전체의 몇 분의 몇일까요?"],
  draw(rng){const d=rng.int(2,9),k=rng.int(2,9),n=rng.int(1,d-1);if(k===d)return null;
    return {d,k,n,A:k*d,selected:k*n,object:rng.pick(['circle','square','triangle']),
      ...errors(wrong(frac(0,n,k),'묶음 속 개수를 분모로 쓰기','한 묶음의 개수를 분모로 써서 {n}/{k:을/를} 썼습니다. 전체는 {d}묶음이고 색칠한 부분은 {n}묶음이므로 {n}/{d}입니다.'),
        wrong(frac(0,n*k,d),'낱개와 묶음 섞어 쓰기','분자에 낱개를 써서 {selected}/{d:을/를} 썼습니다. 색칠한 {selected}개는 {n}묶음이므로 전체 {d}묶음의 {n}/{d}입니다.'))};},
  answer:({n,d})=>frac(0,n,d),check:({selected,A})=>`${selected}/${A}`,
  art:({d,k,n,object})=>({kind:'band',groupedObjects:true,groups:d,groupSize:k,selectedGroups:n,object}),
  solution:"{A}개를 {k}개씩 묶으면 {d}묶음이고 색칠한 {selected}개는 {n}묶음입니다.\n따라서 색칠한 부분은 전체의 {answer:입니다}.",
});
