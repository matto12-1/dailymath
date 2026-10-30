import {j} from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.graphs.table","unit":"g2s2-tables-graphs","strand":"life","level":1,"label":"표에서 읽기","std":["[2수04-02]"]}, {

  range:{min:0,max:9},operandRange:{min:0,max:9},answerSpan:seq(1,9),texts:['표에서 {fruit:을/를} 고른 사람은 몇 명일까요?'],
  draw(rng){const labels=rng.shuffle(['사과','배','귤']),values=rng.shuffle(seq(1,9)).slice(0,3),at=rng.int(0,2),others=[values[at===2?1:at+1],values[at===1?0:2-at]];
    return {labels,values,at,fruit:labels[at],...errors(wrong(others[0],'옆 항목 읽기',`${labels[at]} 대신 ${j(labels[values.indexOf(others[0])],'을/를')} 고른 사람 수를 읽었습니다. ${labels[values.indexOf(others[0])]} 열 대신 ${labels[at]} 열의 수를 읽으면 ${values[at]}명입니다.`),
      wrong(others[1],'다른 항목 읽기',`${labels[at]} 대신 ${j(labels[values.indexOf(others[1])],'을/를')} 고른 사람 수를 읽었습니다. ${labels[values.indexOf(others[1])]} 아래의 수가 아니라 ${labels[at]} 아래의 수를 읽으면 ${values[at]}명입니다.`))};},
  answer:({values,at})=>values[at],check:({labels,values,fruit})=>Object.fromEntries(labels.map((x,i)=>[x,values[i]]))[fruit],
  art:({labels,values})=>({kind:'table',fontSize:22,rows:[['과일',...labels],['사람 수(명)',...values]],columnWidths:[132,66,66,66]}),solution: "표에서 {fruit} 아래의 사람 수를 읽습니다.\n따라서 {fruit:을/를} 고른 사람은 {answer}명입니다.",
});
