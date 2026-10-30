import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

// 고른 사람은 1~9명이다. 전엔 2~8명이라 1·9가 늘 오답으로만 나와 지우고 찍었다(검수 2번).
export default define({"id":"g2.graphs.symbols","unit":"g2s2-tables-graphs","strand":"life","level":2,"label":"동그라미 그래프","std":["[2수04-03]"]}, {

  range:{min:0,max:9},operandRange:{min:0,max:9},errorCount:3,answerSpan:seq(1,9),texts:['그래프에서 {fruit:을/를} 고른 사람은 몇 명일까요?'],
  candidates:seq(1,9),
  draw(rng){const labels=rng.shuffle(['사과','배','귤']).slice(0,2),n=rng.int(1,9),other=rng.int(1,8),at=rng.int(0,1),values=at===0?[n,other]:[other,n],direction=rng.pick([-1,1]);return {labels,n,other,values,fruit:labels[at],
    ...errors(wrong(n+1,'처음 표시 두 번 세기',`${labels[at]}의 동그라미를 한 번 더 세었습니다. 동그라미를 한 번씩만 세면 ${n}개이므로 ${n}명입니다.`),
      wrong(n-1,'표시 하나 빠뜨리기',`${labels[at]}의 동그라미를 한 개 빠뜨리고 세었습니다. 빠뜨린 한 개까지 세면 ${n}개이므로 ${n}명입니다.`),
      wrong(n+direction*2,direction>0?'표시 두 개 더 세기':'표시 두 개 빠뜨리기',direction>0?`${labels[at]}의 동그라미를 두 개 더 세었습니다. 더 센 두 개를 빼고 세면 ${n}개이므로 ${n}명입니다.`:`${labels[at]}의 동그라미를 두 개 빠뜨렸습니다. 빠뜨린 두 개까지 세면 ${n}개이므로 ${n}명입니다.`))};},
  answer:({n})=>n,check:({labels,values,fruit})=>values[labels.indexOf(fruit)],
  art:({labels,values})=>({kind:'pictograph',labels,values,unit:1,unitLabel:'명'}),
  solution: "동그라미 한 개는 한 명을 나타냅니다. {fruit}의 동그라미는 {answer}개입니다.\n따라서 {fruit:을/를} 고른 사람은 {answer}명입니다.",
});
