import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import { define, numbered, panelVars, panelAnswer, criteria, groupItems, groupSignature, sortItems, wrong } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.classify.own","unit":"g2s1-classify","strand":"life","level":3,"label":"분류한 그림","std":["[2수04-01]"]}, {

  answerKind:'text',errorCount:3,texts:['{criterion}에 따라 물건을 바르게 분류한 그림은 어느 것일까요?'],
  draw: explain(function(rng) {const criterion=rng.pick(criteria),items=sortItems(rng),groups=groupItems(items,criterion),other=rng.pick(criteria.filter(c=>c!==criterion)),alt=groupItems(items,other);
    if(groups.length<2||groupSignature(groups)===groupSignature(alt))return null;
    // 모든 보기에 처음 물건을 한 번씩 둔다. 틀린 보기는 한두 물건만 다른 상자에 넣는다.
    const look=gs=>gs.map(g=>g.map(x=>[x.shape,x.color,x.size].join(':')).sort().join(',')).sort().join(';');
    const candidates=new Map(),remember=gs=>{if(look(gs)!==look(groups))candidates.set(look(gs),gs);};
    groups.forEach((source,a)=>groups.forEach((target,b)=>{
      if(a===b)return;
      for(let n=1;n<=2;n++)if(source.length>n){
        const next=groups.map(g=>[...g]),picked=rng.shuffle(source).slice(0,n);
        next[a]=next[a].filter(x=>!picked.includes(x));next[b].push(...picked);remember(next);
      }
      const next=groups.map(g=>[...g]);[next[a][0],next[b][0]]=[next[b][0],next[a][0]];remember(next);
    }));
    if(candidates.size<3)return null;
    const [otherGroups,missing,extra]=rng.shuffle([...candidates.values()]).slice(0,3);
    const panels=numbered(rng,[{groups,right:true},{groups:otherGroups,other:true},{groups:missing,missing:true},{groups:extra,extra:true}],p=>p.right);
    const boxName=g=>criterion==='색깔'?g[0].color+'색 물건 상자':criterion==='모양'?({triangle:'삼각형',square:'사각형',circle:'원'})[g[0].shape]+' 상자':g[0].size<1?'작은 물건 상자':'큰 물건 상자';
    const misplaced=panel=>{
      const moved=panel.groups.flatMap((g,to)=>g.map(x=>({x,to,from:groups.findIndex(source=>source.some(y=>y.id===x.id))}))).filter(x=>x.from!==x.to);
      const object=x=>(x.size<1?'작은 ':'큰 ')+x.color+'색 '+({triangle:'삼각형',square:'사각형',circle:'원'})[x.shape];
      return panel.number+'번 그림은 '+moved.map(({x,to})=>j(object(x),'이/가')+' '+boxName(groups[to])+'에').join(', ')+' 들어 있습니다. '+(moved.length===1?panel.number+'번에 잘못 놓인 '+object(moved[0].x)+'을 '+boxName(groups[moved[0].from])+'에 넣으면 바르게 나눈 그림은 '+panels.find(p=>p.right).number+'번입니다.':panel.number+'번에서 옮겨 담은 '+moved.map(({x})=>object(x)).join(', ')+'을 각각 '+j(criterion,'이/가')+' 같은 물건 상자에 넣은 것은 '+panels.find(p=>p.right).number+'번입니다.');
    };
    return {criterion,items,...panelVars(panels,p=>p.other,p=>p.missing,misplaced(panels.find(p=>p.other)),misplaced(panels.find(p=>p.missing))),e3:wrong(panels.find(p=>p.extra).number+'번','다른 상자에 넣기',misplaced(panels.find(p=>p.extra)))};}, v => { const groups=v.panels.find(p=>p.right).groups; return [groups.map(g=>(v.criterion==='색깔'?g[0].color+'색 물건':v.criterion==='모양'?({triangle:'삼각형',square:'사각형',circle:'원'})[g[0].shape]:g[0].size<1?'작은 물건':'큰 물건')+'은 '+g.length+'개').join(', ')+'입니다.', panelAnswer(v)+' 그림은 상자마다 '+j(v.criterion,'이/가')+' 같은 물건만 들어 있습니다.']; }),
  answer:panelAnswer,check:({panels,items,criterion})=>panels.find(p=>groupSignature(p.groups)===groupSignature(groupItems(items,criterion))).number+'번',
  isCorrect:({panels,items,criterion},c)=>panels.some(p=>p.number+'번'===c&&groupSignature(p.groups)===groupSignature(groupItems(items,criterion))),
  art:({items,panels,criterion})=>({kind:'sort',items,panels,groupLabels:groupItems(items,criterion).map(g=>criterion==='색깔'?g[0].color:criterion==='모양'?({triangle:'삼각형',square:'사각형',circle:'원'})[g[0].shape]:g[0].size<1?'작은 물건':'큰 물건')}),
  solution: "{process}\n따라서 바르게 분류한 그림은 {answer}입니다.",
});
