import { h, placeProgress } from '../ui.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { mark } from '../icons.js?v=9a67f36b25';
import { ISLANDS, islandId } from '../art/map-data.js?v=9a67f36b25';
import { placePicture } from '../place-pic.js?v=9a67f36b25';
import { residentImg } from '../art/assets.js?v=9a67f36b25';
import { unitPath, currentUnit } from '../../src/game/units.js?v=9a67f36b25';
import { placeInfo, chooseStep } from '../../src/game/map.js?v=9a67f36b25';
import { pendingChests } from '../../src/game/chest.js?v=9a67f36b25';

function residentCard(resident, kind) {
  const [, month, day] = resident.date.split('-');
  return h('div', { class: 'place-resident' },
    h('img', { src: residentImg(kind, resident.look.variant), alt: '', width: 88, height: 88 }),
    h('div', {}, h('strong', {}, resident.name), h('p', {}, `${Number(month)}월 ${Number(day)}일에 이사 왔어요`)));
}

const LOCKED_NOTE = '앞 단계를 넘기면 열려요';

// 단계 줄 하나: 번호·이름·상태(넘김 ✓ / 지금 여기예요 / 표시 없음). 줄 전체가 단추이고, 잠긴 단원 정리는 눌러도 열리지 않고 알림만 뜬다.
function stepRow(step, choose, refuse) {
  const state = step.locked ? 'locked' : step.passed ? 'passed' : step.here ? 'here' : 'open';
  const status = step.locked ? '잠김, ' + LOCKED_NOTE : step.passed ? '넘김' : step.here ? '지금 여기예요' : '';
  return h('button', {
    class: 'step-row', 'data-step': step.number, 'data-state': state, 'aria-disabled': step.locked ? 'true' : null,
    'aria-label': `${step.number}단계 ${step.name}${status ? ', ' + status : ''}`,
    onclick: (e) => (step.locked ? refuse(e.currentTarget, LOCKED_NOTE) : choose(step.number, e.currentTarget)),
  },
  h('span', { class: 'step-num' }, step.number),
  h('span', { class: 'step-name' }, step.name, step.locked && h('small', { class: 'step-note' }, LOCKED_NOTE)),
  step.locked ? mark('lock') : step.passed ? mark('check') : step.here ? h('span', { class: 'step-here' }, '지금 여기예요') : null);
}

export function placeSheet(ctx, unitId, { semester }) {
  const s = ctx.state;
  const path = unitPath(ctx.units, ctx.templates, s.study ?? s.grade);
  const info = placeInfo(s, unitId, ctx.units, ctx.templates, currentUnit(s, path, ctx.templates));
  const island = ISLANDS[islandId(info.unit.grade, info.unit.semester)];
  const point = island.places[unitId];
  const picture = placePicture(island, point, info.place === 'fog');
  const where = h('p', { class: 'sub' }, `${info.unit.grade}학년 ${info.unit.semester}학기`);
  const goHere = () => { s.focus[s.study ?? s.grade] = unitId; ctx.save(); };
  // 끝낸 곳은 그대로: 주민 카드·「마을에서 보기」(상자가 남았으면 「보물상자 열기」).
  if (info.place === 'done') {
    const action = pendingChests(s).includes(unitId)
      ? h('button', { class: 'primary', onclick: () => ctx.go('mastery', { unit: unitId }) }, '보물상자 열기')
      : h('div', { class: 'place-actions' },
        info.resident && residentCard(info.resident, s.town.kind),
        h('button', { class: 'primary', onclick: () => ctx.go('village', { highlight: info.resident?.id }) }, '마을에서 보기'));
    return openSheet(document.getElementById('app'), { label: info.unit.title, className: 'place-sheet' },
      picture, where, h('h2', {}, info.unit.title), h('p', { class: 'place-progress' }, placeProgress(info)),
      action);
  }
  // 넘긴 단계와 지금 단계만 연다. 다른 곳의 열린 단계를 고르면 그곳이 지금 곳이 된다.
  // 열 수 없는 단계를 누르면 조용히 넘기지 않고 그 줄을 흔들며 까닭을 띄운다.
  const notice = h('p', { class: 'step-alert', role: 'status' });
  let alertTimer = 0;
  const refuse = (row, text) => {
    const note = row.querySelector('.step-note');
    if (note) { note.textContent = text; note.setAttribute('role', 'status'); }
    else notice.textContent = text;
    row.classList.remove('nudge');
    void row.offsetWidth;
    row.classList.add('nudge');
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => { notice.textContent = ''; row.classList.remove('nudge'); }, 2600);
  };
  const choose = (step, row) => {
    if (!chooseStep(s, unitId, ctx.templates, step)) return refuse(row, `${step}단계는 지금 열 수 없어요`);
    ctx.save();
    ctx.go('play', { strand: null, step });
  };
  const action = info.place === 'now'
    ? h('button', { class: 'primary place-go', onclick: () => ctx.go('play', { strand: null }) }, '바로 풀기')
    : h('button', { class: 'primary place-go', onclick: () => { goHere(); ctx.go('home', { semester }); } }, '여기로 가기');
  return openSheet(document.getElementById('app'), { label: info.unit.title, className: 'place-sheet place-steps' },
    h('div', { class: 'place-head' }, picture,
      h('div', { class: 'place-titles' }, where, h('h2', {}, info.unit.title), h('p', { class: 'place-progress' }, placeProgress(info)))),
    h('p', { class: 'step-hint' }, '단계를 골라 풀 수 있어요'),
    h('ol', { class: 'step-list', 'aria-label': `${info.unit.title} 단계` }, ...info.steps.map((step) => h('li', {}, stepRow(step, choose, refuse)))),
    notice, action);
}
