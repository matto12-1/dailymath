// Scene motion only. Workers stay at work; nonworkers can visit one neighbour or shop.
import { FRAMES, FRAME_NAMES, frameImg, residentImg } from './art/assets.js?v=9a67f36b25';
import { visitPath, distance } from '../src/game/village-walk.js?v=9a67f36b25';
import { walkDirection } from '../src/game/village-walk-dir.js?v=9a67f36b25';

const STEPS=[1,2,3,2],SPEED=5,WALK_STEP=190,STAY=1600;
export const hasFrames=(kind,variant,group='work')=>FRAMES[kind]?.[variant]?.includes(group)??false;
const frameLoads=new Map(),framesLoaded=new Set();
export function preloadFrames(kind,variant) {
  const key=kind+':'+variant;
  if(!frameLoads.has(key))frameLoads.set(key,Promise.all(FRAME_NAMES.map(name=>frameImg(kind,variant,name)).filter(Boolean).map(src=>{
    const img=new Image();img.src=src;return img.decode();
  })).then(()=>{framesLoaded.add(key);},error=>{frameLoads.delete(key);throw error;}));
  return frameLoads.get(key);
}
// A resident switches to motion frames only after all of its frames decoded. Swapping an <img> to a frame that is
// still downloading aborts that request (ERR_ABORTED) and can flash an empty picture on a slow tablet.
export const framesReady=(kind,variant)=>framesLoaded.has(kind+':'+variant);
export function startLife({root,stage,entries,walk,shops=[],rng=Math.random,still=false,reduced=false}) {
  const artOf=e=>e.node.querySelector('.thing-art');
  const setSource=(e,src)=>{if(!artOf(e).src.endsWith(src))artOf(e).src=src;};
  const workLook=(e,step)=>{
    const working=e.mode==='work'||e.mode==='play';
    const frames=working&&hasFrames(e.kind,e.variant)&&framesReady(e.kind,e.variant);
    e.node.toggleAttribute('data-work-frame',frames);
    const box=e.box;
    e.node.dataset.artBox=JSON.stringify(frames?{l:box.l*.75+12.5,r:box.r*.75+12.5,t:box.t*.75+25,b:box.b*.75+25}:box);
    if(frames)setSource(e,frameImg(e.kind,e.variant,'work-'+STEPS[step]));
    else setSource(e,residentImg(e.kind,e.variant));
    // The source table leaves motion empty for the pilot rolling dog.
    if(e.activity.motion==='rock'||e.kind==='dog'&&e.variant===3&&working){
      e.node.dataset.motion='rock';artOf(e).style.transformOrigin='50% 92%';
      artOf(e).style.transition='rotate '+e.activity.ms+'ms linear';
      artOf(e).style.rotate=reduced?'0deg':[-7,0,7,0][step]+'deg';
    }else e.node.dataset.motion=frames?'work':'bob';
  };
  let stopped=false;
  const refreshFrames=()=>{
    for(const e of entries)preloadFrames(e.kind,e.variant).then(()=>{
      delete e.node.dataset.framesMissing;
      if(!stopped&&!e.node.style.translate)workLook(e,Math.max(0,e.lastStep));
    },()=>{if(!stopped)e.node.dataset.framesMissing='true';});
  };
  globalThis.addEventListener?.('online',refreshFrames);
  const stopFrames=()=>globalThis.removeEventListener?.('online',refreshFrames);
  for(const e of entries){e.box=JSON.parse(e.node.dataset.artBox);e.home={...e.point,z:e.node.style.zIndex};e.lastStep=-1;workLook(e,0);}
  // Redraw a resident at home as soon as its frames are ready; one away on a visit picks them up when it returns.
  // The scene starts the loads (preloadFrames); here we only wait on loads already running.
  for(const e of entries)if(!framesReady(e.kind,e.variant))frameLoads.get(e.kind+':'+e.variant)?.then(()=>{
    if(!stopped&&!e.node.style.translate)workLook(e,Math.max(0,e.lastStep));
  },()=>{if(!stopped)e.node.dataset.framesMissing='true';});
  if(still||reduced)return()=>{stopped=true;stopFrames();};
  const walkers=entries.filter(e=>!e.worker);
  // Prepare one resident per timer task, outside requestAnimationFrame.
  // Animation frames only choose and follow routes already in this cache.
  const plans=new Map();
  let prepareTimer=null,prepared=0;
  function prepareNext(){
    prepareTimer=null;if(stopped)return;
    const walker=walkers[prepared++];
    const friends=entries.filter(e=>e!==walker).sort((a,b)=>distance(walk,a.point,walker.point)-distance(walk,b.point,walker.point)).slice(0,3);
    const visits=friends.map(friend=>({friend,route:visitPath(walk,walker.point,friend.point,4)})).filter(p=>p.route);
    const stores=shops.map(shop=>({shop,route:visitPath(walk,walker.point,shop.point,0)})).filter(p=>p.route);
    const plan={visits,stores};plans.set(walker,plan);
    if(prepared<walkers.length)prepareTimer=setTimeout(prepareNext,0);
  }
  if(walkers.length)prepareTimer=setTimeout(prepareNext,0);
  let frame=0,life=0,last=null,next=3000,visit=null,bubble=null;
  const moveTo=(e,p)=>{e.node.style.translate=(p.x-e.home.x)+'cqw '+((p.y-e.home.y)*walk.aspect)+'cqw';e.node.style.zIndex=Math.round(p.y*100);};
  function stand(e) {
    e.node.removeAttribute('data-walking');e.node.removeAttribute('data-flip');e.node.removeAttribute('data-work-frame');
    e.node.dataset.artBox=JSON.stringify(e.box);
    artOf(e).style.translate='';e.node.dataset.motion='bob';setSource(e,residentImg(e.kind,e.variant));
  }
  function home(e) {
    stand(e);e.node.style.translate='';e.node.style.willChange='';e.node.style.zIndex=e.home.z;e.lastStep=-1;workLook(e,0);
  }
  function startVisit() {
    if(!plans.size){next=life+250;return;}
    next=life+7000+rng()*5000;
    const first=Math.floor(rng()*walkers.length),shopTurn=rng()<.5;
    for(let i=0;i<walkers.length;i++){
      const walker=walkers[(first+i)%walkers.length],p=plans.get(walker);if(!p)continue;
      const choices=shopTurn&&p.stores.length?p.stores:p.visits;
      if(!choices.length)continue;
      const chosen=choices[Math.floor(rng()*choices.length)];
      visit={...chosen,walker,points:chosen.route.points,length:chosen.route.length,ms:Math.max(1,chosen.route.length/SPEED*1000),t:0,phase:'go'};
      walker.node.style.willChange='translate';
      root.dataset.visit=chosen.shop?'shop:'+chosen.shop.id:'friend';return;
    }
    next=life+250;
  }
  function showBubble(v) {
    const dest=v.points.at(-1),height=parseFloat(v.walker.node.style.getPropertyValue('--bh'))/walk.aspect;
    bubble=document.createElement('div');bubble.className=v.shop?'life-heart life-shop':'life-heart';
    bubble.style.left=dest.x+'%';bubble.style.top=(dest.y-height)+'%';
    if(v.shop){
      const img=document.createElement('img');img.src=v.shop.icon;img.alt='';bubble.append(img);
      root.dataset.shopVisits=String(Number(root.dataset.shopVisits??0)+1);
    }else{
      bubble.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><circle class="heart-back" cx="20" cy="20" r="18"/><path class="heart-red" d="M20 31C-8 12 12 1 20 14 28 1 48 12 20 31Z"/></svg>';
    }
    stage.append(bubble);
  }
  function stepVisit(dt) {
    const v=visit;v.t+=dt;
    if(v.phase==='stay'){
      if(v.t<STAY)return;bubble?.remove();bubble=null;
      Object.assign(v,{phase:'back',t:0,points:[...v.points].reverse()});return;
    }
    const k=Math.min(1,v.t/v.ms);
    let remaining=k*v.length,a=v.points[0],b=v.points[1];
    for(let i=1;i<v.points.length;i++){a=v.points[i-1];b=v.points[i];const d=distance(walk,a,b);if(remaining<=d||i===v.points.length-1)break;remaining-=d;}
    const fraction=Math.min(1,remaining/(distance(walk,a,b)||1));
    moveTo(v.walker,{x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction});
    const e=v.walker,dir=walkDirection(b.x-a.x,(b.y-a.y)*walk.aspect,FRAMES[e.kind]?.[e.variant]??[]);
    e.node.dataset.walking='';e.node.dataset.motion='walk';e.node.removeAttribute('data-work-frame');e.node.toggleAttribute('data-flip',dir.flip);
    e.node.dataset.artBox=JSON.stringify(e.box);
    artOf(e).style.rotate='';artOf(e).style.transition='';
    const source=(framesReady(e.kind,e.variant)&&frameImg(e.kind,e.variant,dir.name+'-'+(Math.floor(v.t/WALK_STEP)%2+1)))||residentImg(e.kind,e.variant);
    setSource(e,source);artOf(e).style.translate='0 '+(-Math.abs(Math.sin(Math.PI*v.t/WALK_STEP))*parseFloat(e.node.style.getPropertyValue('--bh'))*.025)+'cqw';
    if(k<1)return;
    if(v.phase==='go'){v.phase='stay';v.t=0;stand(e);showBubble(v);}
    else{home(e);visit=null;delete root.dataset.visit;next=life+7000+rng()*5000;}
  }
  function tick(now) {
    frame=requestAnimationFrame(tick);if(document.hidden){last=null;return;}
    const dt=last===null?0:Math.min(now-last,100);life+=dt;last=now;
    for(const e of entries){
      if(visit?.walker===e)continue;
      const step=Math.floor(life/e.activity.ms)%4;
      if(step!==e.lastStep){e.lastStep=step;workLook(e,step);}
    }
    if(!visit&&life>=next)startVisit();
    if(visit)stepVisit(dt);
  }
  frame=requestAnimationFrame(tick);
  return()=>{stopped=true;stopFrames();clearTimeout(prepareTimer);cancelAnimationFrame(frame);bubble?.remove();visit=null;};
}
