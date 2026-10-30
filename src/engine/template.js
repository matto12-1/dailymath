import { fill } from './korean.js?v=9a67f36b25';
import { same, valueOf } from './answer.js?v=9a67f36b25';

// 지금 만드는 틀을 난수에 걸어 둔다. 틀 도우미(1·2학년 numberVars 등)가 그 틀의 정답 목록(answerSpan)을 보고
// 답이 될 수 없는 보기를 거른다(검수 뿌리 4). generate를 거치지 않고 make를 부르면 null이다.
const making = new WeakMap();
export const templateOf = (rng) => making.get(rng) ?? null;

// 글자 보기의 값: 분수·대분수·소수·자연수 꼴이면 그 값, 아니면 NaN.
export function choiceValue(c) {
  if (typeof c === 'number') return c;
  const f = valueOf('fraction', c);
  return Number.isFinite(f) ? f : valueOf('decimal', c);
}

// 옛 결론이 바로 앞 계산 줄을 되풀이하면 뺀다(검수 A1-22).
// 새 말투의 「따라서 ~입니다.」는 10-22 밤 기준에 따라 남긴다. 학년 틀의 원문은 여기서 바꾸지 않는다.
export function trimRepeat(solution) {
  const lines = solution.split('\n'), m = lines.at(-1).match(/^그래서 (.+?)(이에요|예요)\.$/);
  if (lines.length >= 2 && m && lines.at(-2).endsWith('= ' + m[1] + m[2] + '.')) lines.pop();
  return lines.join('\n');
}

// 보기를 놓는 차례(검수 뿌리 9). 틀의 choiceOrder가 있으면 그 차례로, 없으면 수 보기·분수 글자 보기는 작은 수부터.
// choiceOrder: (보기, vars) => 차례 수(작을수록 앞), 또는 보기를 놓을 차례대로 적은 배열(배열에 없는 보기는 뒤에, 원래 차례대로).
export function orderChoices(t, choices, vars) {
  const sortBy = (rank) => choices.map((c, i) => [c, rank(c), i]).sort((a, b) => (a[1] - b[1]) || (a[2] - b[2])).map(([c]) => c);
  if (t.choiceOrder) {
    if (Array.isArray(t.choiceOrder)) return sortBy((c) => { const k = t.choiceOrder.findIndex((x) => sameAnswer(x, c)); return k < 0 ? Infinity : k; });
    return sortBy((c) => { const k = t.choiceOrder(c, vars); if (!Number.isFinite(k)) throw new Error(`${t.id}: choiceOrder는 보기마다 수를 돌려줘야 해요 (${c}).`); return k; });
  }
  // 시험지처럼 수 보기는 작은 수부터, 그림 번호 단추는 1번부터 놓는다(검수 4·5번).
  // 가장 큰·작은 수를 묻는 문제와 보기 상자는 차례가 답을 알려 주므로 섞은 채 둔다.
  const numbered = choices.every((c) => /^\d+번$/.test(c)) || (t.answerUnit === '번' && choices.every((c) => Number.isInteger(c)));
  if (numbered) return sortBy((c) => typeof c === 'number' ? c : parseInt(c));
  if (t.orderAsked || t.choiceBox) return choices;
  if (choices.every((c) => typeof c === 'number')) return sortBy((c) => c);
  // 「0 | 1 | 1/2」처럼 수를 글자로 적은 보기(분수·소수)도 값이 작은 것부터(뿌리 9).
  if (choices.every((c) => typeof c === 'string' && Number.isFinite(choiceValue(c)))) return sortBy(choiceValue);
  return choices;
}

export const STRANDS = ['calc', 'estimate', 'shape', 'word', 'life'];
export const STRAND_NAMES = { calc: '셈', estimate: '어림', shape: '도형', word: '문장제', life: '생활 수학' };

// 생활·도형·수 모형 그림 종류. 문장제는 { scene }, 셈·어림은 MODEL만 허용한다. 자릿값 표(table)도 수 모형이다(A1-3).
export const LIFE_KINDS = ['money', 'clock', 'ruler', 'scale', 'cup', 'calendar', 'bars', 'pictograph', 'line', 'pie', 'band', 'table', 'compare', 'sort'];
export const FIGURE_KINDS = ['polygon', 'angle', 'circle', 'grid', 'solid', 'net', 'cubes', 'objects'];
export const MODEL_KINDS = ['tenframe', 'blocks', 'numberline', 'table'];

export function sameAnswer(a, b) {
  if (typeof a === 'number' || typeof b === 'number') return a === b;
  return String(a).trim() === String(b).trim();
}

// 정답 + 실수 답 몇 개(무작위로 골라) + 정답 가까이의 무작위 수.
// 실수 답만 쓰면 정답이 늘 같은 자리(예: −10과 +10의 한가운데)에 놓여 계산 없이 맞힐 수 있다.
function fillChoices(answer, mistakes, count, step, rng, range = {}) {
  const min = range.min ?? 0, max = range.max ?? Infinity;
  const inRange = (v) => Number.isSafeInteger(v) && v >= min && v <= max;
  if (!inRange(answer) || !Number.isSafeInteger(step) || step < 1) throw new RangeError('보기의 정답·간격이 범위에 맞지 않아요.');
  const pool = [answer];
  // 자릿수가 다른 실수 답(85에 713)은 한눈에 지워져 오히려 정답을 알려 준다. 보기에는 넣지 않는다(숫자판 진단에는 그대로 쓴다)
  const usable = mistakes.filter((m) => inRange(m.value) && String(m.value).length === String(answer).length);
  // 실수 답은 1개~(보기 수 − 2)개를 무작위로. 늘 같은 실수들이 들어가면 정답 자리가 굳는다
  for (const m of rng.shuffle(usable).slice(0, rng.int(1, count - 2))) pool.push(m.value);
  // 가까운 수를 정답 양쪽에 고르게 뿌리면 정답이 늘 가운데에 온다. 절반은 한쪽으로만 몬다
  const side = rng.next() < 0.5 ? 0 : rng.next() < 0.5 ? -1 : 1;
  for (let tries = 0; pool.length < count && tries < 200; tries++) {
    const sign = side || (rng.next() < 0.5 ? -1 : 1);
    const c = answer + step * rng.int(1, 12) * sign;
    if (inRange(c) && !pool.includes(c)) pool.push(c);
  }
  // 한쪽 끝에서도 범위를 넘지 않는다. 가능한 수가 모자라면 틀의 범위를 고쳐야 한다.
  const reach = Math.max(Math.floor((answer - min) / step), Number.isFinite(max) ? Math.floor((max - answer) / step) : count);
  for (let k = 1; pool.length < count && k <= reach; k++) {
    for (const c of [answer + k * step, answer - k * step]) {
      if (pool.length < count && inRange(c) && !pool.includes(c)) pool.push(c);
    }
  }
  if (pool.length < count) throw new RangeError('보기 수를 채우기에 범위가 너무 좁아요.');
  return pool;
}

export function generate(t, rng) {
  making.set(rng, t);
  const vars = t.make(rng);
  const answer = t.answer(vars);
  const answerKind = t.answerKind ?? (typeof answer === 'number' ? 'int' : 'text');
  const options = { exactForm: t.exactForm === true };
  const mistakes = [];
  for (const m of t.mistakes ?? []) {
    const value = m.value(vars);
    if (value === null || value === undefined) continue;
    // 저학년 선택형에서는 범위를 벗어난 실수만 뺀다. 문제 전체를 버리지 않는다.
    if (t.grade <= 2 && t.input === 'choice' && t.choices && answerKind === 'int') {
      if (!Number.isSafeInteger(value) || value < 0 || (t.range && (value < t.range.min || value > t.range.max))) continue;
      if (!t.differentDigits && String(value).length !== String(answer).length) continue;
    }
    if (same(answerKind, value, answer, options)) continue;
    if (mistakes.some((x) => same(answerKind, x.value, value, options))) continue;
    // say: 아이에게 하는 말. 그 문제의 숫자와 실수 답(value)으로 채운다.
    mistakes.push({ id: m.id, label: typeof m.label === 'string' ? fill(m.label, vars) : m.label, value, say: m.say ? fill(m.say, { ...vars, answer, value }) : null });
  }
  let choices = null;
  if (t.input === 'choice') {
    if (!t.choices && answerKind !== 'int') throw new Error('정수가 아닌 보기 문제에는 choices 함수가 필요해요.');
    const raw = t.choices ? t.choices(vars) : fillChoices(answer, mistakes, 4, t.choiceStep ?? 1, rng, t.range);
    // 섞기는 늘 불러서 뒤 문제의 난수가 바뀌지 않게 한다.
    const mixed = rng.shuffle(raw);
    // 보기 상자(견주기) 틀은 틀이 한 번 섞은 차례 하나를 보기 칸·단추·풀이가 같이 쓴다. 여기서 또 섞으면 풀이 차례가 어긋난다(검수 뿌리 2).
    choices = orderChoices(t, t.choiceBox ? [...raw] : mixed, vars);
  }
  // 글 속 〔…〕는 문제 칸에 크게 놓는 식 상자의 한 줄이다. 문제집처럼 식은 크게, 묻는 글은 짧게 남긴다(검수 9번).
  const text = fill(rng.pick(t.texts), vars), lines = [...text.matchAll(/〔([^〕]*)〕/g)].map((m) => m[1].trim());
  const prompt = lines.length ? text.replace(/〔[^〕]*〕/g, ' ').replace(/\s+/g, ' ').trim() : text;
  return {
    templateId: t.id, grade: t.grade, unit: t.unit, strand: t.strand, level: t.level,
    input: t.input, answerUnit: typeof t.answerUnit === 'function' ? t.answerUnit(vars) : t.answerUnit ?? null, speedBonus: t.speedBonus === true,
    prompt, answer, answerKind, answerPlaces: typeof t.answerPlaces === 'function' ? t.answerPlaces(vars) : t.answerPlaces ?? null,
    exactForm: t.exactForm === true, parts: t.parts ?? null,
    placeGuide: t.placeGuide === true, readTyped: t.readTyped === true,
    mixedInput: t.mixedInput === true, maxDigits: t.maxDigits ?? 6, choices, mistakes, choiceBox: t.choiceBox === true,
    // 긴 말 보기는 단추에 그림표와 짧은 말로 보인다(검수 7번). 값·채점·읽어 주는 말은 원래 보기 그대로다. { 보기: { icon, text } }
    choiceLooks: t.choiceLook && choices ? Object.fromEntries(choices.map((c) => [String(c), t.choiceLook(c, vars)])) : null,
    // 늘어선 수(규칙의 수·자료·계산식 배열)는 글 밖 상자에 둔다(검수 10번). {items, arrows, tag} 또는 {lines}. 글 속 〔…〕도 lines가 된다.
    numberRow: t.numberRow ? t.numberRow(vars) : lines.length ? { lines } : null,
    art: t.art ? t.art(vars) : null,
    solution: t.solution ? trimRepeat(fill(t.solution, { ...vars, answer })) : null,
    vars,
  };
}
