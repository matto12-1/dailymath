import { numberFinal } from './number-final.js?v=9a67f36b25';
export const ANSWER_KINDS = ['int', 'text', 'decimal', 'fraction', 'pair'];
const natural = (n) => Number.isSafeInteger(n) && n >= 0;
const digits = (s) => /^\d+$/.test(s) && natural(Number(s));

export function dec(scaled, places) {
  if (!natural(scaled) || !natural(places) || places > 15) throw new RangeError('소수는 안전한 정수와 0~15 자리로 만들어요.');
  if (!places) return String(scaled);
  const s = String(scaled).padStart(places + 1, '0');
  const tail = s.slice(-places).replace(/0+$/, '');
  return s.slice(0, -places) + (tail ? `.${tail}` : '');
}
export function frac(w, n, d) {
  if (![w, n, d].every(natural) || d === 0) throw new RangeError('분수의 분모는 1 이상이어야 해요.');
  return n === 0 ? String(w) : `${w ? `${w} ` : ''}${n}/${d}`;
}
export function pair(a, b) {
  if (![a, b].every(natural)) throw new RangeError('두 칸은 0 이상 정수여야 해요.');
  return `${a}|${b}`;
}
export function parseAnswer(kind, input) {
  if (input == null) return null;
  const s = String(input).trim();
  if (kind === 'text') return s || null;
  if (kind === 'int') return digits(s) ? Number(s) : null;
  if (kind === 'decimal') {
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) return null;
    const [head, tail = ''] = s.split('.');
    const trimmed = tail.replace(/0+$/, '');
    const scaled = Number((head || '0') + trimmed);
    return natural(scaled) && trimmed.length <= 15 ? { scaled, places: trimmed.length } : null;
  }
  if (kind === 'fraction') {
    if (digits(s)) return { w: Number(s), n: 0, d: 1 };
    const m = /^(?:(\d+)\s+)?(\d+)\/(\d+)$/.exec(s);
    if (!m || ![m[1] || '0', m[2], m[3]].every(digits) || Number(m[3]) === 0) return null;
    return { w: Number(m[1] || 0), n: Number(m[2]), d: Number(m[3]) };
  }
  if (kind === 'pair') {
    const m = /^(\d+)\s*\|\s*(\d+)$/.exec(s);
    return m && m.slice(1).every(digits) ? m.slice(1).map(Number) : null;
  }
  return null;
}
export function canon(kind, s) {
  const v = parseAnswer(kind, s);
  if (v === null) return null;
  if (kind === 'decimal') return dec(v.scaled, v.places);
  if (kind === 'fraction') return frac(v.w, v.n, v.d);
  if (kind === 'pair') return pair(...v);
  return String(v);
}
export function same(kind, a, b, { exactForm = false } = {}) {
  if (kind === 'int') return a === b;
  const ca = canon(kind, a), cb = canon(kind, b);
  if (ca === null || cb === null) return false;
  if (kind !== 'fraction' || exactForm) return ca === cb;
  const x = parseAnswer(kind, ca), y = parseAnswer(kind, cb);
  const numerator = (v) => BigInt(v.w) * BigInt(v.d) + BigInt(v.n);
  return numerator(x) * BigInt(y.d) === numerator(y) * BigInt(x.d);
}
// 정답이 대분수이면 자연수와 진분수로 나눈 꼴도 확인한다.
// exactForm과 따로 보아 약분 전 대분수를 받는 기존 규칙은 그대로 둔다.
export function mixedFormMistake(problem, given) {
  if (problem.answerKind !== 'fraction') return null;
  const answer = parseAnswer('fraction', problem.answer), value = parseAnswer('fraction', given);
  const mixed = f => f && f.w > 0 && f.n > 0 && f.n < f.d;
  if (!mixed(answer) || !value || mixed(value) || !same('fraction', given, problem.answer)) return null;
  const improper = `${BigInt(value.w) * BigInt(value.d) + BigInt(value.n)}/${value.d}`;
  const written = value.w ? `분수 부분을 가분수 ${value.n}/${value.d}` : `가분수 ${improper}`;
  // 분수는 분자를 마지막에 읽는다(이분의 칠, 삼분의 십). 두 꼴 모두 적힌 분자는 value.n이다.
  const ro = numberFinal(String(value.n)) === 'other' ? '으로' : '로';
  return {
    id: 'improper-for-mixed', label: '가분수를 대분수로 바꾸지 않기', value: canon('fraction', given),
    say: `${written}${ro} 썼습니다. 대분수로 나타내면 ${canon('fraction', problem.answer)}입니다.`,
  };
}
export function valueOf(kind, s) {
  const v = parseAnswer(kind, s);
  if (v === null) return NaN;
  if (kind === 'fraction') return v.w + v.n / v.d;
  if (kind === 'decimal') return v.scaled / 10 ** v.places;
  return kind === 'int' ? v : NaN;
}
export function readAloud(kind, s, parts = []) {
  const v = parseAnswer(kind, s);
  if (v === null) return String(s);
  if (kind === 'fraction') return v.n ? `${v.w ? `${v.w}${numberFinal(v.w) === 'none' ? '와' : '과'} ` : ''}${v.d}분의 ${v.n}` : String(v.w);
  if (kind === 'decimal') return String(s).trim().replace(/^\./, '0.').replace('.', ' 점 ');
  if (kind === 'pair') return v.map((n, i) => {
    const before = parts[i]?.before?.trim(), after = parts[i]?.after?.trim();
    return `${before ? before + ' ' : ''}${n}${after ? (/^[A-Za-z]/.test(after) ? ' ' : '') + after : ''}`;
  }).join(' ');
  return String(v);
}
