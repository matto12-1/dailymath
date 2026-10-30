// 비밀 그림과 내 마을 열쇠(설계서 4.1~4.3). 그림 아홉 가운데 둘을 차례로 누른다(같은 그림 두 번 됨, 81가지. 2026-10-21 결정·R47).
// 그림 번호는 서버와 같은 약속이다: 0 빵 · 1 책 · 2 꽃 · 3 아이스크림 · 4 사과 · 5 물고기 · 6 컵 · 7 공 · 8 빗
// (두 마을에 다 있는 가게 아이콘, 새로 그리지 않는다. 0~3은 처음 넷 그대로라 먼저 정한 그림도 그대로 맞는다).
// 들어오기(welcome.js)와 탐험 일지(Task 7)가 같이 쓴다. 모양은 link.css, 글·그림 이름·열쇠 글자는 entry-text.js.
import { h } from './ui.js?v=9a67f36b25';
import { SHOP_ART } from './art/assets.js?v=9a67f36b25';
import { AGAIN, BUSY, PIC_NAMES, isPicId, sentenceLines } from './entry-text.js?v=9a67f36b25';

const ICONS = [
  SHOP_ART.bakery.icon, SHOP_ART.books.icon, SHOP_ART.flower.icon, SHOP_ART.icecream.icon,
  SHOP_ART.fruit.icon, SHOP_ART.fish.icon, SHOP_ART.cafe.icon, SHOP_ART.toy.icon, SHOP_ART.groom.icon,
];
export const PICS = PIC_NAMES.map((name, id) => ({ id, name, src: ICONS[id] }));

// 고르는 차례만 다루는 순수한 틀(picPad가 몰고, 시험은 이것만 본다. Ruling R5).
// - 둘을 누르면 끝(onDone(pair)). pair는 누른 차례 그대로.
// - confirm이면 둘을 고른 뒤 같은 둘을 같은 차례로 한 번 더 눌러야 끝난다. 다르면 mismatch를 켜고 처음부터 다시 고른다.
// - 끝난 뒤 누름은 clear() 전까지 무시한다. clear()는 처음부터.
// state() → { phase: 'pick'|'confirm'|'done', picks(지금 두 칸, 끝나면 고른 둘), first(확인을 기다리는 둘), mismatch, pair }
export function makePicPicker({ confirm = false, onDone = null } = {}) {
  let phase = 'pick';
  let picks = [];
  let first = null;
  let mismatch = false;
  let pair = null;
  const state = () => ({ phase, picks: [...picks], first: first && [...first], mismatch, pair: pair && [...pair] });
  function press(id) {
    if (phase === 'done' || !isPicId(id)) return state();
    picks.push(id);
    mismatch = false;
    if (picks.length < 2) return state();
    if (phase === 'pick' && confirm) {
      first = picks;
      picks = [];
      phase = 'confirm';
      return state();
    }
    if (phase === 'confirm' && (picks[0] !== first[0] || picks[1] !== first[1])) {
      phase = 'pick';
      picks = [];
      first = null;
      mismatch = true;
      return state();
    }
    pair = [...picks];
    first = null;
    phase = 'done';
    onDone?.([...pair]);
    return state();
  }
  function clear() {
    phase = 'pick';
    picks = [];
    first = null;
    mismatch = false;
    pair = null;
    return state();
  }
  return { press, clear, state };
}

const MISMATCH = '처음 고른 그림과 달라요. 다시 골라 주세요.';
const CONFIRM_TITLE = '한 번 더 눌러 확인해요';
const CONFIRM_HINT = '방금 고른 두 그림을 같은 차례로 눌러요.';
const SHOW_PAIR_MS = 450; // 둘째 그림이 칸에 들어간 것을 보여 준 뒤 확인 단계로

// 그림 단추 아홉(3×3) + 누른 차례 두 칸 + [지우기](clearLabel: 관리 화면 「지우기」 칸은 붉은 [지우기]와 헷갈리지 않게 「다시 고르기」).
// 두 그림을 다 누르면 onDone(pair).
// onDone이 약속을 돌려주면 기다리는 동안 「확인하는 중…」으로 막는다. 약속이 푼 값에 따라
//  - 글: 그 글을 보이고 처음부터 다시 누르게 한다(틀린 그림 등)
//  - { text, retry: true }: 글과 [다시]를 보이고 고른 둘을 그대로 둔다(인터넷이 안 될 때).
//    [다시] 대신 그림을 누르면 처음부터 다시 고르고, 둘을 다 고르면 다시 보낸다.
//  - 없음: 화면이 넘어갔다
export function picPad({ title, hint = null, confirm = false, onDone, clearLabel = '지우기', heading = 'p' }) {
  let busy = false;
  let message = null; // { text, retry }
  let pair = null;
  let showing = null; // 확인 단계로 넘기기 전 잠깐 보여 주는 첫 둘
  let timer = null;
  const picker = makePicPicker({ confirm, onDone: (picked) => { pair = picked; submit(); } });
  const titleEl = h(heading, { class: `pic-title${heading === 'h1' ? ' lead' : ''}` });
  const hintEl = h('p', { class: 'pic-hint' });
  const slots = [1, 2].map((n) => h('span', { class: 'pic-slot', role: 'img', 'data-n': n }));
  const say = h('p', { class: 'pic-say', role: 'status', 'aria-live': 'polite' });
  const again = h('button', { type: 'button', class: 'pic-again', onclick: () => submit() }, '다시');
  const clear = h('button', { type: 'button', class: 'link small pic-clear', onclick: () => {
    stopShowing();
    message = null;
    pair = null;
    picker.clear();
    render();
  } }, clearLabel);
  const buttons = PICS.map((pic) => h('button', { type: 'button', class: 'pic', 'data-pic': pic.id, onclick: () => tap(pic.id) },
    h('img', { src: pic.src, alt: '' }), h('span', { class: 'pic-name' }, pic.name)));
  const pad = h('div', { class: 'pic-pad', 'data-confirm': confirm || null },
    h('div', { class: 'pic-top' }, titleEl, hintEl, h('div', { class: 'pic-slots', role: 'group', 'aria-label': '누른 그림' }, ...slots, clear), say, again),
    h('div', { class: 'pic-grid' }, ...buttons));

  function stopShowing() {
    if (timer) clearTimeout(timer);
    timer = null;
    showing = null;
  }

  function tap(id) {
    if (busy || showing) return;
    // 보내지 못한 둘(인터넷)이 남아 있으면 버리고 처음부터(끝난 차례에서 누름이 무시되어 화면이 멈추지 않게)
    if (picker.state().phase === 'done') {
      pair = null;
      picker.clear();
    }
    message = null;
    const before = picker.state().phase;
    const st = picker.press(id);
    if (before === 'pick' && st.phase === 'confirm') {
      showing = st.first;
      timer = setTimeout(() => { stopShowing(); render(); }, SHOW_PAIR_MS);
    }
    render();
  }

  async function submit() {
    if (!pair || busy) return;
    message = null;
    const out = onDone?.([...pair]);
    if (!out || typeof out.then !== 'function') {
      settle(out);
      return;
    }
    busy = true;
    render();
    let result;
    try {
      result = await out;
    } catch (err) {
      console.error(err);
      result = AGAIN;
    }
    busy = false;
    settle(result);
  }

  function settle(result) {
    if (typeof result === 'string' && result) {
      message = { text: result, retry: false };
      pair = null;
      picker.clear();
    } else if (result && typeof result === 'object' && result.text) {
      message = { text: result.text, retry: Boolean(result.retry) };
      if (!message.retry) {
        pair = null;
        picker.clear();
      }
    }
    render();
  }

  function render() {
    const st = picker.state();
    const confirming = st.phase === 'confirm' && !showing;
    pad.dataset.phase = showing ? 'pick' : st.phase;
    titleEl.textContent = confirming ? CONFIRM_TITLE : title;
    hintEl.textContent = confirming ? CONFIRM_HINT : hint ?? '';
    hintEl.hidden = !hintEl.textContent;
    const shown = showing ?? st.picks;
    slots.forEach((slot, i) => {
      const pic = PICS[shown[i]];
      slot.classList.toggle('filled', Boolean(pic));
      slot.setAttribute('aria-label', pic ? `${i + 1}번째 ${pic.name}` : `${i + 1}번째 빈칸`);
      slot.replaceChildren(pic ? h('img', { src: pic.src, alt: '' }) : h('b', {}, String(i + 1)));
    });
    const text = busy ? BUSY : message?.text ?? (st.mismatch ? MISMATCH : '');
    say.textContent = sentenceLines(text);
    say.classList.toggle('warn-text', !busy && Boolean(message || st.mismatch));
    again.hidden = busy || !message?.retry;
    for (const b of buttons) b.disabled = busy || Boolean(showing);
    clear.disabled = busy;
    if (busy) pad.dataset.busy = '';
    else delete pad.dataset.busy;
  }

  render();
  return pad;
}

// 작은 그림 둘(누른 차례 번호와 이름). 열쇠 화면·탐험 일지.
export function picRow(pair) {
  const pics = pair.map((id) => PICS[id]).filter(Boolean);
  return h('span', { class: 'pic-row', role: 'img', 'aria-label': `그림 ${pics.map((pic) => pic.name).join(', ')}` },
    ...pics.map((pic, i) => h('span', { class: 'pic-chip', 'data-pic': pic.id },
      h('b', {}, String(i + 1)), h('img', { src: pic.src, alt: '' }), h('span', { class: 'pic-name' }, pic.name))));
}

// 내 마을 열쇠: 글자 6개를 크게 + 그림 둘. 열쇠 화면·탐험 일지.
export function keyCard({ key, pics }) {
  return h('div', { class: 'key-card' },
    h('p', { class: 'key-letters', role: 'img', 'aria-label': `열쇠 글자 ${[...key].join(' ')}` }, ...[...key].map((letter) => h('span', {}, letter))),
    picRow(pics));
}
