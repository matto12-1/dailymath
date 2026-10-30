import { explain, ordinal } from '../solution-process.js?v=9a67f36b25';
import { balancedCells } from '../../art/figure.js?v=9a67f36b25';
import { define, seq, shapes, colors, item, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.classify.color',unit:'g2s1-classify',strand:'life',level:1,label:'색깔로 분류',std:['[2수04-01]']},{
  range:{min:2,max:7},operandRange:{min:0,max:10},errorCount:3,answerSpan:seq(2,7),edgeWeight:4,
  texts:['{color}색 모양은 몇 개일까요?'],
  // 실수 값과 채움 보기를 모두 답이 될 수 있는 2~7개 안에서 고른다(C-9).
  candidates:seq(2,7),
  draw: explain(function(rng) {const color=rng.pick(colors),others=colors.filter(c=>c!==color),n=rng.int(2,7),k=rng.int(3,10-n),first=rng.int(1,k-2),second=rng.int(1,k-first-1),direction=rng.pick([-1,1]);
    const items=rng.shuffle([...Array.from({length:n},()=>item(rng.pick(shapes),color)),...Array.from({length:first},()=>item(rng.pick(shapes),others[0])),...Array.from({length:second},()=>item(rng.pick(shapes),others[1])),...Array.from({length:k-first-second},()=>item(rng.pick(shapes),others[2]))]);
    return {color,items,...errors(wrong(n+k,'모든 모양 세기',`색깔을 나누지 않고 모든 모양을 세었습니다. 다른 색은 빼고 ${color}색만 가려 세면 ${n}개입니다.`),
      wrong(n-1,'같은 색 모양 하나 빠뜨리기',`${color}색 모양을 한 개 빠뜨렸습니다. 빠뜨린 같은 색 모양까지 넣어 세면 ${n}개입니다.`),
    wrong(n+(direction>0?1:-2),direction>0?'같은 색 모양 두 번 세기':'같은 색 모양 두 개 빠뜨리기',direction>0?`${color}색 모양 한 개를 두 번 세었습니다. 같은 색 물건을 한 번씩만 세면 ${n}개입니다.`:`${color}색 모양 두 개를 빠뜨렸습니다. 빠뜨린 ${color}색 두 개까지 모두 세면 ${n}개입니다.`))};}, v => {const cells=balancedCells(v.items.length,6);return ['색만 보고 ' + v.color + '색 모양을 고릅니다.',v.color+'색 모양은 '+[0,1].map(row=>{const positions=v.items.map((p,i)=>p.color===v.color&&cells[i].row===row?ordinal(cells[i].col+1):null).filter(Boolean);return positions.length?(cells.every(c=>c.row===0)?'왼쪽부터 ':(row===0?'윗줄':'아랫줄')+'의 ' )+positions.join(', '):null;}).filter(Boolean).join('와 ')+'에 있습니다.'];}),
  answer:({items,color})=>items.filter(x=>x.color===color).length,check:({items,color})=>items.reduce((n,x)=>n+Number(x.color===color),0),
  art:({items})=>({kind:'sort',items}),solution: "{process}\n따라서 {color}색 모양은 {answer}개입니다.",
});
