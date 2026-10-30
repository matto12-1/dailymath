import {numeric,meta,cart,seq,wrong,dec} from './helpers.js?v=9a67f36b25';
export default numeric(meta('decimaldiv1','story',3,'word',['01-15'],'리본 똑같이 나누기'),{
 answerKind:'decimal',cycleBy:'d',answerUnit:'m',cases:cart({A:seq(1,89),d:seq(2,9)}).filter(v=>v.A>=v.d&&v.A%10!==0&&v.A*10%v.d===0),
 texts:['리본 {left} m를 {d}명에게 똑같이 나누어 줍니다. 한 명은 몇 m를 받을까요?','리본 {left} m를 {d}명이 똑같이 나누면 한 명은 몇 m를 받을까요?'],
 answer:v=>dec(v.A*10/v.d,2),check:v=>dec((v.A%v.d)*10/v.d+Math.floor(v.A/v.d)*10,2),decorate:v=>({left:dec(v.A,1)}),
 errors:v=>[wrong(dec(v.A*10/v.d,1),'소수점 되돌리지 않기','{left} 대신 {A:을/를} {d:으로/로} 나눈 몫을 그대로 {value:으로/로} 썼습니다. {left:은/는} {A}의 1/10배이므로 {A} ÷ {d}의 몫도 1/10배 하면 {answer} m입니다.'),wrong(dec(v.A*v.d,1),'나누기 대신 곱하기','리본의 길이 {left} m에 사람 수 {d:을/를} 곱하여 {value:을/를} 썼습니다. 전체 길이 {left} m를 사람 수 {d:으로/로} 나누면 한 명이 받는 길이는 {answer} m입니다.')],
 art:()=>({scene:'craft'}),solution:'{left} ÷ {d} = {answer:입니다}. {answer} × {d} = {left:으로/로} 확인합니다.\n따라서 한 명이 받는 리본은 {answer} m입니다.',
});
