import {define,meta,errors,wrong,frac} from './helpers.js?v=9a67f36b25';
export default define(meta('reduce','equivalent',1,'calc',['01-06'],'지정한 분모로 바꾸기'),{
 input:'number',answerKind:'fraction',mixedInput:true,exactForm:true,
 texts:['〔{left}〕분모가 {D}인 분수로 나타내면 무엇일까요?', '〔{left}〕크기가 같고 분모가 {D}인 분수는 무엇일까요?'],
 draw(rng){const d=rng.int(2,12),a=rng.int(1,d-1),k=rng.int(2,5);return {a,d,k,D:d*k,left:frac(0,a,d),n:a*k,...errors(wrong(frac(0,a,d*k),'분모만 곱하기','분모 {d}에만 {k:을/를} 곱했습니다. 분자에도 {k:을/를} 곱하면 {n}/{D:이/가} 되므로 답은 {answer:입니다}.'),wrong(frac(0,a*k,d),'분자만 곱하기','분자 {a}에만 {k:을/를} 곱했습니다. 분모에도 같은 {k:을/를} 곱하여 {D:으로/로} 바꾸면 {answer:입니다}.'))};},
 answer:v=>frac(0,v.a*v.k,v.D),check:v=>frac(0,v.a*(v.D/v.d),v.D),
 solution:'분모 {d}에 {k:을/를} 곱하면 {D:입니다}. 분자도 {a} × {k} = {n:으로/로} 바꿉니다.\n따라서 답은 {answer:입니다}.',
});
