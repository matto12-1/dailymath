// 큰 답 범위도 한 바퀴마다 빠짐없이 나오도록 난수별로 섞어 꺼낸다.
const decks = new WeakMap();
export function cycle(rng, key, values) {
  let groups = decks.get(rng);
  if (!groups) decks.set(rng, groups = new Map());
  let deck = groups.get(key);
  if (!deck?.length) groups.set(key, deck = rng.shuffle(values));
  return deck.pop();
}

export function bank(aMin, aMax, bMin, bMax, accept, result) {
  const byAnswer = new Map();
  for (let a = aMin; a <= aMax; a++) for (let b = bMin; b <= bMax; b++) {
    if (!accept(a, b)) continue;
    const answer = result(a, b);
    if (!byAnswer.has(answer)) byAnswer.set(answer, []);
    byAnswer.get(answer).push(a * 10000 + b);
  }
  const answers = [...byAnswer.keys()].sort((a, b) => a - b);
  return { answers, cases:()=>[...byAnswer.values()].flat().map(packed=>({a:Math.floor(packed/10000),b:packed%10000})), draw(rng, key = byAnswer) {
    const answer = cycle(rng, key, answers), packed = rng.pick(byAnswer.get(answer));
    return { a: Math.floor(packed / 10000), b: packed % 10000 };
  } };
}

export const digits = n => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
export const plusCheck = (a, b) => digits(a).reduce((n, d, i) => n + (d + digits(b)[i]) * [100, 10, 1][i], 0);
export function minusCheck(a, b) {
  let count = 0;
  for (let n = b; n < a; n++) count++;
  return count;
}
export const reverseSubtract = (a, b) => digits(a).reduce((n, d, i) => n + Math.abs(d - digits(b)[i]) * [100, 10, 1][i], 0);
export const onesCarry = (a, b) => a % 10 + b % 10 >= 10;
export const tensCarry = (a, b) => Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 + Number(onesCarry(a, b)) >= 10;
export const onesBorrow = (a, b) => a % 10 < b % 10;
export const tensBorrow = (a, b) => Math.floor(a / 10) % 10 - Number(onesBorrow(a, b)) < Math.floor(b / 10) % 10;
export const rounded = n => Math.round(n / 100) * 100;
export const roundedTen = n => Math.round(n / 10) * 10;

// 실수에서 빠뜨린 자리의 바른 계산을 그 문제의 수로 설명한다.
export function additionAt(a,b,k) {
  const power=10**k, x=Math.floor(a/power)%10, y=Math.floor(b/power)%10;
  const carry=k?Number(a%power+b%power>=power):0;
  return `${['일','십','백','천'][k]}의 자리는 ${x} + ${y}${carry?' + 1':''} = ${x+y+carry}이므로 ${a} + ${b} = ${a+b}입니다.`;
}
export function subtractionAt(a,b,k) {
  const left=digits(a).reverse(),right=digits(b).reverse();
  let borrowed=false;
  for(let i=0;i<=k;i++)if(left[i]<right[i]){
    let from=i+1;while(left[from]===0)from++;
    left[from]--;for(let h=from-1;h>i;h--)left[h]=9;
    left[i]+=10;if(i===k)borrowed=true;
  }
  return `${['일','십','백'][k]}의 자리는 ${borrowed?'받아내림하여 ':''}${left[k]} − ${right[k]} = ${left[k]-right[k]}이므로 ${a} − ${b} = ${a-b}입니다.`;
}
export function multiplicationAt(a,b,k) {
  const power=10**k,digit=Math.floor(a/power)%10,carry=Math.floor((a%power)*b/power);
  return `${['일','십','백'][k]}의 자리는 ${digit} × ${b} = ${digit*b}${carry?`에 받아올린 ${carry}을 더하여 ${digit*b+carry}`:''}이므로 ${a} × ${b} = ${a*b}입니다.`;
}

export function closest(v, choice, actual) {
  return v.options.includes(choice) && v.options.every(n => n === choice || Math.abs(actual - choice) < Math.abs(actual - n));
}
