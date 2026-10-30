import { define, seq, sum, until, wrong, errors, fill } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.graphs.survey',unit:'g2s2-tables-graphs',strand:'word',level:3,label:'과일 조사표',std:['[2수04-02]']},{
  referenceArt:'table',
  range:{min:0,max:20},operandRange:{min:0,max:20},errorCount:3,answerSpan:seq(3,20),edgeWeight:3,
  texts:['표에서 조사한 사람은 모두 몇 명일까요?'],
  draw(rng){const total=rng.int(3,20),count=total>18?3:rng.pick([2,3]),labels=rng.shuffle(['사과','배','귤','포도']).slice(0,count),direction=rng.pick([-1,1]),extra=rng.pick([-2,2,2]);
    const values=until(()=>{const values=Array.from({length:count-1},()=>rng.int(1,9)),last=total-values.reduce((s,n)=>s+n,0);return last>=1&&last<=9?[...values,last]:null;});
    return {labels,values,numbers:values.join(' + '),...errors(
      wrong(total-values.at(-1),'마지막 항목 빠뜨리기',fill('{fruit:을/를} 고른 {n}명을 더하지 않았습니다. 빠뜨린 항목까지 더하면 {numbers} = {total}입니다.',{fruit:labels.at(-1),n:values.at(-1),numbers:values.join(' + '),total})),
      wrong(total+direction,'합계 하나 달리 세기',`표의 수를 더할 때 하나 ${direction>0?'더':'덜'} 세었습니다. 각 칸의 수를 한 번씩만 더하면 ${values.join(' + ')} = ${total}입니다.`),
      wrong(total+extra,extra>0?'합계 두 명 더 세기':'합계 두 명 덜 세기',extra>0?`표의 수를 더할 때 두 명을 더 세었습니다. 더 센 두 명을 제외하여 합하면 ${values.join(' + ')} = ${total}입니다.`:`표의 수를 더할 때 두 명을 빠뜨렸습니다. 빠뜨린 두 명까지 넣어 합하면 ${values.join(' + ')} = ${total}입니다.`))};},
  candidates:({values})=>seq(Math.max(...values)+1,20),
  answer:({values})=>values.reduce((s,n)=>s+n,0),check:({values})=>sum(...values),back:'g1s1-addsub',
  art:({labels,values})=>({kind:'table',fontSize:22,labels:[...labels,'합계'],values:[...values,'□'],rows:[['과일',...labels,'합계'],['사람 수(명)',...values,'□']],columnWidths:[132,...labels.map(()=>66),66]}),
  solution: "표의 사람 수를 더하면 {numbers} = {answer}입니다.\n따라서 조사한 사람은 모두 {answer}명입니다.",
});
