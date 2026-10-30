import { same, valueOf } from './answer.js?v=9a67f36b25';
import { generate, choiceValue } from './template.js?v=9a67f36b25';
import { makeRng } from './rng.js?v=9a67f36b25';
import { toParts } from './format.js?v=9a67f36b25';
import { GUESS_FIXES } from './guess-fixes-1023.js?v=9a67f36b25';

// A tie is a uniform pick, including when a shortcut does not apply. No answer
// or mistake metadata is available to a strategy; only what the child sees:
// the choices, the drawing, the question text and the number row.
const frequencies = xs => xs.map(x => xs.filter(y => JSON.stringify(x) === JSON.stringify(y)).length);
const maxIndices = xs => xs.flatMap((x, i) => x === Math.max(...xs) ? [i] : []);
const odd = xs => frequencies(xs).map(n => n === 1 ? 1 : 0);
// Numbers the child can read in the question (prompt and number row). "15칸" counts as 15.
export function shownNumbers({ prompt = '', numberRow = null } = {}) {
  const text = [prompt, ...(numberRow?.items ?? []).map(String), ...(numberRow?.lines ?? [])].join(' ');
  return [...text.matchAll(/\d+(?:\.\d+)?(?:\/\d+)?/g)].map(m => choiceValue(m[0]));
}
// The numbers lined up in the row (items, or a line with arrows), when there are two or more.
export function rowNumbers(numberRow) {
  const read = s => (String(s).match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
  if (numberRow?.items) { const xs = numberRow.items.flatMap(read); return xs.length >= 2 ? xs : null; }
  for (const line of numberRow?.lines ?? []) if (/[→←]/.test(line)) { const xs = read(line); if (xs.length >= 2) return xs; }
  return null;
}
export function shortcutScores({ choices, answerKind, art, prompt, numberRow, parts }, hints = [], { orderAsked = false } = {}) {
  const strings = choices.map(String), scores = {};
  const add = (name, xs) => { if (xs.length !== choices.length || xs.some(x => !Number.isFinite(x))) throw new Error(`Invalid guess hint: ${name}`); scores[name] = xs; };
  for (let k = 0; k < choices.length; k++) add(`pos:${k + 1}`, choices.map((_, i) => +(i === k)));
  // 두 칸 답도 아이가 읽는 시·분, m·cm 글자로 바꾸어 자리 숫자를 견준다.
  const shown = choices.map(c => toParts(answerKind, c, parts).map(p => p.t === 'frac' ? `${p.w || ''}${p.n}/${p.d}` : p.v).join(''));
  const digits = shown.map(s => [...s.replace(/\D/g, '')]);
  if (digits.every(ds => ds.length)) {
    add('most-alike', digits.map((ds, i) => digits.reduce((sum, other, j) => sum + (i === j ? 0 : ds.filter((d, k) => other[k] === d).length), 0)));
    add('last-digit-common', frequencies(digits.map(ds => ds.at(-1))));
    add('odd:first-digit', odd(digits.map(ds => ds[0])));
    add('odd:last-digit', odd(digits.map(ds => ds.at(-1))));
  }
  add('odd:digits', odd(strings.map(s => (s.match(/\d/g) ?? []).length)));
  add('odd:form', odd(strings.map(s => /\//.test(s) ? 'fraction' : /\d\.\d/.test(s) ? 'decimal' : /^\d+$/.test(s) ? 'integer' : 'text')));
  add('odd:length', odd(strings.map(s => [...s].length)));
  add('odd:unit', odd(strings.map(s => s.match(/cm|mm|km|kg|mL|m|L|g|°|칸|개|번|원/g)?.join(',') ?? '')));
  // Picks the roundest whole number (most trailing zeros, 0 counts as one).
  if (strings.every(s => /^\d+$/.test(s))) {
    add('round:most', strings.map(s => s.match(/0*$/)[0].length));
    // The only choice ending in 0 or 5 (or the only one that does not), e.g. "40의 약수" 13 | 19 | 20 | 21 (A3-6).
    add('odd:five-end', odd(strings.map(s => /[05]$/.test(s))));
  }
  const attributes=[/오른쪽|왼쪽|위쪽|아래쪽/,/\d+칸/,/빨간|파란|노란|초록/,/정삼각형|이등변삼각형|직각삼각형|예각삼각형|둔각삼각형|평행사변형|직사각형|정사각형|마름모|사다리꼴|삼각형|사각형|오각형|육각형|칠각형|팔각형/,/뒤집어요|돌려요/,/[×+−÷]/];
  const modal=choices.map(()=>0);
  for(const pattern of attributes){const xs=strings.map(s=>s.match(pattern)?.[0]);if(xs.every(x=>x!==undefined))frequencies(xs).forEach((n,i)=>modal[i]+=n);}
  add('modal:attributes',modal);
  // Two-part answers (m·cm, 시·분, 두 칸): take the value that turns up most in each part and join them (C-8).
  const chunks = strings.map(s => s.match(/\d+/g) ?? []);
  if (choices.every(c => !Number.isFinite(choiceValue(c))) && chunks[0].length >= 2 && chunks.every(p => p.length === chunks[0].length)) {
    add('modal:parts', chunks.map(p => p.reduce((sum, x, k) => sum + chunks.filter(q => q[k] === x).length, 0)));
  }
  // 시각·길이는 단위를 통일한 한 값으로 가운데와 짝홀을 잰다. 비·몫과 나머지는 수 하나가 아니다.
  const units = parts?.map(p => p.after?.trim());
  const scale = units?.[0] === '시' && units[1] === '분' ? 60 : units?.[0] === 'm' && units[1] === 'cm' ? 100 : null;
  const quantities = choices.map(c => {
    if (answerKind === 'pair' && scale) {
      const [a, b] = String(c).split('|').map(Number);
      return a * scale + b;
    }
    const clock = String(c).match(/^(\d+)시(?:\s*(\d+)분)?$/);
    if (clock) return Number(clock[1]) * 60 + Number(clock[2] ?? 0);
    return choiceValue(c);
  });
  if (quantities.every(Number.isFinite)) {
    const mean = quantities.reduce((s, n) => s + n, 0) / quantities.length;
    add('near-mean', quantities.map(n => -Math.abs(n - mean)));
    if (!/짝수|홀수/.test(prompt ?? '')) add('odd:parity', odd(quantities.map(n => Number.isInteger(n) ? n % 2 : 'fraction')));
    if (!['int','decimal','fraction'].includes(answerKind)) {
      const sorted = [...quantities].sort((a, b) => a - b);
      add('middle:lower', quantities.map(n => +(n === sorted[Math.floor((sorted.length - 1) / 2)])));
      add('middle:upper', quantities.map(n => +(n === sorted[Math.ceil((sorted.length - 1) / 2)])));
    }
  }
  const numeric = choices.map(c => valueOf(answerKind, c));
  if (['int', 'decimal', 'fraction'].includes(answerKind) && numeric.every(Number.isFinite)) {
    for (const [name, lower] of [['ten:small', true], ['ten:large', false]]) {
      const matches = numeric.filter(n => n > 0 && numeric.some(m => m > 0 && Math.abs((lower ? n * 10 - m : n - m * 10)) < 1e-8));
      add(name, numeric.map(n => matches.includes(n) ? 1 : 0));
      add(`${name}:largest`, numeric.map(n => matches.length && n === Math.max(...matches) ? 1 : 0));
    }
    const sorted = [...numeric].sort((a,b) => a-b);
    add('middle:lower', numeric.map(n => n === sorted[Math.floor((sorted.length-1)/2)] ? 1 : 0));
    add('middle:upper', numeric.map(n => n === sorted[Math.ceil((sorted.length-1)/2)] ? 1 : 0));
    // Choices are shown smallest first, so these are also "always the first/last button".
    // A question that asks for the largest or smallest is exempt: picking it is the skill.
    if (!orderAsked) {
      add('edge:smallest', numeric.map(n => n === sorted[0] ? 1 : 0));
      add('edge:largest', numeric.map(n => n === sorted.at(-1) ? 1 : 0));
    }
    // Three or more whole numbers in a row (6, 7, 8): pick an end of the longest run (B-11).
    if (numeric.every(Number.isInteger)) {
      const s = [...new Set(numeric)].sort((a, b) => a - b);
      let best = null;
      for (let i = 0; i < s.length; i++) { let j = i; while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++; if (j - i >= 2 && (!best || j - i > best[1] - best[0])) best = [i, j]; }
      add('run:ends', numeric.map(n => best && (n === s[best[0]] || n === s[best[1]]) ? 1 : 0));
    }
  }
  // Text the child reads: cross out the choices already written in the question (B-26),
  // and in a number row take the nearest choice past its end (390 → 490 → ?: the smallest choice above 490, A1-6).
  const values = choices.map(choiceValue);
  if (values.every(Number.isFinite)) {
    const shown = shownNumbers({ prompt, numberRow });
    add('text:not-shown', values.map(v => shown.some(x => Math.abs(x - v) < 1e-9) ? 0 : 1));
    const row = rowNumbers(numberRow);
    if (row) {
      const above = values.filter(v => v > Math.max(...row)), below = values.filter(v => v < Math.min(...row));
      add('row:next-above', values.map(v => above.length && v === Math.min(...above) ? 1 : 0));
      add('row:next-below', values.map(v => below.length && v === Math.max(...below) ? 1 : 0));
    }
  }
  for (const hint of hints) for (const [name, xs] of Object.entries(hint({choices, answerKind, art}))) add(`picture:${name}`, xs);
  return scores;
}

// These declarations describe drawing features, never the target property or
// correct panel. Each feature is tested both as an outlier and as a majority.
export function pictureHints({choices, art}) {
  const panels = art?.panels;
  if (!panels || !choices.every(c => panels.some(p => String(c) === `${p.number}번`))) return {};
  const ordered = choices.map(c => panels.find(p => String(c) === `${p.number}번`)), out = {};
  const features = {
    vertices: p => p.points?.length ?? 0,
    marks: p => Object.values(p.marks??{}).filter(xs=>xs?.length).length,
    labels: p => Object.values(p.labels ?? {}).flat().filter(Boolean).length,
    pieces: p => p.pieces?.length ?? 0,
    inside: p => !p.outline || !p.pieces ? 1 : +p.pieces.every(ps => ps.every(([x,y]) => x >= Math.min(...p.outline.map(p=>p[0]))-1e-8 && x <= Math.max(...p.outline.map(p=>p[0]))+1e-8 && y >= Math.min(...p.outline.map(p=>p[1]))-1e-8 && y <= Math.max(...p.outline.map(p=>p[1]))+1e-8)),
    boundary: p => !p.outline||!p.pieces?1:+p.outline.every((a,i)=>{const b=p.outline[(i+1)%p.outline.length],eq=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1])<1e-7;return p.pieces.some(ps=>ps.some((u,j)=>{const v=ps[(j+1)%ps.length];return eq(a,u)&&eq(b,v)||eq(a,v)&&eq(b,u);}));}),
  };
  for (const [name, f] of Object.entries(features)) { const xs = ordered.map(f); out[`${name}:odd`] = odd(xs); out[`${name}:modal`] = frequencies(xs); }
  return out;
}
export function alignedPointHints({choices, art}) {
  if (!art?.targets) return {};
  const ps = choices.map(c => art.targets.find(p => `${p.number}번` === c)?.to);
  if (ps.some(p => !p)) return {};
  return { 'aligned-both': ps.map(([x,y],i) => +(ps.some((p,j)=>j!==i&&p[0]===x) && ps.some((p,j)=>j!==i&&p[1]===y))) };
}
export const numberedPictureHints = visible => pictureHints({...visible,choices:visible.choices.map(n=>`${n}번`)});

// 2026-10-23 검수에서 학년 일꾼에게 넘긴 틀과 요령만 알림으로 낮춘다.
export const HANDOVER = GUESS_FIXES;

export function classifyGuesses(t, runs, strategies) {
  const over = strategies.filter(r=>r.rate>r.limit+1e-10), [bundle, item, ...names] = HANDOVER[t.id] ?? [];
  const handed = over.filter(r=>names.includes(r.name)).map(r=>({...r,bundle,item}));
  return {id:t.id,grade:t.grade,runs,strategies,failures:over.filter(r=>!names.includes(r.name)),handed,
    settled:names.filter(n=>!over.some(r=>r.name===n))};
}

export function measureGuesses(t, {runs=2000, seed=20261015, seedMode='stream'}={}) {
  if (t.input !== 'choice') return {id:t.id,grade:t.grade,runs:0,strategies:[],failures:[],handed:[],settled:[]};
  const rng = makeRng(seed), totals = new Map(); let count = 0;
  for (let i=0; i<runs; i++) {
    const p = generate(t,seedMode === 'each' ? makeRng(seed+i) : rng); count++;
    if (p.art && !p.art.scene && !Array.isArray(t.guessHints)) throw new Error(`${t.id}: declare guessHints for picture choices`);
    const visible = {choices:p.choices,answerKind:p.answerKind,art:p.art,prompt:p.prompt,numberRow:p.numberRow,parts:p.parts};
    for (const [name, scores] of Object.entries(shortcutScores(visible,t.guessHints,{orderAsked:t.orderAsked}))) {
      const candidates = maxIndices(scores), hit = candidates.filter(j => same(p.answerKind,p.choices[j],p.answer,{exactForm:p.exactForm})).length/candidates.length;
      const row = totals.get(name) ?? {name,correct:0,runs:0,limit:p.choices.length===4?0.4:0.5};
      row.correct+=hit; row.runs++; row.limit=Math.min(row.limit,p.choices.length===4?0.4:0.5); totals.set(name,row);
    }
  }
  const strategies = [...totals.values()].map(r=>({...r,rate:r.correct/r.runs}));
  return classifyGuesses(t, count, strategies);
}
