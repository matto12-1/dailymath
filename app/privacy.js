// 개인정보 안내(privacy.html) 위쪽 오른쪽 MattoLAB 글자(누르면 제품 목록 · 연락처 종이 창, app/lab.js). 자리는 privacy.html의 .privacy-lab.
import { labMark } from './lab.js?v=47133803ae';

document.body.prepend(labMark({ className: 'privacy-lab' }));
