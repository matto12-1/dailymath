import {numeric,meta,cart,seq,wrong} from './helpers.js?v=9a67f36b25';
export default numeric(meta('ratio','story',3,'word',['02-03'],'도서관에 간 학생 비율'),{
 answerUnit:'%',cases:cart({A:[20,25,40],a:seq(1,39)}).filter(v=>v.a<v.A&&100*v.a%v.A===0&&v.a*2!==v.A&&v.a!==100*v.a/v.A),
 texts:['전체 학생 {A}명 중 {a}명이 도서관에 갔습니다. 전체 학생 수에 대한 도서관에 간 학생 수의 비율은 몇 %일까요?','{group} 학생 {A}명 중 {a}명이 도서관에 갔습니다. 전체 학생 수에 대한 도서관에 간 학생 수의 비율은 몇 %일까요?'],
 decorate:v=>({group:v.A<=25?'우리 반':'6학년'}),
 answer:v=>100*v.a/v.A,check:v=>v.a*(100/v.A),
 errors:v=>[wrong(100*(v.A-v.a)/v.A,'가지 않은 학생의 비율 구하기','도서관에 가지 않은 학생 수의 비율을 구했습니다. 간 학생 수 {a:을/를} 전체 학생 수 {A:으로/로} 나눈 뒤 100을 곱하면 {answer}%입니다.'),wrong(v.a,'학생 수를 그대로 답하기','도서관에 간 학생 수 {a:을/를} 그대로 썼습니다. 학생 수 {a}명을 전체 {A}명에 대한 백분율로 바꾸면 {a} ÷ {A} × 100 = {answer}%입니다.')],
 art:()=>({scene:'library-visitors'}),solution:'비교하는 양은 도서관에 간 학생 수 {a}명이고 기준량은 전체 학생 수 {A}명입니다. {a} ÷ {A} × 100 = {answer:입니다}.\n따라서 전체 학생 수에 대한 도서관에 간 학생 수의 비율은 {answer}%입니다.',
});
