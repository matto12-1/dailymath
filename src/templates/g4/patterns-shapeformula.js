import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('patterns','shapeformula',2,'life',['02-01'],'표에서 개수의 식 찾기'),{
  answerKind:'text',errorCount:3,texts:["표는 줄 수에 따른 {object}의 수입니다. {k}줄일 때 {object:은/는} 모두 몇 개인지 구하는 식을 고르시오.","표는 줄 수에 따른 {object}의 수입니다. {k}줄일 때 {object:은/는} 모두 몇 개인지 구하는 식을 고르시오."],
  draw(rng){const a=rng.int(2,8),k=rng.int(5,9),object=rng.pick(['의자','바둑돌']),options=[`${a} × ${k}`,`${a} × ${k-1}`,`${a} + ${k}`,`${a} + ${k-1}`];if(a===k)return null;return {a,k,object,options,...errors(
    wrong(options[1],'한 줄 덜 세기',`${options[1]}을 골랐습니다. ${k-1}줄이 아니라 ${k}줄이므로 알맞은 식은 ${options[0]}입니다.`),
    wrong(options[2],'한 줄 개수와 줄 수 더하기',`한 줄의 개수와 줄 수를 더한 ${options[2]}을 골랐습니다. 한 줄에 ${a}개씩 ${k}줄이므로 ${options[0]}입니다.`),
    wrong(options[3],'한 줄 덜 세고 더하기',`한 줄을 덜 세고 한 줄의 개수와 더한 ${options[3]}을 골랐습니다. ${k-1}줄이 아니라 ${k}줄이므로 ${a}개씩 ${k}줄의 개수를 구하는 식은 ${options[0]}입니다.`)),lessRows:k-1};},
  answer:v=>`${v.a} × ${v.k}`,check:v=>v.options.find(s=>s.includes('×')&&Number(s.split('×')[0])*Number(s.split('×')[1])===v.a*v.k),
  isCorrect:(v,c)=>{const m=/^(\d+) ([×+−]) (\d+)$/.exec(c);if(!m)return false;const a=+m[1],b=+m[3],n=m[2]==='×'?a*b:m[2]==='+'?a+b:a-b;return n===v.a*v.k;},
  art:v=>({kind:'table',rows:[['줄 수',1,2,3],['개수',v.a,v.a*2,v.a*3]],fontSize:20,wide:true}),
  solution:"줄 수가 1씩 늘어날 때마다 {object:은/는} {a}개씩 늘어납니다. 한 줄에 {a}개씩 {k}줄입니다.\n따라서 알맞은 식은 {answer:입니다}.",
});
