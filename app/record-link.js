// 탐험 일지의 반 연결. 기기에만 있던 기록도 반 코드와 번호로 이어 둔다.
import { h } from './ui.js?v=47133803ae';
import { openSheet } from './sheet.js?v=47133803ae';
import { classForm } from './class-form.js?v=47133803ae';
import { call } from './net.js?v=47133803ae';
import { showNote } from './sync-runner.js?v=47133803ae';
import { loadLink, loadLost, saveLink, linkLines, seatPrefill, seatBody, enteredLink, afterRejoin, enterSeat } from '../src/game/link.js?v=47133803ae';
import { snapshot, fromServer } from '../src/game/sync.js?v=47133803ae';
import { newState } from '../src/game/state.js?v=47133803ae';
import { recordVisit } from '../src/game/study.js?v=47133803ae';
import { kidMessage, validEntry, JOINED_NOTE } from './entry-text.js?v=47133803ae';

export function linkPlace(ctx) {
  if (!ctx.api) return null;
  const section = h('section', { class: 'record-link', 'aria-labelledby': 'record-link-title', tabindex: '-1' });
  let closeSheet = null, drawn = '';
  function attach() {
    const form = classForm({ submit: '들어가기', value: seatPrefill(ctx.state, loadLost(ctx.linkStorage)), onCheck: async st => {
      const check = await call(ctx.api, '/v1/kid/class/check', { body: seatBody(st) });
      if (!form.isConnected) return;
      if (!check.ok || !check.data?.classSeat) return kidMessage('check', check);
      const seat = check.data.classSeat;
      const sent = enterSeat(snapshot(ctx.state), seat);
      const res = await call(ctx.api, '/v1/kid/class/join', { token: loadLink(ctx.linkStorage)?.token, body: { ...seatBody(st), state: sent } });
      if (!form.isConnected) return;
      if (!res.ok || !validEntry(res.data)) return kidMessage('join', res);
      let state, link;
      if (res.data.created) {
        state = enterSeat(ctx.state, seat); link = enteredLink(res.data, 'class');
      } else {
        const lost = loadLost(ctx.linkStorage) ?? loadLink(ctx.linkStorage);
        const back = afterRejoin(ctx.state, lost, res.data, 'class', {}, () => {
          const fresh = newState({ kind: ctx.state.town.kind, grade: seat.grade, today: ctx.today, student: sent.student });
          recordVisit(fresh, ctx.today); return fresh;
        });
        // 이미 있던 번호의 주인을 모르면 서버 기록을 따른다.
        if (!lost?.kidId) {
          state = fromServer(res.data.state) ?? newState({ kind: ctx.state.town.kind, grade: seat.grade, today: ctx.today, student: sent.student });
          if (!res.data.state) recordVisit(state, ctx.today);
          link = enteredLink(res.data, 'class');
        } else { state = back.state; link = back.link; }
        enterSeat(state, seat);
      }
      ctx.state = state; ctx.save(); saveLink(ctx.linkStorage, link);
      closeSheet?.(); ctx.go('record'); showNote(JOINED_NOTE); ctx.sync?.now();
    } });
    closeSheet = openSheet(document.getElementById('app'), { label: '반에 들어가기', className: 'link-sheet attach-sheet',
      onClose: () => { closeSheet = null; } }, h('h2', {}, '반에 들어가기'), form);
  }
  function draw() {
    const view = linkLines(ctx.state, loadLink(ctx.linkStorage), ctx.sync?.status() ?? null, ctx.api, loadLost(ctx.linkStorage));
    const sign = JSON.stringify(view);
    if (sign === drawn) return;
    drawn = sign;
    section.dataset.kind = view.kind;
    section.replaceChildren(h('h2', { id: 'record-link-title' }, view.title),
      h('div', { class: 'record-link-lines' }, ...view.lines.map(line => h('p', { class: 'record-link-line', 'data-line': line.id }, line.text))),
      ...(view.buttons.includes('attach') ? [h('div', { class: 'record-link-actions' }, h('button', { type: 'button', 'data-action': 'attach', onclick: attach }, '반에 들어가기'))] : []));
  }
  draw();
  const timer = setInterval(() => { if (section.isConnected) draw(); }, 2000), before = ctx.cleanup;
  ctx.cleanup = () => { clearInterval(timer); closeSheet?.(); before?.(); };
  return section;
}
