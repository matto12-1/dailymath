// 다시 나오기: 틀린 실수마다 1일 → 3일 → 7일 뒤 같은 틀(새 숫자)로 다시 낸다. 맞히면 간격이 늘고, 틀리면 처음으로.
// 약점 수첩(state.mistakes)은 실수 열쇠별 누적 횟수로, 선생님 화면(3권)과 「오늘 추천」이 쓴다.
import { addDays, dayNumber } from './date.js?v=9a67f36b25';

export const INTERVALS = [1, 3, 7];

export const keyOf = (templateId, mistakeId) => `${templateId}#${mistakeId ?? '?'}`;

export function noteMistake(state, { templateId, mistakeId, today }) {
  const key = keyOf(templateId, mistakeId);
  state.mistakes[key] = (state.mistakes[key] ?? 0) + 1;
  state.reviews[key] = { templateId, mistakeId: mistakeId ?? null, step: 0, due: addDays(today, INTERVALS[0]) };
}

export function reviewAnswered(state, key, correct, today) {
  const r = state.reviews[key];
  if (!r) return;
  if (!correct) {
    r.step = 0;
    r.due = addDays(today, INTERVALS[0]);
    return;
  }
  r.step += 1;
  if (r.step >= INTERVALS.length) delete state.reviews[key];
  else r.due = addDays(today, INTERVALS[r.step]);
}

export function dueReviews(state, today) {
  const now = dayNumber(today);
  return Object.entries(state.reviews)
    .filter(([, r]) => dayNumber(r.due) <= now || dayNumber(r.due) > now + INTERVALS.at(-1))
    .map(([key, r]) => ({ key, ...r }))
    .sort((a, b) => dayNumber(a.due) - dayNumber(b.due) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

// 앞 학년 단원이 약하면 그 단원 문제를 조금씩 섞는다. 「약하다」 = 아직 졸업 안 한 실수 중
// 그 단원에 기대는 것(back)의 누적 횟수 합이 min 이상. 단원 id는 g<학년>… 꼴이라 학년을 id에서 읽는다.
export function weakUnits(state, templates, grade, min = 3) {
  const byId = new Map(templates.map((t) => [t.id, t]));
  const hasTemplates = new Set(templates.map((t) => t.unit));
  const unitGrade = (unitId) => Number(/^g(\d)/.exec(unitId)?.[1] ?? 0);
  const score = new Map();
  for (const [key, r] of Object.entries(state.reviews)) {
    const m = byId.get(r.templateId)?.mistakes?.find((x) => x.id === r.mistakeId);
    if (!m?.back) continue;
    score.set(m.back, (score.get(m.back) ?? 0) + (state.mistakes[key] ?? 1));
  }
  return [...score]
    .filter(([u, n]) => n >= min && hasTemplates.has(u) && unitGrade(u) < grade)
    .map(([u]) => u)
    .sort();
}
