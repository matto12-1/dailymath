import {define,seq,product,wrong,errors,fill} from './helpers.js?v=9a67f36b25';
const bags=new WeakMap();
function factor(rng){let bag=bags.get(rng);if(!bag?.length){bag=rng.shuffle([...Array(7).fill(0),...Array(13).fill(1)]);bags.set(rng,bag);}return bag.pop();}
export default define({id:'g2.times.zeroone',unit:'g2s2-times',strand:'calc',level:3,label:'0과 1의 곱',std:['[2수01-11]']},{
 range:{min:0,max:9},operandRange:{min:0,max:9},errorCount:3,answerSpan:seq(0,9),texts:['{question}'],candidates:seq(0,9),
 requiredChoices:({a,b})=>b===0?[a]:a===1?[0,2]:[1],
 draw(rng){const b=factor(rng),a=rng.int(b===0?2:1,9),reverse=rng.pick([true,false]),answer=a*b;
 const pool=b===0?[
 wrong(a,'0을 곱해도 그대로',a+'를 그대로 골랐습니다. 같은 수를 한 번도 더하지 않으므로 곱은 0입니다.'),
 wrong(1,'0의 곱을 1로 보기','0을 곱하면 1이라고 생각했습니다. 0묶음에는 물건이 없으므로 0입니다.'),
 ]:[
 wrong(1,'1을 곱하면 1로 보기','1을 곱하면 답도 1이라고 생각했습니다. '+a+'를 한 번만 더한 수이므로 '+a+'입니다.'),
 wrong(0,'1의 곱을 0으로 보기','1을 곱했는데 0을 골랐습니다. 한 묶음의 수가 그대로 남으므로 '+a+'입니다.'),
 ...(a*2<=9?[wrong(a*2,'한 번 대신 두 번 더하기',a+'를 두 번 더했습니다. 한 번만 더하면 '+a+'입니다.')]:[]),
 ];return {a,b,question:fill(reverse?'〔{b} × {a} = ?〕계산하면 얼마일까요?':'〔{a} × {b} = ?〕계산하면 얼마일까요?',{a,b}),rule:b===0?'같은 수를 0번 더하면 아무것도 남지 않습니다.':'같은 수를 한 번 더하면 그 수 그대로입니다.',...errors(...pool)};},
 answer:({a,b})=>a*b,check:({a,b})=>product(a,b),solution:'{rule}\n따라서 답은 {answer}입니다.',
});
