import { canon, parseAnswer, readAloud } from './answer.js?v=9a67f36b25';

export function displayNumbers(text) {
  return String(text);
}

// 수 상자(numberRow)를 한 줄 글로: 「39 → 44 → 49 → ?」, 「자료 26, 49, 51」. 글만 보이는 곳(다음에 또 나와요)과 검사에 쓴다.
export function numberRowText(row) {
  if (!row) return '';
  if (row.lines) return row.lines.join(', ');
  return (row.tag ? row.tag + ' ' : '') + row.items.join(row.arrows ? ' → ' : ', ');
}

// 식 상자와 묻는 글을 한 줄 글로 잇는다: 「5 + 2 = ? 계산하면 얼마일까요?」. 같은 문제 가리기와, 글에서 수를 읽는 검사에 쓴다.
// 식을 상자로 옮긴 틀은 묻는 글만 보면 모두 같다(검수 9번).
export function questionText(p) {
  return p.numberRow ? numberRowText(p.numberRow) + ' ' + p.prompt : p.prompt;
}

export function toParts(kind, s, parts = []) {
  const v = parseAnswer(kind, s);
  if (kind === 'fraction' && v?.n) return [{ t: 'frac', ...v }];
  if (kind === 'pair' && v) return [{ t: 'text', v: displayNumbers(readAloud(kind, s, parts ?? [])) }];
  return [{ t: 'text', v: displayNumbers(kind === 'decimal' && v ? String(s) : canon(kind, s) ?? String(s)) }];
}
const FRACTIONS = /\d+\s+\d+\/\d+|\d+\/\d+/g;
export function promptParts(prompt) {
  const out = [];
  let at = 0;
  for (const m of prompt.matchAll(FRACTIONS)) {
    if (m.index > at) out.push({ t: 'text', v: displayNumbers(prompt.slice(at, m.index)) });
    out.push(...toParts('fraction', m[0]));
    at = m.index + m[0].length;
  }
  if (at < prompt.length) out.push({ t: 'text', v: displayNumbers(prompt.slice(at)) });
  return out;
}
