import {numeric,meta,cart,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('volume','unitcube',2,'shape',['03-18','03-19'],'단위 정육면체로 부피 구하기'),{
 answerUnit:'cm³',cases:cart({a:seq(2,6),b:seq(2,6),c:seq(2,6)}).filter(v=>v.a*v.b!==v.c),
 texts:['한 모서리의 길이가 1 cm인 쌓기나무로 직육면체를 쌓았습니다. 이 직육면체의 부피는 몇 cm³일까요?','한 모서리의 길이가 1 cm인 쌓기나무로 직육면체를 쌓았습니다. 이 직육면체의 부피는 몇 cm³일까요?'],
 answer:v=>v.a*v.b*v.c,check:v=>Array(v.c).fill(v.a*v.b).reduce((s,n)=>s+n,0),decorate:v=>({layer:v.a*v.b}),
 errors:v=>[wrong(v.a*v.b,'한 층만 세기','한 층의 쌓기나무 {layer}개만 세었습니다. 한 층 {layer}개에 층수 {c:을/를} 곱하면 부피는 {answer} cm³입니다.'),wrong(v.a*v.b+v.b*v.c+v.c*v.a-v.a-v.b-v.c+1,'겉에 보이는 정육면체만 세기','겨냥도에서 보이는 쌓기나무만 세었습니다. 안쪽과 뒤쪽까지 한 층에 {a} × {b}개씩 {c}층을 세면 부피는 {answer} cm³입니다.')],
 art:v=>({kind:'solid',type:'cuboid',edgeLengths:[v.a,v.b,v.c],unitGrid:true,noLabels:true,wide:true}),solution:'쌓기나무가 한 층에 {a} × {b} = {layer}개씩 {c}층이므로 {layer} × {c} = {answer}개입니다. 쌓기나무 한 개의 부피는 1 cm³입니다.\n따라서 직육면체의 부피는 {answer} cm³입니다.',
});
