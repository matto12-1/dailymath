import {numeric,meta,proper,seq,wrong,f,fractionSteps} from './helpers.js?v=9a67f36b25';
export default numeric(meta('fracdiv1','story',3,'word',['01-11'],'똑같이 나누기'),{
 answerKind:'fraction',answerUnit:v=>v.unit,cases:proper.flatMap(v=>seq(2,5).map(c=>({...v,c}))),
 texts:['{object} {a}/{d} {unit:을/를} {c}명에게 똑같이 나누어 줍니다. 한 명은 몇 {unit:을/를} 받을까요?','{object} {a}/{d} {unit:을/를} {c}명에게 똑같이 나누면 한 명은 몇 {unit:을/를} 받을까요?'],
 answer:v=>f(v.a,v.d*v.c),check:v=>f(v.a*3,v.d*v.c*3),decorate:(v,rng)=>{const [object,unit,scene]=rng.pick([['주스','L','juice-pouring'],['우유','L','juice-pouring'],['물','L','water-container'],['밀가루','kg','flour-baking'],['쌀','kg','grain-sharing'],['끈','m','cord-cutting']]);return {object,unit,scene,D:v.d*v.c,steps:fractionSteps(v.a,v.d*v.c)};},
 errors:v=>[wrong(f(v.a*v.c,v.d),'나누기 대신 곱하기','전체 양을 {c:으로/로} 나누지 않고 곱하여 {value:을/를} 썼습니다. 전체 양 {a}/{d} {unit:을/를} 사람 수 {c:으로/로} 나누면 {answer} {unit}입니다.'),wrong(f(v.a,v.d),'전체 양 답하기','전체의 양을 {value:으로/로} 썼습니다. 한 명이 받는 양은 전체의 1/{c}이므로 {answer} {unit}입니다.')],
 art:v=>({scene:v.scene}),solution:'{c:으로/로} 나누는 것은 1/{c:을/를} 곱하는 것과 같습니다.\n{a}/{d} ÷ {c} = {a}/{d} × 1/{c} = {steps}{stepsEnding}.\n따라서 한 명이 받는 {object:은/는} {answer} {unit}입니다.',
});
