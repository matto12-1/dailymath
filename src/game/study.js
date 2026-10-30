// 학습 진도 범위(DECISIONS 10-14 Matto): 아이 학년마다 풀 수 있는 내용 학년. 접속 기록과 반 정보 형식 검사도 여기.
export const STUDY_RANGE = { 1: [1], 2: [1, 2], 3: [2, 3], 4: [3, 4], 5: [3, 4, 5], 6: [4, 5, 6] };

export const studyRange = (grade) => STUDY_RANGE[grade] ?? [grade];

export function setStudy(state, g) {
  if (!studyRange(state.grade).includes(g)) return false;
  state.study = g;
  return true;
}

// 아이 학년만 바꾼다. 마을과 모든 학습 기록은 같은 객체에 남는다.
// 3월 1일 뒤에 스스로 바꿨으면 올해 3월 확인은 한 것으로 센다(한 번 더 물으면 두 학년을 올릴 수 있다).
export function setGrade(state, grade, today = null) {
  if (!Number.isInteger(grade) || grade < 1 || grade > 6) return false;
  state.grade = grade;
  state.study = grade;
  if (typeof today === 'string' && today.slice(5) >= '03-01') state.gradePromptYear = Number(today.slice(0, 4));
  return true;
}

// 3월에 한 번 묻는다. 올해 3월 1일 뒤에 처음 들어온 아이는 들어올 때 고른 학년이 이미 올해 학년이다.
export function promotionDue(state, today) {
  if (state.student) return false;
  const [year, month] = today.split('-').map(Number);
  const joinedThisYear = typeof state.createdAt === 'string' && state.createdAt >= `${year}-03-01`;
  return month === 3 && state.grade < 6 && state.gradePromptYear !== year && !joinedThisYear;
}

// 접속 빈도(선생님 화면 순위, 3권이 보낸다): 앱을 열 때마다 횟수 +1, 그날 처음이면 날 수 +1
export function recordVisit(state, today) {
  const v = state.visits;
  v.count += 1;
  if (!v.lastDay || v.lastDay < today) {
    v.days += 1;
    v.lastDay = today;
  }
}

const inRange = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;

export function checkStudent({ classCode, grade, classNo, number }) {
  const errs = [];
  if (!/^\d{6}$/.test(String(classCode ?? ''))) errs.push('반 코드는 숫자 6개예요. 선생님께 받은 코드를 넣어 주세요.');
  if (!inRange(grade, 1, 6)) errs.push('학년을 골라 주세요.');
  if (!inRange(classNo, 1, 20)) errs.push('반은 1부터 20까지 넣을 수 있어요.');
  if (!inRange(number, 1, 40)) errs.push('번호는 1부터 40까지 넣을 수 있어요.');
  return errs;
}
