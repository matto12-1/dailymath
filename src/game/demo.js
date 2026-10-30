// 시연·네 폭 사진용 견본 상태(app/index.html?demo=3). 저장하지 않는다.
import { newState } from './state.js?v=9a67f36b25';
import { unitPath, levelsOf } from './units.js?v=9a67f36b25';
import { noteMistake } from './review.js?v=9a67f36b25';
import { addDays } from './date.js?v=9a67f36b25';
import { build, shopsFor, shopLevel, MAX_LEVEL } from './shops.js?v=9a67f36b25';
import { recordDemoArrivals } from './village-demo-data.js?v=9a67f36b25';
import { drillsFor } from './drill.js?v=9a67f36b25';

// Keep the regular progress state while the sample round demonstrates all new inputs.
export function demoDeck(deck, { grade, study = grade, templates, strand = null }) {
  if (grade !== 3 || study !== 3 || strand) return deck;
  const ids = ['g3.fracdec.tenths', 'g3.fracdec.part', 'g3.fractions.mixed', 'g3.div2.remainder', 'g3.plane.triangle'];
  const examples = ids.flatMap(id => { const template = templates.find(t => t.id === id); return template ? [{ template, reason: 'demo' }] : []; });
  return [...examples, ...deck].slice(0, deck.length);
}

export function demoState(grade, today, templates, units, progress = null) {
  const s = newState({ kind: 'cat', grade, today, student: { classCode: '123456', classNo: 2, number: 12 } });
  if (progress === 'new') return s;
  const path = unitPath(units, templates, grade);
  if (path.length >= 2) {
    s.units[path[0].id] = { passed: levelsOf(templates, path[0].id), history: [], mastered: addDays(today, -2) };
    // 이전 학년에 익힌 단원도 넣어 그림 확인 때 주민 여섯 마리가 보이게 한다.
    for (const u of units.filter((u) => u.grade < grade).slice(-4)) {
      s.units[u.id] = { passed: levelsOf(templates, u.id), history: [], mastered: addDays(today, -3) };
    }
  }
  const t = templates.find((x) => x.grade === grade && x.mistakes?.length);
  if (t) noteMistake(s, { templateId: t.id, mistakeId: t.mistakes[0].id, today: addDays(today, -1) });
  s.coins = 1000;
  build(s, 'bakery');
  s.coins = 260;
  s.score = 42;
  s.visits = { count: 9, days: 6, lastDay: addDays(today, -1) };
  if (progress === 'mid' || progress === 'chest' || progress === 'done') {
    const extra = progress === 'done' ? path : path.slice(1, 4);
    extra.forEach((u, i) => {
      s.units[u.id] = { passed: levelsOf(templates, u.id), history: [], mastered: addDays(today, -4 - i) };
    });
    if (progress !== 'done') for (const index of [5, 7]) {
      const u = path[index];
      if (!u) continue;
      const level = levelsOf(templates, u.id)[0];
      s.units[u.id] = { passed: [], history: [{ level, correct: false }], mastered: null };
    }
  }
  if (progress === 'chest') {
    s.chests = path.filter(u => s.units[u.id]?.mastered).slice(-2).map(u => u.id);
    for (let i = 0; i < 60; i++) if (i % 4 !== 3) s.days[addDays(today, -i)] = 6 + (i % 5) * 3;
    drillsFor(s, templates).slice(0, 2).forEach((drill, i) => { s.drills[drill.id] = { runs: i ? 1 : 3, best: i ? 14 : 18 }; });
  }
  if (progress === 'all') {
    s.units = Object.fromEntries(units.map((u, i) => [u.id, {
      passed: levelsOf(templates, u.id), history: [], mastered: addDays(today, -i),
    }]));
    s.coins = 20000;
    for (const shop of shopsFor(s.town.kind)) for (let i = shopLevel(s, shop.id); i < MAX_LEVEL; i++) build(s, shop.id);
    s.coins = 2000;
  }
  recordDemoArrivals(s);
  return s;
}
