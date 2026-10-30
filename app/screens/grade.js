// 학습 진도 창: 아이 학년과 마을을 그대로 두고 지도만 바꾼다.
import { h } from '../ui.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { home } from './home.js?v=9a67f36b25';
import { ISLANDS, islandId } from '../art/map-data.js?v=9a67f36b25';
import { studyRange, setStudy } from '../../src/game/study.js?v=9a67f36b25';
import { gradeChoices } from '../../src/game/map.js?v=9a67f36b25';
import { setGrade, promotionDue } from '../../src/game/study.js?v=9a67f36b25';
import { CURRENCY } from '../../src/game/village.js?v=9a67f36b25';

export const grade = (ctx) => home(ctx, { sheet: 'grade' });

export function gradeSheet(ctx) {
  const s = ctx.state;
  return openSheet(document.getElementById('app'), { label: '어느 학년 지도를 볼까요?', className: 'grade-sheet' },
    h('h2', {}, '어느 학년 지도를 볼까요?'),
    s.grade > 1 && h('p', { class: 'sub' }, `${s.grade}학년은 ${studyRange(s.grade).join('·')}학년 지도를 볼 수 있어요.`),
    h('p', { class: 'sub' }, `마을과 ${CURRENCY[s.town.kind]} 수는 그대로예요.`),
    h('div', { class: 'grade-choices' }, ...gradeChoices(s, ctx.units, ctx.templates).map(({ grade: g, done, total, current }) =>
      h('button', { class: 'grade-choice paper-button', 'data-grade': g, 'aria-current': current ? 'true' : null,
        onclick: () => { setStudy(s, g); ctx.save(); ctx.go('home'); },
      }, h('img', { src: ISLANDS[islandId(g, 1)].img, alt: '', loading: 'lazy', width: 48, height: 72 }),
      h('strong', {}, `${g}학년`), h('span', { class: 'grade-count' }, `${done}/${total}곳`),
      current && h('span', { class: 'badge' }, '지금 지도')))));
}

export function changeGradeSheet(ctx) {
  if (ctx.state.student) return null;
  let selected = ctx.state.grade;
  const choices = h('div', { class: 'grades' }, ...[1, 2, 3, 4, 5, 6].map(g => h('button', {
    type: 'button', 'aria-pressed': String(g === selected),
    onclick: e => {
      selected = g;
      for (const b of choices.children) b.setAttribute('aria-pressed', String(b === e.currentTarget));
    },
  }, `${g}학년`)));
  let close;
  close = openSheet(document.getElementById('app'), { label: '학년 바꾸기', className: 'change-grade-sheet' },
    h('h2', {}, '학년 바꾸기'),
    h('p', { class: 'sub' }, `마을·주민·${CURRENCY[ctx.state.town.kind]}·기록은 그대로 두고 학년과 학습 범위만 바꿔요.`),
    choices,
    h('button', { class: 'primary', onclick: () => { setGrade(ctx.state, selected, ctx.today); ctx.save(); close(); ctx.go('record'); } }, '바꾸기'));
  return close;
}

export function offerPromotion(ctx, owner) {
  if (ctx.demo || !promotionDue(ctx.state, ctx.today)) return null;
  ctx.state.gradePromptYear = Number(ctx.today.slice(0, 4));
  ctx.save();
  // 다른 창의 기록을 받아 화면이 바뀌었다면, 떠난 화면의 확인 창은 열지 않는다.
  if (!owner.isConnected) return null;
  const next = ctx.state.grade + 1;
  let close;
  close = openSheet(document.getElementById('app'), { label: `${next}학년이 되었나요?`, className: 'promotion-sheet' },
    h('h2', {}, `${next}학년이 되었나요?`),
    h('p', { class: 'sub' }, '마을과 기록은 그대로예요.'),
    h('div', { class: 'actions' },
      h('button', { onclick: () => close() }, '지금 학년 그대로'),
      h('button', { class: 'primary', onclick: () => { setGrade(ctx.state, next); ctx.save(); close(); ctx.go('home'); } }, '한 학년 위')));
  return close;
}
