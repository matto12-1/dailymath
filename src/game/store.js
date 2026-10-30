// 기기 저장. 사생활 창·저장 칸 꽉 참·막힘이면 메모리로 계속 돌고 persistent가 false가 된다.
import { migrate } from './state.js?v=9a67f36b25';

export const STORE_KEY = 'dailymath.v1';

export function makeStore(storage) {
  let mem = null;
  let persistent = !!storage;
  let revision = null;
  let conflict = false;
  let dirty = false;
  function load() {
    if (!storage) return mem;
    let raw;
    try { raw = storage.getItem(STORE_KEY); } catch { persistent = false; return mem; }
    const savedRevision = revision;
    revision = raw;
    conflict = false;
    if (dirty && mem && raw === savedRevision) return mem;
    if (raw == null) return mem;
    try {
      const s = migrate(JSON.parse(raw));
      if (s) { mem = s; return s; }
    } catch { /* 아래에서 깨진 기록으로 다룬다 */ }
    // 깨진 기록은 버리지 않고 옆에 남긴다(나중에 살릴 수 있게)
    try { storage.setItem(STORE_KEY + '.broken', raw); storage.removeItem(STORE_KEY); revision = null; } catch { /* 남기지 못해도 앱은 계속 */ }
    return mem;
  }
  function save(state) {
    conflict = false;
    if (!storage) { mem = state; return true; }
    try {
      // 이벤트가 아직 도착하지 않았어도 마지막으로 읽은 기록과 다르면 저장을 거절한다.
      if (storage.getItem(STORE_KEY) !== revision) { conflict = true; return false; }
      mem = state;
      const raw = JSON.stringify(state);
      storage.setItem(STORE_KEY, raw);
      revision = raw;
      persistent = true;
      dirty = false;
    } catch { mem = state; persistent = false; dirty = true; }
    return true;
  }
  // 이 기기의 기록을 지운다(다른 사람이에요). 깨진 기록(.broken)은 그대로 둔다.
  // 마지막으로 읽은 기록도 비운다. 그대로 두면 다음 저장이 다른 탭과 겹친 것으로 거절된다.
  function clear() {
    mem = null;
    dirty = false;
    conflict = false;
    if (!storage) return;
    try { storage.removeItem(STORE_KEY); revision = null; } catch { /* 지우지 못해도 앱은 계속 */ }
  }
  return { load, save, clear, get persistent() { return persistent; }, get conflict() { return conflict; } };
}

export function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: (k) => { m.delete(k); } };
}

export function browserStorage() {
  try {
    const s = globalThis.localStorage;
    // 쓰기가 막혀도 이미 있는 아이 기록은 읽을 수 있다.
    s.getItem(STORE_KEY);
    return s;
  } catch {
    return null;
  }
}
