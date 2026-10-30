import { explain, j } from '../solution-process.js?v=9a67f36b25';
import { define, seq, shapes, colors, item, wrong, errors } from './helpers.js?v=9a67f36b25';
const allColors=colors;

export default define({"id":"g2.classify.most","unit":"g2s1-classify","strand":"life","level":3,"label":"많고 적은 색깔","std":["[2수04-01]"]}, {

  answerKind:'text',texts:['물건이 가장 {asked} 색깔은 무엇일까요?'],
  draw: explain(function(rng) {const counts=rng.shuffle(seq(2,6)).slice(0,4),big=rng.pick([true,false]),cs=rng.shuffle(allColors);
    const target=big?Math.max(...counts):Math.min(...counts),opposite=big?Math.min(...counts):Math.max(...counts);
    const middle=counts.find(n=>n!==target&&n!==opposite);
    const items=rng.shuffle(counts.flatMap((n,i)=>Array.from({length:n},()=>item(rng.pick(shapes),cs[i],1,big?(n===middle?1.15:0.7):(n===target?1.15:n===middle?0.7:0.9)))));
    return {items,cs,counts,big,asked:big?'많은':'적은',options:allColors.map(c=>c+'색'),
      ...errors(wrong(cs[counts.indexOf(middle)]+'색','물건 크기만 비교하기',`${cs[counts.indexOf(middle)]}색 물건이 ${big?'커서 많아':'작아서 적어'} 보여 골랐습니다. 크기와 상관없이 ${target}개로 가장 ${big?'많은':'적은'} 색깔을 찾으면 ${cs[counts.indexOf(target)]}색입니다.`),
      wrong(cs[counts.indexOf(opposite)]+'색','많고 적음 반대로 고르기',`가장 ${big?'적은':'많은'} ${cs[counts.indexOf(opposite)]}색을 골랐습니다. 네 색의 개수를 비교하여 ${target}개인 것을 찾으면 ${cs[counts.indexOf(target)]}색입니다.`))};}, v => [v.cs.map((c,i)=>c+'색은 '+v.counts[i]+'개').join(', ') + '입니다.', '개수를 작은 수부터 늘어놓으면 ' + j([...v.counts].sort((a,b)=>a-b).join(', '),'입니다') + '. 가장 ' + (v.big?'큰':'작은') + ' 수의 색을 고릅니다.']),
  answer:({cs,counts,big})=>cs[counts.indexOf(big?Math.max(...counts):Math.min(...counts))]+'색',
  check:({items,big})=>[...allColors].sort((a,b)=>(items.filter(x=>x.color===a).length-items.filter(x=>x.color===b).length)*(big?-1:1))[0]+'색',
  isCorrect:({items,big},c)=>allColors.some(color=>color+'색'===c&&allColors.every(d=>big?items.filter(x=>x.color===color).length>=items.filter(x=>x.color===d).length:items.filter(x=>x.color===color).length<=items.filter(x=>x.color===d).length)),
  art:({items})=>({kind:'sort',items}),solution: "{process}\n따라서 물건이 가장 {asked} 색깔은 {answer}입니다.",
});
