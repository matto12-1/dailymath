// 되돌릴 수 없는 부름 동안 아래 창(sheet.js)을 닫지 못하게: 창 안 단추(✕·[취소] 포함)를 모두 막고 Esc·바깥 누르기를 먹는다.
// 푸는 함수를 돌려준다(단추는 막기 전 상태로). sheet.js는 지도·마을과 같이 쓰므로 바꾸지 않고 여기서 막는다.
// 탐험 일지 「내 자리」(record-link.js)와 선생님 대시보드(teacher/board.js)가 같이 쓴다.
export function lockSheet(panel) {
  if (!panel) return () => {};
  const buttons = [...panel.querySelectorAll('button')].map((b) => [b, b.disabled]);
  buttons.forEach(([b]) => { b.disabled = true; });
  const overlay = panel.parentElement;
  const stopKey = (e) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  const stopOut = (e) => { if (e.target === overlay) e.stopImmediatePropagation(); };
  window.addEventListener('keydown', stopKey, true);
  overlay?.addEventListener('click', stopOut, true);
  return () => {
    window.removeEventListener('keydown', stopKey, true);
    overlay?.removeEventListener('click', stopOut, true);
    buttons.forEach(([b, disabled]) => { b.disabled = disabled; });
  };
}
