// 날짜는 'YYYY-MM-DD' 글자로 다룬다(기기 시간대). 규칙 함수는 today를 받아서 시험에서 날짜를 정할 수 있다.
const pad = (n) => String(n).padStart(2, '0');

export function todayStr(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function dayNumber(s) {
  const [y, m, d] = s.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

export function validDay(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const n = dayNumber(s);
  return Number.isFinite(n) && new Date(n * 86400000).toISOString().slice(0, 10) === s;
}

export function addDays(s, n) {
  const t = new Date((dayNumber(s) + n) * 86400000);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}
