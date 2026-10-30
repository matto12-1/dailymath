// app.css 카드 그림 칸의 최소 표시 폭에서 글자를 14px 이상으로 만든다.
export const CARD_ART_MIN_WIDTH = 220;
export const labelSize = (viewBoxWidth, minimum = 14) => Math.max(minimum, Math.ceil(14 * viewBoxWidth / CARD_ART_MIN_WIDTH));
