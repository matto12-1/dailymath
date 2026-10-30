import { makeRng } from './rng.js?v=9a67f36b25';
import { generate, STRANDS, LIFE_KINDS, FIGURE_KINDS, MODEL_KINDS } from './template.js?v=9a67f36b25';
import { ANSWER_KINDS, canon, parseAnswer, same, valueOf } from './answer.js?v=9a67f36b25';
import { toParts, numberRowText } from './format.js?v=9a67f36b25';
import { CHOICE_ICONS } from '../art/choice-icons.js?v=9a67f36b25';

export const groupedNumber = text => /\u2009|\d,\d{3}|\b\d{1,4} +\d{4}\b(?!\s*\/)/.test(String(text));

const REQUIRED = ['id', 'grade', 'unit', 'strand', 'level', 'label', 'input', 'texts', 'make', 'answer', 'check'];

export function checkShape(t) {
  const errs = [];
  const name = t.id ?? '(이름 없음)';
  for (const k of REQUIRED) if (t[k] === undefined) errs.push(`${name}: ${k} 칸이 없음`);
  if (t.strand !== undefined && !STRANDS.includes(t.strand)) errs.push(`${name}: strand ${t.strand}는 없는 갈래`);
  if (t.input !== undefined && !['choice', 'number'].includes(t.input)) errs.push(`${name}: input ${t.input}는 없는 꼴`);
  if (t.answerKind !== undefined && !ANSWER_KINDS.includes(t.answerKind)) errs.push(`${name}: answerKind는 없는 꼴`);
  if (t.answerKind === 'pair' && (!Array.isArray(t.parts) || t.parts.length !== 2)) errs.push(`${name}: pair의 parts는 길이 2`);
  if (t.input === 'choice' && t.answerKind && t.answerKind !== 'int' && typeof t.choices !== 'function') errs.push(`${name}: 정수가 아닌 보기에 choices 함수가 없음`);
  if (t.exactForm !== undefined && t.answerKind !== 'fraction') errs.push(`${name}: exactForm은 fraction에만`);
  if (t.isCorrect !== undefined && typeof t.isCorrect !== 'function') errs.push(`${name}: isCorrect는 보기 유일성을 검사하는 함수`);
  if (t.answerCases !== undefined && !(typeof t.answerCases === 'function' && Array.isArray(t.answerSpan))) errs.push(`${name}: answerCases는 답 목록을 검산할 전체 입력을 돌려주는 함수`);
  if (t.orderAsked !== undefined && typeof t.orderAsked !== 'boolean') errs.push(`${name}: orderAsked는 참 또는 거짓`);
  if (t.referenceArt !== undefined && !(t.strand === 'word' && ['table','pictograph','bars','line','band','pie'].includes(t.referenceArt) && typeof t.art === 'function')) errs.push(`${name}: referenceArt는 문장제의 자료 표나 그래프에만`);
  if (t.answerSpan !== undefined) {
    const s = t.answerSpan;
    if (!(Array.isArray(s) ? s.length > 0 && s.every((n) => Number.isSafeInteger(n) && n >= 0) : s && Number.isSafeInteger(s.min) && Number.isSafeInteger(s.max) && s.min >= 0 && s.max >= s.min)) errs.push(`${name}: answerSpan은 0 이상 정수 배열 또는 { min, max }`);
    if (t.answerKind && t.answerKind !== 'int') errs.push(`${name}: answerSpan은 정수 답에만`);
  }
  if (t.grade !== undefined && !(t.grade >= 1 && t.grade <= 6)) errs.push(`${name}: grade ${t.grade}`);
  if (t.speedBonus && t.strand !== 'calc') errs.push(`${name}: 빠르기 덤은 셈 갈래에만`);
  if (t.texts !== undefined && (!Array.isArray(t.texts) || t.texts.length === 0)) errs.push(`${name}: texts가 비었음`);
  for (const m of t.mistakes ?? []) {
    if (!m.say) errs.push(`${name}: 실수 ${m.id}에 아이에게 하는 말(say)이 없음`);
    if (m.back !== undefined && !(typeof m.back === 'string' && /^g[1-6]s[12]-/.test(m.back))) errs.push(`${name}: 실수 ${m.id}의 back은 앞 학년 단원 id(g2s1-addsub 꼴)`);
    if (/(함|임|음)$/.test(String(m.label).trim())) errs.push(`${name}: 실수 이름 「${m.label}」을 ~함 꼴 말고 이름꼴로(예: 받아올림 빼먹기)`);
  }
  if (typeof t.make === 'function' && /for\s*\(\s*;\s*;\s*\)|while\s*\(\s*true\s*\)/.test(String(t.make))) {
    errs.push(`${name}: make()에 끝없는 반복이 있음. until()로 다시 뽑을 것`);
  }
  return errs;
}

export function selfTest(t, { runs = 2000, seed = 1 } = {}) {
  const started = Date.now();
  const shape = checkShape(t);
  if (shape.length) return { ok: false, errors: shape, ms: 0 };
  const rng = makeRng(seed);
  const errors = [];
  const add = (msg) => { if (errors.length < 20 && !errors.includes(msg)) errors.push(msg); };
  const survived = new Map();
  const seenAnswers = new Set();
  // 유한한 전체 입력이 있으면 표본 개수에 기대지 않고 답 목록을 전수 검산한다.
  // 보기 문제에서 정답이 크기순으로 몇 번째인지, 다른 두 보기의 한가운데인지 센다(가운데만 골라도 맞히는 틀을 잡는다)
  const ranks = new Map();
  let numericChoiceRuns = 0;
  let middleRuns = 0;
  let largestRuns = 0, smallestRuns = 0;
  for (let i = 0; i < runs; i++) {
    let p;
    try { p = generate(t, rng); } catch (e) { add(`만들기 실패: ${e.message}`); continue; }
    seenAnswers.add(p.answer);
    if(t.answerCases&&!t.answerSpan.includes(p.answer))add(`answerSpan: 목록 밖의 정답 ${p.answer}`);
    const second = t.check(p.vars);
    if (!same(p.answerKind, second, p.answer, { exactForm: p.exactForm })) add(`정답 두 계산이 다름: ${p.prompt} → ${p.answer} / ${second}`);
    if (p.answerKind === 'int' && !(Number.isSafeInteger(p.answer) && p.answer >= 0)) add(`정답이 0 이상 정수가 아님: ${p.prompt} → ${p.answer}`);
    if (p.answerKind === 'decimal') {
      const places = p.answerPlaces;
      const shown = places == null ? canon('decimal', p.answer) : Number.isInteger(places) && places >= 0 && places <= 15 && parseAnswer('decimal', p.answer) !== null ? Number(p.answer).toFixed(places) : null;
      if (shown !== p.answer) add(`소수 정답이 맞춘 꼴이 아님: ${p.answer}`);
    }
    if (['fraction', 'pair', 'text'].includes(p.answerKind) && (typeof p.answer !== 'string' || parseAnswer(p.answerKind, p.answer) === null)) add(`정답 꼴이 잘못됨: ${p.answerKind} ${p.answer}`);
    if (/undefined|NaN|[{}]/.test(p.prompt)) add(`글에 빈칸이 남음: ${p.prompt}`);
    if (/[〔〕]/.test(p.prompt + numberRowText(p.numberRow)) || p.prompt === '') add(`식 상자 표시가 글에 남음: ${p.prompt}`);
    if (p.numberRow && (/undefined|NaN|[{}—]/.test(numberRowText(p.numberRow)) || !(p.numberRow.lines ?? p.numberRow.items)?.length)) add(`수 상자가 비었거나 빈칸이 남음: ${p.prompt} ${JSON.stringify(p.numberRow)}`);
    if (p.choiceLooks) {
      const looks = (p.choices ?? []).map((c) => p.choiceLooks[String(c)]);
      if (!looks.length || looks.some((l) => !l || !CHOICE_ICONS.includes(l.icon) || typeof l.text !== 'string' || !l.text.trim() || /undefined|NaN|[{}—]/.test(l.text)) || new Set(looks.map((l) => l?.text)).size !== looks.length) add(`그림표 보기가 빠졌거나 겹침: ${JSON.stringify(p.choiceLooks)}`);
    }
    const shown=parts=>parts.map(x=>x.t==='frac'?`${x.w??0} ${x.n}/${x.d}`:x.v).join('');
    const fields=[p.prompt,p.solution,...p.mistakes.map(m=>m.say),shown(toParts(p.answerKind,p.answer,p.parts)),...(p.choices??[]).map(c=>shown(toParts(p.answerKind,c,p.parts)))];
    if(fields.some(groupedNumber))add(`숫자 묶음 금지: ${p.prompt}`);
    if (p.prompt.includes('—') || (p.solution ?? '').includes('—')) add(`줄표 「—」 금지: ${p.prompt}`);
    if (t.referenceArt && !(p.art?.kind === t.referenceArt && Array.isArray(p.art.labels) && Array.isArray(p.art.values) && p.art.labels.length >= 2 && p.art.labels.length === p.art.values.length && !('scene' in p.art))) add(`문장제 자료 표에는 같은 길이의 labels·values가 필요해요: ${t.id}`);
    if (p.art) {
      if (p.strand === 'word' && !t.referenceArt && !(typeof p.art.scene === 'string' && Object.keys(p.art).length === 1)) add(`문장제 그림은 { scene } 하나만: ${JSON.stringify(p.art)}`);
      if (p.strand === 'life' && !LIFE_KINDS.includes(p.art.kind)) add(`생활 수학 그림 kind ${p.art.kind}는 없는 꼴`);
      if (p.strand === 'shape' && !FIGURE_KINDS.includes(p.art.kind)) add(`도형 그림 kind ${p.art.kind}는 없는 꼴`);
      if ((p.strand === 'calc' || p.strand === 'estimate') && !MODEL_KINDS.includes(p.art.kind)) add(`셈·어림에는 수 모형만 붙인다: ${t.id}`);
    }
    const operandRange = t.operandRange ?? t.range;
    if (operandRange) {
      for (const [k, v] of Object.entries(p.vars)) {
        if (typeof v === 'number' && (v < operandRange.min || v > operandRange.max)) add(`${k}=${v} 이(가) 범위 밖 (${operandRange.min}~${operandRange.max})`);
      }
    }
    if (p.choices) {
      if (![3, 4].includes(p.choices.length)) add(`보기 수는 3개 또는 4개여야 함: ${p.choices.length}개`);
      if (p.choices.some((c, i) => p.choices.slice(i + 1).some((d) => same(p.answerKind, c, d)))) add(`보기 겹침: ${p.choices.join(', ')}`);
      if (!p.choices.some((c) => same(p.answerKind, c, p.answer, { exactForm: p.exactForm }))) add(`보기에 정답 없음: ${p.prompt}`);
      if (p.choices.some((c) => parseAnswer(p.answerKind, c) === null)) add(`보기 꼴이 잘못됨: ${p.choices.join(', ')}`);
      if (p.choices.some((c) => typeof c === 'number' && c < 0)) add(`음수 보기: ${p.choices.join(', ')}`);
      if (t.range && p.choices.some((c) => {
        const v = valueOf(p.answerKind, c);
        return Number.isFinite(v) && (v < t.range.min || v > t.range.max);
      })) add(`보기 범위 밖 (${t.range.min}~${t.range.max})`);
      if (t.isCorrect) {
        try {
          const judged = p.choices.map((c) => t.isCorrect(p.vars, c));
          const correct = p.choices.filter((_, i) => judged[i] === true);
          if (judged.some((v) => typeof v !== 'boolean') || correct.length !== 1 || !same(p.answerKind, correct[0], p.answer, { exactForm: p.exactForm })) {
            add(`보기 유일성: 뜻으로 맞는 보기는 표시 정답 하나여야 함: ${p.prompt}`);
          }
        } catch (e) { add(`보기 유일성 검사 실패: ${e.message}`); }
      }
      if (['int', 'decimal', 'fraction'].includes(p.answerKind) && p.choices.every((c) => Number.isFinite(valueOf(p.answerKind, c)))) {
        numericChoiceRuns++;
        const av = valueOf(p.answerKind, p.answer);
        const sorted = p.choices.map((c) => valueOf(p.answerKind, c)).sort((x, y) => x - y);
        const rank = sorted.indexOf(av);
        if (rank === sorted.length - 1) largestRuns++;
        if (rank === 0) smallestRuns++;
        if (!t.orderAsked) {
          ranks.set(rank, (ranks.get(rank) ?? 0) + 1);
          const others = sorted.filter((c) => c !== av);
          if (others.some((x) => others.some((y) => x < av && y > av && Math.abs(x + y - 2 * av) < 1e-10))) middleRuns++;
        }
      }
    }
    for (const m of p.mistakes) {
      survived.set(m.id, (survived.get(m.id) ?? 0) + 1);
      // 실수 말은 교과서 말투(「~습니다.」)로 끝난다(docs/templates-design/말투.md). 문장마다 검사는 tools/text-style.mjs가 한다.
      if (m.say && !/니다\.$/.test(m.say)) add(`아이에게 하는 말의 끝맺음이 잘못됨: ${m.say}`);
      if (m.say && /—|(함|임)[.?!](?:\s|$)/.test(m.say)) add(`아이에게 하는 말에 줄표나 「~함.」: ${m.say}`);
    }
  }
  for (const m of t.mistakes ?? []) {
    if (!survived.get(m.id)) add(`실수 「${m.label}」(${m.id})가 한 번도 정답과 다르게 나오지 않음`);
  }
  if (t.answerSpan) {
    const span = Array.isArray(t.answerSpan) ? t.answerSpan : Array.from({ length: t.answerSpan.max - t.answerSpan.min + 1 }, (_, i) => t.answerSpan.min + i);
    if(t.answerCases){
      const exhaustive=new Set();
      for(const vars of t.answerCases()){
        const answer=t.answer(vars);exhaustive.add(answer);
        if(!same(t.answerKind??'int',answer,t.check(vars)))add('answerCases: 전체 입력의 두 정답 계산이 다름');
      }
      if(exhaustive.size!==new Set(span).size||span.some(n=>!exhaustive.has(n)))add('answerSpan: 전체 입력의 실제 답 목록과 다름');
    }else{
      const missing = span.filter((n) => !seenAnswers.has(n));
      if (missing.length) add(`answerSpan: 나오지 않은 정답 ${missing.join(', ')}`);
    }
  }
  if (numericChoiceRuns >= 100) {
    if ((t.answerKind ?? 'int') === 'int') {
      for (const [label, count] of [['가장 작은 보기', smallestRuns], ['가장 큰 보기', largestRuns]]) {
        if (count / numericChoiceRuns < 0.1) add(`D4: 정답이 ${label}인 비율은 10% 이상: ${(100 * count / numericChoiceRuns).toFixed(1)}%`);
      }
    }
    if (t.orderAsked) {
      for (const [label, count] of [['가장 큰 수', largestRuns], ['가장 작은 수', smallestRuns]]) {
        const ratio = count / numericChoiceRuns;
        if (ratio < 0.3 || ratio > 0.7) add(`orderAsked: 정답이 ${label}인 비율은 30~70%: ${Math.round(ratio * 100)}%`);
      }
    } else {
      const top = Math.max(...ranks.values());
      if (top / numericChoiceRuns > 0.5) add(`보기에서 정답 자리가 한쪽으로 쏠림: 크기순 같은 자리가 ${Math.round((100 * top) / numericChoiceRuns)}%`);
      if (middleRuns / numericChoiceRuns > 0.5) add(`보기에서 정답 자리가 한쪽으로 쏠림: 정답이 두 보기의 한가운데인 문제가 ${Math.round((100 * middleRuns) / numericChoiceRuns)}%`);
    }
  }
  return { ok: errors.length === 0, errors, ms: Date.now() - started };
}
