import { h } from '../ui.js?v=9a67f36b25';
import { icon } from '../icons.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { villageStageSize, RESIDENT_HEIGHT_RATIO, plazaPoint } from '../../src/game/village-pan.js?v=9a67f36b25';
import { watchSceneImages } from '../backdrop.js?v=9a67f36b25';
import { matchDemoVillageKind } from '../../src/game/village-demo-data.js?v=9a67f36b25';
import { villageTargets } from '../village-targets.js?v=9a67f36b25';
import { pickVillageTarget } from '../../src/game/village-pick.js?v=9a67f36b25';
import { VILLAGE } from '../art/village-data.js?v=9a67f36b25';
import { BASES } from '../art/bases.js?v=9a67f36b25';
import { residentImg, SHOP_ART, SIGN_ART, PROP_ART } from '../art/assets.js?v=9a67f36b25';
import { CURRENCY, openPlots, residents, whereToday } from '../../src/game/village.js?v=9a67f36b25';
import { ACTIVITY, dayPlan } from '../../src/game/village-life.js?v=9a67f36b25';
import { shopsFor, shopLevel, nextPrice, lotOpen, build } from '../../src/game/shops.js?v=9a67f36b25';
import { workersOf } from '../../src/game/roles.js?v=9a67f36b25';
import { startLife, preloadFrames } from '../village-life.js?v=9a67f36b25';
import { josa } from '../../src/engine/korean.js?v=9a67f36b25';
import { villageObstacles, sceneGeometry, shopShape, houseShape } from '../art/village-geometry.js?v=9a67f36b25';
import { WALK } from '../art/village-walk.js?v=9a67f36b25';
import { decodeGrid, withObstacles } from '../../src/game/village-walk.js?v=9a67f36b25';

// The button ends at the feet; the transparent canvas extends around it.
export function sceneThing({ src, box, height, point, className, label, data = {}, onclick, base }) {
  const {size,width,cx,foot} = sceneGeometry({box,height,point,base});
  return h('button', { class:'thing '+className, 'aria-label':label, 'data-art-box':JSON.stringify(box), ...data, onclick,
    style:`left:${point.x}%;top:${point.y}%;z-index:${Math.round(point.y*100)};--size:${size}cqw;--bw:${width}cqw;--bh:${height}cqw;--cx:${cx};--foot:${foot}` },
    h('span', {class:'thing-shadow','aria-hidden':'true'}),
    h('img', {class:'thing-art',src,alt:'',draggable:'false',width:384,height:384}));
}

export function residentThing(kind, resident, point, height, where, onCard) {
  const node = sceneThing({src:residentImg(kind,resident.look.variant),box:BASES.residents[kind][resident.look.variant],
    height:height*(resident.look.baby ? .8 : 1),point,className:'resident',label:resident.name,
    data:{'data-id':resident.id,'data-target':'resident:'+resident.id,'data-baby':String(resident.look.baby)},onclick:()=>onCard(resident,where)});
  node.style.setProperty('--delay',-(resident.look.variant%13)*.2+'s');
  return node;
}

export function village(ctx, { highlight = null, shop: requestedShop = null } = {}) {
  if (ctx.demo) matchDemoVillageKind(ctx.state);
  const s=ctx.state, kind=s.town.kind, money=CURRENCY[kind], art=VILLAGE[kind];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let alive=true, closeSheet=null, stopLife=()=>{}, stageSize=null, viewportSize=null, introduced=false;
  let viewCenter=ctx.villageView?.[kind] ?? art.plazaCenter, drag=null, suppressClick=false, navigation=0;
  const timers=new Set(), frames=new Set();
  const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);if(alive)fn();},ms);timers.add(id);};
  const animate=fn=>{const id=requestAnimationFrame(t=>{frames.delete(id);if(alive)fn(t);});frames.add(id);};
  const stage=h('div',{class:'stage'});
  const scroller=h('div',{class:'village-scroll',role:'region',tabindex:0,'aria-label':'마을 그림, 끌어서 둘러보기'},stage);
  const hint=h('p',{class:'pan-hint pill'},'손가락으로 끌어서 마을을 둘러봐요');
  hint.hidden=true;
  let hintDismissed=false;
  const dismissHint=()=>{hintDismissed=true;hint.hidden=true;};
  const loading=h('div',{class:'village-loading',role:'status'},icon('house'),h('p',{},'마을 그림을 불러오는 중이에요'));
  const amount=h('span',{},s.coins);
  const balance=h('span',{class:'money pill','aria-label':money+' '+s.coins+'개'},icon(kind==='cat'?'fish':'bone'),amount);
  const root=h('section',{class:'screen village-scene','data-kind':kind,'data-layout':'wide','data-still':ctx.still,style:'--sea:'+BASES.sea[kind].wide},scroller,loading,
    h('header',{class:'village-top'},balance,h('button',{class:'to-map pill',onclick:()=>ctx.go('home')},icon('map'),'지도로')),
    h('div',{class:'village-bottom'},hint,h('nav',{class:'village-actions','aria-label':'마을'},
      h('button',{class:'round shops',onclick:openList},h('img',{src:SHOP_ART.bakery.icon,alt:''}),h('span',{class:'round-name'},'가게')),
      h('button',{class:'round cards',onclick:()=>ctx.go('residents')},icon('cards'),h('span',{class:'round-name'},'주민')))));
  const stopImages=watchSceneImages(document.getElementById('app'));
  function remember() {
    if(!stageSize||!viewportSize||scroller.clientWidth!==viewportSize.width||scroller.clientHeight!==viewportSize.height)return;
    viewCenter={x:(scroller.scrollLeft+scroller.clientWidth/2)/stageSize.width*100,y:(scroller.scrollTop+scroller.clientHeight/2)/stageSize.height*100};
    ctx.villageView ??={};ctx.villageView[kind]=viewCenter;
  }
  scroller.addEventListener('scroll',remember,{passive:true});
  scroller.addEventListener('touchmove',dismissHint,{passive:true});
  scroller.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    suppressClick=false;drag={id:e.pointerId,type:e.pointerType,x:e.clientX,y:e.clientY,left:scroller.scrollLeft,top:scroller.scrollTop,moved:false};
  });
  const endDrag=e=>{
    if(!drag||e.pointerId!==drag.id)return;
    suppressClick=drag.moved;drag=null;scroller.classList.remove('dragging');
    if(scroller.hasPointerCapture(e.pointerId))scroller.releasePointerCapture(e.pointerId);
  };
  scroller.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    if(drag.type==='mouse'&&!(e.buttons&1)){endDrag(e);return;}
    if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<=6)return;
    drag.moved=true;dismissHint();
    if(drag.type!=='mouse')return;
    scroller.setPointerCapture(e.pointerId);scroller.classList.add('dragging');
    scroller.scrollLeft=drag.left+drag.x-e.clientX;scroller.scrollTop=drag.top+drag.y-e.clientY;
  });
  scroller.addEventListener('pointerup',endDrag);scroller.addEventListener('pointercancel',endDrag);
  scroller.addEventListener('click',e=>{if(suppressClick&&e.detail!==0){suppressClick=false;e.preventDefault();e.stopImmediatePropagation();}},true);
  scroller.addEventListener('keydown',e=>{
    if(e.target!==scroller)return;
    const d={ArrowLeft:[-.15,0],ArrowRight:[.15,0],ArrowUp:[0,-.15],ArrowDown:[0,.15]}[e.key];
    if(!d)return;e.preventDefault();dismissHint();
    scroller.scrollBy({left:d[0]*scroller.clientWidth,top:d[1]*scroller.clientHeight,behavior:reduced.matches?'instant':'smooth'});
  });
  root.addEventListener('click',e=>{
    if(e.target.closest('button,a,input,select,textarea')||!scroller.contains(e.target))return;
    const target=pickVillageTarget(villageTargets(root),{x:e.clientX,y:e.clientY});
    if(target){target.node.focus({preventScroll:true});target.node.click();}
  });
  const openCard=async(resident,where)=>{
    const {residentCard}=await import('./residents.js?v=9a67f36b25');if(!alive)return;
    closeSheet?.();closeSheet=residentCard(ctx,resident,where,{onShop:goShop});
  };
  const close=()=>{closeSheet?.();closeSheet=null;};
  function fit() {
    if(!root.isConnected)return;
    const r=root.getBoundingClientRect();
    stageSize=villageStageSize({width:r.width,height:r.height,artWidth:art.w,artHeight:art.h,residentScale:1});
    Object.assign(stage.style,{width:stageSize.width+'px',height:stageSize.height+'px'});
    viewportSize={width:scroller.clientWidth,height:scroller.clientHeight};
    scroller.scrollTo({left:viewCenter.x/100*stageSize.width-scroller.clientWidth/2,top:viewCenter.y/100*stageSize.height-scroller.clientHeight/2,behavior:'instant'});
    remember();stage.dataset.cover='true';
  }
  function center(point) {
    viewCenter={x:point.x,y:point.y};
    scroller.scrollTo({left:point.x/100*stageSize.width-scroller.clientWidth/2,top:point.y/100*stageSize.height-scroller.clientHeight/2,behavior:reduced.matches?'instant':'smooth'});
  }
  function shine(node,ms=1200) {
    if(!node)return;node.classList.add('highlight');later(()=>node.classList.remove('highlight'),ms);
  }
  function goShop(id) {
    close();const ticket=++navigation,lot=art.lots[id];if(!lot)return;
    dismissHint();center(lot);root.dataset.panBehavior=reduced.matches?'instant':'smooth';
    const target=()=>stage.querySelector('[data-shop="'+id+'"]') ?? stage.querySelector('.fog-plot[data-shop="'+id+'"]');
    const show=()=>{if(ticket!==navigation)return;shine(target(),1000);openShop(id);};
    if(reduced.matches)show();else later(show,500);
  }
  function openList() {
    navigation++;
    close();
    closeSheet=openSheet(document.getElementById('app'),{label:'우리 마을 가게',className:'shop-list-sheet'},
      h('h2',{},'우리 마을 가게'),
      h('div',{class:'shop-list'},...shopsFor(kind).map(shop=>{
        const level=shopLevel(s,shop.id),price=nextPrice(s,shop.id),info=SHOP_ART[shop.id];
        const status=!lotOpen(s,shop.id)?'안개 땅이 열리면 지을 수 있어요':level===3?'다 키웠어요':level?level+'단계 · 키우기 '+price:'지을 수 있어요 '+price;
        return h('button',{class:'shop-row','data-shop':shop.id,onclick:()=>goShop(shop.id)},
          h('img',{src:info.icon,alt:'',width:56,height:56}),h('strong',{},shop.name),h('span',{},status));
      })));
  }
  function openShop(id) {
    close();const shop=shopsFor(kind).find(v=>v.id===id),level=shopLevel(s,id),price=nextPrice(s,id),info=SHOP_ART[id],locked=!lotOpen(s,id);
    const all=residents(s,ctx.units),workerVariants=workersOf(kind,id);
    const message=h('p',{class:'build-message','aria-live':'polite'});
    let busy=false;
    const purchase=h('button',{class:'pill build-shop','aria-disabled':String(s.coins<price),'data-shop':id,onclick:()=>{
      if(busy)return;
      if(s.coins<price){message.textContent=josa(money,'이/가')+' '+(price-s.coins)+'개 더 있어야 해요';return;}
      busy=true;purchase.disabled=true;
      const before=s.coins,result=build(s,id);
      if(!result.ok){busy=false;purchase.disabled=false;message.textContent='지금은 지을 수 없어요';return;}
      ctx.save();close();render();
      const node=stage.querySelector('[data-shop="'+id+'"]');
      const reveal=()=>{shine(node);if(!reduced.matches){node.classList.add('pop');later(()=>node.classList.remove('pop'),300);}};
      if(reduced.matches)reveal();else {
        node.classList.add('building');
        const dust=h('div',{class:'build-dust','aria-hidden':'true',style:'left:'+art.lots[id].x+'%;top:'+art.lots[id].y+'%'},...[0,1,2,3,4].map(i=>h('i',{style:'--i:'+i})));
        stage.append(dust);later(()=>{dust.remove();node.classList.remove('building');reveal();},400);
      }
      balance.setAttribute('aria-label',money+' '+s.coins+'개');
      if(reduced.matches)amount.textContent=s.coins;else {
        let start=null;const end=s.coins;
        const tick=t=>{start ??=t;const k=Math.min(1,(t-start)/600);amount.textContent=Math.round(before+(end-before)*k);if(k<1)animate(tick);};
        animate(tick);
      }
    }},level?'키우기':'짓기',icon(kind==='cat'?'fish':'bone'),String(price));
    const workers=workerVariants.map((variant,i)=>{
      const found=all.find(r=>!r.look.baby&&r.look.variant===variant);
      return h('div',{class:'shop-worker','data-seat':i+1},
        found?h('img',{src:residentImg(kind,variant),alt:'',width:64,height:64}):h('span',{class:'worker-empty','aria-label':'아직 오지 않은 주민'}),
        h('span',{},found?.name ?? '아직 안 왔어요'),
        i>=level&&level>0&&h('small',{class:'worker-lock'},'키우면 와요'));
    });
    const arrived=workerVariants.filter(v=>all.some(r=>!r.look.baby&&r.look.variant===v));
    closeSheet=openSheet(document.getElementById('app'),{label:shop.name,className:'shop-sheet'},
      h('h2',{},h('img',{class:'shop-card-icon',src:info.icon,alt:'',width:32,height:32}),shop.name),h('img',{class:'shop-preview',src:info.src[Math.max(0,level-1)],alt:'',width:200,height:200}),
      level>0&&h('p',{class:'shop-level','aria-label':'3단계 가운데 '+level+'단계'},'●'.repeat(level)+'○'.repeat(3-level)),
      locked?h('p',{class:'shop-locked'},'안개 땅이 열리면 지을 수 있어요'):
        h('div',{},h('h3',{},level?'함께 일하는 주민':'여기서 일할 주민'),
          !level&&!arrived.length?h('p',{},'지으면 다음에 이사 오는 주민이 여기서 일해요'):h('div',{class:'shop-workers'},...workers),
          level===3?h('p',{class:'shop-max'},'다 키웠어요'):h('div',{},purchase,message)));
  }
  function render() {
    stopLife();const plan=dayPlan(s,ctx.units,ctx.today),today=whereToday(s,ctx.units,ctx.today),all=residents(s,ctx.units);
    const opened=openPlots(s),background=h('img',{class:'village-art',src:art.img,alt:'',width:art.w,height:art.h,draggable:'false',fetchpriority:'high'});
    const haze=opened<6?h('img',{class:'fog-haze',src:art.fog[opened],alt:'',width:art.w,height:art.h,draggable:'false',fetchpriority:'high'}):null;
    const nodes=[background,...(haze?[haze]:[])];
    for(const shop of shopsFor(kind)) {
      if(!lotOpen(s,shop.id))continue;
      const lot=art.lots[shop.id],level=shopLevel(s,shop.id),info=SHOP_ART[shop.id];
      let node;
      if(level){
        node=sceneThing({...shopShape(art,shop.id,level),className:'shop',label:shop.name,
          data:{'data-shop':shop.id,'data-target':'shop:'+shop.id,'data-level':level},onclick:()=>openShop(shop.id)});
      } else {
        node=sceneThing({src:SIGN_ART.src,box:SIGN_ART.box,height:SIGN_ART.height,point:lot,className:'sign',label:shop.name+' 짓기',
          base:{x:SIGN_ART.base.x/SIGN_ART.canvas,y:SIGN_ART.base.y/SIGN_ART.canvas},
          data:{'data-shop':shop.id,'data-target':'sign:'+shop.id},onclick:()=>openShop(shop.id)});
        const p=SIGN_ART.panel;
        node.append(h('span',{class:'sign-panel',style:`--panel-x:${p.x/SIGN_ART.canvas};--panel-y:${p.y/SIGN_ART.canvas};--panel-w:${p.width/SIGN_ART.canvas};--panel-h:${p.height/SIGN_ART.canvas}`},
          h('img',{src:info.icon,alt:''}),h('b',{},nextPrice(s,shop.id))));
      }
      nodes.push(node);
    }
    for(const [id,point]of Object.entries(art.houses)){
      nodes.push(sceneThing({...houseShape(art,id),className:'house',label:id==='small'?'작은 집':'큰 집',
        data:{'data-house':id,'data-target':'house:'+id},onclick:()=>ctx.go('house',{house:id})}));
    }
    art.props.forEach((point,i)=>{
      const info=PROP_ART[point.id];
      let node;
      node=sceneThing({src:info.src,box:info.box,height:info.height,point,className:'prop',label:({flower:'꽃밭',bench:'의자',lamp:'가로등',tree:'나무',mailbox:'우체통',table:'탁자',well:'우물',fountain:'분수'})[point.id],
        base:{x:info.base.x/info.canvas,y:info.base.y/info.canvas},
        data:{'data-prop':i,'data-target':'prop:'+i},onclick:()=>{node.classList.remove('wiggle');void node.offsetWidth;node.classList.add('wiggle');}});
      nodes.push(node);
    });
    for(const p of art.plots.filter(p=>p.id>opened))nodes.push(h('div',{class:'fog-plot','data-plot':p.id,'data-shop':p.shop,
      style:`left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%`}));
    const entries=[];
    for(const p of [...plan.working.map(p=>({...p,mode:'work'})),...plan.plaza]){
      const resident=all.find(r=>r.id===p.id),point=p.shop?art.lots[p.shop].work[p.seat-1]:plazaPoint(kind,art,p.spot);
      const node=residentThing(kind,resident,point,RESIDENT_HEIGHT_RATIO*100*art.h/art.w,today.where[p.id],openCard);
      node.dataset.mode=p.mode;node.dataset.place=p.shop??'yard';nodes.push(node);
      entries.push({node,kind,variant:p.variant,activity:ACTIVITY[kind][p.variant],mode:p.mode,point,worker:Boolean(p.shop)});
    }
    stage.dataset.artReady='false';
    stage.replaceChildren(...nodes);
    const artReady=Promise.allSettled([...stage.querySelectorAll('img')].map(img=>img.decode()));
    root.villageArtReady=artReady;
    const loaded=()=>{
      if(!alive||root.villageArtReady!==artReady)return;
      loading.hidden=background.naturalWidth>0&&stage.dataset.artReady==='true';
      if(loading.hidden&&!introduced){
        introduced=true;
        if(!hintDismissed){hint.hidden=false;later(dismissHint,4000);}
        if(highlight)showHighlight();if(requestedShop)goShop(requestedShop);
      }
    };
    background.addEventListener('load',loaded);
    background.addEventListener('error',()=>{if(alive&&root.villageArtReady===artReady)loading.querySelector('p').textContent='인터넷이 이어지면 마을 그림을 다시 불러와요';});
    root.villageFramesReady=Promise.allSettled(entries.map(e=>preloadFrames(e.kind,e.variant)));
    const terrain=decodeGrid(WALK[kind]),walk=withObstacles(terrain,villageObstacles(art,s.town.shops.filter(shop=>art.lots[shop.id])));
    const shops=shopsFor(kind).filter(shop=>shopLevel(s,shop.id)>0).map(shop=>({id:shop.id,point:art.lots[shop.id].guest,icon:SHOP_ART[shop.id].icon}));
    artReady.then(()=>{
      if(!alive||root.villageArtReady!==artReady)return;
      stage.dataset.artReady='true';loaded();
      stopLife=startLife({root,stage,entries,walk,shops,rng:ctx.lifeRng?.next,still:ctx.still,reduced:reduced.matches});
    });
  }
  function showHighlight() {
    const resident=residents(s,ctx.units).find(r=>r.id===highlight);if(!resident)return;
    const where=whereToday(s,ctx.units,ctx.today).where[highlight];
    if(where.place==='shop'||where.place==='yard'){
      const node=[...stage.querySelectorAll('.resident')].find(n=>n.dataset.id===highlight);
      const p=where.place==='shop'?art.lots[where.shop].work[where.seat-1]:plazaPoint(kind,art,where.spot);
      center(p);if(reduced.matches)shine(node);else later(()=>shine(node),500);
    }else if(where.place==='house'){center(art.houses[where.house]);openCard(resident,where);}
    else openCard(resident,where);
  }
  const motionChange=()=>render();
  reduced.addEventListener('change',motionChange);
  const observer=new ResizeObserver(fit);
  animate(()=>{
    render();fit();observer.observe(root);
  });
  if(s.town.refunded>0){
    const refunded=s.town.refunded; s.town.refunded=0;ctx.save();
    const note=h('p',{class:'refund-note pill',role:'status'},'꾸미기 물건 값으로 '+money+' '+refunded+'개를 돌려받았어요');
    root.append(note);later(()=>note.remove(),6500);
  }
  ctx.cleanup=()=>{alive=false;stopLife();stopImages();observer.disconnect();close();timers.forEach(clearTimeout);frames.forEach(cancelAnimationFrame);reduced.removeEventListener('change',motionChange);};
  return root;
}
