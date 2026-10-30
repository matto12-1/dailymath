// 관리 화면 증명서 PDF 보기(Ruling R33): 모든 기기에서 같은 길. pdf.js(app/vendor/pdfjs, 고정한 판·VERSION)는
// PDF 증명서를 처음 열 때 import()로 불러오고, worker도 같은 폴더의 것을 쓴다.
// - getDocument({ data, isEvalSupported: false, enableXfa: false, … }): 코드를 만들어 돌리지 않고(eval) XFA 양식은 그리지 않는다.
//   흑백 스캔(CCITT·JBIG2)·JPEG2000 그림은 wasm 풀개로, 글꼴을 넣지 않은 한글 PDF는 한국어 CMap으로 읽는다(vendor/pdfjs/wasm·cmaps).
// - 쪽은 canvas에만 그린다. 글 층·주석 층은 만들지 않는다(PDF가 쪽 위에 누를 수 있는 링크를 두지 못하게). 내려받기 길도 없다.
// - 보기 칸 너비 × devicePixelRatio로 그리되 앞 MAX_PAGES쪽까지, 모든 쪽의 기기 픽셀 합은 PIXEL_BUDGET까지(폰 메모리),
//   canvas 한 변은 MAX_SIDE까지.
// - 못 그린 까닭(pdfTrouble): 파일 탓은 InvalidPDFException(PDF가 아니다)과 PasswordException(비밀번호)뿐. 그 밖은 다시 해 볼 일:
//   pdf.js·worker를 받지 못했거나 기기가 오프라인이면 'offline'(끊김 글), 나머지(worker가 죽음·그리다 난 오류)는 'halted'(멈춤 글).
//   'offline'이면 다음에는 pdf.js를 새 주소로 새로 받는다(libraryLoader. 보기 창을 닫은 뒤에 끝난 받기 실패도).
//   'halted'는 받아 둔 사본으로 다시 그린다([다시]마다 1.8MB를 새로 받아 사본을 쌓지 않게. 문서마다 worker는 새로 뜬다).
// - 닫으면 destroy(): 그리기를 멈추고 문서·worker를 끝내고 canvas를 비운다.
export const MAX_PAGES = 5;
export const PIXEL_BUDGET = 16_000_000; // 기기 픽셀(4바이트씩이면 64MB쯤)
export const MAX_SIDE = 8192;

const VENDOR = new URL('../vendor/pdfjs-7c40ca8b91/', import.meta.url);
export const PDF_OPTIONS = Object.freeze({
  isEvalSupported: false,
  enableXfa: false,
  // maxImageSize(쪽 안 그림 크기 상한)는 일부러 두지 않는다(pdf.js 기본: 상한 없음). 상한을 넘은 그림을 pdf.js는 알림 없이 빼고
  // 그려서 600dpi A4 스캔 증명서가 모든 기기에서 빈 쪽으로 보이고, 관리자가 맞는 증명서를 거절할 수 있다. 상한이 없으면 메모리가
  // 되는 기기에서는 보인다. 그림을 풀다 실패하면(메모리 부족 등) pdf.js는 경고만 남기고 그 그림을 빼므로(「Unable to decode image」,
  // ignoreErrors와 상관없다) 그때도 알림은 없다. canvas 픽셀 상한(PIXEL_BUDGET·MAX_SIDE)만 둔다.
  wasmUrl: new URL('wasm/', VENDOR).href,
  cMapUrl: new URL('cmaps/', VENDOR).href,
  cMapPacked: true,
});

// 보여 줄 쪽 수
export const shownPages = (total) => (Number.isFinite(total) && total > 0 ? Math.min(Math.floor(total), MAX_PAGES) : 0);

// 쪽마다 그릴 배율. sizes: scale 1 viewport의 { width, height }, width: 보일 너비(CSS px), ratio: devicePixelRatio.
// 칸 너비에 맞춘 배율 × ratio를 바라되, 쪽마다 예산을 똑같이 나눠 그 픽셀 수를 넘지 않고 한 변이 MAX_SIDE를 넘지 않게 줄인다.
export function pageScales(sizes, width, ratio) {
  const pages = sizes.slice(0, MAX_PAGES);
  const fit = Number.isFinite(width) && width > 0 ? width : 600;
  const dpr = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  const share = PIXEL_BUDGET / Math.max(pages.length, 1);
  return pages.map(({ width: w, height: h }) => Math.min((fit / w) * dpr, Math.sqrt(share / (w * h)), MAX_SIDE / w, MAX_SIDE / h));
}

// 못 그린 까닭: 'broken'(PDF가 아니다) · 'password'(비밀번호가 걸렸다) · 'offline'(pdf.js·worker를 받지 못함, 또는 기기가 오프라인)
// · 'halted'(그 밖: worker가 죽음, 그리다 난 오류). fetching은 pdf.js를 받는 단계에서 난 실패, online은 navigator.onLine.
// pdf.js 오류는 name으로 가린다(줄여 쓴 판에서도 이름은 글로 남는다). worker를 받지 못하면 pdf.js는 가짜 worker로 한 번 더 해 보고,
// 그것도 못 받으면 Error 「Setting up fake worker failed: "…".」로 끝난다(이 판 pdf.min.mjs에서 worker 받기 실패는 이 글 하나뿐).
const WORKER_UNREACHABLE = /^Setting up fake worker failed/;
export function pdfTrouble(error, { fetching = false, online = true } = {}) {
  if (error?.name === 'InvalidPDFException') return 'broken';
  if (error?.name === 'PasswordException') return 'password';
  if (fetching || !online || WORKER_UNREACHABLE.test(String(error?.message ?? ''))) return 'offline';
  return 'halted';
}

// pdf.js 받기. 한 번 받으면 그 사본을 쓰고, reset() 뒤에는 새 주소(?retry=n)로 새 사본을 받는다. 같은 주소로는 되살아나지 않는다:
// 브라우저가 실패한 import를 기억하고, pdf.js는 worker를 한 번 못 받으면 그 사본을 가짜 worker로 굳힌다(PDFWorker의 정적 값,
// 가짜 worker의 import 실패도 그대로 남는다). 가짜 worker도 workerSrc를 import하므로 workerSrc에도 같은 꼬리표를 단다.
export function libraryLoader(importer = (href) => import(href)) {
  let tries = 0;
  let lib = null;
  const load = () => {
    if (!lib) {
      const tag = tries ? `?retry=${tries}` : '';
      const workerSrc = new URL(`pdf.worker.min.mjs${tag}`, VENDOR).href;
      lib = importer(new URL(`pdf.min.mjs${tag}`, VENDOR).href).then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        return pdfjs;
      });
    }
    return lib;
  };
  load.reset = () => {
    lib = null;
    tries += 1;
  };
  return load;
}
const loadLib = libraryLoader();

// list(쪽 canvas를 넣을 칸)에 bytes(ArrayBuffer)의 쪽을 그린다. label은 canvas 이름(화면 읽개). load는 pdf.js 받기(시험은 가짜).
// 돌려주는 것: { done: Promise<'ok' | 'broken' | 'password' | 'offline' | 'halted' | 'stopped'>, total(다 읽으면 쪽 수), destroy() }.
// 'offline'이면 다음에는 pdf.js를 새로 받는다(load.reset). 닫은 뒤(stopped)에 난 실패도 까닭은 보고 끊김이면 새로 받는다.
export function drawPdf(list, bytes, label, load = loadLib) {
  let task = null;
  let render = null;
  let stopped = false;
  const canvases = [];
  const view = { total: 0, done: null, destroy };
  view.done = (async () => {
    let fetching = true; // pdf.js를 받는 중
    try {
      const pdfjs = await load();
      fetching = false;
      if (stopped) return 'stopped';
      task = pdfjs.getDocument({ data: new Uint8Array(bytes), ...PDF_OPTIONS });
      const doc = await task.promise;
      view.total = doc.numPages;
      const pages = [];
      for (let n = 1; n <= shownPages(doc.numPages); n += 1) pages.push(await doc.getPage(n));
      if (stopped) return 'stopped';
      if (!pages.length) return 'broken';
      const add = () => {
        const canvas = list.appendChild(document.createElement('canvas'));
        canvases.push(canvas);
        return canvas;
      };
      const first = add(); // 그릴 칸 너비를 잰다(쪽 너비 100%, 세로 막대 자리는 CSS가 늘 비워 둔다)
      const scales = pageScales(pages.map((page) => page.getViewport({ scale: 1 })), first.clientWidth, globalThis.devicePixelRatio);
      for (const [i, page] of pages.entries()) {
        const canvas = i === 0 ? first : add();
        const viewport = page.getViewport({ scale: scales[i] });
        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', `${label} ${i + 1}쪽`);
        render = page.render({ canvas, viewport });
        await render.promise;
        render = null;
        if (stopped) return 'stopped';
      }
      return 'ok';
    } catch (error) {
      const trouble = pdfTrouble(error, { fetching, online: globalThis.navigator?.onLine !== false });
      if (trouble === 'offline') load.reset?.(); // 실패한 import·가짜 worker로 굳은 사본을 붙잡고 있지 않게(닫은 뒤에도)
      return stopped ? 'stopped' : trouble;
    }
  })();
  function destroy() {
    stopped = true;
    render?.cancel();
    render = null;
    task?.destroy().catch(() => {}); // 문서와 worker를 끝낸다
    task = null;
    for (const canvas of canvases.splice(0)) {
      canvas.width = 0; // 그림 메모리를 바로 돌려준다(폰)
      canvas.height = 0;
      canvas.remove();
    }
  }
  return view;
}
