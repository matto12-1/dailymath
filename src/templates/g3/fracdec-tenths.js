import { define, wrong, errors, fill } from './helpers.js?v=9a67f36b25';
import { dec } from '../../engine/answer.js?v=9a67f36b25';
// 검수 A2-7·A2-8: 수는 식 상자에 크게 두고, 「2와 0.1이 5개」처럼 「이」를 넣어 수끼리 떨어지게 쓴다.
// 자연수 부분이 0이면 자연수 말을 하지 않고, 「0.1이 1개」처럼 답이 글에 그대로 있는 문제는 내지 않는다.
// 실수는 가장 흔한 「소수점 빠뜨리기(25)」와, 소수 부분을 자연수로 본 실수만 둔다. 분수가 없는 문제에서는 분수로 말하지 않는다.
export default define({id:'g3.fracdec.tenths',unit:'g3s1-fractions-decimals',strand:'calc',level:3,label:'분모가 10인 분수와 소수',std:['[4수01-12]']},{
  input:'number',answerKind:'decimal',errorCount:2,
  texts:['{question}'],
  draw(rng){const w=rng.int(0,3),n=rng.int(1,9),fraction=`${n}/10`,part=dec(n,1),answer=dec(w*10+n,1);
    const form=rng.pick(['fraction','tenths',...(w?['join']:[])].filter(f=>!(f==='tenths'&&n===1)));
    const box={fraction:w?fill('{w:과/와} {fraction}',{w,fraction}):fraction,tenths:w?fill('{w:과/와} 0.1이 {n}개',{w,n}):`0.1이 ${n}개`,join:fill('{w:과/와} {part}',{w,part})}[form];
    const ask='상자의 수를 소수로 나타내면 얼마일까요?';
    const first=form==='fraction'&&n===1?'1/10은 0.1이라고 씁니다.':form==='fraction'?fill('1/10은 0.1입니다. {fraction:은/는} 0.1이 {n}개인 수입니다.',{fraction,n}):n===1?fill('{w:과/와} {part}만큼인 수입니다.',{w,part}):fill('0.1이 {n}개인 수는 {part:입니다}.',{n,part});
    const last=fill('소수점 왼쪽에 {w:을/를}, 오른쪽에 {n:을/를} 씁니다.',{w,n});
    const seen={fraction:'{fraction:을/를} 자연수 {n:으로/로}',tenths:'0.1이 {n}개인 것을 {n:으로/로}',join:'{part:을/를} {n:으로/로}'}[form];
    return {w,n,fraction,part,question:`〔${box}〕${ask}`,explanation:`${first}\n${last}`,
      ...errors(wrong(String(w*10+n),'소수점 빠뜨리기',`소수점을 빠뜨려 ${w*10+n}을 썼습니다. 소수점 왼쪽에 ${w}, 오른쪽에 ${n}을 쓰면 ${answer}입니다.`),
        w?wrong(String(w+n),'소수 부분을 자연수로 보기',`${n===1?`${part}을 ${n}으로`:`0.1이 ${n}개인 것을 ${n}으로`} 보고 더하여 ${w+n}을 썼습니다. ${n===1?`${part}만큼은 1이 아니므로`:`0.1이 ${n}개인 수는 ${part}이므로`} ${w}와 ${part}만큼인 수는 ${answer}입니다.`):wrong(dec(n,2),'소수점을 한 자리 왼쪽에 쓰기',`소수점 자리를 한 자리 왼쪽으로 옮겨 ${dec(n,2)}을 썼습니다. ${n===1?'1/10은 소수 첫째 자리에 1을 쓰므로':`0.1이 ${n}개인 수는 소수 첫째 자리에 ${n}을 쓰므로`} ${answer}입니다.`))};},
  answer:({w,n})=>dec(w*10+n,1),check:({w,n})=>`${w}.${n}`,
  solution:"{explanation}\n따라서 상자의 수를 소수로 나타내면 {answer:입니다}.",
});
