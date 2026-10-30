// 탐험 일지 「내 자리」 칸(설계서 4.6·4.7): 이 기기의 연결을 보이고 반에 들어가기·열쇠 만들기·다른 사람이에요를 연다.
// 무엇을 보일지는 linkLines(src/game/link.js, 순수. 제목은 갈래를 따른다: 「내 자리」·「내 마을 열쇠」·「기록 저장」),
// 아이 글·서버 답 읽기는 entry-text.js, 반 칸은 class-form.js(들어오기와 같이 쓴다), 모양은 link.css.
// - 서버 주소가 없으면(ctx.api가 null: 폰 페이지·견본·옛 시험) 칸이 없다(null). 연결 칸을 읽지도 쓰지도, 서버를 부르지도 않는다.
// - 보낸 상태는 칸이 보이는 동안 2초마다 다시 읽는다(판을 끝내고 바로 와도 보내지면 바뀐다). 화면을 떠나면 멈춘다(ctx.cleanup).
// - 반에 들어가기: 시트에 반 칸 → 반 찾기(check) → 처음 온 번호면 비밀 그림 정하기(한 번 더 눌러 확인) → 열쇠 아이는 attach,
//   연결이 없는 기기(기기에만 저장·풀린 반 연결)는 지금 마을을 들고 join(seatRequest).
//   연결이 없는 기기가 이미 있는 번호를 넣으면 그림 단계로(R36(a)): 이미 있는 번호는 그림 누르기, 선생님이 지운 번호는 새로 정하기.
//   그림을 맞혀 그 자리로 다시 들어가면(afterRejoin) 풀린 연결의 그 아이면 연결 판 번호를 0으로 둔다(rejoinLink, 마지막 검토 I2:
//   서버가 판 수로 고른다). 다른 아이 자리면(남의 번호와 그 아이 그림, 공용 기기의 다른 아이) 그 아이 서버 기록을 따르고
//   이 기기의 기록·안 보낸 판은 올리지 않는다(OOS 4).
//   열쇠 아이(attach)는 빈 번호만 받으니 이미 있는 번호면 「이 번호는 벌써 있어요. 선생님께 여쭤봐요.」
//   들어가면 기록에 반 칸·반 학년(enterSeat)을 넣고 연결을 반으로 → 저장 → 탐험 일지를 다시 그리고 → 보내기.
//   답을 잃은 부름(인터넷이 끊겨 [다시]가 뜬 부름)도 서버에서는 처리됐을 수 있어 칸이 기억한다(이 화면에 있는 동안):
//   join으로 보낸 기록 해시와 답을 잃은 부름의 번호·그림. 그 번호를 다시 찾으면 「벌써 있어요」 대신 그림 단계로 가고,
//   서버가 내 마을(created: false)이나 already-in-class를 돌려주면 들어간 것으로 본다. 그림을 바꿔 다시 눌러 403·423이면
//   잃은 그림으로 한 번만 더 해 본다(갈래는 entry-text.js attachOutcome). 그래도 그림이 틀리면(403) 그 번호의 잃은 그림 기억은 버린다.
//   열쇠 아이의 attach가 401(토큰이 죽었다)이면 연결을 풀고(풀린 연결에 열쇠를 남긴다) 그 열쇠로 한 번 다시 이은 뒤(key/login,
//   「열쇠로 다시 이어 하기」와 같은 부름) 새 토큰으로 attach를 한 번 더 한다(keyAttach, OOS 2). join으로는 가지 않는다
//   (두 번째 마을이 생기고 열쇠를 잊는다). 다시 잇지 못하면 그 글을 보이고 열쇠는 남긴다([다시]도 열쇠로 먼저 다시 잇는다).
//   열쇠를 모르는 열쇠 연결만 연결을 풀고 [다시](다음은 join).
// - 풀린 연결(마지막 검토 I1, Ruling R41: 보내기 줄이나 attach가 401을 받았다): 칸에 까닭 한 줄과 첫 단추 「반에 들어가기」
//   (반 칸은 반 코드·학년·반만 채우고 번호는 비운다, R36(c)), 열쇠가 있으면 첫 단추 「열쇠로 다시 이어 하기」(R36(b): 남긴 열쇠로
//   그림만 누른다, key/login → 판 번호 0인 연결). 열쇠 만들기는 없다. 반 없는 열쇠 아이는 반에 들어가기도 없다(OOS 1):
//   열쇠로 다시 이은 뒤 보통 칸에서 들어간다.
// - 반 그림 새로 정하기(OOS 3): 선생님이 그림을 지운 반 자리에 열쇠로 다시 이은 아이(연결의 seatReset, 서버 답이 단다).
//   칸에 까닭 한 줄과 첫 단추. 들어가기와 같은 그림 판(정하고 한 번 더 눌러 확인) → 내 토큰으로 /v1/kid/class/pics
//   (서버는 토큰 주인의 자리만 바꾼다) → 표시를 떼고 알림. 벌써 새로 정한 자리면(409) 표시를 떼고 그 글, 401이면 연결을 푼다.
//   칸이 이 표시를 보이면 보내기를 한 번 불러 자리를 다시 묻는다(다른 기기에서 정했으면 표시가 떨어진다).
// - 열쇠 만들기(기기에만 저장한 아이): 시트에서 key/new(지금 기록과 같이) → 연결을 열쇠로 → 열쇠를 보인다 → 보내기.
// - 다른 사람이에요: 확인 시트(열쇠 아이는 열쇠를 같이, 기기에만 저장한 아이는 「이 마을은 이 기기에만 있어요」와 [그래도 나가기],
//   풀린 연결은 「서버에 보낸 기록은 다시 들어오면 찾을 수 있지만…」(열쇠가 있으면 열쇠도)와 [그래도 나가기])
//   → 보내기 → 못 보낸 판이나 서버에 없는 기록이 남으면 「아직 못 보낸 기록이 있어요」와 [그래도 나가기]
//   → 여기부터 되돌리지 않는다: 시트를 닫지 못하게 막고(✕·[취소]·Esc·바깥 누르기) /v1/kid/leave(토큰이 있을 때만, 실패해도 계속)
//   → 연결·기록을 지우고 보내기 줄을 처음처럼(reset) → 첫 화면.
// 서버를 부르는 동안 누른 단추는 「확인하는 중…」(반 칸·그림 판은 classForm·picPad가 막고, 실패하면 다시 눌린다).
// 서버 답은 시트를 닫거나 화면을 떠난 뒤에 와도 연결·기록에는 넣는다(서버는 이미 바뀌었다). 화면만 다시 그리지 않는다.
import { h } from './ui.js?v=9a67f36b25';
import { openSheet } from './sheet.js?v=9a67f36b25';
import { lockSheet } from './sheet-lock.js?v=9a67f36b25';
import { call } from './net.js?v=9a67f36b25';
import { showNote } from './sync-runner.js?v=9a67f36b25';
import { picPad, keyCard } from './pics.js?v=9a67f36b25';
import { classForm, warnLine } from './class-form.js?v=9a67f36b25';
import {
  loadLink, saveLink, clearLink, loadLost, clearLost, loseLink, linkLines, leavePending, enterSeat, seatRequest, seatPrefill, seatText, seatBody,
  keyLink, enteredLink, attaches, sameKid, afterRejoin, resumedLink, markSeatReset,
} from '../src/game/link.js?v=9a67f36b25';
import { snapshot, snapshotHash } from '../src/game/sync.js?v=9a67f36b25';
import { newState } from '../src/game/state.js?v=9a67f36b25';
import { recordVisit } from '../src/game/study.js?v=9a67f36b25';
import {
  BUSY, KEY_NOTE, PICS_SET_TITLE, PICS_SET_HINT, RESET, SEAT_TAKEN, JOINED_NOTE, LEAVE_NOTE, LEAVE_KEY_NOTE, LOCAL_LEAVE_WARN, UNSENT_WARN,
  LOST_LEAVE_WARN, SEAT_PICS_TITLE, SEAT_EXISTING_HINT, RELOGIN_TITLE, RELOGIN_HINT, RELINKED_NOTE, SEAT_PICS_DONE,
  sentenceLines, kidMessage, retryable, seatSlot, validEntry, validNewKey, attachOutcome, seatPicsOutcome, lostNote,
} from './entry-text.js?v=9a67f36b25';

const REFRESH_MS = 2000;
const LEAVE_WAIT_MS = 5000; // 다른 사람이에요: 토큰 지우기 답을 이만큼만 기다린다(답이 없어도 나간다)
const BUTTONS = { relogin: '열쇠로 다시 이어 하기', setPics: '반 그림 새로 정하기', attach: '반에 들어가기', makeKey: '열쇠 만들기', leave: '다른 사람이에요' };
const ATTACH_PATH = '/v1/kid/class/attach';
const SEAT_PICS_PATH = '/v1/kid/class/pics';
const KEY_LOGIN_PATH = '/v1/kid/key/login';
// 같은 번호인지 견줄 때 쓰는 글
const seatId = (st) => JSON.stringify(seatBody(st));
const samePics = (a, b) => a[0] === b[0] && a[1] === b[1];
const relinked = (res) => Boolean(res?.ok) && validEntry(res.data);

// 열쇠 아이의 반에 들어가기(attach) 부름(OOS 2). send(path, { body, token }) = 서버 부르기(call. 시험은 바꿔 끼운다).
// attach의 길과 토큰은 여기서만 정한다(seatRequest는 갈래와 몸통만).
// - 연결이 있으면 그 토큰으로 attach. 401(토큰이 죽었다)이면 연결을 풀고(풀린 연결에 열쇠·보내기 자리를 남긴다, loseLink)
//   그 열쇠로 한 번 다시 잇고(key/login: 「열쇠로 다시 이어 하기」와 같은 부름) 새 토큰으로 attach를 한 번 더 한다.
// - 연결이 없으면(이 시트에서 토큰이 죽어 풀었다: [다시], 또는 보내기 줄이 먼저 401을 받아 풀었다) 풀린 연결의 열쇠로 먼저 다시 잇고 attach.
// - join으로는 가지 않는다(두 번째 마을이 생기고 열쇠를 잊는다). 다시 잇지 못하면 그 답(login)을 돌려준다(열쇠는 풀린 연결에 남는다).
// - 같은 아이로 다시 이으면 토큰만 바꾸고(반 그림을 다시 정할 자리라는 답이면 그 표시도, markSeatReset) 보내기 자리(판 번호·서버 기록 해시·보낸 해시)는 그대로 쓴다. dead(이 시트에서 401로 푼 연결)가
//   있으면 그것, 없으면 풀린 연결에 남긴 것(resumedLink). 판 번호 0이면 서버가 판 수로 골라, 들어가자마자 넣은 반 칸이 없는 서버 기록으로
//   바뀐다(attach는 서버 기록을 고치지 않는다). 판 번호를 모르는 옛 풀린 연결만 열쇠로 다시 잇기와 같다(afterRejoin: 판 번호 0).
// - 다른 아이 답이면 그 아이 서버 기록을 따른다(afterRejoin, OOS 4). 그 기록을 onState로 먼저 넣고 연결은 그다음에 둔다
//   (거꾸로면 두 번째 attach를 기다리는 사이 보내기 줄이 이 기기 기록과 안 보낸 판을 그 아이 연결로 올린다).
// - blank(서버 기록이 없는 자리의 새 기록)·onState(바꾼 기록 넣기: ctx.state를 바꾸고 저장)는 꼭 넘긴다(빠뜨리면 바로 던진다).
// → { res: attach 답(부르지 않았으면 null), login: key/login 답(부르지 않았으면 null), dead, state(다른 아이면 그 기록, 아니면 받은 state) }
export async function keyAttach(send, { storage, state, body, dead = null, now = Date.now(), blank, onState }) {
  if (typeof blank !== 'function' || typeof onState !== 'function') throw new TypeError('keyAttach: blank·onState를 넘겨야 한다');
  let res = null;
  const link = loadLink(storage);
  if (link) {
    res = await send(ATTACH_PATH, { body, token: link.token });
    if (res?.status !== 401) return { res, login: null, dead, state };
    if (loadLink(storage)?.token === link.token) loseLink(storage, state, now); // 그 사이 새 연결이 생겼으면 그대로 둔다
    dead = link;
  }
  const lost = loadLost(storage);
  if (loadLink(storage) || !attaches(null, lost)) return { res, login: null, dead, state }; // 다시 이을 열쇠가 없다
  const login = await send(KEY_LOGIN_PATH, { body: { key: lost.key, pics: [...lost.pics] } });
  if (!relinked(login)) return { res, login, dead, state };
  const extra = { key: lost.key, pics: [...lost.pics] };
  const kept = (dead ?? lost).kidId === login.data.kidId
    ? (dead ? markSeatReset({ ...dead, token: login.data.token }, login.data.seatReset) : resumedLink(lost, login.data, 'key', extra))
    : null;
  const back = kept ? { state, link: kept } : afterRejoin(state, lost, login.data, 'key', extra, blank);
  if (back.state !== state) onState(back.state); // 기록 먼저, 연결은 그다음
  saveLink(storage, back.link);
  res = await send(ATTACH_PATH, { body, token: back.link.token });
  if (res?.status === 401 && loadLink(storage)?.token === back.link.token) { // 새 토큰도 죽었다: 다시 풀고 열쇠를 남긴다
    loseLink(storage, back.state, now);
    dead = back.link;
  }
  return { res, login, dead, state: back.state };
}

// 반 그림 새로 정하기 부름(OOS 3). send(path, { body, token }) = 서버 부르기(call. 시험은 바꿔 끼운다).
// 연결이 있으면 늘 보낸다: 시트가 열린 사이 보내기 답이 표시를 뗐어도(다른 기기에서 먼저 정했다) 서버가 409로
// 「벌써 새로 정했어요」를 말하게(보내지 않고 닫으면 아이는 새 그림이 정해진 줄 안다, 3권 2차 고침 1회 2).
// 연결이 없을 때만(그 사이 풀렸다) 보내지 않는다.
// → seatPicsOutcome에 보낸 토큰(token)을 붙여 돌려준다. 보내지 않았으면 { go: 'gone', token: null }
export async function seatPicsSend(send, { storage, pics }) {
  const link = loadLink(storage);
  if (!link) return { go: 'gone', token: null };
  return { ...seatPicsOutcome(await send(SEAT_PICS_PATH, { body: { pics }, token: link.token })), token: link.token };
}

// 칸 하나(section.record-link). 서버가 없으면 null.
export function linkPlace(ctx) {
  if (!ctx.api) return null;
  const section = h('section', { class: 'record-link', 'aria-labelledby': 'record-link-title', tabindex: '-1' });
  let drawn = '';
  let closeSheet = null; // 지금 열린 시트 닫기
  // 반에 들어가기에서 답을 잃은 부름의 기억(이 화면에 있는 동안, 시트를 닫았다 열어도 남는다)
  const sentHashes = new Set(); // join으로 보낸 기록 해시
  const lost = []; // 답을 잃은 부름 { seat, pics, join }(같은 번호·같은 길에서 보낸 차례대로)
  const mine = (state) => sentHashes.has(snapshotHash(state));
  // 서버에 기록이 없는 다른 아이 자리로 다시 들어갔을 때의 새 기록(들어오기에서 마을 없이 처음 들어온 것처럼, OOS 4).
  // 탐험 일지에는 마을 고르기가 없어 마을은 이 기기 마을을 쓴다. 학년·반 칸은 들어간 자리 것.
  const blankState = (grade, student = null) => () => {
    const state = newState({ kind: ctx.state?.town?.kind ?? 'cat', grade, today: ctx.today, student });
    recordVisit(state, ctx.today);
    return state;
  };
  // 다른 아이 자리였으면(afterRejoin) 그 아이 기록으로 바꿔 저장한다(이 기기의 안 보낸 판도 같이 버린다)
  const takeState = (state) => {
    if (!state || state === ctx.state) return;
    ctx.state = state;
    ctx.save();
  };

  const view = () => linkLines(ctx.state, loadLink(ctx.linkStorage), ctx.sync?.status() ?? null, ctx.api, loadLost(ctx.linkStorage));
  // 두 문장인 줄(반 그림을 다시 정할 자리)은 한 문장씩 한 줄(폰에서 문장 가운데가 끊기지 않게, link.css)
  const lineView = (line) => (line.id === 'key'
    ? h('div', { class: 'record-link-key', 'data-line': 'key' }, keyCard({ key: line.key, pics: line.pics }))
    : h('p', { class: 'record-link-line', 'data-line': line.id }, line.id === 'reset' ? sentenceLines(line.text) : line.text));
  const actions = { relogin: () => relogin(), setPics: () => setPics(), attach: () => attach(), makeKey: () => makeKey(), leave: () => leave() };

  // 바뀐 것이 있을 때만 다시 그린다(누르던 단추의 초점은 같은 단추로)
  function draw() {
    const v = view();
    const sign = JSON.stringify(v);
    if (sign === drawn) return;
    drawn = sign;
    const focused = section.contains(document.activeElement) ? document.activeElement.dataset.action : null;
    section.dataset.kind = v.kind;
    section.replaceChildren(
      h('h2', { id: 'record-link-title' }, v.title),
      h('div', { class: 'record-link-lines' }, ...v.lines.map(lineView)),
      h('div', { class: 'record-link-actions' }, ...v.buttons.map((name) =>
        h('button', { type: 'button', 'data-action': name, onclick: actions[name] }, BUTTONS[name]))));
    if (focused) section.querySelector(`[data-action="${focused}"]`)?.focus({ preventScroll: true });
  }

  const timer = setInterval(() => { if (section.isConnected) draw(); }, REFRESH_MS);
  const before = ctx.cleanup;
  ctx.cleanup = () => {
    clearInterval(timer);
    closeSheet?.();
    before?.();
  };

  // 시트 하나만 연다. 닫은 뒤 연 단추가 사라졌으면(다시 그림) 초점은 이 칸으로.
  function sheet(label, className, body) {
    closeSheet?.();
    const close = openSheet(document.getElementById('app'), {
      label,
      className: `link-sheet ${className}`,
      onClose: () => {
        if (closeSheet === close) closeSheet = null;
        if (section.isConnected && (!document.activeElement || document.activeElement === document.body)) section.focus({ preventScroll: true });
      },
    }, h('h2', {}, label), body);
    closeSheet = close;
    return close;
  }
  const isOpen = (close) => closeSheet === close;

  // 연결이 바뀐 뒤: 탐험 일지가 아직 보이면 다시 그린다(반 학년이 바뀌면 끝낸 곳·지도도 바뀐다. 자리는 그대로).
  function settled(note) {
    if (ctx.screen === 'record' && section.isConnected) {
      const y = window.scrollY;
      ctx.go('record');
      window.scrollTo(0, y);
      document.querySelector('#app .record-link')?.focus({ preventScroll: true });
    }
    if (note) showNote(note);
    ctx.sync?.now();
  }

  // ── 반에 들어가기 ──
  function attach() {
    const body = h('div', { class: 'link-sheet-body' });
    const close = sheet(BUTTONS.attach, 'attach-sheet', body);
    let turn = 0; // 단계를 바꿀 때마다 하나씩 센다. 지난 단계의 서버 답은 화면에 그리지 않는다
    let dead = null; // 이 시트에서 토큰이 죽어 푼 열쇠 연결(열쇠로 다시 이을 때 판 번호·해시를 이어 쓴다, keyAttach)
    const live = (at) => at === turn && isOpen(close);
    const show = (...children) => {
      turn += 1;
      body.replaceChildren(...children);
    };

    const form = (value, message = null) => {
      show(classForm({ mode: 'attach', value, message, onCheck: (st) => check(st) }));
      body.querySelector('.class-code input')?.focus();
    };

    // 반 찾기. 고칠 것이 있으면 그 글을 돌려준다(반 칸 아래에 보인다).
    async function check(st) {
      const at = turn;
      const res = await call(ctx.api, '/v1/kid/class/check', { body: seatBody(st) });
      if (!live(at)) return;
      const slot = seatSlot(res);
      if (!slot) return kidMessage('attach', res);
      // 이미 있는 번호·선생님이 그림을 지운 번호. 연결이 없는 기기는 그림 단계로(R36(a): 내 자리면 그림을 맞혀 다시 들어간다).
      // 열쇠 아이(attach. 이 시트에서 연결이 풀린 열쇠 아이도)는 답을 잃은 attach가 만든 내 번호일 수 있을 때만 그림 단계로(서버 답이 가린다)
      const joining = !attaches(loadLink(ctx.linkStorage), loadLost(ctx.linkStorage));
      if (slot !== 'new' && !joining && !(slot === 'existing' && lost.some((t) => t.seat === seatId(st) && !t.join))) return SEAT_TAKEN;
      pics(st, joining ? slot : 'new');
    }

    // 그림 판: 처음 온 번호는 정하기, 선생님이 지운 번호는 새로 정하기, 이미 있는 번호(연결 없는 기기)는 누르기
    const pics = (st, slot) => show(
      h('p', { class: 'pill seat' }, seatText(st)),
      slot === 'existing'
        ? picPad({ title: SEAT_PICS_TITLE, hint: SEAT_EXISTING_HINT, onDone: (pair) => send(st, pair, slot) })
        : picPad({ title: PICS_SET_TITLE, hint: slot === 'reset' ? RESET : PICS_SET_HINT, confirm: true, onDone: (pair) => send(st, pair, slot) }),
      h('div', { class: 'link-sheet-links' }, h('button', { type: 'button', class: 'link small', onclick: () => form(st) }, '번호 다시 넣기')),
    );

    async function send(st, pair, slot) {
      const at = turn;
      const req = seatRequest(ctx.state, loadLink(ctx.linkStorage), st, pair, loadLost(ctx.linkStorage));
      const here = lost.filter((t) => t.seat === seatId(st) && t.join === req.join);
      const existing = req.join && slot !== 'new';
      let login = null; // 열쇠로 다시 이은 답(attach가 401이었다, OOS 2)
      const ask = async (picked) => {
        const body = { ...req.body, pics: picked };
        if (req.join) {
          sentHashes.add(snapshotHash(body.state));
          return call(ctx.api, req.path, { body, token: req.token });
        }
        const got = await keyAttach((path, opts) => call(ctx.api, path, opts), {
          storage: ctx.linkStorage, state: ctx.state, body, dead, blank: blankState(ctx.state?.grade), onState: takeState,
        });
        ({ login, dead } = got);
        return got.res;
      };
      let sent = pair;
      const res = await ask(sent);
      if (login && !relinked(login)) { // 열쇠로 다시 잇지 못했다: 그 글. 열쇠는 풀린 연결에 남고 [다시]도 열쇠로 먼저 다시 잇는다
        if (section.isConnected) draw();
        if (!live(at)) return;
        const text = kidMessage('login', login);
        return retryable(login) ? { text, retry: true } : text;
      }
      let out = attachOutcome(res, st, { joined: req.join, existing, mine, lostHere: here.length > 0, pics: sent, lostPics: here[0]?.pics ?? null });
      if (out.go === 'again') { // 답을 잃은 첫 그림으로 한 번만 더(그 답은 다시 「again」이 되지 않는다)
        sent = out.pics;
        out = attachOutcome(await ask(sent), st, { joined: req.join, existing, mine, lostHere: here.length > 0 });
      }
      if (out.forget) { // 그림을 견준 답이 틀렸다: 이 번호의 잃은 그림 기억은 버린다
        for (let i = lost.length - 1; i >= 0; i--) if (lost[i].seat === seatId(st) && lost[i].join === req.join) lost.splice(i, 1);
      }
      if (out.go === 'retry' && !here.some((t) => samePics(t.pics, sent))) lost.push({ seat: seatId(st), pics: [...sent], join: req.join });
      if (out.revoke) call(ctx.api, '/v1/kid/leave', { token: out.revoke, timeoutMs: LEAVE_WAIT_MS }); // 남의 번호로 받은 토큰은 버린다
      if (out.go === 'in') return entered(st, req, out);
      if (out.go === 'class') return inClass(out.text);
      // 토큰이 죽었다(keyAttach가 연결을 풀고 풀린 연결을 남겼다. 기록은 그대로). 열쇠가 있으면 다음 [다시]도 열쇠로 먼저 다시 잇고,
      // 열쇠를 모르면 지금 마을을 들고 join
      if (out.go === 'unlinked' && section.isConnected) draw();
      if (!live(at)) return;
      if (out.go === 'form') return form(out.value, out.text);
      if (out.go === 'retry' || out.go === 'unlinked') return { text: out.text, retry: true };
      return out.text;
    }

    // 들어갔다. 서버에 이미 있던 자리로 다시 들어갔으면(rejoin, afterRejoin): 풀린 연결의 그 아이면 판 번호 0인 연결
    // (서버가 판 수로 고른다, I2), 다른 아이 자리면 그 아이 서버 기록을 따르고 이 기기 것은 올리지 않는다(OOS 4).
    // 풀린 연결에 열쇠가 있었으면 같은 아이 자리에만 남긴다(반에 든 열쇠 아이의 그 열쇠다).
    function entered(st, req, { data, rejoin = false }) {
      if (req.join && rejoin) {
        const was = loadLost(ctx.linkStorage);
        const extra = was?.key && sameKid(was, data) ? { key: was.key, pics: [...was.pics] } : {};
        const back = afterRejoin(ctx.state, was, data, 'class', extra, blankState(st.grade, { classCode: st.classCode, classNo: st.classNo, number: st.number }));
        takeState(back.state);
        saveLink(ctx.linkStorage, back.link);
      } else if (req.join) {
        saveLink(ctx.linkStorage, enteredLink(data, 'class'));
      } else {
        const link = loadLink(ctx.linkStorage);
        if (link) saveLink(ctx.linkStorage, { ...link, mode: 'class' }); // 열쇠·그림은 남긴다(열쇠는 그대로 쓸 수 있다)
      }
      if (ctx.state) {
        enterSeat(ctx.state, st);
        ctx.save();
      }
      if (isOpen(close)) close();
      settled(JOINED_NOTE);
    }

    // 다른 기기에서 이 열쇠로 벌써 반에 들어갔다: 서버가 맞다. 연결을 반으로 맞추고 서버 기록을 받아 온다.
    function inClass(text) {
      const link = loadLink(ctx.linkStorage);
      if (link) saveLink(ctx.linkStorage, { ...link, mode: 'class' });
      if (isOpen(close)) close();
      settled(text);
    }

    form(seatPrefill(ctx.state, loadLost(ctx.linkStorage)));
  }

  // ── 열쇠로 다시 이어 하기(풀린 연결에 열쇠가 있을 때, R36(b)) ──
  // 남긴 열쇠를 보이고 그림 둘만 누른다 → key/login → 판 번호 0인 연결(기록은 그대로 두고 서버가 판 수로 고른다, I2).
  // 답이 풀린 연결과 다른 아이면 그 아이 서버 기록을 따른다(afterRejoin, OOS 4).
  function relogin() {
    const was = loadLost(ctx.linkStorage);
    if (loadLink(ctx.linkStorage) || !was?.key || !ctx.state) return draw();
    const body = h('div', { class: 'link-sheet-body' });
    const close = sheet(BUTTONS.relogin, 'relogin-sheet', body);
    async function login(pair) {
      const res = await call(ctx.api, KEY_LOGIN_PATH, { body: { key: was.key, pics: pair } });
      if (relinked(res)) {
        if (!loadLink(ctx.linkStorage)) {
          const back = afterRejoin(ctx.state, was, res.data, 'key', { key: was.key, pics: [...pair] }, blankState(ctx.state.grade));
          takeState(back.state);
          saveLink(ctx.linkStorage, back.link);
        }
        if (isOpen(close)) close();
        settled(RELINKED_NOTE);
        return undefined;
      }
      if (!isOpen(close)) return undefined;
      if (retryable(res)) return { text: kidMessage('login', res), retry: true };
      return kidMessage('login', res);
    }
    body.replaceChildren(
      h('p', { class: 'pill seat' }, `열쇠 ${was.key}`),
      picPad({ title: RELOGIN_TITLE, hint: RELOGIN_HINT, onDone: (pair) => login(pair) }),
    );
  }

  // ── 반 그림 새로 정하기(OOS 3) ──
  // 선생님이 그림을 지운 반 자리에 열쇠로 다시 이은 아이(link.seatReset). 들어가기와 같은 그림 판(정하고 한 번 더 눌러 확인)으로
  // 내 토큰으로 제 자리에 새 그림을 정한다. 그 사이 그 번호를 넣는 누구나 새 그림을 정해 차지할 수 있어 칸의 첫 단추로 둔다.
  function setPics() {
    if (!loadLink(ctx.linkStorage)?.seatReset) return draw();
    const body = h('div', { class: 'link-sheet-body' });
    const close = sheet(BUTTONS.setPics, 'seat-pics-sheet', body);
    // 표시를 뗀다(정했다·벌써 정한 자리). 그 사이 연결이 바뀌었으면 그대로 둔다
    const unmark = (token) => {
      const link = loadLink(ctx.linkStorage);
      if (link?.token === token) saveLink(ctx.linkStorage, markSeatReset(link, false));
    };
    async function send(pair) {
      const out = await seatPicsSend((path, opts) => call(ctx.api, path, opts), { storage: ctx.linkStorage, pics: pair });
      if (out.go === 'gone') { // 그 사이 연결이 풀렸다(보낼 토큰이 없다)
        if (isOpen(close)) close();
        draw();
        return undefined;
      }
      if (out.go === 'set' || out.go === 'unlinked') {
        let note = SEAT_PICS_DONE;
        if (out.go === 'set') unmark(out.token);
        else note = loadLink(ctx.linkStorage)?.token === out.token ? lostNote(loseLink(ctx.linkStorage, ctx.state, Date.now())) : null;
        if (isOpen(close)) close();
        settled(note);
        return undefined;
      }
      if (out.go === 'already') {
        unmark(out.token);
        if (section.isConnected) draw();
        if (!isOpen(close)) return undefined;
        const ok = h('button', { type: 'button', class: 'primary', onclick: () => close() }, '확인');
        body.replaceChildren(warnLine(out.text), ok);
        ok.focus({ preventScroll: true });
        return undefined;
      }
      if (!isOpen(close)) return undefined;
      return out.go === 'retry' ? { text: out.text, retry: true } : out.text;
    }
    const st = ctx.state?.student;
    body.replaceChildren(
      ...(st && Number.isInteger(st.number) && Number.isInteger(ctx.state.grade) ? [h('p', { class: 'pill seat' }, seatText({ ...st, grade: ctx.state.grade }))] : []),
      picPad({ title: PICS_SET_TITLE, hint: PICS_SET_HINT, confirm: true, onDone: (pair) => send(pair) }),
    );
  }

  // ── 열쇠 만들기(기기에만 저장한 아이) ──
  function makeKey() {
    if (loadLink(ctx.linkStorage) || !ctx.state) return draw();
    const body = h('div', { class: 'link-sheet-body' });
    const close = sheet('내 마을 열쇠', 'key-sheet', body);
    let busy = false;
    async function make() {
      if (busy) return;
      busy = true;
      body.replaceChildren(h('p', { class: 'pic-say', role: 'status' }, BUSY));
      const sent = snapshot(ctx.state);
      const res = await call(ctx.api, '/v1/kid/key/new', { body: { state: sent } });
      busy = false;
      if (res.ok && validNewKey(res.data) && !loadLink(ctx.linkStorage)) {
        saveLink(ctx.linkStorage, keyLink(res.data, sent)); // 같이 보낸 기록을 서버가 판 1로 두었다
        if (section.isConnected) draw();
        ctx.sync?.now();
        if (!isOpen(close)) return;
        const ok = h('button', { type: 'button', class: 'primary', onclick: () => close() }, '확인');
        body.replaceChildren(keyCard(res.data), h('p', { class: 'key-note sentences' }, sentenceLines(KEY_NOTE)), ok);
        ok.focus({ preventScroll: true });
        return;
      }
      if (!isOpen(close)) return;
      const again = h('button', { type: 'button', class: 'primary', onclick: () => make() }, '다시');
      body.replaceChildren(warnLine(kidMessage('new', res)), again);
      again.focus({ preventScroll: true });
    }
    make();
  }

  // ── 다른 사람이에요 ──
  function leave() {
    if (!ctx.state) return draw();
    const link = loadLink(ctx.linkStorage);
    const body = h('div', { class: 'link-sheet-body' });
    const was = link ? null : loadLost(ctx.linkStorage);
    // 열쇠 아이(풀린 연결 포함)는 나가기 전에 열쇠를 다시 보인다(이 기기에만 적혀 있을 수 있다)
    const keyLine = link || was ? view().lines.find((line) => line.id === 'key') : null;
    const keyPart = () => (keyLine
      ? [keyCard({ key: keyLine.key, pics: keyLine.pics }), h('p', { class: 'key-note sentences' }, sentenceLines(LEAVE_KEY_NOTE))]
      : []);
    // 나가기 단추와 [취소]. 지울 것을 알리는 글 아래에서는 나가기를 주황 알약으로 밀지 않는다(둘 다 같은 모양)
    const choice = (label, onGo, primary = true) => {
      const go = h('button', { type: 'button', class: primary ? 'primary' : null, 'data-action': 'go' }, label);
      go.addEventListener('click', () => onGo(go));
      return h('div', { class: 'link-sheet-actions' }, go, h('button', { type: 'button', onclick: () => close() }, '취소'));
    };

    async function out(go, anyway) {
      go.disabled = true;
      go.textContent = BUSY;
      if (!anyway) {
        await ctx.sync?.now();
        if (!isOpen(close)) return; // 보내는 동안 닫았다: 나가지 않는다(아직 아무것도 지우지 않았다)
        if (leavePending(ctx.state, loadLink(ctx.linkStorage))) {
          body.replaceChildren(warnLine(UNSENT_WARN), ...keyPart(), choice('그래도 나가기', (b) => out(b, true), false));
          body.querySelector('[data-action="go"]')?.focus({ preventScroll: true });
          return;
        }
      }
      if (!isOpen(close)) return; // 닫았으면 멈춘다(아직 아무것도 지우지 않았다)
      // 여기부터는 되돌리지 않는다: 시트를 닫지 못하게 막고(취소를 눌러도 된 것처럼 보이지 않게),
      // 이 기기 토큰을 지운 뒤(실패해도 계속) 연결·기록을 지우고 보내기 줄을 처음처럼
      const unlock = lockSheet(body.closest('.sheet'));
      try {
        const current = loadLink(ctx.linkStorage);
        if (current) await call(ctx.api, '/v1/kid/leave', { token: current.token, timeoutMs: LEAVE_WAIT_MS });
        clearLink(ctx.linkStorage);
        clearLost(ctx.linkStorage);
        ctx.store?.clear();
        ctx.state = null;
        ctx.sync?.reset?.();
      } finally {
        unlock();
      }
      close();
      ctx.go('welcome');
    }

    if (link) body.replaceChildren(h('p', { class: 'leave-note sentences' }, sentenceLines(LEAVE_NOTE)), ...keyPart(), choice('나가기', (b) => out(b, false)));
    // 풀린 연결: 서버에 자리가 남아 있을 수 있다(「다시 찾을 수 없어요」라고 하지 않는다). 보낼 수 없으니 바로 [그래도 나가기]
    else if (was) body.replaceChildren(warnLine(LOST_LEAVE_WARN), ...keyPart(), choice('그래도 나가기', (b) => out(b, true), false));
    else body.replaceChildren(warnLine(LOCAL_LEAVE_WARN), choice('그래도 나가기', (b) => out(b, true), false)); // 서버에 없는 마을(R25)
    const close = sheet(BUTTONS.leave, 'leave-sheet', body);
  }

  draw();
  // 반 그림을 다시 정할 자리라고 보이면 서버에 자리를 다시 묻는다(보내기 답이 표시를 달거나 뗀다, OOS 3)
  if (loadLink(ctx.linkStorage)?.seatReset) ctx.sync?.now();
  return section;
}
