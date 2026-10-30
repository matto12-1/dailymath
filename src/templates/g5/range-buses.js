import {define,meta,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
const cases=[];for(const c of [20,25,30,35,40,45])for(let q=1;q<=15;q++)for(let r=1;r<c;r++)if(r!==q&&q*c+r<=1000)cases.push({c,A:q*c+r});
const answer=v=>Math.ceil(v.A/v.c);
export default define(meta('range','buses',4,'word',['01-03'],'모두 타기 위한 버스 수'),{
 input:'number',answerUnit:'대',back:'g4s1-multiply-divide',texts:['{A}명이 버스를 탑니다. 한 대에 {c}명까지 타면 최소 몇 대가 필요할까요?','한 대에 {c}명까지 타는 버스로 {A}명이 이동합니다. 버스는 최소 몇 대일까요?'],
 ...casesSpec(cases,answer,v=>{let seats=0,n=0;while(seats<v.A){seats+=v.c;n++;}return n;},v=>({...v,q:Math.floor(v.A/v.c),r:v.A%v.c,...errors(wrong(Math.floor(v.A/v.c),'남은 사람 생각하지 않기','{q}대로는 남은 {r}명이 타지 못합니다. 남은 사람도 탈 한 대를 더하면 {q} + 1 = {answer}대입니다.'),wrong(v.A%v.c,'나머지를 버스 수로 답하기','남은 사람 수 {r:을/를} 버스 수로 답했습니다. 나머지는 사람 수이므로 몫 {q}에 한 대를 더하면 {answer}대입니다.'))})),
 art:()=>({scene:'bus-stop'}),solution:'{A} ÷ {c}의 몫은 {q}, 나머지는 {r:입니다}. 남은 {r}명도 타려면 버스가 한 대 더 필요합니다.\n따라서 필요한 버스는 최소 {answer}대입니다.',
});
