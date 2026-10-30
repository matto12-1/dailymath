// MattoLAB 글자와 종이 창(설계서 4-5, 2026-10-25 「아래에 푸터도 없애고, MattoLAB 클릭하면 뜨게 만들어줘 모달로. 그 한국사사이트처럼」).
// 위쪽 오른쪽 사이트 워드마크를 누르면 제품 목록 · 연락처가 종이 창으로 뜬다. 닫기는 ✕ · 바깥 · Esc(sheet.js).
// 글자는 들어오는 쪽(선생님 · 관리의 로그인 · 처음 바꾸기 · 잊었어요 · 열쇠 · 확인 중), 아이 첫 단계, 개인정보 쪽에만 둔다.
// 로그인한 뒤 일하는 화면(반 목록 · 대시보드 · 관리 첫 화면)에는 없다(2026-10-23 「로그인 뒤 푸터 뺌」).
// 창 알맹이의 마크업 · CSS 원본은 mattolab-brand 저장소이고 assets/brand/는 그 사본이다. 사본은 고치지 않는다:
// 맞출 때는 `node <mattolab-brand>/sync.mjs <이 저장소>`(FOOTER.md). 글자 · 종이 생김새는 lab.css, 알맹이의 이 쪽 색(--lab-*)은 각 쪽 CSS.
// 조회수는 세지 않는다(withViews: false).
import { h } from './ui.js?v=9a67f36b25';
import { openSheet } from './sheet.js?v=9a67f36b25';
import { labBlock } from '../assets/brand/brand.js?v=9a67f36b25';

// products.js의 제품 이름과 글자까지 같으면 그 제품을 「지금 보고 있는 것」으로 칠하고 자기 링크를 뺀다(아직 목록에 없다).
export const SITE_NAME = '매일 수학';

// 종이 창을 연다. contact면 연락처 첫 링크(메일)에 초점을 둔다(잊었어요의 [운영자 연락처]). 돌려받은 close()로 닫는다
export function openLab({ contact = false } = {}) {
  const box = document.createElement('template');
  box.innerHTML = labBlock(SITE_NAME, { tag: 'div', withViews: false }); // 브랜드 파일이 만든 글(제품 목록·연락처, 이스케이프됨)만 넣는다
  const block = box.content.firstElementChild;
  const close = openSheet(document.body, { label: 'MattoLAB', className: 'lab-sheet' }, block);
  if (contact) block.querySelector('.cx a')?.focus({ preventScroll: true });
  return close;
}

// 위쪽 오른쪽 글자(단추): Matto + 코랄 LAB. 둘레(알약 · 크림 띠)는 쪽마다 className과 그 쪽 CSS가 정한다
export function labMark({ className = '' } = {}) {
  return h('button', { type: 'button', class: `labmk ${className}`.trim(), 'aria-haspopup': 'dialog', 'aria-label': 'MattoLAB, 만든 것과 연락처 보기', onclick: () => openLab() },
    'Matto', h('i', {}, 'LAB'));
}

// 개인정보 안내로 가는 글 링크(Ruling R39): 아이 첫 화면 맨 아래 · 선생님 로그인 화면과 계정 칸 · 관리 로그인 화면과 계정 칸.
// 세 쪽이 모두 app/ 안이라 같은 상대 주소다(묶기가 쪽 주소는 그대로 둔다). 생김새는 각 쪽 CSS의 .privacy-link.
export const PRIVACY_TEXT = '개인정보 안내';
export function privacyLink() {
  const link = document.createElement('a');
  link.className = 'privacy-link';
  link.href = 'privacy.html';
  link.textContent = PRIVACY_TEXT;
  return link;
}
