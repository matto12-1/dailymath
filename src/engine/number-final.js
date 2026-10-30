// 숫자 읽기의 마지막 받침. 답 읽기와 조사 붙이기가 같이 쓰며 서로를 가져오지 않는다.
const FINAL = ['other', 'rieul', 'none', 'other', 'none', 'none', 'other', 'rieul', 'rieul', 'none'];
export function numberFinal(value) {
  const s = String(value).trim(), digits = s.match(/\d+$/)?.[0];
  if (!digits) return 'none';
  // 소수는 적힌 끝 숫자를 읽는다. 정수는 마지막으로 읽는 만 단위 묶음을 찾는다.
  if (!/\.\d+$/.test(s) && /[1-9]/.test(digits)) {
    const zeros = digits.match(/0*$/)[0].length;
    if (Math.floor(zeros / 4) === 3) return 'none'; // 조 (십조·백조·천조도 같다)
  }
  return FINAL[digits.at(-1)];
}
