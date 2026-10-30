import {numeric,meta,cart,seq,wrong,dec,tableArt} from './helpers.js?v=9a67f36b25';
export default numeric(meta('circlearea','pi',1,'life',['03-15'],'측정한 원주와 지름의 비'),{
 answerKind:'decimal',cases:cart({d:seq(3,40),offset:seq(0,4)}).map(v=>({d:v.d,C:Math.round(v.d*31.4)+v.offset-2})).filter(v=>v.C*10%v.d!==0&&Math.round(v.C*10/v.d)!==Math.floor(v.C*10/v.d)),
 texts:['표에서 측정한 원주를 지름으로 나눈 값을 반올림하여 소수 둘째 자리까지 나타내면 얼마일까요?','표에서 측정한 원주를 지름으로 나눈 값을 반올림하여 소수 둘째 자리까지 나타내면 얼마일까요?'],
 answer:v=>dec(Math.round(v.C*10/v.d),2),check:v=>dec(Math.floor((v.C*1000/v.d+50)/100),2),decorate:v=>({digit:Math.floor(v.C*100/v.d)%10,circumference:dec(v.C,1),unrounded:dec(Math.floor(v.C*10000/v.d),5)+(v.C*10000%v.d?'…':'')}),
 errors:v=>[wrong(dec(Math.floor(v.C*10/v.d),2),'소수 셋째 자리에서 버리기','소수 셋째 자리에서 버려 {value:을/를} 썼습니다. 셋째 자리 숫자 {digit:은/는} 5 이상이므로 둘째 자리를 하나 올리면 {answer:입니다}.'),wrong(dec(Math.round(v.C/v.d),1),'소수 첫째 자리까지 반올림하기','소수 첫째 자리까지만 반올림하여 {value:을/를} 썼습니다. 첫째 자리가 아니라 둘째 자리까지 남기고 셋째 자리 {digit:을/를} 보고 반올림하면 {answer:입니다}.')],
 art:v=>({...tableArt([['지름(cm)','측정 원주(cm)'],[v.d,v.circumference]]),columnWidths:[145,165]}),solution:'원주를 지름으로 나누면 {circumference} ÷ {d} = {unrounded:입니다}.\n소수 셋째 자리 숫자 {digit:은/는} 5 이상이므로 소수 둘째 자리를 하나 올립니다.\n따라서 반올림하여 소수 둘째 자리까지 나타내면 {answer:입니다}.',
});
