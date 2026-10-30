// 관리 화면 증명서 그림 보기(Ruling R29): 그림도 canvas에 그린다. <img src="blob:…">는 폰에서 길게 눌러 저장·공유할 수 있다.
// - createImageBitmap(blob)으로 푼다(사진의 회전 정보까지). 이 꼴을 그 길로 못 푸는 브라우저(옛 Safari 등)만 Image + decode()로
//   한 번 더 푼다: 그 blob 주소는 쪽에 넣지 않는 Image에만 잠깐 쓰고 다 풀면 바로 푼다.
// - 픽셀 상한은 PDF 쪽과 같다(admin/pdf.js PIXEL_BUDGET·MAX_SIDE): 더 큰 그림은 줄여 그린다. 작은 그림은 제 픽셀 그대로.
// - 닫으면 destroy(): 그리기를 멈추고 canvas를 비운다(PDF의 drawPdf와 같은 꼴).
import { PIXEL_BUDGET, MAX_SIDE } from './pdf.js?v=9a67f36b25';

// 그릴 배율(1 이하). 크기를 모르거나 틀리면 0(그리지 않는다).
export function pictureScale(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return 0;
  return Math.min(1, Math.sqrt(PIXEL_BUDGET / (width * height)), MAX_SIDE / width, MAX_SIDE / height);
}

async function decode(blob) {
  if (typeof globalThis.createImageBitmap === 'function') {
    try {
      const bitmap = await globalThis.createImageBitmap(blob, { imageOrientation: 'from-image' });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    } catch {
      // 이 꼴을 createImageBitmap으로 풀지 못한다: Image로 한 번 더
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => {} };
  } finally {
    URL.revokeObjectURL(url); // 다 풀었거나 못 풀었다: 주소는 더 쓰지 않는다
  }
}

// holder에 blob 그림을 canvas 하나로 그린다. label은 canvas 이름(화면 읽개).
// 돌려주는 것: { done: Promise<'ok' | 'bad' | 'stopped'>, destroy() }. 'bad'는 풀지 못한 그림.
export function drawPicture(holder, blob, label) {
  let stopped = false;
  let canvas = null;
  const view = { done: null, destroy };
  view.done = (async () => {
    let picture = null;
    try {
      picture = await decode(blob);
      if (stopped) return 'stopped';
      const scale = pictureScale(picture.width, picture.height);
      if (!scale) return 'bad';
      canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.floor(picture.width * scale));
      canvas.height = Math.max(1, Math.floor(picture.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(picture.source, 0, 0, canvas.width, canvas.height);
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', label);
      holder.append(canvas);
      return 'ok';
    } catch {
      return stopped ? 'stopped' : 'bad';
    } finally {
      picture?.close(); // 풀어 둔 그림은 canvas에 옮겼으니 바로 돌려준다
    }
  })();
  function destroy() {
    stopped = true;
    if (!canvas) return;
    canvas.width = 0; // 그림 메모리를 바로 돌려준다(폰)
    canvas.height = 0;
    canvas.remove();
    canvas = null;
  }
  return view;
}
