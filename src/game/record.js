// 탐험 일지의 수와 달력. 화면과 시간대에 기대지 않고 today를 받는다.
import { residents } from './village.js?v=9a67f36b25';
import { mapProgress } from './map.js?v=9a67f36b25';
import { studyRange } from './study.js?v=9a67f36b25';
import { DRILLS } from './drill.js?v=9a67f36b25';

export function recordTop(state, units) {
  return { score: state.score, places: Object.values(state.units).filter(u => u.mastered).length,
    residents: residents(state, units).length };
}

export function monthGrid(state, year, month, today) {
  const pad = n => String(n).padStart(2, '0');
  const key = (y, m) => `${y}-${pad(m)}`;
  const current = key(year, month), todayMonth = today.slice(0, 7);
  const earliest = [state.createdAt, ...Object.keys(state.days ?? {})].filter(Boolean).map(d => d.slice(0, 7)).sort()[0] ?? todayMonth;
  const monthAt = delta => {
    const d = new Date(Date.UTC(year, month - 1 + delta, 1));
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
  };
  const offset = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = Array(offset).fill(null);
  for (let day = 1; day <= length; day++) {
    const date = `${current}-${pad(day)}`, future = date > today;
    const count = future ? 0 : state.days?.[date] ?? 0;
    cells.push({ date, day, count, stamp: count >= 1, today: date === today, future });
  }
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  return { title: `${year}년 ${month}월`, weeks,
    prev: current > earliest ? monthAt(-1) : null, next: current < todayMonth ? monthAt(1) : null };
}

export function placeLines(state, units, templates) {
  const study = state.study ?? state.grade;
  const grades = [study, ...studyRange(state.grade).filter(g => g !== study).sort((a, b) => b - a)];
  return grades.flatMap(grade => {
    const progress = mapProgress(state, units, templates, grade);
    return [1, 2].flatMap(semester => {
      const { done, total } = progress[`s${semester}`];
      return total && (grade === study || done >= 1) ? [{ grade, semester, label: `${grade}학년 ${semester}학기`, done, total }] : [];
    });
  });
}

export function drillLines(state) {
  return DRILLS.flatMap(({ id, grade, label }) => {
    const record = state.drills[id];
    return record?.runs >= 1 ? [{ id, grade, label, runs: record.runs, best: record.best }] : [];
  });
}
