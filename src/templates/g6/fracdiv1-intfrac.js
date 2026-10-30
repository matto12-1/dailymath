import {numeric,meta,cart,seq,wrong,f,fractionSteps,fill} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv1','intfrac',1,'calc',['01-10'],'자연수 나눗셈을 분수로'),{
 answerKind:'fraction',minMistakes:2,cases:cart({a:seq(1,11),d:seq(2,12),form:[0,1]}).filter(v=>v.a<v.d),
 texts:['{question}'],decorate:v=>({question:v.form?`〔${v.a} ÷ ${v.d} = ?〕몫은 얼마일까요?`:fill('〔{a} ÷ {d}〕몫을 분수로 나타내면 얼마일까요?',v),steps:fractionSteps(v.a,v.d)}),
 answer:v=>f(v.a,v.d),check:v=>f(v.a*2,v.d*2),
 errors:v=>[wrong(f(v.d,v.a),'분자와 분모 바꾸기','{a} ÷ {d}에서 분자와 분모를 바꾸어 {value:을/를} 썼습니다. 나누어지는 수 {a:을/를} 분자, 나누는 수 {d:을/를} 분모로 쓰면 {answer:입니다}.'),wrong(0,'나머지 버리기','{a:을/를} {d:으로/로} 나눌 때 남은 양을 버려 {value:을/를} 썼습니다. 남은 양 {a:을/를} {d:으로/로} 나눈 값을 분수로 나타내면 {answer:입니다}.')],
 solution:'1 ÷ {d} = 1/{d:입니다}.\n{a} ÷ {d:은/는} 1/{d:이/가} {a}개인 수입니다.\n따라서 답은 {answer:입니다}.',
});
