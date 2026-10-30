import {numeric,meta,cart,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
const hundredths=v=>Math.floor(1000*v.a/v.B),tenths=v=>Math.floor((hundredths(v)+5)/10);
export default numeric(meta('decimaldiv2','round',3,'estimate',['01-15'],'소수 몫 반올림하기'),{
 answerKind:'decimal',back:'g5s2-range-rounding',cases:cart({a:seq(1,30),B:[3,6,7,9]}).filter(v=>100*v.a%v.B!==0&&tenths(v)%10!==0),
 texts:['〔{a} ÷ {right}〕몫을 반올림하여 소수 첫째 자리까지 쓰면 얼마일까요?'],
 answer:v=>dec(tenths(v),1),check:v=>dec(Math.round(v.a*100/v.B),1),decorate:v=>({right:dec(v.B,1),raw:dec(hundredths(v),2),digit:hundredths(v)%10,description:hundredths(v)%10>=5?'5 이상이므로 올립니다':'5보다 작으므로 버립니다'}),
 errors:v=>[wrong(dec(Math.floor(100*v.a/v.B)+(hundredths(v)%10>=5?0:1),1),'반올림 대신 버림이나 올림하기',hundredths(v)%10>=5?'소수 둘째 자리 숫자 {digit:은/는} 5 이상인데 버려 {value:을/를} 썼습니다. 소수 둘째 자리 숫자 {digit:은/는} 5 이상이므로 첫째 자리를 하나 올리면 {answer:입니다}.':'소수 둘째 자리 숫자 {digit:은/는} 5보다 작은데 올렸습니다. 소수 둘째 자리 숫자 {digit:은/는} 5보다 작으므로 둘째 자리 아래를 버리면 {answer:입니다}.'),wrong(String(Math.round(v.a*10/v.B)),'자연수까지 반올림하기','소수 첫째 자리까지가 아니라 자연수까지 반올림하여 {value:을/를} 썼습니다. 몫 {raw}…에서 소수 둘째 자리 {digit:을/를} 보고 첫째 자리까지 반올림하면 {answer:입니다}.')],
 solution:'{a} ÷ {right} = {raw}…입니다.\n몫의 소수 둘째 자리 숫자는 {digit:입니다}. {description}.\n따라서 몫을 반올림하여 소수 첫째 자리까지 나타내면 {answer:입니다}.',
});
