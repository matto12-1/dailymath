// 선생님 대시보드 자료(설계서 5.4): 서버 board 답(반 + 들어온 번호의 BoardKid)을 아이별 표 줄과 반 전체 묶음으로 바꾼다.
// report는 아이 기기가 만든 요약을 서버가 그대로 둔 것이라(계획서 「서버 주소 약속」) 꼴을 여기서 다시 본다:
// 꼴이 틀린 칸은 없는 것으로 둔다. 단원·실수 이름 같은 글은 그대로 두고, 화면은 글로만 넣는다(Ruling R27).
// 화면(app/teacher/board.js)과 따로 두어 node 시험이 DOM 없이 본다(tests/board.test.mjs).
import { STRANDS, STRAND_NAMES } from '../engine/template.js?v=9a67f36b25';
import { dayNumber } from './date.js?v=9a67f36b25';

const NAME_MAX = 40; // 실수 이름 글자 수(report.js와 같다. 긴 글이 표를 밀지 않게)
const UNIT_NAME_MAX = 60;
const KEY_MAX = 120;

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const count = (v) => (Number.isSafeInteger(v) && v >= 0 ? v : 0);
const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
// 빈칸뿐인 글은 없는 것. 길면 글자 단위로 자른다.
const text = (v, max) => {
  if (typeof v !== 'string' || !v.trim()) return null;
  return [...v.trim()].slice(0, max).join('');
};
const order = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const reportOf = (kid) => (isObject(kid?.report) ? kid.report : {});

// 서버 Class 꼴(계획서 약속표): 반 id(32자 16진수)는 주소 #class=…와 길 /classes/:id에 들어가고, 반 코드는 숫자 6개
export const isClass = (c) => isObject(c) && typeof c.id === 'string' && /^[0-9a-f]{32}$/.test(c.id)
  && typeof c.code === 'string' && /^\d{6}$/.test(c.code)
  && [c.grade, c.classNo, c.size, c.joined].every((n) => Number.isSafeInteger(n) && n >= 0) && typeof c.closed === 'boolean';

// 지금 곳: { unit, unitName, step, stepName } (단원 이름이 없으면 null)
function hereOf(here) {
  if (!isObject(here)) return null;
  const unitName = text(here.unitName, UNIT_NAME_MAX);
  if (!unitName) return null;
  return {
    unit: typeof here.unit === 'string' ? here.unit : null,
    unitName,
    step: Number.isSafeInteger(here.step) && here.step > 0 ? here.step : null,
    stepName: text(here.stepName, UNIT_NAME_MAX) ?? '',
  };
}

// 꼴이 맞는 실수만, 많은 차례(같으면 적힌 차례)
function mistakesOf(report) {
  if (!Array.isArray(report.mistakes)) return [];
  return report.mistakes
    .filter((m) => isObject(m) && typeof m.key === 'string' && m.key && m.key.length <= KEY_MAX && Number.isSafeInteger(m.count) && m.count > 0)
    .map((m) => ({ key: m.key, name: text(m.name, NAME_MAX), count: m.count }))
    .filter((m) => m.name)
    .sort((a, b) => b.count - a.count);
}

const emptyRow = (number) => ({
  number, joined: false, here: null, mastered: null, mistakes3: [], recent: null, lastDay: null, visitDays: 0, visitCount: 0, score: 0, locked: false, picReset: false,
});

function joinedRow(kid) {
  const report = reportOf(kid);
  const mistakes = mistakesOf(report);
  return {
    number: kid.number,
    joined: true,
    here: hereOf(report.here),
    mastered: Number.isSafeInteger(report.mastered) && report.mastered >= 0 ? report.mastered : null,
    mistakes3: mistakes.slice(0, 3).map((m) => m.name),
    recent: recentOf(report), // 최근 답(갈래 다섯을 더한 것, 살펴볼 아이)
    lastDay: isDay(kid.lastDay) ? kid.lastDay : null,
    visitDays: count(kid.visitDays),
    visitCount: count(kid.visitCount),
    score: count(kid.score),
    locked: kid.locked === true,
    picReset: kid.picReset === true,
  };
}

// 1~인원 번호 모두(안 들어온 번호는 joined: false). 인원보다 큰 번호에 들어온 아이도 잃지 않는다. 번호 차례.
export function boardRows(cls, kids) {
  const byNumber = new Map();
  for (const kid of Array.isArray(kids) ? kids : []) {
    if (isObject(kid) && Number.isSafeInteger(kid.number) && kid.number >= 1 && !byNumber.has(kid.number)) byNumber.set(kid.number, kid);
  }
  const size = Number.isSafeInteger(cls?.size) && cls.size > 0 ? cls.size : 0;
  const numbers = new Set([...Array.from({ length: size }, (_, i) => i + 1), ...byNumber.keys()]);
  return [...numbers].sort((a, b) => a - b).map((n) => (byNumber.has(n) ? joinedRow(byNumber.get(n)) : emptyRow(n)));
}

// 한 아이 요약의 갈래마다 최근 답 { correct, total }(갈래 차례). 꼴이 틀린 갈래는 0, 맞힌 수는 푼 수를 넘지 않는다.
function strandsOf(report) {
  const strands = isObject(report.strands) ? report.strands : {};
  return STRANDS.map((id) => {
    const total = isObject(strands[id]) ? count(strands[id].total) : 0;
    return { id, correct: total ? Math.min(count(strands[id].correct), total) : 0, total };
  });
}

// 한 아이의 최근 답: 갈래 다섯을 더한 것(살펴볼 아이의 「최근 맞힌 비율」)
function recentOf(report) {
  return strandsOf(report).reduce((sum, s) => ({ correct: sum.correct + s.correct, total: sum.total + s.total }), { correct: 0, total: 0 });
}

// 갈래별 맞힌 비율: 아이마다 최근 문제(요약의 strands)를 더한다. 갈래 차례, 푼 문제가 없으면 rate null.
export function classStrands(kids) {
  const sums = Object.fromEntries(STRANDS.map((id) => [id, { correct: 0, total: 0 }]));
  for (const kid of Array.isArray(kids) ? kids : []) {
    for (const s of strandsOf(reportOf(kid))) {
      sums[s.id].total += s.total;
      sums[s.id].correct += s.correct;
    }
  }
  return STRANDS.map((id) => ({ id, name: STRAND_NAMES[id], ...sums[id], rate: sums[id].total ? sums[id].correct / sums[id].total : null }));
}

// 이름은 그 실수가 났을 때의 문제 글이라 아이마다 다를 수 있다: 가장 많은 아이가 쓴 이름(같으면 먼저 본 이름)
function commonName(names) {
  let best = null;
  for (const [name, kids] of names) if (!best || kids > best[1]) best = [name, kids];
  return best[0];
}

// 반에서 많이 나온 실수: 그 실수가 있는 아이 수가 많은 차례, 같으면 모두 합친 횟수, 같으면 열쇠 차례
export function classMistakes(kids, n = 5) {
  const byKey = new Map();
  for (const kid of Array.isArray(kids) ? kids : []) {
    const seen = new Set();
    for (const m of mistakesOf(reportOf(kid))) {
      if (seen.has(m.key)) continue; // 한 아이 요약에 같은 실수가 두 번 적혀도 한 아이
      seen.add(m.key);
      const entry = byKey.get(m.key) ?? { key: m.key, names: new Map(), kids: 0, count: 0 };
      entry.kids += 1;
      entry.count += m.count;
      entry.names.set(m.name, (entry.names.get(m.name) ?? 0) + 1);
      byKey.set(m.key, entry);
    }
  }
  return [...byKey.values()]
    .sort((a, b) => b.kids - a.kids || b.count - a.count || order(a.key, b.key))
    .slice(0, n)
    .map(({ key, names, kids: many, count: total }) => ({ key, name: commonName(names), kids: many, count: total }));
}

// 그 실수가 요약에 있는 아이 번호(작은 번호부터). 실수·접속 쪽에서 실수마다 누가 했는지 번호로 보인다(2026-10-22 오후 V14, 빈 칸 채우기)
export function mistakeNumbers(kids, key) {
  const out = new Set();
  for (const kid of Array.isArray(kids) ? kids : []) {
    if (isObject(kid) && Number.isSafeInteger(kid.number) && mistakesOf(reportOf(kid)).some((m) => m.key === key)) out.add(kid.number);
  }
  return [...out].sort((a, b) => a - b);
}

// 줄 세우기(표 머리 단추). 'number'(모르는 값도)는 들어왔든 아니든 1번부터 번호 차례(Ruling R28).
// 접속 날 수·점수·최근 날짜는 들어온 아이끼리 견주고(같으면 번호 차례), 안 들어온 번호는 그 뒤에 번호 차례로.
const ORDERS = {
  visits: (a, b) => b.visitDays - a.visitDays || b.visitCount - a.visitCount, // 접속 순위: 날 수, 같으면 횟수
  score: (a, b) => b.score - a.score,
  recent: (a, b) => order(b.lastDay ?? '', a.lastDay ?? ''), // 최근 날짜가 먼저, 날짜 없는 아이는 날짜 있는 아이 뒤
};
export const SORTS = ['number', ...Object.keys(ORDERS)];

export function sortRows(rows, by = 'number') {
  const compare = Object.hasOwn(ORDERS, by) ? ORDERS[by] : null;
  if (!compare) return [...rows].sort((a, b) => a.number - b.number);
  return [...rows].sort((a, b) => {
    if (a.joined !== b.joined) return a.joined ? -1 : 1;
    return (a.joined ? compare(a, b) : 0) || a.number - b.number;
  });
}

// ── 맨 위 숫자 칸 넷 · 살펴볼 아이 · 표 탭(2026-10-22 결정) ──
// 모두 지금 받은 자료(표 줄·요약 갈래)를 다시 묶은 것이다. 지난주와 견주는 숫자는 서버에 자료가 없어 만들지 않는다.
// today는 이 기기의 오늘('YYYY-MM-DD', date.js todayStr). 아이 기기도 자기 날짜로 마지막 날을 적는다.

export const AWAY_DAYS = 7; // 마지막 날이 오늘보다 이만큼 이상 전이면 살펴볼 아이
// 최근 맞힌 비율(2026-10-23 오후, 쌓이기만 하는 「같은 실수 3번」 대신): 갈래 다섯의 최근 답(갈래마다 최근 10문제)을 더해
// LOW_SOLVED문제 이상 풀었고 맞힌 것이 LOW_RATE(절반)보다 적으면(틀린 것이 더 많으면) 살펴볼 아이. 단계를 넘는 기준(4분의 3)과는 따로다.
export const LOW_SOLVED = 20;
export const LOW_RATE = 0.5;
export const isLow = (recent) => Boolean(recent) && recent.total >= LOW_SOLVED && recent.correct < recent.total * LOW_RATE;
// 꼬리표의 비율(%, 반올림). 절반 아래인 아이가 「50%」로 보이지 않게 49에서 멈춘다(갈래마다 10문제라 실제로는 49를 넘지 않는다)
export const lowPercent = ({ correct, total }) => Math.min(Math.round((correct / total) * 100), 49);
// 살펴볼 까닭 차례(앞이 먼저): 비밀 그림 잠김 · 새 그림 기다림 · 오래 안 들어옴 · 최근 맞힌 비율 절반 아래
export const ATTENTION = ['locked', 'reset', 'away', 'low'];

// 들어온 아이 한 줄의 까닭 하나(여럿이면 앞 차례): { number, reason, days? | rate?, correct?, total? }, 없으면 null.
// 마지막 날이 없거나 오늘보다 뒤(기기 시계가 앞섬)면 날로는 보지 않는다.
export function attentionOf(row, today) {
  if (!row?.joined) return null;
  const { number } = row;
  if (row.locked) return { number, reason: 'locked' };
  if (row.picReset) return { number, reason: 'reset' };
  const away = isDay(row.lastDay) && isDay(today) ? dayNumber(today) - dayNumber(row.lastDay) : null;
  if (away !== null && away >= AWAY_DAYS) return { number, reason: 'away', days: away };
  if (isLow(row.recent)) {
    const { correct, total } = row.recent;
    return { number, reason: 'low', rate: correct / total, correct, total };
  }
  return null;
}

// 같은 까닭 안에서 심한 아이부터: 오래 안 옴은 오래된 아이부터, 맞힌 비율은 낮은 아이부터(나눗셈 없이 견준다)
const WORSE_FIRST = {
  away: (a, b) => b.days - a.days,
  low: (a, b) => a.correct * b.total - b.correct * a.total,
};

// 살펴볼 아이 모두: 까닭 차례, 같은 까닭이면 심한 차례, 같으면 번호 차례
export function attentionList(rows, today) {
  return rows.map((row) => attentionOf(row, today)).filter(Boolean)
    .sort((a, b) => ATTENTION.indexOf(a.reason) - ATTENTION.indexOf(b.reason) || (WORSE_FIRST[a.reason]?.(a, b) ?? 0) || a.number - b.number);
}

// 숫자 칸 넷: 들어온 아이(/인원) · 오늘 들어온 아이 · 반 정답률(갈래 다섯의 최근 맞힌 수 합 ÷ 푼 수 합, 없으면 null) · 살펴볼 아이
export function boardStats(cls, rows, kids, today) {
  const joined = rows.filter((r) => r.joined);
  const strands = classStrands(kids);
  const correct = strands.reduce((sum, s) => sum + s.correct, 0);
  const total = strands.reduce((sum, s) => sum + s.total, 0);
  return {
    joined: joined.length,
    size: Number.isSafeInteger(cls?.size) && cls.size > 0 ? cls.size : 0,
    absent: rows.length - joined.length,
    today: joined.filter((r) => r.lastDay === today).length,
    correct,
    total,
    rate: total ? correct / total : null,
    attention: attentionList(rows, today).length,
  };
}

// 아이별 표 위 탭: 전체 · 살펴볼 아이 · 안 들어옴. 받은 줄 차례(줄 세우기 뒤) 그대로 거른다. 모르는 탭은 전체.
export const TABS = ['all', 'attention', 'absent'];
export function tabRows(rows, tab, attention) {
  if (tab === 'attention') {
    const numbers = new Set(attention.map((a) => a.number));
    return rows.filter((r) => numbers.has(r.number));
  }
  if (tab === 'absent') return rows.filter((r) => !r.joined);
  return rows;
}
export const tabCounts = (rows, attention) => ({ all: rows.length, attention: attention.length, absent: rows.filter((r) => !r.joined).length });

// 아이별 쪽의 찾기 칸(2026-10-22 오후, V14 결): 번호(「7」·「7번」, 그 번호 하나)나 이 기기에 적은 이름 일부로 거른다.
// names는 { 번호: 이름 }(이 기기에만, app/teacher/names.js). 빈 글이면 그대로. 받은 줄 차례(줄 세우기·탭 뒤) 그대로 거른다.
export function searchRows(rows, query, names = {}) {
  const q = String(query ?? '').trim().replace(/\s+/g, ' ');
  if (!q) return rows;
  const number = /^(\d{1,3})\s*번?$/.exec(q)?.[1];
  const needle = q.toLowerCase();
  return rows.filter((r) => (number !== undefined && r.number === Number(number))
    || (typeof names?.[r.number] === 'string' && names[r.number].toLowerCase().includes(needle)));
}
