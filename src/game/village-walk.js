// Grid coordinates are independent of the DOM. Percent points refer to the
// original background; distances and costs are measured in stage-width units.
export function decodeGrid(data) {
  const cells = new Uint8Array(data.cols * data.rows);
  for (let i = 0; i < cells.length; i++) cells[i] = (parseInt(data.bits[i >> 2], 16) >> (i % 4)) & 1;
  return { ...data, cells };
}
export function gridIndex(g, p) {
  if (p.x < 0 || p.y < 0 || p.x >= 100 || p.y >= 100) return -1;
  return Math.floor(p.y * g.rows / 100) * g.cols + Math.floor(p.x * g.cols / 100);
}
export const canWalk = (g, p) => !!g.cells[gridIndex(g, p)];
export const cellPoint = (g, i) => ({ x: (i % g.cols + .5) * 100 / g.cols, y: (Math.floor(i / g.cols) + .5) * 100 / g.rows });
export const distance = (g, a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * g.aspect);
export function nearestWalkable(g, p) {
  if (canWalk(g, p)) return { x: p.x, y: p.y };
  let best = null, d = Infinity;
  for (let i = 0; i < g.cells.length; i++) if (g.cells[i]) {
    const q = cellPoint(g, i), n = distance(g, p, q);
    if (n < d) { best = q; d = n; }
  }
  return best;
}
export function lineClear(g, a, b) {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(a.x - b.x) * g.cols, Math.abs(a.y - b.y) * g.rows) / 20));
  let prev = gridIndex(g, a);
  for (let k = 0; k <= n; k++) {
    const p = { x: a.x + (b.x - a.x) * k / n, y: a.y + (b.y - a.y) * k / n }, i = gridIndex(g, p);
    if (!g.cells[i]) return false;
    if (prev !== i && prev % g.cols !== i % g.cols && Math.floor(prev / g.cols) !== Math.floor(i / g.cols)) {
      if (!g.cells[Math.floor(prev / g.cols) * g.cols + i % g.cols] || !g.cells[Math.floor(i / g.cols) * g.cols + prev % g.cols]) return false;
    }
    prev = i;
  }
  return true;
}
export function pathLength(g, points) {
  return points.slice(1).reduce((sum, p, i) => sum + distance(g, points[i], p), 0);
}
export function findPath(g, from, to) {
  if (!canWalk(g, from) || !canWalk(g, to)) return null;
  if (lineClear(g, from, to)) return [{ ...from }, { ...to }];
  const start = gridIndex(g, from), end = gridIndex(g, to), scores = new Float64Array(g.cells.length).fill(Infinity);
  const parent = new Int32Array(g.cells.length).fill(-1), closed = new Uint8Array(g.cells.length), heap = [];
  const less = (a, b) => a.f < b.f || (a.f === b.f && a.i < b.i);
  const push = v => { heap.push(v); let i = heap.length - 1; while (i) { const p = (i - 1) >> 1; if (!less(heap[i], heap[p])) break; [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } };
  const pop = () => { const v = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; while (true) { let c = i * 2 + 1; if (c >= heap.length) break; if (c + 1 < heap.length && less(heap[c + 1], heap[c])) c++; if (!less(heap[c], heap[i])) break; [heap[i], heap[c]] = [heap[c], heap[i]]; i = c; } } return v; };
  scores[start] = 0; push({ i: start, f: distance(g, from, to) });
  while (heap.length) {
    const { i } = pop(); if (closed[i]) continue;
    if (i === end) {
      const raw = []; for (let j = end; j !== -1; j = parent[j]) raw.push(cellPoint(g, j));
      raw.reverse(); raw[0] = { ...from }; raw[raw.length - 1] = { ...to };
      const out = [raw[0]]; let at = 0;
      while (at < raw.length - 1) { let next = raw.length - 1; while (next > at + 1 && !lineClear(g, raw[at], raw[next])) next--; out.push(raw[next]); at = next; }
      return out;
    }
    closed[i] = 1;
    const x = i % g.cols, y = Math.floor(i / g.cols);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if ((!dx && !dy) || x + dx < 0 || x + dx >= g.cols || y + dy < 0 || y + dy >= g.rows) continue;
      const j = i + dy * g.cols + dx;
      if (!g.cells[j] || closed[j] || (dx && dy && (!g.cells[i + dx] || !g.cells[i + dy * g.cols]))) continue;
      const score = scores[i] + Math.hypot(dx * 100 / g.cols, dy * 100 / g.rows * g.aspect);
      if (score >= scores[j]) continue;
      scores[j] = score; parent[j] = i; push({ i: j, f: score + distance(g, cellPoint(g, j), cellPoint(g, end)) });
    }
  }
  return null;
}
export function withObstacles(grid, obstacles) {
  const g = { ...grid, cells: grid.cells.slice() };
  for (let i = 0; i < g.cells.length; i++) if (g.cells[i]) {
    const p = cellPoint(g, i),hx=50/g.cols,hy=50/g.rows;
    if (obstacles.some(e => {
      if(e.l!==undefined)return p.x+hx>=e.l&&p.x-hx<=e.r&&p.y+hy>=e.t&&p.y-hy<=e.b;
      const dx=Math.max(0,Math.abs(p.x-e.x)-hx),dy=Math.max(0,Math.abs(p.y-e.y)-hy);
      return (dx/e.rx)**2+(dy/e.ry)**2<=1;
    })) g.cells[i] = 0;
  }
  return g;
}
// Try the closest three neighbours in a caller-chosen order. A blocked work
// anchor is allowed one short step off its own base before the normal route.
export function visitPath(g, from, friend, beside = 5, exitGrid = g) {
  const start = nearestWalkable(g, from);
  const desired = { x: friend.x + (from.x <= friend.x ? -beside : beside), y: friend.y };
  const end = nearestWalkable(g, desired);
  if (!start || !end) return null;
  // A route cannot be shorter than its straight-line distance. Reject the
  // existing six-second limit before A*, rather than searching and discarding.
  const direct = distance(g, from, end);
  if (direct > 30) return null;
  const route = findPath(g, start, end);
  if (!route) return null;
  const points = distance(g, from, start) > .001 ? [{ ...from }, ...route] : route;
  if (!lineClear(exitGrid, points[0], points[1])) return null;
  const length = pathLength(g, points);
  if (!points.slice(2).every((p,i)=>lineClear(g,points[i+1],p))) return null;
  return length <= direct * 2.5 && length <= 30 ? { points, length } : null;
}
