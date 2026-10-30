// 다시 나오기 → 앞 학년 다지기 → 이 판의 차시(「지금 여기예요」 단계). 그 차시를 적어도 네 문제 확보한다.
// 장소 창에서 단계를 골라 시작한 판은 그 단계 문제로만 채운다(다시 나오기·약점·다지기는 섞지 않음, 10-17 Matto 「아무거나 눌러도 다 1차시로 가지거든」).
import { generate, STRANDS } from '../engine/template.js?v=9a67f36b25';
import { questionText } from '../engine/format.js?v=9a67f36b25';
import { unitPath, unitInfo, currentUnit, poolFor, gradeOfUnit, stepsOf, levelForTemplate, stepOpen } from './units.js?v=9a67f36b25';
import { dueReviews, weakUnits } from './review.js?v=9a67f36b25';
import { studyRange } from './study.js?v=9a67f36b25';

export const MAX_REVIEW = 3;
export const MAX_CATCHUP_REVIEW = 5;
const KEEP_SHARE = 0.2, WORD_SHARE = 0.3;
const ORDER = { calc:0, estimate:1, shape:2, word:3, life:4 };
export const deckSize = grade => grade===1 ? 6 : grade===2 ? 8 : 10;
const byStrand = (a,b) => ORDER[a.template.strand]-ORDER[b.template.strand];

export function availableStrands(state, templates, units) {
  const study=state.study ?? state.grade;
  if(!studyRange(state.grade).includes(study)) return [];
  const path=unitPath(units,templates,study), cur=currentUnit(state,path,templates);
  const open=new Set((cur?path.slice(0,path.indexOf(cur)+1):path).map(u=>u.id));
  return STRANDS.filter(strand=>templates.some(t=>t.grade===study && open.has(t.unit) && t.strand===strand));
}

// 장소 창에서 고른 단계의 판: 지금 곳의 열린 단계면 { unit, step }, 아니면 null(「지금 여기예요」 단계 판).
export function roundPick({ state, templates, units, step }) {
  if(step == null) return null;
  const cur=currentUnit(state,unitPath(units,templates,state.study ?? state.grade),templates);
  return cur && stepOpen(state,cur.id,templates,step) ? {unit:cur.id,step} : null;
}

export function buildDeck({ state, templates, units, today, rng, strand=null, pick=null }) {
  const path=unitPath(units,templates,state.study ?? state.grade);
  if(!path.length) return [];
  const byId=new Map(templates.map(t=>[t.id,t]));
  const levelOf=id=>unitInfo(state,id,templates).here;
  const size=deckSize(state.grade), deck=[];
  const cur=currentUnit(state,path,templates), open=cur?path.slice(0,path.indexOf(cur)+1):path;
  if(pick && (!cur || pick.unit!==cur.id || !stepOpen(state,pick.unit,templates,pick.step)))return [];
  // 고른 단계는 지금 곳에만 쓴다(갈래 골라 풀기는 늘 「지금 여기예요」 단계).
  const chosen=!strand && cur && pick?.unit===cur.id ? pick.step : null;
  const stepOf=id=>id===cur?.id && chosen!=null ? chosen : levelOf(id);
  let target=cur, mainPool=cur?poolFor(templates,cur.id,stepOf(cur.id),strand):[];
  if(strand && !mainPool.length) {
    target=open.find(u=>!unitInfo(state,u.id,templates).mastered && poolFor(templates,u.id,levelOf(u.id),strand).length) ?? null;
    mainPool=target?poolFor(templates,target.id,levelOf(target.id),strand):[];
  }
  if(!mainPool.length) {
    target=null;
    const all=(strand?open:path).flatMap(u=>templates.filter(t=>t.unit===u.id && (!strand || t.strand===strand)));
    // 골라 풀기에 현재 차시의 갈래가 없으면 열린 틀 중 가장 낮은 난도부터. 판정에는 안 들어간다.
    const low=Math.min(...all.map(t=>t.level));
    mainPool=strand && cur?all.filter(t=>t.level===low):all;
  }
  const steps=target?stepsOf(templates,target.id):[], targetStep=target?stepOf(target.id):null;
  const recap=target && steps.at(-1)?.number===targetStep && steps.at(-1)?.name==='단원 정리';
  const groups=recap?steps.slice(0,-1).map(s=>mainPool.filter(t=>s.templates.includes(t.id))).filter(g=>g.length):[];
  const reserve=target?Math.max(4,recap?Math.min(size,mainPool.length):4):0;
  const tag=target?{unit:target.id,step:targetStep}:null;
  const add=(template,reason,extra={})=>deck.push({template,reason,step:levelForTemplate(state,template,templates,tag),...extra});

  const allowed=studyRange(state.grade), picked=chosen!=null;
  const weak=strand || picked || recap?[]:weakUnits(state,templates,state.study ?? state.grade).filter(id=>allowed.includes(gradeOfUnit(id)))
    .map(id=>poolFor(templates,id,levelOf(id))).filter(pool=>pool.length);
  const weakRoom=weak.length && size>reserve ? 1 : 0;
  const due=dueReviews(state,today);
  const cap=!strand && (due.some(r=>r.due<today) || new Set(due.map(r=>r.templateId)).size>MAX_REVIEW) ? MAX_CATCHUP_REVIEW : MAX_REVIEW;
  const reviewCap=picked || recap?0:Math.min(cap,size-reserve-weakRoom);
  const reviewTemplates=new Set();
  for(const r of due) {
    if(deck.length>=reviewCap) break;
    const t=byId.get(r.templateId);
    if(t && !reviewTemplates.has(t.id) && allowed.includes(t.grade) && (!strand || t.strand===strand)) {
      const group=groups.find(g=>g.some(x=>x.id===t.id));
      if(group && deck.filter(d=>group.some(x=>x.id===d.template.id)).length>=Math.ceil(size/groups.length)) continue;
      add(t,'review',{reviewKey:r.key});
      reviewTemplates.add(t.id);
    }
  }
  if(weakRoom) add(rng.pick(rng.pick(weak)),'weak');

  const keepPool=strand || !cur || picked || recap?[]:path.filter(u=>unitInfo(state,u.id,templates).mastered)
    .flatMap(u=>poolFor(templates,u.id,levelOf(u.id)));
  if(!mainPool.length && !keepPool.length) return deck.sort(byStrand);
  const recent=state.strands.word ?? [], wordWeak=recent.length>=5 && recent.filter(Boolean).length/recent.length<.5;
  const wordCap=strand==='word'?size:wordWeak?1:Math.ceil(size*WORD_SHARE);
  const limited=pool=>{
    const words=deck.filter(d=>d.template.strand==='word').length;
    if(pool.some(t=>t.strand!=='word') && words>=wordCap) return pool.filter(t=>t.strand!=='word');
    return pool;
  };
  while(deck.length<size) {
    const currentCount=target?deck.filter(d=>d.template.unit===target.id && d.step===targetStep).length:0;
    const unseen=groups.filter(g=>!deck.some(d=>g.some(t=>t.id===d.template.id))).length;
    const unseenTemplates=recap?mainPool.filter(t=>!deck.some(d=>d.template.id===t.id)).length:0;
    const room=size-deck.length, canKeep=room>Math.max(0,reserve-currentCount,unseen,unseenTemplates);
    const fromKeep=keepPool.length>0 && canKeep && (!mainPool.length || rng.next()<KEEP_SHARE);
    let pool=fromKeep?limited(keepPool):mainPool;
    if(!fromKeep && groups.length) {
      // 아직 적게 나온 차시부터 채운다. 문제 수가 허락하면 모든 차시가 한 번 이상 나온다.
      const counts=groups.map(g=>deck.filter(d=>d.template.unit===target.id && g.some(t=>t.id===d.template.id)).length);
      const min=Math.min(...counts), least=groups.filter((g,i)=>counts[i]===min);
      const withNew=least.filter(g=>g.some(t=>!deck.some(d=>d.template.id===t.id)));
      pool=rng.pick(withNew.length?withNew:least);
    } else if(!fromKeep) pool=limited(pool);
    if(!pool.length) break;
    if(!fromKeep && recap) {
      const counts=pool.map(t=>deck.filter(d=>d.template.id===t.id).length), min=Math.min(...counts);
      pool=pool.filter((t,i)=>counts[i]===min);
    }
    add(rng.pick(pool),fromKeep?'keep':'unit');
  }
  return deck.sort(byStrand);
}

// 분수 비교처럼 보기 자체가 물음의 수인 문제도 있다. 보기의 순서만 바뀐 것은 같은 문제다.
export const problemKey = p => JSON.stringify([questionText(p), p.art ?? null,
  (p.choices ?? []).map(c=>JSON.stringify(c)).sort(), p.answer]);

export function makeProblems(deck, rng) {
  const seen=new Map();
  const items=deck.map(d=>{
    let problem=generate(d.template,rng);
    let key=problemKey(problem), rank=seen.get(key) ?? 0;
    // 가짓수가 적은 틀에서도 한 문제만 지나치게 반복하지 않게 가장 적게 쓴 것을 고른다.
    for(let i=0;i<120 && rank>0;i++) {
      const candidate=generate(d.template,rng), candidateKey=problemKey(candidate), count=seen.get(candidateKey) ?? 0;
      if(count<rank) {problem=candidate;key=candidateKey;rank=count;}
    }
    seen.set(key,rank+1);
    return {...d,problem,done:false,result:null};
  });
  if(!items.some((it,i)=>i && problemKey(it.problem)===problemKey(items[i-1].problem)))return items;
  // 같은 문제를 붙이지 않는 배열. 큰 묶음부터 놓고 동률이면 원래 차례를 지킨다.
  const groups=new Map();
  for(const it of items) {const key=problemKey(it.problem);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(it);}
  const arranged=[];
  let previous=null;
  while(arranged.length<items.length) {
    const choices=[...groups].filter(([,g])=>g.length).sort((a,b)=>b[1].length-a[1].length);
    const [key,group]=choices.find(([k])=>k!==previous) ?? choices[0];
    arranged.push(group.shift());previous=key;
  }
  return arranged;
}
