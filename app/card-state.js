import { stepsOf } from '../src/game/units.js?v=9a67f36b25';

// 화면과 저장 복원이 같은 첫 답·두 번째 답 상태를 쓴다.
export function cardPhase(item, mode = 'play') {
  if (!item.result) return 'answering';
  if (item.result.correct || item.retry?.correct) return 'solved';
  return mode === 'drill' || item.retry ? 'revealed' : 'retrying';
}

export const solutionLines = solution => solution ? solution.split('\n') : [];

// 카드 이름표(검수 P-016·P-017, 10-20 Matto 「단계 이름 + 복습 꼬리표」).
// 이 판이 판정하는 단계(stage)의 문제는 단계 이름, 복습으로 끼운 문제는 까닭, 그 밖(견본·집중 훈련)은 학년·학기·단원.
const REASON_TAGS = { review: '다시 보기 · 전에 틀린 문제', keep: '복습 · 끝낸 곳', weak: '복습 · 기초 다지기' };
export function cardTag(item, { units = [], templates = [], stage = null } = {}) {
  const unitId = item.template?.unit;
  const step = stage && unitId === stage.unit && item.step === stage.step ? stepsOf(templates, unitId).find(s => s.number === stage.step) : null;
  if (step) return `${step.number}단계 · ${step.name}`;
  if (REASON_TAGS[item.reason]) return REASON_TAGS[item.reason];
  const unit = units.find(u => u.id === unitId);
  return unit ? `${unit.grade}학년 ${unit.semester}학기 · ${unit.title}` : null;
}

// 이 판이 판정하는 단계: 장소 창에서 고른 단계, 아니면 판의 단원 문제가 든 단계(「지금 여기예요」).
// 단원 문제가 여러 단계에 흩어진 판(지금 단계에 문제가 없을 때 채운 판)은 단계를 하나로 못 정해 이름표를 단원으로 둔다.
export function roundStage(items, pick = null) {
  if (pick) return pick;
  const main = items.filter(it => it.reason === 'unit' && it.step != null), first = main[0];
  return first && main.every(it => it.template.unit === first.template.unit && it.step === first.step) ? { unit: first.template.unit, step: first.step } : null;
}
