import { h, STRAND_NAME, VILLAGE_NAME } from '../ui.js?v=9a67f36b25';
import { placeBackdrop } from '../backdrop.js?v=9a67f36b25';
import { CURRENCY } from '../../src/game/village.js?v=9a67f36b25';
import { availableStrands } from '../../src/game/deck.js?v=9a67f36b25';
import { recommend } from '../../src/game/recommend.js?v=9a67f36b25';
import { DRILLS, drillsFor, drillRecord } from '../../src/game/drill.js?v=9a67f36b25';
import { josa } from '../../src/engine/korean.js?v=9a67f36b25';

export function pick(ctx) {
  const rec = recommend(ctx.state, ctx.templates, ctx.units);
  const isRec = (kind, id) => rec && rec.kind === kind && (kind === 'strand' ? rec.strand === id : rec.drillId === id);
  const drills = drillsFor(ctx.state, ctx.templates);
  const grades = [...new Set(drills.map((d) => d.grade))];
  const backdrop = placeBackdrop(ctx);
  ctx.cleanup = backdrop.cleanup;
  const drillButton = (d) => {
    const rec = drillRecord(ctx.state, d.id);
    return h('button', { class: isRec('drill', d.id) ? 'rec' : '', onclick: () => ctx.go('drill', { drillId: d.id }) },
      d.label, h('span', { class: 'price' }, rec.runs ? `20문제 · ${rec.runs}판 · 최고 ${rec.best}/20` : '20문제 · 아직 안 해 봤어요'),
      isRec('drill', d.id) && h('span', { class: 'badge' }, '오늘 추천'));
  };
  const recName = rec && (rec.kind === 'drill' ? DRILLS.find((d) => d.id === rec.drillId).label : STRAND_NAME[rec.strand]);
  const recLabel = rec && `${recName}${rec.kind === 'strand' ? '만' : ''}`;
  const recParticle = rec && josa(recLabel, '을/를').slice(recLabel.length);
  const groups = grades.map((grade) => h('section', { class: 'drill-group', 'data-grade': grade },
    grades.length > 1 && h('h2', {}, `${grade}학년`),
    h('div', { class: 'cards' }, ...drills.filter((d) => d.grade === grade).map(drillButton))));
  const filters = h('nav', { class: 'year-pills', 'aria-label': '집중 훈련 학년' },
    ...[null, ...grades].map(grade => h('button', { class: 'pill', 'aria-pressed': String(grade === null), onclick: (e) => {
      for (const button of filters.children) button.setAttribute('aria-pressed', String(button === e.currentTarget));
      groups.forEach(group => { group.hidden = grade !== null && Number(group.dataset.grade) !== grade; });
    } }, grade === null ? '모두' : `${grade}학년`)));
  return h('section', { class: 'screen pick paper-screen' }, backdrop.el,
    h('div', { class: 'pick-sheet paper-surface' },
    h('header', { class: 'bar pick-head' }, h('h1', {}, '골라 풀기'), h('button', { class: 'pill', onclick: () => ctx.go('home') }, '지도로')),
    h('div', { class: 'pick-columns' },
    h('section', { class: 'pick-main' },
      rec && h('p', { class: 'hello' }, `오늘은 「${recLabel}」${recParticle} 추천해요. 다시 풀 실수가 ${rec.count}개 있어요.`),
      h('h3', {}, '갈래를 골라요'),
      h('div', { class: 'cards strand-cards' },
      ...availableStrands(ctx.state, ctx.templates, ctx.units).map((st) => h('button', { class: isRec('strand', st) ? 'rec' : '', onclick: () => ctx.go('play', { strand: st }) },
        `${STRAND_NAME[st]}만`, isRec('strand', st) && h('span', { class: 'badge' }, '오늘 추천'))))),
    h('section', { class: 'pick-training' }, h('h3', {}, '집중 훈련'), h('p', { class: 'sub' }, '같은 종류 20문제씩'), grades.length > 1 && filters, ...groups))),
    h('footer', { class: 'paper-foot' }, h('span', { class: 'pill' }, `${CURRENCY[ctx.state.town.kind]} ${ctx.state.coins}`),
      h('span', { class: 'pill' }, VILLAGE_NAME[ctx.state.town.kind])));
}
