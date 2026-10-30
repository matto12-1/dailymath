import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
// 검수 A2-22: 「몇 억」 답 칸 뒤에 「억」(반대 방향은 「조」)을 붙이고, 풀이는 조를 억으로 바꾸는 줄과 더하는 줄로 나눈다.
// 검수 A2-17: 실수가 하나뿐이던 반대 방향(억 → 조)에 「단위를 바꾸지 않고 그대로 쓰기」를 더한다.
export default define(meta('large','trillion',2,'calc',['01-01'],'조와 억 바꾸기'),{
  input:'number',answerUnit:v=>v.reverse?'조':'억',texts:['{question}'],
  draw(rng){const a=rng.int(1,8),b=rng.int(1,9),reverse=rng.int(0,2)===0,answer=reverse?a:a*10000+b*1000,eok=a*10000;
    return {a,b,reverse,result:answer,question:reverse?`〔${eok}억 = ? 조〕빈칸에 알맞은 수는 얼마일까요?`:rng.pick([`〔${a}조 ${b*1000}억 = ? 억〕빈칸에 알맞은 수는 얼마일까요?`,`〔조가 ${a}개〕〔억이 ${b*1000}개〕모두 모은 수는 몇 억일까요?`]),...errors(
      wrong(reverse?a*10:a*1000+b*1000,'세 자리마다 단위 바꾸기',reverse?`1조를 1000억으로 보아 ${a*10}조라고 했습니다. 10000억이 1조이므로 ${eok}억은 ${a}조입니다.`:`1조를 1000억으로 보아 ${a*1000+b*1000}억이라고 했습니다. 1조는 10000억이므로 ${eok}억에 ${b*1000}억을 더하면 ${answer}억입니다.`),
      reverse?wrong(eok,'단위를 바꾸지 않기',`${eok}억을 조로 바꾸지 않고 ${eok}조라고 했습니다. ${eok}억에는 10000억이 ${a}개 있으므로 ${a}조입니다.`):wrong(a*100000+b*1000,'0의 개수 혼동',`1조를 100000억으로 보아 ${a*100000+b*1000}억이라고 했습니다. 1조는 10000억이므로 ${a}조 ${b*1000}억은 ${answer}억입니다.`)),
      eok,conclusion:reverse?`${eok}억은 ${a}조입니다.`:`${a}조 ${b*1000}억은 ${answer}억입니다.`,explanation:reverse?`1조는 10000억입니다.\n${eok}억은 10000억이 ${a}개입니다.`
        :`${a===1?'1조는 10000억입니다.':`1조는 10000억이므로 ${a}조는 ${eok}억입니다.`}\n${eok}억과 ${b*1000}억을 더하면 ${answer}억입니다.`};},
  answer:v=>v.result,check:v=>v.reverse?Number(BigInt(v.a)*1000000000000n/1000000000000n):Number((BigInt(v.a)*1000000000000n+BigInt(v.b)*100000000000n)/100000000n),
  solution:"{explanation}\n따라서 {conclusion}",
});
