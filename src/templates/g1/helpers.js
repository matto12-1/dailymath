import { until } from '../../engine/retry.js?v=9a67f36b25';
import { templateOf } from '../../engine/template.js?v=9a67f36b25';

// 채움 보기 규칙(검수 뿌리 4). 1·2학년 도우미가 같이 쓴다.
// - 그 틀의 정답 목록(answerSpan): 배열이나 { min, max }. 없으면 null.
export function answerSet(t) {
  const s = t?.answerSpan;
  if (!s) return null;
  return new Set(Array.isArray(s) ? s : Array.from({ length: s.max - s.min + 1 }, (_, i) => s.min + i));
}
// - 답이 될 수 없는 상수 보기: 정답 목록 밖이면서 0·1·10·100·1000이거나, 정답 목록 바로 바깥 두 칸 안(5까지 세는 틀의 6·7).
//   늘 나오는데 한 번도 답이 아니면 아이가 그 보기부터 지운다.
export const hardConstant = (n, span) => !!span && !span.has(n) && [0, 1, 10, 100, 1000].includes(n);
export function edgeConstant(n, span) {
  if (!span || span.has(n)) return false;
  if (hardConstant(n, span)) return true;
  const xs = [...span].sort((a, b) => a - b), step = Math.max(1, Math.min(...xs.slice(1).map((x, i) => x - xs[i])));
  return (n < xs[0] && n >= xs[0] - 2 * step) || (n > xs.at(-1) && n <= xs.at(-1) + 2 * step);
}
// - 채움 후보: 정답 가까이(±10, 몇십 후보면 ±30, 몇백이면 ±300), 정답 목록 안을 먼저 쓴다. 모자라면 차례로 넓힌다
//   (넓혀도 0·1·10 같은 상수는 정답 가까이에서 쓰지 않는다). 실수 값은 언제나 채움으로도 쓸 수 있다(핵심 실수를 채움보다 먼저).
export function fillLevels(pool, answer, span, usable, wrongs = []) {
  const bridges=[];
  for(const x of [answer,...wrongs])for(const y of [answer,...wrongs])if(String(x).length===String(y).length){
    const a=[...String(x)],b=[...String(y)];for(let k=0;k<a.length;k++){const ds=[...a];ds[k]=b[k];bridges.push(Number(ds.join('')));}
  }
  const allowed = new Set(pool);
  const all = [...new Set([...wrongs,...bridges.filter(n=>allowed.has(n)), ...pool])].filter((n) => n !== answer && usable(n));
  // 칸 크기는 정답 목록의 간격과 채움 후보의 간격 가운데 큰 것(몇십 답이나 몇십 후보면 10).
  const step = (xs) => { const s = [...new Set(xs)].sort((a, b) => a - b), gaps = s.slice(1).map((x, i) => x - s[i]); return gaps.length ? Math.min(...gaps) : 1; };
  const reach = Math.max(10, 3 * step([...pool, answer]), span ? 3 * step([...span]) : 0);
  const wide = all.filter((n) => wrongs.includes(n) || !hardConstant(n, span));
  const near = wide.filter((n) => wrongs.includes(n) || Math.abs(n - answer) <= reach);
  const inSpan = (span ? wide : near).filter((n) => wrongs.includes(n) || (span ? span.has(n) && Math.abs(n - answer) <= Math.max(20, reach) : true));
  return [inSpan, near, wide, all];
}
// 보기 넷 가운데 정답이 연속한 세 수 이상의 끝에 오는가. 「연속 셋의 끝」만 골라 맞히는 요령을 막는다.
export function runEnd(options, answer) {
  const s = [...new Set(options)].sort((a, b) => a - b);
  let best = null;
  for (let i = 0; i < s.length; i++) {
    let j = i;
    while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++;
    if (j - i + 1 >= 3 && (!best || j - i > best[1] - best[0])) best = [i, j];
  }
  return !!best && (s[best[0]] === answer || s[best[1]] === answer);
}
// 보기 두 개 이상은 실제 실수에서 고른다. 남은 수는 같은 단원 안, 정답 가까이에서 뽑는다.
// 크기순 자리를 먼저 고르게 고른다. 단순히 보기 순서만 바꾸지 않는다.
// 세기 실수(countingErrors)는 하나만 쓰며, 학습 범위를 벗어나거나 정답과 같은 값은 제외한다.
export function numberVars(rng, attempt, answer, mistakes, range, { differentDigits = false, edgeWeight = 1, candidates, directionFor,rankWeights,requiredChoices,acceptChoices,allowRankFallback=false,balanceRank=true } = {}) {
  // 정답 목록은 틀의 answerSpan, 없으면 틀이 정한 채움 후보 목록(세는 틀의 1~6)으로 본다.
  const t = templateOf(rng), span = (t && t.range === range ? answerSet(t) : null) ?? (Array.isArray(candidates) ? new Set(candidates) : null);
  const counting = mistakes.some((m) => m.id.startsWith('count-'));
  // 씨앗마다 첫 문제도 고르게 낸다. 0 학습은 0 답의 비율을 따로 정하므로 제외한다.
  const rank = !balanceRank||['g1.nine.zero','g1.patterns.numbers','g1.addsub4.borrow'].includes(t?.id) ? null : rng.int(0,3);
  return until(() => {
    let vars = attempt(rank);
    if (!vars) return null;
    if (counting) {
      const countDirection = directionFor ? directionFor(vars) : rng.pick([-1, 1]);
      vars = { ...vars, countDirection, countAction: countDirection > 0 ? '더' : '덜',
        countVerb: countDirection > 0 ? '두 번 세어' : '빠뜨리고 세어', countFix: countDirection > 0 ? '같은 것을 두 번 세지 않고' : '하나도 빠뜨리지 않고' };
    }
    const correct = answer(vars);
    const inRange = (n) => Number.isSafeInteger(n) && n >= range.min && n <= range.max;
    if (!inRange(correct)) return null;
    const usable = (n) => inRange(n) && (differentDigits || String(n).length === String(correct).length);
    const core = [], counted = [];
    for (const m of mistakes) {
      const n = m.value(vars);
      if (n === null || n === undefined || n === correct || !usable(n)) continue;
      if (m.id.startsWith('count-')) { if (n > 0) counted.push(n); }
      else core.push(n);
    }
    // 보기에 넣을 수 있는 서로 다른 실제 실수가 둘 이상인 조건만 쓴다.
    const wrong = [...new Set([...core, ...counted.slice(0, 1)])];
    if(wrong.length<Math.min(2,mistakes.length))return null;
    const pool = (typeof candidates === 'function' ? candidates(vars) : candidates) ?? Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i);
    // edgeWeight는 뿌리 4 뒤로 쓰지 않는다(정답 자리는 arrangeChoices가 고르게 뽑는다). 틀에서 지우는 일은 2단계.
    const levels=fillLevels(pool,correct,span,usable,wrong),accept=xs=>acceptChoices?.(vars,xs)!==false&&!(requiredChoices?.(vars)??[]).some(n=>!xs.includes(n));
    const picked=arrangeChoices(rng,correct,wrong,levels,{rank,accept})??(allowRankFallback?arrangeChoices(rng,correct,wrong,levels,{accept}):null);
    return picked ? { ...vars, options: picked } : null;
  });
}
const combos = (xs, size) => {
  if (!size) return [[]];
  const out = [];
  for (let i = 0; i < xs.length; i++) {
    if (size === 1) { out.push([xs[i]]); continue; }
    for (let j = i + 1; j < xs.length; j++) {
      if (size === 2) { out.push([xs[i], xs[j]]); continue; }
      for (let k = j + 1; k < xs.length; k++) out.push([xs[i], xs[j], xs[k]]);
    }
  }
  return out;
};
// 정답과 실제 실수 둘, 같은 단원의 채움 수로 보기 넷을 만든다.
// 첫 판의 자리도 무작위로 정하고, 이어지는 판은 크기순 자리와 숫자 모양의 쏠림을 함께 줄인다.
const rankHistory=new WeakMap();
export function arrangeChoices(rng,correct,wrong,levels,{accept=()=>true,rank=null,riskCaps=[.5,.5,.5]}={}){
 const all=[...new Set(levels.flat())].filter(n=>n!==correct),bridge=[];
 for(const x of [correct,...wrong])for(const y of [correct,...wrong])if(x!==y&&String(x).length===String(y).length){
  const a=[...String(x)],b=[...String(y)];
  for(let k=0;k<a.length;k++){const ds=[...a];ds[k]=b[k];const n=Number(ds.join(''));if(all.includes(n))bridge.push(n);}
 }
 const near=[...all].sort((a,b)=>Math.abs(a-correct)-Math.abs(b-correct));
 const fills=[...new Set([...bridge,...wrong,...rng.shuffle(near.slice(0,40)),...rng.shuffle(all)])].slice(0,28),sets=[];
 const chance=xs=>{const max=Math.max(...xs);return xs[0]===max?1/xs.filter(x=>x===max).length:0;};
 for(const head of combos(wrong,Math.min(2,wrong.length)))for(const tail of combos(fills.filter(n=>!head.includes(n)),3-head.length)){
  const options=[correct,...head,...tail],position=options.filter(n=>n<correct).length;
  if(new Set(options).size!==4||(rank!==null&&position!==rank)||!accept(options))continue;
  const ds=options.map(n=>[...String(n)]),freq=xs=>xs.map(x=>xs.filter(y=>y===x).length),odd=xs=>freq(xs).map(n=>n===1?1:0);
  const alike=ds.map((a,i)=>ds.reduce((sum,b,j)=>sum+(i===j?0:a.filter((n,k)=>n===b[k]).length),0));
  const scores=[chance(alike),chance(freq(ds.map(x=>x.at(-1))))];
  const mean=options.reduce((s,n)=>s+n,0)/4;
  const weak=[chance(odd(ds.map(x=>x[0]))),chance(odd(options.map(n=>n%2))),chance(options.map(n=>-Math.abs(n-mean)))];
  const features=[...scores,...weak,
    chance(odd(ds.map(x=>x.at(-1)))),chance(odd(ds.map(x=>x.length))),
    chance(options.map(n=>String(n).match(/0*$/)[0].length)),chance(odd(options.map(n=>n%5===0))),Number(options.slice(1).some((a,i,xs)=>xs.slice(i+1).some(b=>a+b===2*correct)))];
  if(rank!==null&&[features[0],features[1],features[4]].some((p,k)=>p>riskCaps[k]))continue;
  sets.push({options,rank:position,features});
 }
 if(!sets.length)return null;
 let histories=rankHistory.get(rng);if(!histories){histories=new Map();rankHistory.set(rng,histories);}
 const id=templateOf(rng)?.id??'manual',history=histories.get(id)??{counts:rng.shuffle([0,1,1,1]),totals:Array(sets[0].features.length).fill(.75),n:3};
 // 크기순 자리와 숫자 모양이 한쪽으로 누적되지 않도록, 실제 실수 두 개를 유지한 조합 중에서 고른다.
 const cost=s=>2*(2*history.counts[s.rank]+1)+s.features.reduce((sum,p,k)=>{
  const excess=Math.max(0,history.totals[k]+p-(history.n+1)*.30);return sum+excess*excess*(k<2||k===9?4:1);
 },0);
 const low=Math.min(...sets.map(cost)),picked=rng.pick(sets.filter(s=>Math.abs(cost(s)-low)<1e-8));
 history.counts[picked.rank]++;history.n++;picked.features.forEach((p,k)=>history.totals[k]+=p);histories.set(id,history);
 return picked.options;
}

// 물건·점·묶음을 세는 틀의 세기 실수: 하나(묶음이면 한 묶음) 더/덜 세기 하나만 쓴다.
// 수를 셈하는 틀(셈·수 규칙, object '수')에는 세기 실수를 쓰지 않는다. 「87 − 33」에 「하나 더 세기」는 맞지 않는다(뿌리 4).
// 더 센 실수와 덜 센 실수는 고치는 말이 다르다(검수 A1-24).
export function countingErrors(answer, step = 1, object = '수') {
  if (object === '수') return [];
  return [{
    id: 'count-one',
    label: `${object} 하나 {countAction} 세기`,
    say: `${object} 하나를 {countVerb} {value:이/가} 나왔습니다. {countFix} 하나씩 세면 모두 {answer}개입니다.`,
    value: v => { const n = answer(v) + v.countDirection * step; return n > 0 ? n : null; },
  }];
}

export const options = ({ options: choices }) => choices;
// 십몇이 되는 덧셈. 같은 씨앗의 두 차시는 같은 합을 다른 가르기로 풀도록 bridge 쪽은 다음 짝을 쓴다(C-29).
export function crossTenPair(rng, bridge = false) {
  const v = until(() => { const a=rng.int(1,9),b=rng.int(1,9); return a+b>=11&&a+b<=18?{a,b}:null; });
  // 18은 9+9 한 짝뿐이므로 17과 18을 서로 바꾸어 두 차시가 그 씨앗에서도 달라지게 한다.
  const total=bridge&&v.a+v.b>=17?35-v.a-v.b:v.a+v.b, lo=total-9, a=bridge?(v.a===9?lo:v.a+1):v.a, b=total-a;
  return {a,b,need:10-a,rest:total-10};
}
// 번호 답 1~4는 2·3번만으로 절반을 넘겨 맞힐 수 없도록 배치한다.
// 끝 번호 합 60%, 가운데 번호 합 40%이며 각 번호도 고정되지 않는다.
export function panelNumbers(rng, items, matches) {
  const correct = items.filter(matches);
  if (correct.length !== 1) throw new Error('번호 후보의 정답은 하나여야 해요.');
  const number = rng.pick([1, 1, 1, 2, 2, 3, 3, 4, 4, 4]);
  const arranged = rng.shuffle(items.filter((p) => !matches(p)));
  arranged.splice(number - 1, 0, correct[0]);
  return arranged.map((p, i) => ({ ...p, number: i + 1 }));
}
// 모양 세기 그림: 모양끼리 모아 두고 모양마다 빛깔을 정하면 모양이 아니라 빛깔·자리로 센다.
// 섞어 늘어놓고 빛깔도 모양과 따로 고른다(교과서도 색이 다른 물건에서 같은 모양을 찾는다).
export const mixPieces = (rng, counts) => rng.shuffle(Object.entries(counts).flatMap(([shape, n]) => Array.from({ length: n }, () => shape)))
  .map((shape) => ({ shape, n: 1, hue: rng.pick(['sage', 'orange', 'purple', 'blue']) }));
export const countSum = (...ns) => ns.reduce((sum, n) => {
  for (let i = 0; i < n; i++) sum++;
  return sum;
}, 0);
export const countBack = (a, ...ns) => {
  let left = a;
  for (const n of ns) for (let i = 0; i < n; i++) left--;
  return left;
};

export const FLAT = ['triangle', 'square', 'circle'];
export const SOLID = ['box', 'tube', 'ball'];
export const NAMES = { triangle: '세모', square: '네모', circle: '동그라미', box: '상자 모양', tube: '둥근기둥 모양', ball: '공 모양' };

export const countFrom = (start, n) => Array.from({ length: n }, (_, i) => start + i + 1).join(', ');
export const solidFeature = {
  box: '상자 모양은 평평한 부분과 뾰족한 부분이 있습니다.',
  tube: '둥근기둥 모양은 평평한 부분과 둥근 부분이 있습니다.',
  ball: '공 모양은 평평한 부분이 없고 어느 쪽으로도 둥근 모양입니다.',
};
export const flatFeature = {
  triangle: '세모는 곧은 선이 3개이고 뾰족한 부분이 3군데 있습니다.',
  square: '네모는 곧은 선이 4개이고 뾰족한 부분이 4군데 있습니다.',
  circle: '동그라미는 뾰족한 부분이 없고 둥근 선으로 이어져 있습니다.',
};
// 1학년은 자리 이름 대신 10개씩 묶음과 낱개로 수를 비교한다.
export function compareNumbers(values, largest) {
  const best = (largest ? Math.max : Math.min)(...values), tens = Math.floor(best / 10);
  const tied = values.filter(n => Math.floor(n / 10) === tens);
  return ['보기의 수에서 10개씩 묶음의 수는 ' + values.map(n => Math.floor(n / 10)).join(', ') + '입니다.',
    ...(tied.length === 1
      ? ['10개씩 묶음이 ' + tens + '개로 가장 ' + (largest ? '많은' : '적은') + ' 수는 ' + best + '입니다.']
      : [tied.join(', ') + '의 10개씩 묶음의 수가 같으므로 낱개의 수를 비교합니다.',
        '낱개가 ' + best % 10 + '개로 가장 ' + (largest ? '많은' : '적은') + ' 수는 ' + best + '입니다.'])];
}

// 정답과 고른 오답의 쌍별로 이름과 설명을 정한다.
export const NAME_ERRORS = {
  'box:tube': ['길쭉한 부분만 보기', '둥근기둥 모양을 골랐습니다. 옆면도 모두 평평하고 뾰족한 부분이 있으므로 상자 모양입니다.'],
  'box:ball': ['평평한 부분과 둥근 부분 혼동', '공 모양을 골랐습니다. 공처럼 굽은 부분이 없고 평평한 부분으로 둘러싸여 있으므로 상자 모양입니다.'],
  'tube:box': ['평평한 부분만 보기', '상자 모양을 골랐습니다. 옆의 굽은 부분과 위아래의 평평한 부분이 함께 있으므로 둥근기둥 모양입니다.'],
  'tube:ball': ['둥근 부분만 보기', '공 모양을 골랐습니다. 공과 달리 위아래에 평평한 부분이 있으므로 둥근기둥 모양입니다.'],
  'ball:box': ['겉모양 혼동', '상자 모양을 골랐습니다. 상자와 달리 평평한 부분과 뾰족한 부분이 없으므로 공 모양입니다.'],
  'ball:tube': ['구르는 것만 보기', '둥근기둥 모양을 골랐습니다. 둥근기둥과 달리 어느 쪽으로도 둥글고 평평한 부분이 없으므로 공 모양입니다.'],
  'triangle:square': ['곧은 선의 개수 혼동', '네모를 골랐습니다. 곧은 선과 뾰족한 부분이 각각 3개이므로 세모입니다.'],
  'triangle:circle': ['돌린 모양과 둥근 모양 혼동', '동그라미를 골랐습니다. 굽은 선이 아니라 곧은 선 3개로 둘러싸여 있으므로 세모입니다.'],
  'square:triangle': ['곧은 선 하나 빠뜨리기', '세모를 골랐습니다. 빠뜨린 곧은 선까지 세면 4개이므로 네모입니다.'],
  'square:circle': ['돌린 네모와 둥근 모양 혼동', '동그라미를 골랐습니다. 돌아간 방향과 관계없이 곧은 선이 4개이므로 네모입니다.'],
  'circle:triangle': ['굽은 선과 세 곧은 선 혼동', '세모를 골랐습니다. 곧은 선도 뾰족한 부분도 없으므로 동그라미입니다.'],
  'circle:square': ['굽은 선과 네 곧은 선 혼동', '네모를 골랐습니다. 네 곧은 선이 아니라 하나의 둥근 선으로 둘러싸여 있으므로 동그라미입니다.'],
};
export function nameVars(rng, types) {
  const type = rng.pick(types), wrong = types.filter((s) => s !== type);
  const [label1, say1] = NAME_ERRORS[`${type}:${wrong[0]}`];
  const [label2, say2] = NAME_ERRORS[`${type}:${wrong[1]}`];
  return { type, wrong1: NAMES[wrong[0]], wrong2: NAMES[wrong[1]], label1, label2, say1, say2 };
}
export const nameMistakes = [
  { id: 'shape-confusion-1', label: '{label1}', say: '{say1}', value: ({ wrong1 }) => wrong1 },
  { id: 'shape-confusion-2', label: '{label2}', say: '{say2}', value: ({ wrong2 }) => wrong2 },
];

export function remainingMistake(rng){
 const showTen=rng.next()<.25,offset=rng.pick([-2,2]);
 return {showTen,offset,firstLabel:showTen?'남은 수 빠뜨리기':offset>0?'이어 세기에서 두 수 더 세기':'이어 세기에서 두 수 빠뜨리기',
 firstAction:showTen?'10을 만든 뒤 남은 수를 빠뜨려':offset>0?'10 다음부터 이어 셀 때 두 수를 더 세어':'10 다음부터 이어 셀 때 두 수를 빠뜨려'};
}
