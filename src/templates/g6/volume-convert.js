import {numeric,meta,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('volume','convert',3,'calc',['03-18'],'부피 단위 바꾸기'),{
 answerUnit:v=>v.reverse?'m³':'cm³',cases:seq(1,30).flatMap(a=>[false,true].map(reverse=>({a,reverse}))),back:'g5s1-perimeter-area',
 texts:['{question}'],
 answer:v=>v.reverse?v.a:v.a*1000000,check:v=>v.reverse?v.a*1000000/100/100/100:v.a*100*100*100,
 decorate:v=>({question:v.reverse?'〔'+v.a*1000000+' cm³ = ? m³〕빈칸에 알맞은 수는 얼마일까요?':'〔'+v.a+' m³ = ? cm³〕빈칸에 알맞은 수는 얼마일까요?',calculation:!v.reverse&&v.a===1?'':v.reverse?v.a*1000000+' ÷ 1000000 = '+v.a+' m³입니다.':v.a+' × 1000000 = '+v.a*1000000+' cm³입니다.'}),
 errors:v=>v.reverse?[wrong(v.a*100,'넓이처럼 만으로 나누기','부피를 넓이 단위처럼 10000으로만 나누었습니다. 1 m³는 1000000 cm³이므로 주어진 부피를 1000000으로 나누면 {answer} m³입니다.'),wrong(v.a*10000,'길이처럼 백으로 나누기','부피를 길이 단위처럼 100으로만 나누었습니다. 가로, 세로, 높이가 각각 100분의 1이므로 부피를 100 × 100 × 100으로 나누면 {answer} m³입니다.')]:[wrong(v.a*10000,'넓이처럼 만 배 하기','넓이 단위처럼 {a}에 10000을 곱했습니다. 높이도 100배이므로 {a} × 100 × 100 × 100 = {answer} cm³입니다.'),wrong(v.a*100,'길이처럼 백 배 하기','길이 단위처럼 {a}에 100을 곱했습니다. 가로뿐 아니라 세로와 높이도 100배 하므로 {a} × 100 × 100 × 100 = {answer} cm³입니다.')],
 solution:'1 m = 100 cm이므로 1 m³ = 100 cm × 100 cm × 100 cm = 1000000 cm³입니다. {calculation}\n따라서 답은 {answer:입니다}.',
});
