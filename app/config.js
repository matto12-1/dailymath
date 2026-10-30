// 서버 주소와 구글 로그인 값. 여기서는 둘 다 빈 글로 둔다(값을 적지 않는다: 로컬 개발·시험은 빈 값 그대로 돈다).
// 공개 사이트를 묶을 때 tools/build-site.mjs가 아래 두 줄을 통째로 바꾼다(Ruling R30): PROD_API는 --api(없으면 환경 DM_API_URL),
// GOOGLE_CLIENT_ID는 --google-client-id(없으면 DM_GOOGLE_CLIENT_ID). Actions(.github/workflows/pages.yml)는 원본 저장소 변수
// vars.DM_API_URL·vars.DM_GOOGLE_CLIENT_ID를 넘긴다(docs/deploy.md). 줄 꼴을 바꾸면 묶기가 멈춘다.
// 서버 주소가 없으면(null) 앱은 지금처럼 기기에만 저장한다.
export const PROD_API = "https://dailymath-api.mattolab.workers.dev";
export const GOOGLE_CLIENT_ID = "";
// 서버 GOOGLE_LOGIN과 같은 뜻. 묶기는 --google-login 또는 DM_GOOGLE_LOGIN=1일 때만 켠다.
export const GOOGLE_LOGIN = false;

export const API_KEY = 'dailymath.api'; // 세션 저장소: ?api=로 준 개발 서버 주소(새로 고침에도)
const PROD_HOST = 'math.matto.kr';
const LOCAL_HOSTS = ['127.0.0.1', 'localhost'];

// 개발 서버 주소만 받는다: http://127.0.0.1:포트 · http://localhost:포트 (길·물음·계정 글 없이). 아니면 null.
function localApi(text) {
  let url;
  try { url = new URL(text); } catch { return null; }
  const plain = url.protocol === 'http:' && LOCAL_HOSTS.includes(url.hostname) && url.port !== ''
    && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash;
  return plain ? url.origin : null;
}

function sessionStore() {
  try { return globalThis.sessionStorage ?? null; } catch { return null; }
}

// math.matto.kr이면 PROD_API만(빈 글이면 null). ?api=·남겨 둔 개발 서버 주소는 로컬 쪽(127.0.0.1·localhost)에서만 본다
// (꾸민 링크가 아이 토큰을 로컬 포트로 보내거나, 그 포트의 401로 진짜 연결이 풀리지 않게). 그 밖의 쪽은 null.
// 로컬 쪽: ?api=가 개발 서버 주소면 그것(세션 저장소에 남겨 새로 고침에도), 다른 주소면 null(남긴 것도 지운다),
// 쿼리가 없으면 남겨 둔 주소.
export function apiBase(loc = globalThis.location, storage = sessionStore(), prod = PROD_API) {
  const host = loc?.hostname ?? '';
  if (host === PROD_HOST) return prod || null;
  if (!LOCAL_HOSTS.includes(host)) return null;
  const given = new URLSearchParams(loc?.search ?? '').get('api');
  if (given !== null) {
    const base = localApi(given);
    try {
      if (base) storage?.setItem(API_KEY, base);
      else storage?.removeItem(API_KEY);
    } catch { /* 세션 저장소가 막혀도 이 쪽에서는 쓴다 */ }
    return base;
  }
  let kept = null;
  try { kept = storage?.getItem(API_KEY) ?? null; } catch { kept = null; }
  return kept ? localApi(kept) : null;
}
