// 「오늘 추천」: 아직 졸업 안 한 실수가 가장 많이 쌓인 곳. 드릴 틀의 실수는 그 드릴로 추천한다.
import { drillsFor } from './drill.js?v=9a67f36b25';
import { studyRange } from './study.js?v=9a67f36b25';
import { availableStrands } from './deck.js?v=9a67f36b25';

export function recommend(state, templates, units) {
  const byId = new Map(templates.map((t) => [t.id, t]));
  const allowed = studyRange(state.grade);
  const strands = new Set(availableStrands(state, templates, units));
  const drills = drillsFor(state, templates);
  const score = new Map();
  for (const [key, r] of Object.entries(state.reviews)) {
    const t = byId.get(r.templateId);
    if (!t || !allowed.includes(t.grade)) continue;
    const drill = drills.find((d) => d.templateId === t.id);
    if (!drill && !strands.has(t.strand)) continue;
    const k = drill ? `drill:${drill.id}` : t.strand;
    score.set(k, (score.get(k) ?? 0) + 1);
  }
  let best = null;
  for (const [k, n] of score) if (!best || n > best.n) best = { k, n };
  if (!best) return null;
  return best.k.startsWith('drill:')
    ? { kind: 'drill', drillId: best.k.slice(6), count: best.n }
    : { kind: 'strand', strand: best.k, count: best.n };
}
