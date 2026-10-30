import {errors,wrong,tableArt,fill} from './helpers.js?v=9a67f36b25';
export function holds(v,c){
 const m=c.match(/^([□△]) = ([□△]) ([×÷+−]) (\d+)$/);if(!m)return false;
 return v.rows.every(([x,y])=>{const a=m[1]==='□'?x:y,b=m[2]==='□'?x:y,k=Number(m[4]);return a===({'×':()=>b*k,'÷':()=>b/k,'+':()=>b+k,'−':()=>b-k}[m[3]])();});
}
export const equationSpec=(operations=['multiply','addition'])=>({
 answerKind:'text',minMistakes:2,errorCount:2,back:'g4s2-patterns-equations',texts:['표의 두 양 사이의 대응 관계를 나타낸 식은 어느 것일까요?'],
 draw(rng){
  const multiply=rng.pick(operations)==='multiply',k=rng.int(2,12),x=rng.int(2,10),rows=[x,x+1,x+2].map(n=>[n,multiply?n*k:n+k]),inverse=rng.next()<.5,j=k+rng.pick([-1,1]),op=multiply?'×':'+',undo=multiply?'÷':'−';
  const equation=(left,right,operation,n)=>left+' = '+right+' '+operation+' '+n;
  const correct=inverse?equation('□','△',undo,k):equation('△','□',op,k);
  // 같은 숫자가 정답에만 몰리지 않게 셋 또는 두 보기씩 나눈다.
  // 정방향 식도 둘 이상 두어 기호나 시작 글자만 고르는 요령을 막는다.
  const reversed=inverse?equation('△','□',undo,k):equation('□','△',op,k);
  const changed=inverse?equation('□','△',op,j):equation('△','□',op,j);
  const filler=inverse?equation('△','□',op,j):equation('△','□',undo,k);
  const options=[correct,reversed,changed,filler];
  if(new Set(options).size!==4||options.filter(c=>holds({rows},c)).length!==1)return null;
  return {k,j,rows,multiply,correct:0,options,rule:fill(multiply?'표에서 △는 □의 {k}배입니다.':'표에서 △는 □보다 {k} 큽니다.',{k})+(inverse?fill(multiply?' □를 구하려면 △를 {k:으로/로} 나눕니다.':' □를 구하려면 △에서 {k:을/를} 뺍니다.',{k}):''),...errors(
   wrong(reversed,'두 양 거꾸로 쓰기','「'+reversed+'」를 골라 □와 △의 관계를 거꾸로 읽었습니다. '+fill(multiply?'△는 □의 {k}배이므로 바른 식은 「{correct}」입니다.':'△는 □보다 {k} 크므로 바른 식은 「{correct}」입니다.',{k,correct})),
   wrong(changed,'연산과 변화량 혼동','「'+changed+'」를 골라 표의 변화량이나 연산을 잘못 읽었습니다. '+fill(inverse?(multiply?'△에서 □를 구할 때는 {k:으로/로} 나누므로 「{correct}」입니다.':'△에서 □를 구할 때는 {k:을/를} 빼므로 「{correct}」입니다.'):(multiply?'□에 {k:을/를} 곱해야 표의 모든 쌍과 맞으므로 「{correct}」입니다.':'□에 {k:을/를} 더해야 표의 모든 쌍과 맞으므로 「{correct}」입니다.'),{k,correct})))};
 },
 answer:v=>v.options[v.correct],check:v=>v.options.find(c=>holds(v,c)),isCorrect:holds,
 art:v=>tableArt([['□',...v.rows.map(r=>r[0])],['△',...v.rows.map(r=>r[1])]]),
 solution:'{rule}\n따라서 대응 관계를 나타낸 식은 {answer:입니다}.',
});
