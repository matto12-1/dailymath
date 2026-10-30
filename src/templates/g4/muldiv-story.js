import {define,meta,seq,cycle,errors,wrong} from './helpers.js?v=9a67f36b25';
// 검수 B-23: 답 칸 뒤에 「개」. 검수 B-32: 답이 글 속 수(한 상자에 담는 권수)와 같으면 베껴 써도 맞으므로 다시 뽑고, 글은 두 문장으로 줄인다.
export default define(meta('muldiv','story',4,'word',['01-07'],'나머지까지 상자에 담기'),{
  input:'number',answerUnit:'개',answerSpan:seq(2,60),back:'g3s2-div',
  texts:['책 {a}권을 한 상자에 {d}권까지 담습니다. 상자는 적어도 몇 개 필요할까요?','한 상자에 책이 {d}권까지 들어갑니다. 책 {a}권을 다 담으려면 상자는 적어도 몇 개 필요할까요?'],
  draw(rng){const answer=cycle(rng,'muldiv-story',seq(2,60)),q=answer-1,d=rng.pick(seq(11,Math.min(99,Math.floor(998/q))).filter(n=>n%10!==0&&n!==answer)),r=rng.int(1,Math.min(d-1,999-d*q)),a=d*q+r;return {a,d,q,r,...errors(
    wrong(q,'남은 책을 담을 상자 빠뜨리기','상자 {q}개에 담고 남은 {r}권을 담을 상자를 빠뜨렸습니다. 남은 {r}권도 상자 1개에 담아야 하므로 상자는 {answer}개 필요합니다.'),wrong(r,'나머지를 상자 수로 답하기','남은 책 {r}권을 필요한 상자 수로 썼습니다. {q}개에 담고 남은 책을 위한 상자 1개를 더하면 {answer}개 필요합니다.'))};},
  answer:({q})=>q+1,check:({a,d})=>Math.ceil(a/d),art:()=>({scene:'library-boxes'}),
  solution:'{a} ÷ {d}의 몫은 {q}, 나머지는 {r:입니다}.\n상자 {q}개에 {d}권씩 담으면 {r}권이 남으므로 상자가 1개 더 필요합니다.\n{q} + 1 = {answer}입니다.\n따라서 상자는 적어도 {answer}개 필요합니다.',
});
