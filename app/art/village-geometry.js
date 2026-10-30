import { HOUSE_ART, PROP_ART, SHOP_ART, SIGN_ART } from './assets.js?v=9a67f36b25';
import { BASES } from './bases.js?v=9a67f36b25';
import { RESIDENT_HEIGHT_RATIO } from '../../src/game/village-pan.js?v=9a67f36b25';

const HEIGHT = Object.fromEntries([...Object.entries(PROP_ART).map(([id,a])=>[id,a.height]), ...Object.entries(HOUSE_ART).map(([id,a])=>['house-'+id,a.height])]);

// Sizes use stage-width units; anchors use stage percentages. Rendering and
// walking share this calculation, including each painting's off-centre base.
export function sceneGeometry({box,height,point,base},aspect=1) {
  const size=height*100/(box.b-box.t),cx=base?.x??(box.l+box.r)/200,foot=base?1-base.y:(100-box.b)/100;
  return {size,width:size*(box.r-box.l)/100,height,cx,foot,bounds:{
    l:point.x+size*(box.l/100-cx),r:point.x+size*(box.r/100-cx),
    t:point.y+size*(box.t/100-(1-foot))/aspect,b:point.y+size*(box.b/100-(1-foot))/aspect,
  }};
}
export function shopShape(art,id,level) {
  const info=SHOP_ART[id],box=info.boxes[level-1],base=info.bases[level-1];
  return {src:info.src[level-1],box,height:art.shopScale*info.canvas*(box.b-box.t)/100,point:art.lots[id],base:{x:base.x/info.canvas,y:base.y/info.canvas}};
}
export function houseShape(art,id) {
  const info=HOUSE_ART[id],point=art.houses[id];
  return {src:info.src,box:info.box,height:point.height??info.height,point,base:{x:info.base.x/info.canvas,y:info.base.y/info.canvas}};
}
// The widest adult body on either island, without changing resident sizes.
export function residentHalfWidth(art) {
  return Math.max(...Object.values(BASES.residents).flatMap(rows=>Object.values(rows)).map(b=>
    RESIDENT_HEIGHT_RATIO*100*art.h/art.w*(b.r-b.l)/(b.b-b.t)/2));
}
export function buildingBounds(art,shops=[],padding=0) {
  return [...shops.filter(s=>s.level>0).map(s=>({id:s.id,shape:shopShape(art,s.id,s.level)})),
    ...Object.keys(art.houses).map(id=>({id:'house-'+id,shape:houseShape(art,id)}))].map(({id,shape})=>{
      const b=sceneGeometry(shape,art.h/art.w).bounds;return {id,...b,l:b.l-padding,r:b.r+padding};
    });
}
// Whole built paintings; unbuilt signs and props keep their lower footprint.
export function villageObstacles(art,shops=Object.keys(art.lots).map(id=>({id,level:3}))) {
  const built=new Set(shops.filter(s=>s.level>0).map(s=>s.id));
  return [
    ...buildingBounds(art,shops,residentHalfWidth(art)),
    ...Object.entries(art.lots).filter(([id])=>!built.has(id)).map(([id,p])=>({id,...footprint(art,p,'sign')})),
    ...art.props.map(p => ({ id:p.id, ...footprint(art,p,p.id) })),
  ];
}
// The visible base occupies the bottom fifth of the painted bounds. A tree's
// crown is wider than its trunk; foliage may overhang a path.
export function footprint(art, point, id) {
  const info = id==='sign'?SIGN_ART:id.startsWith('house-') ? HOUSE_ART[id.slice(6)] : PROP_ART[id];
  const height = point.height ?? info.height ?? HEIGHT[id], b = info.box;
  const width = height * (b.r - b.l) / (b.b - b.t);
  return { x: point.x, y: point.y - height * .1 * art.w / art.h,
    rx: width * (id === 'tree' ? .18 : .4), ry: height * .1 * art.w / art.h };
}
