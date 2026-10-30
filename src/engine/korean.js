// 받침 판정과 조사 붙이기. 숫자는 읽는 소리(일·이·삼…, 0으로 끝나면 십·백·천·만)로 본다.
import { readAloud, parseAnswer } from './answer.js?v=9a67f36b25';
import { numberFinal } from './number-final.js?v=9a67f36b25';
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const RIEUL = 8;
const CONSONANTS = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ';
const UNIT_NAMES = { kg: '킬로그램', g: '그램', t: '톤', L: '리터', mL: '밀리리터',
  km: '킬로미터', m: '미터', cm: '센티미터', mm: '밀리미터',
  'km²': '제곱킬로미터', 'm²': '제곱미터', 'cm²': '제곱센티미터', 'mm²': '제곱밀리미터',
  'm³': '세제곱미터', 'cm³': '세제곱센티미터', 'mm³': '세제곱밀리미터' };
// 0영 1일 2이 3삼 4사 5오 6육 7칠 8팔 9구 (0으로 끝나는 10·100·1000·10000도 받침 있음)

export function finalConsonant(word) {
  let s = String(word).trim();
  const last = s.at(-1), circled = last?.charCodeAt(0) - 0x3260;
  const consonant = circled >= 0 && circled < CONSONANTS.length ? CONSONANTS[circled] : last;
  // 기역·니은·디귿…처럼 자음의 이름을 읽는다. 리을만 ㄹ 받침이다.
  if (/[ㄱ-ㅎ]/.test(consonant ?? '')) return consonant === 'ㄹ' ? 'rieul' : 'other';
  const unit = s.match(/(?:^|[\s\d])(km²|cm²|mm²|m²|cm³|mm³|m³|kg|mL|km|cm|mm|g|t|L|m)$/)?.[1];
  if (unit) s = UNIT_NAMES[unit];
  // 분수는 분자를 마지막에 읽고, 소수 끝의 0도 화면에 적힌 대로 읽는다.
  if (parseAnswer('fraction', s) && s.includes('/')) s = readAloud('fraction', s);
  const code = s.charCodeAt(s.length - 1);
  if (code >= HANGUL_START && code <= HANGUL_END) {
    const jong = (code - HANGUL_START) % 28;
    if (jong === 0) return 'none';
    return jong === RIEUL ? 'rieul' : 'other';
  }
  if (code >= 48 && code <= 57) return numberFinal(s);
  return 'none';
}

const PAIRS = {
  '은/는': ['은', '는'],
  '이/가': ['이', '가'],
  '을/를': ['을', '를'],
  '과/와': ['과', '와'],
  '으로/로': ['으로', '로'],
  '이어야/여야': ['이어야', '여야'],
  '이에요/예요': ['이에요', '예요'],
  '(이)는': ['이는', '는'],
  '(이)가': ['이가', '가'],
  '(이)': ['이', ''],
  '(이)의': ['이의', '의'],
  '(이)도': ['이도', '도'],
  '(이)랑': ['이랑', '랑'],
};

export function josa(word, pair) {
  // 「입니다」는 받침과 관계없이 붙인다. 옛 틀의 이에요/예요는 학년별 고침이 끝날 때까지 둔다.
  if (pair === '입니다') return word + '입니다';
  const p = PAIRS[pair];
  if (!p) throw new Error(`모르는 조사: ${pair}`);
  const f = finalConsonant(word);
  if (pair === '으로/로') return word + (f === 'other' ? p[0] : p[1]);
  return word + (f === 'none' ? p[1] : p[0]);
}

export function fill(text, vars) {
  const value = key => {
    if (!(key in vars)) throw new Error(`빈칸 값이 없음: ${key}`);
    return String(vars[key]);
  };
  // 먼저 조사 없는 칸을 채워 {분자}/{분모:조사}도 분수 전체로 판단한다.
  const expanded = text.replace(/\{([^{}:]+)\}/g, (_, key) => value(key));
  return expanded.replace(/\{([^{}:]+):([^{}]+)\}/g, (_, key, pair, at) => {
    const v = value(key);
    const prefix = expanded.slice(0, at).match(/(?:(?:\d+\s+)?\d+\/|\d+\.)$/)?.[0] ?? '';
    return prefix && /^\d+$/.test(v) ? josa(prefix + v, pair).slice(prefix.length) : josa(v, pair);
  });
}
