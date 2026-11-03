export { welcome } from './welcome.js?v=47133803ae';
import { home as homeScreen } from './home.js?v=47133803ae';
import { offerPromotion } from './grade.js?v=47133803ae';
export function home(ctx, args) {
  const root = homeScreen(ctx, args);
  const cleanup = ctx.cleanup;
  let close;
  const ask = () => {
    if (root.isConnected && document.visibilityState === 'visible') close = offerPromotion(ctx, root) ?? close;
  };
  queueMicrotask(ask);
  document.addEventListener('visibilitychange', ask);
  ctx.cleanup = () => { document.removeEventListener('visibilitychange', ask); close?.(); cleanup?.(); };
  return root;
}
export { grade } from './grade.js?v=47133803ae';
export { play } from './play.js?v=47133803ae';
export { result } from './result.js?v=47133803ae';
export { mastery } from './mastery.js?v=47133803ae';
export { record } from './record.js?v=47133803ae';
export { pick } from './pick.js?v=47133803ae';
export { drill, drillEnd } from './drill.js?v=47133803ae';
export { village } from './village.js?v=47133803ae';
export { house } from './house.js?v=47133803ae';
export { residentsScreen as residents } from './residents.js?v=47133803ae';
