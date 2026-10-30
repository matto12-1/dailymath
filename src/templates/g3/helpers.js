import { until } from '../../engine/retry.js?v=9a67f36b25';
import { fill } from '../../engine/korean.js?v=9a67f36b25';
import { same, parseAnswer } from '../../engine/answer.js?v=9a67f36b25';
export { until, fill };
export { seq, unique, sum, product, pair, errors, wrong, numbered } from '../g2/helpers.js?v=9a67f36b25';
const particles = {으로:'으로/로',로:'으로/로',을:'을/를',를:'을/를',과:'과/와',와:'과/와',은:'은/는',는:'은/는',이:'이/가',가:'이/가'};
const withParticles = s => s.replace(/(\d+ \d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(으로|로|을|를|과|와|은|는|이|가)(?=\s)/g, (_,n,p) => fill('{n:'+particles[p]+'}', {n}))
  .replace(/(\d+ \d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?(?:\s*(?:mL|kg|km|cm|mm|L|g|t|m|°C|초|분|명|권|칸|개))?)(?:이라고|라고)/g, (_,n) => fill('{n:(이)}라고', {n}));

// 정답 + 실수 값 + 이웃 값으로 보기 넷을 고른다(검수 A2-3). 정답의 크기 자리는 고르게 뽑고, 실수 값은 되도록 많이 넣는다.
// 같은 수의 실수를 넣을 수 있으면 정답이 두 보기의 한가운데에 오는 묶음은 피한다. 실수 값이 하나도 없는 묶음은 쓰지 않는다.
export function rankedOptions(rng, answer, wrongs, pool, count = 4, minimum = 1, balanceMean = false) {
  const values = [...new Set([...wrongs, ...pool])].filter(n => n !== answer), groups = new Map();
  const pick = (start, acc) => {
    if (acc.length === count - 1) {
      const hits = acc.filter(n => wrongs.includes(n)).length;
      if (hits < minimum) return;
      const options = [answer, ...acc], rank = options.filter(n => n < answer).length;
      const middle = options.some(a => options.some(b => a < answer && b > answer && a + b === 2 * answer));
      if (!groups.has(rank)) groups.set(rank, []);
      groups.get(rank).push({ options, hits, middle });
      return;
    }
    for (let i = start; i < values.length; i++) pick(i + 1, [...acc, values[i]]);
  };
  pick(0, []);
  if (!groups.size) return null;
  const list = groups.get(rng.pick([...groups.keys()])), most = list.filter(x => x.hits === Math.max(...list.map(y => y.hits)));
  const even = most.filter(x => !x.middle), list2=even.length?even:most;
  if(balanceMean){
    const credit=({options})=>{const mean=options.reduce((s,n)=>s+n,0)/options.length,ds=options.map(n=>Math.abs(n-mean)),least=Math.min(...ds);return ds[0]===least?1/ds.filter(n=>n===least).length:0;};
    const least=Math.min(...most.map(credit)),balanced=most.filter(x=>credit(x)===least);
    return rng.pick(rng.next()<.8?balanced:list2).options;
  }
  const harder=list2.filter(({options})=>{const mean=options.reduce((s,n)=>s+n,0)/options.length;return Math.abs(answer-mean)>Math.min(...options.filter(n=>n!==answer).map(n=>Math.abs(n-mean)));});
  return rng.pick(harder.length?harder:list2).options;
}

// 숫자판에서는 자릿수가 다른 실수도 진단한다. 보기 후보는 각 단원이 정한다.
export function define(meta, spec) {
  const t = { grade: 3, input: 'choice', answerKind: 'int', maxDigits: 4, ...meta, ...spec };
  t.mistakes = spec.mistakes ?? Array.from({ length: spec.errorCount ?? 3 }, (_, i) => ({
    id: `mistake-${i + 1}`, label: `{label${i + 1}}`, say: `{say${i + 1}}`,
    value: v => v[`e${i + 1}`]?.value ?? null,
    ...((spec.backs?.[i] ?? (i === 0 && spec.back)) ? { back: spec.backs?.[i] ?? spec.back } : {}),
  }));
  t.choices = spec.choices ?? (v => v.options);
  t.make = rng => until(() => {
    const v = spec.draw(rng);
    if (!v) return null;
    const answer = t.answer(v), validErrors = [];
    for (let i = 1; i <= t.mistakes.length; i++) {
      const e = v[`e${i}`];
      if (!e) continue;
      v[`label${i}`] = e.label;
      v[`say${i}`] = withParticles(fill(e.say, { ...v, answer }));
      if (parseAnswer(t.answerKind, e.value) !== null && !same(t.answerKind, e.value, answer, {exactForm:t.exactForm}) && !validErrors.some(x => same(t.answerKind, x, e.value))) validErrors.push(e.value);
    }
    if (validErrors.length < (spec.minMistakes ?? ([3,4].includes(t.grade) ? 2 : 1))) return null;
    if (t.input !== 'choice' || v.options || spec.choices) return v;
    if (t.answerKind !== 'int') throw new Error(`${t.id}: 보기 후보를 지정해요.`);
    const valid = x => Number.isSafeInteger(x) && x >= (t.range?.min ?? 0) && x <= (t.range?.max ?? 99999) && (t.differentDigits || String(x).length === String(answer).length);
    const wrongs = validErrors.filter(valid);
    const pool = typeof spec.candidates === 'function' ? spec.candidates(v) : spec.candidates;
    if (!pool) throw new Error(`${t.id}: 채움 후보를 지정해요.`);
    if(spec.choiceCount===3){
      const values=[...new Set([...wrongs,...pool.filter(valid)])].filter(n=>n!==answer),ranks=new Map();
      for(let i=0;i<values.length;i++)for(const b of values.slice(i+1)){
        const options=[answer,values[i],b];
        if(!wrongs.some(n=>options.includes(n)))continue;
        const rank=options.filter(n=>n<answer).length;
        if(!ranks.has(rank))ranks.set(rank,[]);
        ranks.get(rank).push(options);
      }
      if(!ranks.size)return null;
      const weighted=[...ranks.keys()].flatMap(rank=>Array(spec.choiceRankWeights?.[rank]??1).fill(rank));
      v.options=rng.pick(ranks.get(rng.pick(weighted)));
      return v;
    }
    const ranks = new Map(), asymmetric = new Map();
    const pairs = wrongs.length >= 2 ? wrongs.flatMap((a,i)=>wrongs.slice(i+1).map(b=>[a,b])) : (wrongs.length ? wrongs.flatMap(a=>pool.filter(valid).map(b=>[a,b])) : pool.filter(valid).flatMap((a,i)=>pool.filter(valid).slice(i+1).map(b=>[a,b])));
    for (const pair of pairs) for (const x of pool) {
      const options = [answer, ...pair, x];
      if (!valid(x) || new Set(options).size !== 4) continue;
      const rank = options.filter(n => n < answer).length;
      if (!ranks.has(rank)) ranks.set(rank, []);
      ranks.get(rank).push(options);
      if (!options.some(a => options.some(b => a < answer && b > answer && a + b === 2 * answer))) {
        if (!asymmetric.has(rank)) asymmetric.set(rank, []);
        asymmetric.get(rank).push(options);
      }
    }
    if (!ranks.size) return null;
    const rank = rng.pick([...ranks.keys()].flatMap(k => Array(k === 0 || k === 3 ? (spec.edgeWeight ?? 2) : 1).fill(k)));
    v.options = rng.pick(asymmetric.get(rank) ?? ranks.get(rank));
    return v;
  });
  delete t.draw; delete t.candidates; delete t.backs; delete t.back; delete t.errorCount; delete t.edgeWeight;
  return t;
}
