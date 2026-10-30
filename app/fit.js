// 장면을 덮을 수 있으면 덮고, 알맹이는 위·아래 띠와 옆 여백 안에 둔다.
export function fitScene({ W, H, top, bottom, side, imgW, imgH, box }) {
  const ratio = imgH / imgW;
  const bw = (box.x1 - box.x0) / 100, bh = (box.y1 - box.y0) / 100;
  const width = Math.min(Math.max(W, H / ratio), (W - 2 * side) / bw, (H - top - bottom) / (bh * ratio));
  const height = width * ratio;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const offset = (size, screen, low, high) => {
    if (size < screen) return clamp((screen - size) / 2, low, high);
    const coverLow = screen - size;
    const from = Math.max(low, coverLow), to = Math.min(high, 0);
    if (from <= to) return clamp((low + high) / 2, from, to);
    return high < coverLow ? high : low;
  };
  const left = offset(width, W, side - width * box.x0 / 100, W - side - width * box.x1 / 100);
  const y = offset(height, H, top - height * box.y0 / 100, H - bottom - height * box.y1 / 100);
  return { width, height, left, top: y,
    cover: left <= .5 && y <= .5 && left + width >= W - .5 && y + height >= H - .5 };
}

// 장소를 둘레로 당긴다. 덮기·배율 상한을 지키고 실제 장소 점도 돌려준다.
export function focusScene({ W, H, imgW, imgH, point, base, zoom, maxScale, anchor, cover }) {
  const coverScale = Math.max(W / imgW, H / imgH);
  const b = base === 'cover' ? coverScale : W / imgW;
  let scale = Math.min(zoom * b, maxScale);
  if (cover) scale = Math.max(scale, coverScale);
  const width = imgW * scale, height = imgH * scale;
  let left = anchor.x * W - point.x / 100 * width, top = anchor.y * H - point.y / 100 * height;
  if (cover) {
    left = Math.max(W - width, Math.min(0, left));
    top = Math.max(H - height, Math.min(0, top));
  }
  return { scale, width, height, left, top, px: left + point.x / 100 * width, py: top + point.y / 100 * height };
}
