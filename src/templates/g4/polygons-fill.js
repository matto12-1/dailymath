import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('polygons','fill',3,'shape',['03-12'],'삼각형으로 빈 모양 채우기'),{
  input:'number',answerUnit:'개',answerSpan:seq(2,8),errorCount:3,
  texts:["1번과 같은 삼각형으로 2번을 빈틈없이 채우려면 삼각형은 몇 개 필요할까요?","1번과 같은 삼각형으로 2번을 빈틈없이 채우려면 삼각형은 몇 개 필요할까요?"],
  draw(rng){const n=cycle(rng,'polygon-fill',seq(2,8)),scale=rng.int(38,55),mirror=rng.int(0,1)===1;return {n,scale,mirror,explanation:n%2?`2번은 사각형 칸 ${Math.floor(n/2)}개와 반 칸 하나로 되어 있습니다. 사각형 칸에는 ${Math.floor(n/2)} × 2 = ${n-1}개의 삼각형이 들어가고 반 칸에는 1개가 들어갑니다. ${n-1} + 1 = ${n}입니다.`:`2번은 사각형 칸 ${n/2}개로 되어 있고 사각형 칸 하나에는 1번 삼각형 2개가 들어갑니다. ${n/2} × 2 = ${n}입니다.`,...errors(wrong(Math.ceil(n/2),'한 사각 칸을 삼각형 한 개로 세기',`${n%2?'사각형 칸과 반 칸마다':'사각형 칸마다'} 삼각형을 1개씩 세어 ${Math.ceil(n/2)}개라고 했습니다. 사각형 칸 하나에는 2개가 들어가고${n%2?" 반 칸에는 1개가 들어가므로":" 사각형 칸을 모두 채우면"} ${n}개입니다.`),n%2?wrong(n-1,'반 칸 빠뜨리기',`반 칸에 들어갈 삼각형을 빠뜨려 ${n-1}개라고 했습니다. 사각형 칸의 ${n-1}개에 반 칸의 1개도 더하면 ${n}개입니다.`):null,wrong(n*2,'삼각형 한 개를 두 개로 세기',`1번 삼각형을 다시 둘로 나누어 세어 ${n*2}개라고 했습니다. 사각형 칸 하나에는 1번 삼각형 2개가 들어가므로 ${n/2} × 2 = ${n}개입니다.`))};},
  answer:v=>v.n,check:v=>{const whole=Math.floor(v.n/2),half=v.n%2;return whole*2+half;},
  art:v=>({kind:'grid',expand:true,tiling:{n:v.n,scale:v.scale,mirror:v.mirror},wide:true}),
  solution: "{explanation}\n따라서 필요한 삼각형은 {answer}개입니다.",
});
