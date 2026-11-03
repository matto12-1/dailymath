export const RESIDENT_TARGET_PX = 50;
export const RESIDENT_HEIGHT_RATIO = .063;
export function houseResidentScale({width,height,roomWidth,topHeight}) {
  return width>=height?Math.min(1,Math.min(width,height-topHeight)/roomWidth):1;
}
// Keep standing anchors on the banks beside the bridges without changing the paintings.
export function plazaPoint(kind, art, spot) {
  if (kind === 'cat' && spot === 8) return { x: 61, y: 43 };
  if (kind === 'cat' && spot === 18) return { x: 51, y: 45 };
  if (kind === 'dog' && spot === 12) return { x: 49, y: 39 };
  return art.plaza[spot];
}
export function villageStageSize({ width, height, artWidth, artHeight, residentScale }) {
  const cover = Math.max(width, height * artWidth / artHeight);
  const wanted = RESIDENT_TARGET_PX / (RESIDENT_HEIGHT_RATIO * residentScale) * artWidth / artHeight;
  const w = Math.max(cover, Math.min(artWidth, wanted));
  return { width: w, height: w * artHeight / artWidth };
}
export function landCenter(spots) {
  const xs = spots.slice(0,12).map(p=>p.x), ys = spots.slice(0,12).map(p=>p.y);
  return { x:(Math.min(...xs)+Math.max(...xs))/2, y:(Math.min(...ys)+Math.max(...ys))/2 };
}
