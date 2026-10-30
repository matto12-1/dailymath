import { h, STRAND_NAME, placeProgress } from '../ui.js?v=9a67f36b25';
import { CURRENCY } from '../../src/game/village.js?v=9a67f36b25';
import { pendingChests } from '../../src/game/chest.js?v=9a67f36b25';
import { resultUnit, placeInfo } from '../../src/game/map.js?v=9a67f36b25';
import { unitPath, currentUnit, unitInfo } from '../../src/game/units.js?v=9a67f36b25';
import { promptParts, numberRowText } from '../../src/engine/format.js?v=9a67f36b25';
import { placeBackdrop } from '../backdrop.js?v=9a67f36b25';
import { placePicture } from '../place-pic.js?v=9a67f36b25';
import { ISLANDS, islandId } from '../art/map-data.js?v=9a67f36b25';
import { mark } from '../icons.js?v=9a67f36b25';
import { partsView, answerView, artView } from '../card.js?v=9a67f36b25';
import { pencilStamp } from '../pencil.js?v=9a67f36b25';
import { roundPick } from '../../src/game/deck.js?v=9a67f36b25';

// 판 끝. 폰은 한 칸으로 위에서 아래로(결과 한 줄 → 맞힌 수·생선·단계 칸 → 장소·단계 진도 → 단추 → 다음에 또 나와요).
// 넓은 화면(app.css의 같은 조건)은 크림 카드 한 장 안을 칸으로 나눠 한 화면에 다 보인다.
const WIDE = '(min-width: 1024px) and (min-aspect-ratio: 1/1)';
const STAMP = 48; // 단계 칸 표시를 그려 두는 크기(CSS 화소). 칸은 CSS로 40~52px.

// 단계 판정 한 줄. 단계는 차례대로 오르지 않고 고른 단계마다 넘긴다(✓). 넘긴 단계는 못 넘겨도 그대로.
function stageLine(e) {
  if (e.mastered) return '단원 정리를 마쳤어요!';
  if (e.passed) return `${e.level}단계를 ${e.already ? '또 ' : ''}넘겼어요!`;
  if (e.already) return `${e.level}단계는 이미 넘겼어요.`;
  return `${e.level}단계를 더 연습해요.`;
}
// 판정 줄의 둘째 마디(「다음 판에 다시 해요.」 등)는 조금 작게. 글은 한 줄로 이어 읽힌다.
function stageText(e) {
  const line = stageLine(e), at = line.indexOf('. ');
  return at < 0 ? line : [line.slice(0, at + 1), ' ', h('span', { class: 'stage-sub' }, line.slice(at + 2))];
}
// 판정이 없을 때 그 까닭 한 줄(10-17 판정 규칙: 판 중간에 그만둠 · 한 판에 그 단계 문제가 4개보다 적음 · 끝낸 곳).
function reasonLine(ctx, summary, completed) {
  if (completed === false) return '중간에 그만둔 판이라 단계는 그대로예요.';
  if (STRAND_NAME[summary.mode]) return `「${STRAND_NAME[summary.mode]}만」 골라 풀기를 마쳤어요.`;
  const units = summary.units ?? [];
  if (units.length && units.every((id) => ctx.state.units[id]?.mastered)) return '끝낸 곳을 다시 풀었어요. 단계는 그대로예요.';
  return '같은 단계 문제가 4개보다 적게 나와서 단계는 그대로예요.';
}

// 그 단계 문제를 작은 칸으로 늘어놓아 판정을 눈으로: 맞힌 문제(색연필 동그라미)를 앞에, 틀린 문제(빗금)를 뒤에.
// 넘기려면 맞혀야 하는 수만큼 앞 칸을 옅은 초록으로 칠해 두어, 초록 칸이 다 동그라미면 넘김이다.
function stageMarks(e, label) {
  const cells = Array.from({ length: e.total }, (_, i) => {
    const kind = i < e.correct ? 'circle' : 'slash';
    return h('span', { class: 'mark-cell', 'data-mark': kind, 'data-goal': String(i < e.need) }, pencilStamp(kind, { size: STAMP, variant: i % 4 }));
  });
  // 줄마다 칸 수를 고르게(6개까지 한 줄, 7~12개는 두 줄로 반씩).
  const perRow = Math.ceil(e.total / Math.ceil(e.total / 6));
  return h('div', { class: 'stage-marks', 'data-unit': e.unit, 'data-step': e.level },
    h('p', { class: 'marks-label' }, label, ` 중 ${e.correct}개 맞혔어요`),
    h('div', { class: 'mark-cells', role: 'img', style: `--per:${perRow}`, 'aria-label': `${e.total}문제 중 ${e.correct}개 맞힘` }, ...cells),
    h('p', { class: 'marks-note' }, `${e.need}개 맞히면 단계를 넘겨요`));
}

// 단원 단계 진도 점: 넘김 ✓ · 지금 여기예요(주황) · 잠긴 단원 정리(자물쇠) · 나머지는 번호.
function stepDot(s) {
  const state = s.locked ? 'locked' : s.passed ? 'passed' : s.here ? 'here' : 'open';
  const say = { locked: '잠김', passed: '넘김', here: '지금 여기예요', open: '' }[state];
  return h('li', { 'data-step': s.number, 'data-state': state, 'aria-label': `${s.number}단계 ${s.name}${say ? ', ' + say : ''}` },
    s.locked ? mark('lock') : s.passed ? mark('check') : h('span', { 'aria-hidden': 'true' }, s.number));
}

// 다음에 또 나와요: 문제 글과 정답.
function retryItem(p) {
  return h('div', { class: 'note retry-item' },
    h('p', { class: 'retry-q' }, ...partsView(promptParts(String(p.prompt ?? '') + (p.numberRow ? ' ' + numberRowText(p.numberRow) : '')))),
    artView(p),
    p.art && h('p', { class: 'retry-art-hint', hidden: true }, '그림을 옆으로 밀어 보세요'),
    p.answer != null && h('p', { class: 'retry-a' }, h('span', { class: 'retry-label' }, '정답'), ...answerView(p)));
}

// 빈 여백을 먼저 걷는다. 글자가 많은 그림은 글자를 줄이지 않고 그림 칸 안에서 옆으로 볼 수 있게 한다.
function fitRetryArt(list) {
  let active = true, frame = 0;
  const fit = () => {
    if (!active || !list.isConnected) return;
    for (const art of list.querySelectorAll('.art:has(svg)')) {
      const svg = art.querySelector('svg'), width = art.clientWidth;
      if (!width) continue;
      const box = svg.getBBox();
      if (!box.width || !box.height) continue;
      svg.setAttribute('viewBox', `${box.x - 8} ${box.y - 8} ${box.width + 16} ${box.height + 16}`);
      const view = svg.viewBox.baseVal;
      // 실제로 그린 글자 높이를 한 배 크기에서 잰다(기울어진 글자와 그림 안 변환도 포함).
      svg.style.width = `${view.width}px`;
      svg.style.height = `${view.height}px`;
      const letters = [...svg.querySelectorAll('text')].filter(t => t.textContent.trim())
        .map(t => t.getBoundingClientRect().height || t.getBBox().height).filter(h => h > 0);
      const scale = Math.max(Math.min(width / view.width, 140 / view.height), letters.length ? 15 / Math.min(...letters) : 0);
      svg.style.width = `${view.width * scale}px`;
      svg.style.height = `${view.height * scale}px`;
      const scrolls = view.width * scale > width + 1;
      art.tabIndex = scrolls ? 0 : -1;
      art.setAttribute('aria-label', '문제 그림');
      const hint = art.parentElement.querySelector('.retry-art-hint');
      if (hint) hint.hidden = !scrolls;
    }
  };
  const schedule = () => { cancelAnimationFrame(frame); if (active) frame = requestAnimationFrame(fit); };
  const observer = new ResizeObserver(schedule);
  observer.observe(list);
  schedule();
  document.fonts.ready.then(schedule);
  return () => { active = false; cancelAnimationFrame(frame); observer.disconnect(); };
}

// completed = 판을 끝까지 풀었나(play.js). 판정이 없을 때 까닭을 고르는 데만 쓴다.
export function result(ctx, { summary, retry = [], events = [], again = null, completed } = {}) {
  const title = (id) => ctx.units.find((u) => u.id === id)?.title ?? id;
  const evals = summary.evaluations ?? [];
  const strandRound = Boolean(STRAND_NAME[summary.mode]);
  const mastered = events.filter((e) => e.type === 'mastered');
  const doneLines = mastered.map((e) => `「${title(e.unit)}」 단원을 끝냈어요! 보물상자가 생겼어요.`);
  const replay = again ?? { strand: summary.mode === 'mix' || summary.mode.startsWith('drill') ? null : summary.mode };
  const nextPick=!replay.strand && roundPick({state:ctx.state,templates:ctx.templates,units:ctx.units,step:replay.step});
  const backdrop = placeBackdrop(ctx);

  // 맨 먼저·가장 크게: 이번 판 결과 한 줄(단계를 넘었나 / 판정이 없으면 그 까닭).
  const lines = !summary.count ? ['오늘은 여기까지 해요']
    : evals.length ? evals.map((e) => h('span', { class: 'stage-result', 'data-unit': e.unit, 'data-step': e.level, 'data-passed': String(e.passed) },
      stageText(e), !e.mastered && e.name && h('span', { class: 'stage-name' }, e.name)))
      : doneLines.length ? doneLines.map((t) => h('span', { class: 'done-line' }, t))
        : [h('span', { class: 'result-reason' }, reasonLine(ctx, summary, completed))];
  const head = h('div', { class: 'result-head' }, h('h1', { class: 'result-line' }, ...lines),
    evals.length > 0 && doneLines.map((t) => h('p', { class: 'hello' }, t)));

  // 그 곁: 맞힌 수와 받은 생선, 그 단계 문제 칸.
  const score = summary.count > 0 && h('section', { class: 'result-score' },
    h('p', { class: 'result-tally' }, h('span', { class: 'result-total' }, `${summary.count}문제 중 `),
      h('strong', { class: 'result-count' }, summary.correct), '개 맞혔어요'),
    evals.length > 0 && summary.count > evals.reduce((n, e) => n + e.total, 0) && h('p', { class: 'result-other' },
      `나머지 문제 ${summary.count - evals.reduce((n, e) => n + e.total, 0)}개 중 ${summary.correct - evals.reduce((n, e) => n + e.correct, 0)}개 맞혔어요`),
    summary.coins > 0 && h('p', { class: 'coins' }, `${CURRENCY[ctx.state.town.kind]} ${summary.coins}개를 받았어요.`));
  const marks = evals.length > 0 && h('section', { class: 'result-marks' },
    ...evals.map((e) => stageMarks(e, `${evals.length > 1 ? `「${title(e.unit)}」 ` : ''}${e.name === '단원 정리' ? '단원 정리' : `${e.level}단계`} 문제 ${e.total}개`)));

  // 다른 칸: 장소 그림(작게)과 그 단원 단계 진도. 판정한 곳(익힘이면 끝낸 곳)을, 없으면 지금 곳을 보인다.
  const unit = resultUnit(ctx.state, ctx.units, ctx.templates, { mastered: mastered[0]?.unit, evaluated: evals[0]?.unit });
  const island = unit && ISLANDS[islandId(unit.grade, unit.semester)];
  const point = island?.places[unit.id];
  const path = unitPath(ctx.units, ctx.templates, ctx.state.study ?? ctx.state.grade);
  const info = unit && placeInfo(ctx.state, unit.id, ctx.units, ctx.templates, currentUnit(ctx.state, path, ctx.templates));
  const place = info && h('section', { class: 'result-place' },
    point && placePicture(island, point, false),
    h('div', { class: 'result-place-text' },
      h('p', { class: 'result-unit' }, info.unit.title),
      h('p', { class: 'place-progress' }, placeProgress(info)),
      h('ol', { class: 'result-steps', 'aria-label': `${info.unit.title} 단계` }, ...info.steps.map(stepDot))));

  // 그림을 함께 보이는 다시 보기. 좁은 화면에서는 접고, 넓은 화면에서는 칸 안에서 쓸어 올린다.
  retry = [...new Map(retry.filter(p => Object.values(ctx.state.reviews).some(r => r.templateId === p.templateId))
    .map(p => [p.templateId, p])).values()];
  const list = h('div', { class: 'retry-list' }, ...retry.map(retryItem));
  const stopArt = fitRetryArt(list);
  const more = retry.length ? h('details', { class: 'retry-more' }, h('summary', {}, `${retry.length}개 모두 보기`), list) : null;
  const wide = more && globalThis.matchMedia ? globalThis.matchMedia(WIDE) : null;
  const unfold = () => { if (wide) more.open = wide.matches; };
  unfold();
  wide?.addEventListener('change', unfold);
  ctx.cleanup = () => { backdrop.cleanup(); stopArt(); wide?.removeEventListener('change', unfold); };
  const retrySection = retry.length > 0 && h('section', { class: 'retry' }, h('h2', {}, '다음에 또 나와요'), more ?? list);

  // 단추는 지금 그대로: 「지도로」(큰)·「한 판 더」(작은), 익힘이면 「보물상자 열기」가 맨 앞 큰 단추.
  const chest = pendingChests(ctx.state).length > 0;
  const current=currentUnit(ctx.state,path,ctx.templates);
  const destination=nextPick ?? (!replay.strand && current?{unit:current.id,step:unitInfo(ctx.state,current.id,ctx.templates).here}:null);
  const previous=evals[0];
  const replayLabel=destination && previous && (destination.unit!==previous.unit || destination.step!==previous.level)
    ? [destination.unit !== previous.unit ? title(destination.unit) + ' ' : '', h('span', { class: 'next-step' }, `${destination.step}단계 풀기`)] : '한 판 더';
  const actions = h('div', { class: 'actions' },
    chest && h('button', { class: 'primary', onclick: () => ctx.go('mastery') }, '보물상자 열기'),
    h('button', { class: chest ? '' : 'primary', onclick: () => ctx.go('home') }, '지도로'),
    h('button', { onclick: () => ctx.go('play', replay) }, replayLabel));

  // 넓은 화면 칸 나눔(app.css): 다음에 또 나와요가 없으면 [맞힌 수·생선 | 단계 칸 | 장소], 1~4개면 [맞힌 수·단계 칸 | 장소 | 목록],
  // 다섯 개부터는 [맞힌 수·단계 칸·장소를 왼쪽에 쌓고 | 목록을 넓게].
  const kind = ['result-card', 'paper-surface', 'round-result', score && 'has-score', marks && 'has-marks', place && 'has-place', retrySection && 'has-retry',
    retry.length >= 5 && score && place && 'long-retry'].filter(Boolean).join(' ');
  return h('section', { class: 'screen result paper-screen round-end' }, backdrop.el,
    h('header', { class: 'bar' }, h('p', { class: 'pill' }, completed === false ? '여기까지 풀었어요' : strandRound ? '골라 풀기를 마쳤어요' : '탐험 한 판을 마쳤어요')),
    h('div', { class: kind }, head, score, marks, place, actions, retrySection));
}
