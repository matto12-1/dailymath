import { canon, same, mixedFormMistake } from './answer.js?v=9a67f36b25';

// 숫자판 입력을 다듬는다: 앞뒤 빈칸을 걷고, 숫자만 있으면 수로 바꾼다(앞자리 0 허용).
export function normalizeGiven(given) {
  if (typeof given === 'number') return given;
  const s = String(given).trim();
  return /^\d+$/.test(s) ? Number(s) : s;
}

export function diagnose(problem, given) {
  const kind = problem.answerKind ?? (typeof problem.answer === 'number' ? 'int' : 'text');
  const normalized = canon(kind, given);
  if (normalized === null) return { correct: false, mistakeId: null, invalid: true };
  const g = kind === 'int' ? Number(normalized) : normalized;
  const formMistake = mixedFormMistake(problem, g);
  if (formMistake) return { correct: false, mistakeId: formMistake.id };
  if (same(kind, g, problem.answer, { exactForm: problem.exactForm })) return { correct: true, mistakeId: null };
  const mistakes = problem.mistakes ?? [];
  const m = mistakes.find((x) => same(kind, x.value, g, { exactForm: true }))
    ?? mistakes.find((x) => same(kind, x.value, g));
  return { correct: false, mistakeId: m ? m.id : null };
}
