import {numeric,meta,cart,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv1','zero',3,'calc',['01-15'],'몫 중간의 영'),{
 answerKind:'decimal',back:'g4s2-decimal-addsub',cases:cart({q:seq(1,9),r:seq(1,9),d:seq(2,9)}).map(v=>({...v,A:(v.q*100+v.r)*v.d})),
 texts:['〔{left} ÷ {d} = ?〕계산하면 얼마일까요?'],
 answer:v=>dec(v.A/v.d,2),check:v=>dec(v.q*100+v.r,2),decorate:v=>({left:dec(v.A,2),padded:(v.A/100).toFixed(2),tenths:Math.floor(v.r*v.d/10)}),
 errors:v=>[wrong(dec(v.q*10+v.r,1),'중간 영 빠뜨리기','몫의 소수 첫째 자리 0을 빼고 {value:으로/로} 썼습니다. 소수 첫째 자리에서 나눌 수 {tenths:은/는} {d}보다 작으므로 그 자리에 0을 쓰면 {answer:입니다}.'),wrong(String(v.A/v.d),'소수점 빠뜨리기','{padded} 대신 {A:을/를} {d:으로/로} 나누고 몫의 소수점을 찍지 않았습니다. {padded:은/는} {A}의 1/100배이므로 자연수 나눗셈의 몫도 1/100배 하면 {answer:입니다}.')],
 solution:'{padded:은/는} {A}의 1/100배이므로 {padded} ÷ {d}의 몫은 {A} ÷ {d} = {q}0{r}의 1/100배입니다.\n소수 첫째 자리에서 나눌 수 {tenths:은/는} {d}보다 작으므로 몫의 소수 첫째 자리에 0을 씁니다.\n따라서 답은 {answer:입니다}.',
});
