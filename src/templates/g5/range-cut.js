import {define,meta,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
const cases=[];for(let c=10;c<=50;c+=5)for(let q=2;q<=15;q++)for(let r=1;r<c;r++)if(r!==q&&q*c+r<=1000)cases.push({c,A:q*c+r});
const answer=v=>Math.floor(v.A/v.c);
export default define(meta('range','cut',4,'word',['01-03'],'완성되는 끈 수'),{
 input:'number',answerUnit:'개',back:'g4s1-multiply-divide',texts:['끈 {A} cm를 {c} cm씩 자릅니다. {c} cm짜리 끈은 최대 몇 개 생길까요?','길이가 {A} cm인 끈에서 {c} cm짜리 끈은 최대 몇 개 만들 수 있을까요?'],
 ...casesSpec(cases,answer,v=>{let left=v.A,n=0;while(left>=v.c){left-=v.c;n++;}return n;},v=>({...v,r:v.A%v.c,...errors(wrong(Math.floor(v.A/v.c)+1,'짧은 나머지도 한 개로 세기','남은 {r} cm도 완성된 끈 1개로 세었습니다. 나머지 {r} cm는 {c} cm보다 짧으므로 몫만 세면 최대 {answer}개입니다.'),wrong(v.A%v.c,'남은 길이 답하기','완성된 끈 수 대신 남은 길이 {r:을/를} 답했습니다. 나머지 대신 {A} ÷ {c}의 몫을 구하면 최대 {answer}개입니다.'))})),
 art:()=>({scene:'cord-cutting'}),solution:'{A} ÷ {c}의 몫은 {answer}, 나머지는 {r:입니다}. 나머지 {r} cm는 {c} cm보다 짧습니다.\n따라서 {c} cm짜리 끈은 최대 {answer}개 만들 수 있습니다.',
});
