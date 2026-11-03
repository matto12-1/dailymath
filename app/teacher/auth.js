// 로그인 방식과 따로 두는 기기 로그인 칸. 구글을 꺼도 이 값은 그대로 쓴다.
export const TEACHER_KEY = 'dailymath.teacher';
const isAuth = (v) => v && typeof v === 'object' && !Array.isArray(v) && typeof v.token === 'string' && v.token !== '' && typeof v.email === 'string';
export function loadTeacherAuth(storage) {
  try {
    const value = JSON.parse(storage?.getItem(TEACHER_KEY) ?? 'null');
    return isAuth(value) ? { token: value.token, email: value.email } : null;
  } catch { return null; }
}
export function saveTeacherAuth(storage, { token, email }) {
  try { storage?.setItem(TEACHER_KEY, JSON.stringify({ token, email })); } catch { /* 저장이 막혀도 이 창의 로그인은 유지한다. */ }
}
export function clearTeacherAuth(storage) {
  try { storage?.removeItem(TEACHER_KEY); } catch { /* 메모리의 로그인은 부른 곳에서 지운다. */ }
}
