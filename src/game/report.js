// 선생님 화면 요약(설계서 4.8): 아이 기기가 문제 틀·단원 표로 만들어 기록과 같이 보낸다. 서버는 받아 두기만 한다.
// { v, grade, study, kind, here, mastered, mistakes: [{ key, name, count }], strands: { [id]: { correct, total } }, sessions }
// 최근 날짜·접속 날 수·횟수·점수는 서버가 기록에서 바로 꺼낸다(kids 칸).
import { unitPath, currentUnit, unitInfo, stepsOf } from './units.js?v=9a67f36b25';

export const REPORT_MISTAKES = 10; // 자주 하는 실수 몇 개
const NAME_MAX = 40; // 실수 이름 글자 수(요약이 서버 한도 16KB를 넘지 않게)
const KEY_MAX = 120; // 이보다 긴 실수 열쇠는 앱이 만든 것이 아니다
const STRAND_RECENT = 10; // 갈래별 최근 문제 수(progress.js와 같다)

const clip = (text) => [...text].slice(0, NAME_MAX).join('');

// 실수 이름: 그 실수가 났을 때 남긴 이름 → 틀의 고정 이름(빈칸 {…} 없는 글) → 「<단원 이름> 실수」
export function mistakeName(state, key, { templates, units }) {
  const saved = state.mistakeNames?.[key];
  if (typeof saved === 'string' && saved.trim()) return clip(saved);
  const cut = key.indexOf('#');
  const templateId = cut < 0 ? key : key.slice(0, cut);
  const mistakeId = cut < 0 ? null : key.slice(cut + 1);
  const template = templates.find((t) => t.id === templateId);
  const label = template?.mistakes?.find((m) => m.id === mistakeId)?.label;
  if (typeof label === 'string' && label && !label.includes('{')) return clip(label);
  const unit = template && units.find((u) => u.id === template.unit);
  return unit ? clip(`${unit.title} 실수`) : '그 밖의 실수';
}

// 지금 곳: 홈 지도 「지금 여기예요」와 같은 계산(home.js·map.js placeInfo)
function hereOf(state, { templates, units }) {
  const unit = currentUnit(state, unitPath(units, templates, state.study ?? state.grade), templates);
  if (!unit) return null;
  const step = unitInfo(state, unit.id, templates).here;
  return { unit: unit.id, unitName: unit.title, step, stepName: stepsOf(templates, unit.id).find((s) => s.number === step)?.name ?? '' };
}

export function buildReport(state, { units, templates }) {
  const mistakes = Object.entries(state.mistakes ?? {})
    .filter(([key, count]) => key.length <= KEY_MAX && Number.isFinite(count) && count > 0)
    .sort(([a, x], [b, y]) => y - x || (a < b ? -1 : a > b ? 1 : 0))
    .slice(0, REPORT_MISTAKES)
    .map(([key, count]) => ({ key, name: mistakeName(state, key, { templates, units }), count }));
  const strands = Object.fromEntries(Object.entries(state.strands ?? {})
    .filter(([, answers]) => Array.isArray(answers))
    .map(([id, answers]) => {
      const recent = answers.slice(-STRAND_RECENT);
      return [id, { correct: recent.filter((c) => c === true).length, total: recent.length }];
    }));
  return {
    v: 1,
    grade: state.grade,
    study: state.study ?? state.grade,
    kind: state.town.kind,
    here: hereOf(state, { templates, units }),
    mastered: Object.values(state.units ?? {}).filter((u) => u?.mastered).length, // 탐험 일지 「익힌 곳」과 같다
    mistakes,
    strands,
    sessions: state.sessions,
  };
}
