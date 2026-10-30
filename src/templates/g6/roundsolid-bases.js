import {numeric,meta,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('roundsolid','bases',3,'shape',['03-07'],'밑면의 개수'),{
 cases:[{type:'cylinder',bases:2},{type:'cone',bases:1},{type:'sphere',bases:0}],back:'g5s2-cuboids',
 texts:['이 입체도형의 밑면은 {hidden}몇 개일까요?','이 입체도형에서 밑면을 모두 세면 몇 개일까요?'],
 answer:v=>v.bases,check:v=>({cylinder:2,cone:1,sphere:0})[v.type],decorate:(v,rng)=>({hidden:v.type==='sphere'?'':'숨은 것까지 ',solidName:({cylinder:'원기둥',cone:'원뿔',sphere:'구'})[v.type],description:v.type==='sphere'?'구에는 평평한 면이 없습니다.':v.type==='cylinder'?'원기둥에는 서로 평행한 원 모양의 면이 있습니다.':'원뿔에는 원 모양의 면과 굽은 면이 있습니다.',orientation:0,stretch:[rng.int(8,11)/10,rng.int(8,11)/10]}),
 errors:v=>[wrong(v.bases+1,'굽은 면도 밑면으로 세기','굽은 면까지 밑면으로 세었습니다. 평평한 원 모양의 면만 세면 {solidName}의 밑면은 {answer}개입니다.'),wrong(v.type==='cylinder'?1:v.type==='cone'?0:2,'다른 입체의 밑면 수로 답하기',v.type==='cylinder'?'원기둥의 밑면을 하나만 세었습니다. 뒤에 가려진 원 모양의 밑면 하나도 더하면 밑면은 {answer}개입니다.':v.type==='cone'?'원뿔의 원 모양 밑면을 빼고 세었습니다. 빠뜨린 원 모양의 면을 밑면으로 세면 {answer}개입니다.':'구를 원기둥처럼 보고 밑면이 두 개라고 세었습니다. 구에는 평평한 면이 없으므로 밑면은 {answer}개입니다.')],
 art:v=>({kind:'solid',type:v.type,equator:false,orientation:v.orientation,stretch:v.type==='sphere'?[1,1]:v.stretch,wide:true}),solution:'{description}\n따라서 {solidName}의 밑면은 {answer}개입니다.',
});
