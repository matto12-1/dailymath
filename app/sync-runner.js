// 뒤에서 기록 보내기(설계서 4.4·4.5). 아이는 기다리지 않는다.
// - 언제: 앱을 켤 때(now), 저장 뒤 4초 모아서(soon: 판 끝·가게·지도 고르기), 인터넷이 다시 될 때, 화면을 다시 볼 때.
//   저절로 보낼 때는 보낼 것(안 보낸 판, 서버와 다른 기록)이 있거나 받아 오기(pull)가 걸려 있을 때만 부른다.
//   받아 오기는 켤 때·인터넷이 다시 될 때·화면을 다시 볼 때(마지막으로 맞춘 지 1분 넘었을 때만) 걸고,
//   맞는 답이 오거나 연결·기록이 없으면 푼다. 실패하면 그대로 두어 기다림 사다리가 다시 받아 온다.
//   판을 푸는 동안(play·drill)은 답마다 보내지 않고 끝난 판이 있을 때만 보낸다(서버 한도: 아이 하나 120번/시간).
//   받아 오기도 판을 푸는 동안은 미룬다(판 도중 기록을 올리지 않게. 판이 끝나 저장하면 곧 받아 온다).
// - 한 번에 하나만 돈다. 도는 동안 부른 now()는 끝난 뒤 한 번으로 묶는다.
// - 실패: 연결 실패·서버 오류는 5초·30초·2분·10분 뒤 다시(그 뒤로 10분마다), 429는 retryAfter만큼(그동안 now()도 쉰다),
//   413은 기록과 판을 따로 보내거나 판 수를 절반으로 줄인다. 더 나눌 수 없는 기록·판은 그대로 보관하고 같은 것을 다시 올리지 않는다.
//   400은 고쳐질 때까지 10분 간격(한 번만 남긴다). 401은 연결만 푼다(기록은 둔다): 풀린 연결(반 칸·열쇠,
//   link.js loseLink)을 남기고 알림을 한 번 띄운다(마지막 검토 I1, Ruling R41. 다시 들어가는 길은 탐험 일지).
// - 서버가 꼴이 틀려 받지 않은 판(rejected, Ruling R42)은 보낸 것으로 친다(applySyncResult).
// - 다른 기기 기록(newer)으로 바뀌면: 서버는 「보낸 때의 기록」을 보고 골랐으므로, 그 뒤 기록이 바뀌었으면(판을 끝냈다 등)
//   바꾸지 않고 지금 기록을 다시 보내 서버가 푼 판 수로 다시 고르게 한다. 안 바뀌었으면 지금 화면이
//   home·village·record·residents·house일 때 그 화면을 새 기록으로 다시 그리고 알린다. 그 밖의 화면(판·훈련·결과 등)이면
//   미뤄 두었다가 다음에 그 다섯 화면으로 갈 때, 보낸 때와 견주어 같으면 바꾸고 다르면 다시 보낸다.
import { call } from './net.js?v=9a67f36b25';
import { loadLink, saveLink, loseLink, markSeatReset } from '../src/game/link.js?v=9a67f36b25';
import { unsentRounds, snapshotHash, stateHash, rememberSent, syncBatch, applySyncResult, ROUNDS_PER_SYNC } from '../src/game/sync.js?v=9a67f36b25';
import { lostNote, sentenceLines, SEAT_RESET_NOTE } from './entry-text.js?v=9a67f36b25';

export const SYNC_PATH = '/v1/kid/sync';
export const GATHER_MS = 4000;
export const BACKOFF_MS = [5000, 30000, 120000, 600000];
export const CALM_SCREENS = ['home', 'village', 'record', 'residents', 'house'];
export const BUSY_SCREENS = ['play', 'drill'];
export const LOADED_NOTE = '다른 기기에서 한 기록을 불러왔어요';
export const PULL_GAP_MS = 60 * 1000; // 화면을 다시 볼 때, 마지막으로 맞춘 지 이보다 짧으면 받아 오지 않는다
const RESENDS = 3; // 답을 잃은 내 기록을 서버가 돌려줄 때 한 번에 다시 보내는 횟수
const BATCHES = 8; // 밀린 판이 아주 많으면 여덟 묶음 뒤 4초 쉬어 화면과 서버에 양보한다

const realClock = {
  now: () => Date.now(),
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
};

// 잠깐 떴다 사라지는 알림(모든 화면 위, 누름을 막지 않는다). 모양은 map.css의 .pill, 자리는 link.css의 p.sync-note.
// 아이 앱의 알림은 모두 이것 하나로 띄운다: 보내기 줄(「다른 기기에서 한 기록을 불러왔어요」·연결이 풀린 알림·반 그림을 다시 정할 자리로 켰을 때),
// 들어오기(「하던 ○○ 마을을 불러왔어요」·반 그림을 다시 정할 자리, R51), 탐험 일지 「내 자리」(「반에 들어갔어요」·「열쇠로 다시 이었어요」·「벌써 반에 들어 있어요」).
// 새 알림은 떠 있는 알림을 바꾼다(OOS 5: 다시 들어가면 「반에 들어갔어요」 바로 뒤에 「…불러왔어요」가 와서 같은 자리에 겹쳐 쌓였다).
// 알림마다 4초 뒤에 자기만 지운다.
export function showNote(text) {
  const doc = globalThis.document;
  if (!doc?.body) return;
  for (const old of doc.querySelectorAll('p.sync-note')) old.remove();
  const note = doc.createElement('p');
  note.className = 'pill sync-note';
  note.setAttribute('role', 'status');
  note.textContent = sentenceLines(text); // 두 문장이면 한 문장씩 한 줄(link.css)
  doc.body.append(note);
  setTimeout(() => note.remove(), 4000);
}

// 서버 답 꼴: { rev, accepted: [], rejected?: [], newer?: { rev, state } }. 아니면(와이파이 로그인 쪽 등) 실패로 본다.
const validReply = (data) => data !== null && typeof data === 'object' && Number.isSafeInteger(data.rev) && data.rev >= 0
  && Array.isArray(data.accepted) && (data.rejected === undefined || Array.isArray(data.rejected))
  && (data.newer === undefined || (data.newer !== null && typeof data.newer === 'object' && Number.isSafeInteger(data.newer.rev)));

// main.js가 부른다: 견본이 아니고 서버 주소가 있으면 ctx.api = 주소, ctx.sync = 보내기 줄.
// 아니면 둘 다 null이고 아무것도 감싸지 않는다(지금처럼 기기에만 저장). 이미 돌고 있으면 그것을 돌려준다(두 번 감싸지 않게).
export function connectSync(ctx, { base, ...opts } = {}) {
  if (ctx.sync) return ctx.sync;
  ctx.api = !ctx.demo && base ? base : null;
  ctx.sync = ctx.api ? startSync(ctx, { ...opts, base: ctx.api }) : null;
  return ctx.sync;
}

// buildReport(state, { units, templates })는 ctx.units·ctx.templates로 부른다(report.js).
// fetch·clock·events(online)·doc(visibilitychange)·notify·log는 시험에서 바꿔 끼운다.
export function startSync(ctx, {
  base, storage, buildReport = null, fetch, timeoutMs, clock = realClock, events = globalThis, doc = globalThis.document,
  notify = showNote, log = (...args) => console.warn(...args),
} = {}) {
  if (!base) return null;
  const save = ctx.save;
  const go = ctx.go;
  let timer = null;
  let timerAt = 0;
  let running = null; // 지금 도는 보내기
  let queued = null; // 도는 동안 부른 now()가 기다리는 다음 보내기
  let failures = 0;
  let blockedUntil = 0; // 실패 뒤 이때까지는 저절로 보내지 않는다
  let tooManyUntil = 0; // 429: 이때까지는 now()도 부르지 않는다
  let error = null;
  let errorToken = null; // 실패를 받은 연결의 토큰(새 연결로 바뀌면 그 실패는 지난 것, forgetStale)
  let warned = false;
  let pull = false; // 보낼 것이 없어도 서버에 물어 다른 기기 기록을 받아 온다
  let held = null; // 미뤄 둔 다른 기기 기록 { state, link, hash(그 답을 받은 부름을 보낼 때의 이 기기 기록 해시) }
  let last = null; // 마지막 화면 이동 { name, args }
  let roundLimit = ROUNDS_PER_SYNC;
  let separateState = false;
  let blockedState = null; // 서버가 기록 하나만으로도 413을 준 해시. 바뀌기 전에는 같은 기록을 다시 보내지 않는다.
  let blockedRound = null;
  let sizingToken = null;

  const persist = () => save.call(ctx);

  function schedule(at) {
    if (timer !== null && timerAt <= at) return; // 먼저 잡힌 때에 같이 보낸다(모아 보내기)
    if (timer !== null) clock.clearTimeout(timer);
    timerAt = at;
    timer = clock.setTimeout(fire, Math.max(0, at - clock.now()));
  }

  function soon() {
    schedule(Math.max(clock.now() + GATHER_MS, blockedUntil));
  }

  // 저절로 보낼 것이 있나: 안 보낸 판, 또는 서버와 다른 기록(판을 푸는 동안은 판만)
  function hasWork() {
    const state = ctx.state;
    const link = loadLink(storage);
    if (!state || !link) return false;
    if (unsentRounds(state).length) return true;
    if (BUSY_SCREENS.includes(ctx.screen)) return false;
    return stateHash(state) !== link.lastHash;
  }

  function fire() {
    timer = null;
    if (clock.now() < blockedUntil) return schedule(blockedUntil);
    if (hasWork() || (pull && !BUSY_SCREENS.includes(ctx.screen))) now();
  }

  function failed(status, code, data, token = loadLink(storage)?.token ?? null) {
    failures += 1;
    error = code;
    errorToken = token;
    let wait = BACKOFF_MS[Math.min(failures, BACKOFF_MS.length) - 1];
    if (status === 429) {
      const retry = Number(data?.retryAfter);
      if (Number.isFinite(retry) && retry > 0) wait = Math.max(wait, retry * 1000);
      tooManyUntil = clock.now() + wait;
    } else if (status === 400 || status === 413) {
      failures = Math.max(failures, BACKOFF_MS.length);
      wait = BACKOFF_MS.at(-1);
      if (!warned) {
        warned = true;
        log('서버가 기록 보내기를 받지 않아요', status, code);
      }
    }
    blockedUntil = clock.now() + wait;
    if (timer !== null) clock.clearTimeout(timer);
    timer = null;
    schedule(blockedUntil);
  }

  function succeeded() {
    failures = 0;
    blockedUntil = 0;
    tooManyUntil = 0;
    error = null;
    errorToken = null;
    warned = false;
  }

  // 실패를 받은 연결이 새 연결로 바뀌었으면(풀린 뒤 다시 들어감·열쇠로 다시 이음·반에 들어감) 그 실패는 지난 것: 처음부터.
  // 탐험 일지가 새 연결로 바로 다시 그릴 때 「지금은 기록을 보내지 못하고 있어요」가 남지 않게(3권 2차 고침 4).
  // 연결이 없으면(401로 풀린 채) 그대로 둔다.
  function forgetStale() {
    if (error === null) return;
    const token = loadLink(storage)?.token;
    if (token && token !== errorToken) succeeded();
  }

  function report(state) {
    if (!buildReport) return null;
    try {
      return buildReport(state, { units: ctx.units, templates: ctx.templates });
    } catch (err) {
      log('선생님 화면 요약을 만들지 못했어요', err);
      return null;
    }
  }

  // 다른 기기 기록으로 바꾼다. before = 그 답을 받은 부름을 보낼 때의 이 기기 기록 해시(서버가 보고 고른 기록).
  // 판 번호는 기록을 바꿀 때 같이 바꾼다(바꾸지 않은 채 다시 보내면 서버가 판 수로 다시 고른다).
  function replace(out, link, before) {
    const keep = () => {
      saveLink(storage, { ...link, lastOkAt: out.link.lastOkAt });
      persist(); // 받은 판의 보냄 표시
    };
    if (!CALM_SCREENS.includes(ctx.screen)) {
      held = { state: out.state, link: out.link, hash: before };
      keep();
      return;
    }
    held = null;
    if (stateHash(ctx.state) !== before) {
      // 보낸 뒤 판을 끝냈거나 기록이 바뀌었다: 바꾸지 않고 지금 기록을 다시 보낸다(지금 도는 보내기가 끝난 뒤)
      keep();
      now();
      return;
    }
    ctx.state = out.state;
    saveLink(storage, out.link);
    persist();
    const screen = ctx.screen;
    go.call(ctx, screen, last?.name === screen ? last.args : undefined);
    notify(LOADED_NOTE);
  }

  // 미뤄 둔 기록을 넣는다(조용한 화면으로 갈 때). 넣었으면 true.
  function applyHeld() {
    const waiting = held;
    held = null;
    const link = loadLink(storage);
    if (!ctx.state || link?.token !== waiting.link.token) return false;
    if (stateHash(ctx.state) !== waiting.hash) {
      now(); // 보낸 뒤 판을 끝냈거나 기록이 바뀌었다: 서버가 다시 고르게
      return false;
    }
    waiting.state.outbox = ctx.state.outbox;
    ctx.state = waiting.state;
    const { rev, lastHash, lastOkAt, sent } = waiting.link;
    saveLink(storage, { ...link, rev, lastHash, lastOkAt, sent });
    persist();
    if (lastHash === null) soon();
    return true;
  }

  async function attempt() {
    forgetStale();
    let resends = 0;
    for (let pass = 0; pass < BATCHES; pass++) {
      const link = loadLink(storage);
      if (!link) return 'unlinked';
      const state = ctx.state;
      if (!state) return 'skip';
      if (sizingToken !== link.token) {
        sizingToken = link.token;
        roundLimit = ROUNDS_PER_SYNC;
        separateState = false;
        blockedState = blockedRound = null;
      }
      const hash = stateHash(state);
      const blocked = blockedState === hash;
      const batch = syncBatch(state, link, () => report(state), {
        maxRounds: separateState && hash !== link.lastHash && !blocked ? 0 : roundLimit, omitState: blocked,
      });
      const { payload } = batch;
      const problem = batch.blocked ?? (blocked ? 'state-too-big' : null);
      if ((!payload.state && !payload.rounds.length && problem) || payload.rounds[0]?.id === blockedRound) {
        failed(413, problem ?? 'round-too-big', null, link.token);
        return 'fail';
      }
      // 보낼 때의 기록 해시(서버가 보고 고를 기록). 기록을 빼고 보내면 서버 것과 같다는 뜻이라 lastHash.
      const before = payload.state ? snapshotHash(payload.state) : link.lastHash;
      // 올리는 기록의 해시를 먼저 남긴다(답을 잃어도 다음에 내 기록인지 알아보게)
      if (payload.state) saveLink(storage, rememberSent(link, before));
      const res = await call(base, SYNC_PATH, { body: payload, token: link.token, fetch, timeoutMs });
      const current = loadLink(storage);
      if (current?.token !== link.token || ctx.state !== state) return 'skip'; // 그 사이 연결·기록이 바뀌었다(다른 사람이에요 등)
      if (res.status === 401) {
        const lost = loseLink(storage, ctx.state, clock.now());
        held = null;
        succeeded();
        error = 'bad-token';
        errorToken = link.token;
        if (lost) notify(lostNote(lost)); // 연결이 풀린 그때 한 번(그 뒤로는 연결이 없어 부르지 않는다)
        return 'unlinked';
      }
      if (!res.ok) {
        if (res.status === 413) {
          if (payload.state && payload.rounds.length) separateState = true;
          else if (payload.state) blockedState = before;
          else if (payload.rounds.length > 1) roundLimit = Math.ceil(payload.rounds.length / 2);
          else {
            blockedRound = payload.rounds[0]?.id ?? null;
            failed(413, 'round-too-big', res.data, link.token);
            return 'fail';
          }
          continue; // 답을 받은 판은 아직 없다. 더 작은 몸통으로 같은 순서에서 다시 시작한다.
        }
        failed(res.status, res.data?.error ?? (res.status ? `http-${res.status}` : 'offline'), res.data, link.token);
        return 'fail';
      }
      if (!validReply(res.data)) {
        failed(res.status, 'bad-response', null, link.token);
        return 'fail';
      }
      succeeded();
      // 반 그림을 다시 정할 자리인지(OOS 3)는 답마다 새로: 표시를 달거나 떼고 나서 넣는다(기록을 미뤄 두어도 연결에는 남는다)
      const marked = markSeatReset(current, res.data.seatReset);
      const out = applySyncResult(state, marked, res.data, payload, clock.now());
      if (out.replaced) {
        replace(out, marked, before);
        if (out.resend && ctx.state === out.state) now();
        else if (unsentRounds(ctx.state).length) soon();
        return 'ok';
      }
      held = null; // 더 새 답이 미뤄 둔 기록을 대신한다
      saveLink(storage, out.link);
      persist(); // 받은 판의 보냄 표시
      if (out.resend) {
        if (++resends >= RESENDS) { soon(); return 'ok'; }
        continue;
      }
      if (payload.rounds.length && !payload.rounds.some(r => r.sent)) {
        failed(200, 'bad-response', null, link.token);
        return 'fail';
      }
      if (!unsentRounds(ctx.state).length) {
        if (problem) { failed(413, problem, null, link.token); return 'fail'; }
        return 'ok';
      }
    }
    soon(); // 남은 묶음은 다음 차례에 이어 보낸다(429의 쉬는 시간도 그대로 따른다)
    return 'ok';
  }

  function now() {
    forgetStale();
    if (clock.now() < tooManyUntil) {
      error = 'too-many';
      errorToken = loadLink(storage)?.token ?? null;
      return Promise.resolve('fail');
    }
    if (running) return (queued ??= running.then(again, again));
    running = attempt()
      .then((result) => {
        if (result !== 'fail') pull = false; // 맞는 답을 받았거나 연결·기록이 없다. 실패면 사다리가 다시 받아 온다
        return result;
      })
      .catch((err) => {
        log('기록 보내기 중 오류', err);
        failed(0, 'error');
        return 'fail';
      })
      .finally(() => {
        running = null;
      });
    return running;
  }

  function again() {
    queued = null;
    return now();
  }

  ctx.save = (...args) => {
    const result = save.apply(ctx, args);
    soon();
    return result;
  };
  ctx.go = (name, args, ...rest) => {
    const target = name === 'shop' ? 'village' : name;
    const loaded = held !== null && CALM_SCREENS.includes(target) && applyHeld();
    last = { name: target, args };
    const shown = go.call(ctx, name, args, ...rest);
    if (loaded) notify(LOADED_NOTE);
    return shown;
  };
  events?.addEventListener?.('online', () => {
    if (error === 'offline') {
      failures = 0;
      blockedUntil = 0;
    }
    pull = true;
    soon();
  });
  doc?.addEventListener?.('visibilitychange', () => {
    if (doc.visibilityState !== 'visible') return;
    // 마지막으로 맞춘 지 1분 안이면 받아 오지 않는다(한도 아끼기). 보낼 것이 있으면 soon()이 보낸다.
    const okAt = loadLink(storage)?.lastOkAt;
    if (!(Number.isFinite(okAt) && clock.now() - okAt < PULL_GAP_MS)) pull = true;
    soon();
  });

  pull = true;
  const openedOn = loadLink(storage); // 첫 보내기를 부르기 전에 본 켤 때의 연결
  const opened = now();
  // R51: 반 그림을 다시 정할 자리(seatReset)인 연결로 앱을 켰으면 알림을 한 번 띄운다(들어온 그때만, 보내기마다 띄우지 않는다).
  // 첫 보내기 답을 본 뒤에: 그 사이 다른 기기에서 정했으면(답이 표시를 뗀다) 띄우지 않고, 연결이 풀렸으면(401) 풀린 알림만 뜬다.
  // 그 답이 「다른 기기에서 한 기록을 불러왔어요」를 띄웠으면 이 알림이 그 자리를 바꾼다(할 일이 있는 알림이 남게)
  // 켤 때의 연결 그대로이고 기기 기록이 있을 때만: 기록이 깨져 처음 화면이면 정할 일지가 없고, 그 사이 다른 열쇠로 들어왔으면 그 들어오기가 벌써 알렸다
  if (openedOn?.seatReset) opened.then(() => {
    const link = loadLink(storage);
    if (ctx.state && link?.token === openedOn.token && link.seatReset) notify(SEAT_RESET_NOTE);
  });
  return {
    soon,
    now,
    // 다른 사람이에요 뒤(연결·기록을 지운 다음): 이 기기의 다음 아이가 앞 아이의 실패·기다림·미뤄 둔 기록을 물려받지 않게.
    // 도는 보내기는 끝나면 연결·기록이 바뀐 것을 보고 버린다(attempt).
    reset() {
      if (timer !== null) clock.clearTimeout(timer);
      timer = null;
      held = null;
      sizingToken = null;
      succeeded();
    },
    status() {
      forgetStale();
      const link = loadLink(storage);
      return { linked: Boolean(link), unsent: ctx.state ? unsentRounds(ctx.state).length : 0, lastOkAt: link?.lastOkAt ?? null, error };
    },
  };
}
