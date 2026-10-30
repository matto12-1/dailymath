// 선생님 화면 아이 상세 리포트(DECISIONS 2026-10-23, ★12가지)의 계산. 서버 리포트 길의 자료(api/src/report.js가 고른 칸)와
// 대시보드 자료(아이별 줄·반 요약)로 탭마다 보일 것을 만든다. 화면(app/teacher/report.js)과 따로 두어 node 시험이 DOM 없이 본다.
// 서버가 꼴을 봤어도 여기서 다시 본다(readKidReport): 꼴이 틀린 칸은 없는 것으로 둔다. 글은 그대로 두고 화면이 글로만 넣는다.
// today는 이 기기의 오늘('YYYY-MM-DD', date.js todayStr). 주는 월요일부터 일요일까지.
// 교육과정 자료는 src/curriculum/report-meta.js(tools/build-report-meta.mjs가 만든다): 선생님 화면은 문제 틀을 받지 않는다.
import { UNITS, STANDARDS, MISTAKE_BACK, MISTAKE_LABELS } from '../curriculum/report-meta.js?v=9a67f36b25';
import { UNIT_STEPS } from '../curriculum/steps.js?v=9a67f36b25';
import { STRANDS, STRAND_NAMES } from '../engine/template.js?v=9a67f36b25';
import { DRILLS } from './drill.js?v=9a67f36b25';
import { studyRange } from './study.js?v=9a67f36b25';
import { addDays, dayNumber } from './date.js?v=9a67f36b25';
import { AWAY_DAYS, isLow, lowPercent } from './board.js?v=9a67f36b25';
import { josa } from '../engine/korean.js?v=9a67f36b25';

export const RECENT_ROUNDS = 30; // ④ 판마다: 최근 30판
export const TREND_WEEKS = 8; // ④ 주마다: 최근 8주
export const TOP_MISTAKES = 10; // ⑦
export const STUCK_TIMES = 2; // ⑧ 같은 단계 판정을 이만큼 못 넘기면 막힌 단계
export const SHAKY_UNITS = 3; // ⑨ 흔들리는 기초 몇 개
export const SHAKY_TIMES = 3; // ⑯ 앞 학년 단원에 기댄 실수가 이만큼 넘으면 지도 제안에 올린다(review.js weakUnits와 같다)
export const CALENDAR_WEEKS = 18; // ⑪ 최근 몇 주
export const WEAK_RATE = 0.75; // ⑤ 단계를 넘는 비율(progress.js requiredCorrect, 4분의 3)보다 낮은 갈래만 짚는다
export const STRAND_MIN = 3; // ⑤ 이보다 적게 푼 갈래는 짚지 않는다
export const FEW_ROUNDS = 3; // 판이 이보다 적으면 판으로 그리는 칸은 「아직 기록이 적어요」
export const FEW_SOLVED = 30; // 푼 문제가 이보다 적고 판도 적으면 기록이 적은 아이
const NAME_MAX = 40; // 실수 이름 글자 수(report.js와 같다)
const COUNT_MAX = 100000;

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isInt = (v, min, max) => Number.isSafeInteger(v) && v >= min && v <= max;
const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isText = (v) => typeof v === 'string' && v.trim() !== '';
const entries = (v) => (isObject(v) ? Object.entries(v) : []);
const own = (obj, key) => (Object.hasOwn(obj, key) ? obj[key] : undefined);
const order = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const clip = (text) => [...text.trim()].slice(0, NAME_MAX).join('');
const sum = (list, pick) => list.reduce((total, x) => total + pick(x), 0);

const UNIT_BY_ID = new Map(UNITS.map((u) => [u.id, u]));
const TEMPLATE_UNIT = new Map();
for (const [unit, steps] of Object.entries(UNIT_STEPS)) for (const s of steps) for (const t of s.templates) if (!TEMPLATE_UNIT.has(t)) TEMPLATE_UNIT.set(t, unit);
const stepsOfUnit = (id) => own(UNIT_STEPS, id) ?? [];
export const unitTitle = (id) => UNIT_BY_ID.get(id)?.title ?? null;
const unitGrade = (id) => UNIT_BY_ID.get(id)?.grade ?? null;
const unitOfKey = (key) => TEMPLATE_UNIT.get(String(key).split('#')[0]) ?? null;

// 월요일
export function weekStart(day) {
  const n = dayNumber(day);
  return addDays(day, -((n + 3) % 7)); // 1970-01-01(0)은 목요일
}

// ── 받은 자료 다시 보기 ──

function readRound(r) {
  if (!isObject(r) || !isDay(r.date) || !isInt(r.count, 0, COUNT_MAX) || !isInt(r.correct, 0, r.count)) return null;
  const evaluations = (Array.isArray(r.evaluations) ? r.evaluations : [])
    .filter((e) => isObject(e) && isText(e.unit) && isInt(e.level, 1, 99))
    .map((e) => ({
      unit: e.unit, level: e.level, name: isText(e.name) ? clip(e.name) : null,
      total: isInt(e.total, 0, COUNT_MAX) ? e.total : 0, correct: isInt(e.correct, 0, COUNT_MAX) ? e.correct : 0,
      passed: e.passed === true, already: e.already === true, mastered: e.mastered === true,
    }));
  return {
    date: r.date, mode: isText(r.mode) ? r.mode : null, count: r.count, correct: r.correct,
    units: (Array.isArray(r.units) ? r.units : []).filter(isText),
    mistakes: Object.fromEntries(entries(r.mistakes).filter(([, n]) => isInt(n, 1, COUNT_MAX))),
    evaluations,
  };
}

// 서버 답 { number, report, rounds } → 꼴을 다시 본 한 덩어리. 판은 최근 차례(날짜가 같으면 받은 차례).
export function readKidReport(data) {
  const r = isObject(data?.report) ? data.report : {};
  const grade = isInt(r.grade, 1, 6) ? r.grade : null;
  return {
    number: isInt(data?.number, 1, 999) ? data.number : null,
    grade,
    study: isInt(r.study, 1, 6) ? r.study : grade,
    units: Object.fromEntries(entries(r.units).filter(([, u]) => isObject(u)).map(([id, u]) => [id, {
      passed: (Array.isArray(u.passed) ? u.passed : []).filter((n) => isInt(n, 1, 99)),
      mastered: isDay(u.mastered) ? u.mastered : null,
    }])),
    days: Object.fromEntries(entries(r.days).filter(([day, n]) => isDay(day) && isInt(n, 1, COUNT_MAX))),
    strands: Object.fromEntries(entries(r.strands).filter(([, a]) => Array.isArray(a)).map(([id, a]) => [id, a.filter((x) => typeof x === 'boolean')])),
    mistakes: Object.fromEntries(entries(r.mistakes).filter(([key, n]) => key && isInt(n, 1, COUNT_MAX))),
    mistakeNames: Object.fromEntries(entries(r.mistakeNames).filter(([, name]) => isText(name)).map(([key, name]) => [key, clip(name)])),
    reviews: isInt(r.reviews, 0, COUNT_MAX) ? r.reviews : 0,
    drills: Object.fromEntries(entries(r.drills).filter(([, d]) => isObject(d) && isInt(d.runs, 0, COUNT_MAX) && isInt(d.best, 0, COUNT_MAX))
      .map(([id, d]) => [id, { runs: d.runs, best: d.best }])),
    rounds: (Array.isArray(data?.rounds) ? data.rounds : []).map(readRound).filter(Boolean),
  };
}

// 기록 양: 푼 문제(날짜별 합) · 판 수 · 공부한 날 수. 기록이 적은 아이(sparse)는 판도 적고 푼 문제도 적다.
export function amountOf(kid) {
  const solved = sum(Object.values(kid.days), (n) => n);
  const active = Object.keys(kid.days).length;
  return { solved, rounds: kid.rounds.length, active, sparse: kid.rounds.length < FEW_ROUNDS && solved < FEW_SOLVED };
}

// ── ② 학년 단원 지도 · ③ 성취기준 도달 ──

// 단원 하나의 단계: { numbers(그 단원 단계 번호), passed(넘긴 단계), mastered(익힌 날 | null) }. 익힌 단원은 모든 단계를 넘긴 것.
export function unitProgress(kid, unitId) {
  const numbers = stepsOfUnit(unitId).map((s) => s.number);
  const info = own(kid.units, unitId);
  const mastered = info?.mastered ?? null;
  return { numbers, passed: mastered ? numbers : numbers.filter((n) => info?.passed.includes(n)), mastered };
}

// 진도 학년(없으면 학년)의 단원: 학기·차례대로(units.js unitPath와 같다)
export const gradeUnits = (grade) => UNITS.filter((u) => u.grade === grade && stepsOfUnit(u.id).length)
  .sort((a, b) => a.semester - b.semester || a.order - b.order);

// ② 단원마다 { id, title, semester, status: mastered | doing | todo, passed, total, mastered(날), current }.
// 하는 중 = 넘긴 단계가 있거나 지금 하는 단원(here = 대시보드 줄의 지금 곳, 넘긴 단계가 아직 없어도).
export function unitMap(kid, here = null) {
  return gradeUnits(kid.study ?? kid.grade).map((u) => {
    const { numbers, passed, mastered } = unitProgress(kid, u.id);
    const current = !mastered && here?.unit === u.id;
    const status = mastered ? 'mastered' : passed.length || current ? 'doing' : 'todo';
    return { id: u.id, title: u.title, semester: u.semester, status, passed: passed.length, total: numbers.length, mastered, current };
  });
}

// ③ 진도 학년 단원에 이어진 성취기준마다 { code, domain, text, done, units, status }. 이 사이트에서 익힌 정도라 학교 평가가 아니다.
// 이어진 단원(그 학년 안)을 모두 익힘 = reached(도달). 다 익히지는 않았지만 이어진 단원 가운데 익힌 것 · 넘긴 단계가 있는 것 ·
// 지금 하는 단원(here)이 하나라도 있음 = doing(하는 중, 단원 지도 unitMap과 같은 잣대). 그 밖은 todo(아직). 코드 차례(영역끼리 모인다).
export function standardsReach(kid, here = null) {
  const linked = new Map();
  for (const u of gradeUnits(kid.study ?? kid.grade)) {
    for (const code of u.standards) {
      if (!Object.hasOwn(STANDARDS, code)) continue;
      if (!linked.has(code)) linked.set(code, []);
      linked.get(code).push(u.id);
    }
  }
  return [...linked].sort(([a], [b]) => order(a, b)).map(([code, ids]) => {
    const progress = ids.map((id) => ({ id, ...unitProgress(kid, id) }));
    const done = progress.filter((p) => p.mastered).length;
    const started = progress.some((p) => p.mastered || p.passed.length || here?.unit === p.id);
    return { code, domain: STANDARDS[code].domain, text: STANDARDS[code].text, done, units: ids.length,
      status: done === ids.length ? 'reached' : started ? 'doing' : 'todo' };
  });
}

// ── ④ 정답률 추이 · ⑤ 갈래별 ──

// ④ 최근 30판(오래된 것부터, 푼 문제가 있는 판만)과 최근 8주(이번 주까지, 판이 없는 주는 rate null)
export function accuracyTrend(kid, today) {
  const played = kid.rounds.filter((r) => r.count > 0);
  const rounds = played.slice(0, RECENT_ROUNDS).reverse().map((r) => ({ date: r.date, mode: r.mode, count: r.count, correct: r.correct, rate: r.correct / r.count }));
  const first = addDays(weekStart(today), -7 * (TREND_WEEKS - 1));
  const weeks = Array.from({ length: TREND_WEEKS }, (_, i) => {
    const from = addDays(first, 7 * i);
    const to = addDays(from, 6);
    const inWeek = played.filter((r) => r.date >= from && r.date <= to);
    const count = sum(inWeek, (r) => r.count);
    const correct = sum(inWeek, (r) => r.correct);
    return { from, to, rounds: inWeek.length, count, correct, rate: count ? correct / count : null };
  });
  return { rounds, weeks, enough: rounds.length >= FEW_ROUNDS };
}

// ⑤ 갈래마다 이 아이의 최근 답(갈래별 10개)과 반 평균(board.js classStrands). lowest = 짚을 갈래(3문제 넘게 풀고 4분의 3보다 낮은 것 중 가장 낮은 것)
export function strandCompare(kid, classList = []) {
  const rows = STRANDS.map((id) => {
    const answers = own(kid.strands, id) ?? [];
    const correct = answers.filter((a) => a === true).length;
    const cls = Array.isArray(classList) ? classList.find((s) => s?.id === id) : null;
    return { id, name: STRAND_NAMES[id], correct, total: answers.length, rate: answers.length ? correct / answers.length : null,
      classRate: typeof cls?.rate === 'number' ? cls.rate : null };
  });
  const weak = rows.filter((r) => r.total >= STRAND_MIN && r.rate < WEAK_RATE).sort((a, b) => a.rate - b.rate || b.total - a.total)[0];
  return { rows, lowest: weak?.id ?? null, enough: rows.some((r) => r.total >= STRAND_MIN) };
}

// 최근 답 모두(갈래 다섯, 갈래마다 최근 10문제)를 더한 것 { correct, total }: 살펴볼 아이의 「최근 맞힌 비율」과 같은 셈(board.js isLow)
export function recentAnswers(kid) {
  const answers = STRANDS.flatMap((id) => own(kid.strands, id) ?? []);
  return { correct: answers.filter((a) => a === true).length, total: answers.length };
}

// 단원 이름 뒤에 붙는 「과/와」(받침으로 고른다). 「덧셈과 뺄셈(1)」처럼 끝의 (1)은 「일」로 읽는다
export const andOf = (title) => josa(String(title).replace(/\s*\((\d+)\)$/, ' $1'), '과/와').slice(-1);

// ── ⑦ 자주 하는 실수 · ⑧ 막힌 단계 · ⑨ 흔들리는 기초 ──

// 실수 이름: 그 실수가 났을 때 남긴 이름 → 틀의 고정 이름 → 「<단원 이름> 실수」 → 그 밖의 실수(report.js mistakeName과 같은 차례)
export function mistakeLabel(kid, key) {
  const saved = own(kid.mistakeNames, key);
  if (isText(saved)) return clip(saved);
  const label = own(MISTAKE_LABELS, key);
  if (isText(label)) return clip(label);
  const title = unitTitle(unitOfKey(key));
  return title ? clip(`${title} 실수`) : '그 밖의 실수';
}

// ⑦ 많은 차례(같으면 열쇠 차례) n개: { key, name, count, unit }
// 실수마다 그 단원(unit · title)과, 앞 학년 단원에 기대는 실수면 그 단원(back · backTitle · backGrade, ⑨와 같은 표)
export function topMistakes(kid, n = TOP_MISTAKES) {
  return Object.entries(kid.mistakes).sort(([a, x], [b, y]) => y - x || order(a, b)).slice(0, n)
    .map(([key, count]) => {
      const unit = unitOfKey(key);
      const back = own(MISTAKE_BACK, key);
      const linked = typeof back === 'string' && UNIT_BY_ID.has(back) ? back : null;
      return { key, name: mistakeLabel(kid, key), count, unit, title: unit ? unitTitle(unit) ?? null : null,
        back: linked, backTitle: linked ? unitTitle(linked) : null, backGrade: linked ? unitGrade(linked) : null };
    });
}

// ⑧ 판 끝 요약의 단계 판정에서, 아직 넘기지 않은 단계(전에 넘긴 단계를 다시 푼 판은 빼고)를 못 넘긴 것이 2번 넘는 곳.
// { unit, title, level, stepName, fails, first(처음 못 넘긴 날), last, passedNow(지금은 넘겼거나 단원을 익힘) }.
// 아직 막힌 곳이 먼저, 그다음 못 넘긴 수가 많은 차례, 최근 차례.
export function stuckSteps(kid) {
  const byStep = new Map();
  for (const round of kid.rounds) {
    for (const e of round.evaluations) {
      if (e.passed || e.already) continue;
      const key = `${e.unit}#${e.level}`;
      const entry = byStep.get(key) ?? { unit: e.unit, level: e.level, name: e.name, fails: 0, first: round.date, last: round.date };
      entry.fails += 1;
      if (round.date < entry.first) entry.first = round.date;
      if (round.date > entry.last) entry.last = round.date;
      entry.name ??= e.name;
      byStep.set(key, entry);
    }
  }
  return [...byStep.values()].filter((e) => e.fails >= STUCK_TIMES).map((e) => {
    const { passed, mastered } = unitProgress(kid, e.unit);
    const stepName = stepsOfUnit(e.unit).find((s) => s.number === e.level)?.name ?? e.name ?? `${e.level}단계`;
    return { unit: e.unit, title: unitTitle(e.unit) ?? '알 수 없는 단원', level: e.level, stepName, fails: e.fails, first: e.first, last: e.last,
      passedNow: Boolean(mastered) || passed.includes(e.level) };
  }).sort((a, b) => Number(a.passedNow) - Number(b.passedNow) || b.fails - a.fails || order(b.last, a.last) || order(a.unit, b.unit) || a.level - b.level);
}

// ⑨ 실수가 기대는 앞 학년 단원(틀의 back)마다 실수 횟수를 모아 많은 차례로 셋: { unit, title, grade, count, mastered(날 | null) }
export function shakyBasics(kid, n = SHAKY_UNITS) {
  const sums = new Map();
  for (const [key, count] of Object.entries(kid.mistakes)) {
    const back = own(MISTAKE_BACK, key);
    if (back && UNIT_BY_ID.has(back)) sums.set(back, (sums.get(back) ?? 0) + count);
  }
  return [...sums].sort(([a, x], [b, y]) => y - x || order(a, b)).slice(0, n)
    .map(([unit, count]) => ({ unit, title: unitTitle(unit), grade: unitGrade(unit), count, mastered: unitProgress(kid, unit).mastered }));
}

// ── ⑪ 학습 달력 · ⑫ 이번 주·지난 주 · ⑭ 최근 활동 ──

// 하루 푼 문제 수의 짙기(잔디): 0 없음 · 1 1~9 · 2 10~19 · 3 20~39 · 4 40 이상(한 판이 10문제쯤)
export const LEVELS = [1, 10, 20, 40];
export const levelOf = (n) => (n > 0 ? LEVELS.filter((min) => n >= min).length : 0);

// ⑪ 최근 weeks주(이번 주까지, 월~일)를 주마다 한 줄: { weeks: [{ month, days: [{ day, count, level } | null(오늘 뒤)] }], active, total }.
// month = 그 주에 달이 바뀌면(첫 주는 늘) 그 달 숫자, 아니면 null.
export function studyCalendar(kid, today, weeks = CALENDAR_WEEKS) {
  const first = addDays(weekStart(today), -7 * (weeks - 1));
  let active = 0;
  let total = 0;
  let lastMonth = null;
  const columns = Array.from({ length: weeks }, (_, w) => {
    const days = Array.from({ length: 7 }, (_, d) => {
      const day = addDays(first, 7 * w + d);
      if (day > today) return null;
      const count = own(kid.days, day) ?? 0;
      if (count) { active += 1; total += count; }
      return { day, count, level: levelOf(count) };
    });
    const monthOfWeek = Number(days.find(Boolean)?.day.slice(5, 7) ?? addDays(first, 7 * w).slice(5, 7));
    const month = monthOfWeek !== lastMonth ? monthOfWeek : null;
    lastMonth = monthOfWeek;
    return { month, days };
  });
  return { weeks: columns, from: first, to: today, active, total };
}

// ⑫ 이번 주(월~오늘)·지난 주(월~일) 푼 문제와 공부한 날, 연속으로 공부한 날(오늘 안 했으면 어제까지)
export function weekCounts(kid, today) {
  const start = weekStart(today);
  const range = (from, to) => Object.entries(kid.days).filter(([day]) => day >= from && day <= to);
  const thisWeek = range(start, today);
  const lastWeek = range(addDays(start, -7), addDays(start, -1));
  let streak = 0;
  for (let day = own(kid.days, today) ? today : addDays(today, -1); own(kid.days, day); day = addDays(day, -1)) streak += 1;
  return {
    thisWeek: sum(thisWeek, ([, n]) => n), thisWeekDays: thisWeek.length,
    lastWeek: sum(lastWeek, ([, n]) => n), lastWeekDays: lastWeek.length,
    streak, today: own(kid.days, today) ?? 0,
  };
}

// 판 종류 이름: mix = 탐험(오늘의 탐험·장소에서 바로 풀기), 갈래 = 「셈 골라 풀기」, drill:<id> = 「집중 훈련 · 약분」
export function roundLabel(mode) {
  if (mode === 'mix' || mode === null || mode === undefined) return '탐험';
  if (typeof mode === 'string' && Object.hasOwn(STRAND_NAMES, mode)) return `${STRAND_NAMES[mode]} 골라 풀기`;
  if (typeof mode === 'string' && mode.startsWith('drill:')) {
    const drill = DRILLS.find((d) => d.id === mode.slice('drill:'.length));
    return drill ? `집중 훈련 · ${drill.label}` : '집중 훈련';
  }
  return '판';
}

// ⑭ 최근 판 n개(최근 차례): { date, label, count, correct, events: [{ type: 'passed', title, level, stepName } | { type: 'mastered', title }] }
export function recentActivity(kid, n = 8) {
  return kid.rounds.slice(0, n).map((r) => ({
    date: r.date, label: roundLabel(r.mode), count: r.count, correct: r.correct,
    events: r.evaluations.flatMap((e) => {
      const title = unitTitle(e.unit) ?? '알 수 없는 단원';
      if (e.mastered) return [{ type: 'mastered', unit: e.unit, title }];
      if (e.passed && !e.already) {
        const stepName = stepsOfUnit(e.unit).find((s) => s.number === e.level)?.name ?? e.name ?? `${e.level}단계`;
        return [{ type: 'passed', unit: e.unit, title, level: e.level, stepName }];
      }
      return [];
    }),
  }));
}

// ── ⑯ 지도 제안(규칙으로 고른 두세 줄, AI 쓰지 않음) ──

// 이 아이가 할 수 있는 집중 훈련(학습 진도 범위 안, drill.js drillsFor와 같다) 중 그 단원 것
function drillFor(kid, units) {
  const range = studyRange(kid.grade ?? 0);
  for (const unit of units) {
    const drill = DRILLS.find((d) => range.includes(d.grade) && TEMPLATE_UNIT.get(d.templateId) === unit);
    if (drill) return drill;
  }
  return null;
}

// 차례: 오래 안 옴 → 아직 막힌 단계 → 흔들리는 기초 → 최근 맞힌 비율 절반 아래 → 이어진 집중 훈련. 세 줄까지.
// 없으면 빈 목록(화면이 「따로 짚을 곳이 없어요」). lastDay = 대시보드 줄의 마지막 날.
// 오래 안 옴·최근 맞힌 비율은 살펴볼 아이와 같은 기준(board.js AWAY_DAYS 7일 이상, isLow 20문제 이상에 절반 아래).
export function guidance(kid, { lastDay = null, today } = {}) {
  const lines = [];
  const away = isDay(lastDay) && isDay(today) ? dayNumber(today) - dayNumber(lastDay) : null;
  if (away !== null && away >= AWAY_DAYS) lines.push({ kind: 'away', text: `${away}일째 들어오지 않았어요. 오늘의 탐험 한 판을 권해 주세요.` });
  const stuck = stuckSteps(kid).find((s) => !s.passedNow);
  if (stuck) lines.push({ kind: 'stuck', text: `${stuck.title} ${stuck.level}단계 「${stuck.stepName}」에서 ${stuck.fails}번 못 넘었어요. 이 단계를 함께 풀어 봐 주세요.` });
  const shaky = shakyBasics(kid).find((b) => b.count >= SHAKY_TIMES);
  if (shaky) lines.push({ kind: 'shaky', text: `${shaky.grade}학년 「${shaky.title}」${andOf(shaky.title)} 이어진 실수가 ${shaky.count}번 있어요. 그 단원을 다시 해 보게 해 주세요.` });
  const recent = recentAnswers(kid);
  if (isLow(recent)) {
    lines.push({ kind: 'low', text: `최근 ${recent.total}문제 중 ${recent.correct}개를 맞혔어요(${lowPercent(recent)}%). 틀린 문제를 함께 다시 풀어 봐 주세요.` });
  }
  const mistakeUnits = topMistakes(kid, 3).map((m) => m.unit).filter(Boolean);
  const drill = drillFor(kid, [stuck?.unit, shaky?.unit, ...mistakeUnits].filter(Boolean));
  if (drill) {
    const record = own(kid.drills, drill.id);
    // 한 판의 문제 수는 집중 훈련 자료 그대로(drill.js DRILL_COUNT, 지금은 20)
    const done = record?.runs ? ` 지금까지 ${record.runs}판, 가장 잘한 판은 ${drill.count}문제 중 ${record.best}개예요.` : '';
    lines.push({ kind: 'drill', text: `집중 훈련 「${drill.label}」도 권해 보세요.${done}` });
  }
  return lines.slice(0, 3);
}
