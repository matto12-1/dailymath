// 화면 좌표의 그림 상자 목록과 점만 받는다. 같은 깊이는 나중에 그린 것이 앞이다.
export function pickVillageTarget(targets, point, { decorate = false } = {}) {
  let chosen = null, nearest = Infinity;
  for (const target of targets) {
    if (decorate && target.type === 'resident' || !decorate && target.type === 'empty') continue;
    const dx = Math.max(target.left - point.x, 0, point.x - target.right);
    const dy = Math.max(target.top - point.y, 0, point.y - target.bottom);
    const distance = Math.hypot(dx, dy);
    if (distance > 24) continue;
    const inFront = !chosen || target.depth > chosen.depth ||
      target.depth === chosen.depth && target.order > chosen.order;
    if (distance < nearest || distance === nearest && inFront) {
      chosen = target; nearest = distance;
    }
  }
  return chosen;
}
