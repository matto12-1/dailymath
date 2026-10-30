import { josa } from '../engine/korean.js?v=9a67f36b25';

// 원래 추첨이 끝난 값에 풀이용 글만 더해요. 난수와 정답 계산은 쓰지 않아요.
export function explain(draw, describe) {
  return function (...args) {
    const v = draw.apply(this, args);
    return v === null ? null : { ...v, process: describe(v).filter(Boolean).join('\n') };
  };
}
export const j = josa;
export const say = n => josa(n, '입니다') + '.';
export const count = (n, step = 1) => Array.from({ length: n }, (_, i) => (i + 1) * step).join(', ');
// 1학년 교과서의 순서 말. 「1번째」 대신 쓴다.
export const ordinal = n => ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째', '열째'][n - 1] ?? n + '번째';
export const comparisonSubjects = xs => xs.length === 2 ? j(xs[0],'과/와') + ' ' + xs[1] : xs.join(', ');
export const flatNames = { triangle: '세모', square: '네모', circle: '동그라미' };
export const solidNames = { box: '상자 모양', tube: '둥근기둥 모양', ball: '공 모양' };
export const solidFeature = {
  box: '평평한 곳으로 둘러싸여 있고 뾰족한 곳이 8곳 있습니다.',
  tube: '평평하고 둥근 곳이 2곳 있고, 그 사이가 굽어 있습니다. 뾰족한 곳은 없습니다.',
  ball: '평평한 곳이 없고 어느 쪽으로도 둥근 모양입니다.',
};
export const flatFeature = {
  triangle: '곧은 선이 3개이고 뾰족한 곳도 3곳 있습니다.',
  square: '곧은 선이 4개이고 뾰족한 곳도 4곳 있습니다.',
  circle: '뾰족한 곳이 없고 둥근 선으로 이어져 있습니다.',
};

export function comparePlaces(values, largest, places, firstGrade = false) {
  let remaining = [...values];
  const lines = [], compared = [];
  for (let k = places - 1; k >= 0 && remaining.length > 1; k--) {
    const power = 10 ** k, ds = remaining.map(n => Math.floor(n / power) % 10);
    const edge = (largest ? Math.max : Math.min)(...ds);
    const names = ['일', '십', '백', '천', '만', '십만', '백만', '천만'];
    const subjects = remaining.length === values.length ? (['', '한 수', '두 수', '세 수', '네 수'][remaining.length] ?? remaining.length + '개 수') : comparisonSubjects(remaining);
    const placeName = firstGrade ? ['낱개의 수', '10개씩 묶음의 수'][k] : names[k] + '의 자리 숫자';
    compared.push({ name: names[k], equal: new Set(ds).size === 1, subjects });
    lines.push(subjects + '의 ' + j(placeName, '은/는') + ' ' + say(ds.join(', ')) + ' ' +
      (new Set(ds).size === 1 ? (firstGrade ? '같으므로 낱개의 수를 비교합니다.' : '같으므로 다음 자리의 숫자를 비교합니다.') : j(edge, '이/가') + (remaining.length===2?' 더 ':' 가장 ') + (largest ? '큽니다.' : '작습니다.')));
    remaining = remaining.filter(n => Math.floor(n / power) % 10 === edge);
  }
  // 같은 자리를 묶어도, 처음 다른 자리와 후보가 갈리는 과정은 빠뜨리지 않는다.
  if (lines.length > 3) {
    const compact = [];
    let equal = [], subjects;
    const flush = () => {
      const prefix = equal.length ? j(subjects, '은/는') + ' ' + equal.join('·') + '의 자리 숫자가 각각 같습니다. ' : '';
      equal = [];
      return prefix;
    };
    for (const [i, line] of lines.entries()) {
      if (compared[i].equal) { if (!equal.length) subjects = compared[i].subjects; equal.push(compared[i].name); }
      else { const prefix = flush(); if (prefix) compact.push(prefix.trim()); compact.push(line); }
    }
    if (equal.length) compact.push(flush().trim());
    // 후보가 갈려 다시 비교할 때 같은 자리 설명을 다음 비교 줄에 붙인다.
    // 첫 공통 자리와 첫 판단은 분리해서 읽기 쉽게 둔다.
    for (let i = compact.length - 2; i >= 2; i--) {
      if (/각각 같습니다\.$/.test(compact[i])) compact.splice(i, 2, compact[i] + ' ' + compact[i + 1]);
    }
    if (compact.length > 3 && /각각 같습니다\.$/.test(compact[0])) compact.splice(0, 2, compact[0] + ' ' + compact[1]);
    return compact;
  }
  return lines;
}

const PLACES = ['일', '십', '백', '천', '만'];

// 자리마다 한 줄로 더하고 뺀다. 자연수 부분에 그 자리가 없는 수(46 + 3의 3)는 「+ 0」으로 쓰지 않는다(검수 A1-22).
// 0인 자리를 건너 받아내리면 한 번에 차례대로 말하고, 9가 된 자리에서 같은 말을 되풀이하지 않는다(검수 A2-13).
export function placeSteps(a, b, subtract = false, places = 2, decimals = 0) {
  const digits = n => Array.from({ length: places }, (_, k) => Math.floor(n / 10 ** k) % 10);
  const left = digits(a), right = digits(b), lines = [];
  const has = (n, k) => k <= decimals || n >= 10 ** k;
  const settled = new Set();
  let carry = 0;
  const name = k => k < decimals ? '소수 ' + ['첫째', '둘째'][decimals - k - 1] : PLACES[k - decimals];
  const place = k => name(k) + (k < decimals ? ' 자리' : '의 자리');
  for (let k = 0; k < places; k++) {
    const original = Math.floor(a / 10 ** k) % 10;
    if (subtract) {
      let before = '', head = place(k) + '는 ';
      if (left[k] < right[k]) {
        let from = k + 1;
        while (left[from] === 0) from++;
        const given = left[k] !== original ? '받아내림하고 남은 ' : '';
        head = place(k) + (given ? '는 ' : ' ');
        if (from === k + 1) {
          before = given + left[k] + '에서 ' + j(right[k], '을/를') + ' 뺄 수 없으므로 ' + place(from) + '에서 받아내림합니다. ';
        } else {
          const zeros = Array.from({ length: from - k - 1 }, (_, i) => k + 1 + i);
          const chain = [];
          for (let h = from; h > k; h--) chain.push(place(h) + '에서 ' + place(h - 1) + '로 받아내림합니다.');
          before = given + left[k] + '에서 ' + j(right[k], '을/를') + ' 뺄 수 없고 ' +
            zeros.map(place).join(', ') + '도 0입니다. ' + chain.join(' ') + ' ' + place(k) + '는 ';
          for (const h of zeros) settled.add(h);
        }
        left[from]--;
        for (let h = from - 1; h > k; h--) left[h] = 9;
        left[k] += 10;
       } else if (left[k] !== original) {
        before = settled.has(k)
          ? '10에서 아랫자리로 1을 받아내림하고 남은 9이므로 '
          : '받아내림하고 남은 ' + left[k] + '에서 ' + j(right[k], '을/를') + ' 빼면 ';
      }
      if (!has(b, k)) {
        if (left[k] !== original) before = '받아내림하고 ' + j(left[k], '이/가') + ' 남습니다. ';
        // 빼는 수에 이 자리가 없으면 남은 수를 그대로 쓴다. 맨 앞 자리가 0이 되면 쓰지 않는다.
        if (k === places - 1 && left[k] === 0) { if (before) lines.push(head + before.trim()); continue; }
        lines.push(head + before + j(left[k], '을/를') + ' 그대로 씁니다.');
        continue;
      }
      lines.push(head + before + (before.endsWith('빼면 ') ? say(left[k] - right[k]) : left[k] + ' − ' + right[k] + ' = ' + say(left[k] - right[k])));
    } else {
      const rawTerms = [...(has(a, k) ? [left[k]] : []), ...(has(b, k) ? [right[k]] : []), ...(carry ? [carry] : [])];
      // 수 안의 빈 자리도 9 + 0 + 1처럼 끼우지 않는다. 모두 0일 때의 0 + 0은 그대로 보인다(A1-22).
      const terms = rawTerms.some(n => n !== 0) ? rawTerms.filter(n => n !== 0) : rawTerms;
      const total = left[k] + right[k] + carry;
      if (!terms.length) continue;
      const start = carry ? place(k - 1) + '에서 받아올린 1' + (terms.length > 1 ? '도 더합니다. ' : '을 그대로 씁니다.') : '';
      const out = Math.floor(total / 10);
      const end = out ? ' ' + place(k + 1) + ('로 ' + j('1', '을/를') + ' 받아올리고 ') + place(k) + '에는 ' + j(total % 10, '을/를') + ' 씁니다.' : '';
      carry = out;
      if (terms.length === 1) { lines.push(place(k) + '는 ' + (start || j(total, '을/를') + ' 그대로 씁니다.')); continue; }
      lines.push(place(k) + '는 ' + start + terms.join(' + ') + ' = ' + say(total) + end);
    }
  }
  return lines;
}

// 곱셈 올림을 자리마다 한 줄로(검수 A2-12). a는 몇 자리든, b는 한 자리 수.
// 42 × 9: 「일의 자리 2 × 9 = 18, 8을 쓰고 1을 올려요.」 「십의 자리 4 × 9 = 36, 올린 1을 더해 37이에요.」
export function multiplyLines(a, b) {
  const ds = String(a).split('').reverse().map(Number), lines = [];
  let carry = 0;
  ds.forEach((d, k) => {
    const product = d * b, total = product + carry, last = k === ds.length - 1;
    let line = PLACES[k] + '의 자리는 ' + d + ' × ' + b + ' = ' + product;
    if (carry) line += '에 받아올린 ' + j(carry, '을/를') + ' 더하여 ' + total;
    carry = Math.floor(total / 10);
    if (!last && total >= 10) line += '이므로 ' + j(total % 10, '을/를') + ' 쓰고 ' + j(carry, '을/를') + ' ' + PLACES[k + 1] + '의 자리로 받아올립니다.';
    else line += '입니다.';
    lines.push(line);
  });
  return lines;
}

// 나눗셈을 높은 자리부터 자리마다 한 줄로. 남은 수 옆으로 다음 자리 숫자를 내린다.
export function divideLines(a, b) {
  const ds = String(a).split('').map(Number), n = ds.length, lines = [];
  let rest = 0, started = false;
  ds.forEach((d, i) => {
    const k = n - 1 - i, cur = rest * 10 + d, q = Math.floor(cur / b), r = cur % b, last = i === n - 1;
    const name = PLACES[k] + '의 자리';
    const said = rest ? name + ' 숫자 ' + j(d, '을/를') + ' 내려 ' + cur : name + ' ' + cur;
    if (q === 0) {
      lines.push(said + j(cur, '은/는').slice(String(cur).length) + ' ' + b + '보다 작으므로 ' + (started ? '몫의 ' + name + '에 0을 씁니다.' : '몫을 쓰지 않습니다.') +
        (last && r ? ' 나머지는 ' + say(r) : ''));
    } else {
      lines.push(!last && r ? said + j(cur, '을/를').slice(String(cur).length) + ' ' + j(b, '으로/로') + ' 나누면 몫은 ' + q + '이고 ' + j(r, '이/가') + ' 남습니다.' : said + ' ÷ ' + b + ' = ' + q + (r ? ' ··· ' + r : '') + '입니다.');
      started = true;
    }
    rest = r;
  });
  return lines;
}

export function multiplySteps(a, b) {
  let carry = 0;
  return ['일', '십', '백'].map((name, k) => {
    const digit = Math.floor(a / 10 ** k) % 10, product = digit * b;
    const total = product + carry;
    const formula = digit + ' × ' + b + ' = ' + product +
      (carry ? '에 ' + ['일', '십'][k - 1] + '의 자리에서 받아올린 ' + j(carry, '을/를') + ' 더하여 ' + total : '') + '입니다.';
    carry = Math.floor(total / 10);
    const end = carry ? ' ' + ['십', '백', '천'][k] + '의 자리로 ' + j(carry, '을/를') + ' 받아올리고 ' + name + '의 자리에는 ' + j(total % 10, '을/를') + ' 씁니다.' : '';
    return name + '의 자리는 ' + formula + end;
  });
}

const divisor = (a, b) => b ? divisor(b, a % b) : a;
export const commonDenominator = ds => ds.reduce((a, b) => a / divisor(a, b) * b, 1);
export function reduction(n, d) {
  const g = divisor(n, d), a = n / g, b = d / g;
  const raw = n + '/' + d, reduced = a + '/' + b;
  // 약분해서 분모가 1이 되면 4/1처럼 쓰지 않고 나눗셈 한 번으로 자연수를 말해요.
  const text = b === 1
    ? j(raw, '은/는') + ' ' + n + ' ÷ ' + d + ' = ' + say(a)
    : g === 1
    ? j(n, '과/와') + ' ' + d + '의 공약수는 1뿐이므로 ' + j(raw, '은/는') + ' 더 약분할 수 없습니다.'
    : '분자와 분모를 ' + j(g, '으로/로') + ' 나눕니다. ' + n + ' ÷ ' + g + ' = ' + say(a) + ' ' + d + ' ÷ ' + g + ' = ' + say(b) + ' ' + raw + ' = ' + say(reduced);
  return { n: a, d: b, text };
}
export function fractionConversion(from, to) {
  return from === to ? j(from,'은/는') + ' 그대로 둡니다.' : from + ' = ' + say(to);
}
export function mixedStep(n, d) {
  if (d === 1) return null;
  if (n < d) return j(n + '/' + d, '은/는') + ' 1보다 작은 진분수이므로 그대로 씁니다.';
  const w = Math.floor(n / d), r = n % d;
  return j(n + '/' + d,'은/는') + ' ' + (r
    ? j((w*d) + '/' + d,'과/와') + ' ' + j(r + '/' + d,'으로/로') + ' 나누어져 ' + say(w + ' ' + r + '/' + d)
    : j(d + '/' + d,'이/가') + ' ' + w + '개라서 ' + say(w));
}
