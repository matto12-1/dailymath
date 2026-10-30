import { explain, say } from '../solution-process.js?v=9a67f36b25';
import { define, seq, shapes, names, colors, item, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.classify.shape","unit":"g2s1-classify","strand":"life","level":2,"label":"모양으로 분류","std":["[2수04-01]"]}, {

  range:{min:2,max:8},operandRange:{min:0,max:9},errorCount:3,answerSpan:seq(2,8),edgeWeight:4,
  texts:['{name}은 모두 몇 개일까요?'],
  // 물어본 모양·실수 값·채움 보기를 모두 2~8개로 맞춘다(C-9).
  candidates:seq(2,8),
  draw: explain(function(rng) {const type=rng.pick(shapes),n=rng.int(2,8),a=rng.int(1,n-1),cs=rng.shuffle(colors),direction=rng.pick([-1,1]),firstOnly=rng.pick([true,false]);
    const items=rng.shuffle([...Array.from({length:a},()=>item(type,cs[0])),...Array.from({length:n-a},()=>item(type,cs[1])),...Array.from({length:rng.int(1,9-n)},(_,i)=>item(rng.pick(shapes.filter(s=>s!==type)),i===0?cs[0]:rng.pick(cs)))]);
    return {type,name:names[type],items,...errors(
      wrong(firstOnly?a:n-a,'한 색깔 모양만 세기',`${firstOnly?cs[0]:cs[1]} ${names[type]}만 세었습니다. 다른 색의 같은 모양도 모으면 ${n}개입니다.`),
      wrong(n+direction,direction>0?'같은 모양 두 번 세기':'같은 모양 하나 빠뜨리기',direction>0?`${names[type]} 한 개를 두 번 세었습니다. 같은 모양을 한 번씩만 세면 ${n}개입니다.`:`${names[type]} 한 개를 빠뜨렸습니다. 빠뜨린 모양 하나까지 넣으면 ${n}개입니다.`),
      wrong(items.length,'다른 모양까지 세기',`${names[type]}이 아닌 모양까지 모두 세었습니다. 다른 모양은 빼고 ${names[type]}만 세면 ${n}개입니다.`))};}, v => {const present=[...new Set(v.items.filter(p=>p.shape===v.type).map(p=>p.color))];return ['색이 달라도 ' + v.name + ' 모양이면 한데 모읍니다.', present.map(c=>c+'색 '+v.name+'은 '+v.items.filter(p=>p.shape===v.type&&p.color===c).length+'개입니다.').join(' '), present.map(c=>v.items.filter(p=>p.shape===v.type&&p.color===c).length).join(' + ') + ' = ' + say(v.items.filter(p=>p.shape===v.type).length)];}),
  answer:({items,type})=>items.filter(x=>x.shape===type).length,
  check:({items,type})=>items.reduce((n,x)=>n+Number(x.shape===type),0),
  art:({items})=>({kind:'sort',items}),
  solution: "{process}\n따라서 {name:은/는} {answer}개입니다.",
});
