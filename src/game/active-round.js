// 문제 묶음과 이미 낸 답을 함께 저장한다. 틀의 함수는 저장하지 않고 id로 다시 잇는다.
import { parseAnswer } from '../engine/answer.js?v=9a67f36b25';
import { finishSession } from './session.js?v=9a67f36b25';
import { drillsFor, recordDrill } from './drill.js?v=9a67f36b25';
import { validDay } from './date.js?v=9a67f36b25';

// 저장 중 숫자나 글자만 손상되어도 다른 문제로 복원하지 않는다.
const checksum = value => {
  let hash = 2166136261;
  for (const char of JSON.stringify(value)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
};

export function clearRound(state) {
  delete state.activeRound;
  delete state.roundRecord;
}

export function checkpointRound(state, round) {
  const { items, ...meta } = round;
  state.activeRound = { version: 1, ...meta, items: items.map(({ template, ...item }) => ({ ...item, templateId: template.id })) };
  state.activeRound.checksum = checksum(state.activeRound);
  // 문제 묶음이 손상되어도 이미 낸 답은 그만하기와 같은 기준으로 마감할 수 있다.
  state.roundRecord = { id: round.id, date: round.date, mode: round.screen === 'drill' ? 'drill:' + round.args.drillId : round.args.strand ?? 'mix',
    items: items.filter(i => i.result).map(i => ({ template: { id: i.template.id, unit: i.template.unit }, step: i.step, result: { ...i.result },
      ...(i.retry ? { retry: { ...i.retry } } : {}) })) };
}

const validResult = r => r && typeof r.correct === 'boolean' && typeof r.given !== 'undefined'
  && (r.date === undefined || validDay(r.date))
  && Number.isFinite(r.coins) && r.coins >= 0 && Number.isFinite(r.ms) && r.ms >= 0
  && (r.mistakeId === null || typeof r.mistakeId === 'string');
const validRetry = item => item.retry === undefined || (!item.result?.correct && validResult(item.retry)
  && typeof item.retry.gaveUp === 'boolean' && item.retry.gaveUp === (item.retry.given === null));

export function recoverRound(state, templates, today, { finishCompleted = false } = {}) {
  const round = state.activeRound, record = state.roundRecord;
  if (!round && !record) return null;
  const byId = new Map(templates.map(t => [t.id, t]));
  const { checksum: savedChecksum, ...snapshot } = round && typeof round === 'object' ? round : {};
  const items = Array.isArray(round?.items) ? round.items.map(raw => {
    if (!raw || typeof raw !== 'object') return null;
    const { templateId, ...item } = raw;
    return { ...item, template: byId.get(templateId) };
  }) : [];
  const valid = round?.version === 1 && savedChecksum === checksum(snapshot) && validDay(round.date) && typeof round.id === 'string'
    && ['play', 'drill'].includes(round.screen) && round.args && typeof round.args === 'object' && !Array.isArray(round.args)
    && (round.screen === 'drill' ? drillsFor(state, templates).some(d => d.id === round.args.drillId)
      : [null, 'calc', 'estimate', 'shape', 'word', 'life'].includes(round.args.strand)
        && (round.args.step === null || Number.isInteger(round.args.step) && round.args.step >= 1))
    && Number.isInteger(round.index) && round.index >= 0 && round.index < items.length
    && items.every((item, i) => {
      const p = item?.problem;
      return item?.template && p?.templateId === item.template.id && typeof p.prompt === 'string'
        && ['choice', 'number'].includes(p.input) && parseAnswer(p.answerKind, p.answer) !== null
        && Array.isArray(p.mistakes) && (p.input !== 'choice' || Array.isArray(p.choices))
        && typeof item.done === 'boolean' && (item.done ? validResult(item.result) : item.result === null)
        && validRetry(item)
        && (i < round.index ? item.done : i > round.index ? !item.done : true);
    });
  if (valid && items.every(i => i.done) && (finishCompleted || round.date !== today)) {
    const date = items.at(-1).result.date ?? round.date;
    const mode = round.screen === 'drill' ? 'drill:' + round.args.drillId : round.args.strand ?? 'mix';
    const correct = items.filter(i => i.result.correct).length;
    const d = round.screen === 'drill' ? drillsFor(state, templates).find(d => d.id === round.args.drillId) : null;
    const rec = d && !round.args.isRetry && !state.outbox.some(s => s.id === round.id) ? recordDrill(state, d.id, correct) : null;
    const result = finishSession(state, items, { today: date, mode, id: round.id, templates, pick: round.pick });
    clearRound(state);
    if (d) return { screen: 'drillEnd', args: { d, items, correct, rec, summary: result.summary, retry: !!round.args.isRetry } };
    const repeat = round.pick && !result.evaluations.some(e => e.unit === round.pick.unit && e.level === round.pick.step && e.passed);
    return { screen: 'result', args: { ...result, completed: true,
      again: repeat ? { strand: null, step: round.pick.step } : { strand: round.args.strand } } };
  }
  if (valid && round.date === today) return { screen: round.screen, args: { ...round.args, resume: { ...round, items } } };

  // 복원할 수 없으면 진행 도중 그만하기. 단계·훈련 최고 기록은 올리지 않는다.
  const fallback = record ?? (round && { id: round.id, date: round.date,
    mode: round.screen === 'drill' ? 'drill:' + round.args?.drillId : round.args?.strand ?? 'mix', items });
  if (fallback && typeof fallback.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fallback.date)
    && Array.isArray(fallback.items)) {
    const answered = fallback.items.filter(i => i?.template?.id && i.template.unit && validResult(i.result) && validRetry(i));
    finishSession(state, answered, { today: fallback.date, mode: fallback.mode, id: fallback.id, completed: false, templates });
  }
  clearRound(state);
  return null;
}
