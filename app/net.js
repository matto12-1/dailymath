// 서버 부르기. 절대 던지지 않는다: 연결 실패·시간 초과는 { ok: false, status: 0, data: { error: 'offline' } }.
// json 길은 Content-Type이 application/json이어야 해서(아니면 415) 몸통이 없어도 '{}'를 보낸다.
// form(FormData)은 그대로 보내고 Content-Type은 브라우저가 경계 글과 같이 단다. GET은 몸통 없음.
// data = 답 JSON(비었거나 JSON이 아니면 null). fetch는 시험에서 바꿔 끼운다.
// bytes: true면 된 답(2xx)의 몸통을 바이트로 읽어 { ok, status, data: null, bytes(ArrayBuffer), type(답 머리 Content-Type, 없으면 빈 글) }.
// 안 된 답은 다른 부름처럼 JSON으로 읽는다(관리 화면 증명서 보기, Ruling R29).
const offline = () => ({ ok: false, status: 0, data: { error: 'offline' } });

export async function call(base, path, { method = 'POST', body, token, form, bytes = false, timeoutMs = 10000, fetch: send = (...args) => globalThis.fetch(...args) } = {}) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => { controller.abort(); resolve(offline()); }, timeoutMs);
  });
  const work = (async () => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const init = { method, headers, signal: controller.signal };
    if (form !== undefined) init.body = form;
    else if (method !== 'GET' && method !== 'HEAD') {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body ?? {});
    }
    const res = await send(`${String(base).replace(/\/+$/, '')}${path}`, init);
    if (bytes && res.ok) return { ok: true, status: res.status, data: null, bytes: await res.arrayBuffer(), type: res.headers.get('content-type') ?? '' };
    const text = await res.text(); // 몸통 읽기도 시간 한도 안에서
    let data = null;
    if (text) {
      try { data = JSON.parse(text); } catch { data = null; }
    }
    return { ok: res.ok, status: res.status, data };
  })().catch(offline);
  try {
    return await Promise.race([work, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
