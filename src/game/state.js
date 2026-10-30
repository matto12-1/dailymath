// 아이 한 명의 기록. 모양은 2권 계획서 「상태 모양」 절.
// grade = 아이 학년(들어올 때 정함), study = 지금 푸는 내용 학년(학습 진도 범위 안).
import { studyRange } from './study.js?v=9a67f36b25';
import { UNIT_STEPS, STEPS_VERSION } from '../curriculum/steps.js?v=9a67f36b25';
import { passedOf } from './units.js?v=9a67f36b25';
import { arrivalVariants, RESIDENT_VARIANTS } from './looks.js?v=9a67f36b25';
import { shopsFor, MAX_LEVEL } from './shops.js?v=9a67f36b25';
import { firstVariant } from './roles.js?v=9a67f36b25';
import { validDay } from './date.js?v=9a67f36b25';

export const VERSION = 1;
export const DAYS_KEEP = 400;

const LEGACY_PRICES = { flower: 30, tree: 30, bench: 40, mailbox: 40, lamp: 50, table: 60,
  'house-small': 100, well: 120, fountain: 200, 'house-big': 300 };

function blank() {
  return {
    version: VERSION, stepsVersion:STEPS_VERSION, grade: 1, study: 1, createdAt: null, coins: 0,
    student: null, gradePromptYear: null, // 3월 학년 확인을 마지막으로 보인 해
    score: 0, // 맞힌 문제마다 1점(선생님 화면 점수)
    visits: { count: 0, days: 0, lastDay: null }, // 접속 빈도(선생님 화면 순위)
    town: { kind: 'cat', shops: [], arrivals: {} },
    units: {}, focus: {}, strands: {}, reviews: {}, mistakes: {}, drills: {}, days: {},
    mistakeNames: {}, // 실수 열쇠 → 그 실수가 났을 때 문제에 나온 이름(선생님 화면, 설계서 4.8)
    outbox: [], sessions: 0, chests: [],
  };
}

export function newState({ kind, grade, today, student = null }) {
  const s = blank();
  s.grade = grade;
  s.study = grade;
  s.student = student;
  s.createdAt = today;
  s.town.kind = kind;
  s.town.arrivals.first = firstVariant(kind, s.createdAt);
  return s;
}

// 단원 기록: 「지금 k단계」 하나(level: k, 1부터)였던 옛 꼴을 넘긴 단계 모음(passed)으로 옮긴다.
// 지금 k단계 → 1~(k−1)단계 넘김, 익힌 단원 → 모든 단계 넘김. passed가 이미 있으면 다듬기만 해서 두 번 옮겨도 같다
// (새 꼴에 옛 앱이 level을 덧쓴 기록이면 둘 다 살린다, passedOf).
// 단계 표가 바뀐 기록(sameSteps 아님)은 예전대로 하던 단원을 처음부터(넘긴 단계 없음), 익힌 단원은 모두 넘김.
const range = (from, to) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
const MAX_LEGACY_LEVEL = Math.max(1, ...Object.values(UNIT_STEPS).flatMap(steps => steps.map(step => step.number)));
function migrateUnit(id, info, sameSteps) {
  if (!info || typeof info !== 'object') return info;
  const { level, ...rest } = info;
  // 망가진 큰 수를 단계 수만큼의 배열로 만들지 않는다.
  const listed = [...(Array.isArray(info.passed) ? info.passed : []), ...(Number.isInteger(level) && level >= 1 && level <= MAX_LEGACY_LEVEL ? range(1, level) : [])];
  const numbers = UNIT_STEPS[id]?.map(s => s.number) ?? [...new Set(listed.filter(n => Number.isInteger(n) && n >= 1))].sort((a, b) => a - b);
  const passed = sameSteps || info.mastered ? passedOf(info, numbers) : [];
  return { ...rest, passed, history: Array.isArray(info.history) ? info.history : [] };
}

// 판 끝 요약(반·선생님에게 보낼 칸 outbox)의 판정 꼴. 옛 꼴의 「다음 단계」(nextLevel·nextName)는 차례대로 오르던 때의 말이라
// 빼고, 넘긴 단계 모음(passedSteps)·단계 이름(name)·전에 넘겼는지(already)로 맞춘다. 옛 판정은 늘 지금 단계(아직 안 넘긴 단계)였다.
function migrateEvaluation(e) {
  if (!e || typeof e !== 'object' || Array.isArray(e.passedSteps)) return e;
  const { nextLevel, nextName, ...rest } = e;
  const steps = UNIT_STEPS[e.unit] ?? [];
  const upTo = e.mastered ? Infinity : e.passed ? e.level : e.level - 1;
  return { ...rest, name: rest.name ?? steps.find(s => s.number === e.level)?.name ?? null, already: rest.already ?? false,
    passedSteps: steps.map(s => s.number).filter(n => n <= upTo) };
}
const migrateSummary = (summary) => summary && typeof summary === 'object' && Array.isArray(summary.evaluations)
  ? { ...summary, evaluations: summary.evaluations.map(migrateEvaluation) } : summary;

// 읽은 기록을 지금 모양으로. 알 수 없는 판(다른 version, 망가진 값)이면 null.
export function migrate(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== VERSION) return null;
  if (!(Number.isInteger(raw.grade) && raw.grade >= 1 && raw.grade <= 6)) return null;
  if (!raw.town || typeof raw.town !== 'object' || Array.isArray(raw.town) || !['cat', 'dog'].includes(raw.town.kind)) return null;
  // 칸 꼴이 망가졌으면(reviews: null 등) 앱이 시작부터 멈추므로 깨진 기록으로 다룬다
  const isObj = (v) => v === undefined || (v !== null && typeof v === 'object' && !Array.isArray(v));
  if (!['units', 'focus', 'strands', 'reviews', 'mistakes', 'drills', 'mistakeNames'].every((k) => isObj(raw[k]))) return null;
  if (raw.outbox !== undefined && !Array.isArray(raw.outbox)) return null;
  if (!['coins', 'score', 'sessions'].every((k) => raw[k] === undefined || Number.isFinite(raw[k]))) return null;
  const s = { ...blank(), ...raw };
  const sameSteps = raw.stepsVersion === STEPS_VERSION;
  const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const entries = (v, valid) => Object.fromEntries(Object.entries(v ?? {}).filter(([, value]) => valid(value)));
  const count = n => Number.isSafeInteger(n) && n >= 0;
  // 소수·음수는 기록 전체를 버리지 않고 0 이상 정수로 바로잡는다. 깨진 기록으로 치우면 아이의 마을이 통째로 사라진다.
  for (const k of ['coins', 'score', 'sessions']) if (!count(s[k])) s[k] = Math.max(0, Math.floor(s[k]));
  s.study = raw.study ?? raw.grade;
  s.gradePromptYear = Number.isInteger(raw.gradePromptYear) && raw.gradePromptYear >= 2000 ? raw.gradePromptYear : null;
  s.createdAt = validDay(raw.createdAt) ? raw.createdAt : null;
  s.units = Object.fromEntries(Object.entries(raw.units ?? {}).filter(([, info]) => object(info)).map(([id, info]) => {
    const mastered = typeof info.mastered === 'string' ? info.mastered : null;
    const unit = migrateUnit(id, { ...info, mastered }, sameSteps);
    unit.history = unit.history.filter(h => object(h) && typeof h.correct === 'boolean' && Number.isInteger(h.level));
    return [id, unit];
  }));
  s.focus = entries(raw.focus, v => typeof v === 'string');
  s.strands = Object.fromEntries(Object.entries(raw.strands ?? {}).filter(([, v]) => Array.isArray(v))
    .map(([k, v]) => [k, v.filter(b => typeof b === 'boolean').slice(-10)]));
  s.reviews = entries(raw.reviews, r => object(r) && typeof r.templateId === 'string'
    && (r.mistakeId === null || typeof r.mistakeId === 'string') && Number.isInteger(r.step) && r.step >= 0 && r.step < 3 && validDay(r.due));
  s.mistakes = entries(raw.mistakes, count);
  s.stepsVersion = STEPS_VERSION;
  // 옛 기록에는 없다(빈 칸). 글이 아닌 이름은 버린다.
  s.mistakeNames = entries(raw.mistakeNames, v => typeof v === 'string');
  s.outbox = (raw.outbox ?? []).filter(r => object(r) && typeof r.id === 'string').map(r => migrateSummary({ ...r,
    ...(Array.isArray(r.evaluations) ? { evaluations: r.evaluations.filter(object) } : {}) }));
  s.town = { ...raw.town };
  s.visits = { ...blank().visits, ...raw.visits };
  for (const k of ['count', 'days']) if (!count(s.visits[k])) s.visits[k] = 0;
  if (!validDay(s.visits.lastDay)) s.visits.lastDay = null;
  s.chests = Array.isArray(raw.chests)
    ? [...new Set(raw.chests.filter(id => typeof id === 'string' && s.units[id]?.mastered))] : [];
  const legacy = Array.isArray(s.town.slots);
  if (legacy) {
    const refunded = s.town.slots.reduce((sum, id) => sum + (Object.hasOwn(LEGACY_PRICES, id) ? LEGACY_PRICES[id] : 0), 0);
    s.coins += refunded;
    s.town.refunded = refunded;
    s.town.shops = [];
    s.town.arrivals = {};
  }
  delete s.town.slots;
  const allowed = new Set(shopsFor(s.town.kind).map(shop => shop.id));
  const seen = new Set();
  s.town.shops = (Array.isArray(s.town.shops) ? s.town.shops : []).filter(shop => {
    if (!shop || !allowed.has(shop.id) || !Number.isInteger(shop.level) || shop.level < 1 || shop.level > MAX_LEVEL || seen.has(shop.id)) return false;
    seen.add(shop.id);
    return true;
  }).map(({ id, level }) => ({ id, level }));
  const arrivals = s.town.arrivals;
  s.town.arrivals = Object.fromEntries(Object.entries(arrivals && typeof arrivals === 'object' && !Array.isArray(arrivals) ? arrivals : {})
    .filter(([, variant]) => Number.isInteger(variant) && variant >= 0 && variant < RESIDENT_VARIANTS));
  for (const [id, variant] of Object.entries(arrivalVariants(s))) {
    if ((id === 'first' || !s.chests.includes(id)) && !Object.hasOwn(s.town.arrivals, id)) s.town.arrivals[id] = variant;
  }
  // drill.js와의 순환을 피한다. 한 판 문제 수는 DRILL_COUNT와 같은 20이다.
  s.drills = Object.fromEntries(Object.entries(raw.drills ?? {}).filter(([, r]) =>
    r && Number.isInteger(r.runs) && r.runs >= 1 && Number.isInteger(r.best) && r.best >= 0 && r.best <= 20)
    .map(([id, r]) => [id, { runs: r.runs, best: r.best }]));
  s.days = raw.days !== null && typeof raw.days === 'object' && !Array.isArray(raw.days)
    ? Object.fromEntries(Object.entries(raw.days).filter(([date, count]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isInteger(count) && count >= 1))
    : {};
  if (!studyRange(s.grade).includes(s.study)) s.study = s.grade;
  return s;
}
