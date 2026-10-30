import { define, numbered, panelVars, panelAnswer } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.length1.compare","unit":"g2s1-length","strand":"life","level":1,"label":"막대 길이 비교","std":["[2수03-06]"]}, {

  answerKind:'text',orderAsked:true,texts:['가장 {asked} 막대는 어느 것일까요?'],
  draw(rng){const values=rng.shuffle([rng.int(1,2),rng.int(3,4),rng.int(5,6),rng.int(8,9)]),big=rng.pick([true,false]);
    const target=big?Math.max(...values):Math.min(...values),opposite=big?Math.min(...values):Math.max(...values);
    const middle=values.find(v=>v!==target&&v!==opposite);
    const panels=numbered(rng,values.map(measure=>({measure,right:measure===target,opposite:measure===opposite,thick:measure===middle,thickness:14})),p=>p.right);
    return {...panelVars(panels,p=>p.thick,p=>p.opposite,`${panels.find(p=>p.thick).number}번 막대는 가장 ${big?'길지':'짧지'} 않습니다. 한쪽 끝을 맞추어 다른 쪽 끝을 비교하면 가장 ${big?'긴':'짧은'} 막대는 ${panelAnswer({panels})}입니다.`,`가장 ${big?'짧은':'긴'} ${panels.find(p=>p.opposite).number}번 막대를 골랐습니다. 반대쪽 끝의 위치까지 모두 비교하면 답은 ${panelAnswer({panels})}입니다.`),big,asked:big?'긴':'짧은',extent:big?'많이':'적게'};},
  answer:panelAnswer,check:({panels,big})=>[...panels].sort((a,b)=>big?b.measure-a.measure:a.measure-b.measure)[0].number+'번',
  isCorrect:({panels,big},c)=>panels.some(p=>p.number+'번'===c&&panels.every(q=>big?p.measure>=q.measure:p.measure<=q.measure)),
  art:({panels})=>({kind:'compare',type:'length',panels}),
  solution: "막대의 한쪽 끝을 맞추면 다른 쪽 끝이 가장 {extent} 나온 막대가 가장 {asked} 막대입니다.\n따라서 답은 {answer} 막대입니다.",
});
