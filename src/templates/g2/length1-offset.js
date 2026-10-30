import { explain, say } from '../solution-process.js?v=9a67f36b25';
import { define, seq, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.length1.offset","unit":"g2s1-length","strand":"life","level":3,"label":"중간에서 길이 재기","std":["[2수03-10]"]}, {

  range:{min:0,max:15},operandRange:{min:0,max:15},answerSpan:seq(2,8),errorCount:3,
  texts:['막대의 길이는 몇 cm일까요?'],
  // 채움 보기는 답이 될 수 있는 2~8이다. 끝 눈금(9 이상)까지 채움으로 끼면 9가 늘 오답으로만 나왔다(검수 2번).
  candidates:seq(2,8),
  draw: explain(function(rng) {const n=rng.int(2,8),from=rng.int(2,6),to=from+n;
    return {n,from,to,...errors(
    wrong(to,'끝 눈금만 읽기',`막대가 끝나는 눈금만 읽었습니다. 시작이 눈금 0이 아니므로 끝 눈금 ${to}에서 ${from}을 빼면 ${n} cm입니다.`),
    wrong(from,'시작 눈금만 읽기',`막대의 시작 눈금을 답으로 골랐습니다. 시작 눈금의 수 대신 두 끝 눈금 ${to}와 ${from} 사이를 재면 ${n} cm입니다.`)
    ,wrong(n-1,'한 칸 빠뜨리기',`시작부터 끝까지 세면서 한 칸을 빠뜨렸습니다. 빠뜨린 칸까지 모두 세면 길이는 ${n} cm입니다.`))};}, v => ['막대의 한쪽 끝은 눈금 '+v.from+', 다른 쪽 끝은 눈금 '+v.to+'에 있습니다.', '두 눈금 사이의 길이는 ' + v.to + ' − ' + v.from + ' = ' + say(v.n)]),
  answer:({to,from})=>to-from,check:({to,from})=>seq(from,to-1).length,
  art:({n,from,to})=>({kind:'ruler',cm:Math.max(10,to+1),from,to}),
  solution: "{process}\n따라서 길이는 {answer} cm입니다.",
});
