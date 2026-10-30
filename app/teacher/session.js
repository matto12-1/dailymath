// 선생님 화면과 관리 화면(Task 9)이 같이 쓰는 부르기 묶음. 불러도(import) 아무것도 하지 않는다(main.js는 불리자마자 화면을 그린다).
// - teacherSession({ api, storage, onSignedOut, fetch }): 토큰 칸(google-login.js, Ruling R3)을 읽어 들고
//   send()가 토큰을 붙여 부른다. 어느 부름이든 401이면 토큰 칸을 비우고(칸에 다른 탭의 새 로그인이 있으면 둔다) onSignedOut(글)을 부르며 null을 돌려준다.
//   서버가 없으면(api null) 아무 데도 보내지 않는다: 토큰이 「null/v1/…」처럼 이 쪽 주소로 새지 않게.
// - busy(buttons, label, work): 부르는 동안 단추를 막고(첫 단추 글은 label로) 끝나면(실패해도) 막기 전 상태로 되돌린다.
// fetch는 node 시험에서 바꿔 끼운다(tests/teacher-session.test.mjs).
import { call } from '../net.js?v=9a67f36b25';
import { loadTeacherAuth, saveTeacherAuth, clearTeacherAuth } from './auth.js?v=9a67f36b25';
import { SIGNED_OUT } from './text.js?v=9a67f36b25';

const NO_SERVER = { ok: false, status: 0, data: { error: 'no-server' } };

export function teacherSession({ api = null, storage = null, onSignedOut = () => {}, fetch = undefined } = {}) {
  let auth = loadTeacherAuth(storage);
  const via = fetch ? { fetch } : {};
  const forget = () => {
    auth = null;
    clearTeacherAuth(storage);
  };
  // 401: 이 탭은 나가고, 칸은 실패한 부름이 든 토큰(used)일 때만 지운다.
  // 같은 브라우저의 다른 탭이 그 사이 새 로그인을 칸에 남겼으면(토큰 없이 보낸 부름이어도) 그 칸은 둔다(총검수 B-2)
  const expire = (used) => {
    auth = null;
    if (used && loadTeacherAuth(storage)?.token === used) clearTeacherAuth(storage);
  };
  return {
    get auth() { return auth; },
    // 새 로그인을 들고 토큰 칸에 남긴다. 이 기기에 남았으면 true(저장이 막힌 창이면 false: 이 창에서만 로그인)
    keep(next) {
      auth = { token: next.token, email: next.email };
      saveTeacherAuth(storage, auth);
      return loadTeacherAuth(storage)?.token === auth.token;
    },
    // 서버가 알려 준 메일이 바뀌었으면 칸도 바꾼다
    rename(email) {
      if (!auth || typeof email !== 'string' || !email || email === auth.email) return;
      auth = { ...auth, email };
      saveTeacherAuth(storage, auth);
    },
    async send(path, opts = {}) {
      if (!api) return NO_SERVER;
      const used = auth?.token ?? null;
      const res = await call(api, path, { ...opts, ...via, token: used });
      if (res.status === 401) {
        expire(used);
        onSignedOut(SIGNED_OUT);
        return null;
      }
      return res;
    },
    // 서버 토큰도 지운다(안 돼도 이 기기는 로그아웃). 서버가 없으면 보내지 않는다.
    async logout() {
      if (auth && api) await call(api, '/v1/teacher/logout', { ...via, token: auth.token });
      forget();
    },
  };
}

export async function busy(buttons, label, work) {
  const list = [buttons].flat().filter(Boolean);
  const saved = list.map((b) => [b, b.disabled, b.textContent]);
  list.forEach((b) => { b.disabled = true; });
  if (label && list[0]) list[0].textContent = label;
  try {
    return await work();
  } finally {
    for (const [b, disabled, text] of saved) {
      b.disabled = disabled;
      b.textContent = text;
    }
  }
}
