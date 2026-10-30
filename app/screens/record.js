import { h } from '../ui.js?v=9a67f36b25';
import { WIDE_MAPS, wideId } from '../art/map-data.js?v=9a67f36b25';
import { recordTop, monthGrid, placeLines, drillLines } from '../../src/game/record.js?v=9a67f36b25';
import { changeGradeSheet } from './grade.js?v=9a67f36b25';
import { linkPlace } from '../record-link.js?v=9a67f36b25';

const paw = '<svg viewBox="0 0 40 40" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor"><ellipse cx="10" cy="15" rx="4" ry="6" transform="rotate(-25 10 15)"/><ellipse cx="19" cy="9" rx="4" ry="6"/><ellipse cx="29" cy="13" rx="4" ry="6" transform="rotate(20 29 13)"/><ellipse cx="35" cy="23" rx="3.5" ry="5" transform="rotate(32 35 23)"/><path d="M10 29c0-5 5-13 11-13s12 7 12 13c0 5-5 7-10 5-6-2-13 2-13-5Z"/></g></svg>';

export function record(ctx) {
  const s = ctx.state, grade = s.study ?? s.grade, art = WIDE_MAPS[wideId(grade)];
  let [year, month] = ctx.today.split('-').map(Number);
  const top = recordTop(s, ctx.units), places = placeLines(s, ctx.units, ctx.templates), drills = drillLines(s);
  const stats = h('div', { class: 'record-stats' }, ...[
    ['score', '내 점수', top.score, ''], ['places', '끝낸 곳', top.places, '곳'], ['residents', '주민', top.residents, '마리'],
  ].map(([key, label, value, suffix]) => h('div', { class: 'record-stat', 'data-key': key },
    h('span', {}, label), h('strong', { 'data-value': value }, `${value}${suffix}`))));
  const calendar = h('section', { class: 'record-calendar', 'aria-label': '문제를 푼 날' });
  function drawCalendar(focus = null) {
    const grid = monthGrid(s, year, month, ctx.today);
    const move = (target, button) => { if (target) { ({ year, month } = target); drawCalendar(button); } };
    const previous = h('button', { class: 'calendar-prev', 'aria-label': '지난달', disabled: !grid.prev, onclick: () => move(grid.prev, '.calendar-prev') }, '‹');
    const next = h('button', { class: 'calendar-next', 'aria-label': '다음달', disabled: !grid.next, onclick: () => move(grid.next, '.calendar-next') }, '›');
    calendar.replaceChildren(
      h('header', { class: 'calendar-head' }, previous, h('h2', { 'aria-live': 'polite' }, grid.title), next),
      h('div', { class: 'calendar-weekdays', 'aria-hidden': 'true' }, ...['일', '월', '화', '수', '목', '금', '토'].map(d => h('span', {}, d))),
      h('div', { class: 'calendar-days', style: `--weeks:${grid.weeks.length}` }, ...grid.weeks.flat().map(cell => cell ?
        h('div', { class: `calendar-day${cell.today ? ' today' : ''}${cell.future ? ' future' : ''}${cell.stamp ? ' stamped' : ''}`, 'data-date': cell.date,
          'aria-label': `${cell.day}일${cell.today ? ', 오늘' : ''}, ${cell.count}문제` }, h('span', { class: 'day-number' }, cell.day),
          cell.stamp && h('span', { class: 'paw-stamp', html: paw })) : h('div', { class: 'calendar-blank', 'aria-hidden': 'true' }))),
      h('p', { class: 'calendar-legend' }, '발자국은 문제를 푼 날이에요'));
    if (focus) calendar.querySelector(focus).focus({ preventScroll: true });
  }
  drawCalendar();
  const finished = h('section', { class: 'record-places' }, h('h2', {}, '끝낸 곳'),
    ...places.map(line => h('div', { class: 'record-place-line', 'data-grade': line.grade, 'data-semester': line.semester },
      h('div', { class: 'record-place-label' }, h('span', {}, line.label), h('span', {}, `${line.done}/${line.total}곳`)),
      h('div', { class: 'place-stamps', 'aria-label': `${line.total}곳 중 ${line.done}곳 끝냄` },
        ...Array.from({ length: line.total }, (_, i) => h('span', { class: i < line.done ? 'done' : '', 'aria-hidden': 'true' }))))));
  // 「내 자리」(서버가 있을 때만, 오른쪽 맨 아래). 서버가 없으면 null이라 지금 그대로다.
  // 칸이 있으면 오른쪽 쪽이 길어지므로 촘촘한 일지를 더 일찍 켠다(끝낸 곳 + 집중 훈련 줄이 5개부터. 넓은 화면에서 쪽이 스크롤되지 않게)
  const place = linkPlace(ctx);
  const dense = drills.length > 6 || Boolean(place && places.length + drills.length >= 5);
  const training = h('section', { class: `record-drills${drills.length > 6 ? ' dense-drills' : ''}` }, h('h2', {}, '집중 훈련'),
    drills.length ? h('div', { class: 'drill-lines' }, ...drills.map(line => h('p', { class: 'record-drill-line', 'data-id': line.id },
      `${line.label} · ${line.runs}판 · 최고 ${line.best}/20`))) : h('p', { class: 'record-empty' }, '아직 해 본 훈련이 없어요'));
  const settings = h('section', { class: 'record-grade', 'aria-label': '학년 설정' },
    s.student ? h('span', {}, `${s.grade}학년 ${s.student.classNo}반 학년으로 공부해요`)
      : [h('span', {}, `지금 ${s.grade}학년`), h('button', { onclick: () => changeGradeSheet(ctx) }, '학년 바꾸기')]);
  return h('section', { class: 'screen record-screen', style: `--journal-map:url('${art.img}')` },
    h('div', { class: `record-book${dense ? ' dense-record' : ''}${place ? ' with-link' : ''}` },
      h('div', { class: 'record-right' },
        h('header', { class: 'record-head' }, h('h1', {}, '나의 탐험 기록'), h('button', { class: 'pill', onclick: () => ctx.go('home') }, '지도로')),
        stats, finished, training, place, settings),
      h('div', { class: 'record-left' }, h('figure', { class: 'record-illustration' },
        h('img', { src: art.img, alt: `${grade}학년 탐험 지도`, width: art.w, height: art.h })), calendar),
      h('div', { class: 'journal-binding', 'aria-hidden': 'true' }, ...Array.from({ length: 8 }, () => h('i')))));
}
