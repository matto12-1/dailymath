// 선생님이 번호 옆에 적는 아이 이름(설계서 5.5). 이 기기(localStorage)에만 남고 서버로 가지 않는다.
// 칸은 반마다 따로: dailymath.teacher.names.<반 id> = { "<번호>": "<이름>" }. 이름은 20자까지, 빈 글이면 지운다.
// 이름은 선생님이 쓴 글이라도 화면에는 글로만 넣는다(Ruling R27).
export const NAME_MAX = 20;
export const namesKey = (classId) => `dailymath.teacher.names.${classId}`;

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
// 빈칸은 한 칸으로, 앞뒤는 떼고, 글자 단위로 20자까지
const clean = (name) => (typeof name === 'string' ? [...name.replace(/\s+/g, ' ').trim()].slice(0, NAME_MAX).join('').trim() : '');
const isNumberKey = (key) => /^[1-9]\d*$/.test(key) && Number.isSafeInteger(Number(key));

// 없거나 깨졌으면 {}. 번호가 아닌 열쇠, 글이 아닌 이름은 버린다.
export function loadNames(storage, classId) {
  let raw = null;
  try { raw = storage?.getItem(namesKey(classId)) ?? null; } catch { return {}; }
  if (raw === null) return {};
  let data;
  try { data = JSON.parse(raw); } catch { return {}; }
  if (!isObject(data)) return {};
  const names = {};
  for (const [key, value] of Object.entries(data)) {
    const name = clean(value);
    if (isNumberKey(key) && name) names[key] = name;
  }
  return names;
}

// ── 로그아웃할 때(결정 4, 2026-10-21) ──
// 이 기기의 이름 칸(반마다 하나) 열쇠를 모두. 저장소를 셀 수 없으면 빈 목록
const NAMES_PREFIX = namesKey('');
function nameKeys(storage) {
  try {
    const keys = [];
    for (let i = 0; i < (storage?.length ?? 0); i++) {
      const key = storage.key(i);
      if (typeof key === 'string' && key.startsWith(NAMES_PREFIX)) keys.push(key);
    }
    return keys;
  } catch {
    return [];
  }
}

// 이 기기에 이름 칸이 하나라도 있나(어느 반이든). 읽을 수 없는 칸도 센다: 이름이 없다고 보고 묻지 않으면
// 로그아웃 뒤에도 그 칸이 이 기기에 남는다(고침 1회 3). 저장소를 셀 수 없으면 false
export const hasNames = (storage) => nameKeys(storage).length > 0;

// 이 쪽이 이 기기에 적은 아이 이름을 모두 지운다(반마다 칸, 깨진 칸도). 서버에는 아무것도 보내지 않는다(이름은 서버에 없다)
export function clearNames(storage) {
  for (const key of nameKeys(storage)) {
    try { storage.removeItem(key); } catch { /* 지우지 못한 칸은 그대로 */ }
  }
}

// 로그아웃: 이 기기에 이름 칸이 있으면(읽을 수 없는 칸도) 먼저 묻는다. ask() → 'clear'(이름도 지우고) · 'keep'(이름은 두고) · 그 밖(취소, 시트를 닫음).
// 이름도 지우면 로그아웃보다 먼저 지운다(로그아웃 부름이 늦거나 막혀도 이름은 남지 않게). 이름 칸이 없으면 묻지 않는다.
// → 'out'(로그아웃했다) · 'cancel'(아무것도 하지 않았다)
export async function logoutAsking({ storage, ask, logout }) {
  if (hasNames(storage)) {
    const choice = await ask();
    if (choice !== 'clear' && choice !== 'keep') return 'cancel';
    if (choice === 'clear') clearNames(storage);
  }
  await logout();
  return 'out';
}

// 한 번호의 이름을 적거나(빈 글이면 지운다) 남긴 이름을 돌려준다. 이름이 하나도 없으면 칸을 지운다.
export function saveName(storage, classId, number, name) {
  const names = loadNames(storage, classId);
  const kept = clean(name);
  if (kept) names[number] = kept;
  else delete names[number];
  try {
    if (Object.keys(names).length) storage?.setItem(namesKey(classId), JSON.stringify(names));
    else storage?.removeItem(namesKey(classId));
  } catch { /* 저장이 막히면 이 창에서만 보인다 */ }
  return kept;
}
