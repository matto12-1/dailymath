import { explain, j, say } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong,seq} from './helpers.js?v=9a67f36b25';
export default define(meta('patterns','calculation',2,'calc',['02-02'],'계산식 배열의 규칙'),{
  input:'number',maxDigits:12,back:'g3s1-multiplication',
  texts:['같은 규칙으로 계산하면 마지막 식의 값은 얼마일까요?','같은 규칙으로 계산하면 마지막 식의 값은 얼마일까요?'],
  // 계산식 배열은 글 대신 한 줄에 식 하나씩 상자에 둔다(검수 10번).
  numberRow:v=>({lines:[...v.given.split(', '),`${v.question} = ?`]}),
  // 검수 A2-19: 1이 늘어나는 곱은 시작 줄을 바꿔(1 × 1부터, 둘째 줄부터, 줄 둘·셋) 세 가지뿐이던 문제를 일곱 가지로 늘린다.
  draw: explain(function(rng) {const square=rng.int(0,1)===1,n=square?rng.int(3,6):rng.int(3,6),d=rng.int(11,19),start=square&&n>3?rng.pick([Math.max(1,n-3),n-2]):n-2,base=k=>Number((square?'1':'9').repeat(k)),a=base(n),result=square?a*a:a*d,previous=square?base(n-1)**2:base(n-1)*d;
    const missing=square?Number(Array.from({length:n-1},(_,i)=>i+1).join('')+Array.from({length:n-1},(_,i)=>n-1-i).join('')):previous*10;
    return {square,n,d,a,result,given:seq(start,n-1).map(k=>`${base(k)} × ${square?base(k):d} = ${square?base(k)**2:base(k)*d}`).join(', '),question:`${a} × ${square?a:d}`,...errors(
      wrong(missing,square?'가운데 가장 큰 숫자 빠뜨리기':'앞 계산의 10배만 쓰기',square
        ? `가운데 가장 큰 숫자를 빠뜨려 ${missing}을 썼습니다. 빠진 가운데 숫자 ${n}을 넣어 ${String(result).split('').join(', ')} 순서로 쓰면 ${result}입니다.`
        : `앞의 계산값에 0만 붙여 ${missing}을 썼습니다. ${previous*10}에 새로 늘어난 9와 ${d}의 곱 ${9*d}을 더하면 ${result}입니다.`),
      wrong(square?Number(String(result).replace(String(n),String(n)+String(n))):previous*10+d,square?'가운데 숫자 두 번 쓰기':'늘어난 숫자를 1로 보기',square
        ? `가운데 숫자를 두 번 써서 ${String(result).replace(String(n),String(n)+String(n))}을 썼습니다. 가운데 숫자 ${n}을 한 번만 쓰면 ${result}입니다.`
        : `${previous*10}에 ${d}만 더해 ${previous*10+d}을 썼습니다. 새로 늘어난 숫자는 9이므로 ${9*d}을 더하면 ${result}입니다.`))};}, v => v.square
    ? ['1이 '+v.n+'개인 수끼리 곱하면 가운데까지 1부터 '+v.n+'까지 커졌다가 1까지 작아지는 숫자가 나옵니다.', '가운데 숫자는 '+v.n+'이고 숫자를 '+String(v.result).split('').join(', ')+' 순서로 씁니다.']
    : v.n===3
    ? [j(v.a+' × '+v.d,'은/는')+' '+v.a+' × 10과 '+j(v.a+' × '+(v.d-10),'을/를')+' 더한 값입니다.', v.a+' × 10 = '+v.a*10+', '+v.a+' × '+(v.d-10)+' = '+v.a*(v.d-10)+'입니다.', v.a*10+' + '+v.a*(v.d-10)+' = '+v.result+'입니다.']
    : ['곱해지는 수에 9가 하나 늘 때마다 곱은 '+j(v.d-1,'과/와')+' '+(100-v.d)+' 사이에 9가 하나씩 늘어납니다.', '이번에는 그 사이에 9를 '+(v.n-2)+'개 씁니다.']),
  answer:v=>v.result,check:v=>Number(BigInt(v.a)*BigInt(v.square?v.a:v.d)),
  solution: "{process}\n따라서 {question} = {answer:입니다}.",
});
