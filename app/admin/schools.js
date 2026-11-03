// 학교 목록(설계서 4-8)과 만들기 칸이 쓰는 도우미: 시·도 차례 · 짧은 이름 · 머리글자 · 찾기 · 지역 글 · 학교 가르개.
// 목록 파일(schools.json)은 tools/build-schools.mjs가 공공데이터포털 「전국초중등학교위치표준데이터」에서 받아 만든다.
// 불러도(import) 아무것도 하지 않는다: 목록은 만들기 칸을 열 때 loadSchools()로 한 번만 받는다.

// 시·도 짧은 이름(4-4의 차례) → 주소 · 학교 이름에 나오는 긴 이름들. 전남광주는 2026년에 광주광역시와 전라남도가 합친 곳이라 옛 이름도 둔다.
const SIDO_NAMES = {
  서울: ['서울특별시'], 부산: ['부산광역시'], 대구: ['대구광역시'], 인천: ['인천광역시'],
  전남광주: ['전남광주통합특별시', '광주광역시', '전라남도', '광주', '전남'],
  대전: ['대전광역시'], 울산: ['울산광역시'], 세종: ['세종특별자치시'], 경기: ['경기도'],
  강원: ['강원특별자치도', '강원도'], 충북: ['충청북도'], 충남: ['충청남도'], 전북: ['전북특별자치도', '전라북도'],
  경북: ['경상북도'], 경남: ['경상남도'], 제주: ['제주특별자치도'],
};
export const SIDO_ORDER = Object.keys(SIDO_NAMES);

// '서울특별시' → '서울'. 모르는 이름이면 null.
export function sidoShort(name) {
  const text = typeof name === 'string' ? name.trim() : '';
  if (!text) return null;
  return SIDO_ORDER.find((short) => short === text || SIDO_NAMES[short].includes(text)) ?? null;
}

// 공식 이름에서 맨 앞의 그 학교 자기 시·도 이름(긴 꼴부터, 떼어도 두 글자 이상 남을 때만)과 「초등학교」부터 뒤를 뗀다.
// 서울용산초등학교(서울) → 용산, 광주중앙초등학교(경기) → 광주중앙(다른 곳 이름 · 도시 이름은 떼지 않는다).
export function shortSchoolName(name, sido) {
  const base = String(name ?? '').replace(/\s+/g, '').replace(/초등학교.*$/, '');
  const heads = sido && SIDO_NAMES[sido] ? [sido, ...SIDO_NAMES[sido]].sort((a, b) => b.length - a.length) : [];
  const head = heads.find((h) => base.startsWith(h) && base.length - h.length >= 2);
  return head ? base.slice(head.length) : base;
}

// 머리글자: 글자마다 첫소리를 로마자 표기의 첫 글자로(ㅇ은 모음의 첫 로마자), 최대 4자. 용산 → ys, 어울림 → eur.
const FIRST = ['g', 'k', 'n', 'd', 't', 'r', 'm', 'b', 'p', 's', 's', '', 'j', 'j', 'c', 'k', 't', 'p', 'h']; // ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ
const VOWEL = ['a', 'a', 'y', 'y', 'e', 'e', 'y', 'y', 'o', 'w', 'w', 'o', 'y', 'u', 'w', 'w', 'w', 'y', 'e', 'u', 'i']; // ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ
export function prefixFor(short) {
  let out = '';
  for (const ch of String(short ?? '').normalize('NFC')) {
    const code = ch.charCodeAt(0) - 0xac00;
    if (code >= 0 && code < 11172) out += FIRST[Math.floor(code / 588)] || VOWEL[Math.floor((code % 588) / 28)];
    else if (/^[a-z]$/i.test(ch)) out += ch.toLowerCase();
  }
  return out.slice(0, 4);
}

// 학교 차례: 시·도(SIDO_ORDER) → 시·군·구 → 이름. 목록 파일과 찾기 결과가 같이 쓴다.
export function compareSchools(a, b) {
  return SIDO_ORDER.indexOf(a.sido) - SIDO_ORDER.indexOf(b.sido) || a.sigungu.localeCompare(b.sigungu, 'ko') || a.name.localeCompare(b.name, 'ko');
}

// 찾기: 띄어 쓴 낱말마다 학교 이름이나 지역(시·도 · 시·군·구)에 있어야 하고, 하나는 이름에 있어야 한다.
// 낱말 끝의 「초등학교」 · 「초」는 뗀다(「용산초」 = 「용산」). 짧은 이름이 낱말로 시작하는 학교가 먼저, 그다음 지역 차례.
export function searchSchools(schools, query, limit = 20) {
  const words = String(query ?? '').normalize('NFC').trim().split(/\s+/).map((w) => w.replace(/(초등학교|초)$/, '')).filter(Boolean);
  if (!words.length) return [];
  const hits = [];
  for (const s of schools) {
    const name = s.name.replace(/\s+/g, '');
    const inName = words.filter((w) => name.includes(w));
    const inRegion = (w) => sidoShort(w) === s.sido || s.sido.startsWith(w) || (s.sigungu && s.sigungu.startsWith(w));
    if (!inName.length || !words.every((w) => inName.includes(w) || inRegion(w))) continue;
    const short = shortSchoolName(s.name, s.sido);
    hits.push({ s, head: inName.some((w) => short.startsWith(w)) });
  }
  return hits.sort((a, b) => b.head - a.head || compareSchools(a.s, b.s)).slice(0, limit).map((hit) => hit.s);
}

// '서울 용산구' · 세종은 '세종' · 모르면 ''
export const regionLabel = (school) => [school.sido, school.sigungu].filter(Boolean).join(' ');

// 계정 줄(AccountView)의 학교 가르개: 학교 코드, 없으면(목록에 없던 학교 · 0003 전 계정) 시·도와 이름.
// 만들기 칸의 겹친 머리글자 알림과 관리 첫 화면 묶기가 같이 쓴다.
export const schoolKey = (a) => a.schoolCode || `${a.sido ?? ''}|${a.school ?? ''}`;

// 목록 받기(한 번만). 쪽(admin.html)이 아니라 이 파일 옆의 schools.json(app/sound.js처럼). 받기에 실패하면 다음에 다시 받는다.
let loading = null;
export function loadSchools() {
  loading ??= fetch(new URL('./schools.json', import.meta.url))
    .then((res) => {
      if (!res.ok) throw new Error(`school list ${res.status}`);
      return res.json();
    })
    .then((data) => ({ referenceDate: data.referenceDate, schools: data.schools.map(([code, name, sido, sigungu]) => ({ code, name, sido, sigungu })) }))
    .catch((err) => {
      loading = null;
      throw err;
    });
  return loading;
}
