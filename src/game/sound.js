// 기기 소리 설정은 아이 기록과 따로 저장한다. 소리는 녹음 파일을 미리 받아 두었다가 Web Audio로 낸다.
export const SOUND_KEY = 'dailymath.sound';
export const VOLUME = .8;
export const MAX_RATE = 2.2;

// 표시를 그리는 시간(초). 맞힘 소리 = 동그라미 긋는 소리, 틀림 소리 = 빗금 긋는 소리라 같이 시작해 같이 끝난다.
// 소리 길이는 받아 둔 파일에서 읽는다(파일이 바뀌어도 코드에 길이를 박지 않는다). 모르면 fallback.
export const MARK_TIME = {
  correct: { min: .6, max: .7, fallback: .65, quick: .3 },
  wrong: { min: .25, max: .35, fallback: .3, quick: .2 },
};
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// quick(집중 훈련)은 짧게 그리고, 소리는 그 길이에 맞게 빨리 낸다(1~2.2배).
export function markTiming(kind, soundSeconds, { quick = false } = {}) {
  const t = MARK_TIME[kind];
  const known = Number.isFinite(soundSeconds) && soundSeconds > 0;
  if (!quick) return { seconds: known ? clamp(soundSeconds, t.min, t.max) : t.fallback, rate: 1 };
  const seconds = known ? Math.min(t.quick, soundSeconds) : t.quick;
  return { seconds, rate: known ? clamp(soundSeconds / seconds, 1, MAX_RATE) : 1 };
}

const defaultContext = () => {
  const Audio = globalThis.AudioContext ?? globalThis.webkitAudioContext;
  return Audio ? new Audio() : null;
};
// 옛 사파리는 decodeAudioData가 약속(Promise)을 돌려주지 않는다.
const decode = (context, data) => new Promise((resolve, reject) => { context.decodeAudioData(data, resolve, reject)?.catch?.(reject); });

// files: { 이름: 파일 | null } — null이면 그 소리는 내지 않고 받지도 않는다. load(파일)은 ArrayBuffer를 돌려준다.
export function makeSound({ storage = null, files = {}, load = null, createContext = defaultContext } = {}) {
  let enabled = true, context = null;
  const buffers = {}, loading = {}, active = new Set();
  try { enabled = storage?.getItem(SOUND_KEY) !== 'off'; } catch { /* 저장이 막힌 기기는 이번 창에서 기억한다. */ }
  const device = () => {
    if (!context) { try { context = createContext(); } catch { context = null; } }
    return context && context.state !== 'closed' ? context : null;
  };
  // 켜져 있으면 장치를 열고 파일을 받아 둔다(작다). 꺼져 있으면 아무것도 만들지 않는다.
  function prepare() {
    if (!enabled) return;
    const ctx = device();
    if (!ctx || !load) return;
    for (const [kind, file] of Object.entries(files)) {
      if (!file || buffers[kind] || loading[kind]) continue;
      loading[kind] = Promise.resolve().then(() => load(file)).then(data => decode(ctx, data))
        .then(buffer => { buffers[kind] = buffer; }, () => { /* 못 받은 소리는 이번 창에서 내지 않는다(다시 찾지 않음) */ });
    }
  }
  // 아이패드 사파리는 누른 동작 안에서만 소리를 깨울 수 있다.
  function wake() {
    if (enabled && context?.state === 'suspended') context.resume().catch(() => {});
  }
  const duration = kind => (enabled && files[kind] && buffers[kind] ? buffers[kind].duration : null);
  // 낸 소리의 길이(초)를 돌려준다. 못 내면 0.
  function play(kind, { rate = 1 } = {}) {
    if (!enabled || !files[kind]) return 0;
    const ctx = device();
    if (!ctx) return 0;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const buffer = buffers[kind];
    if (!buffer) { prepare(); return 0; }
    const source = ctx.createBufferSource(), gain = ctx.createGain();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    gain.gain.value = VOLUME;
    source.connect(gain); gain.connect(ctx.destination);
    active.add(source);
    source.onended = () => { active.delete(source); source.disconnect(); gain.disconnect(); };
    source.start();
    return buffer.duration / rate;
  }
  const setEnabled = value => {
    enabled = !!value;
    if (!enabled) {
      for (const source of active) { try { source.stop(); } catch { /* 이미 끝난 소리 */ } }
      active.clear();
    }
    try { storage?.setItem(SOUND_KEY, enabled ? 'on' : 'off'); } catch { /* 위와 같은 메모리 설정. */ }
    prepare();
  };
  return { get enabled() { return enabled; }, setEnabled, prepare, wake, duration, play };
}
