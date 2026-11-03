// 아이의 나가기. 서버에 기록을 보낸 뒤 이 기기의 로그인만 비운다.
import { h } from './ui.js?v=47133803ae';
import { openSheet } from './sheet.js?v=47133803ae';
import { lockSheet } from './sheet-lock.js?v=47133803ae';
import { call } from './net.js?v=47133803ae';
import { recoverRound } from '../src/game/active-round.js?v=47133803ae';
import { loadLink, loadLost, clearLink, clearLost, leavePending } from '../src/game/link.js?v=47133803ae';

export function kidLogoutButton(ctx) {
  if (!ctx.api || !ctx.state?.student || !(loadLink(ctx.linkStorage) || loadLost(ctx.linkStorage))) return null;
  return h('button', { type: 'button', class: 'pill kid-logout', onclick: () => openKidLogout(ctx) }, '나가기');
}

function openKidLogout(ctx) {
  const root = document.getElementById('app');
  if (root.querySelector('.kid-logout-sheet')) return;
  let busy = false, ended = false, done = false;
  const message = h('p', { class: 'kid-logout-message', role: 'status' });
  const go = h('button', { type: 'button', class: 'primary', onclick: leave }, '나가기');
  const cancel = h('button', { type: 'button', onclick: () => close() }, '취소');
  const close = openSheet(root, { label: '이 기기에서 나갈까요?', className: 'kid-logout-sheet',
    onClose: () => { if (ended && !done) ctx.go('home'); },
  }, h('h2', {}, '이 기기에서 나갈까요?'),
  h('p', {}, '다시 들어올 때 반 코드와 내 번호를 넣어요.'),
  h('p', { class: 'sub' }, '공부 기록과 마을은 그대로 있어요.'),
  message, h('div', { class: 'kid-logout-actions' }, cancel, go));
  // 실수로 Enter를 눌러도 바로 나가지 않도록 취소에서 시작한다.
  cancel.focus({ preventScroll: true });

  async function leave() {
    if (busy) return;
    busy = true;
    go.textContent = '기록을 보내는 중…';
    const unlock = lockSheet(go.closest('.sheet'));
    try {
      if (!ended) {
        if (ctx.finishForLogout) ctx.finishForLogout();
        else if (ctx.state.activeRound) {
          // 다른 탭의 저장으로 지도에 돌아온 경우도, 답한 문제의 요약으로 판을 마감한다.
          delete ctx.state.activeRound;
          recoverRound(ctx.state, ctx.templates, ctx.today);
          ctx.save();
        }
        ended = true;
      }
      await ctx.sync?.now();
      if (!go.isConnected) return;
      const link = loadLink(ctx.linkStorage);
      // 보내지 못한 기록을 지우는 선택은 없다. 취소하거나 다시 보낼 수 있다.
      if (leavePending(ctx.state, link ?? loadLost(ctx.linkStorage))) {
        message.textContent = '아직 기록을 보내지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.';
        return;
      }
      if (link) {
        const res = await call(ctx.api, '/v1/kid/leave', { token: link.token, timeoutMs: 3000 });
        if (!res.ok && res.status !== 401) {
          message.textContent = '지금은 나가지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.';
          return;
        }
      }
      done = true;
      clearLink(ctx.linkStorage);
      clearLost(ctx.linkStorage); // 앞 아이의 연결 정보를 남기지 않는다
      try { sessionStorage.removeItem('dailymath.welcome'); } catch { /* 저장을 막은 기기 */ }
      close();
      ctx.signOut();
    } finally {
      unlock();
      busy = false;
      go.textContent = '나가기';
    }
  }
}
