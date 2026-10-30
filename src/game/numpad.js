// 숫자판 누르기. 기본 여섯 자리, 큰 수 틀은 자리 수를 지정한다. 앞자리 0은 다음 숫자로 바뀐다.
import { canon, frac, pair, parseAnswer } from '../engine/answer.js?v=9a67f36b25';
import { makeRng } from '../engine/rng.js?v=9a67f36b25';
export const MAX_DIGITS = 6;

export function pressKey(text, key, maxDigits = MAX_DIGITS) {
  if (key === 'back') return text.slice(0, -1);
  if (key === 'clear') return '';
  if (!/^\d$/.test(key)) return text;
  if (text === '0') return key;
  return text.length >= maxDigits ? text : text + key;
}
export function padFor(problem) {
  return ['decimal', 'fraction', 'pair'].includes(problem.answerKind) ? problem.answerKind : 'int';
}
export function pressDecimal(text, key, maxDigits = MAX_DIGITS) {
  if (key === 'back') return text.slice(0, -1);
  if (key === 'clear') return '';
  if (key === '.') return text.includes('.') ? text : text ? text + '.' : '0.';
  if (!/^\d$/.test(key)) return text;
  if (text === '0') return key;
  return text.replace('.', '').length >= maxDigits ? text : text + key;
}
const readyInt = (s) => typeof s === 'string' && s !== '' && canon('int', s) !== null;
export function fractionReady({ w, n, d }, mixed) {
  if (mixed && n === '' && d === '') return readyInt(w);
  return readyInt(n) && readyInt(d) && Number(d) > 0 && (!mixed || w === '' || readyInt(w));
}
export function fractionText({ w, n, d }) {
  if (!fractionReady({ w, n, d }, true)) return null;
  return n === '' && d === '' ? canon('int', w) : frac(Number(w || 0), Number(n), Number(d));
}
export function pairReady(values) {
  return Array.isArray(values) && values.length === 2 && values.every(readyInt);
}
export function pairText(values) {
  return pairReady(values) ? pair(...values.map(Number)) : null;
}
// 자연수 칸이 있는 분수 답의 첫 칸(10-20). 이 틀의 답에 자연수 부분이 나올 수 있으면 자연수 칸부터,
// 답이 늘 진분수·가분수면 분자 칸부터 쓴다. 문제마다 정하면 답 꼴을 알려 주는 셈이라 틀마다 정한다.
// 같은 씨앗 60개로 답만 만들어 보고 기억한다(틀 38개 모두 2000개로 잰 것과 같다, game-helpers 시험).
const wholeAnswers = new WeakMap();
export function answersHaveWhole(template, samples = 60) {
  if (!wholeAnswers.has(template)) {
    let found = false;
    for (let seed = 1; seed <= samples && !found; seed++) found = parseAnswer('fraction', String(template.answer(template.make(makeRng(seed)))))?.w > 0;
    wholeAnswers.set(template, found);
  }
  return wholeAnswers.get(template);
}
// 자리 수 끝에 닿았는지(소수점은 세지 않는다). 끝에서 누른 숫자는 버리고 알린다.
export const isFull = (text, maxDigits = MAX_DIGITS) => text.replace('.', '').length >= maxDigits;
// 확인이 잠긴 까닭을 한 줄로(검수 P-004). 빈 답과 다 쓴 답은 null.
export function fractionHint({ n, d }) {
  if (d !== '' && Number(d) === 0) return '분모에는 0을 쓸 수 없어요';
  if (n !== '' && d === '') return '분모도 써요';
  if (d !== '' && n === '') return '분자도 써요';
  return null;
}
export function pairHint(values, parts = []) {
  const empty = values.findIndex(v => v === '');
  if (empty < 0 || values.every(v => v === '')) return null;
  const label = (parts[empty]?.before || parts[empty]?.after || '').trim();
  return /[가-힣A-Za-z]/.test(label) ? `${label}도 써요` : '두 칸을 모두 써요';
}
