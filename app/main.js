// 시작: 기록을 읽고 화면을 고른다. ?demo=3 견본 안에서만 screen·seed 같은 시험용 주소를 듣는다.
import { templates } from '../src/templates/index.js?v=9a67f36b25';
import { makeStore, browserStorage, memoryStorage, STORE_KEY } from '../src/game/store.js?v=9a67f36b25';
import { todayStr } from '../src/game/date.js?v=9a67f36b25';
import { demoState } from '../src/game/demo.js?v=9a67f36b25';
import { recordVisit } from '../src/game/study.js?v=9a67f36b25';
import { villageDemo } from '../src/game/village-demo-data.js?v=9a67f36b25';
import { makeRng, randomSeed } from '../src/engine/rng.js?v=9a67f36b25';
import * as screens from './screens/index.js?v=9a67f36b25';
import { recoverRound } from '../src/game/active-round.js?v=9a67f36b25';
import { apiBase } from './config.js?v=9a67f36b25';
import { connectSync } from './sync-runner.js?v=9a67f36b25';
import { buildReport } from '../src/game/report.js?v=9a67f36b25';

const query = new URLSearchParams(location.search);
const demo = query.has('demo');
const params = demo ? query : new URLSearchParams();
const units = await (await fetch('../src/curriculum/units.json?v=9a67f36b25')).json();
const today = todayStr();
const store = makeStore(demo ? memoryStorage() : browserStorage());
const root = document.getElementById('app');
const routes = [];
const historyId = randomSeed();
let cursor = -1, generation = 0, bouncing = false, stopAfterBounce = false;
const roundScreen = name => ['play', 'drill'].includes(name);

function refreshFromStorage() {
  const fresh = store.load();
  if (!fresh) return;
  ctx.state = fresh;
  // 다른 창의 판은 이 창에서 이어 하지 않는다. 그 창이 답을 마저 저장한다.
  routes.length = 0;
  cursor = -1;
  ctx.go('home', {}, true);
}

function render(name, args) {
  ctx.cleanup?.();
  ctx.cleanup = null;
  const current = ++generation;
  // 떠난 카드의 예약 동작은 새 화면이나 새 기록을 건드릴 수 없다.
  const scope = Object.create(ctx);
  let state = ctx.state;
  Object.defineProperty(scope, 'state', { get: () => state, set: value => {
    state = value;
    if (generation === current) ctx.state = value;
  } });
  scope.save = () => { if (generation === current) ctx.save(); };
  scope.go = (...a) => { if (generation === current) ctx.go(...a); };
  root.dataset.screen = name;
  const screen = screens[name](scope, args);
  if (generation !== current) return;
  ctx.cleanup = scope.cleanup;
  root.replaceChildren(screen);
  window.scrollTo(0, 0);
}

const ctx = {
  templates, units, store, demo: Boolean(demo), demoWarn: params.has('warn'),
  // 쓸 때마다 오늘을 다시 본다(교실 태블릿을 켜 둔 채 자정을 넘겨도 날짜가 굳지 않게)
  get today() { return todayStr(); },
  rng: makeRng(params.has('seed') ? Number(params.get('seed')) >>> 0 : randomSeed()),
  // Cosmetic visits must not consume the random sequence used by math rounds.
  lifeRng: makeRng(params.has('seed') ? Number(params.get('seed')) >>> 0 : randomSeed()),
  state: demo ? demoState(Number(params.get('demo')) || 3, today, templates, units, params.get('progress')) : store.load(),
  cleanup: null,
  // 견본 사진·확인용(&still): 마을 주민이 움직이지 않는다.
  still: params.has('still'),
  // 견본은 진짜 서버 연결을 건드리지 않는다.
  linkStorage: demo ? memoryStorage() : (browserStorage() ?? memoryStorage()),
  get screen() { return root.dataset.screen ?? null; },
  save() {
    // 켜 둔 채 자정을 넘겨 답해도 그날 접속으로 센다.
    if (!demo && ctx.state?.visits && (!ctx.state.visits.lastDay || ctx.state.visits.lastDay < ctx.today)) recordVisit(ctx.state, ctx.today);
    const saved = store.save(ctx.state);
    if (!saved && store.conflict) refreshFromStorage();
    return saved;
  },
  go(name, args = {}, replace = false) {
    if (name === 'shop') name = 'village';
    if (!screens[name]) name = ctx.state ? 'home' : 'welcome';
    // 다른 창에서 풀던 판이 남아 있으면 새 묶음으로 덮지 않고 그 판부터 잇는다.
    if (roundScreen(name) && ctx.state?.activeRound && !args.resume) {
      const pending = recoverRound(ctx.state, templates, ctx.today, { finishCompleted: true });
      if (!ctx.save()) return;
      if (pending) { name = pending.screen; args = pending.args; }
    }
    if (!ctx.state && name !== 'welcome') name = 'welcome';
    if (ctx.state && name === 'welcome') name = 'home';
    if (name === 'result' && !args.summary) {
      const summary = ctx.state?.outbox.at(-1);
      if (summary) args = { summary };
      else name = 'home';
    }
    if (name === 'drillEnd' && !args.summary) name = 'pick';
    const previous = routes[cursor]?.name;
    if (replace || previous === name || roundScreen(previous) && !roundScreen(name)) {
      if (cursor < 0) cursor = 0;
      routes[cursor] = { name, args };
      history.replaceState({ dm: historyId, index: cursor }, '');
    } else {
      routes.splice(++cursor, Infinity, { name, args });
      history.pushState({ dm: historyId, index: cursor }, '');
    }
    render(name, args);
  },
};

// 맨 앞에서도 한 번의 뒤로 가기가 앱 안에 머물도록 바닥 항목을 둔다.
history.replaceState({ dm: historyId, index: -1 }, '');
history.pushState({ dm: historyId, index: 0 }, '');
addEventListener('popstate', event => {
  const index = event.state?.dm === historyId ? event.state.index : -1;
  if (bouncing) {
    bouncing = false;
    if (stopAfterBounce) {
      stopAfterBounce = false;
      if (!root.querySelector('.stop-sheet')) {
        [...root.querySelectorAll('.round-actions button')].find(b => b.textContent === '그만하기')?.click();
      }
    }
    return;
  }
  if (roundScreen(root.dataset.screen) || index < 0) {
    stopAfterBounce = roundScreen(root.dataset.screen);
    bouncing = true;
    history.go(1);
    return;
  }
  cursor = index;
  const route = routes[cursor];
  if (!route || roundScreen(route.name)) ctx.go('home', {}, true);
  else ctx.go(route.name, route.args, true);
});

// 그림 확인용 견본만 바꾼다. 실제 아이의 기록에는 적용하지 않는다.
if (demo && ctx.state) {
  if (params.get('kind') === 'dog') ctx.state.town.kind = 'dog';
  // 가게 견본은 기록을 저장하지 않는다. full은 모두 큰 가게, some은 빵집과 꽃집이다.
  if (['full','some'].includes(params.get('village'))) villageDemo(ctx.state, units, today, params.get('village'));
}

// 접속 빈도(선생님 화면 순위): 앱을 열 때마다 센다. 견본은 세지 않는다
if (ctx.state && !demo) {
  recordVisit(ctx.state, today);
  ctx.save();
}
// 켜 둔 채 날이 바뀐 뒤 화면을 다시 보면 그날 접속으로 센다(같은 날 창 바꾸기는 세지 않는다)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !ctx.state || demo) return;
  if (ctx.state.visits.lastDay >= ctx.today) return;
  recordVisit(ctx.state, ctx.today);
  ctx.save();
});
addEventListener('storage', event => {
  if (demo || event.key !== STORE_KEY && event.key !== null) return;
  refreshFromStorage();
});

const wanted = params.get('screen') === 'shop' ? 'village' : params.get('screen');
if (demo) window.dmCtx = ctx;
if (demo && wanted === 'welcome') ctx.state = null;
const initial = !ctx.state ? 'welcome' : wanted && screens[wanted] ? wanted : 'home';
const resumed = ctx.state ? recoverRound(ctx.state, templates, today, { finishCompleted: true }) : null;
if (ctx.state) ctx.save();
connectSync(ctx, { base: demo ? null : apiBase(), storage: ctx.linkStorage, buildReport });
ctx.go(resumed?.screen ?? initial, resumed?.args ?? (initial === 'mastery' ? { unit: params.get('unit') ?? undefined } : initial === 'play' && params.has('step') ? { step: Number(params.get('step')) } : initial === 'home' && params.get('first') === '1' ? { firstTime: true } : {}), true);
