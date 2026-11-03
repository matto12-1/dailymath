// 색연필 표시: 맞히면 동그라미, 틀리면 빗금(/).
// 결은 화소마다 셈한다: 종이 알갱이(빈틈) × 획 방향 결(진하고 옅은 줄) × 누른 힘(끝은 힘이 빠져 가늘고 옅다).
// 장면마다 펜 끝이 새로 지나간 조각의 화소만 셈해 칠한다. 다 그린 뒤에는 셈하지 않는다.
// 그리는 시간은 웹 애니메이션 하나가 잰다(움직임 줄이기면 만들지 않고 바로 다 그린다).
const TAU = Math.PI * 2;
const N = 256, MASK = N - 1;
let NOISE = null;

function random(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function noiseTable() {
  if (NOISE) return NOISE;
  const r = random(20261017);
  NOISE = new Float32Array(N * N);
  for (let i = 0; i < NOISE.length; i++) NOISE[i] = r();
  return NOISE;
}
// 부드러운 값 잡음(0~1), 256칸마다 되풀이.
function noise(x, y) {
  const t = NOISE;
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const x0 = xi & MASK, x1 = (xi + 1) & MASK, y0 = (yi & MASK) * N, y1 = ((yi + 1) & MASK) * N;
  const a = t[y0 + x0], b = t[y0 + x1], c = t[y1 + x0], d = t[y1 + x1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const smooth = (e0, e1, x) => {
  const t = x <= e0 ? 0 : x >= e1 ? 1 : (x - e0) / (e1 - e0);
  return t * t * (3 - 2 * t);
};

// 진한 곳과 옅은 곳의 물감 색(크림 종이 위에서 #D9483B 둘레로 보이게).
const DEEP = [196, 52, 41], LIGHT = [226, 84, 66];

// 손으로 한 바퀴 돌린 원: 조금 찌그러지고, 시작점을 지나 겹치며 끝이 살짝 삐져나간다.
function circleShape(r) {
  return {
    kind: 'circle',
    start: (-82 + r() * 48) * Math.PI / 180, // 12시 반~2시 쪽에서 시작
    dir: -1, // 화면에서 시계 반대 방향
    tilt: (r() * 16 - 8) * Math.PI / 180,
    squash: .012 + r() * .028, // 가로:세로 1.08배 안
    phase: [r() * TAU, r() * TAU, r() * TAU],
    over: .36 + r() * .2, // 시작점을 지나 더 가는 길이(라디안)
    drift: (r() < .75 ? 1 : -1) * (.03 + r() * .025),
    lead: -.05,
  };
}
function slashShape(r) {
  return { kind: 'slash', angle: (56 + r() * 8) * Math.PI / 180, bow: (r() < .5 ? -1 : 1) * (.012 + r() * .018), length: .9 + r() * .08, lead: -3 };
}

// 원 둘레의 반지름(1 기준). a: 그은 각도(0 = 시작점).
function relAt(s, a, sweep) {
  const th = s.start + s.dir * a - s.tilt;
  const c = Math.cos(th) / (1 + s.squash), d = Math.sin(th) / (1 - s.squash);
  const wob = 1 + .011 * Math.sin(2 * a + s.phase[0]) + .007 * Math.sin(3 * a + s.phase[1]) + .004 * Math.sin(5 * a + s.phase[2]);
  return wob / Math.sqrt(c * c + d * d) + s.drift * smooth(TAU - 1.3, sweep, a) - s.drift * .3 * (1 - smooth(s.lead, 1, a));
}

function prepareCircle(shape, geo, scale) {
  const w = geo.w, hw = w / 2;
  const sweep = TAU + shape.over, lead = shape.lead;
  const S = 1536, step = (sweep - lead) / S;
  const rel = new Float32Array(S + 2), width = new Float32Array(S + 2), press = new Float32Array(S + 2);
  let maxRel = 0;
  for (let i = 0; i <= S + 1; i++) {
    const a = Math.min(sweep, lead + step * i);
    rel[i] = relAt(shape, a, sweep);
    maxRel = Math.max(maxRel, rel[i]);
  }
  const ax = Math.max(1, geo.rx / geo.ry), ay = Math.max(1, geo.ry / geo.rx);
  const R = Math.min((geo.rx - hw) / (maxRel * ax), (geo.ry - hw) / (maxRel * ay));
  for (let i = 0; i <= S + 1; i++) {
    const a = Math.min(sweep, lead + step * i), arc = (a - lead) * R;
    // 내려놓을 때 빨리 굵어지고, 끝에서 힘이 빠지며 가늘어진다.
    width[i] = (.45 + .55 * smooth(lead, lead + .2, a)) * (1 - .55 * smooth(sweep - .5, sweep, a)) * (1 + .14 * (noise(arc * .05 + 3.3, 101.7) - .5));
    press[i] = Math.min(1, (.7 + .3 * smooth(lead, lead + .3, a)) * (1 - .85 * smooth(sweep - .5, sweep, a) ** 1.3) * (.9 + .25 * noise(arc * .018 + 7.1, 33.3)));
  }
  const halfX = R * maxRel * ax + hw * 1.4 + 3, halfY = R * maxRel * ay + hw * 1.4 + 3;
  return { kind: 'circle', shape, geo, scale, R, hw, ax, ay, lead, sweep, step, S, rel, width, press,
    left: geo.cx - halfX, top: geo.cy - halfY, cssW: halfX * 2, cssH: halfY * 2, ox: halfX, oy: halfY,
    keyK: 1 / (hw * R), keyStart: lead - 1e-6, keyEnd: sweep + hw * 1.5 / R + 1e-3 };
}

function prepareSlash(shape, geo, scale) {
  // 빗금은 한 번에 힘 있게 긋고 끝에서 휙 빠진다.
  const w = geo.w * 1.12, hw = w / 2;
  const L = Math.min(geo.rx, geo.ry) * 2 * shape.length;
  const lead = shape.lead, S = 768, step = (L - lead) / S;
  const width = new Float32Array(S + 2), press = new Float32Array(S + 2);
  for (let i = 0; i <= S + 1; i++) {
    const u = Math.min(L, lead + step * i), t = u / L;
    width[i] = (.62 + .38 * smooth(lead, lead + L * .05, u)) * (1 - .45 * smooth(.76, 1, t)) * (1 + .14 * (noise(u * .05 + 3.3, 51.7) - .5));
    press[i] = Math.min(1, (.84 + .16 * smooth(lead, L * .08, u)) * (1 - .8 * smooth(.74, 1, t) ** 1.5) * (.96 + .2 * noise(u * .02 + 7.1, 13.3)));
  }
  const dx = Math.cos(shape.angle), dy = -Math.sin(shape.angle); // 시작점 쪽(위 오른쪽)
  const bow = shape.bow * L;
  const halfX = Math.abs(dx) * L / 2 + Math.abs(bow) + hw * 1.4 + 4, halfY = Math.abs(dy) * L / 2 + Math.abs(bow) + hw * 1.4 + 4;
  return { kind: 'slash', shape, geo, scale, hw, L, bow, lead, step, S, width, press,
    // 시작점(위 오른쪽)에서 끝점(아래 왼쪽)으로: t = (-dx, -dy)
    sx: halfX + dx * L / 2, sy: halfY + dy * L / 2, tx: -dx, ty: -dy,
    left: geo.cx - halfX, top: geo.cy - halfY, cssW: halfX * 2, cssH: halfY * 2,
    keyK: 1 / hw, keyStart: lead - 1e-6, keyEnd: L + hw * 1.5 + 1e-3 };
}

// 한 화소의 색연필 자국: 진하기(0~1)를 돌려준다. arc·d는 CSS 화소, gx·gy는 종이 위 자리(CSS 화소).
function deposit(arc, d, hw, press, gx, gy) {
  const jitter = hw * .24 * (noise(arc * .035 + 5.5, 17.7) - .5); // 손 떨림으로 가운데 줄이 살짝 흔들림
  const dd = d - jitter;
  const edge = hw * (1 + .24 * (noise(arc * .2 + 3.3, 81.7) - .5));
  const x = (dd < 0 ? -dd : dd) / edge;
  if (x >= 1.1) return 0;
  const cross = 1 - smooth(.58, 1.06, x);
  const streak = .68 + .32 * noise(dd * .85 + 50.5, arc * .04 + 9.1); // 획 방향으로 길쭉한 결
  const p = press * cross * streak;
  if (p <= .02) return 0;
  // 종이 알갱이: 높은 곳부터 물감이 묻는다. 세게 누를수록 낮은 곳까지.
  // 펜이 지나가며 골을 건너뛰므로 빈틈은 획 방향으로 조금 길쭉하다.
  const g = .42 * noise(gx * .72 + 13.7, gy * .72 + 71.3) + .2 * noise(gx * 1.45 + 140.1, gy * 1.45 + 9.9)
    + .32 * noise(dd * 1.15 + 200.3, arc * .2 + 31.7) + .06 * NOISE[((gy * 3.1) & MASK) * N + ((gx * 3.1) & MASK)];
  const grain = smooth(.22, .78, g);
  const cover = smooth(1 - p - .1, 1 - p + .1, grain);
  return cover * (.52 + .46 * p);
}

function put(st, x, y, alpha, p) {
  if (alpha < .004) return;
  const img = st.img.data, j = (y * st.cw + x) * 4;
  const old = img[j + 3] / 255;
  const k = p > 1 ? 1 : p;
  let r = LIGHT[0] + (DEEP[0] - LIGHT[0]) * k, g = LIGHT[1] + (DEEP[1] - LIGHT[1]) * k, b = LIGHT[2] + (DEEP[2] - LIGHT[2]) * k;
  if (old > 0) {
    // 겹쳐 그은 곳은 물감이 두 겹이라 더 진하다.
    const dark = 1 - .2 * old;
    r *= dark; g *= dark; b *= dark;
    const out = alpha + old * (1 - alpha), keep = old * (1 - alpha) / out, add = alpha / out;
    img[j] = r * add + img[j] * keep; img[j + 1] = g * add + img[j + 1] * keep; img[j + 2] = b * add + img[j + 2] * keep;
    img[j + 3] = out * 255;
  } else {
    img[j] = r; img[j + 1] = g; img[j + 2] = b; img[j + 3] = alpha * 255;
  }
  if (x < st.dx0) st.dx0 = x; if (x > st.dx1) st.dx1 = x;
  if (y < st.dy0) st.dy0 = y; if (y > st.dy1) st.dy1 = y;
}

// 그은 길이 [k0, k1] 사이에 펜 끝이 지나간 화소만 칠한다.
function renderCircle(st, k0, k1) {
  const { R, hw, scale, lead, sweep, step, rel, width, press, ax, ay } = st;
  const sh = st.shape;
  const extra = hw * 1.5 / R;
  const aLo = Math.max(lead, k0 - extra), aHi = Math.min(sweep, k1);
  if (aHi <= aLo) return;
  let rMin = Infinity, rMax = 0;
  const samples = Math.max(2, Math.ceil((aHi - aLo) / .04));
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const a = aLo + (aHi - aLo) * i / samples, fi = (a - lead) / step, n = Math.min(st.S, fi | 0);
    const rr = R * (rel[n] + (rel[n + 1] - rel[n]) * (fi - n));
    if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
    pts.push(sh.start + sh.dir * a);
  }
  const pad = hw * 1.4 + 1.5;
  rMin = Math.max(0, rMin - pad); rMax += pad;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const th of pts) for (const rr of [rMin, rMax]) {
    const px = Math.cos(th) * rr * ax, py = Math.sin(th) * rr * ay;
    if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
  }
  const bx0 = Math.max(0, Math.floor((st.ox + x0 - 1) * scale)), bx1 = Math.min(st.cw, Math.ceil((st.ox + x1 + 1) * scale));
  const by0 = Math.max(0, Math.floor((st.oy + y0 - 1) * scale)), by1 = Math.min(st.ch, Math.ceil((st.oy + y1 + 1) * scale));
  const in2 = rMin * rMin, out2 = rMax * rMax, inv = 1 / scale, keyK = st.keyK;
  for (let y = by0; y < by1; y++) {
    const gy = (y + .5) * inv, dy = (gy - st.oy) / ay;
    for (let x = bx0; x < bx1; x++) {
      const gx = (x + .5) * inv, dx = (gx - st.ox) / ax;
      const q = dx * dx + dy * dy;
      if (q < in2 || q > out2) continue;
      const rho = Math.sqrt(q);
      let base = sh.dir * (Math.atan2(dy, dx) - sh.start);
      base -= TAU * Math.floor(base / TAU);
      // 같은 자리를 두 번 지나는 곳(시작 머리·겹쳐 지나가는 끝)은 두 겹으로 칠한다.
      for (let lap = -1; lap <= 1; lap++) {
        const a = base + lap * TAU;
        if (a < aLo || a > aHi) continue;
        const fi = (a - lead) / step, n = fi | 0, f = fi - n;
        let d = rho - R * (rel[n] + (rel[n + 1] - rel[n]) * f);
        if (ax !== 1 || ay !== 1) d *= Math.hypot(ax * dx, ay * dy) / rho;
        const w = hw * (width[n] + (width[n + 1] - width[n]) * f);
        if ((d < 0 ? -d : d) > w * 1.25) continue;
        const key = a + d * d * keyK;
        if (key <= k0 || key > k1) continue;
        const p = press[n] + (press[n + 1] - press[n]) * f;
        const v = deposit((a - lead) * R, d, w, p, gx, gy);
        if (v > 0) put(st, x, y, v, p * (.6 + .4 * v));
      }
    }
  }
}

function renderSlash(st, k0, k1) {
  const { hw, scale, lead, step, width, press, L, bow, tx, ty, sx, sy } = st;
  const extra = hw * 1.5;
  const uLo = Math.max(lead, k0 - extra), uHi = Math.min(L, k1);
  if (uHi <= uLo) return;
  const pad = hw * 1.4 + Math.abs(bow) + 2;
  const xa = sx + tx * uLo, ya = sy + ty * uLo, xb = sx + tx * uHi, yb = sy + ty * uHi;
  const bx0 = Math.max(0, Math.floor((Math.min(xa, xb) - pad) * scale)), bx1 = Math.min(st.cw, Math.ceil((Math.max(xa, xb) + pad) * scale));
  const by0 = Math.max(0, Math.floor((Math.min(ya, yb) - pad) * scale)), by1 = Math.min(st.ch, Math.ceil((Math.max(ya, yb) + pad) * scale));
  const inv = 1 / scale, keyK = st.keyK;
  for (let y = by0; y < by1; y++) {
    const gy = (y + .5) * inv, py = gy - sy;
    for (let x = bx0; x < bx1; x++) {
      const gx = (x + .5) * inv, px = gx - sx;
      const u = px * tx + py * ty;
      if (u < uLo || u > uHi) continue;
      const t = u / L, d = (px * -ty + py * tx) - bow * 4 * t * (1 - t);
      const fi = (u - lead) / step, n = Math.min(st.S, fi | 0), f = fi - n;
      const w = hw * (width[n] + (width[n + 1] - width[n]) * f);
      if ((d < 0 ? -d : d) > w * 1.25) continue;
      const key = u + d * d * keyK;
      if (key <= k0 || key > k1) continue;
      const p = press[n] + (press[n + 1] - press[n]) * f;
      const v = deposit(u - lead, d, w, p, gx, gy);
      if (v > 0) put(st, x, y, v, p * (.6 + .4 * v));
    }
  }
}

const EASE = { circle: 'cubic-bezier(.45,.05,.55,.95)', slash: 'cubic-bezier(.3,.1,.3,1)' };

// 작은 칸(판 끝 단계 칸)의 다 그린 표시. 그리기 움직임·크기 따라가기 없이, 같은 꼴(종류·크기·변형·화면 배율)은
// 한 번만 셈해 두고 칸마다 베껴 붙인다. 결·손 모양은 큰 표시와 같은 셈(획만 칸 크기에 맞게 굵게).
const STAMPS = new Map();
export function pencilStamp(kind, { size = 48, variant = 0 } = {}) {
  noiseTable();
  const scale = Math.min(3, Math.max(1, globalThis.devicePixelRatio || 1));
  const key = `${kind}/${size}/${variant}/${scale}`;
  let art = STAMPS.get(key);
  if (!art) {
    const slash = kind === 'slash';
    const shape = (slash ? slashShape : circleShape)(random(20261017 + variant * 7919 + (slash ? 104729 : 0)));
    const w = Math.max(3, size * .085), r = size / 2 - w * .5 - 4;
    const st = (slash ? prepareSlash : prepareCircle)(shape, { cx: size / 2, cy: size / 2, rx: r, ry: r, w }, scale);
    st.cw = Math.ceil(st.cssW * scale); st.ch = Math.ceil(st.cssH * scale);
    const source = document.createElement('canvas');
    source.width = st.cw; source.height = st.ch;
    const g = source.getContext('2d');
    st.img = g.createImageData(st.cw, st.ch);
    st.dx0 = Infinity; st.dy0 = Infinity; st.dx1 = -1; st.dy1 = -1;
    (slash ? renderSlash : renderCircle)(st, st.keyStart, st.keyEnd);
    g.putImageData(st.img, 0, 0);
    art = { source, x: Math.round(st.left * scale), y: Math.round(st.top * scale) };
    STAMPS.set(key, art);
  }
  const canvas = document.createElement('canvas');
  canvas.className = 'pencil-stamp';
  canvas.dataset.mark = kind === 'slash' ? 'slash' : 'circle';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = canvas.height = Math.ceil(size * scale);
  canvas.getContext('2d').drawImage(art.source, art.x, art.y);
  return canvas;
}

// host 안에 표시를 붙인다. layout()은 host 기준 CSS 화소 { cx, cy, rx, ry, w }를 돌려준다(못 재면 null).
export function pencilMark(host, { kind = 'circle', layout, seconds = .65, reduced = false, seed = (Math.random() * 2 ** 32) >>> 0, watch = [] } = {}) {
  noiseTable();
  const shape = (kind === 'slash' ? slashShape : circleShape)(random(seed));
  const canvas = document.createElement('canvas');
  canvas.className = 'pencil-mark';
  canvas.dataset.mark = kind;
  canvas.dataset.ms = String(Math.round(seconds * 1000));
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  const ctx = canvas.getContext('2d');
  let st = null, key = -Infinity, clock = null, done = false;
  const render = kind === 'slash' ? renderSlash : renderCircle;
  const draw = to => {
    if (!st) return;
    if (to < key) { st.img.data.fill(0); ctx.clearRect(0, 0, st.cw, st.ch); key = st.keyStart; }
    if (to <= key) return;
    st.dx0 = Infinity; st.dy0 = Infinity; st.dx1 = -1; st.dy1 = -1;
    render(st, key, to);
    key = to;
    if (st.dx1 >= st.dx0) ctx.putImageData(st.img, 0, 0, st.dx0, st.dy0, st.dx1 - st.dx0 + 1, st.dy1 - st.dy0 + 1);
  };
  const keyAt = t => st.keyStart + (st.keyEnd - st.keyStart) * Math.min(1, Math.max(0, t));
  const place = () => {
    const geo = layout();
    if (!geo || !(geo.rx > geo.w) || !(geo.ry > geo.w)) return false;
    const scale = Math.min(3, Math.max(1, globalThis.devicePixelRatio || 1));
    const sameSize = st && st.scale === scale && Math.abs(st.geo.rx - geo.rx) < .5 && Math.abs(st.geo.ry - geo.ry) < .5 && Math.abs(st.geo.w - geo.w) < .05;
    if (sameSize) {
      if (Math.abs(st.geo.cx - geo.cx) < .5 && Math.abs(st.geo.cy - geo.cy) < .5) return true;
      st.left += geo.cx - st.geo.cx; st.top += geo.cy - st.geo.cy; st.geo = geo;
    } else {
      const upTo = key;
      st = (kind === 'slash' ? prepareSlash : prepareCircle)(shape, geo, scale);
      st.cw = Math.ceil(st.cssW * scale); st.ch = Math.ceil(st.cssH * scale);
      canvas.width = st.cw; canvas.height = st.ch;
      st.img = ctx.createImageData(st.cw, st.ch);
      key = st.keyStart;
      if (upTo > key) draw(Math.min(upTo, st.keyEnd));
    }
    canvas.style.left = st.left + 'px'; canvas.style.top = st.top + 'px';
    canvas.style.width = st.cw / scale + 'px'; canvas.style.height = st.ch / scale + 'px';
    Object.assign(canvas.dataset, { cx: geo.cx.toFixed(1), cy: geo.cy.toFixed(1), rx: geo.rx.toFixed(2), ry: geo.ry.toFixed(2), w: geo.w.toFixed(2) });
    return true;
  };
  const finish = () => {
    if (done) return;
    done = true;
    if (st || place()) draw(st.keyEnd);
    canvas.dataset.state = 'done';
    canvas.dataset.endedAt = String(performance.now());
  };
  canvas.dataset.startedAt = String(performance.now());
  place();
  if (kind === 'circle') Object.assign(canvas.dataset, { start: String(shape.start), dir: String(shape.dir), sweep: String(TAU + shape.over) });
  else Object.assign(canvas.dataset, { angle: String(shape.angle * 180 / Math.PI) });
  if (reduced || seconds <= 0) finish();
  else {
    canvas.dataset.state = 'drawing';
    clock = canvas.animate([{ opacity: 1 }, { opacity: 1 }], { duration: seconds * 1000, easing: EASE[kind] });
    clock.finished.then(finish, finish);
    const tick = () => {
      if (done || !canvas.isConnected) return;
      if (st || place()) {
        const t = clock.effect.getComputedTiming().progress;
        if (t != null) draw(keyAt(t));
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const observer = new ResizeObserver(() => {
    if (!canvas.isConnected) { observer.disconnect(); return; }
    place();
  });
  for (const el of [host, ...watch]) if (el) observer.observe(el);
  return canvas;
}
