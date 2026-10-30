import {numeric,meta,cart,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('proportion','product',2,'calc',['02-04'],'자연수가 아닌 배율의 비례식'),{
 cases:cart({a:seq(2,12),b:seq(2,20),c:seq(2,30)}).filter(v=>v.c%v.a!==0&&v.b*v.c%v.a===0&&v.a!==v.b),back:'g5s1-correspondence',
 texts:['〔{a} : {b} = {c} : □〕□에 알맞은 수는 몇일까요?', '〔{c} : □ = {a} : {b}〕□에 알맞은 수는 몇일까요?'],
 answer:v=>v.b*v.c/v.a,check:v=>Array(v.c).fill(v.b).reduce((s,n)=>s+n,0)/v.a,decorate:v=>({product:v.b*v.c}),
 errors:v=>[wrong(v.b+v.c-v.a,'차를 같게 맞추기',v.c>v.a?'전항이 {a}에서 {c:으로/로} 늘어난 만큼 후항에도 더했습니다. 외항의 곱과 내항의 곱이 같으므로 {b} × {c} ÷ {a} = {answer:입니다}.':'전항이 {a}에서 {c:으로/로} 줄어든 만큼 후항에서도 뺐습니다. 외항의 곱과 내항의 곱이 같으므로 {product:을/를} {a:으로/로} 나누면 {answer:입니다}.'),...(v.a*v.c%v.b===0?[wrong(v.a*v.c/v.b,'내항과 외항의 짝 혼동','{a} × {c:을/를} 계산하고 {b:으로/로} 나누었습니다. □와 곱해지는 {a:으로/로} 반대쪽 {b} × {c:을/를} 나누면 {answer:입니다}.')]:[wrong(v.b*v.c,'곱한 뒤 나누지 않기','{b} × {c}만 계산했습니다. 빠뜨린 나눗셈까지 계산하면 {product} ÷ {a} = {answer:입니다}.')])],
 solution:'비례식에서 외항의 곱과 내항의 곱은 같으므로 {a} × □ = {b} × {c} = {product:입니다}. □ = {product} ÷ {a} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
