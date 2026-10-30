import { define, seq, unique, sum, product, wrong, errors, multiplication, products, factCandidates, fill } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.patterns.table","unit":"g2s2-patterns","strand":"life","level":3,"label":"계산표 규칙","std":["[2수02-01]"]}, {

  threeChoices:true,
  range:{min:0,max:81},operandRange:{min:0,max:81},errorCount:3,
  answerSpan:unique([...seq(4,18),...products(seq(2,9),seq(2,9))]),
  texts:['{operation}표의 빈 곳에 들어갈 수는 얼마일까요?'],
  draw(rng){const times=rng.pick([true,false]);if(times){const v=multiplication(rng,seq(2,9),seq(2,9)),cols=v.b===9?[7,8,9]:[v.b-1,v.b,v.b+1];
      for(const e of [v.e1,v.e2,v.e3])if(e&&Number.isInteger(e.value/v.a)&&e.value/v.a>=1&&e.value/v.a<=9&&e.value!==v.a*v.b){e.label='옆 칸 수 그대로 고르기';e.say=`${v.a} × ${e.value/v.a}의 값인 ${e.value}을 골랐습니다. 그 칸에서 ${e.value/v.a<v.b?'오른쪽':'왼쪽'}으로 ${Math.abs(e.value/v.a-v.b)}칸 옮겨 ${v.a} × ${v.b}의 값을 읽으면 ${v.a*v.b}입니다.`;}
      return {...v,times,operation:'곱셈',explanation:fill('곱셈표의 {a}단은 오른쪽으로 한 칸 갈 때마다 {a}씩 커집니다.\n빈칸은 {a} × {b}의 자리이고, {a} × {b} = {answer}입니다.\n따라서 빈칸의 수는 {answer}입니다.',{...v,answer:v.a*v.b})};}
    const a=rng.int(2,9),b=rng.int(2,9),n=a+b;return {a,b,times,operation:'덧셈',explanation:fill('덧셈표는 오른쪽으로 한 칸 갈 때마다 1씩 커집니다.\n빈칸은 {a} + {b}의 자리이고, {a} + {b} = {answer}입니다.\n따라서 빈칸의 수는 {answer}입니다.',{a,b,answer:n}),...errors(
      wrong(n-1,'앞 칸의 합 읽기',`${a}에 ${b-1}을 더한 앞 칸의 값을 골랐습니다. 왼쪽 칸보다 1 큰 값을 읽으면 ${n}입니다.`),
      wrong(n+1,'뒤 칸의 합 읽기',`${a}에 ${b+1}을 더한 뒤 칸의 값을 골랐습니다. 오른쪽 칸보다 1 작은 값을 읽으면 ${n}입니다.`),
      rng.pick([true,false])?wrong(n+2,'두 칸 뒤의 합 읽기',`${a}에 ${b+2}를 더한 값을 골랐습니다. 두 칸 더 간 값에서 2를 줄이면 ${n}입니다.`):wrong(n-2,'두 칸 앞의 합 읽기',`${a}에 ${b-2}를 더한 값을 골랐습니다. 두 칸 덜 간 값에서 2를 늘리면 ${n}입니다.`))};},
  candidates:v=>v.times?factCandidates(v):[...seq(1,9).map(n=>v.a+n),...seq(1,9).map(n=>v.b+n)],
  answer:({a,b,times})=>times?a*b:a+b,check:({a,b,times})=>times?product(a,b):sum(a,b),
  art:({a,b,times})=>{const cols=times&&b===9?[7,8,9]:[b-1,b,b+1];return {kind:'table',fontSize:22,rows:[[times?'×':'+',...cols],[a,...cols.map(c=>c===b?'□':times?a*c:a+c)]]};},
  solution:'{explanation}',
});
