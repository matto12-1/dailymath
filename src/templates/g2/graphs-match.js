import { define, seq, numbered, panelVars, panelAnswer,wrong } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.graphs.match","unit":"g2s2-tables-graphs","strand":"life","level":2,"label":"표와 그래프","std":["[2수04-02]","[2수04-03]"]}, {

  errorCount:3,answerKind:'text',texts:['표와 같이 ○로 나타낸 그래프는 어느 것일까요?'],
  draw(rng){const labels=rng.shuffle(['사과','배','귤']).slice(0,2),values=rng.shuffle(seq(2,7)).slice(0,2);
    const panels=numbered(rng,[{values,right:true},{values:[values[1],values[0]],swap:true},{values:[values[0]-1,values[1]],missing:true},{values:[values[0]+1,values[1]],extra:true}],p=>p.right);
    return {labels,values,e3:wrong(panels.find(p=>p.extra).number+'번','표시 하나 더 그리기',panels.find(p=>p.extra).number+'번은 '+labels[0]+'의 표시가 하나 더 있습니다. 더 그린 한 개를 빼고 표의 수에 맞춘 것은 '+panelAnswer({panels})+'입니다.'),details:labels.map((label,i)=>label+' '+values[i]+'명').join(', '),...panelVars(panels,p=>p.swap,p=>p.missing,`두 과일의 사람 수를 서로 바꾼 그래프를 골랐습니다. ${labels[0]}의 동그라미는 ${values[0]}개, ${labels[1]}의 동그라미는 ${values[1]}개이므로 ${panelAnswer({panels})}입니다.`,`${labels[0]}의 동그라미가 하나 빠진 그래프를 골랐습니다. 빠뜨린 표시까지 넣어 ${labels[0]} ${values[0]}개, ${labels[1]} ${values[1]}개로 나타낸 것은 ${panelAnswer({panels})}입니다.`)};},
  answer:panelAnswer,check:({values,panels})=>panels.find(p=>p.values.every((v,i)=>v===values[i])).number+'번',
  isCorrect:({values,panels},c)=>panels.some(p=>p.number+'번'===c&&p.values.every((v,i)=>v===values[i])),
  art:({labels,values,panels})=>({kind:'pictograph',labels,values,sourceTable:{rows:[['과일',...labels],['사람 수(명)',...values]],columnWidths:[145,75,75]},unitLabel:'명',panels}),
  solution: "동그라미 한 개는 한 명을 나타냅니다. 표에서 {details}이므로 같은 수의 동그라미로 나타낸 그래프를 찾습니다.\n따라서 답은 {answer}입니다.",
});
