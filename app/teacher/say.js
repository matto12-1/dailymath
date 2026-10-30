// 선생님 화면의 알림 줄(.t-msg). 화면 읽개가 바뀐 글을 읽는다(aria-live).
// 결(data-tone): 'bad'는 안 된 일·고칠 것(붉은 글), 'ok'는 된 일, ''는 그 밖 안내·기다림. 색은 staff.css(선생님·관리 화면 공용).
// 된 일(「인원을 30명으로 바꿨어요」)을 오류처럼 붉게 쓰지 않으려고 글과 결을 같이 넣는다.
import { h } from '../ui.js?v=9a67f36b25';

export function say(line, text = '', tone = '') {
  line.textContent = text;
  line.dataset.tone = text ? tone : '';
  return line;
}

export const msgLine = (text = '', tone = '') => say(h('p', { class: 't-msg', 'aria-live': 'polite' }), text, tone);
