// 관리 화면 「지우기」 칸(설계서 6, 2026-10-21 결정 3): 두 목록 아래, 지워 달라는 요청을 찾아 지우는 작은 폼들.
// main.js가 목록 화면을 그릴 때 eraseSection(ctx)로 붙인다. 부름 하나씩(working)·보내기·목록 새로 받기·화면 차례(nav)·열린 시트·로그인한 메일은
// main.js 것을 ctx로 받는다: { isWorking(), task(work), send(path, opts), reload(), refused(), page(), holdSheet(close | null), adminEmail() }.
import { h } from '../ui.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { lockSheet } from '../sheet-lock.js?v=9a67f36b25';
import { picPad } from '../pics.js?v=9a67f36b25';
import { busy } from '../teacher/session.js?v=9a67f36b25';
import { msgLine, say } from '../teacher/say.js?v=9a67f36b25';
import { PIC_NAMES } from '../entry-text.js?v=9a67f36b25';
import * as A from './text.js?v=9a67f36b25';
import { GOOGLE_LOGIN } from '../config.js?v=9a67f36b25';

const FORMS = [GOOGLE_LOGIN ? 'email' : 'loginId', 'key', 'seat'];

// 목록 아래 칸: 작은 폼 셋(선생님 메일로 찾기 · 열쇠로 찾기 · 반 코드와 번호로 찾기, R52). 넓으면 앞의 둘은 나란히, 반 코드 폼은 그 아래 한 줄 가득(admin.css)
export function eraseSection(ctx) {
  return h('section', { class: 'a-panel a-erase', 'aria-labelledby': 'a-erase-title' },
    h('div', { class: 'a-panel-top' }, h('h2', { id: 'a-erase-title' }, '지우기')),
    h('p', { class: 'a-hint' }, '지워 달라는 메일을 받으면 여기서 찾아 지워요. 찾으면 무엇이 지워지는지 먼저 보여요.'),
    h('div', { class: 'a-erase-forms' }, FORMS.map((by) => eraseForm(ctx, by))));
}

// 폼마다 다른 칸. on.edited()는 칸을 고쳤을 때(찾은 것을 버리고 「…다시 봐 주세요」 글도 지운다), on.changed()는 열쇠 폼의 그림 고르개를 바꿨을 때(찾은 것만 버린다).
// 돌려주는 것: title · hint · labelFor(제목 label이 가리킬 칸 id. 없으면 제목은 p이고 폼이 aria-labelledby로 이름을 얻는다) · nodes(제목과 알림 줄 사이)
// · read()(칸 → 보낼 몸통, 틀리면 { problem }) · clear()(칸 비우기) · focus() · who(body)(확인 시트 머리 아래 한 줄) · sheetTitle(got)
// · many()(열쇠만: 열쇠 글자가 같은 마을이 여럿이면 그림 칸을 연다)
const FIELDS = {
  loginId(on, ids, find) {
    const input = h('input', { id: ids.input, name: 'loginId', autocomplete: 'off', autocapitalize: 'none', maxlength: '20', 'aria-describedby': ids.hint });
    input.addEventListener('input', on.edited);
    return { title: '선생님 아이디로 찾기', hint: '선생님 계정과 만든 반, 그 반 아이 기록을 함께 지워요.', labelFor: input.id,
      nodes: [h('div', { class: 'a-erase-row' }, input, find)],
      read() { const id = input.value.trim().toLowerCase(); return /^[a-z0-9]{3,20}$/.test(id) ? { body: { loginId: id } } : { problem: '선생님 아이디를 써 주세요.' }; },
      clear() { input.value = ''; }, focus() { input.focus({ preventScroll: true }); }, who: (body) => body.loginId, sheetTitle: () => '선생님 계정 지우기' };
  },
  // 선생님의 구글 계정 메일
  email(on, ids, find) {
    const input = h('input', { id: ids.input, name: 'email', type: 'email', inputmode: 'email', autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false', 'aria-describedby': ids.hint });
    input.addEventListener('input', on.edited);
    return {
      title: '선생님 메일로 찾기',
      hint: '선생님 계정과 만든 반, 교사 인증 신청 기록을 지워요.',
      labelFor: input.id,
      nodes: [h('div', { class: 'a-erase-row' }, input, find)],
      read() {
        const problem = A.emailProblem(input.value);
        return problem ? { problem } : { body: { email: A.cleanEmail(input.value) } };
      },
      clear() { input.value = ''; },
      focus() { input.focus({ preventScroll: true }); },
      who: (body) => body.email,
      sheetTitle: () => '선생님 계정 지우기',
    };
  },

  // 열쇠 글자 6개. 열쇠 글자가 같은 마을이 여럿이면(409 many-villages) 비밀 그림 둘을 고르는 칸이 나오고, 다시 찾으면 그림까지 보낸다
  key(on, ids, find) {
    const input = h('input', { id: ids.input, name: 'key', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', 'aria-describedby': ids.hint });
    const picks = ['첫째 그림', '둘째 그림'].map((label) => h('select', { 'aria-label': label },
      h('option', { value: '' }, label), PIC_NAMES.map((name, i) => h('option', { value: String(i) }, name))));
    const pics = h('fieldset', { class: 'a-erase-pics', hidden: true }, h('legend', { class: 'a-label' }, '보낸 분께 받은 비밀 그림 두 개(차례대로)'), picks);
    const closePics = () => {
      pics.hidden = true;
      picks.forEach((select) => { select.value = ''; });
    };
    // 열쇠 글자를 고치면 그림 칸도 닫는다(다시 찾아 여럿이면 또 나온다)
    input.addEventListener('input', () => {
      closePics();
      on.edited();
    });
    picks.forEach((select) => select.addEventListener('change', on.changed));
    return {
      title: '열쇠로 찾기',
      hint: '열쇠로 하던 마을을 지워요. 열쇠 글자 6개만 있으면 돼요.',
      labelFor: input.id,
      nodes: [h('div', { class: 'a-erase-row' }, input, find), pics],
      read() {
        const problem = A.keyProblem(input.value);
        if (problem) return { problem };
        const key = A.cleanEraseKey(input.value);
        if (pics.hidden) return { body: { key } };
        const pair = picks.map((select) => (select.value === '' ? null : Number(select.value)));
        const picked = A.picsProblem(pair);
        return picked ? { problem: picked } : { body: { key, pics: pair } };
      },
      clear() {
        input.value = '';
        closePics();
      },
      focus() { input.focus({ preventScroll: true }); },
      many() { pics.hidden = false; },
      who: (body) => body.key,
      sheetTitle: () => '열쇠 마을 지우기',
    };
  },

  // 반 코드로 들어온 아이 한 명(R52): 반 코드 6자리 · 번호 · 비밀 그림 둘(아이 화면과 같은 3×3 그림 판 app/pics.js를 작게). 셋 다 맞아야 찾는다.
  // 그 자리가 열쇠 아이면 반에서만 뺀다(서버 erase.js)
  seat(on, ids, find) {
    const code = h('input', { id: ids.input, name: 'code', inputmode: 'numeric', autocomplete: 'off', spellcheck: 'false', 'aria-describedby': ids.hint });
    const number = h('input', { id: `${ids.input}-number`, name: 'number', inputmode: 'numeric', autocomplete: 'off', spellcheck: 'false' });
    const field = (input, label) => h('div', { class: 'a-erase-field' }, h('label', { class: 'a-label', for: input.id }, label), input);
    let pair = null; // 다 고른 그림 둘(누른 차례 그대로)
    const pad = picPad({ title: '보낸 분께 받은 비밀 그림 두 개(차례대로)', clearLabel: '다시 고르기', onDone: (picked) => { pair = picked; } });
    // 그림 판을 누르면(그림·다시 고르기) 고른 둘과 찾은 것을 버린다. 판의 단추보다 먼저 듣는다: 둘째 그림이면 판이 onDone으로 다시 채운다
    pad.addEventListener('click', (event) => {
      if (!event.target.closest('button')) return;
      pair = null;
      on.edited();
    }, true);
    for (const input of [code, number]) input.addEventListener('input', on.edited);
    return {
      title: '반 코드와 번호로 찾기',
      // 번호가 잠기면(아이 들어가기와 같은 셈, R54) 맞는 그림도 「찾은 것이 없어요.」라 늘 보이는 안내에 적어 둔다(다시 검토 Minor 2)
      hint: '반 코드로 들어온 아이 한 명의 기록을 지워요. 반 코드, 번호, 비밀 그림 두 개가 모두 맞아야 찾아요. 그림을 다섯 번 틀리면 그 번호는 15분 동안 찾지 못해요.',
      labelFor: null,
      nodes: [h('div', { class: 'a-erase-seat-body' },
        h('div', { class: 'a-erase-seat' }, field(code, '반 코드'), field(number, '번호')),
        h('div', { class: 'a-erase-pad' }, pad),
        h('div', { class: 'a-erase-go' }, find))],
      read() {
        const problem = A.codeProblem(code.value) ?? A.numberProblem(number.value) ?? A.picsProblem(pair);
        return problem ? { problem } : { body: { code: A.cleanCode(code.value), number: A.seatNumber(number.value), pics: [...pair] } };
      },
      clear() {
        code.value = '';
        number.value = '';
        pad.querySelector('.pic-clear').click(); // 판의 [다시 고르기]: 두 칸을 비운다(위 듣개가 pair도 버린다)
      },
      focus() { code.focus({ preventScroll: true }); },
      who: (body) => A.seatWho(body),
      sheetTitle: (got) => (got.keyKid ? '열쇠 아이를 반에서 빼기' : '반 아이 기록 지우기'),
    };
  },
};

// 폼 하나. by = 'email' | 'key' | 'seat'. [찾기](서버 erase/check, 아무것도 바꾸지 않는다)로 찾은 몸통을 [지우기]가 그대로 보낸다:
// 찾은 뒤 칸을 고치면 찾은 것을 버린다(다시 찾아야 지울 수 있다). 찾는 동안 칸을 고쳤으면 늦게 온 답은 버린다(검토 Minor 1).
function eraseForm(ctx, by) {
  const ids = { input: `a-erase-${by}`, hint: `a-erase-${by}-hint`, title: `a-erase-${by}-title` };
  const find = h('button', { type: 'submit', 'data-action': 'erase-find' }, '찾기');
  const msg = msgLine(); // 칸 검사·찾지 못함·지운 결과
  // 찾은 한 줄은 화면 읽기 프로그램이 읽는다(검토 Minor 7): 숨겼다 보이는 칸은 읽지 않기도 해서 status 칸은 늘 두고 글만 넣는다.
  // 찾으면 .is-found(점선과 붉은 [지우기]), 아니면 자리를 차지하지 않는다(admin.css, 다시 검토 Minor 1)
  const summary = h('p', { class: 'a-erase-summary', role: 'status' });
  const go = h('button', { type: 'button', class: 'a-danger', 'data-action': 'erase', hidden: true }, '지우기');
  const found = h('div', { class: 'a-erase-found' }, summary, go);
  let target = null; // 찾은 것 { body(보낸 몸통), got(서버 답) }
  const show = (text) => {
    summary.textContent = text;
    go.hidden = !text;
    found.classList.toggle('is-found', Boolean(text));
  };
  const forget = () => {
    target = null;
    show('');
  };
  const fields = FIELDS[by]({
    edited: () => {
      forget();
      if (msg.dataset.tone === 'bad') say(msg, '');
    },
    changed: forget,
  }, ids, find);
  const current = () => JSON.stringify(fields.read().body ?? null); // 지금 칸이 보낼 몸통(틀린 칸이면 null)
  const form = h('form', { class: 'a-erase-form', 'data-by': by, novalidate: true, 'aria-labelledby': fields.labelFor ? null : ids.title },
    fields.labelFor ? h('label', { class: 'a-label', for: fields.labelFor }, fields.title) : h('p', { class: 'a-label', id: ids.title }, fields.title),
    h('small', { class: 'a-hint', id: ids.hint }, fields.hint),
    fields.nodes, msg, found);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (ctx.isWorking()) return;
    forget();
    const { problem, body } = fields.read();
    if (problem) {
      say(msg, problem, 'bad');
      return;
    }
    say(msg, '');
    const sent = JSON.stringify(body);
    const my = ctx.page();
    ctx.task(() => busy(find, '찾는 중…', async () => {
      const res = await ctx.send('/v1/admin/erase/check', { body });
      if (!res || my !== ctx.page()) return; // 로그인이 풀렸거나 화면이 바뀌었다
      if (res.status === 403) {
        ctx.refused();
        return;
      }
      if (current() !== sent) return; // 찾는 동안 칸을 고쳤다: 이 답은 지금 칸의 것이 아니다
      const got = res.ok ? A.readFound(by, res.data) : null;
      if (!got) {
        if (fields.many && res.status === 409) fields.many(); // 열쇠 글자가 같은 마을이 여럿: 그림 둘로 고른다
        say(msg, A.adminMessage('find', res), 'bad');
        return;
      }
      const text = A.foundText(got);
      if (text === A.ERASE_NONE) {
        say(msg, text);
        return;
      }
      target = { body, got };
      show(text);
    }));
  });

  go.addEventListener('click', () => {
    if (!ctx.isWorking() && target) askErase();
  });

  function askErase() {
    const { body, got } = target;
    confirmErase(ctx, {
      by, body, got, title: fields.sheetTitle(got), who: fields.who(body), text: summary.textContent,
      done: (text) => {
        fields.clear();
        forget();
        say(msg, text, text === A.ERASE_NOTHING ? '' : 'ok');
        fields.focus();
      },
      many: fields.many ? (res) => {
        forget();
        fields.many();
        say(msg, A.adminMessage('erase', res), 'bad');
      } : null,
    });
  }
  return form;
}

// 확인 시트(지우기 폼과 관리 첫 화면 줄의 [지우기]가 같이 쓴다): [지우기]를 누르면 그 부름 하나를 하는 동안 시트를 잠근다(✕·그만두기·Esc·바깥).
// 되면 시트를 닫고 done(「지웠어요.」와 지운 수)을 부른 뒤 목록을 새로 받는다(지운 선생님이 목록에서 빠진다).
// 그 사이 열쇠 글자가 같은 마을이 생겼으면(409) 닫고 many(답)를 부른다. 그 밖의 실패는 시트에 글.
// 지금 로그인한 관리자 자기 메일이면 지우면 로그아웃된다고 알린다(검토 Minor 2).
function confirmErase(ctx, { by, body, got, title, who, text, done, many = null }) {
  const sheetMsg = msgLine();
  const ok = h('button', { type: 'button', class: 'a-danger' }, '지우기');
  const cancel = h('button', { type: 'button' }, '그만두기');
  const self = by === 'email' && A.isOwnEmail(body.email, ctx.adminEmail());
  const close = openSheet(document.body, { label: title, className: 'a-sheet a-erase-sheet', onClose: () => ctx.holdSheet(null) },
    h('h2', {}, title),
    h('p', { class: 'a-sheet-who' }, who),
    h('p', { class: 'a-sheet-text' }, text),
    self ? h('p', { class: 'a-alert a-erase-self' }, A.ERASE_SELF) : null,
    h('p', { class: 'a-sheet-text' }, A.ERASE_SURE),
    h('div', { class: 'a-sheet-actions' }, ok, cancel),
    sheetMsg);
  ctx.holdSheet(close);
  cancel.addEventListener('click', () => close());
  ok.addEventListener('click', () => {
    if (ctx.isWorking()) return;
    const my = ctx.page();
    ctx.task(async () => {
      const unlock = lockSheet(ok.closest('.sheet'));
      ok.textContent = '지우는 중…';
      say(sheetMsg, '');
      let res = null;
      try {
        res = await ctx.send('/v1/admin/erase', { body: { ...body, confirm: true } });
      } finally {
        unlock();
        ok.textContent = '지우기';
      }
      if (!res || my !== ctx.page()) return; // 로그인이 풀렸다(화면이 바뀌며 시트도 닫혔다)
      if (res.status === 403) {
        ctx.refused();
        return;
      }
      const erased = res.ok ? A.readErased(by, res.data) : null;
      if (erased) {
        close();
        done(A.erasedText(erased, got));
        await ctx.reload();
        return;
      }
      if (many && res.status === 409) {
        close();
        many(res);
        return;
      }
      say(sheetMsg, A.adminMessage('erase', res), 'bad');
    });
  });
}

// 관리 첫 화면 반 줄의 [지우기](설계서 4-4): 그 아이디로 찾아 무엇이 지워지는지 보인 확인 시트를 바로 연다.
// 찾는 동안 누른 단추를 막는다. 알릴 글은 tell(글, 'ok' | 'bad' | '')로(찾지 못함 · 지운 결과).
export function eraseAccount(ctx, loginId, button, tell) {
  if (ctx.isWorking()) return;
  const body = { loginId };
  const my = ctx.page();
  ctx.task(() => busy(button, '찾는 중…', async () => {
    const res = await ctx.send('/v1/admin/erase/check', { body });
    if (!res || my !== ctx.page()) return;
    if (res.status === 403) {
      ctx.refused();
      return;
    }
    const got = res.ok ? A.readFound('loginId', res.data) : null;
    if (!got) {
      tell(A.adminMessage('find', res), 'bad');
      return;
    }
    const text = A.foundText(got);
    if (text === A.ERASE_NONE) {
      tell(text, '');
      return;
    }
    confirmErase(ctx, { by: 'loginId', body, got, title: '선생님 계정 지우기', who: loginId, text, done: (t) => tell(t, t === A.ERASE_NOTHING ? '' : 'ok') });
  }));
}
