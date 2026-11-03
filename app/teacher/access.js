// 관리자 · 부관리자 보기만 화면과 담임 화면의 차이. DOM 없이 시험한다.
export const CLASS_ACTIONS = ['seat', 'reset', 'clear', 'size', 'toggle', 'new'];

export function classActions(data) {
  return data?.owner ? [] : [...CLASS_ACTIONS];
}

// 서버가 정한 학년·반 차례를 그대로 쓴다. 아이디가 없는 옛 계정을 섞지 않는다.
export function ownerClasses(classes, loginId) {
  if (!loginId || !Array.isArray(classes)) return [];
  return classes.filter((c) => c?.owner?.loginId === loginId);
}

// 부관리자 반 고르기: 내 반을 뺀 모든 반(열면 보기만). 서버 차례 그대로.
export function otherClasses(classes, loginId) {
  if (!loginId || !Array.isArray(classes)) return [];
  return classes.filter((c) => c?.owner?.loginId !== loginId);
}

// 관리자: 내 반 다음에 학교 → 학년 → 반 차례. 같은 학년·반도 담임 아이디로 구별한다.
export function schoolClassItems(classes, row) {
  const sorted = [...classes].sort((a, b) => (a.owner?.school ?? '').localeCompare(b.owner?.school ?? '', 'ko')
    || a.grade - b.grade || a.classNo - b.classNo || (a.owner?.loginId ?? '').localeCompare(b.owner?.loginId ?? ''));
  let school = null;
  return sorted.flatMap(c => {
    const name = c.owner?.school || '학교 이름 없음';
    const heading = name !== school ? [{ heading: name }] : [];
    school = name;
    return [...heading, { ...row(c), detail: c.owner?.loginId ?? '' }];
  });
}

export function classViewHref(classes, loginId, search = '') {
  const list = ownerClasses(classes, loginId);
  const cls = list.find((c) => !c.closed) ?? list[0];
  return cls ? `teacher.html${search}#class=${cls.id}` : null;
}
