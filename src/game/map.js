// 지도: 단원마다 장소 모습(안개·맑음·지금 곳·끝낸 곳)과 학년·학기 진도.
import { unitInfo, unitPath, currentUnit, stepsOf, stepOpen } from './units.js?v=9a67f36b25';
import { residents } from './village.js?v=9a67f36b25';
import { deckSize } from './deck.js?v=9a67f36b25';
import { studyRange } from './study.js?v=9a67f36b25';

export const PLACE = ['fog', 'clear', 'now', 'done'];

export function placeState(state, unitId, templates, current) {
  const info = unitInfo(state, unitId, templates);
  if (info.mastered) return 'done';
  if (current?.id === unitId) return 'now';
  if (info.history.length) return 'clear';
  return 'fog';
}

export function mapProgress(state, units, templates, grade) {
  const progress = { s1: { done: 0, total: 0 }, s2: { done: 0, total: 0 }, done: 0, total: 0 };
  for (const unit of unitPath(units, templates, grade)) {
    const semester = progress[`s${unit.semester}`];
    semester.total += 1;
    progress.total += 1;
    if (unitInfo(state, unit.id, templates).mastered) {
      semester.done += 1;
      progress.done += 1;
    }
  }
  return progress;
}

// 장소 창: 단원 단계(차시)를 다 늘어놓는다. 줄마다 넘김(✓)·「지금 여기예요」(지금 곳만)·잠김(앞 단계를 다 넘기기 전 단원 정리).
export function placeInfo(state, unitId, units, templates, current) {
  const unit = units.find((u) => u.id === unitId);
  const info = unitInfo(state, unitId, templates);
  const steps = stepsOf(templates, unitId);
  const place = placeState(state, unitId, templates, current);
  return {
    unit: { id: unit.id, title: unit.title, grade: unit.grade, semester: unit.semester },
    place, here: info.here, passed: info.passed.length, total: steps.length,
    steps: steps.map((s) => ({ number: s.number, name: s.name, passed: info.passed.includes(s.number),
      here: place === 'now' && s.number === info.here, locked: !stepOpen(state, unitId, templates, s.number) })),
    stepName: steps.find((s) => s.number === info.here)?.name ?? '',
    progress: place === 'done' ? '끝냈어요' : `${steps.length}단계 중 ${info.passed.length}개 넘김`,
    resident: place === 'done' ? residents(state, units).find((r) => r.unit === unitId) ?? null : null,
  };
}

// 장소 창에서 단계를 고름: 안 끝낸 곳이면 그곳을 지금 곳으로 하고(「여기로 가기」와 같다) 그 단계로 한 판을 열 수 있는지 돌려준다.
// 끝낸 곳·없는 단계·잠긴 단원 정리는 고를 수 없다(false, 기록도 안 바꾼다).
export function chooseStep(state, unitId, templates, step) {
  if (unitInfo(state, unitId, templates).mastered || !stepOpen(state, unitId, templates, step)) return false;
  state.focus[state.study ?? state.grade] = unitId;
  return true;
}

export function gradeChoices(state, units, templates) {
  return studyRange(state.grade).map((grade) => {
    const { done, total } = mapProgress(state, units, templates, grade);
    return { grade, done, total, current: grade === (state.study ?? state.grade) };
  });
}

const currentPlace = (state, units, templates) =>
  currentUnit(state, unitPath(units, templates, state.study ?? state.grade), templates);

export function exploreLine(state, units, templates) {
  const current = currentPlace(state, units, templates);
  return `${current?.title ?? '복습'} · ${deckSize(state.grade)}문제`;
}

export function startSemester(state, units, templates) {
  return currentPlace(state, units, templates)?.semester ?? 2;
}

export function backdropUnit(state, units, templates) {
  const path = unitPath(units, templates, state.study ?? state.grade);
  return currentUnit(state, path, templates) ?? path.at(-1) ?? null;
}

// 판 끝 화면의 장소: 끝낸 곳 → 판정한 곳 → 지금 곳. 골라 풀기는 지금 곳에 그 갈래가 없으면 앞 단원 문제를 가져오는데,
// 그 단원을 보이면 그만둔 판이 엉뚱한 단원으로 간 것처럼 보인다(2026-10-26 Matto 「그만하기 누르니까 엉뚱한 챕터로」).
export function resultUnit(state, units, templates, { mastered = null, evaluated = null } = {}) {
  const id = mastered ?? evaluated;
  return (id && units.find((u) => u.id === id)) || backdropUnit(state, units, templates);
}
