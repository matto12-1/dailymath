// 문제 카드: 글 + 그림 + 답 내기(보기 단추 또는 숫자판) + 답 알림.
// mode: 'play' 두 번 풀기 / 'drill' 맞히면 바로 다음, 틀리면 정답을 보이고 「다음」을 기다린다.
import { h } from './ui.js?v=9a67f36b25';
import { sceneImg } from './art/assets.js?v=9a67f36b25';
import { drawLife } from '../src/art/life.js?v=9a67f36b25';
import { drawFigure, drawModel } from '../src/art/figure.js?v=9a67f36b25';
import { LIFE_KINDS, FIGURE_KINDS, MODEL_KINDS } from '../src/engine/template.js?v=9a67f36b25';
import { pressKey, padFor, pressDecimal, fractionReady, fractionText, pairReady, pairText, isFull, fractionHint, pairHint, answersHaveWhole } from '../src/game/numpad.js?v=9a67f36b25';
import { canon, parseAnswer, readAloud, same, frac, mixedFormMistake } from '../src/engine/answer.js?v=9a67f36b25';
import { toParts, promptParts } from '../src/engine/format.js?v=9a67f36b25';
import { choiceIcon, wideIcon } from '../src/art/choice-icons.js?v=9a67f36b25';
import { CURRENCY } from '../src/game/village.js?v=9a67f36b25';
import { josa } from '../src/engine/korean.js?v=9a67f36b25';
import { markTiming } from '../src/game/sound.js?v=9a67f36b25';
import { pencilMark } from './pencil.js?v=9a67f36b25';
import { sound } from './sound.js?v=9a67f36b25';
import { numberUnitBoundary, promptSentences, promptLineInfo, sentencesFit } from './prompt-layout.js?v=9a67f36b25';
import { cardPhase, solutionLines, cardTag } from './card-state.js?v=9a67f36b25';

export const DRILL_CORRECT_MS = 420;
export const RETRY_INPUT_MS = 300;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
function union(rects) {
  const list = [...rects].filter(r => r.width > 0 && r.height > 0);
  if (!list.length) return null;
  const left = Math.min(...list.map(r => r.left)), right = Math.max(...list.map(r => r.right));
  const top = Math.min(...list.map(r => r.top)), bottom = Math.max(...list.map(r => r.bottom));
  return { left, right, top, bottom, width: right - left, height: bottom - top };
}
// 글자가 차지한 자리(표시 그림판은 뺀다).
const textBox = (el) => union([...el.childNodes].filter(n => !n.classList?.contains('pencil-mark')).flatMap(n => {
  const range = document.createRange(); range.selectNode(n); return [...range.getClientRects()];
}));

// 맞힘 동그라미·틀림 빗금 자리(카드 기준 CSS 화소). 선생님이 문제 위에 크게 치는 표시라 글자를 지나가도 된다.
// 문제 카드 = 넓은 화면은 왼쪽 문제 칸, 폰은 카드 한 장. 가운데 = 문제 내용(글 + 그림·식)의 가운데.
// 지름(선 가운데 기준) = clamp(내용 크기, 카드 짧은 변 × 0.55, 카드 짧은 변 × 0.85).
// 내용 크기 = 너비 × 1.05(한두 줄 글은 이것). 여러 줄 글·그림처럼 덩어리면 대각선 × 0.9가 더 커서 글줄을 덜 가로지른다.
// 그린 자리: 넓은 화면은 문제 칸 안(단원 알약 아래), 폰은 카드 위 끝~답 칸(보기·숫자판) 위.
// 폰은 숫자판이 커서 문제 둘레가 좁으므로 단원 알약·「답을 써요」 글은 지나가도 된다.
// 카드 밖·보기·숫자판·알림 판과는 겹치지 않는다. 돌려주는 rx·ry는 선 굵기까지 넣은 바깥 반지름.
export function markLayout(card) {
  const q = card.querySelector(':scope > .q'), a = card.querySelector(':scope > .a');
  if (!card.isConnected || !q || !a) return null;
  const box = card.getBoundingClientRect(), qb = q.getBoundingClientRect(), ab = a.getBoundingClientRect();
  if (!box.width || !qb.width || !qb.height) return null;
  const stacked = ab.top >= qb.bottom - 1;
  let region;
  if (stacked) {
    const input = a.querySelector('.choices, .numpad')?.getBoundingClientRect();
    region = { left: box.left + card.clientLeft, right: box.right - card.clientLeft, top: box.top + card.clientTop + 4, bottom: (input?.height ? input.top : ab.top) - 4 };
  } else {
    const meta = q.querySelector('.question-meta')?.getBoundingClientRect();
    region = { left: qb.left + 2, right: qb.right - 2, top: (meta?.height ? meta.bottom : qb.top) + 4, bottom: qb.bottom - 2 };
  }
  const prompt = q.querySelector('.prompt'), art = q.querySelector('.art'), row = q.querySelector('.number-row');
  const content = union([prompt && textBox(prompt), row && row.getBoundingClientRect(), art && (art.querySelector('svg, img') ?? art).getBoundingClientRect()].filter(Boolean));
  if (!content) return null;
  const rw = region.right - region.left, rh = region.bottom - region.top;
  const short = stacked ? Math.min(box.width, box.height) : Math.min(qb.width, qb.height);
  const guess = clamp(Math.max(content.width * 1.05, Math.hypot(content.width, content.height) * .9), short * .55, short * .85);
  const w = clamp(guess * .02, 7, 10), m = w * .25 + 4;
  const d = Math.min(guess, rw - 2 * m - w, rh - 2 * m - w), r = (d + w) / 2;
  if (d < 60) return null;
  // 카드 안에 들어가게만 민다.
  const cx = clamp((content.left + content.right) / 2, region.left + r + m, region.right - r - m);
  const cy = clamp((content.top + content.bottom) / 2, region.top + r + m, region.bottom - r - m);
  return { cx: cx - box.left - card.clientLeft, cy: cy - box.top - card.clientTop, rx: r, ry: r, w };
}

// 맞히면 색연필 동그라미, 틀리면 빗금. 종이에 긋는 소리와 같이 시작해 같이 끝난다.
export function gradeMark(card, correct, { quick = false } = {}) {
  const kind = correct ? 'correct' : 'wrong';
  const { seconds, rate } = markTiming(kind, sound.duration(kind), { quick });
  sound.play(kind, { rate });
  return pencilMark(card, { kind: correct ? 'circle' : 'slash', layout: () => markLayout(card), seconds, reduced: reducedMotion(), watch: [card.querySelector(':scope > .q')] });
}

const artMarkup = (art) => LIFE_KINDS.includes(art.kind) ? drawLife(art) : FIGURE_KINDS.includes(art.kind) ? drawFigure(art) : MODEL_KINDS.includes(art.kind) ? drawModel(art) : null;

export function artView(p) {
  if (!p.art) return null;
  if (p.art.scene) {
    const src = sceneImg(p.art.scene);
    return src ? h('div', { class: 'art art-scene' }, h('img', { src, alt: '', width: 640, height: 640 })) : null;
  }
  const svg = artMarkup(p.art);
  return svg ? h('div', { class: (p.art.largePanels || p.art.wide || p.art.mmSpacing ? 'art art-wide' : 'art') + (p.art.bleed ? ' art-bleed' : ''), html: svg }) : null;
}

// 번호 그림 중 고르기(끈·시계·도형·전개도 등): 그림 칸이 곧 보기 단추다. IXL처럼 그림을 눌러 고른다(10-20 Matto 「다른 문제집이나 어플들 레퍼런스좀 참고해」).
// 칸 묶음(<g data-panel>)을 칸마다 오려 단추에 넣고, 칸 밖 그림(기준 모양·표·무늬 줄)만 문제 칸에 둔다.
// 칸 번호는 풀이가 「2번은 …」으로 부르니 그림 안에 남기고, 단추는 번호 차례로 놓는다.
const SVG_KEEP = new Set(['defs', 'style', 'title', 'desc']);
const panelNumber = (c) => parseInt(String(c), 10);
// 칸 하나(panel) 또는 칸 밖 그림(panel = null)만 남긴 사본과 그 둘레(그림 좌표).
function carve(full, panel, probe) {
  const copy = full.cloneNode(true);
  for (const g of copy.querySelectorAll('[data-panel]')) if (g.dataset.panel !== panel) g.remove();
  if (panel != null) for (const node of [...copy.children]) {
    if (!SVG_KEEP.has(node.localName) && !node.matches('[data-panel]') && !node.querySelector('[data-panel]')) node.remove();
  }
  probe.append(copy);
  const label = panel == null ? null : labelPoint(copy, panel);
  if (panel != null && innerHeight <= 500 && innerWidth > innerHeight) copy.querySelector('[data-panel-label]')?.setAttribute('display', 'none');
  const b = copy.getBBox();
  copy.remove();
  copy.removeAttribute('width'); copy.removeAttribute('height');
  return b.width < 2 || b.height < 2 ? null : { svg: copy, box: { x: b.x, y: b.y, w: b.width, h: b.height }, label };
}
// 칸 번호 글자가 놓인 점(그림 좌표). 그리는 쪽이 번호를 칸마다 같은 자리에 두므로 칸끼리 맞추는 기준이 된다.
// 번호는 칸에서 맨 먼저 나오는 그 숫자 글자다(시계 눈금 숫자보다 먼저). 글자 크기를 잴 때 가려 쓰도록 표시해 둔다(fitPictures).
function labelPoint(svg, panel) {
  const t = [...svg.querySelectorAll('[data-panel] text')].find(n => n.textContent.trim() === panel), ctm = t?.getScreenCTM();
  const m = ctm && t.x.baseVal.numberOfItems && t.y.baseVal.numberOfItems && svg.getScreenCTM()?.inverse().multiply(ctm);
  if (!m) return null;
  t.setAttribute('data-panel-label', '');
  return new DOMPoint(t.x.baseVal.getItem(0).value, t.y.baseVal.getItem(0).value).matrixTransform(m);
}
// 선 굵기와 글자 둘레가 잘리지 않게 조금 둘러 자른다.
const PAD = 6;
const frame = (svg, x, y, w, h) => { svg.setAttribute('viewBox', `${x - PAD} ${y - PAD} ${w + 2 * PAD} ${h + 2 * PAD}`); return svg; };
function panelChoices(p) {
  if (p.input !== 'choice' || p.art?.scene || !p.art?.panels?.length || p.choices?.length !== p.art.panels.length) return null;
  // 빈칸이 든 긴 무늬는 다섯 칸씩 읽고 기준 그림에 문제 칸 폭을 쓴다.
  const pattern = p.art.kind === 'objects' && p.art.items?.length > 5 && p.art.items.some(item => item.shape === 'blank');
  const markup = artMarkup(pattern ? { ...p.art, columns: 5 } : p.art);
  if (!markup) return null;
  const probe = h('div', { 'aria-hidden': 'true', style: 'position:fixed;left:-10000px;top:0;width:340px;visibility:hidden;pointer-events:none', html: markup });
  const full = probe.querySelector('svg');
  if (!full || !p.choices.every(c => full.querySelector(`[data-panel="${panelNumber(c)}"]`))) return null;
  document.body.append(probe);
  try {
    const choices = [...p.choices].sort((a, b) => panelNumber(a) - panelNumber(b));
    const parts = choices.map(c => carve(full, String(panelNumber(c)), probe));
    if (parts.some(t => !t)) return null;
    // 칸끼리 크기를 견주는 그림(끈 길이·넓이·들이)이 있어 모든 칸을 같은 크기 틀에 같은 비율로 담는다.
    // 칸을 번호 글자 자리에 맞춰 겹친 뒤 모두 담기는 틀 하나를 잡는다: 단추마다 번호가 같은 자리에 오고, 칸 안 배치(끈 시작점 등)는 원래 그림 그대로다.
    const at = parts.every(t => t.label) ? t => t.label : t => t.box;
    const left = Math.max(...parts.map(t => at(t).x - t.box.x)), top = Math.max(...parts.map(t => at(t).y - t.box.y));
    const W = left + Math.max(...parts.map(t => t.box.x + t.box.w - at(t).x)), H = top + Math.max(...parts.map(t => t.box.y + t.box.h - at(t).y));
    const tiles = parts.map(t => frame(t.svg, at(t).x - left, at(t).y - top, W, H));
    // 번호가 줄 왼쪽에 붙어 위아래로 쌓인 줄 그림(끈·막대·들이)은 시작점을 맞춰 견주므로 늘 한 칸씩 쌓는다.
    const centers = parts.map(t => t.box.x + t.box.w / 2), stacked = Math.max(...centers) - Math.min(...centers) < Math.max(...parts.map(t => t.box.w)) / 2;
    const rows = stacked && parts.every(t => t.label && t.label.x - t.box.x < t.box.w / 5);
    // 칸 밖 그림(기준 모양·표·무늬 줄)은 문제의 중심이다. 보기가 단추로 빠져 자리가 남으니 원래 그림에서 차지하던 폭의 1.5배까지 키우고,
    // 길쭉하면 높이에서 멈춘다(.picture-rest). 화면 높이가 모자라면 fitPictures가 --boost를 1까지 내린다.
    // 기준과 보기를 크기까지 견주는 그림(합동)은 키우지 않고 보기 단추와 같은 비율로 그린다(sameScale).
    const rest = carve(full, null, probe), base = p.art.largePanels || p.art.wide || p.art.mmSpacing ? '100%' : 'min(100%, 460px)';
    if (rest) {
      rest.svg.classList.add('picture-rest');
      rest.svg.style.width = pattern ? '100%' : `calc(${base} * ${((rest.box.w + 2 * PAD) / full.viewBox.baseVal.width).toFixed(4)} * var(--boost, 1.5))`;
    }
    // 분류 상자의 물건 크기는 그대로 두고 상자 자리만 바꾼다.
    // 보기 폭에 한 줄이 들어오지 않으면 두 칸으로 접는다.
    const grouped = p.art.kind === 'sort' && parts.map(t => [...t.svg.querySelectorAll('[data-group]')]);
    const groupBox = grouped && grouped[0][0]?.querySelector('rect');
    const original = grouped && tiles.map(tile => [...tile.querySelectorAll('*')].map(node => [node, [...node.attributes].map(a => [a.name, a.value])]));
    const originalFrames = tiles.map(tile => tile.getAttribute('viewBox'));
    const originalSize = { w: W + 2 * PAD, h: H + 2 * PAD };
    const arrangeGroups = groupBox && ((available) => {
      original.forEach((nodes, i) => { nodes.forEach(([node, attrs]) => attrs.forEach(([name, value]) => node.setAttribute(name, value))); tiles[i].setAttribute('viewBox', originalFrames[i]); });
      if (innerWidth <= 600) return originalSize;
      if (innerHeight <= 500 && innerWidth > innerHeight) grouped.flat().forEach(g => {
        g.querySelector('text').setAttribute('font-size', '36');
        g.querySelector('text').setAttribute('y', '30');
      });
      const n = grouped[0].length, most = Math.max(...grouped.flat().map(g => g.querySelectorAll('[data-object]').length));
      const layouts = [];
      for (let per = 1; per <= 6; per++) for (const columns of new Set([n, Math.min(2, n)])) {
        const w = Math.max(Math.min(per, most) * 44 + 18, 112), h = Math.ceil(most / per) * 50 + 42;
        const next = { w: columns * (w + 6) - 6 + 2 * PAD, h: Math.ceil(n / columns) * (h + 6) - 6 + 2 * PAD };
        layouts.push({ per, columns, w, h, next, scale: Math.min(available / next.w, innerHeight * .3 / next.h) });
      }
      const { per, columns, w, h, next } = layouts.sort((a, b) => b.scale - a.scale)[0];
      grouped.forEach((groups, i) => {
        groups.forEach((g, j) => {
          g.setAttribute('transform', `translate(${j % columns * (w + 6)} ${Math.floor(j / columns) * (h + 6)})`);
          const rect = g.querySelector('rect'), name = g.querySelector('text'), svg = g.querySelector('svg'), objects = [...svg.querySelectorAll('[data-object]')];
          rect.setAttribute('width', w); rect.setAttribute('height', h); name.setAttribute('x', w / 2);
          const cols = Math.min(per, objects.length), lines = Math.ceil(objects.length / per), iw = (cols - 1) * 44 + 46, ih = (lines - 1) * 50 + 48;
          objects.forEach((object, k) => object.setAttribute('transform', `translate(${15 + k % per * 44} ${16 + Math.floor(k / per) * 50})`));
          for (const [key, value] of Object.entries({ viewBox: `9 10 ${iw} ${ih}`, width: iw, height: ih, x: (w - iw) / 2, y: 28 + (h - 28 - ih) / 2 })) svg.setAttribute(key, value);
        });
        frame(tiles[i], 0, 0, next.w - 2 * PAD, next.h - 2 * PAD);
      });
      return next;
    });
    const capacity = p.art.kind === 'compare' && p.art.type === 'capacity';
    const graph = p.art.kind === 'pictograph' && !!p.art.sourceTable;
    const rowOriginal = (capacity || graph) && tiles.map(tile => [...tile.querySelectorAll('*')].map(node => [node, [...node.attributes].map(a => [a.name, a.value])]));
    // 들이의 물건 크기와 그래프의 기호 수는 그대로 둔다. 넓은 화면에서만
    // 번호의 빈 폭을 덜고, 긴 기호 줄은 네 개씩 접어 두 칸 보기에 담는다.
    const arrangeRows = rowOriginal && (() => {
      rowOriginal.forEach((nodes, i) => {
        nodes.forEach(([node, attrs]) => {
          for (const attr of [...node.attributes]) node.removeAttribute(attr.name);
          attrs.forEach(([name, value]) => node.setAttribute(name, value));
        });
        tiles[i].setAttribute('viewBox', originalFrames[i]);
      });
      // 그림그래프는 낮은 폰 가로에서도 촘촘히 다시 놓는다(왼쪽 빈 폭을 덜어 두 칸 보기에 담는다).
      const lowGraph = graph && innerHeight <= 500 && innerWidth > innerHeight;
      if (!lowGraph && (innerWidth < 1024 || innerWidth < innerHeight || innerHeight <= 500)) return originalSize;
      tiles.forEach(tile => tile.querySelector('[data-panel-label]').setAttribute('display', 'none'));
      if (capacity) {
        const boxes = tiles.map(tile => tile.getBBox());
        const x = Math.min(...boxes.map(b => b.x));
        const top = Math.max(...boxes.map((b, i) => parts[i].label.y - b.y));
        const w = Math.max(...boxes.map(b => b.x + b.width)) - x;
        const h = top + Math.max(...boxes.map((b, i) => b.y + b.height - parts[i].label.y));
        tiles.forEach((tile, i) => frame(tile, x, parts[i].label.y - top, w, h));
        return { w: w + 2 * PAD, h: h + 2 * PAD };
      }
      const panels = choices.map(c => p.art.panels.find(panel => panel.number === panelNumber(c)));
      const most = Math.max(...panels.flatMap(panel => panel.values.map(v => Math.ceil(v / (p.art.unit || 1)))));
      const band = Math.ceil(most / 4) * 30 + 12, top = 12, height = top + p.art.labels.length * band;
      tiles.forEach((tile, i) => {
        const labels = [...tile.querySelectorAll('text:not([data-panel-label])')];
        const symbols = [...tile.querySelectorAll('[data-symbol]')];
        let at = 0;
        labels.forEach((label, row) => {
          label.setAttribute('x', '32'); label.setAttribute('y', top + row * band + band / 2 + 8);
          const count = Math.ceil(panels[i].values[row] / (p.art.unit || 1));
          symbols.slice(at, at + count).forEach((symbol, j) => {
            const b = symbol.getBBox(), x = 80 + j % 4 * 30, y = top + row * band + 20 + Math.floor(j / 4) * 30;
            symbol.setAttribute('transform', `translate(${x - b.x - b.width / 2} ${y - b.y - b.height / 2})`);
          });
          at += count;
        });
        const line = tile.querySelector('line');
        for (const [key, value] of Object.entries({ x1: 60, x2: 60, y1: top, y2: height })) line.setAttribute(key, value);
        frame(tile, 0, 0, 182, height);
      });
      return { w: 182 + 2 * PAD, h: height + 2 * PAD };
    });
    return { choices, tiles, rows, pattern, arrange: arrangeGroups || arrangeRows, wideRows: capacity || graph, capacity, graph, size: originalSize, restSvg: rest?.svg, sameScale: !!p.art.sameScale, wrapRows: !!p.art.wrapRows, oneRow: !!p.art.oneRow,
      rest: rest && h('div', { class: 'art' }, frame(rest.svg, rest.box.x, rest.box.y, rest.box.w, rest.box.h)) };
  } finally { probe.remove(); }
}

const fractionView = (part) => h('span', { class: 'fraction', 'aria-label': readAloud('fraction', `${part.w ? `${part.w} ` : ''}${part.n}/${part.d}`) },
  part.w ? h('span', { class: 'whole', 'aria-hidden': true }, part.w) : null,
  h('span', { class: 'stack', 'aria-hidden': true }, h('span', {}, part.n), h('span', {}, part.d)));
// 값·식·「몇 개」는 한 덩어리(.nb)로 묶어 그 안에서 줄이 바뀌지 않게 한다(검수 6번, 10-21 Matto 「몇 개에요 이게 한 줄에 나오게」).
// 「5 m 52 / cm」「46 + 19 = / 65예요」「둥근기둥 모양은 몇 / 개예요?」처럼 값이나 식 가운데서 줄이 갈렸다.
// 띄어 쓴 낱말 사이마다 붙일지 정한다. 분수는 수로 본다. 안 들어가는 덩어리는 fitGlue가 글자를 줄이고, 그래도 넘치면 풀어 준다.
const UNIT_WORD = /^(?:km|cm|mm|m|kg|g|t|mL|L)[²³]?(?![A-Za-z])/, UNIT_ONLY = /^(?:km|cm|mm|m|kg|g|t|mL|L)[²³]?$/;
const OPERATOR = /^(?:[+\-−×÷=<>≤≥:]|\.{3}|…)$/, VALUE_END = /[\d)□△○?]$/, VALUE_START = /^[\d(□△○?]/;
const TIME_PAIR = [/\d(?:시간|시|분)$/, /^\d+(?:분|초)/];
function glues(before, a, b) {
  if (numberUnitBoundary(a, b)) return true;
  if (a === '몇' || a === '어느') return true;
  if (a === '골라' && /^볼까요/.test(b)) return true;
  if (/^(?:있어요|없어요|볼까요|개예요|몇이에요|무엇이에요|얼마예요|남아요|받아요)[?.!]*$/.test(b)) return true;
  if (/\d$/.test(a) && /^(?:초과|이상|미만|이하)/.test(b)) return true;
  if (a === '분' && before === '몇' && b === '몇') return true;
  if (/^(?:가|나|다)$/.test(a) && /^모둠/.test(b)) return true;
  if (/^(?:가로|세로|높이|주스|우유|차|물)$/.test(a) && /^\d/.test(b)) return true;
  if ((a === '다음' && /^\(\d+번째\)/.test(b)) || (a === '빈' && /^곳/.test(b)) || (a === '더' && /^받아/.test(b)) ||
      (a === '꺼낼' && b === '때') || (a === '하루' && b === '평균') || (a === '남은' && /^끈/.test(b)) || (a === '모두' && b === '몇')) return true;
  if (OPERATOR.test(b) && VALUE_END.test(a)) return true;
  if (OPERATOR.test(a) && VALUE_START.test(b)) return true;
  if (/\d$/.test(a) && UNIT_WORD.test(b)) return true;
  if (UNIT_ONLY.test(a) && /\d$/.test(before ?? '') && /^\d/.test(b)) return true;
  return TIME_PAIR[0].test(a) && TIME_PAIR[1].test(b);
}
export function partsView(parts, { splitEquals = false, splitOperators = false } = {}) {
  // 낱말(띄어쓰기 사이 덩어리)마다 그림 조각과 판정용 글(분수는 「1」)을 모은다.
  const words = [{ nodes: [], key: '' }];
  for (const part of parts) {
    if (part.t !== 'text') { const w = words.at(-1); w.nodes.push(fractionView(part)); w.key += '1'; continue; }
    part.v.split(/( +)/).forEach((piece, i) => {
      if (i % 2) { words.push({ space: piece, nodes: [], key: '' }); return; }
      if (piece) { const w = words.at(-1); w.nodes.push(...textParts(piece)); w.key += piece; }
    });
  }
  const out = [];
  let run = null;
  const glued = (before, a, b) => !(splitEquals && b === '=') &&
    !(splitOperators && (OPERATOR.test(b) || UNIT_ONLY.test(a) && VALUE_START.test(b))) && glues(before, a, b);
  words.forEach((w, i) => {
    const join = i > 0 && run && w.key && glued(words[i - 2]?.key, words[i - 1].key, w.key);
    if (join) { run.append(w.space, ...w.nodes); return; }
    if (i > 0) out.push(document.createTextNode(w.space));
    const next = words[i + 1];
    if (next && w.key && next.key && glued(words[i - 1]?.key, w.key, next.key)) { run = h('span', { class: 'nb' }, ...w.nodes); out.push(run); }
    else {
      run = null;
      // 분수 자체는 이미 한 덩이다. 한 겹 더 감싸면 보기의 줄 높이를 두 번 세게 된다.
      out.push(w.nodes.length === 1 && w.nodes[0].classList?.contains('fraction') ? w.nodes[0] : h('span', { class: 'math-word' }, ...w.nodes));
    }
  });
  return out;
}
// 원래 글자는 읽어 주기에 남기고, 없는 연산 기호와 소수점만 같은 굵기로 그린다.
function textParts(text) {
  const nodes = [], pattern = /[+−×÷=→□≤≥]|(?<=\d)\.(?=\d)/g;
  let at = 0;
  const names = { '+': 'plus', '−': 'minus', '×': 'times', '÷': 'divide', '=': 'equals', '→': 'arrow', '□': 'square', '≤': 'le', '≥': 'ge' };
  for (const m of text.matchAll(pattern)) {
    if (m.index > at) nodes.push(document.createTextNode(text.slice(at, m.index)));
    nodes.push(h('span', { class: m[0] === '.' ? 'decimal-point' : `op op-${names[m[0]]}` }, m[0]));
    at = m.index + m[0].length;
  }
  if (at < text.length) nodes.push(document.createTextNode(text.slice(at)));
  return nodes;
}
// 묶은 덩어리가 칸보다 넓으면 글자를 조금씩(0.92·0.85·0.78배) 줄이고, 그래도 넘치면 묶음을 푼다(.nb-off).
function fitGlue(el) {
  let width = -1;
  const fit = () => {
    if (!el.isConnected) return;
    el.style.removeProperty('font-size'); el.classList.remove('nb-off', 'sentence-lines');
    const base = parseFloat(getComputedStyle(el).fontSize);
    for (const k of [.92, .85, .78]) {
      if (el.scrollWidth <= el.clientWidth + 1) break;
      el.style.fontSize = `${(base * k).toFixed(1)}px`;
    }
    if (el.scrollWidth > el.clientWidth + 1) { el.style.removeProperty('font-size'); el.classList.add('nb-off'); }
    if (innerWidth >= 1024 && innerWidth >= innerHeight) {
      for (let size = parseFloat(getComputedStyle(el).fontSize); el.getBoundingClientRect().height > 3 * parseFloat(getComputedStyle(el).lineHeight) + 1 && size > 30; size -= 2) el.style.fontSize = `${Math.max(30, size - 2)}px`;
    }
    if (el.querySelectorAll(':scope > .prompt-sentence').length > 1 && promptLineInfo(el).length > 1 && sentencesFit(el)) el.classList.add('sentence-lines');
  };
  const observer = new ResizeObserver(entries => {
    if (!el.isConnected) { observer.disconnect(); return; }
    const next = entries[0].contentRect.width;
    if (Math.abs(next - width) > .5) { width = next; fit(); }
  });
  observer.observe(el);
  // 그림과 보기의 화면 맞춤이 끝나 높이가 바뀌면 문장별 줄바꿈도 다시 판정한다.
  requestAnimationFrame(() => {
    if (!el.isConnected) return;
    const card = el.closest('.card');
    const layoutObserver = new ResizeObserver(() => {
      if (!el.isConnected) { layoutObserver.disconnect(); return; }
      fit();
    });
    for (const node of card.querySelectorAll(':scope > .q, :scope > .a, .art')) layoutObserver.observe(node);
  });
  document.fonts.ready.then(fit);
  return el;
}
function promptView(prompt) {
  const parts = promptSentences(prompt);
  return fitGlue(h('p', { class: /\d{12,}/.test(prompt) ? 'prompt long-number' : 'prompt' },
    ...parts.flatMap(s => [s.space, h('span', { class: 'prompt-sentence' }, ...partsView(promptParts(s.text)))])));
}
export const answerView = (p, v = p.answer) => [...partsView(p.answerKind === 'text' ? promptParts(String(v)) : toParts(p.answerKind ?? (typeof v === 'number' ? 'int' : 'text'), v, p.parts)), p.answerUnit ? (/^(?:km|cm|mm|m|kg|g|t|mL|L|cm²|m²|km²|cm³|m³|mm²|mm³)$/.test(p.answerUnit) ? ' ' : '') + p.answerUnit : ''];

// 수를 견주는 문제(choiceBox)는 견줄 수를 문제 쪽 「보기」 칸에도 둔다. 문제집의 보기 상자처럼 글 밖에, 단추와 같은 차례로.
// 한 줄에 다 안 들어가면 셋·하나로 갈리지 않게 두 개씩 두 줄, 그것도 넘치면 한 줄에 하나씩. 여섯 자리 넘는 수는 오른쪽을 맞춰 자리가 위아래로 맞는다.
// (10-21 여덟 자리 수 넷을 한 줄에 하나씩 두었더니 폰에서 단추가 10px 밀려 두 개씩 두 줄로 바꿨다.)
function choiceBoxView(p) {
  // 한두 자리 수(3 0 6 2)는 사이가 좁으면 한 수(3062)로 읽혀 더 벌린다.
  const long = p.choices.some(c => String(c).replace(/\D/g, '').length >= 6), short = p.choices.every(c => String(c).length <= 2);
  const box = h('div', { class: `choice-box${long ? ' long' : short ? ' short' : ''}`, role: 'group', 'aria-label': '보기' },
    h('span', { class: 'box-tag', 'aria-hidden': 'true' }, '보기'),
    ...p.choices.map(c => h('span', { class: 'box-item' }, ...answerView(p, c))));
  let width = -1;
  const fit = () => {
    box.classList.remove('two', 'one');
    const items = [...box.querySelectorAll('.box-item')];
    const centers = items.map(item => { const r = item.getBoundingClientRect(); return r.top + r.height / 2; });
    if (items.length < 3 || Math.max(...centers) - Math.min(...centers) <= 4) return;
    box.classList.add('two');
    const edge = box.getBoundingClientRect();
    if (items.some(item => { const r = item.getBoundingClientRect(); return r.left < edge.left + 2 || r.right > edge.right - 2; })) box.classList.replace('two', 'one');
  };
  const observer = new ResizeObserver(entries => {
    if (!box.isConnected) { observer.disconnect(); return; }
    const next = entries[0].contentRect.width;
    if (Math.abs(next - width) > .5) { width = next; fit(); }
  });
  observer.observe(box);
  document.fonts.ready.then(() => box.isConnected && fit());
  return box;
}

// 늘어선 수는 글 속에 두지 않고 상자에 둔다: 규칙의 수는 「39 → 44 → 49 → ?」, 자료는 띄어 놓고, 계산식 배열은 한 줄에 식 하나(검수 10번).
// 화살표는 뒤 수와 붙어 다녀서 줄이 갈려도 화살표만 줄 끝에 남지 않는다. 모르는 수 「?」는 주황 점선 칸이다.
// 한 줄에 안 들어가면 글자를 2px씩 줄여(20px까지) 한 줄에 맞춘다. 그래도 넘치면 줄을 바꾼다.
const ask = () => h('span', { class: 'row-ask' }, '?');
// 식 상자 한 줄: 분수는 위아래로 쌓고, 따로 선 「?」는 빈칸, 「→」는 흐린 화살표로 둔다(검수 9번).
function rowLine(line, { aligned = false, placeGuide = false } = {}) {
  if (aligned && line.includes('=')) {
    const at = line.indexOf('=');
    return h('span', { class: 'row-line row-aligned' },
      h('span', { class: 'row-left' }, ...partsView(promptParts(line.slice(0, at).trim()), { splitOperators: true })),
      h('span', { class: 'row-tail' },
        h('span', { class: 'row-equals' }, ...textParts('=')),
        h('span', { class: 'row-right' }, ...partsView(promptParts(line.slice(at + 1).trim()), { splitOperators: true }).map(n => n.textContent === '?' ? ask() : n))));
  }
  if (placeGuide && /^\d{5,}$/.test(line)) {
    const groups = line.match(/^\d{1,4}(?=(?:\d{4})*$)|\d{4}/g);
    return h('span', { class: 'row-line place-number' }, ...groups.map(group => h('span', { class: 'place-group' }, group)));
  }
  const content = h('span', { class: 'row-content' }, ...partsView(promptParts(line), { splitOperators: true }));
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT), blanks = [];
  while (walker.nextNode()) if (walker.currentNode.textContent === '?') blanks.push(walker.currentNode);
  blanks.forEach(node => node.replaceWith(ask()));
  content.querySelectorAll('.op-arrow').forEach(node => node.classList.add('row-arrow'));
  return h('span', { class: 'row-line' }, content);
}
function numberRowView(p) {
  const row = p.numberRow, label = row.tag ?? (row.lines ? '계산식' : '수');
  const aligned = row.lines?.length > 1 && row.lines.every(line => line.includes('='));
  const tag = row.tag && h('span', { class: 'box-tag', 'aria-hidden': 'true' }, row.tag);
  const box = row.lines
    ? h('div', { class: `number-row lines${row.lines.length === 1 ? ' one-line' : aligned ? ' aligned' : ''}`, role: 'group', 'aria-label': label },
      ...row.lines.map(line => rowLine(line, { aligned, placeGuide: p.placeGuide })))
    : h('div', { class: `number-row${tag ? ' tagged' : ''}`, role: 'group', 'aria-label': label }, tag,
      // 화살표가 없는 자료는 쉼표로 가른다(「23 13」이 한 수로 읽히지 않게).
      ...row.items.map((x, i) => h('span', { class: 'row-step' }, i > 0 && row.arrows && h('span', { class: 'row-arrow op op-arrow', 'aria-hidden': 'true' }, '→'),
        x === '?' ? ask() : p.placeGuide ? rowLine(String(x), { placeGuide: true }) : String(x) + (!row.arrows && i < row.items.length - 1 ? ',' : ''))));
  const parts = [...box.querySelectorAll('.row-step, .row-line')];
  const crowded = () => row.lines ? box.scrollWidth > box.clientWidth + 1 : parts.at(-1).offsetTop > parts[0].offsetTop + 4;
  let width = -1;
  const fit = () => {
    if (!box.isConnected) return;
    box.style.removeProperty('font-size');
    // 가로 화면의 식은 문제 칸의 70%까지 키우되 80px에서 멈춘다.
    if (row.lines?.length && innerWidth >= 1024 && innerWidth >= innerHeight) {
      const target = box.closest('.q').clientWidth * .7;
      const base = parseFloat(getComputedStyle(box).fontSize);
      if (box.getBoundingClientRect().width < target) box.style.fontSize = `${Math.min(80, base * target / box.getBoundingClientRect().width).toFixed(1)}px`;
    }
    for (let size = parseFloat(getComputedStyle(box).fontSize); crowded() && size > 20; size -= 2) box.style.fontSize = `${size - 2}px`;
  };
  const observer = new ResizeObserver(entries => {
    if (!box.isConnected) { observer.disconnect(); return; }
    const next = entries[0].contentRect.width;
    if (Math.abs(next - width) > .5) { width = next; fit(); }
  });
  // 상자 폭은 글자 크기를 따라 바뀌므로, 붙은 뒤 바깥 칸의 폭을 본다.
  requestAnimationFrame(() => box.isConnected && observer.observe(box.parentElement));
  document.fonts.ready.then(fit);
  return box;
}

// 그림표 보기(검수 7번): 「시계 반대 방향으로 90° 돌려요」 대신 휘어진 화살표와 「시계 반대 방향 90°」. 읽어 주는 말은 원래 보기다.
const lookView = (look) => [h('span', { class: wideIcon(look.icon) ? 'choice-icon wide' : 'choice-icon', 'aria-hidden': 'true', html: choiceIcon(look.icon) }), h('span', { class: 'choice-text' }, ...partsView(promptParts(look.text)))];
function choicesView(p, submit, pictures = null) {
  const choices = pictures?.choices ?? p.choices;
  const grid = h('div', { class: pictures ? 'choices picture-choices' : 'choices' }, ...choices.map((c, i) => {
    const look = !pictures && p.choiceLooks?.[String(c)];
    const button = h('button', { class: look ? 'looked' : null, 'data-value': String(c), 'aria-label': pictures ? `${panelNumber(c)}번 그림` : look ? String(c) : null, onclick: (e) => submit(c, e.currentTarget) },
      ...(pictures ? [h('span', { class: 'picture-number', 'aria-hidden': 'true' }, panelNumber(c)), pictures.tiles[i]] : look ? lookView(look) : answerView(p, c)));
    button.choiceValue = c;
    return button;
  }));
  if (pictures) return fitPictures(grid, pictures);
  let width = -1;
  const crowded = () => [...grid.children].some(button => {
    // 큰 단추의 빈 높이는 줄 수가 아니다. 실제 글·분수 묶음의 높이를 잰다. 그림표 보기는 짧은 말만 잰다.
    const content = button.querySelector(':scope > .choice-text') ?? button, style = getComputedStyle(content);
    const range = document.createRange();
    range.selectNodeContents(content);
    const height = range.getBoundingClientRect().height;
    const lines = content.querySelector('.fraction') ? 3 : 2;
    return button.scrollWidth > button.clientWidth + 1 || height > lines * parseFloat(style.lineHeight) + 1;
  });
  // 보기 셋은 한 줄에 셋을 놓는다. 두 칸이면 한 칸이 비었다(검수 3번). 셋이 한 줄에 안 들어가면 한 칸씩 쌓는다.
  // 긴 이름(이등변삼각형·평행사변형)은 글자를 조금씩 줄여(0.7배까지) 두 칸에 둔다. 한 칸씩 쌓으면 폰 첫 화면을 넘었다(검수 13번).
  const fit = () => {
    if (!grid.isConnected) return;
    const buttons = [...grid.children], size = (px) => { for (const b of buttons) if (px) b.style.fontSize = `${px}px`; else b.style.removeProperty('font-size'); };
    grid.classList.remove('choices-long', 'choices-single-line');
    size(null);
    grid.classList.toggle('choices-three', buttons.length === 3);
    if (buttons.length === 3 && !p.choiceLooks) grid.classList.add('choices-single-line');
    const base = parseFloat(getComputedStyle(buttons[0]).fontSize);
    const minimum = buttons.length === 3 && innerWidth > 600 ? 22 : Math.max(22, base * .7);
    for (let px = base - 2; crowded() && px >= minimum; px -= 2) size(px);
    if (buttons.length === 3 && innerWidth > 600 && crowded()) size(minimum);
    const long = crowded();
    if (long) { size(null); grid.classList.remove('choices-three', 'choices-single-line'); }
    grid.classList.toggle('choices-long', long);
  };
  const observer = new ResizeObserver(entries => {
    if (!grid.isConnected) { observer.disconnect(); return; }
    const next = entries[0].contentRect.width;
    if (Math.abs(next - width) > .5) { width = next; fit(); }
  });
  observer.observe(grid);
  document.fonts.ready.then(fit);
  return grid;
}

// 그림 단추를 몇 칸씩 놓을지 단추 줄의 폭으로 정한다(폰·넓은 화면·돌림마다 다시).
// 줄 그림은 한 칸씩(견주지 않는 줄 그림 wrapRows는 넘칠 때 두 칸), 길쭉한 그림(쌓은 모양)은 한 줄에 모두, 나머지는 두 칸씩이다.
// 그렇게 놓으면 번호 글자나 길이·이름 글자가 14px보다 작아질 때만 칸 수를 줄인다(길이·이름 글자는 10px이던 것을 14px로 올림, 검수 14번)(길이 적힌 도형은 그리는 쪽이 글자를 키워 폰에서도 두 칸).
// 그다음 화면 높이를 넘치면 기준 그림을 키운 몫(1.5배)부터 돌려주고, 그래도 넘치면 넘친 만큼 단추 그림 높이를 줄인다.
// 보기 넷이 한눈에 보여야 고른다. 줄여도 같은 글자 크기 아래로는 안 줄인다.
const LABEL_PX = 14, TEXT_PX = 14;
// 문제 그림이 첫 화면을 넘으면 줄인다. 문제 한 장은 내리지 않고 한 화면에 보인다(DECISIONS 10-21 밤 늦게).
// - 폰·세로(답 칸이 문제 칸 아래): 답 칸(보기·숫자판) 아래끝이 화면 밖이면(검수 13번).
// - 넓은 화면(답 칸이 문제 칸 옆, 태블릿 가로 1280×800): 문제 칸 내용 아래끝 + SIDE_GAP이 화면 밖이면(10-22 FIXPLAN 뿌리 1).
//   전에는 답 칸이 옆에 있으면 그대로 끝나, 그림이 칸 폭대로 커진 채 천칭 둘째 접시·시계 아래 숫자·범례가 화면 밖에 있었다.
// 줄이는 차례는 둘 다 같다: 그림 위아래 빈 자리를 잘라 내고, 그래도 넘치면 그림 높이 상한을 건다.
// 그림 속 글자는 TEXT_PX 아래로, 그림은 처음 높이의 45% 아래로 줄이지 않는다. 그래도 넘치면 짜임을 바꿔야 한다(천칭 나란히 등, 그리는 쪽 몫).
const SIDE_GAP = 20;
// 넓은 화면에서 문제 칸 내용이 끝나는 자리(문서 좌표). 문제 칸은 답 칸 높이·카드 최소 높이만큼 늘어나고 내용은 그 가운데에 선다.
// 늘어난 빈 자리는 그림을 줄여도 줄지 않으니 넘침에서 뺀다(답 칸이 더 길어 넘치는 것은 그림 몫이 아니다).
function questionEnd(q) {
  const end = q.getBoundingClientRect().bottom + scrollY, body = q.querySelector(':scope > .question-body');
  const kids = body ? [...body.children].filter(k => k.getClientRects().length) : [];
  if (!kids.length) return end;
  const used = kids.at(-1).getBoundingClientRect().bottom - kids[0].getBoundingClientRect().top;
  return end - Math.max(0, body.getBoundingClientRect().height - used);
}
function fitArtToScreen(root) {
  const pic = root.querySelector(':scope > .q .art > svg, :scope > .q .art > img');
  if (!pic) return;
  let width = -1;
  const fit = () => {
    if (!pic.isConnected) return;
    root.classList.remove('compact-art');
    pic.style.removeProperty('max-height');
    const q = root.querySelector(':scope > .q'), a = root.querySelector(':scope > .a'), input = a?.querySelector('.choices, .numpad');
    if (!q || !input) return;
    const beside = a.getBoundingClientRect().top < q.getBoundingClientRect().bottom - 1;
    const overflow = () => beside ? questionEnd(q) + SIDE_GAP - innerHeight : Math.max(input.getBoundingClientRect().bottom + scrollY - innerHeight, document.documentElement.scrollHeight - innerHeight);
    let over = overflow();
    if (over <= 0) return;
    // 먼저 그림 위아래의 빈 자리를 잘라 낸다. 폭은 그대로라 그림 크기는 바뀌지 않는다.
    if (pic.localName === 'svg' && !pic.dataset.cropped) {
      const vb = pic.viewBox.baseVal, b = pic.getBBox(), pad = 6, top = Math.max(vb.y, b.y - pad), end = Math.min(vb.y + vb.height, b.y + b.height + pad);
      if (vb.height && b.height && end - top < vb.height - 4) {
        const before = pic.getBoundingClientRect().height;
        pic.setAttribute('viewBox', `${vb.x} ${top} ${vb.width} ${end - top}`);
        pic.dataset.cropped = '1';
        over = beside ? overflow() : over - (before - pic.getBoundingClientRect().height);
        if (over <= 0) return;
      }
    }
    const shrink = () => {
      const now = pic.getBoundingClientRect().height;
      let text = Infinity;
      for (const t of pic.querySelectorAll('text')) { const height = t.getBoundingClientRect().height; if (height && t.textContent.trim()) text = Math.min(text, height); }
      const target = Math.max(now - over, now * .45, Number.isFinite(text) ? now * (TEXT_PX + 1) / text : 0);
      // 문서가 정확히 1px 넘친 경우도 맞춘다. 1px 차이를 건너뛰면 세로 태블릿이 1081px에 남는다.
      if (target < now - .1) pic.style.maxHeight = `${target.toFixed(1)}px`;
    };
    shrink();
    // 그림 글자 하한에 닿으면 태블릿에서는 여백과 묻는 글 크기를 먼저 줄인다.
    if (innerWidth > 600 && overflow() > .5) {
      root.classList.add('compact-art');
      pic.style.removeProperty('max-height');
      over = overflow();
      if (over > 0) shrink();
    }
  };
  const observer = new ResizeObserver(entries => {
    if (!pic.isConnected) { observer.disconnect(); return; }
    const next = entries[0].contentRect.width;
    if (Math.abs(next - width) > .5) { width = next; fit(); }
  });
  requestAnimationFrame(() => pic.isConnected && observer.observe(root));
  root.addEventListener('card-layout', fit);
  document.fonts.ready.then(fit);
}
function fitPictures(grid, { rows, size, tiles, restSvg, sameScale, wrapRows, oneRow, arrange, wideRows }) {
  let width = -1, viewport = -1, pending = 0;
  grid.dataset.columns = rows ? 1 : 2;
  const page = document.scrollingElement;
  const wideStack = () => oneRow && tiles.length === 4 && innerWidth >= 1024 && innerWidth >= innerHeight;
  const wideRowGrid = () => wideRows && innerWidth >= 1024 && innerWidth >= innerHeight && innerHeight > 500;
  const overflow = () => {
    const card = grid.closest('.card');
    // 쌓은 모양 두 줄은 첫 답에서 비워 둔 재시도 자리보다 실제 그림 끝을 본다.
    // 빈 알림 자리 때문에 이미 보이는 도형까지 줄이지 않는다.
    if ((wideStack() || wideRowGrid()) && card?.dataset.phase === 'answering') return Math.max(grid.getBoundingClientRect().bottom + scrollY,
      questionEnd(card.querySelector(':scope > .q'))) + SIDE_GAP - innerHeight;
    if (innerWidth > 600 && innerHeight > 500 && card?.dataset.phase === 'answering' && !card.classList.contains('compact-art')) {
      const answer = grid.parentElement, style = getComputedStyle(answer);
      const gap = parseFloat(style.rowGap) || 0;
      const giveUp = getComputedStyle(answer.querySelector('.give-up'));
      const notice = getComputedStyle(answer.querySelector('.retry-notice'));
      // 처음 답의 빈 알림은 가운데 배치에서 뺀다. 다시 풀 때 자리가 빠듯한
      // 그림은 종전처럼 여백부터 줄여, 빈칸을 감췄다고 도형이 작아지지 않는다.
      const reserve = parseFloat(giveUp.minHeight) + parseFloat(notice.height) + gap * 2;
      const padding = ['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'].reduce((sum,key)=>sum+(parseFloat(style[key])||0),0);
      const needed = answer.querySelector('.answer-label').getBoundingClientRect().height + gap + grid.getBoundingClientRect().height + reserve + padding;
      return Math.max(page.scrollHeight - innerHeight, needed - answer.getBoundingClientRect().height);
    }
    if (innerHeight <= 500 && innerWidth > innerHeight) {
      // 높이가 고정된 두 판에서는 가운데 놓인 그림이 넘친 몫의 절반만
      // 문서 높이에 잡힌다. 문제 몸통에 필요한 높이를 온전히 돌려준다.
      const body = card.querySelector('.question-body'), children = [...body.children];
      const needed = children.at(-1).getBoundingClientRect().bottom - children[0].getBoundingClientRect().top;
      const answer = grid.parentElement, style = getComputedStyle(answer);
      const padding = ['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'].reduce((sum,key)=>sum+(parseFloat(style[key])||0),0);
      const inputHeight = answer.querySelector('.answer-label').getBoundingClientRect().height + grid.getBoundingClientRect().height + (parseFloat(style.rowGap)||0) + padding;
      return Math.max(page.scrollHeight - innerHeight, needed - body.getBoundingClientRect().height, inputHeight - answer.getBoundingClientRect().height);
    }
    return page.scrollHeight - innerHeight;
  };
  const spaceNumbers = () => {
    // 번호 딱지의 오른쪽까지 실제 그림이 오는 보기에는 위에 자리를 낸다.
    // 원래 빈 모서리가 넉넉한 끈·시계까지 밀어 도형을 줄이지 않는다.
    const extra = Math.max(0, ...[...grid.children].map(button => {
      const badge = button.querySelector('.picture-number').getBoundingClientRect();
      const tops = [...button.querySelectorAll('svg path,svg circle,svg ellipse,svg polygon,svg polyline,svg rect,svg image,svg line')]
        .filter(node => getComputedStyle(node).visibility !== 'hidden').map(node => node.getBoundingClientRect())
        .filter(r => r.width > 0 && r.height > 0 && r.x < badge.right && r.right > badge.x).map(r => r.y);
      return tops.length ? Math.max(0, badge.bottom + 4 - Math.min(...tops)) : 0;
    }));
    // 같은 줄의 단추 높이가 함께 늘어나므로, 모두 잰 다음 같은 여백을 준다.
    if (extra) for (const button of grid.children) button.style.paddingTop = `${(parseFloat(getComputedStyle(button).paddingTop) + extra).toFixed(2)}px`;
  };
  // 같은 비율 그림: 단추 그림 한 칸이 그림 좌표 1에 몇 px인지를 기준 그림에도 쓴다.
  const match = () => {
    if (sameScale && restSvg) {
      const r = tiles[0].getBoundingClientRect(), scale = Math.min(r.width / size.w, r.height / size.h);
      if (scale) { restSvg.style.maxHeight = 'none'; restSvg.style.width = `${(restSvg.viewBox.baseVal.width * scale).toFixed(1)}px`; }
    }
    // 그림 높이를 맞추면 SVG 속 여백도 달라진다. 마지막 크기에서도 번호와 떼어 둔다.
    spaceNumbers();
  };
  const fit = () => {
    if (!grid.isConnected || width <= 0) return;
    const card = grid.closest('.card');
    if (viewport !== innerWidth) { viewport = innerWidth; card.classList.remove('compact-art'); }
    grid.style.removeProperty('--tile-max');
    for (const button of grid.children) button.style.removeProperty('padding-top');
    if (arrange) size = arrange((width - 20) / 2 - 16);
    restSvg?.style.removeProperty('--boost');
    restSvg?.style.removeProperty('max-height');
    // 지금 그려진 단추에서 번호·글자 높이를 그림 좌표로 잰다(글꼴이 다 오면 다시). 읽히는 가장 작은 배율이 least다.
    const shown = tiles[0].getBoundingClientRect(), now = Math.min(shown.width / size.w, shown.height / size.h);
    if (!now) return;
    let label = Infinity, text = Infinity;
    for (const tile of tiles) for (const t of tile.querySelectorAll('text')) {
      // 낮은 가로 화면의 번호는 그림 밖의 고정 크기 글자로 보인다.
      if (t.hasAttribute('data-panel-label') && innerHeight <= 500 && innerWidth > innerHeight) continue;
      const height = t.getBoundingClientRect().height / now;
      if (!height || !t.textContent.trim()) continue;
      if (t.hasAttribute('data-panel-label')) label = Math.min(label, height); else text = Math.min(text, height);
    }
    const least = Math.max((LABEL_PX + 1) / label, (TEXT_PX + 1) / text);
    const b = getComputedStyle(grid.firstElementChild), inner = ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((s, k) => s + (parseFloat(b[k]) || 0), 0);
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0, maxHeight = parseFloat(getComputedStyle(tiles[0]).maxHeight) || Infinity;
    const readable = (columns) => Math.min(((width - (columns - 1) * gap) / columns - inner) / size.w, maxHeight / size.h) >= least;
    // 쌓은 모양처럼 그림이 한 줄에 놓이기를 알리면(oneRow) 짧은 탑도 넷을 한 줄에 둔다(두 칸이면 넓은 단추에 작은 탑만 남는다).
    // 그림이 셋이면 읽히는 한 한 줄에 셋을 둔다(두 칸이면 한 칸이 빈다, 검수 3번).
    let columns = rows && !(wrapRows && width >= 500 && readable(2)) ? 1 : (oneRow || size.h / size.w >= 2.5 || tiles.length === 3) && readable(tiles.length) ? tiles.length : readable(2) ? 2 : 1;
    if (wideStack() || wideRowGrid()) columns = 2;
    if (!rows && ['solved', 'revealed'].includes(card.dataset.phase) && width >= 900 && readable(tiles.length)) columns = tiles.length;
    grid.dataset.columns = columns;
    grid.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    match();
    if (arrange && innerWidth <= 600) for (const tile of tiles) for (const label of tile.querySelectorAll('[data-group] > text')) {
      const height = label.getBoundingClientRect().height;
      if (height > 0 && height < TEXT_PX) label.setAttribute('font-size', Math.ceil(22 * (TEXT_PX + 1) / height));
    }
    let over = overflow();
    if (over <= 0) return;
    if (innerWidth > 600 && !card.classList.contains('compact-art')) {
      card.classList.add('compact-art');
      requestAnimationFrame(fit);
      return;
    }
    // 낮은 폰 가로에서 한 칸으로 쌓인 보기 넷(끈·들이 견주기, 전개도 등)이 넘치면, 글자가 읽히는 한 2×2로 놓아 마지막 보기를 첫 화면에 올린다.
    // 같은 비율로 견주는 그림도 칸 폭이 모두 같아 비율은 그대로다. 줄지 않으면 되돌린다.
    // 높이가 그림 크기를 정하는 보기(전개도처럼 넓은 단추에 작은 그림)는 두 칸이어도 그림이 줄지 않으니 함께 접는다.
    const scaleAt = (c) => Math.min(((width - (c - 1) * gap) / c - inner) / size.w, maxHeight / size.h);
    if (columns === 1 && tiles.length === 4 && innerHeight <= 500 && innerWidth > innerHeight && (readable(2) || scaleAt(2) >= scaleAt(1) * .95)) {
      columns = grid.dataset.columns = 2;
      grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
      match();
      const after = overflow();
      if (after > over - 1) { columns = grid.dataset.columns = 1; grid.style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))'; match(); }
      else over = after;
      if (over <= 0) return;
    }
    // 줄 맞춰 견주지 않는 줄 그림(wrapRows: 원기둥 전개도)은 한 칸씩으론 화면을 넘치고 두 칸으로 글자가 읽히면(넓은 화면) 두 칸으로 놓는다.
    if (columns === 1 && rows && wrapRows && readable(2)) {
      columns = grid.dataset.columns = 2;
      grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
      match();
      const after = overflow();
      if (after > over - 1) { columns = grid.dataset.columns = 1; grid.style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))'; match(); }
      else over = after;
      if (over <= 0) return;
    }
    if (restSvg && !sameScale) {
      // 그려진 높이가 max-height에 걸려 있을 수 있어 폭에서 본래 높이를 다시 셈한다.
      const r = restSvg.getBoundingClientRect(), vb = restSvg.viewBox.baseVal, natural = r.width * vb.height / vb.width;
      const boost = Math.max(1, 1.5 * (r.height - over) / natural);
      if (natural && boost < 1.5) {
        restSvg.style.setProperty('--boost', boost.toFixed(3));
        const after = overflow();
        if (after > over - 1) restSvg.style.removeProperty('--boost'); else over = after;
        if (over <= 0) return;
      }
      // 폭 상한에 닿은 기준 그림은 boost만 내려도 크기가 그대로다. 실제 높이를 줄이되 글자·무늬 크기는 지킨다.
      const height = restSvg.getBoundingClientRect().height;
      const texts = [...restSvg.querySelectorAll('text')].filter(t => t.textContent.trim()).map(t => t.getBoundingClientRect().height).filter(Boolean);
      const shapes = svg => [...svg.querySelectorAll('[data-object]:not([data-object="blank"])')].map(t => t.getBoundingClientRect().height).filter(Boolean);
      const restShapes = shapes(restSvg), choiceShapes = tiles.flatMap(shapes);
      const minimum = Math.max(48, texts.length ? height * (TEXT_PX + 1) / Math.min(...texts) : 0,
        card.classList.contains('pattern-card') && restShapes.length && choiceShapes.length ? height * Math.min(...choiceShapes) / Math.min(...restShapes) : 0);
      const target = Math.max(minimum, height - over - 2);
      if (target < height - .1) {
        restSvg.style.maxHeight = `${target.toFixed(1)}px`;
        const after = overflow();
        if (after > over - .5) restSvg.style.removeProperty('max-height'); else over = after;
        if (over <= 0) return;
      }
    }
    const lines = Math.ceil(tiles.length / columns);
    // 그림 크기를 맞춘 뒤 번호 여백이 조금 더 필요할 수 있다. 실제 남은
    // 넘침으로 다시 맞추되, 글자 하한과 효과 없는 조절을 되돌리는 규칙은 같다.
    for (let pass = 0; pass < 4; pass++) {
      const current = tiles[0].getBoundingClientRect().height;
      const target = Math.max(48, least * size.h, current - (over + 2) / lines);
      if (target >= current - 1) return;
      const previous = grid.style.getPropertyValue('--tile-max');
      grid.style.setProperty('--tile-max', `${target.toFixed(1)}px`);
      match();
      const after = overflow();
      // 왼쪽 문제 글이 더 길어 그림을 줄여도 높이가 그대로면 되돌린다.
      if (after > over - 1) {
        if (previous) grid.style.setProperty('--tile-max', previous); else grid.style.removeProperty('--tile-max');
        match(); return;
      }
      over = after;
      if (over <= 0) return;
    }
  };
  const observer = new ResizeObserver(entries => {
    if (!grid.isConnected) { observer.disconnect(); return; }
    const next = entries[0].contentRect.width;
    if (Math.abs(next - width) > .5) {
      width = next;
      // 관찰 중 보기 높이를 바꾸면 WebKit에서 같은 판의 관찰 알림이 겹친다.
      // 다음 화면 갱신에서 한 번만 고쳐 관찰과 배치를 나눈다.
      if (!pending) pending = requestAnimationFrame(() => { pending = 0; fit(); });
    }
  });
  observer.observe(grid);
  requestAnimationFrame(() => grid.closest('.card')?.addEventListener('card-layout', fit));
  document.fonts.ready.then(fit);
  return grid;
}

const SLOT_NAMES = { w: '자연수', n: '분자', d: '분모' };
const HOLD_DELAY_MS = 400, HOLD_REPEAT_MS = 70;

function numpadView(p, submit, root, isLocked, giveUp, label, startWhole) {
  const kind = padFor(p);
  const max = p.maxDigits ?? 6;
  let text = '';
  const mixed = p.mixedInput || (kind === 'fraction' && parseAnswer('fraction', p.answer)?.w > 0);
  const fields = kind === 'fraction' ? (mixed ? ['w', 'n', 'd'] : ['n', 'd']) : kind === 'pair' ? ['a', 'b'] : [];
  const values = { w: '', n: '', d: '', a: '', b: '' };
  // 첫 칸: 자연수 칸이 있고 이 틀의 답에 자연수 부분이 나올 수 있으면 자연수 칸, 아니면 분자 칸(검수 P-002, 10-20).
  const start = mixed && (startWhole || !p.mixedInput) ? 0 : kind === 'fraction' ? fields.indexOf('n') : 0;
  let active = start;
  // 한 번만 알리는 말(자리 수 끝·길게 눌러 지우기). 다음 누르기에서 지운다.
  let note = null, backs = 0, heldOnce = false;
  const shown = h('span', {});
  const reading = p.readTyped && h('p', { class: 'typed-reading', 'aria-live': 'polite', 'aria-label': '쓴 수의 읽는 말' });
  const ready = () => kind === 'fraction' ? fractionReady(values, mixed) : kind === 'pair' ? pairReady([values.a, values.b]) : canon(kind, text) !== null;
  const given = () => kind === 'fraction' ? fractionText(values) : kind === 'pair' ? pairText([values.a, values.b]) : text;
  const hint = () => note ?? (kind === 'fraction' ? fractionHint(values) : kind === 'pair' ? pairHint([values.a, values.b], p.parts) : null);
  const confirm = () => { if (!isLocked() && ready()) { note = null; update(); submit(given()); } };
  const ok = h('button', { class: 'ok', disabled: true, onclick: confirm }, '확인');
  const slots = fields.map((f, i) => h('button', { class: 'answer-slot', 'data-field': f, 'aria-label': kind === 'fraction' ? SLOT_NAMES[f] : `답 ${i + 1}`, onfocus: () => { if (!isLocked()) { active = i; update(); } }, onclick: () => { if (!isLocked()) { active = i; update(); } } }, ''));
  const update = () => {
    shown.replaceChildren(...textParts(text));
    if (reading) {
      const digits = text.replace(/^0+(?=\d)/, '');
      const groups = digits.match(/\d{1,4}(?=(?:\d{4})*$)/g) ?? [];
      reading.textContent = groups.map((group, i) => Number(group) ? `${Number(group)}${['', '만', '억', '조'][groups.length - 1 - i] ?? ''}` : '').filter(Boolean).join(' ') || (digits ? '0' : '');
    }
    // 빈 분수 칸에는 칸 이름을 흐리게 쓴다. 빈 네모만으로는 어느 칸인지 모른다(검수 P-002).
    slots.forEach((slot, i) => { slot.replaceChildren(values[fields[i]] || (kind === 'fraction' ? h('span', { class: 'slot-name' }, SLOT_NAMES[fields[i]]) : '')); slot.setAttribute('aria-pressed', String(active === i)); });
    ok.disabled = isLocked() || !ready();
    // 확인이 잠긴 까닭·자리 수 끝은 「답을 써요」 자리에 한 줄로 알린다(검수 P-004·P-005).
    const message = isLocked() ? null : hint();
    label.textContent = message ?? '답을 써요';
    label.classList.toggle('hint', message != null);
  };
  const bump = () => { box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump'); };
  // quiet: 누르고 있는 동안 저절로 지우는 것. 길게 누르기 알림을 띄우지 않는다.
  const press = (key, quiet = false) => {
    if (isLocked()) return;
    note = null;
    if (key === 'clear') { text = ''; for (const f of fields) values[f] = ''; active = start; backs = 0; update(); return; }
    const before = fields.length ? values[fields[active]] : text;
    const after = kind === 'decimal' ? pressDecimal(before, key, max) : pressKey(before, key, max);
    if (fields.length) values[fields[active]] = after; else text = after;
    backs = key === 'back' ? backs + 1 : 0;
    if (/^\d$/.test(key) && after === before && isFull(before, max)) { note = `숫자는 ${max}개까지 써요`; bump(); }
    // 지우기를 거듭 누르는데 아직 많이 남았으면 누르고 있기를 알려 준다(검수 P-006). 한 번 해 봤으면 다시 알리지 않는다.
    else if (!quiet && !heldOnce && backs >= 3 && after.length >= 2) note = '길게 누르면 쭉 지워져요';
    update();
  };
  // 지우기는 누르는 순간 한 글자를 지우고, 누르고 있으면 폰 자판처럼 쭉 지운다(검수 P-006). 누른 뒤 따라오는 click은 버린다.
  let hold = null, pressedByPointer = false;
  const current = () => fields.length ? values[fields[active]] : text;
  const stopHold = () => clearTimeout(hold);
  const repeatBack = () => { heldOnce = true; press('back', true); if (current() !== '' && !isLocked()) hold = setTimeout(repeatBack, HOLD_REPEAT_MS); };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', ...(kind === 'decimal' ? ['.'] : [])].map((k) => k === 'back'
    ? h('button', { class: 'back-key', 'aria-label': '지우기',
      onclick: (e) => { if (pressedByPointer && e.detail) { pressedByPointer = false; return; } pressedByPointer = false; press('back'); },
      onpointerdown: (e) => { if (e.button !== 0) return; stopHold(); pressedByPointer = true; press('back'); hold = setTimeout(repeatBack, HOLD_DELAY_MS); },
      onpointerup: stopHold, onpointerleave: stopHold, onpointercancel: stopHold, oncontextmenu: (e) => e.preventDefault() }, '지우기')
    : h('button', { onclick: () => press(k), 'aria-label': k }, k === '.' ? h('span', { class: 'dot-key', 'aria-hidden': 'true' }) : k));
  // 노트북·큰 화면은 자판으로도: 숫자, 지우기(Backspace), 확인(Enter)
  root.addEventListener('keydown', (e) => {
    // 답한 뒤에는 키를 가로채지 않는다(Enter가 「다음」 단추에 가야 한다)
    if (isLocked()) return;
    // 「모르겠어요」에 초점이 있으면 Enter·띄어쓰기는 그 단추를 누르는 것이다.
    if (e.target === giveUp && (e.key === 'Enter' || e.key === ' ')) return;
    if (/^\d$/.test(e.key) || (kind === 'decimal' && e.key === '.')) press(e.key);
    else if (e.key === 'Backspace') press('back', e.repeat);
    else if (e.key === 'Delete') press('clear');
    else if (e.key === '/' && kind === 'fraction') {
      // 자연수 칸에 쓴 수 뒤의 「/」는 그 수가 분자라는 뜻이다(「12/5」). 대분수는 띄어 쓴다(「1 2/3」).
      if (fields[active] === 'w' && values.w !== '' && values.n === '') { values.n = values.w; values.w = ''; }
      active = fields.indexOf('d'); update(); slots[active].focus();
    }
    else if (e.key === ' ' && fields[active] === 'w') { active = fields.indexOf('n'); update(); slots[active].focus(); }
    else if (fields.length && e.key === 'Tab') {
      const slotIndex = slots.indexOf(document.activeElement);
      // 첫 칸 앞·마지막 칸 뒤에서는 브라우저의 기본 초점 순서를 따른다.
      if (slotIndex < 0 || (e.shiftKey ? slotIndex === 0 : slotIndex === fields.length - 1)) return;
      active = slotIndex + (e.shiftKey ? -1 : 1);
      update(); slots[active].focus();
    }
    else if (fields.length && ['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      active = (active + (e.key === 'ArrowLeft' || e.shiftKey ? -1 : 1) + fields.length) % fields.length;
      update(); slots[active].focus();
    }
    else if (e.key === 'Enter') confirm();
    else return;
    e.preventDefault();
  });
  const display = kind === 'fraction' ? h('div', { class: 'fraction-input' },
    mixed && slots[0], h('div', { class: 'stack' }, slots[fields.indexOf('n')],
      h('span', { class: 'fraction-bar', 'aria-hidden': 'true' }), slots[fields.indexOf('d')])) :
    kind === 'pair' ? h('div', { class: 'pair-input' }, ...slots.map((slot, i) => h('span', {}, p.parts?.[i]?.before && h('span', { class: 'unit-label' }, p.parts[i].before), slot, p.parts?.[i]?.after && h('span', { class: 'unit-label' }, p.parts[i].after)))) : shown;
  update();
  const box = h('div', { class: 'display', 'aria-live': 'polite', onanimationend: () => box.classList.remove('bump') }, display, p.answerUnit && h('span', { class: 'unit-label' }, p.answerUnit));
  const pad = h('div', { class: `numpad pad-${kind}` }, reading, box,
    h('div', { class: 'keys' }, ...keys, ok));
  pad.reset = () => {
    text = ''; for (const f of fields) values[f] = '';
    active = start; note = null; backs = 0;
    update();
  };
  return pad;
}

export function wrongAnswerView(p) {
  const spoken = readAloud(p.answerKind ?? (typeof p.answer === 'number' ? 'int' : 'text'), p.answer, p.parts ?? []) + (p.answerUnit ?? '');
  const ending = josa(spoken, '이에요/예요').slice(spoken.length);
  // 「반반이에요」「확실하다」처럼 문장으로 끝나는 정답은 낫표로 묶는다. 「정답은 확실하다예요.」로 나왔다(검수 g5 4).
  // 앱이 붙이는 화면 틀 글이라 「~요」로 끝낸다(결정 대장 10-23 「화면 틀 글은 ~요 그대로」).
  if (/[요다]$/.test(spoken)) return h('p', { class: 'bad' }, '정답은 「', ...answerView(p), '」예요.');
  return h('p', { class: 'bad' }, '정답은 ', ...answerView(p), `${ending}.`);
}

function feedbackView(ctx, p, r, onNext, retried = false) {
  const next = h('button', { class: 'primary', onclick: onNext }, '다음');
  queueMicrotask(() => next.focus({ preventScroll: true }));
  if (r.correct) {
    const a = p.grade >= 5 && p.answerKind === 'fraction' && !p.exactForm && canon('fraction', r.given) !== canon('fraction', p.answer) && parseAnswer('fraction', r.given);
    const gcd = (x, y) => y ? gcd(y, x % y) : x;
    const divisor = a && gcd(a.w * a.d + a.n, a.d);
    const normalized = a && frac(Math.floor((a.w * a.d + a.n) / a.d), (a.w * a.d + a.n) % a.d / divisor, a.d / divisor);
    const simplified = normalized && normalized !== canon('fraction', r.given) ? normalized : null;
    const ending = simplified && josa(readAloud('fraction', simplified), '이에요/예요').slice(readAloud('fraction', simplified).length);
    const formHint = divisor > 1 ? ' 약분하면 ' : simplified && parseAnswer('fraction', simplified).n ? ' 대분수로 나타내면 ' : ' 자연수로 나타내면 ';
    return [
      h('p', { class: 'ok' }, retried ? '다시 풀어서 맞았어요!' : '맞았어요!', simplified ? [formHint, ...answerView({ ...p, answerUnit: null }, simplified), `${ending}.`] : null),
      r.coins > 0 && h('p', {}, `${CURRENCY[ctx.state.town.kind]} ${r.coins}개를 받았어요.`),
      next,
    ];
  }
  return [
    wrongAnswerView(p),
    r.mistake?.say && h('p', {}, ...partsView(promptParts(r.mistake.say), { splitEquals: true })),
    ...solutionLines(p.solution).map(line => h('p', { class: 'solution-line' }, ...partsView(promptParts(line), { splitEquals: true }))),
    h('p', { class: 'sub' }, '이 문제는 며칠 뒤에 또 나와요.'),
    next,
  ];
}

// stage = 이 판이 판정하는 단계 { unit, step }(카드 이름표). 한 판만 넘긴다.
export function problemCard(ctx, item, { onAnswer = null, onRetry = null, onNext = null, mode = 'play', stage = null } = {}) {
  const p = item.problem;
  const kids = p.grade <= 2;
  const started = performance.now();
  const root = h('article', { class: `card${kids ? ' kids' : ''}`, 'data-mode': mode, 'data-phase': 'answering', tabindex: '-1' });
  const fractionAnswer = p.answerKind === 'fraction' && parseAnswer('fraction', p.answer);
  if (fractionAnswer?.w > 0 && fractionAnswer.n > 0 && fractionAnswer.n < fractionAnswer.d) root.classList.add('mixed-answer');
  const feedback = h('div', { class: 'feedback', hidden: true });
  const retryNotice = h('div', { class: 'retry-notice', 'aria-live': 'polite' });
  let locked = false;
  let retryUntil = 0;
  const isLocked = () => locked || performance.now() < retryUntil;
  let pending = null;
  let phase = 'answering';
  let firstGiven = item.result?.given;
  root.cancelPending = () => clearTimeout(pending);

  const submit = (given, btn = null) => {
    if (isLocked()) return;
    if (phase === 'retrying' && p.input === 'choice' && given !== null && same(p.answerKind, given, firstGiven, { exactForm: p.exactForm })) return;
    const retried = phase === 'retrying';
    const r = (retried ? onRetry : onAnswer)?.(given, Math.round(performance.now() - started));
    if (!r) return;
    if (mode === 'play' && !retried && !r.correct) { firstGiven = given; showRetry(); }
    else showResult(given, { ...r, mistake: mixedFormMistake(p, given ?? item.result?.given) ?? (given === null ? p.mistakes.find(m => m.id === item.result?.mistakeId) : r.mistake) ?? null }, btn, retried);
  };
  const giveUp = h('button', { class: 'give-up', disabled: true, 'aria-hidden': 'true', onclick: () => submit(null) }, '모르겠어요');
  const showRetry = () => {
    phase = 'retrying'; locked = false;
    retryUntil = performance.now() + RETRY_INPUT_MS;
    root.dataset.phase = phase; root.classList.add('retrying');
    input.reset?.();
    root.querySelectorAll('.choices button').forEach((b) => { b.disabled = same(p.answerKind, b.choiceValue, firstGiven, { exactForm: p.exactForm }); });
    giveUp.disabled = false; giveUp.removeAttribute('aria-hidden');
    // 다시 풀기 전에는 정답을 보이지 않는다(결정 대장 10-19). 값은 맞고 꼴만 틀렸으면 꼴만 알려 준다. 정답이 든 실수 말은 결과 때 보인다.
    const formMistake = mixedFormMistake(p, firstGiven);
    retryNotice.replaceChildren(...[h('p', {}, '다시 풀어 봐요.'), formMistake && h('p', { class: 'form-mistake' }, '대분수로 나타내 봐요.')].filter(Boolean));
    gradeMark(root, false);
    root.focus({ preventScroll: true });
    if (pictures) requestAnimationFrame(() => root.isConnected && root.dispatchEvent(new Event('card-layout')));
  };
  const showResult = (given, r, btn = null, retried = false) => {
    locked = true;
    phase = r.correct ? 'solved' : 'revealed'; root.dataset.phase = phase;
    root.classList.remove('retrying');
    root.querySelectorAll('.pencil-mark').forEach(mark => mark.remove());
    giveUp.hidden = true;
    // 그림과 풀이를 함께 볼 수 있게 입력 영역을 나누어 쓴다.
    if (pictures) root.append(feedback);
    const display = root.querySelector('.numpad .display');
    if (display && given !== null) display.replaceChildren(...answerView(p, given));
    feedback.dataset.correct = String(r.correct);
    root.querySelectorAll('.choices button, .numpad button').forEach((b) => { b.disabled = true; });
    if (mode === 'drill' && r.correct) {
      gradeMark(root, true, { quick: true });
      pending = setTimeout(onNext, DRILL_CORRECT_MS);
      return;
    }
    btn?.classList.add('picked');
    root.querySelectorAll('.choices button').forEach((b) => { if (same(p.answerKind, b.choiceValue, p.answer, { exactForm: p.exactForm })) b.classList.add('right'); });
    feedback.hidden = false;
    if (mode === 'drill') {
      // 틀리면 멈추고 정답을 보인다. 「다음」을 눌러야 넘어간다(검수 P-021, 10-20 Matto 「틀리면 멈추고 「다음」」).
      const next = h('button', { class: 'primary', onclick: onNext }, '다음');
      const formMistake = mixedFormMistake(p, given);
      feedback.replaceChildren(...[wrongAnswerView(p), formMistake && h('p', {}, ...partsView(promptParts(formMistake.say))), next].filter(Boolean));
      requestAnimationFrame(() => root.isConnected && root.dispatchEvent(new Event('card-layout')));
      gradeMark(root, false, { quick: true });
      if (innerWidth <= 600) feedback.scrollIntoView({ block: 'nearest' });
      next.focus({ preventScroll: true });
      return;
    }
    feedback.replaceChildren(...feedbackView(ctx, p, { ...r, given }, onNext, retried).filter(Boolean));
    requestAnimationFrame(() => root.isConnected && root.dispatchEvent(new Event('card-layout')));
    const top = root.querySelector('.prompt').getBoundingClientRect().top;
    if (top < 0 || top >= innerHeight) window.scrollBy(0, top - 16);
    // 알림 판이 자리를 잡은 뒤에 재야 표시가 문제 칸 안에 맞는다.
    gradeMark(root, r.correct);
  };

  const pictures = panelChoices(p);
  if (pictures) root.classList.add('picture-card');
  if (pictures?.rows) root.classList.add('picture-rows');
  if (pictures?.pattern) root.classList.add('pattern-card');
  if (pictures?.capacity) root.classList.add('capacity-card');
  if (pictures?.graph) root.classList.add('pictograph-card');
  if (pictures && !pictures.rest) root.classList.add('picture-only');
  if (!p.art && !p.numberRow && !p.choiceBox) root.classList.add('text-card');
  if (p.choiceBox) root.classList.add('box-card');
  if (p.numberRow) root.classList.add('row-card');
  const answerLabel = h('p', { class: 'answer-label', 'aria-live': p.input === 'choice' ? null : 'polite' }, pictures ? '그림을 골라요' : p.input === 'choice' ? '답을 골라요' : '답을 써요');
  const startWhole = p.answerKind === 'fraction' && p.mixedInput && typeof item.template?.make === 'function' && answersHaveWhole(item.template);
  const input = p.input === 'choice' ? choicesView(p, submit, pictures) : numpadView(p, submit, root, isLocked, giveUp, answerLabel, startWhole);
  const tag = cardTag(item, { units: ctx.units, templates: ctx.templates, stage });
  root.append(
    h('div', { class: 'q' },
      h('div', { class: 'question-meta' },
        tag && h('span', { class: 'pill unit-pill', 'data-reason': item.reason ?? null }, tag)),
      h('div', { class: 'question-body' },
        h('div', { class: 'grading-target' }, promptView(p.prompt)),
        p.numberRow && numberRowView(p),
        p.choiceBox && p.choices && choiceBoxView(p),
        pictures ? pictures.rest : artView(p))),
    h('div', { class: 'a' }, answerLabel, input, giveUp, retryNotice, feedback));
  if (!pictures) fitArtToScreen(root);
  // 자 안내는 실제로 가로로 밀어야 할 때만 켠다. 그리는 쪽의 문장과 칸은 그대로 쓴다.
  for (const ruler of root.querySelectorAll('.ruler-scroll')) {
    const hint = ruler.parentElement.querySelector('p');
    if (!hint) continue;
    const observer = new ResizeObserver(() => {
      if (!ruler.isConnected) { observer.disconnect(); return; }
      hint.hidden = ruler.scrollWidth <= ruler.clientWidth + 1;
    });
    observer.observe(ruler);
  }
  requestAnimationFrame(() => {
    if (!root.isConnected) return;
    if (item.done && item.result) {
      if (cardPhase(item, mode) === 'retrying') { showRetry(); return; }
      const r = item.retry ?? item.result;
      const mistakeId = r.gaveUp ? item.result.mistakeId : r.mistakeId;
      showResult(r.given, { ...r, mistake: mixedFormMistake(p, r.gaveUp ? item.result.given : r.given) ?? p.mistakes.find(m => m.id === mistakeId) ?? null },
        [...root.querySelectorAll('.choices button')].find(b => b.dataset.value === String(r.given)), !!item.retry);
    } else root.focus({ preventScroll: true });
  });
  return root;
}
