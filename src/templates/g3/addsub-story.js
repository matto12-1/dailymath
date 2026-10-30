import {define,wrong,errors} from './helpers.js?v=9a67f36b25';
import {bank,onesCarry,tensCarry,plusCheck,onesBorrow,tensBorrow,minusCheck,reverseSubtract,additionAt,subtractionAt} from './arithmetic-helpers.js?v=9a67f36b25';
const plus=bank(100,999,100,999,(a,b)=>onesCarry(a,b)&&tensCarry(a,b)&&a+b<=999,(a,b)=>a+b);
const minus=bank(100,999,100,999,(a,b)=>a>b&&onesBorrow(a,b)&&tensBorrow(a,b),(a,b)=>a-b);
export default define({id:'g3.addsub.story',unit:'g3s1-addsub',strand:'word',level:5,label:'도서관 책 덧셈과 뺄셈 이야기',std:['[4수01-03]']},{
  input:'number',errorCount:3,maxDigits:3,range:{min:0,max:1998},answerSpan:[...new Set([...plus.answers,...minus.answers])],back:'g2s1-addsub',answerUnit:'권',
  texts:['{question}'],
  draw(rng){const subtract=rng.pick([true,false]),{a,b}=(subtract?minus:plus).draw(rng),item=rng.pick(['책','그림책','동화책']);
    return {a,b,item,subtract,question:subtract?`도서관에 ${item} ${a}권이 있습니다. ${b}권을 빌려주었습니다. 남은 책은 몇 권일까요?`:`도서관에 ${item} ${a}권이 있습니다. ${b}권을 더 샀습니다. 모두 몇 권일까요?`,sign:subtract?'−':'+',resultText:subtract?'남은 책은':'책은 모두',...errors(...(subtract?[
      wrong(a-b+10,'십의 자리에서 받아내린 1 빼기 빠뜨리기',`일의 자리로 받아내림하고도 십의 자리를 줄이지 않아 ${a-b+10}이 되었습니다. ${subtractionAt(a,b,1)}`),
      wrong(reverseSubtract(a,b),'자리마다 큰 숫자에서 작은 숫자 빼기',`받아내림하지 않고 자리마다 큰 숫자에서 작은 숫자를 빼서 ${reverseSubtract(a,b)}이 되었습니다. ${subtractionAt(a,b,0)}`),
      wrong(a-b-(a-b)%10+a%10,'일의 자리 빼기 빠뜨리기',`일의 자리에서 빼지 않고 ${a%10}을 그대로 써서 ${a-b-(a-b)%10+a%10}권이라고 했습니다. 받아내림한 일의 자리에서 ${b%10}을 빼고 나머지 자리도 계산하면 ${a-b}권입니다.`)
    ]:[
      wrong(a+b-10,'십의 자리 받아올림 빠뜨리기',`일의 자리에서 십의 자리로 받아올린 1을 더하지 않아 ${a+b-10}이 되었습니다. ${additionAt(a,b,1)}`),
      wrong(a+b-100,'백의 자리 받아올림 빠뜨리기',`십의 자리에서 백의 자리로 받아올린 1을 더하지 않아 ${a+b-100}이 되었습니다. ${additionAt(a,b,2)}`)
    ]))};},
  answer:({a,b,subtract})=>subtract?a-b:a+b,
  check:({a,b,subtract})=>subtract?minusCheck(a,b):plusCheck(a,b),
  art:()=>({scene:'library-shelves'}),
  solution:"{a} {sign} {b} = {answer}입니다.\n따라서 {resultText} {answer}권입니다.",
});
