// 씨앗 난수(mulberry32). 같은 씨앗이면 같은 문제가 나온다.
export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min, max) => min + Math.floor(next() * (max - min + 1));
  const pick = (arr) => arr[int(0, arr.length - 1)];
  const shuffle = (arr) => {
    const b = arr.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = int(0, i);
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  };
  return { next, int, pick, shuffle };
}

export function randomSeed() {
  return Math.floor(Math.random() * 2 ** 32);
}
