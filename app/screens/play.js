import { h, STRAND_NAME, VILLAGE_NAME, newId } from '../ui.js?v=9a67f36b25';
import { problemCard } from '../card.js?v=9a67f36b25';
import { placeBackdrop } from '../backdrop.js?v=9a67f36b25';
import { CURRENCY } from '../../src/game/village.js?v=9a67f36b25';
import { buildDeck, makeProblems, roundPick } from '../../src/game/deck.js?v=9a67f36b25';
import { answerProblem, retryProblem, finishSession } from '../../src/game/session.js?v=9a67f36b25';
import { sound, soundButton } from '../sound.js?v=9a67f36b25';
import { checkpointRound, clearRound } from '../../src/game/active-round.js?v=9a67f36b25';
import { stepOpen, currentUnit, unitPath } from '../../src/game/units.js?v=9a67f36b25';
import { confirmStop } from '../sheet.js?v=9a67f36b25';
import { roundStage } from '../card-state.js?v=9a67f36b25';

// step = 장소 창에서 고른 단계(지금 곳). 없으면 「지금 여기예요」 단계로 한 판(오늘의 탐험·바로 풀기).
export function play(ctx, { strand = null, step = null, resume = null } = {}) {
  const s = ctx.state;
  const requested=resume?.pick ?? (step!=null?{unit:currentUnit(s,unitPath(ctx.units,ctx.templates,s.study??s.grade),ctx.templates)?.id,step}:null);
  if(requested && !stepOpen(s,requested.unit,ctx.templates,requested.step))return h('section',{class:'screen'},
    h('p',{class:'note',role:'alert'},'앞 단계를 넘기면 열려요'),
    h('div',{class:'actions'},h('button',{onclick:()=>ctx.go('home')},'지도로')));
  const pick = resume?.pick ?? (strand ? null : roundPick({ state: s, templates: ctx.templates, units: ctx.units, step }));
  const normalDeck = resume ? resume.items : buildDeck({ state: s, templates: ctx.templates, units: ctx.units, today: ctx.today, rng: ctx.rng, strand, pick });
  // 고른 단계를 열 수 없거나 판에 그 단계가 아닌 문제가 끼면, 몰래 다른 판을 내지 않고 오류를 띄운다(10-17 Matto 「엉뚱한거 누르면 에러라고 뜨게」).
  if (step != null && !strand && (!pick || !normalDeck.length || normalDeck.some((d) => d.template.unit !== pick.unit || d.step !== pick.step))) {
    console.error('고른 단계 판을 만들지 못했어요', { step, pick, deck: normalDeck.map((d) => `${d.template.id}#${d.step}`) });
    return h('section', { class: 'screen' },
      h('p', { class: 'note', role: 'alert' }, `${step}단계 문제를 열지 못했어요. 지도에서 단계를 다시 골라 주세요.`),
      h('div', { class: 'actions' }, h('button', { onclick: () => ctx.go('home') }, '지도로')));
  }
  const deck = normalDeck;
  if (!deck.length) {
    return h('section', { class: 'screen' },
      h('p', { class: 'note' }, strand
        ? `${s.study}학년 ${STRAND_NAME[strand]} 문제는 아직 준비 중이에요.`
        : `${s.study}학년 문제는 아직 준비 중이에요. 학습 진도를 바꿔 볼까요?`),
      h('div', { class: 'actions' }, h('button', { onclick: () => ctx.go('home') }, '지도로'), h('button', { onclick: () => ctx.go('grade') }, '학습 진도')));
  }
  const items = resume?.items ?? makeProblems(deck, ctx.rng);
  const stage = roundStage(items, pick);
  const id = resume?.id ?? newId();
  const date = resume?.date ?? ctx.today;
  let finished = false;
  let i = resume?.index ?? 0;
  const checkpoint = () => { checkpointRound(s, { id, date, screen: 'play', args: { strand, step }, pick, items, index: i }); ctx.save(); };
  const root = h('section', { class: 'screen play paper-screen' });
  const backdrop = placeBackdrop(ctx);
  ctx.cleanup = backdrop.cleanup;

  const finish = (completed) => {
    if (finished) return;
    finished = true;
    const { summary, retry, events, evaluations } = finishSession(s, items, { today: ctx.today, mode: strand ?? 'mix', id, completed, templates:ctx.templates, pick });
    clearRound(s);
    ctx.save();
    if (events.length) sound.play('celebrate');
    // 한 판 더: 고른 단계를 못 넘겼으면 그 단계를 다시, 넘겼으면 「지금 여기예요」 단계로(지금 단계 판과 같은 걸음).
    const retryStep = pick && !evaluations.some((e) => e.unit === pick.unit && e.level === pick.step && e.passed);
    ctx.go('result', { summary, retry, events, again: retryStep ? { strand: null, step: pick.step } : { strand }, completed });
  };
  const show = () => {
    if (i >= items.length) return finish(true);
    checkpoint();
    const item = items[i];
    root.replaceChildren(
      backdrop.el,
      h('h1', { class: 'sr-only' }, '한 판 풀기'),
      h('header', { class: 'bar' },
        h('div', { class: 'pill round-number' }, `${i + 1} / ${items.length}`),
        h('div', { class: 'round-place' }, h('span', { class: 'pill round-currency' }, `${CURRENCY[s.town.kind]} ${s.coins}`),
          h('span', { class: 'pill' }, VILLAGE_NAME[s.town.kind])),
        h('div', { class: 'round-actions' }, soundButton(), h('button', { class: 'link pill', onclick: () => confirmStop(items.filter((it) => it.result).length, () => finish(false)) }, '그만하기'))),
      h('div', { class: 'progress' }, h('i', { style: `width:${(100 * i) / items.length}%` })),
      problemCard(ctx, item, {
        stage,
        onAnswer: (given, ms) => {
          const r = answerProblem(s, item, given, { ms, today: ctx.today, templates: ctx.templates });
          if (r) {
            // 맞힘·틀림 소리는 카드가 동그라미·빗금과 같이 낸다.
            checkpoint();
            root.querySelector('.round-currency').textContent = `${CURRENCY[s.town.kind]} ${s.coins}`;
          }
          return r;
        },
        onNext: () => { i++; show(); },
        onRetry: (given, ms) => {
          if (finished) return null;
          const r = retryProblem(s, item, given, { ms });
          if (r) {
            checkpoint();
            root.querySelector('.round-currency').textContent = `${CURRENCY[s.town.kind]} ${s.coins}`;
          }
          return r;
        },
      }));
    // 새 문제는 맨 위(판 번호·이름표)부터 보인다. 폰에서 앞 문제의 「다음」까지 내려 왔어도(10-20).
    window.scrollTo(0, 0);
  };
  show();
  return root;
}
