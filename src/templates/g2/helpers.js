import { until } from '../../engine/retry.js?v=9a67f36b25';
import { fill } from '../../engine/korean.js?v=9a67f36b25';
import { answerSet, arrangeChoices, hardConstant, fillLevels } from '../g1/helpers.js?v=9a67f36b25';
export { until, fill };
export { cycle } from '../g3/arithmetic-helpers.js?v=9a67f36b25';

// 오답의 식과 말은 각 틀에서 함께 정한다. 범위를 벗어난 오답 하나만 제외한다.
export const seq = (a, b, step = 1) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => a + i * step);
export const unique = (xs) => [...new Set(xs)];
export const sum = (...xs) => xs.reduce((s, x) => { for (let i = 0; i < x; i++) s++; return s; }, 0);
// 곱셈 검산은 a를 b번 더한다. 곱의 값만큼 하나씩 세는 중첩 반복은 하지 않는다.
export const product = (a, b) => { let result = 0; for (let i = 0; i < b; i++) result += a; return result; };
export const pair = (a, b) => `${a}|${b}`;
export const shapes = ['triangle', 'square', 'circle'];
export const names = { triangle: '삼각형', square: '사각형', circle: '원' };
export const flatShapes = [...shapes];
export const verticesOf = { triangle:3, square:4, circle:0 };
export function shapeFeature(type) {
  return type==='circle'?'원은 꼭짓점도 곧은 선도 없습니다.':`${names[type]}은 변이 ${verticesOf[type]}개, 꼭짓점이 ${verticesOf[type]}개입니다.`;
}
export function arithmeticWords(a,b,subtract=false) {
  const ao=a%10,bo=b%10,at=Math.floor(a/10),bt=Math.floor(b/10),borrow=subtract&&ao<bo,carry=!subtract&&ao+bo>=10;
  const onesLeft=ao+(borrow?10:0), sign=subtract?'−':'+';
  const terms=subtract?[at-(borrow?1:0),bt]:[at,bt,...(carry?[1]:[])].filter(n=>n!==0);
  return {onesFact:`일의 자리는 ${onesLeft} ${sign} ${bo} = ${subtract?onesLeft-bo:ao+bo}이고 십의 자리까지 계산하면 ${subtract?a-b:a+b}입니다.`,
    tensFact:subtract&&bt===0?`십의 자리 ${at-(borrow?1:0)}을 그대로 쓰고 일의 자리와 모으면 ${a-b}입니다.`:`십의 자리는 ${terms.join(' '+sign+' ')} = ${subtract?at-(borrow?1:0)-bt:at+bt+(carry?1:0)}이므로 답은 ${subtract?a-b:a+b}입니다.`,
    carryTwiceFact:`받아올림한 1은 한 번만 더하므로 십의 자리 숫자는 ${at+bt+(carry?1:0)}이고 일의 자리와 모으면 ${a+b}입니다.`,
    borrowTwiceFact:`십의 자리에서 한 번만 받아내리면 ${at-1}이 남으므로 일의 자리와 함께 계산한 답은 ${a-b}입니다.`,
    borrowFact:bt?`받아내림하고 남은 십의 자리 ${at-1}에서 ${bt}을 빼고 일의 자리와 모으면 ${a-b}입니다.`:`받아내림하고 남은 십의 자리 ${at-1}을 그대로 쓰고 일의 자리와 모으면 ${a-b}입니다.`};
}
export function polygonPoints(rng,n) {
  if(n===3 || n===4){
    const variants=n===3?[
      [[1,1],[8,2],[3,8]],[[1,4],[8,3],[6,6]],[[1,1],[8,1],[1,8]],[[4,1],[7,8],[2,7]],
    ]:[
      [[1,2],[7,1],[8,7],[2,8]],[[1,1],[8,3],[6,7],[2,6]],[[1,3],[7,2],[8,5],[2,6]],[[2,1],[7,1],[8,8],[1,8]],
    ];
    return rng.pick(variants).map(([x,y])=>[x,y]);
  }
  const rx=rng.int(27,36)/10,ry=rng.int(27,36)/10;
  return Array.from({length:n},(_,i)=>{const a=(i*360/n+rng.int(-5,5)-90)*Math.PI/180;return [Number((4.5+rx*Math.cos(a)).toFixed(2)),Number((4.5+ry*Math.sin(a)).toFixed(2))];});
}
export const colors = ['빨간', '파란', '노란', '보라'];
export const item = (shape, color, n = 1, size = 1) => ({ shape, color, n, size });
export const opts = (v) => v.options;
export function wrong(value, label, say, back) { return { value, label, say, ...(back ? { back } : {}) }; }
export function errors(...xs) {
  return Object.fromEntries(xs.map((x, i) => [`e${i + 1}`, x]));
}
const errorSlots = [1, 2, 3].map((i) => ({
  id: `mistake-${i}`, label: `{label${i}}`, say: `{say${i}}`,
  value: (v) => v[`e${i}`]?.value ?? null,
}));
function withWords(v) {
  for (let i = 1; i <= 3; i++) if (v[`e${i}`]) {
    v[`label${i}`] = v[`e${i}`].label;
    v[`say${i}`] = v[`e${i}`].say.replace(/(\d+|크기|모양|색깔)(으로|로|을|를|과|와|은|는|이|가)(?=\s)/g, (_, n, particle) => fill('{n:' + ({으로:'으로/로',로:'으로/로',을:'을/를',를:'을/를',과:'과/와',와:'과/와',은:'은/는',는:'은/는',이:'이/가',가:'이/가'})[particle] + '}', {n}));
  }
  return v;
}
function candidates(v, answer, spec) {
  if (spec.candidates) return typeof spec.candidates === 'function' ? spec.candidates(v) : spec.candidates;
  const lo = spec.differentDigits ? spec.range.min : Math.max(spec.range.min, answer < 10 ? 0 : 10 ** (String(answer).length - 1));
  const hi = spec.differentDigits ? spec.range.max : Math.min(spec.range.max, 10 ** String(answer).length - 1);
  if (hi - lo < 110) return seq(lo, hi);
  return unique([lo, hi, ...seq(-20, 20).map((n) => answer + n), ...seq(0, 30).map((n) => Math.round(lo + n / 30 * (hi - lo)))]);
}
export function define(meta, spec) {
  const t = { ...meta, grade: 2, input: 'choice', answerKind: 'int', maxDigits: 4,
    label: meta.label, choices: opts, ...spec };
  t.mistakes = spec.mistakes ?? errorSlots.slice(0, spec.errorCount ?? 2).map((m,i)=>({...m,...(i===0&&spec.back?{back:spec.back}:{})}));
  // 선택한 두 실수가 모두 성립하고, 채움 보기까지 단원 범위에 맞아야 낸다.
  t.make = (rng) => {
  const rank=t.answerKind==='int'&&!t.orderAsked&&!t.choiceBox&&!t.answerUnit&&!/^g2\.(?:times|multiply)\./.test(t.id)&&t.id!=='g2.patterns.table'?rng.int(0,3):null;
  return until(() => {
    const drawn = spec.draw(rng);
    if (!drawn) return null;
    const v = withWords(drawn);
    const answer = t.answer(v);
    if (t.answerKind === 'pair') v.result = answer.split('|').map((n,i)=>`${t.parts[i]?.before ?? ''}${n}${t.parts[i]?.after ?? ''}`).join(' ');
    const raw = t.mistakes.map((m) => m.value(v));
    const valid = (n) => t.answerKind !== 'int' || (Number.isSafeInteger(n) && n >= t.range.min && n <= t.range.max && (t.differentDigits || String(n).length === String(answer).length));
    const all = unique(raw.filter((n) => n != null && n !== answer && valid(n)));
    // 답이 될 수 없는 상수 실수(0·1·10·100)는 빼되, 실수가 둘보다 적어지면 그대로 둔다(검수 뿌리 4).
    // 정답 목록 바로 바깥 값(색깔 분류의 「모두 세기」 8·9)은 상수가 아니라 실제 실수라 그대로 쓴다.
    // 필수 보기는 실제 실수다. inverse의 b=10도 채움 상수와 구별해 남긴다(A1-10).
    const span = t.answerKind === 'int' ? answerSet(t) : null, kept = all.filter((n) => !hardConstant(n, span) || spec.requiredChoices?.(v).includes(n));
    const wrongs = kept.length >= 2 ? kept : all;
    if (wrongs.length < 2) return null;
    if (v.options) return v;
    if (t.answerKind !== 'int') throw new Error('글·두 칸 보기를 틀에서 정해야 해요.');
    const pool = candidates(v, answer, spec);
    // 채움은 정답 가까이·정답 목록 안을 먼저, 실수 값은 언제나(핵심 실수를 채움보다 먼저). 모자라면 넓힌다.
    // 정답의 크기순 자리는 arrangeChoices가 뽑는다. edgeWeight는 수 하나(양 끝 같은 무게)나 [가장 작은 자리, 가장 큰 자리] 무게다.
    const accept = (options) => spec.acceptChoices?.(v,options)!==false && !spec.requiredChoices?.(v).some((n) => !options.includes(n))
      && !(spec.separation && options.some((x, k) => options.slice(k + 1).some((y) => Math.abs(x - y) < answer * spec.separation)));
    const edge = (k) => Array.isArray(spec.edgeWeight) ? spec.edgeWeight[k] : spec.edgeWeight ?? 2;
    const picked = arrangeChoices(rng, answer, wrongs, fillLevels(pool, answer, span, valid, wrongs), { accept,rank,riskCaps:spec.choiceRiskCaps });
    if (picked) return { ...v, options: picked };
    const possible=unique([answer,...wrongs,...pool.filter(valid)]);
    if (spec.threeChoices && possible.length===3) return {...v,options:possible};
    return null;
  });
  };
  delete t.draw; delete t.candidates; delete t.separation; delete t.edgeWeight;
  return t;
}
export function numbered(rng, panels, matches) {
  const right = panels.filter(matches);
  if (right.length !== 1) throw new Error('그림 정답이 하나여야 해요.');
  const number = rng.pick([1, 1, 1, 2, 2, 3, 3, 4, 4, 4]);
  const rest = rng.shuffle(panels.filter((p) => !matches(p)));
  rest.splice(number - 1, 0, right[0]);
  return rest.map((p, i) => ({ ...p, number: i + 1 }));
}
export const panelAnswer = (v) => `${v.panels.find((p) => p.right).number}번`;
export const panelCheck = (v, c) => v.panels.some((p) => `${p.number}번` === c && p.right);
export function panelVars(panels, w1, w2, say1, say2) {
  return { panels, options: panels.map((p) => `${p.number}번`),
    ...errors(wrong(`${panels.find(w1).number}번`, '다른 기준으로 고르기', say1),
      wrong(`${panels.find(w2).number}번`, '빠뜨리거나 반대로 고르기', say2)) };
}
// 각 답·오답 쌍에 맞춰 설명한다. 그림 이름도 2학년 용어를 쓴다.
export function shapeErrors(type,choices=shapes,subject='그림의 도형'){
 return choices.filter(s=>s!==type).map(s=>{
  const feature=type==='circle'?(s==='triangle'?'삼각형과 달리 곧은 선과 꼭짓점이 없으므로 원입니다.':'사각형과 달리 테두리가 둥글고 꼭짓점이 없으므로 원입니다.')
   :type==='triangle'?(s==='square'?'사각형보다 변과 꼭짓점이 하나씩 적어 각각 3개이므로 삼각형입니다.':'굽은 선이 아니라 곧은 선 3개로 둘러싸여 있으므로 삼각형입니다.')
   :(s==='triangle'?'빠뜨린 변까지 세면 변과 꼭짓점이 각각 4개이므로 사각형입니다.':'테두리가 곧은 선 4개이고 꼭짓점도 4개이므로 사각형입니다.');
  return wrong(names[s],type==='circle'||s==='circle'?'굽은 선과 곧은 선 혼동':'꼭짓점 수 혼동',names[s]+'을 골랐습니다. '+subject+'은 '+feature);
 });
}
// 곱셈 채움은 실제 실수 값으로 한다(검수 뿌리 4·A1-14): 곱하는 수 ±1·±2, 이웃 단(배운 단일 때), 더하기.
// 7개씩 2봉지에 42·54·63처럼 학년 밖 큰 곱을 채우지 않는다. 셋이 안 되면 하나 덜·더 센 값(9 → 8, A1-13).
export const factCandidates = ({a,b,missing,firstTables,mode}) => {
  if (missing) return seq(1,9);
  const answer=a*b, ok=n=>n>0&&n<=81&&n!==answer&&String(n).length===String(answer).length;
  // 이웃 단(2~9단) 곱은 채움으로만 쓴다(반복 덧셈에서는 실수로 말하지 않는다). 더한 값은 곱과 10 안일 때만.
  // 그래도 셋이 안 되면(4 × 2, 9 × 9) 하나·둘 덜·더 센 값(검수 A1-13 「9 → 8」).
  const times=(ds)=>ds.map(d=>b+d).filter(c=>c>=1&&c<=9).map(c=>a*c);
  const real=unique([...times([-1,1]),...(firstTables||b===1?[]:[a-1,a+1].filter(c=>c>=2&&c<=9).map(c=>c*b)),...(Math.abs(a+b-answer)<=10?[a+b]:[]),...times([-2,2])].filter(ok));
  return real.length>=3?real:unique([...real,answer-1,answer+1,answer-2,answer+2].filter(ok)).slice(0,Math.max(3,real.length));
};
// 곱셈 실수(검수 A1-14). 아이가 실제로 하는 실수만 쓴다.
// - 반복 덧셈(repeated): 더하는 횟수를 하나 달리 세기, 곱하지 않고 더하기. 「6 대신 8을 4번」 같은 실수는 없다.
// - 구구(fact): 「6 × 2를 계산했어요. 6 × 3은 6을 3번 더해요」처럼 계산한 곱과 바른 뜻을 말한다.
// - 2단·5단만 익히는 틀은 아직 배우지 않은 이웃 단(3·4·6단) 대신 뛰어 세기를 한 번 더·덜 한 실수.
// - × 1에서는 「4 × 1」 같은 이웃 단을 쓰지 않는다. 1을 곱하면 1이라고 본 실수를 쓴다.
export function multiplication(rng, as, bs, words = {}) {
  const a=rng.pick(as),b=rng.pick(bs),answer=a*b,mode=words.mode??'fact',unit=words.unit??'개',bundle=words.bundle??'묶음';
  const firstTables=as.every(x=>x===2||x===5);
  const pool=[];
  const counted=delta=>{
    const c=b+delta;if(c<1||c>9)return null;
    const value=a*c,count=Math.abs(delta),total=mode==='groups'?answer+unit:answer;
    const first=mode==='fact'?fill('{value:을/를} 골라 {a} × {c:을/를} 계산했습니다.',{a,c,value}):mode==='groups'?fill('{a}{unit}씩 {c}{bundle:으로/로} 세어 {value:을/를} 골랐습니다.',{a,unit,c,bundle,value}):fill('{a:을/를} {c}번 더하여 {value:을/를} 골랐습니다.',{a,c,value});
    const correction=fill(delta<0?'{value}에 빠뜨린 {a:을/를} {count}번 더하면 {total}입니다.':'{value}에서 더 센 {a:을/를} {count}번 빼면 {total}입니다.',{value,a,count,total});
    return wrong(value,mode==='fact'?(firstTables?'뛰어 세기 횟수 달리 세기':'곱하는 수 달리 보기'):mode==='groups'?'묶음 수 달리 세기':'더하는 횟수 달리 세기',first+' '+correction);
  };
  for(const delta of mode==='fact'?[-1,1,-2,2]:[-1,1]){const w=counted(delta);if(w)pool.push(w);}
  // 한 묶음의 수를 달리 본 실수(이웃 단). 반복 덧셈·처음 배우는 단·× 1에서는 쓰지 않는다.
  if(mode!=='repeated'&&!firstTables&&b!==1)for(const delta of [-1,1]){
    const c=a+delta;
    if(c<2||c>9)continue;
    pool.push(wrong(c*b,mode==='fact'?'이웃 단 곱 고르기':'한 번에 더할 수 달리 읽기',
      mode==='fact'?fill(delta<0?'{c} × {b:을/를} 계산했습니다. {value}에 이웃한 단의 차이 {b:을/를} 더하면 {total}입니다.':'{c} × {b:을/를} 계산했습니다. {value}에서 이웃한 단의 차이 {b:을/를} 빼면 {total}입니다.',{a,b,c,value:c*b,total:answer}):fill(delta<0?'한 {bundle}의 {a}{unit}를 {c}{unit}로 보고 세었습니다. 매 묶음에서 빠뜨린 1{unit}씩을 {b}{bundle}에 더하면 {total}{unit}입니다.':'한 {bundle}의 {a}{unit}를 {c}{unit}로 보고 세었습니다. 매 묶음에서 더 센 1{unit}씩을 {b}{bundle}에서 빼면 {total}{unit}입니다.',{a,b,c,unit,bundle,total:answer})));
  }
  // 더한 값이 곱과 멀면(7 × 4에 11) 한눈에 지워지고 늘 오답으로만 남는다. 곱과 10 안일 때만 쓴다.
  // 반복 덧셈은 더하다가 받아올림한 1을 빠뜨리는 실수가 흔하다(6 + 6 + 6 + 6에 14). 합이 20 이상일 때만.
  if(mode!=='fact'&&answer>=20)pool.push(wrong(answer-10,'받아올림 빠뜨리기',fill('{a:을/를} 더하다가 받아올림한 1을 빠뜨려 {value:이/가} 나왔습니다. 받아올림한 10까지 모아 계산하면 {total}입니다.',{a,value:answer-10,total:answer})));
  if(mode!=='repeated'&&Math.abs(a+b-answer)<=10)pool.push(wrong(a+b,'곱하지 않고 더하기',fill(mode==='fact'?'{a:과/와} {b:을/를} 더했습니다. {a} × {b:은/는} {a:이/가} {b}개인 것이므로 {total}입니다.':'{a:과/와} {b:을/를} 더했습니다. {a:을/를} {b}번 더하면 {total}입니다.',{a,b,total:answer})));
  if(b===1)pool.push(wrong(1,'1을 곱하면 1로 보기',fill('{a} × 1을 1로 보았습니다. 1을 곱하면 처음 수가 그대로이므로 {a}입니다.',{a})));
  const ok=(e,i,xs)=>e.value>0&&e.value<=81&&e.value!==answer&&String(e.value).length===String(answer).length&&xs.findIndex(x=>x.value===e.value)===i;
  let valid=pool.filter(ok);
  // 반복 덧셈·묶음에서 실수가 둘이 안 되면(5의 2배 = 10) 더하는 횟수를 두 번 달리 센 값을 먼저 쓴다.
  if(valid.length<2&&mode!=='fact')for(const d of rng.shuffle([-2,2]))if(valid.length<2){const w=counted(d);if(w)valid=[...valid,w].filter(ok);}
  // 실수가 둘이 안 되면(9 × 1, 3 × 3) 하나 덜·더 센 값을 더한다.
  // 한쪽만 먼저 넣는다(12에 늘 11·13이 붙으면 11이 답이 아닌 채 자주 나온다). 그래도 모자라면 다른 쪽도.
  const slip=d=>wrong(answer+d,`하나 ${d>0?'더':'덜'} 세기`,fill('{a}씩 세다가 하나를 {how} 세어 {value:이/가} 나왔습니다. {a:을/를} {b}번 더하면 {total}입니다.',{a,b,total:answer,how:d>0?'더':'덜',value:answer+d}));
  if(valid.length<2)for(const d of rng.shuffle([-1,1]))if(valid.length<2)valid=[...valid,slip(d)].filter(ok);
  return {a,b,firstTables,mode,repeated:Array(b).fill(a).join(' + '),...errors(...rng.shuffle(valid).slice(0,3))};
}
export const products = (as, bs) => unique(as.flatMap((a) => bs.map((b) => a * b))).sort((a, b) => a - b);

export function missingProductErrors(rng,{a,b}) {
  const pool=[wrong(a,'첫 수를 네모에 쓰기',fill('{a:을/를} 그대로 골랐습니다. 첫 수가 아니라 {a}씩 모으는 횟수를 찾으면 {b}입니다.',{a,b})),
    wrong(a*b,'곱한 값을 네모에 쓰기',fill('곱 {total:을/를} □에 썼습니다. {a}씩 모아 {total}이 되는 횟수는 {b}입니다.',{a,b,total:a*b})),
    ...[-1,1,-2,2].map(d=>wrong(b+d,Math.abs(d)===1?'곱하는 수 하나 달리 고르기':'곱하는 수 둘 달리 고르기',fill(d<0?'□에 {chosen:을/를} 골랐습니다. 곱이 {total}보다 {gap} 모자라므로 곱하는 수를 {count} 늘리면 {b}입니다.':'□에 {chosen:을/를} 골랐습니다. 곱이 {total}보다 {gap} 크므로 곱하는 수를 {count} 줄이면 {b}입니다.',{a,b,chosen:b+d,total:a*b,gap:Math.abs(a*d),count:Math.abs(d)})))];
  return {e1:null,e2:null,e3:null,...errors(...rng.shuffle(pool.filter((e,i,xs)=>e.value>=1&&e.value<=9&&e.value!==b&&xs.findIndex(x=>x.value===e.value)===i)).slice(0,3))};
}

export const criteria = ['색깔','모양','크기'];
export const sortKey = (criterion, x) => criterion==='색깔'?x.color:criterion==='모양'?x.shape:x.size;
export const groupItems = (items, criterion) => unique(items.map(x=>sortKey(criterion,x))).map(k=>items.filter(x=>sortKey(criterion,x)===k));
export const groupSignature = (groups) => groups.map(g=>g.map(x=>x.id).sort((a,b)=>a-b).join(',')).sort().join(';');
export function sortItems(rng) {
  const count=rng.int(6,9);
  return Array.from({length:count},(_,id)=>({...item(rng.pick(shapes),rng.pick(colors),1,rng.pick([0.7,1.1])),id}));
}

const pairHistory=new WeakMap();
export function pairOptions(rng,answer,pool,parts,scale,minuteStep=1){
 const cache=new Map(),info=c=>{if(!cache.has(c)){const parts=c.split('|'),[a,b]=parts.map(Number);cache.set(c,{parts,digits:[...parts.join('')],quantity:a*scale+b,valid:a>=(scale===60?1:0)&&a<=(scale===60?12:9)&&b>=0&&b<scale,second:b});}return cache.get(c);},valid=c=>info(c).valid;
 const all=pool.filter((e,i,xs)=>e.value!==answer&&valid(e.value)&&xs.findIndex(x=>x.value===e.value)===i);
 const quantity=c=>info(c).quantity;
 const freq=xs=>xs.map(x=>xs.filter(y=>y===x).length),odd=xs=>freq(xs).map(n=>n===1?1:0),chance=xs=>{const max=Math.max(...xs);return xs[0]===max?1/xs.filter(x=>x===max).length:0;};
 const buckets=[[],[],[],[]],sets=[],seen=new Set(),firsts=[...new Set([answer,...all.map(e=>e.value)].map(c=>info(c).parts[0]))];
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
  const chosen=[all[i],all[j]],chunks=chosen.map(e=>info(e.value).parts);
  const fills=[...new Set([...all.map(e=>e.value),...firsts.flatMap(a=>chunks.map(p=>a+'|'+p[1]))])];
  for(const fill of fills){const options=[answer,...chosen.map(e=>e.value),fill];if(new Set(options).size!==4||!valid(fill)||info(fill).second%minuteStep)continue;
   const key=[...options].sort().join(';');if(seen.has(key))continue;seen.add(key);
   const rank=options.filter(c=>quantity(c)<quantity(answer)).length;
   buckets[rank].push({chosen,options,rank});
  }
 }
 // 각 크기순 자리의 후보를 남기되, 같은 보기 묶음을 거듭 평가하지 않는다.
 // 한 문제에서 확인하는 후보 수를 제한해 태블릿에서도 한 판을 빠르게 만든다.
 for(const candidate of buckets.flatMap(xs=>rng.shuffle(xs).slice(0,5))){
   const {chosen,options,rank}=candidate;
   const ps=options.map(c=>info(c).parts),ds=options.map(c=>info(c).digits);
   const alike=ds.map((a,i)=>ds.reduce((n,b,j)=>n+(i===j?0:a.filter((d,k)=>d===b[k]).length),0)),last=freq(ds.map(p=>p.at(-1))),modal=ps.map(p=>ps.filter(x=>x[0]===p[0]).length+ps.filter(x=>x[1]===p[1]).length);
   const qs=options.map(quantity),mean=qs.reduce((a,b)=>a+b,0)/4;
   const strong=[chance(alike),chance(last),chance(modal)];
   const weak=[chance(odd(ds.map(p=>p[0]))),chance(odd(ds.map(p=>p.at(-1)))),chance(odd(ds.map(p=>p.length))),chance(odd(qs.map(n=>n%2))),chance(qs.map(n=>-Math.abs(n-mean)))];
   const features=[...strong,...weak];
   sets.push({chosen,options,features,rank});
 }
 if(!sets.length)return null;
 const history=pairHistory.get(rng)??{counts:rng.shuffle([0,1,1,1]),totals:Array(sets[0].features.length).fill(.75),n:3};
 const cost=s=>2*(2*history.counts[s.rank]+1)+s.features.reduce((sum,p,k)=>{const excess=Math.max(0,history.totals[k]+p-(history.n+1)*.30);return sum+excess*excess*(k<3?4:1);},0);
 const low=Math.min(...sets.map(cost)),selected=rng.pick(sets.filter(s=>Math.abs(cost(s)-low)<1e-8));
 history.counts[selected.rank]++;history.n++;selected.features.forEach((p,k)=>history.totals[k]+=p);pairHistory.set(rng,history);
 return {options:selected.options,...errors(...selected.chosen)};
}
