// 집중 훈련: 같은 꼴 한 판과 틀린 문제 다시 풀기. 화면을 떠나면 기다리던 이동도 멈춘다.
import { h, newId } from '../ui.js?v=9a67f36b25';
import { problemCard } from '../card.js?v=9a67f36b25';
import { drillsFor, drillItems, retryItems, recordDrill } from '../../src/game/drill.js?v=9a67f36b25';
import { answerProblem, retryProblem, finishSession } from '../../src/game/session.js?v=9a67f36b25';
import { CURRENCY } from '../../src/game/village.js?v=9a67f36b25';
import { placeBackdrop } from '../backdrop.js?v=9a67f36b25';
import { soundButton } from '../sound.js?v=9a67f36b25';
import { checkpointRound, clearRound } from '../../src/game/active-round.js?v=9a67f36b25';
import { confirmStop } from '../sheet.js?v=9a67f36b25';

export function drill(ctx, { drillId, retry = null, resume = null }) {
  const d = drillsFor(ctx.state, ctx.templates).find((x) => x.id === drillId);
  const t = ctx.templates.find((x) => x.id === d?.templateId);
  if (!d || !t) return h('section', { class: 'screen' }, h('p', { class: 'note' }, '이 훈련은 아직 준비 중이에요.'), h('button', { onclick: () => ctx.go('pick') }, '돌아가기'));

  const items = resume?.items ?? (retry ? retryItems(retry) : drillItems(t, d.count, ctx.rng));
  const isRetry = resume?.args.isRetry ?? !!retry;
  const id = resume?.id ?? newId();
  const date = resume?.date ?? ctx.today;
  let index = resume?.index ?? 0, correct = items.filter(i => i.result?.correct).length, active = true, card = null;
  const checkpoint = () => { checkpointRound(ctx.state, { id, date, screen: 'drill', args: { drillId, isRetry }, items, index }); ctx.save(); };
  const number = h('span', { class: 'chip', style: 'white-space:nowrap' });
  const score = h('span', { class: 'coins', style: 'white-space:nowrap' }, '맞힌 0개');
  const slot = h('div', { class: 'round-slot' });
  const root = h('section', { class: 'screen drill paper-screen' });
  const backdrop = placeBackdrop(ctx);
  const progress = h('i');
  const finish = () => {
    if (!active) return;
    active = false;
    const rec = isRetry ? null : recordDrill(ctx.state, d.id, correct);
    const { summary } = finishSession(ctx.state, items, { today: ctx.today, mode: 'drill:' + d.id, id });
    clearRound(ctx.state);
    ctx.save();
    ctx.go('drillEnd', { d, items, correct, rec, summary, retry: isRetry });
  };
  const stop = () => {
    if (!active) return;
    active = false;
    if (items.some((it) => it.result)) finishSession(ctx.state, items, { today: ctx.today, mode: 'drill:' + d.id, id });
    clearRound(ctx.state);
    ctx.save();
    ctx.go('pick');
  };
  ctx.cleanup = () => { active = false; card?.cancelPending(); backdrop.cleanup(); };
  root.append(backdrop.el, h('header', { class: 'bar' },
    h('h1', { class: 'pill drill-title' }, d.label),
    h('div', { class: 'round-status' },
      number, score, h('div', { class: 'round-actions' }, soundButton(), h('button', { class: 'link small pill', onclick: () => confirmStop(items.filter((it) => it.result).length, stop) }, '그만하기')))),
    h('div', { class: 'progress' }, progress), slot);
  const show = () => {
    if (!active) return;
    if (index >= items.length) return finish();
    checkpoint();
    score.textContent = '맞힌 ' + correct + '개';
    const item = items[index];
    number.textContent = (index + 1) + ' / ' + items.length;
    progress.style.width = (100 * index / items.length) + '%';
    card = problemCard(ctx, item, {
      mode: isRetry ? 'play' : 'drill',
      onAnswer: (given, ms) => {
        if (!active) return null;
        // 훈련 끝 다시 풀기도 드릴 답이다: 단원 진도에 안 들어가고 드릴 돈을 받는다(10-16). 두 번 풀기만 한 판과 같다.
        const r = answerProblem(ctx.state, item, given, { ms, today: ctx.today, templates: ctx.templates, drill: true });
        if (!r) return null;
        // 맞힘·틀림 소리는 카드가 동그라미·빗금과 같이 낸다.
        if (r.correct) correct++;
        score.textContent = '맞힌 ' + correct + '개';
        root.classList.remove('flash-ok', 'flash-bad');
        root.classList.add(r.correct ? 'flash-ok' : 'flash-bad');
        checkpoint();
        return r;
      },
      onNext: () => { if (active) { index++; show(); } },
      onRetry: (given, ms) => {
        if (!active || !isRetry) return null;
        const r = retryProblem(ctx.state, item, given, { ms, drill: true });
        if (r) checkpoint();
        return r;
      },
    });
    slot.replaceChildren(card);
    // 새 문제는 맨 위부터. 틀려서 「다음」까지 내려 왔어도(10-20).
    window.scrollTo(0, 0);
  };
  show();
  return root;
}

export function drillEnd(ctx, args) {
  const { d, items, correct, rec, summary, retry } = args;
  const wrong = items.some((it) => it.result && !it.result.correct);
  const canRetry = wrong && !retry && !args.retryUsed;
  const backdrop = placeBackdrop(ctx);
  ctx.cleanup = backdrop.cleanup;
  return h('section', { class: 'screen result paper-screen drill-result' }, backdrop.el,
    h('header', { class: 'bar' }, h('p', { class: 'pill' }, '집중 훈련을 마쳤어요')),
    h('div', { class: 'result-card paper-surface' },
    h('h1', {}, h('span', { class: 'result-total' }, retry ? '틀린 문제 ' + items.length + '개 중 ' : items.length + '문제 중 '),
      h('strong', { class: 'result-count' }, correct), '개 맞혔어요'),
    rec?.isNew && rec.runs > 1 && h('p', { class: 'hello' }, '가장 많이 맞혔어요!'),
    rec && h('p', { class: 'hello' }, d.label + ' · ' + rec.runs + '판 · 최고 ' + rec.best + '/20'),
    summary.coins > 0 && h('p', { class: 'coins' }, CURRENCY[ctx.state.town.kind] + ' ' + summary.coins + '개를 받았어요.'),
    h('div', { class: 'actions' },
      canRetry && h('button', { class: 'primary', onclick: () => {
        if (args.retryUsed) return;
        args.retryUsed = true;
        ctx.go('drill', { drillId: d.id, retry: items });
      } }, '틀린 문제 다시 풀기'),
      h('button', { class: canRetry ? '' : 'primary', onclick: () => ctx.go('drill', { drillId: d.id }) }, '한 판 더'),
      h('button', { onclick: () => ctx.go('home') }, '지도로'))));
}
