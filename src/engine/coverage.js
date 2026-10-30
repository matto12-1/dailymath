// 채움 시험의 실수 연결 범위와 답 변화 검사. 아직 채우지 않은 단원 수 검사와 별개로 모든 틀에 쓴다.
import { studyRange } from '../game/study.js?v=9a67f36b25';
import { generate } from './template.js?v=9a67f36b25';
import { makeRng } from './rng.js?v=9a67f36b25';
import { same } from './answer.js?v=9a67f36b25';

export function checkBacks(t, units) {
  const errors = [];
  for (const m of t.mistakes ?? []) {
    if (m.back === undefined) continue;
    const unit = units.find((u) => u.id === m.back);
    if (!unit || unit.grade >= t.grade || !studyRange(t.grade).includes(unit.grade)) {
      errors.push(`${t.id}: 실수 ${m.id}의 back ${m.back}은 진도 범위 안의 앞 학년 단원이어야 해요.`);
    }
  }
  return errors;
}

export function checkAnswerVariation(t, { runs = 500, seed = 1 } = {}) {
  const errors = [];
  if (t.fixedAnswerOk !== undefined) errors.push(`${t.id}: fixedAnswerOk 예외 표시는 허용하지 않아요.`);
  const rng = makeRng(seed);
  let first, varied = false;
  for (let i = 0; i < runs; i++) {
    const p = generate(t, rng);
    if (i === 0) first = p;
    else if (first.answerKind !== p.answerKind || !same(p.answerKind, first.answer, p.answer)) varied = true;
  }
  if (!varied) errors.push(`${t.id}: 답 고정, ${runs}번 만든 정답 값이 한 가지뿐이에요.`);
  return errors;
}
