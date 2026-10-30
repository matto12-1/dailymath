// 관리자 보기만 화면과 담임 화면의 차이. DOM 없이 시험한다.
export const CLASS_ACTIONS = ['seat', 'reset', 'clear', 'size', 'toggle', 'new'];

export function classActions(data) {
  return data?.owner ? [] : [...CLASS_ACTIONS];
}

// 서버가 정한 학년·반 차례를 그대로 쓴다. 아이디가 없는 옛 계정을 섞지 않는다.
export function ownerClasses(classes, loginId) {
  if (!loginId || !Array.isArray(classes)) return [];
  return classes.filter((c) => c?.owner?.loginId === loginId);
}

export function classViewHref(classes, loginId, search = '') {
  const list = ownerClasses(classes, loginId);
  const cls = list.find((c) => !c.closed) ?? list[0];
  return cls ? `teacher.html${search}#class=${cls.id}` : null;
}
