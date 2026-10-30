import { h } from '../ui.js?v=9a67f36b25';
import { watchSceneImages } from '../backdrop.js?v=9a67f36b25';
import { matchDemoVillageKind } from '../../src/game/village-demo-data.js?v=9a67f36b25';
import { icon } from '../icons.js?v=9a67f36b25';
import { openSheet } from '../sheet.js?v=9a67f36b25';
import { residentImg } from '../art/assets.js?v=9a67f36b25';
import { residents, whereToday } from '../../src/game/village.js?v=9a67f36b25';
import { ACTIVITY, residentLine } from '../../src/game/village-life.js?v=9a67f36b25';
import { SHOPS } from '../../src/game/shops.js?v=9a67f36b25';

const placeName=where=>where?.place==='house'?(where.house==='small'?'작은 집':'큰 집'):where?.place==='yard'?'광장':where?.place==='shop'?SHOPS.find(s=>s.id===where.shop).name:'산책 중';

function cardContent(ctx,resident,where) {
  const kind=ctx.state.town.kind,[,month,day]=resident.date.split('-'),activity=ACTIVITY[kind][resident.look.variant],line=residentLine(ctx.state,ctx.units,resident);
  return [
    h('span',{class:'resident-portrait','data-baby':String(resident.look.baby)},h('img',{src:residentImg(kind,resident.look.variant),alt:'',width:384,height:384})),
    h('strong',{class:'resident-name'},resident.name),
    h('span',{class:'resident-date'},Number(month)+'월 '+Number(day)+'일에 이사 왔어요'),
    resident.unit&&h('span',{class:'resident-unit'},resident.grade+'학년 '+resident.semester+'학기 · '+resident.title),
    h('span',{class:'resident-work'},h('b',{},'늘 하는 일 '),activity.what),
    h('span',{class:'resident-hint'},line.text),
    !(where?.place === 'yard' && line.text.includes('광장')) && h('span',{class:'resident-place pill'},placeName(where)),
  ];
}

export function residentCard(ctx,resident,where=whereToday(ctx.state,ctx.units,ctx.today).where[resident.id],{onShop}={}) {
  const line=residentLine(ctx.state,ctx.units,resident),shop=SHOPS.find(s=>s.id===line.action?.shop);
  let close;
  const action=shop&&h('button',{class:'pill resident-shop',onclick:()=>{
    close();if(onShop)onShop(shop.id);else ctx.go('village',{shop:shop.id});
  }},shop.name+(line.action.type==='build'?' 짓기':' 보기'));
  close=openSheet(document.getElementById('app'),{label:resident.name,className:'card-sheet'},
    h('div',{class:'resident-detail','data-id':resident.id},...cardContent(ctx,resident,where),action));
  return close;
}

export function residentsScreen(ctx) {
  if (ctx.demo) matchDemoVillageKind(ctx.state);
  const all=residents(ctx.state,ctx.units),today=whereToday(ctx.state,ctx.units,ctx.today);
  let closeSheet=null;
  const root=h('section',{class:'screen cards-screen'},
    h('header',{class:'cards-top'},h('button',{class:'back pill',onclick:()=>ctx.go('village')},icon('back'),'마을로'),
      h('h1',{},'우리 마을 주민'),h('span',{class:'resident-count pill'},all.length+'마리')),
    h('div',{class:'resident-grid'},...[...all].reverse().map(resident=>h('button',{
      class:'resident-card','data-id':resident.id,'aria-label':resident.name+' 크게 보기',onclick:()=>{
        closeSheet?.();closeSheet=residentCard(ctx,resident,today.where[resident.id]);
      }},...cardContent(ctx,resident,today.where[resident.id])))));
  const stopImages=watchSceneImages(document.getElementById('app'));
  ctx.cleanup=()=>{stopImages();closeSheet?.();};return root;
}
