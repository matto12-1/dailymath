import {numeric,meta,cart,seq,gcd,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('proportion','story',3,'word',['02-05'],'사탕 비례배분하기'),{
 answerUnit:'개',cases:cart({a:seq(2,7),b:seq(2,7),k:seq(2,10),target:[0,1]}).filter(v=>v.a!==v.b&&gcd(v.a,v.b)===1).map(v=>({...v,A:(v.a+v.b)*v.k})).filter(v=>v.A<=200),
 texts:['사탕 {A}개를 가 모둠과 나 모둠에 {a} : {b:으로/로} 비례배분합니다. {group}이 받는 사탕은 몇 개일까요?','사탕 {A}개를 가 모둠과 나 모둠에 {a} : {b:으로/로} 비례배분하면 {group}이 받는 사탕은 몇 개일까요?'],
 answer:v=>v.k*(v.target?v.b:v.a),check:v=>v.A/(v.a+v.b)*(v.target?v.b:v.a),decorate:v=>({s:v.a+v.b,one:v.k,part:v.target?v.b:v.a,group:v.target?'나 모둠':'가 모둠',otherGroup:v.target?'가 모둠':'나 모둠'}),
 errors:v=>[wrong(v.k*(v.target?v.a:v.b),'반대로 배분하기','{group} 대신 {otherGroup}이 받는 사탕 수를 구하여 {value:을/를} 썼습니다. {group}에 해당하는 부분을 구하면 {A} × {part}/{s} = {answer}개입니다.'),wrong(v.k,'한 부분의 사탕만 답하기','사탕 {A}개를 {s:으로/로} 나눈 {one}개만 답했습니다. {group}은 한 부분의 크기 {one}개의 {part}배를 받으므로 {one} × {part} = {answer}개입니다.')],
 art:()=>({scene:'candy-ratio'}),solution:'전항과 후항의 합은 {a} + {b} = {s:입니다}. {A} × {part}/{s} = {answer:입니다}.\n따라서 {group}이 받는 사탕은 {answer}개입니다.',
});
