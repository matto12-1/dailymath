export { welcome } from './welcome.js?v=9a67f36b25';
import { home as homeScreen } from './home.js?v=9a67f36b25';
import { offerPromotion } from './grade.js?v=9a67f36b25';
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
export { grade } from './grade.js?v=9a67f36b25';
export { play } from './play.js?v=9a67f36b25';
export { result } from './result.js?v=9a67f36b25';
export { mastery } from './mastery.js?v=9a67f36b25';
export { record } from './record.js?v=9a67f36b25';
export { pick } from './pick.js?v=9a67f36b25';
export { drill, drillEnd } from './drill.js?v=9a67f36b25';
export { village } from './village.js?v=9a67f36b25';
export { house } from './house.js?v=9a67f36b25';
export { residentsScreen as residents } from './residents.js?v=9a67f36b25';
