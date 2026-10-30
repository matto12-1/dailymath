import { explain, j, ordinal } from '../solution-process.js?v=9a67f36b25';
import { define, unique, wrong, errors, criteria, sortKey, groupItems, groupSignature, sortItems } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.classify.rule","unit":"g2s1-classify","strand":"life","level":2,"label":"분류 기준","std":["[2수04-01]"]}, {

  answerKind:'text',texts:['물건을 분류한 기준은 무엇일까요?'],
  draw: explain(function(rng) {const criterion=rng.pick(criteria),items=sortItems(rng),groups=groupItems(items,criterion),others=criteria.filter(c=>c!==criterion);
    if(groups.length<2||others.some(c=>groupSignature(groupItems(items,c))===groupSignature(groups)))return null;
    return {criterion,items,groups,options:criteria,...errors(...others.map(c=>wrong(c,c+'만 보고 기준 고르기',`${j(c,'을/를')} 분류 기준으로 골랐습니다. ${groups.some(g=>unique(g.map(x=>sortKey(c,x))).length>1)?'한 묶음 안에 '+j(c,'이/가')+' 다른 물건도 있지만':'서로 다른 묶음에도 '+j(c,'이/가')+' 같은 물건이 있지만'}, ${j(criterion,'이/가')} 각 묶음 안에서 같으므로 분류 기준은 ${criterion}입니다.`)))};}, v => [v.groups.map((g,i)=>ordinal(i+1)+' 묶음은 '+(v.criterion==='색깔'?g[0].color+'색':v.criterion==='모양'?({triangle:'삼각형',square:'사각형',circle:'원'})[g[0].shape]:g[0].size<1?'작은 물건':'큰 물건')+' '+g.length+'개').join(', ')+'입니다.', '한 묶음 안의 물건은 '+j(v.criterion,'이/가')+' 모두 같고, 묶음마다 '+j(v.criterion,'이/가')+' 다릅니다.']),
  answer:({criterion})=>criterion,check:({groups})=>criteria.find(c=>groups.every(g=>unique(g.map(x=>sortKey(c,x))).length===1)&&unique(groups.map(g=>sortKey(c,g[0]))).length===groups.length),
  isCorrect:({groups},c)=>criteria.includes(c)&&groups.every(g=>unique(g.map(x=>sortKey(c,x))).length===1)&&unique(groups.map(g=>sortKey(c,g[0]))).length===groups.length,
  art:({items,groups})=>({kind:'sort',items,groups}),solution: "{process}\n따라서 분류 기준은 {answer}입니다.",
});
