// 답·돈·다시 나오기는 즉시 남긴다. 단계 판정은 완주한 판의 끝에서만 한다.
import { diagnose } from '../engine/diagnose.js?v=9a67f36b25';
import { recordAnswer, judgeRound } from './progress.js?v=9a67f36b25';
import { levelForTemplate, stepsOf } from './units.js?v=9a67f36b25';
import { noteMistake, reviewAnswered, keyOf, dueReviews } from './review.js?v=9a67f36b25';
import { coinsFor, RETRY_COINS } from './rewards.js?v=9a67f36b25';
import { DAYS_KEEP } from './state.js?v=9a67f36b25';
import { noteChests } from './chest.js?v=9a67f36b25';

export const OUTBOX_MAX = 200; // 최근 판 보관 수. 아직 안 보낸 판은 이 수를 넘어도 지우지 않는다.
// 그래도 끝은 있다: 연결이 풀린 채 오래 쓰면 못 보낸 판이 기기 저장 칸(약 5MB)을 채워 기록 저장이 멈춘다. 판 하나 1KB 아래라 1000개면 1MB 안.
export const OUTBOX_HARD_MAX = 1000;

export function answerProblem(state, item, given, { ms, today, templates, drill = false }) {
  if (item.done) return null;
  item.done = true;
  const t = item.template;
  const { correct, mistakeId } = diagnose(item.problem, given);
  const easy = !!state.units[t.unit]?.mastered; // 이 답으로 익힘이 되는 문제는 아직 easy가 아니다
  item.drill = drill;
  // 한 판 동안 단계는 고정된다. 예전 단계의 다시 나오기는 세지 않는다.
  if (!Object.hasOwn(item,'step')) item.step=levelForTemplate(state,t,templates);
  const historyLevel=item.step ?? stepsOf(templates,t.unit).find(s=>s.templates.includes(t.id))?.number ?? t.level;
  const events = drill ? [] : recordAnswer(state, { unit: t.unit, level: historyLevel, strand: t.strand, correct });
  if (correct) {
    for (const r of dueReviews(state, today).filter(r => r.templateId === t.id)) reviewAnswered(state, r.key, true, today);
  } else if (item.reviewKey) reviewAnswered(state, item.reviewKey, false, today);
  if (!correct) noteMistake(state, { templateId: t.id, mistakeId, today });
  const coins = coinsFor({ correct, strand: t.strand, speedBonus: item.problem.speedBonus, ms, grade: state.grade, easy, drill });
  if (correct) state.score += 1; // 선생님 화면 점수: 맞힌 문제마다 1점(드릴 포함)
  state.coins += coins;
  item.result = { given, correct, mistakeId, coins, ms, date: today };
  const mistake = mistakeId ? item.problem.mistakes.find((m) => m.id === mistakeId) ?? null : null;
  // 선생님 화면 실수 이름: 그 문제에 나온 이름(숫자를 채운 label)을 남긴다(설계서 4.8)
  if (!correct && typeof mistake?.label === 'string' && mistake.label) {
    (state.mistakeNames ??= {})[keyOf(t.id, mistakeId)] = mistake.label;
  }
  return { correct, mistake, coins, events };
}

// 두 번째 답은 첫 답의 판정·점수·다시 나오기를 바꾸지 않는다.
// 드릴 문제는 훈련 끝 「틀린 문제 다시 풀기」(drill: true)에서만 받는다. 그 판도 드릴이라 단원 진도에 안 들어간다(10-16).
export function retryProblem(state, item, given, { ms, drill = false }) {
  if (!item.done || !item.result || item.result.correct || item.retry || (item.drill && !drill)) return null;
  const gaveUp = given === null;
  const { correct, mistakeId } = gaveUp ? { correct: false, mistakeId: null } : diagnose(item.problem, given);
  const coins = correct ? RETRY_COINS : 0;
  item.retry = { given, correct, mistakeId, coins, gaveUp, ms };
  state.coins += coins;
  const mistake = mistakeId ? item.problem.mistakes.find(m => m.id === mistakeId) ?? null : null;
  return { correct, mistake, coins };
}

// pick = 장소 창에서 고른 { unit, step }(없으면 null: 「지금 여기예요」 단계 판). 판정은 그 단계로 한다.
export function finishSession(state, items, { today, mode, id, templates = items.map(i=>i.template), completed = items.length>0 && items.every(i=>i.result), pick = null }) {
  const answered = items.filter((i) => i.result);
  const existing = state.outbox.find(s => s.id === id);
  const mistakes = {};
  for (const i of answered) {
    if (i.result.correct) continue;
    const k = keyOf(i.template.id, i.result.mistakeId);
    mistakes[k] = (mistakes[k] ?? 0) + 1;
  }
  const summary = {
    id, date: today, mode, grade: state.grade,
    count: answered.length,
    correct: answered.filter((i) => i.result.correct).length,
    coins: answered.reduce((a, i) => a + i.result.coins + (i.retry?.coins ?? 0), 0),
    units: [...new Set(answered.map((i) => i.template.unit))],
    mistakes,
  };
  let events=[], evaluations=[];
  if (answered.length && !state.outbox.some((s) => s.id === id)) {
    if (completed && items.every(i=>i.result) && !mode?.startsWith('drill')) {
      ({events,evaluations}=judgeRound(state,items,{today,templates,pick}));
      noteChests(state,events);
    }
    summary.evaluations=evaluations;
    state.outbox.push(summary);
    let remove = state.outbox.length - OUTBOX_MAX;
    if (remove > 0) state.outbox = state.outbox.filter(round => !(remove > 0 && round.sent && remove--));
    if (state.outbox.length > OUTBOX_HARD_MAX) state.outbox.splice(0, state.outbox.length - OUTBOX_HARD_MAX);
    state.sessions += 1;
    for (const item of answered) {
      const day = item.result.date ?? today;
      state.days[day] = (state.days[day] ?? 0) + 1;
    }
    const days = Object.keys(state.days).sort();
    for (const day of days.slice(0, -DAYS_KEEP)) delete state.days[day];
  }
  // 원자료는 첫 답 그대로 남긴다. 결과 화면에서 실제 다시 나올 틀끼리 묶어 보여 준다.
  const retry = answered.filter(i => !i.result.correct).map(i => i.problem);
  return { summary: existing ?? summary, events, evaluations: existing?.evaluations ?? evaluations, retry };
}
