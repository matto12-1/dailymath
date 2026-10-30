// 관리 화면(설계서 6, app/admin.html): 관리자 아이디 로그인·처음 비밀번호 바꾸기 → 계정 만들기·쪽지·목록·지우기.
// GOOGLE_LOGIN을 켜면 아래의 교사 인증 신청 승인·거절도 쓴다.
// - 로그인은 선생님 화면과 같은 토큰 칸(Ruling R3: 한 번 로그인으로 두 화면). 부르기·401은 teacher/session.js, 단추는 google-login.js.
//   로그인이 되면 토큰을 남기고 쪽을 새로 연다(구글 스크립트를 토큰 옆에 남기지 않게. 새로 연 쪽은 로그인 칸을 그리지 않는다).
// - 상태별 본문은 #admin[data-view]: no-server · loading · login · error · refused(관리자가 아님, 403) · list.
// - 목록: 기다리는 신청(오래된 것부터, 서버 차례)과 인증된 선생님. 승인(학교 이름 고칠 수 있음)·거절(까닭 고르기·직접 쓰기)하면
//   서버가 그 순간 파일을 지운다 → 「…파일을 지웠어요」, 그 줄이 빠지고 두 목록을 새로 받는다. 이미 처리된 신청(409)이면 알리고 새로 받는다.
// - 증명서 보기(Ruling R29): 토큰을 붙여 바이트로 받아, 답 꼴이 허락한 넷 가운데 하나이고 신청 줄의 꼴과 같을 때만 띄운다.
//   그림은 그 꼴로 Blob을 새로 만들어(res.blob()을 그대로 쓰지 않는다: HTML 꼴 blob 주소는 이 쪽 출처로 돌아 토큰을 읽을 수 있다)
//   canvas에 그린다(admin/picture.js. 쪽에 img·blob 주소를 두지 않아 폰에서 길게 눌러 저장하지 못한다),
//   PDF는 모든 기기에서 pdf.js가 쪽마다 canvas에 그린다(admin/pdf.js, Ruling R33. blob 주소·iframe·내려받기 없음).
//   파일 칸은 오른쪽 단추·길게 누르기 메뉴(그림 저장·복사)를 열지 않는다.
//   못 그리면(admin/text.js drawNote): 깨진 PDF·비밀번호 PDF·풀지 못한 그림은 알림만, pdf.js·worker를 받지 못했거나 오프라인이면
//   끊김 글과 [다시], 그 밖(worker가 죽음·그리다 난 오류)은 「PDF를 그리다가 멈췄어요.」와 [다시].
//   보기 창이 닫히면(✕·Esc·바깥 누르기·승인/거절로 넘어감·화면이 바뀜·로그아웃) 그리기를 멈추고 canvas를 비운다(PDF는 worker까지).
// - 지우기(설계서 6, 2026-10-21 결정 3): 목록 아래 「지우기」 칸(admin/erase.js)의 작은 폼으로 지워 달라는 요청을 처리한다.
//   [찾기]는 무엇이 지워지는지 한 줄(admin/text.js foundText)과 붉은 [지우기], 확인 시트 「되돌릴 수 없어요. 정말 지울까요?」를 지나
//   「지웠어요.」와 지운 수를 보이고 칸을 비운 뒤 두 목록을 새로 받는다(지운 선생님이 목록에서 빠진다).
// - 서버에서 온 글(학교·메일·이름)은 글로만 넣는다(Ruling R27): h()의 html 칸은 쓰지 않는다.
// - 부름은 한 번에 하나(working): 목록 받기·승인·거절·로그아웃·지울 것 찾기·지우기가 도는 동안 부름 단추(data-action)는 모두 막힌다. 늦게 온 옛 목록 답은 버린다(loadSeq).
//   증명서 파일 받기는 이 셈에 넣지 않는다(바꾸는 부름이 아니고, 보기 창을 닫으면 그 답은 버린다).
// - 생김새는 모두 admin.css와 공용 staff.css(Ruling R24·R34, 2026-10-22 밝은 판·어두운 판). 글·검사는 admin/text.js, 알림 줄은 teacher/say.js.
//   틀은 선생님 화면과 같은 V14 결(2026-10-22 오후 결정, staff-shell.js): 맨 위 줄(「매일 수학 관리」 · 메일 칸)과
//   왼쪽 얇은 아이콘 줄(밝기 · 개인정보 안내 · 로그아웃). 본문 칸 배치는 그대로.
import { h } from '../ui.js?v=9a67f36b25';
import { apiBase, GOOGLE_CLIENT_ID, GOOGLE_LOGIN } from '../config.js?v=9a67f36b25';
import { passwordLoginForm, passwordChangeForm, passwordResetForm } from '../password-login.js?v=9a67f36b25';
import { keyCard } from '../account-key.js?v=9a67f36b25';
import { openMyAccount } from '../my-account.js?v=9a67f36b25';
import { adminHome } from './home.js?v=9a67f36b25';
import { googleButton } from '../google-login.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { lockSheet } from '../sheet-lock.js?v=9a67f36b25';
import { teacherSession, busy } from '../teacher/session.js?v=9a67f36b25';
import { msgLine, say } from '../teacher/say.js?v=9a67f36b25';
import * as T from '../teacher/text.js?v=9a67f36b25';
import * as A from './text.js?v=9a67f36b25';
import { drawPdf, MAX_PAGES } from './pdf.js?v=9a67f36b25';
import { drawPicture } from './picture.js?v=9a67f36b25';
import { labMark, openLab, privacyLink } from '../lab.js?v=9a67f36b25';
import { eraseSection } from './erase.js?v=9a67f36b25';
import { themeSwitch } from '../staff-theme.js?v=9a67f36b25';
import { railButton, railPrivacy, railGroup } from '../staff-shell.js?v=9a67f36b25';

const root = document.getElementById('admin');
document.body.dataset.accounts = String(!GOOGLE_LOGIN);
const head = document.getElementById('admin-head');
const rail = document.getElementById('admin-rail');
// 맨 위 줄 오른쪽 끝 MattoLAB 글자(누르면 제품 목록 · 연락처 종이 창, app/lab.js, 설계서 4-5). 로그인 · 처음 바꾸기 · 잊었어요 · 열쇠 ·
// 관리자 아님 등 들어오는 쪽에만 두고 관리 첫 화면에서는 뺀다(2026-10-23 Matto, 선생님 화면과 같다).
// 불러오는 중에는 앞 화면 그대로, 처음 불러오는 동안은 숨겨 둔다
const mark = labMark({ className: 's-pill' });
const NO_MARK = ['list'];
mark.hidden = true;
const api = apiBase();
const storage = (() => { try { return globalThis.localStorage ?? null; } catch { return null; } })();
const OTHER = 'other'; // 거절 까닭 「직접 쓰기」
const TEACHER_COLUMNS = [['c-mail', '메일'], ['c-school', '학교'], ['c-day', '인증한 날'], ['c-classes', '열린 반']];

let nav = 0; // 화면을 바꿀 때마다 1씩: 늦게 온 답이 새 화면을 덮지 않게
let closeSheet = null; // 열린 시트 닫기(보기 창은 닫힐 때 그린 canvas도 비운다)
let working = 0; // 도는 부름 수(목록 받기·승인·거절·로그아웃)
let loadSeq = 0; // 목록 받기 차례
let list = null; // 목록 화면 조각(목록 화면일 때만)
let certs = [];
let teachers = [];
let manager = null;
let adminMe = null; // 마지막으로 받은 내 계정(/v1/teacher/me의 teacher): 「내 계정」 시트가 쓴다
let closeMine = null; // 열린 「내 계정」 시트 닫기(화면을 바꿀 때 닫는다)
const session = teacherSession({
  api,
  storage,
  // 두 목록을 함께 받다가 둘 다 401이어도 로그인 칸은 한 번만 그린다
  onSignedOut: (message) => { if (root.dataset.view !== 'login') showLogin(message); },
});
const send = (path, opts) => session.send(path, opts);
// 「지우기」 칸(admin/erase.js)이 쓰는 이 쪽 손잡이: 부름 하나씩·보내기·두 목록 새로 받기·관리자 아님·화면 차례·열린 시트·로그인한 메일
const eraseHooks = {
  isWorking: () => working > 0,
  task: (work) => task(work),
  send,
  reload: () => manager ? manager.reload() : reload(),
  refused: () => showRefused(),
  page: () => nav,
  holdSheet: (close) => { closeSheet = close; },
  adminEmail: () => session.auth?.email ?? null,
};
const heading = (text) => h('h2', { tabindex: '-1' }, text);
const none = (text = '없어요') => h('span', { class: 'a-none' }, text);
const fact = (label, value) => h('div', {}, h('dt', {}, label), h('dd', {}, value));
// 시트 머리 아래 한 줄: 학교 · 메일 · 이름
const who = (cert) => [cert.school, cert.email, cert.name].filter(Boolean).join(' · ');

// 본문 바꾸기. 열린 시트는 닫는다. 누른 단추가 화면과 같이 사라졌으면(불러오는 중 화면을 거쳐도) 다음 화면 제목으로 초점을 옮긴다.
let focusOwed = false;
function show(view, ...nodes) {
  closeSheet?.();
  closeMine?.();
  manager?.dispose(); manager = null;
  if (view !== 'list') list = null;
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

// 머리띠: 서버가 있고 로그인했으면 메일·로그아웃(관리자가 아니어도 다른 계정으로 바꾸게). 밝기 단추(staff-theme.js)는 늘 오른쪽 끝
function renderHead() {
  const auth = session.auth;
  if (head.contains(document.activeElement) || rail.contains(document.activeElement)) focusOwed = true; // 로그아웃 단추를 눌렀다
  const signedIn = Boolean(auth && api);
  // 아이디 관리자면 계정 칸이 단추: 「내 계정」 시트(app/my-account.js, 설계서 4-2 점검 7). 화면 읽개 이름은 「내 계정」 + 보이는 글
  const mine = Boolean(adminMe?.loginId) && !adminMe.mustChangePassword;
  // 오른쪽 끝 묶음: 계정 칸(로그인했을 때) · MattoLAB 글자(들어오는 쪽에서만 보인다, show)
  head.replaceChildren(
    h('h1', { class: 's-pill s-brand a-brand' }, '매일 수학 관리'),
    h('div', { class: 's-top-end' },
      signedIn ? h(mine ? 'button' : 'div', { class: 's-pill a-account', type: mine ? 'button' : null, 'aria-haspopup': mine ? 'dialog' : null, onclick: mine ? openMine : null },
        mine ? h('span', { class: 's-sr' }, '내 계정 ') : null,
        h('span', { class: 'a-avatar', 'aria-hidden': 'true' }), h('span', { class: 'a-who' }, auth.email)) : null,
      mark));
  rail.replaceChildren(h('div', { class: 's-rail-inner' },
    railGroup(themeSwitch('a-theme')),
    signedIn ? h('div', { class: 's-rail-gap' }) : null,
    signedIn ? railGroup(railPrivacy(), railButton({ label: '로그아웃', icon: 'logout', className: 'a-logout', onclick: logout })) : null));
}

function openMine() {
  if (closeMine || !adminMe?.loginId || adminMe.mustChangePassword) return;
  closeMine = openMyAccount({ session, teacher: adminMe, onClose: () => { closeMine = null; } });
}

function showLoading() {
  show('loading', h('p', { class: 'a-loading' }, '불러오는 중…'));
}

// 다시 해 볼 수 있는 실패(인터넷·서버 오류)
function showProblem(message, retry) {
  const again = h('button', { type: 'button', class: 'primary', onclick: () => retry() }, '다시');
  show('error', h('section', { class: 'a-card a-problem' }, heading('잠깐만요'), h('p', { class: 'a-alert', role: 'alert' }, message), h('div', { class: 'a-actions' }, again)));
}

async function logout(event) {
  event.currentTarget.disabled = true;
  nav += 1;
  // 로그아웃도 부름 하나: 서버가 답하는 동안(10초까지) 목록의 부름 단추를 막는다. 그 사이 누른 승인이 서버에 닿고
  // 로그인 칸에 덮여 알리지 못하는 일이 없게. 서버 토큰도 지운다(안 돼도 이 기기는 로그아웃, 서버가 없으면 보내지 않는다)
  await task(() => session.logout());
  showLogin('로그아웃했어요.', 'ok'); // 열린 보기 창이 있었다면 show()가 닫으며 푼다
}

// ── 로그인 · 관리자가 아님 ──

function showLogin(message = '', tone = '') {
  nav += 1;
  const my = nav;
  certs = [];
  teachers = [];
  adminMe = null;
  renderHead();
  const box = h('div', { class: 'a-google' });
  const msg = msgLine(message, tone);
  if (!GOOGLE_LOGIN) {
    show('login', h('section', { class: 'a-card a-split a-login' },
      h('div', { class: 'a-intro' }, heading('관리 화면 로그인'), h('p', { class: 'a-lead' }, '관리자 아이디와 비밀번호로 들어와요. 처음 들어오면 비밀번호를 바꿔 주세요.')),
      h('div', { class: 'a-action' }, passwordLoginForm({ api, session, entered: () => loadLists(), onForgot: showForgot }), msg, privacyLink())));
    return;
  }
  show('login', h('section', { class: 'a-card a-split a-login' },
    h('div', { class: 'a-intro' },
      heading('관리 화면 로그인'),
      h('p', { class: 'a-lead' }, '관리자 구글 계정으로 로그인해요. 선생님 화면과 같은 로그인이라 한 번 하면 두 화면이 다 열려요.')),
    h('div', { class: 'a-action' }, passwordLoginForm({ api, session, entered: () => loadLists(), onForgot: showForgot }), box, msg, h('p', { class: 'privacy-note' }, '로그인하면 받는 것과 두는 기간: ', privacyLink()))));
  googleButton(box, { clientId: GOOGLE_CLIENT_ID, api, tell: (text, mood) => say(msg, text, mood) }).then((auth) => {
    if (my !== nav) return;
    // 토큰을 남기고 쪽을 새로 연다(구글 스크립트를 남기지 않게). 저장이 막힌 창은 새로 열면 로그인이 사라지므로 이 쪽에서 잇는다.
    if (session.keep(auth)) location.reload();
    else loadLists();
  });
}

// 「비밀번호를 잊었어요」(설계서 4-2 관리자): Matto가 관리자 비밀번호를 잊어도 장부를 손대지 않고 계정 열쇠로 돌아온다
function showForgot() {
  nav += 1;
  renderHead();
  show('forgot', h('section', { class: 'a-card a-split a-login' },
    h('div', { class: 'a-intro' }, heading('비밀번호를 잊었어요'), h('p', { class: 'a-lead' }, T.FORGOT_LEAD)),
    h('div', { class: 'a-action' }, passwordResetForm({ api, session, entered: ({ key }) => showKey(key, '새 계정 열쇠를 받았어요'), onBack: () => showLogin(), onContact: () => openLab({ contact: true }) }))));
}

// 계정 열쇠 카드(처음 바꾸기 · 잊었어요 뒤). [다 적었어요]를 눌러야 관리 첫 화면으로 간다
function showKey(key, title) {
  nav += 1;
  adminMe = null;
  renderHead();
  show('key', h('section', { class: 'a-card a-key' }, keyCard({ loginId: session.auth?.email ?? '', key, title, onDone: () => loadLists() })));
}

// 관리자가 아닌 계정(403 not-admin). 머리띠의 로그아웃으로 다른 계정, 선생님 화면은 같은 로그인으로 열린다.
function showRefused() {
  nav += 1;
  renderHead();
  show('refused', h('section', { class: 'a-card a-refused' },
    heading(A.NOT_ADMIN),
    h('p', { class: 'a-lead' }, GOOGLE_LOGIN ? A.NOT_ADMIN_LEAD : '이 계정은 관리자가 아니에요. 선생님 화면은 그대로 쓸 수 있어요.'),
    h('div', { class: 'a-actions' }, h('a', { class: 'a-to-teacher', href: `teacher.html${location.search}` }, '선생님 화면으로'))));
}

// ── 목록 ──

// 기다리는 신청과 인증된 선생님을 함께 받는다. { certs, teachers } · { refused } · { problem: 글 } · 로그인이 풀렸으면 null
async function fetchLists() {
  const [c, t] = await Promise.all([
    send('/v1/admin/certs?status=pending', { method: 'GET' }),
    send('/v1/admin/teachers', { method: 'GET' }),
  ]);
  if (!c || !t) return null;
  if (c.status === 403 || t.status === 403) return { refused: true };
  if (!c.ok || !Array.isArray(c.data?.certs)) return { problem: A.adminMessage('list', c) };
  if (!t.ok || !Array.isArray(t.data?.teachers)) return { problem: A.adminMessage('list', t) };
  return { certs: c.data.certs.map(A.readCert).filter(Boolean), teachers: t.data.teachers.map(A.readTeacher).filter(Boolean) };
}

// 처음(또는 [다시]): 받는 동안 「불러오는 중…」
async function loadLists() {
  const my = ++nav;
  showLoading();
  const state = await send('/v1/teacher/me', { method: 'GET' });
  if (!state || my !== nav) return;
  if (!state.ok) { showProblem(T.teacherMessage('me', state), () => loadLists()); return; }
  if (!state.data?.teacher?.isAdmin && !GOOGLE_LOGIN) { showRefused(); return; }
  adminMe = state.data.teacher;
  renderHead();
  if (state.data.teacher.mustChangePassword) {
    show('password', h('section', { class: 'a-card a-split' }, h('div', { class: 'a-intro' }, heading('처음 비밀번호 바꾸기'),
      h('p', { class: 'a-lead' }, '8자 이상, 처음 비밀번호와 다른 비밀번호로 바꿔 주세요.')),
      passwordChangeForm({ session, entered: ({ key }) => (key ? showKey(key, '계정 열쇠를 받았어요') : loadLists()) })));
    return;
  }
  if (!GOOGLE_LOGIN) {
    show('list');
    manager = adminHome(eraseHooks);
    root.append(manager.el);
    return;
  }
  const got = await fetchLists();
  if (!got || my !== nav) return;
  if (got.refused) showRefused();
  else if (got.problem) showProblem(got.problem, () => loadLists());
  else showList(got);
}

// 목록 화면에서 새로 받기. 그렸으면 true, 못 받았으면 false(받기 알림 줄에 까닭, 목록은 그대로),
// 로그인이 풀렸거나 화면이 바뀌었거나 더 새 받기가 있으면 null.
async function reload() {
  const mine = ++loadSeq;
  const my = nav;
  const got = await fetchLists();
  if (!got || my !== nav || mine !== loadSeq) return null;
  if (got.refused) {
    showRefused();
    return null;
  }
  if (got.problem) {
    say(list.loadMsg, got.problem, 'bad');
    return false;
  }
  say(list.loadMsg, '');
  certs = got.certs;
  teachers = got.teachers;
  renderLists();
  return true;
}

// 부름 단추(data-action)는 부름이 도는 동안 모두 막는다. 새로 그린 단추도 그린 뒤 여기서 맞춘다.
function syncActions() {
  for (const b of root.querySelectorAll('button[data-action]')) b.disabled = working > 0;
}

// 목록 화면의 부름 하나(새로 받기·승인·거절)
async function task(work) {
  working += 1;
  syncActions();
  try {
    return await work();
  } finally {
    working -= 1;
    syncActions();
  }
}

function showList(data) {
  nav += 1;
  certs = data.certs;
  teachers = data.teachers;
  renderHead();
  const refresh = h('button', { type: 'button', class: 'a-refresh', 'data-action': 'refresh' }, '새로 고침');
  refresh.addEventListener('click', () => {
    if (working) return;
    say(list.notice, '');
    task(() => busy(refresh, '받는 중…', () => reload()));
  });
  list = {
    pendingTitle: h('h2', { id: 'a-pending-title', tabindex: '-1' }, '기다리는 신청'),
    pendingCount: h('span', { class: 'a-count' }),
    pendingBody: h('div', { class: 'a-list-body' }),
    teacherCount: h('span', { class: 'a-count' }),
    teacherBody: h('div', { class: 'a-list-body' }),
    notice: msgLine(), // 승인·거절한 결과
    loadMsg: msgLine(), // 새로 받지 못한 까닭
  };
  show('list', h('div', { class: 'a-board' },
    h('div', { class: 'a-bar' }, refresh, h('button', { type: 'button', 'data-action': 'accounts', onclick: () => {
      show('list');
      manager = adminHome(eraseHooks);
      root.append(h('button', { type: 'button', onclick: () => loadLists() }, '인증 신청으로'), manager.el);
    } }, '선생님 계정 관리'), list.loadMsg),
    list.notice,
    h('div', { class: 'a-lists' },
      h('section', { class: 'a-panel a-pending', 'aria-labelledby': 'a-pending-title' },
        h('div', { class: 'a-panel-top' }, list.pendingTitle, list.pendingCount),
        h('p', { class: 'a-hint' }, '오래된 신청부터 보여요. 승인하거나 거절하면 재직증명서 파일을 바로 지워요.'),
        list.pendingBody),
      h('section', { class: 'a-panel a-verified', 'aria-labelledby': 'a-verified-title' },
        h('div', { class: 'a-panel-top' }, h('h2', { id: 'a-verified-title' }, '인증된 선생님'), list.teacherCount),
        list.teacherBody)),
    eraseSection(eraseHooks)));
  renderLists();
}

// 두 목록을 지금 값으로 다시 그린다. 누르던 단추가 같이 사라졌으면(그 줄이 빠졌다) 기다리는 신청 제목으로 초점을 옮긴다.
function renderLists() {
  if (!list) return;
  const focused = document.activeElement;
  list.pendingCount.textContent = `${certs.length}건`;
  list.pendingBody.replaceChildren(certs.length
    ? h('ul', { class: 'a-certs' }, certs.map(certItem))
    : h('p', { class: 'a-empty' }, '기다리는 신청이 없어요.'));
  list.teacherCount.textContent = `${teachers.length}명`;
  list.teacherBody.replaceChildren(teachers.length ? teacherTable() : h('p', { class: 'a-empty' }, '아직 인증한 선생님이 없어요.'));
  syncActions();
  if (focused && focused !== document.body && !focused.isConnected) list.pendingTitle.focus({ preventScroll: true });
}

// 신청 카드: 학교 이름 · 남은 날 · 선생님 메일 · 이름 · 올린 날 · [증명서 보기] [승인] [거절]
function certItem(cert) {
  const schoolId = `a-cert-${cert.id}`;
  const left = A.daysLeft(cert.expiresAt);
  // 단추 이름은 짧게 두고 어느 신청인지는 학교 이름으로 덧붙인다(aria-describedby)
  const action = (name, text, run, cls = null) => h('button', {
    type: 'button', class: cls, 'data-action': name, 'aria-describedby': schoolId,
    onclick: () => { if (!working) run(cert); },
  }, text);
  return h('li', { class: 'a-cert', 'data-cert': cert.id },
    h('div', { class: 'a-cert-top' },
      h('strong', { class: 'a-school', id: schoolId }, cert.school),
      left ? h('span', { class: 'a-left', 'data-soon': left === '오늘까지' ? 'true' : null }, left) : null),
    h('dl', { class: 'a-facts' },
      fact('선생님 메일', cert.email),
      fact('이름', cert.name || none()),
      fact('올린 날', T.msDay(cert.createdAt) ?? none('모름'))),
    h('div', { class: 'a-cert-actions' },
      action('view', '증명서 보기', openViewer),
      action('approve', '승인', askApprove, 'primary'),
      action('reject', '거절', askReject)));
}

// 인증된 선생님: 메일 · 학교 · 인증한 날 · 열린 반(서버 classes는 닫지 않은 반만 센다)
function teacherTable() {
  return h('div', { class: 'a-table-wrap' },
    h('table', { class: 'a-table', 'aria-labelledby': 'a-verified-title' },
      h('thead', {}, h('tr', {}, TEACHER_COLUMNS.map(([cls, label]) => h('th', { scope: 'col', class: cls }, label)))),
      h('tbody', {}, teachers.map((t) => h('tr', {},
        h('th', { scope: 'row', class: 'c-mail' }, t.email),
        h('td', { class: 'c-school', 'data-label': '학교' }, t.school),
        h('td', { class: 'c-day', 'data-label': '인증한 날' }, T.msDay(t.verifiedAt) ?? ''),
        h('td', { class: 'c-classes', 'data-label': '열린 반' }, `${t.classes}개`))))));
}

// ── 증명서 보기(Ruling R29) ──

// 받는 동안 「받는 중…」, 다시 해 볼 수 있는 실패면 [다시]. 그림은 canvas 하나로 화면에 맞춰 보이고 [원래 크기]로 키워 밀어 볼 수 있다.
// PDF는 쪽을 칸 너비에 맞춰 그려 위아래로 밀어 본다. 그리는 동안 파일 칸에 aria-busy.
// 못 그리면 알림(줄 단추는 그대로): 깨진 PDF 「이 PDF를 열지 못했어요.」, 비밀번호 PDF, 풀지 못한 그림 「볼 수 없는 파일이에요.」,
// pdf.js·worker를 받지 못함(오프라인)은 끊김 글, 그 밖(worker가 죽음 등)은 「PDF를 그리다가 멈췄어요.」. 둘 다 [다시]
// (끊김이었으면 pdf.js를 새로 받아, 멈춤이었으면 받아 둔 pdf.js로 다시 그린다).
// 보기 창의 [승인]·[거절]은 창을 닫고(비운다) 그 시트를 연다.
function openViewer(cert) {
  let drawn = null; // 그리는 중이거나 그린 증명서(drawPicture·drawPdf)
  let closed = false;
  const free = () => {
    drawn?.destroy(); // 그리기를 멈추고 canvas를 비운다(PDF는 문서·worker까지 끝낸다)
    drawn = null;
  };
  const box = h('div', { class: 'a-file', 'data-state': 'wait' });
  box.addEventListener('contextmenu', (event) => event.preventDefault()); // 그림 저장·복사 메뉴를 열지 않는다
  const zoom = h('button', { type: 'button', class: 'a-zoom', 'aria-pressed': 'false', hidden: true }, '원래 크기');
  const toApprove = h('button', { type: 'button', class: 'primary' }, '승인');
  const toReject = h('button', { type: 'button' }, '거절');
  const close = openSheet(document.body, {
    label: '재직증명서',
    className: 'a-sheet a-viewer',
    onClose: () => {
      closed = true;
      free();
      closeSheet = null;
    },
  },
  h('h2', {}, '재직증명서'),
  h('p', { class: 'a-sheet-who' }, who(cert)),
  box,
  h('div', { class: 'a-sheet-actions' }, zoom, toApprove, toReject));
  closeSheet = close;
  toApprove.addEventListener('click', () => { close(); askApprove(cert); });
  toReject.addEventListener('click', () => { close(); askReject(cert); });
  zoom.addEventListener('click', () => {
    const on = box.dataset.zoom !== 'true';
    box.dataset.zoom = String(on);
    zoom.setAttribute('aria-pressed', String(on));
    zoom.textContent = on ? '화면에 맞추기' : '원래 크기';
  });

  function note(message, retry = false) {
    box.dataset.state = 'note';
    box.removeAttribute('aria-busy');
    // replaceChildren은 null도 글(「null」)로 넣는다: [다시]가 없으면 아예 넘기지 않는다
    const again = retry ? [h('button', { type: 'button', onclick: () => load() }, '다시')] : [];
    box.replaceChildren(h('p', { class: 'a-file-note', role: 'alert' }, message), ...again);
  }
  // kind: 'image'(그 꼴로 새로 만든 Blob을 canvas 하나에) · 'pdf'(쪽마다 canvas)
  async function draw(kind, bytes, type) {
    const label = `${cert.school} 재직증명서`;
    const pages = h('div', { class: 'a-pages' });
    box.dataset.state = kind;
    box.setAttribute('aria-busy', 'true');
    let mine;
    if (kind === 'pdf') {
      box.replaceChildren(pages);
      mine = drawPdf(pages, bytes, label);
    } else {
      box.replaceChildren();
      mine = drawPicture(box, new Blob([bytes], { type }), label);
    }
    drawn = mine;
    const result = await mine.done;
    if (closed || drawn !== mine) return;
    if (result === 'ok') {
      box.removeAttribute('aria-busy');
      if (kind === 'image') zoom.hidden = false;
      else if (mine.total > MAX_PAGES) pages.append(h('p', { class: 'a-pages-more' }, A.pdfMore(MAX_PAGES, mine.total)));
      return;
    }
    free();
    const trouble = A.drawNote(result); // 끊김·멈춤이면 [다시](끊김이었으면 pdf.js·worker를 새 주소로 새로 받는다)
    note(trouble.message, trouble.retry);
  }
  async function load() {
    free();
    box.dataset.state = 'wait';
    box.removeAttribute('aria-busy');
    box.replaceChildren(h('p', { class: 'a-file-note' }, '증명서를 받는 중…'));
    const res = await send(`/v1/admin/certs/${cert.id}/file`, { method: 'GET', bytes: true, timeoutMs: 60000 });
    if (!res || closed) return; // 로그인이 풀렸거나(화면이 바뀌며 창도 닫혔다) 그새 창을 닫았다: 받은 것은 버린다
    if (res.status === 403) {
      showRefused();
      return;
    }
    const view = A.fileView(res, cert.fileType);
    if (view.message) {
      note(view.message, view.retry);
      return;
    }
    draw(view.kind, res.bytes, view.type);
  }
  load();
}

// ── 승인 · 거절 ──

// [yes]를 누르면 read()로 칸을 보고(틀리면 시트에 글, 보내지 않는다) 그 부름 하나를 하는 동안 시트를 잠근다(✕·취소·Esc·바깥).
// 되면 시트를 닫고 그 줄을 빼고 「…파일을 지웠어요」, 두 목록을 새로 받는다. 이미 처리됐거나 없는 신청(409·404)이면 시트를 닫고
// 알린 뒤 새로 받는다. 그 밖의 실패는 시트에 글(다시 누를 수 있다).
function decisionSheet({ cert, kind, title, yes, busyLabel, done, fields, read }) {
  const sheetMsg = msgLine();
  const ok = h('button', { type: 'submit', class: 'primary' }, yes);
  const cancel = h('button', { type: 'button' }, '취소');
  const form = h('form', { class: 'a-decide', novalidate: true }, ...fields, h('div', { class: 'a-sheet-actions' }, ok, cancel), sheetMsg);
  const close = openSheet(document.body, { label: title, className: 'a-sheet a-decide-sheet', onClose: () => { closeSheet = null; } },
    h('h2', {}, title),
    h('p', { class: 'a-sheet-who' }, who(cert)),
    form);
  closeSheet = close;
  cancel.addEventListener('click', () => close());
  // 칸을 고치거나 까닭을 고르면 앞의 「…써 주세요」 글은 지운다
  form.addEventListener('input', () => { if (sheetMsg.dataset.tone === 'bad') say(sheetMsg, ''); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (working) return;
    const { problem, body } = read();
    if (problem) {
      say(sheetMsg, problem, 'bad');
      return;
    }
    say(sheetMsg, '');
    const my = nav;
    task(async () => {
      const unlock = lockSheet(form.closest('.sheet'));
      ok.textContent = busyLabel;
      let res = null;
      try {
        res = await send(`/v1/admin/certs/${cert.id}/${kind}`, { body });
      } finally {
        unlock();
        ok.textContent = yes;
      }
      if (!res || my !== nav) return; // 로그인이 풀렸다(화면이 바뀌며 시트도 닫혔다)
      if (res.status === 403) {
        showRefused();
        return;
      }
      if (res.ok || res.status === 409 || res.status === 404) {
        close();
        if (res.ok) {
          certs = certs.filter((c) => c.id !== cert.id);
          renderLists();
        }
        say(list.notice, res.ok ? done : A.adminMessage(kind, res), res.ok ? 'ok' : 'bad');
        await reload();
        return;
      }
      say(sheetMsg, A.adminMessage(kind, res), 'bad');
    });
  });
}

// 승인: 학교 이름은 신청한 이름을 채워 두고 고칠 수 있다(2~40자, 서버 readSchool과 같은 규칙)
function askApprove(cert) {
  const school = h('input', { name: 'school', id: 'a-approve-school', autocomplete: 'off', maxlength: '40', 'aria-describedby': 'a-approve-school-hint' });
  school.value = cert.school;
  decisionSheet({
    cert, kind: 'approve', title: '교사 인증 승인', yes: '승인', busyLabel: '승인하는 중…', done: A.APPROVED,
    fields: [
      h('div', { class: 'a-field' },
        h('label', { class: 'a-label', for: school.id }, '학교 이름'),
        school,
        h('small', { class: 'a-hint', id: 'a-approve-school-hint' }, '선생님 화면에 「인증됨 · 학교 이름」으로 보여요. 2자에서 40자까지 고칠 수 있어요.')),
      h('p', { class: 'a-sheet-text' }, '승인하면 선생님이 반을 만들 수 있고, 재직증명서 파일은 바로 지워요.'),
    ],
    read: () => {
      const name = T.cleanSchool(school.value);
      const problem = T.schoolProblem(name);
      return problem ? { problem } : { body: { school: name } };
    },
  });
}

// 거절: 까닭은 둘 가운데 고르거나 직접 쓴다(1~200자). 선생님 화면에 그 까닭과 다시 올리기가 보인다.
function askReject(cert) {
  const own = h('textarea', { name: 'reason-text', rows: '3', 'aria-label': '직접 쓰는 까닭', hidden: true });
  const choice = (value, label) => h('label', { class: 'a-choice' }, h('input', { type: 'radio', name: 'reason', value }), h('span', {}, label));
  const reasons = h('fieldset', { class: 'a-reasons' },
    h('legend', { class: 'a-label' }, '거절 까닭'),
    A.REASONS.map((reason) => choice(reason, reason)),
    choice(OTHER, '직접 쓰기'),
    own);
  const otherPicked = () => reasons.querySelector(`input[value="${OTHER}"]`).checked;
  reasons.addEventListener('change', (event) => {
    if (event.target === own) return;
    own.hidden = !otherPicked();
    if (!own.hidden) own.focus();
  });
  decisionSheet({
    cert, kind: 'reject', title: '교사 인증 거절', yes: '거절', busyLabel: '거절하는 중…', done: A.REJECTED,
    fields: [
      reasons,
      h('p', { class: 'a-sheet-text' }, '선생님 화면에 이 까닭이 보이고, 선생님은 다시 올릴 수 있어요. 재직증명서 파일은 바로 지워요.'),
    ],
    read: () => {
      const picked = reasons.querySelector('input[name="reason"]:checked');
      if (!picked) return { problem: A.REASON_PICK };
      const reason = picked.value === OTHER ? A.cleanReason(own.value) : picked.value;
      const problem = A.reasonProblem(reason);
      return problem ? { problem } : { body: { reason } };
    },
  });
}

if (!api) {
  renderHead();
  show('no-server', h('section', { class: 'a-card' }, heading('관리 화면'), h('p', { class: 'a-lead' }, A.NO_SERVER)));
} else if (!session.auth) {
  showLogin();
} else {
  loadLists();
}
