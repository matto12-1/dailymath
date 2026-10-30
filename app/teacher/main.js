// 선생님 화면(설계서 5, app/teacher.html): 아이디 로그인 → 처음 비밀번호 바꾸기 → 반 대시보드(없으면 새 반 만들기).
// GOOGLE_LOGIN을 켰을 때만 아래의 구글 로그인·교사 인증·확인 중 화면도 쓴다.
// - 서버 주소는 config.js apiBase(). 없으면 선생님 화면을 쓸 수 없다고 알리고, 옛 토큰이 있어도 계정 칸을 그리지 않는다.
// - 토큰과 부르기는 session.js(Ruling R3: 어느 부름이든 401이면 토큰 칸을 비우고 로그인 칸으로).
// - 로그인이 되면 토큰을 남기고 쪽을 새로 연다: 구글 스크립트를 아이 기록·이름·토큰 옆에 남기지 않는다
//   (새로 연 쪽은 로그인 칸을 그리지 않아 스크립트를 읽지 않는다).
// - 상태별 본문은 #teacher[data-view]: no-server · loading · error · login · cert · pending · new(새 반 만들기) · board.
// - 반 목록 쪽은 없다(2026-10-23 Matto 「담당하는 반은 하나밖에 없는데 저런 페이지가 왜 있으며」): 반 주소 없이 들어오면
//   반이 하나면 그 반, 여럿이면 이 기기에서 마지막으로 본 반, 없으면 새 반 만들기(pages.js defaultClass). 옛 주소(#classes 등)도 같다.
// - 짜임(2026-10-22 오후 결정, code.xr 「Dashboard V14」 결, 틀은 staff-shell.js·staff.css):
//   맨 위 줄(#teacher-head): 「매일 수학」 · 반 대시보드면 쪽 알약 탭 넷(한눈에 보기 · 아이별 · 실수·접속 · 반 설정) ·
//   「5학년 3반 ▾」 반 고르기(다른 반 · 새 반 만들기, picker.js) · 선생님 칸(학교·메일).
//   왼쪽 얇은 아이콘 줄(#teacher-rail): 밝기(해·달) · 개인정보 안내 · 로그아웃. 쪽 단추는 위 탭에만 둔다.
//   로그인 전·서버 없음은 body[data-shell="plain"]: 「매일 수학」과 밝기 단추만.
//   보던 쪽은 주소에 남는다(#class=<id>&page=kids, pages.js). 같은 반 안에서 쪽만 바뀌면 다시 받지 않고 board.js가 그 쪽을 그린다.
//   아이 상세 리포트(모달)도 주소에 남는다(&kid=7&tab=…): 주소가 바뀌면 board.js showKid가 열고 닫는다(뒤로 가기가 닫는다).
//   반 고르기의 내 반은 열 반을 고를 때 받은 것을 쓰고, 대시보드로 바로 열었으면 대시보드를 그린 뒤 한 번 받는다.
// - 서버·아이 기기에서 온 글(학교 이름·메일·까닭·단원·실수 이름)과 선생님이 적은 이름은 글로만 넣는다(Ruling R27):
//   h()의 html 칸은 쓰지 않는다.
// - 부르는 동안 그 단추는 막히고, 답이 오면(실패해도) 다시 눌린다(busy). 늦게 온 답은 바뀐 화면을 덮지 않는다(nav).
// - 생김새는 모두 teacher.css와 공용 staff.css. 대시보드 그리기는 board.js, 글은 text.js, 알림 줄은 say.js, 밝기 단추는 staff-theme.js.
import { h } from '../ui.js?v=9a67f36b25';
import { apiBase, GOOGLE_CLIENT_ID, GOOGLE_LOGIN } from '../config.js?v=9a67f36b25';
import { passwordLoginForm, passwordChangeForm, passwordResetForm } from '../password-login.js?v=9a67f36b25';
import { keyCard } from '../account-key.js?v=9a67f36b25';
import { openMyAccount } from '../my-account.js?v=9a67f36b25';
import { googleButton } from '../google-login.js?v=9a67f36b25';
import { teacherSession, busy } from './session.js?v=9a67f36b25';
import { boardScreen } from './board.js?v=9a67f36b25';
import { isClass } from '../../src/game/board.js?v=9a67f36b25';
import { msgLine, say } from './say.js?v=9a67f36b25';
import * as T from './text.js?v=9a67f36b25';
import { logoutAsking } from './names.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { labMark, openLab, privacyLink } from '../lab.js?v=9a67f36b25';
import { themeSwitch } from '../staff-theme.js?v=9a67f36b25';
import { railButton, railPrivacy, railGroup, watchTopHeight } from '../staff-shell.js?v=9a67f36b25';
import { classPicker } from './picker.js?v=9a67f36b25';
import { classActions, ownerClasses } from './access.js?v=9a67f36b25';
import { shortSchoolName } from '../admin/schools.js?v=9a67f36b25';
import { PAGES, PAGE_NAMES, readBoardHash, boardHash, defaultClass, loadLastClass, saveLastClass, clearLastClass } from './pages.js?v=9a67f36b25';

const root = document.getElementById('teacher');
document.body.dataset.accounts = String(!GOOGLE_LOGIN);
const head = document.getElementById('teacher-head');
const rail = document.getElementById('teacher-rail');
// 맨 위 줄 오른쪽 끝 MattoLAB 글자(누르면 제품 목록 · 연락처 종이 창, app/lab.js, 설계서 4-5). 처음 들어오는 쪽(로그인 · 처음 바꾸기 ·
// 잊었어요 · 열쇠 · 교사 인증 신청 · 확인 중 등)에만 두고 로그인한 뒤 일하는 화면(새 반 만들기 · 반 대시보드)에서는 뺀다
// (2026-10-23 Matto 「이 페이지에선 아래에 있는 푸터 없애자」). 불러오는 중에는 앞 화면 그대로 둔다(로그인 → 대시보드 사이에
// 잠깐 떴다 사라지지 않게). 처음 불러오는 동안은 숨겨 둔다
const mark = labMark({ className: 's-pill' });
const NO_MARK = ['new', 'board'];
mark.hidden = true;
watchTopHeight(head);
const api = apiBase();
const storage = (() => { try { return globalThis.localStorage ?? null; } catch { return null; } })();
const STATUSES = ['new', 'pending', 'verified', 'rejected', 'expired'];
const CERT_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp';

let me = null; // 마지막으로 받은 { teacher, cert }
let nav = 0; // 화면을 바꿀 때마다 1씩: 늦게 온 답이 새 화면을 덮지 않게
let dispose = null; // 지금 화면이 남긴 것(열린 시트) 정리
let closeMine = null; // 열린 「내 계정」 시트 닫기(로그인 화면으로 갈 때 닫는다)
let myClasses = null; // 반 고르기의 내 반(열 반을 고를 때·대시보드가 받은 것). null이면 아직 받지 않았다
let boardOwner = null; // 남의 반을 보는 관리자에게만 서버가 붙이는 담임
let viewedClasses = null; // 그 담임의 반. 내 반 목록과 섞지 않는다
let viewedSido = null; // owner 답에는 지역이 없어 관리 계정 목록에서 같은 아이디로 찾는다
let place = null; // 지금 보는 곳: 'new' · 반 id · 'cert'
let boardClass = null; // 지금 연(여는) 대시보드의 반(내 반을 아직 받지 않았을 때 반 고르기 글)
let board = null; // 지금 대시보드 { id, screen }
let tabsBox = null; // 맨 위 줄 쪽 탭 칸
let pickBox = null; // 맨 위 줄 반 고르기 칸
let picker = null; // 반 고르기(picker.js)
const session = teacherSession({
  api,
  storage,
  onSignedOut: (message) => {
    nav += 1;
    showLogin(message);
  },
});
const send = (path, opts) => session.send(path, opts);

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const validMe = (d) => isObject(d) && isObject(d.teacher) && typeof d.teacher.email === 'string' && STATUSES.includes(d.teacher.status);

// 본문 바꾸기. 누른 단추가 화면과 같이 사라졌으면(불러오는 중 화면을 거쳐도) 다음 화면 제목으로 초점을 옮긴다.
let focusOwed = false;
function show(view, ...nodes) {
  dispose?.();
  dispose = null;
  const focused = document.activeElement;
  root.dataset.view = view;
  if (view !== 'loading') {
    mark.hidden = NO_MARK.includes(view);
    document.body.dataset.screen = view; // 들어오는 화면의 교실 그림(staff.css body[data-screen])
  }
  root.replaceChildren(...nodes);
  if (focused && focused !== document.body && !focused.isConnected) focusOwed = true;
  const title = focusOwed ? root.querySelector('h2') : null;
  if (title) {
    title.focus({ preventScroll: true });
    focusOwed = false;
  }
}

// 맨 위 줄과 왼쪽 아이콘 줄. 로그인했으면 쪽 탭(대시보드일 때) · 반 고르기(인증된 뒤) · 선생님 칸, 아니면 제목과 밝기 단추만.
// replaceChildren은 null도 「null」 글로 넣으므로 빈 칸은 걸러 낸다(h()만 null을 건너뛴다).
// 서버가 없으면 옛 토큰이 남아 있어도 계정 칸(메일·로그아웃)을 그리지 않는다.
function renderHead() {
  const auth = session.auth;
  const teacher = me?.teacher;
  const signedIn = Boolean(auth && api);
  if (head.contains(document.activeElement) || rail.contains(document.activeElement)) focusOwed = true; // 로그아웃 단추를 눌렀다
  document.body.dataset.shell = signedIn ? 'app' : 'plain';
  const brand = h('h1', { class: 's-pill s-brand t-brand' }, '매일 수학');
  tabsBox = h('nav', { class: 's-pill t-pages', 'aria-label': '반 대시보드 쪽' });
  pickBox = h('div', { class: 't-pick-box' });
  const email = teacher?.loginId ? teacher.name : teacher?.email ?? auth?.email ?? '';
  // 선생님 칸은 늘 두 줄(학교 · 메일), 넘치면 줄임표. 전체 글은 title과 화면 읽개(글은 그대로 들어 있다)로 남는다
  const school = teacher?.status === 'verified' && teacher.school ? (teacher.loginId ? teacher.school : `인증됨 · ${teacher.school}`) : '';
  // 아이디 계정이면 칸이 단추: 「내 계정」 시트(app/my-account.js). 화면 읽개 이름은 「내 계정」 + 보이는 글
  const mine = Boolean(teacher?.loginId) && !teacher.mustChangePassword;
  const account = signedIn ? h(mine ? 'button' : 'div', { class: 's-pill t-account', type: mine ? 'button' : null, 'aria-haspopup': mine ? 'dialog' : null,
    onclick: mine ? openMine : null, title: [school, email].filter(Boolean).join('\n') },
    mine ? h('span', { class: 's-sr' }, '내 계정 ') : null,
    h('span', { class: 't-avatar', 'aria-hidden': 'true' }),
    h('span', { class: 't-me' },
      school ? h('span', { class: 't-school' }, school) : null,
      h('span', { class: 't-who' }, email))) : null;
  head.replaceChildren(brand, tabsBox, pickBox, h('div', { class: 's-top-end' }, account, mark)); // 오른쪽 끝: 선생님 칸 · MattoLAB 글자
  rail.replaceChildren(h('div', { class: 's-rail-inner' },
    railGroup(themeSwitch('t-theme')),
    signedIn ? h('div', { class: 's-rail-gap' }) : null,
    signedIn ? railGroup(railPrivacy(), railButton({ label: '로그아웃', icon: 'logout', className: 't-logout', onclick: logout })) : null));
  syncTop();
}

// 맨 위 계정 칸(아이디 계정): 「내 계정」 시트. 비밀번호를 바꿔 받은 새 로그인은 시트가 session에 넣는다
function openMine() {
  if (closeMine || !me?.teacher?.loginId || me.teacher.mustChangePassword) return;
  closeMine = openMyAccount({ session, teacher: me.teacher, onClose: () => { closeMine = null; } });
}

// 링크로 화면을 바꾸면 초점은 새 화면 제목으로. 같은 곳을 다시 누르면 hashchange가 없다: 그 화면을 다시 연다(새 반 만들기는 폼으로 초점)
function sameHash(event) {
  focusOwed = true;
  if (new URL(event.currentTarget.href).hash === location.hash) {
    event.preventDefault();
    routeVerified();
  }
}

// 맨 위 줄의 쪽 탭 · 반 고르기와 아이콘 줄의 지금 곳을 지금 주소·곳에 맞춘다.
// 쪽 탭은 같은 반이면 다시 만들지 않고 표시만 바꾼다(누른 탭에 초점이 남게).
function syncTop() {
  const hashed = readBoardHash(location.hash);
  const at = hashed && hashed.id === place ? hashed : null;
  if (tabsBox) {
    tabsBox.hidden = !at;
    const tabs = [...tabsBox.querySelectorAll('.t-page-tab')];
    if (!at) tabsBox.replaceChildren();
    else if (tabs.length && tabs[0].dataset.cls === at.id) {
      for (const tab of tabs) {
        if (tab.dataset.page === at.page) tab.setAttribute('aria-current', 'page');
        else tab.removeAttribute('aria-current');
      }
    } else {
      tabsBox.replaceChildren(...PAGES.map((page) => h('a', {
        class: 't-page-tab', href: boardHash(at.id, page), 'data-page': page, 'data-cls': at.id, 'aria-current': page === at.page ? 'page' : null,
      }, PAGE_NAMES[page])));
    }
  }
  renderPicker(at?.page ?? 'overview');
  head.querySelector('.t-admin-view')?.remove();
  if (at && boardOwner && boardClass?.id === place) {
    const school = shortSchoolName(boardOwner.school, viewedSido);
    const who = [school, `${boardClass.grade}-${boardClass.classNo} (${boardOwner.loginId})`].filter(Boolean).join(' ');
    head.append(h('div', { class: 't-admin-view' },
      h('span', { class: 't-admin-view-text' }, `관리자로 보는 중 · ${who} · 보기만`),
      h('a', { href: `admin.html${location.search}` }, '관리 화면으로')));
  }
}

// 반 고르기: 내 반(지금 반 표시, 닫힌 반은 꼬리표) · 새 반 만들기. 다른 반을 고르면 지금 보던 쪽 그대로 그 반으로
function renderPicker(page) {
  if (pickBox?.contains(document.activeElement) && picker?.el.querySelector('[aria-expanded="true"]')) return; // 펼친 목록을 쓰는 중에는 갈아 끼우지 않는다
  picker?.destroy();
  picker = null;
  if (!pickBox) return;
  if (!session.auth || !api || me?.teacher?.status !== 'verified' || me.teacher.mustChangePassword) {
    pickBox.hidden = true;
    pickBox.replaceChildren();
    return;
  }
  const list = (boardOwner ? viewedClasses : myClasses) ?? (boardClass ? [boardClass] : []);
  const here = list.find((c) => c.id === place);
  picker = classPicker({
    label: here ? T.classTitle(here) : '반 고르기',
    items: [
      ...list.map((c) => ({ href: boardHash(c.id, page), label: T.classTitle(c), current: c.id === place, tag: c.closed ? '닫힘' : null, className: 't-pick-class' })),
      ...(classActions({ owner: boardOwner }).includes('new') ? [
        ...(list.length ? ['gap'] : []),
        { href: '#new', label: '새 반 만들기', current: place === 'new', className: 't-pick-new' },
      ] : []),
    ],
  });
  for (const link of picker.el.querySelectorAll('a')) link.addEventListener('click', sameHash);
  pickBox.hidden = false;
  pickBox.replaceChildren(picker.el);
}

function placeAt(key) {
  place = key;
  syncTop();
}

// 반 하나가 바뀌었다(대시보드가 새로 받음·인원·닫기): 반 고르기의 내 반도 바꾼다(없던 반이면 뒤에 붙인다)
function classChanged(cls, owner = boardOwner) {
  if (boardOwner?.loginId !== owner?.loginId) { viewedClasses = null; viewedSido = null; }
  boardOwner = owner;
  if (boardClass?.id === cls.id || place === cls.id) boardClass = cls;
  if (owner && viewedClasses) {
    viewedClasses = viewedClasses.map((c) => c.id === cls.id ? { ...c, ...cls } : c);
  } else if (!owner && myClasses) {
    const at = myClasses.findIndex((c) => c.id === cls.id);
    myClasses = at < 0 ? [...myClasses, cls] : myClasses.map((c, i) => (i === at ? cls : c));
  }
  syncTop();
}

async function loadViewedClasses(my, loginId) {
  const [res, accounts] = await Promise.all([
    send('/v1/admin/classes', { method: 'GET' }),
    send('/v1/admin/accounts', { method: 'GET' }),
  ]);
  if (my !== nav || boardOwner?.loginId !== loginId) return;
  if (res?.ok && Array.isArray(res.data?.classes)) {
    const list = ownerClasses(res.data.classes, loginId).filter(isClass);
    viewedClasses = list.length ? list : null;
  }
  if (accounts?.ok && Array.isArray(accounts.data?.accounts)) {
    viewedSido = accounts.data.accounts.find((a) => a.loginId === loginId)?.sido ?? null;
  }
  syncTop();
}

// 대시보드로 바로 열었으면 반 고르기의 내 반을 한 번 받는다(대시보드를 그린 뒤, 못 받으면 지금 반만 보인다)
async function loadMyClasses(my) {
  const res = await send('/v1/teacher/classes', { method: 'GET' });
  if (!res || my !== nav || !res.ok || !Array.isArray(res.data?.classes)) return;
  myClasses = res.data.classes.filter(isClass);
  syncTop();
}

const heading = (text) => h('h2', { tabindex: '-1' }, text);

function showLoading() {
  show('loading', h('p', { class: 't-loading' }, '불러오는 중…'));
}

// 다시 해 볼 수 있는 실패(인터넷·서버 오류)
function showProblem(message, retry) {
  const again = h('button', { type: 'button', class: 'primary', onclick: () => retry() }, '다시');
  show('error', h('section', { class: 't-card t-problem' }, heading('잠깐만요'), h('p', { class: 't-alert', role: 'alert' }, message), h('div', { class: 't-actions' }, again)));
}

// 로그아웃. 이 기기에 적은 아이 이름이 있으면(어느 반이든) 먼저 같이 지울지 묻는다(결정 4, names.js logoutAsking).
// 취소하면 아무것도 하지 않는다(시트가 닫히면 초점은 [로그아웃]으로).
async function logout(event) {
  const button = event.currentTarget;
  const done = await logoutAsking({
    storage,
    ask: askNames,
    logout: async () => {
      button.disabled = true;
      nav += 1;
      clearLastClass(storage); // 마지막에 본 반도 이 기기에서 지운다(로그아웃 부름이 늦거나 막혀도)
      await session.logout(); // 서버 토큰도 지운다(안 돼도 이 기기는 로그아웃, 서버가 없으면 보내지 않는다)
    },
  });
  if (done === 'out') showLogin('로그아웃했어요.', 'ok');
}

// 이름도 지울지 묻는 시트(생김새는 대시보드 확인 시트와 같다, teacher.css t-sheet). 고른 것을 돌려준다: 'clear' · 'keep' · 'cancel'(닫음)
function askNames() {
  return new Promise((resolve) => {
    let picked = 'cancel';
    const pick = (value, label, primary = false) => {
      const go = h('button', { type: 'button', class: primary ? 'primary' : null }, label);
      go.addEventListener('click', () => {
        picked = value;
        close();
      });
      return go;
    };
    const close = openSheet(document.body, { label: T.LOGOUT_NAMES_TITLE, className: 't-sheet t-logout-sheet', onClose: () => resolve(picked) },
      h('h2', {}, T.LOGOUT_NAMES_TITLE),
      h('p', { class: 't-sheet-text' }, T.LOGOUT_NAMES_TEXT),
      h('div', { class: 't-sheet-actions' }, pick('clear', T.LOGOUT_CLEAR, true), pick('keep', T.LOGOUT_KEEP), pick('cancel', '취소')));
  });
}

// ── 로그인 ──

function showLogin(message = '', tone = '') {
  closeMine?.();
  nav += 1;
  const my = nav;
  me = null;
  myClasses = null;
  boardOwner = null;
  viewedClasses = null;
  viewedSido = null;
  place = null;
  boardClass = null;
  renderHead();
  const box = h('div', { class: 't-google' });
  const msg = msgLine(message, tone);
  if (!GOOGLE_LOGIN) {
    show('login', h('section', { class: 't-card t-split t-login' },
      h('div', { class: 't-intro' }, heading('선생님 로그인'), h('p', { class: 't-lead' }, '운영자가 나눠 드린 아이디와 비밀번호로 들어와요.'),
        h('p', { class: 't-note' }, T.LOGIN_NOTE)),
      h('div', { class: 't-action' }, passwordLoginForm({ api, session, entered: () => loadMe(), onForgot: showForgot }), msg,
        h('p', { class: 'privacy-note' }, '모으는 것과 두는 기간: ', privacyLink()))));
    return;
  }
  show('login', h('section', { class: 't-card t-split t-login' },
    h('div', { class: 't-intro' },
      heading('선생님 로그인'),
      h('p', { class: 't-lead' }, '구글 계정으로 로그인해요. 처음이면 재직증명서로 교사 인증을 한 번 해요.'),
      h('ol', { class: 't-steps' },
        h('li', {}, '구글 계정으로 로그인'),
        h('li', {}, '재직증명서로 교사 인증(보통 하루 안에 확인해요)'),
        h('li', {}, '반을 만들고 반 코드를 아이들에게 알려 주기'))),
    h('div', { class: 't-action' }, passwordLoginForm({ api, session, entered: () => loadMe(), onForgot: showForgot }), box, msg, h('p', { class: 'privacy-note' }, '로그인하면 받는 것과 두는 기간: ', privacyLink()))));
  googleButton(box, { clientId: GOOGLE_CLIENT_ID, api, tell: (text, mood) => say(msg, text, mood) }).then((auth) => {
    if (my !== nav) return;
    // 토큰을 남기고 쪽을 새로 연다(구글 스크립트를 남기지 않게). 저장이 막힌 창은 새로 열면 로그인이 사라지므로 이 쪽에서 잇는다.
    if (session.keep(auth)) location.reload();
    else loadMe();
  });
}

// 「비밀번호를 잊었어요」(설계서 4-2): 아이디 · 계정 열쇠 · 새 비밀번호. 되면 바로 로그인되고 새 열쇠 카드
function showForgot() {
  nav += 1;
  renderHead();
  show('forgot', h('section', { class: 't-card t-split t-login' },
    h('div', { class: 't-intro' }, heading('비밀번호를 잊었어요'), h('p', { class: 't-lead' }, T.FORGOT_LEAD)),
    h('div', { class: 't-action' }, passwordResetForm({ api, session, entered: ({ key }) => showKey(key, '새 계정 열쇠를 받았어요'), onBack: () => showLogin(), onContact: () => openLab({ contact: true }) }))));
}

// 계정 열쇠 카드(처음 바꾸기 · 잊었어요 뒤). [다 적었어요]를 눌러야 내 상태를 다시 받아 반 화면으로 간다. 그 사이 맨 위는 이름만(반 고르기 · 내 계정 없이)
function showKey(key, title) {
  nav += 1;
  me = null;
  renderHead();
  show('key', h('section', { class: 't-card t-key' }, keyCard({ loginId: session.auth?.email ?? '', key, title, onDone: () => loadMe() })));
}

// ── 내 상태 → 맞는 화면 ──

async function loadMe({ notice = '' } = {}) {
  const my = ++nav;
  showLoading();
  const res = await send('/v1/teacher/me', { method: 'GET' });
  if (!res || my !== nav) return;
  if (!res.ok || !validMe(res.data)) {
    showProblem(T.teacherMessage('me', res), () => loadMe({ notice }));
    return;
  }
  me = res.data;
  session.rename(me.teacher.email);
  renderHead();
  if (me.teacher.mustChangePassword) {
    show('password', h('section', { class: 't-card t-split' },
      h('div', { class: 't-intro' }, heading('처음 비밀번호 바꾸기'), h('p', { class: 't-lead' }, '새 비밀번호는 8자 이상, 처음 비밀번호와 다르게 써 주세요. 바꾼 뒤에 반을 만들고 기록을 볼 수 있어요.')),
      passwordChangeForm({ session, entered: ({ key }) => (key ? showKey(key, '계정 열쇠를 받았어요') : loadMe()) })));
    return;
  }
  const { status } = me.teacher;
  if (!GOOGLE_LOGIN && status !== 'verified') {
    show('unavailable', h('section', { class: 't-card' }, heading('계정을 확인해 주세요'), h('p', { class: 't-lead' }, '운영자가 나눠 드린 아이디로 다시 로그인해 주세요.')));
    return;
  }
  if (status === 'verified') routeVerified({ notice });
  else if (status === 'pending') showPending({ notice });
  else showCert({ notice });
}

// 인증된 선생님: 반 주소면 그 반 대시보드(리포트 번호·탭까지), #new면 새 반 만들기, 그 밖(빈 주소 · 옛 #classes …)은 열 반을 골라 연다
function routeVerified({ notice = '' } = {}) {
  const at = readBoardHash(location.hash);
  if (at) {
    if (!at.exact) history.replaceState(null, '', boardHash(at.id, at.page, at.kid, at.tab)); // 모르는 쪽 이름 → 한눈에 보기
    showBoard(at.id, { notice, page: at.page, kid: at.kid, tab: at.tab });
    return;
  }
  if (location.hash === '#new') showNewClass({ notice });
  else openDefaultClass({ notice });
}

// ── 교사 인증 ──

// 칸 하나: 이름표는 for로 잇는다(칸을 감싸면 고른 값까지 칸 이름에 붙는다). 한 화면에 칸 이름은 하나씩이라 id가 겹치지 않는다.
function field(label, input, hint = null) {
  input.id = `f-${input.name}`;
  if (hint) input.setAttribute('aria-describedby', `${input.id}-hint`);
  return h('div', { class: 't-field' },
    h('label', { class: 't-label', for: input.id }, label),
    input,
    hint ? h('small', { id: `${input.id}-hint`, class: 't-hint' }, hint) : null);
}

function showCert({ notice = '' } = {}) {
  nav += 1;
  placeAt('cert');
  const { teacher, cert } = me;
  const school = h('input', { name: 'school', autocomplete: 'organization', maxlength: '40', placeholder: '○○초등학교' });
  school.value = cert?.school ?? teacher.school ?? '';
  const file = h('input', { type: 'file', name: 'file', accept: CERT_ACCEPT });
  const go = h('button', { type: 'submit', class: 'primary' }, '인증 신청');
  const msg = msgLine(notice);
  const reason = teacher.reason ?? cert?.reason ?? null;
  const alert = teacher.status === 'rejected'
    ? h('div', { class: 't-alert', role: 'alert' }, h('p', {}, '인증하지 못했어요. 다시 올려 주세요.'), reason ? h('p', { class: 't-reason' }, `까닭: ${reason}`) : null)
    : teacher.status === 'expired'
      ? h('p', { class: 't-alert', role: 'alert' }, '7일 안에 확인하지 못해 신청이 끝났어요. 다시 올려 주세요.')
      : null;
  const form = h('form', { class: 't-form', novalidate: true },
    field('학교 이름', school),
    field('재직증명서', file, 'PDF·JPG·PNG·WEBP 파일, 8MB 이하'),
    h('div', { class: 't-actions' }, go),
    msg);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = T.cleanSchool(school.value);
    const chosen = file.files?.[0] ?? null;
    const problem = T.schoolProblem(name) ?? T.fileProblem(chosen);
    if (problem) {
      say(msg, problem, 'bad');
      return;
    }
    say(msg, '');
    const body = new FormData();
    body.append('school', name);
    body.append('file', chosen);
    const my = nav;
    const res = await busy(go, '올리는 중…', () => send('/v1/teacher/cert', { form: body, timeoutMs: 60000 }));
    if (!res || my !== nav) return;
    if (res.ok && validMe(res.data)) {
      me = res.data;
      renderHead();
      showPending();
      return;
    }
    if (res.status === 409) {
      loadMe({ notice: T.teacherMessage('cert', res) }); // 그 사이 신청·인증이 된 것: 맞는 화면으로
      return;
    }
    say(msg, T.teacherMessage('cert', res), 'bad');
  });
  show('cert', h('section', { class: 't-card t-split t-cert' },
    h('div', { class: 't-intro' },
      heading('교사 인증'),
      alert,
      h('p', { class: 't-lead' }, '학교 이름과 재직증명서를 올려 주세요. 확인이 끝나면 반을 만들 수 있어요.'),
      h('p', { class: 't-note' }, '올린 파일은 확인하는 대로 바로 지워요. 확인하지 못해도 7일 뒤에 저절로 지워져요.')),
    h('div', { class: 't-action' }, form)));
}

function showPending({ notice = '' } = {}) {
  nav += 1;
  placeAt('cert');
  const { cert } = me;
  const again = h('button', { type: 'button' }, '새로 고침');
  again.addEventListener('click', () => busy(again, '확인하는 중…', () => loadMe()));
  const facts = cert ? h('dl', { class: 't-facts' },
    h('div', {}, h('dt', {}, '학교 이름'), h('dd', {}, cert.school ?? '')),
    T.msDay(cert.createdAt) ? h('div', {}, h('dt', {}, '올린 날'), h('dd', {}, T.msDay(cert.createdAt))) : null) : null;
  show('pending', h('section', { class: 't-card t-split t-pending' },
    h('div', { class: 't-intro' },
      heading('교사 인증'),
      h('p', { class: 't-lead' }, T.PENDING),
      h('p', { class: 't-note' }, '확인이 끝나면 이 화면에서 반을 만들 수 있어요. 올린 파일은 확인하는 대로 바로 지워요.')),
    h('div', { class: 't-action' }, facts, h('div', { class: 't-actions' }, again), msgLine(notice))));
}

// ── 열 반 고르기 · 새 반 만들기 ──

// 반 주소 없이 들어왔다(로그인 직후 · 옛 주소 #classes 등): 내 반을 받아 열 반을 고른다(pages.js defaultClass).
// 연 반은 주소도 그 반으로 바꿔 둔다(새로 열어도 같은 반, 뒤로 가기가 빈 주소로 돌아오지 않게). 반이 없으면 새 반 만들기.
// avoid = 방금 찾지 못한(404) 반: 다시 고르지 않는다(목록과 대시보드 답이 어긋나도 돌고 돌지 않게)
async function openDefaultClass({ notice = '', avoid = null } = {}) {
  const my = ++nav;
  showLoading();
  const res = await send('/v1/teacher/classes', { method: 'GET' });
  if (!res || my !== nav) return;
  if (!res.ok || !Array.isArray(res.data?.classes)) {
    showProblem(T.teacherMessage('class', res), () => (res.status === 403 ? loadMe() : openDefaultClass({ notice, avoid })));
    return;
  }
  myClasses = res.data.classes.filter(isClass);
  const cls = defaultClass(myClasses, loadLastClass(storage), avoid);
  if (!cls) {
    if (location.hash) history.replaceState(null, '', `${location.pathname}${location.search}`);
    showNewClass({ notice });
    return;
  }
  history.replaceState(null, '', boardHash(cls.id));
  showBoard(cls.id, { notice });
}

// 새 반 만들기(#new, 반이 없을 때도): 쪽 가운데 폼 하나. 만들면 그 반 대시보드의 반 설정 쪽으로(반 코드와 알려 줄 말이 크게)
function showNewClass({ notice = '' } = {}) {
  boardOwner = null;
  viewedClasses = null;
  viewedSido = null;
  nav += 1;
  const my = nav;
  placeAt('new');
  const first = myClasses !== null && !myClasses.length;
  const form = newClassForm();
  show('new', h('div', { class: 't-new-page' },
    h('section', { class: 't-card t-new-card', 'aria-labelledby': 't-new-title' },
      h('h2', { id: 't-new-title', tabindex: '-1' }, '새 반 만들기'),
      h('p', { class: 't-lead' }, first
        ? '아직 만든 반이 없어요. 학년·반·인원을 넣으면 아이들에게 알려 줄 반 코드 숫자 6개가 생겨요.'
        : '학년·반·인원을 넣으면 반 코드 숫자 6개가 생겨요. 만든 반은 맨 위 반 고르기에서 바꿔 볼 수 있어요.'),
      notice ? msgLine(notice) : null,
      form)));
  if (myClasses === null) loadMyClasses(my);
}

function newClassForm() {
  const grade = h('select', { name: 'grade' },
    h('option', { value: '' }, '학년 고르기'),
    [1, 2, 3, 4, 5, 6].map((g) => h('option', { value: String(g) }, `${g}학년`)));
  const classNo = h('input', { type: 'number', name: 'classNo', min: '1', max: '99', inputmode: 'numeric' });
  grade.value = me?.teacher?.grade ? String(me.teacher.grade) : '';
  classNo.value = me?.teacher?.classNo ? String(me.teacher.classNo) : '';
  const size = h('input', { type: 'number', name: 'size', min: '1', max: '40', inputmode: 'numeric', value: '25' });
  const go = h('button', { type: 'submit', class: 'primary' }, '반 만들기');
  const msg = msgLine();
  const form = h('form', { class: 't-form t-new-class', novalidate: true },
    h('div', { class: 't-row' }, field('학년', grade), field('반', classNo), field('인원', size)),
    h('div', { class: 't-actions' }, go),
    msg);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const body = { grade: Number(grade.value), classNo: Number(classNo.value), size: Number(size.value) };
    const problem = T.classProblem(body);
    if (problem) {
      say(msg, problem, 'bad');
      return;
    }
    say(msg, '');
    const my = nav;
    const res = await busy(go, '만드는 중…', () => send('/v1/teacher/classes', { body }));
    if (!res || my !== nav) return;
    if (res.ok && isClass(res.data?.class)) {
      classChanged(res.data.class);
      location.hash = boardHash(res.data.class.id, 'settings'); // → 그 반 대시보드의 반 설정 쪽(반 코드와 알려 줄 말이 크게)
      return;
    }
    say(msg, T.teacherMessage('class', res), 'bad');
  });
  return form;
}

// ── 반 대시보드 ──

async function showBoard(id, { notice = '', page = 'overview', kid = null, tab = 'summary' } = {}) {
  const my = ++nav;
  if (boardClass?.id !== id) boardClass = [...(myClasses ?? []), ...(viewedClasses ?? [])].find((c) => c.id === id) ?? null;
  placeAt(id);
  showLoading();
  const res = await send(`/v1/teacher/classes/${id}/board`, { method: 'GET' });
  if (!res || my !== nav) return;
  if (res.status === 404) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    openDefaultClass({ notice: T.teacherMessage('board', res), avoid: id });
    return;
  }
  if (!res.ok || !isClass(res.data?.class) || !Array.isArray(res.data?.kids)) {
    // 403(인증이 풀림)이면 「다시」는 내 상태부터(반 목록과 같이): 대시보드만 되부르면 다시 403
    showProblem(T.teacherMessage('board', res), () => (res.status === 403 ? loadMe() : showBoard(id, { notice, page })));
    return;
  }
  boardClass = res.data.class;
  classChanged(res.data.class, res.data.owner ?? null);
  if (!boardOwner) saveLastClass(storage, id); // 내 반을 고르는 기록에는 남의 반을 남기지 않는다
  const screen = boardScreen({
    data: res.data,
    storage,
    send,
    busy,
    notice,
    page,
    pageHash: (p, k = null, t = 'summary') => boardHash(id, p, k, t),
    gone: (message) => {
      history.replaceState(null, '', `${location.pathname}${location.search}`);
      openDefaultClass({ notice: message, avoid: id });
    },
    recheck: (message) => loadMe({ notice: message }),
    changed: classChanged,
  });
  show('board', screen.el);
  board = { id, screen };
  dispose = () => {
    screen.dispose();
    board = null;
  };
  if (kid) screen.showKid(kid, tab); // 주소에 리포트 번호가 있으면(새로 열기 · 받은 주소) 그 아이 리포트를 연다
  if (boardOwner) loadViewedClasses(my, boardOwner.loginId);
  else if (myClasses === null) loadMyClasses(my);
}

// 주소가 바뀌었다(쪽 탭 · 반 고르기 · 아이 리포트 · 뒤로 가기): 같은 반 안이면 다시 받지 않고 그 쪽을 그리고 리포트를 열거나 닫는다
window.addEventListener('hashchange', () => {
  if (!session.auth || me?.teacher?.status !== 'verified' || me.teacher.mustChangePassword) return;
  const at = readBoardHash(location.hash);
  if (at && board && at.id === board.id && root.dataset.view === 'board') {
    if (!at.exact) history.replaceState(null, '', boardHash(at.id, at.page, at.kid, at.tab));
    board.screen.goPage(at.page);
    board.screen.showKid(at.kid, at.tab, { pushed: true });
    syncTop();
    return;
  }
  routeVerified();
});

if (!api) {
  renderHead();
  show('no-server', h('section', { class: 't-card' }, heading('선생님 화면'), h('p', { class: 't-lead' }, T.NO_SERVER)));
} else if (!session.auth) {
  showLogin();
} else {
  loadMe();
}
