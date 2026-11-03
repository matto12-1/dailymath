// 들어오기와 기록 연결 화면에서 함께 쓰는 안내 글.
export const BUSY = '확인하는 중…';
export const AGAIN = '잘 안 됐어요. 다시 해 주세요.';
export const INTERNET = '인터넷이 안 돼요. 연결되면 다시 눌러 주세요.';
export const JOINED_NOTE = '반에 들어갔어요';
export const LOST_NOTE = '이 기기는 반 연결이 풀렸어요. 탐험 일지에서 다시 들어가요.';
export const lostNote = () => LOST_NOTE;
export const enterNote = ({ loaded = false, village = '' } = {}) => loaded ? `하던 ${village}을 불러왔어요` : null;
export const sentenceLines = text => String(text).replace(/([.?!]) (?=\S)/g, '$1\n');
export function kidMessage(kind, res) {
  if (!res?.status || res.status >= 500 || res.ok) return INTERNET;
  if (res.status === 429) {
    const seconds = Number.isFinite(res.data?.retryAfter) && res.data.retryAfter > 0 ? res.data.retryAfter : 600;
    return `너무 많이 해 봤어요. ${Math.max(1, Math.ceil(seconds / 60))}분 뒤에 다시 해 주세요.`;
  }
  if (res.data?.error === 'no-class') return '반 코드를 찾지 못했어요. 선생님께 받은 숫자 6개를 다시 봐 주세요.';
  if (res.data?.error === 'number-range') return Number.isInteger(res.data.size) && res.data.size > 0 ? `번호는 1부터 ${res.data.size}까지예요.` : '번호를 다시 봐 주세요.';
  return AGAIN;
}
export const retryable = res => res?.status === 0 || res?.status >= 500 || Boolean(res?.ok);
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
export const validEntry = d => object(d) && typeof d.token === 'string' && d.token !== '' && typeof d.kidId === 'string' && d.kidId !== ''
  && Number.isSafeInteger(d.rev) && d.rev >= 0 && (d.state == null || object(d.state));
export const seatSlot = res => res?.ok && ['new', 'existing'].includes(res.data?.slot) ? res.data.slot : null;
export function joinOutcome(res, seat) {
  if (res?.ok && validEntry(res.data)) return { go: 'in', data: res.data };
  return { go: 'form', value: { ...seat }, text: kidMessage('join', res) };
}
