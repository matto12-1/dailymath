// 답은 즉시 기록한다. 단계 넘김·익힘은 끝낸 판에서, 그 판이 고른 단계(없으면 「지금 여기예요」 단계) 답으로 한 번 판정한다.
// 넘긴 단계는 차례와 상관없이 모아 두고(✓), 다시 풀다 못 넘겨도 지우지 않는다. 단원 정리를 넘기면 익힘.
import { stepsOf, unitInfo } from './units.js?v=9a67f36b25';

export const MIN_STAGE_PROBLEMS = 4;
export const requiredCorrect = count => Math.ceil(count * 3 / 4);
const HISTORY = 30, STRAND_HISTORY = 10;

export function recordAnswer(state, { unit, level, strand, correct }) {
  const s = (state.strands[strand] ??= []);
  s.push(correct);
  if(s.length>STRAND_HISTORY) s.splice(0,s.length-STRAND_HISTORY);
  const u = (state.units[unit] ??= { passed:[], history:[], mastered:null });
  (u.history ??= []).push({level,correct});
  if(u.history.length>HISTORY) u.history.splice(0,u.history.length-HISTORY);
  return [];
}

// pick = 이 판의 { unit, step }(장소 창에서 고른 단계). 그 단원은 고른 단계로, 다른 단원은 「지금 여기예요」 단계로 판정한다.
export function judgeRound(state, items, { today, templates, pick = null }) {
  const events=[], evaluations=[];
  const units=[...new Set(items.map(i=>i.template.unit))];
  for(const unit of units) {
    const info=unitInfo(state,unit,templates);
    if(info.mastered) continue;
    const level=pick?.unit===unit ? pick.step : info.here;
    const counted=items.filter(i=>i.template.unit===unit && i.step===level && i.result && !i.drill);
    if(counted.length<MIN_STAGE_PROBLEMS) continue;
    const steps=stepsOf(templates,unit), at=steps.findIndex(s=>s.number===level), final=at===steps.length-1;
    if(at<0) continue;
    // 잠긴 단원 정리(앞 단계를 다 넘기기 전)는 판정하지 않는다.
    if(final && !steps.slice(0,-1).every(s=>info.passed.includes(s.number))) continue;
    const correct=counted.filter(i=>i.result.correct).length, need=requiredCorrect(counted.length), passed=correct>=need;
    const already=info.passed.includes(level);
    if(passed) {
      const u=(state.units[unit] ??= {passed:[],history:[],mastered:null});
      u.passed=[...new Set([...info.passed,level])].sort((a,b)=>a-b);
      delete u.level; // 옛 꼴(지금 k단계)은 넘긴 단계 모음으로 바꿔 남긴다
      if(final) { u.mastered=today;events.push({type:'mastered',unit}); }
      else if(!already) events.push({type:'passed',unit,level});
    }
    evaluations.push({unit,level,name:steps[at].name,total:counted.length,correct,need,passed,already,mastered:passed && final,
      passedSteps:unitInfo(state,unit,templates).passed});
  }
  return {events,evaluations};
}
