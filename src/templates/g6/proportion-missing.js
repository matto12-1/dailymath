import {numeric,meta,cart,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('proportion','missing',2,'calc',['02-04'],'비례식의 빈 수'),{
 cases:cart({a:seq(1,12),b:seq(2,12),k:seq(2,10)}).filter(v=>v.a!==v.b),back:'g5s1-correspondence',
 texts:['〔{a} : {b} = □ : {d}〕□에 알맞은 수는 몇일까요?', '〔□ : {d} = {a} : {b}〕□에 알맞은 수는 몇일까요?'],
 answer:v=>v.a*v.k,check:v=>v.a*(v.b*v.k)/v.b,decorate:v=>({d:v.b*v.k,product:v.a*v.b*v.k}),
 errors:v=>[wrong(v.a+v.b*v.k-v.b,'같은 차만 더하기','후항이 늘어난 만큼 전항에도 더했습니다. 후항 {b}에 {k:을/를} 곱한 {d:이/가} 되었으므로 전항도 {a} × {k} = {answer:입니다}.'),...(v.b*v.b*v.k%v.a===0?[wrong(v.b*v.b*v.k/v.a,'내항과 외항의 짝 혼동','{b} × {d:을/를} 계산하고 {a:으로/로} 나누었습니다. 외항의 곱과 내항의 곱이 같으므로 □와 곱해지는 {b:으로/로} {a} × {d:을/를} 나누면 {answer:입니다}.')]:[wrong(v.a*v.b*v.k,'곱한 뒤 나누지 않기','{a} × {d}만 계산하고 {b:으로/로} 나누지 않았습니다. □와 곱해지는 {b:으로/로} 반대쪽 곱 {product:을/를} 나누면 {answer:입니다}.')])],
 solution:'비례식에서 외항의 곱과 내항의 곱은 같으므로 □ × {b} = {a} × {d} = {product:입니다}. □ = {product} ÷ {b} = {answer:입니다}.\n따라서 답은 {answer:입니다}.',
});
