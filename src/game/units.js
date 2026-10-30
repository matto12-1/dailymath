// 단원 길: 학년마다 성취기준 순서의 단원. 문제 틀이 아직 없는 단원은 길에 넣지 않는다(5권에서 채워지면 저절로 생긴다).
import { UNIT_STEPS } from '../curriculum/steps.js?v=9a67f36b25';
export function unitPath(units, templates, grade) {
  const has = new Set(templates.map((t) => t.unit));
  return units
    .filter((u) => u.grade === grade && has.has(u.id))
    .sort((a, b) => a.semester - b.semester || a.order - b.order);
}

export const gradeOfUnit = (unitId) => Number(/^g(\d)/.exec(unitId)?.[1] ?? 0);

export function levelsOf(templates, unitId) {
  return stepsOf(templates, unitId).map(s => s.number);
}

export function stepsOf(templates, unitId) {
  const pool = templates.filter(t => t.unit === unitId);
  const steps = UNIT_STEPS[unitId];
  if (steps && pool.some(t => steps.at(-1).templates.includes(t.id))) return steps;
  // 작은 가상 단원도 쓸 수 있게, 별도 표가 없는 단원만 난도별로 묶는다.
  return [...new Set(pool.map(t => t.level))].sort((a,b)=>a-b).map(number => ({
    number, name:pool.find(t=>t.level===number)?.label ?? `${number}단계`, templates:pool.filter(t=>t.level===number).map(t=>t.id),
  }));
}

// 넘긴 단계 모음(차례와 상관없이 넘긴 단계 번호). numbers = 그 단원의 단계 번호.
// 옛 기록 꼴 { level: k }(「지금 k단계」)는 1~(k−1)단계 넘김으로 읽고(없는 단계 번호면 처음부터), 익힌 단원은 모든 단계를 넘긴 것으로 본다.
// 새 꼴(passed)에 옛 앱이 level을 덧쓴 기록이면 둘 다 살린다.
export function passedOf(info, numbers) {
  if (!info || typeof info !== 'object') return [];
  if (info.mastered) return [...numbers];
  const list = [...(Array.isArray(info.passed) ? info.passed : []), ...(numbers.includes(info.level) ? numbers.filter(n => n < info.level) : [])];
  return numbers.filter(n => list.includes(n));
}

// here = 「지금 여기예요」 단계: 단원 정리(마지막 단계)를 뺀 단계 가운데 아직 안 넘긴 첫 단계, 다 넘겼으면 단원 정리.
// 익힌 단원은 마지막 단계(다지기·약점 문제를 단원 전체에서 뽑는다).
export function unitInfo(state, unitId, templates) {
  const numbers = levelsOf(templates, unitId), info = state.units[unitId];
  const passed = passedOf(info, numbers), last = numbers.at(-1) ?? 1, mastered = info?.mastered ?? null;
  const here = mastered ? last : numbers.slice(0, -1).find(n => !passed.includes(n)) ?? last;
  return { passed, here, history: info?.history ?? [], mastered };
}

// 넘긴 단계 또는 아직 안 넘긴 첫 단계까지 연다. 건너뛴 옛 ✓도 연습할 수 있다.
export function stepOpen(state, unitId, templates, number) {
  const numbers = levelsOf(templates, unitId);
  if (!numbers.includes(number)) return false;
  const { passed, here } = unitInfo(state, unitId, templates);
  return passed.includes(number) || number <= here;
}

export function currentUnit(state, path, templates) {
  const focus = state.focus?.[state.study ?? state.grade];
  const chosen = path.find((u) => u.id === focus);
  if (chosen && !unitInfo(state, chosen.id, templates).mastered) return chosen;
  if (chosen) {
    const next = path.slice(path.indexOf(chosen) + 1).find(u => !unitInfo(state, u.id, templates).mastered);
    if (next) return next;
  }
  return path.find((u) => !unitInfo(state, u.id, templates).mastered) ?? null;
}

export function poolFor(templates, unitId, level, strand = null) {
  const ids = new Set(stepsOf(templates, unitId).find(s => s.number === level)?.templates ?? []);
  return templates.filter(t => t.unit === unitId && ids.has(t.id) && (!strand || t.strand === strand));
}

// 그 문제가 이 판에서 판정에 들어가는 단계(없으면 null). pick = 이 판의 { unit, step }(장소 창에서 고른 단계):
// 그 단원 문제는 고른 단계로, 다른 단원 문제는 그 단원의 「지금 여기예요」 단계로 센다.
export function levelForTemplate(state, template, templates, pick = null) {
  const info = unitInfo(state, template.unit, templates);
  if (info.mastered) return null;
  const step = pick?.unit === template.unit ? pick.step : info.here;
  return poolFor(templates, template.unit, step).some(t=>t.id===template.id) ? step : null;
}
