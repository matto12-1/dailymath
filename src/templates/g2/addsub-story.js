import { define, seq, unique, until, wrong, errors, fill } from './helpers.js?v=9a67f36b25';
import { arithmeticWords } from './helpers.js?v=9a67f36b25';
import { placeSteps,j } from '../solution-process.js?v=9a67f36b25';

const adds=seq(30,88).filter(n=>n%10!==9), subs=seq(11,79).filter(n=>n%10!==0);
export default define({id:'g2.addsub.story',unit:'g2s1-addsub',strand:'word',level:4,label:'붙임딱지 모으고 나누기',std:['[2수01-05]','[2수01-06]']}, {
  range:{min:0,max:99},operandRange:{min:0,max:99},answerSpan:unique([...adds,...subs]),errorCount:3,
  texts:['{question}'],
  draw(rng){
    const add=rng.pick([true,false]),target=rng.pick(add?adds:subs),direction=rng.pick([-1,1]);
    const {a,b}=until(()=>{
      const b=rng.int(11,add?target-11:99-target),a=add?target-b:target+b;
      return add?(a%10&&b%10&&a%10+b%10>=10?{a,b}:null):(a%10<b%10?{a,b}:null);
    });
    return {a,b,add,target,
      question:fill(add?'붙임딱지를 {a}개 모았습니다. {b}개를 더 모으면 모두 몇 개일까요?':'붙임딱지가 {a}개 있습니다. {b}개를 주면 몇 개가 남을까요?',{a,b}),
      explanation:a+(add?' + ':' − ')+j(b,'을/를')+' 계산합니다.\n'+placeSteps(a,b,!add).join('\n')+fill(add?'\n따라서 붙임딱지는 모두 {target}개입니다.':'\n따라서 남은 붙임딱지는 {target}개입니다.',{target}),
      ...errors(
        wrong(target+10,add?'받아올림 두 번 더하기':'받아내린 십 빼먹기',add?`받아올림한 1을 십의 자리에 두 번 더했습니다. ${arithmeticWords(a,b).carryTwiceFact}`:`받아내림을 하고도 십의 자리를 ${Math.floor(a/10)} 그대로 계산했습니다. ${arithmeticWords(a,b,true).borrowFact}`),
        wrong(target-10,add?'받아올림 빠뜨리기':'받아내림 두 번 하기',add?`받아올림한 1을 십의 자리에 더하지 않았습니다. ${arithmeticWords(a,b).tensFact}`:`십의 자리에서 1을 두 번 받아내렸습니다. ${arithmeticWords(a,b,true).borrowTwiceFact}`),
        !add&&target%10!==5?wrong(Math.floor(a/10)*10-Math.floor(b/10)*10+b%10-a%10,'일의 자리 거꾸로 빼기',`일의 자리에서 큰 수 ${b%10}에서 작은 수 ${a%10}을 뺐습니다. ${arithmeticWords(a,b,true).onesFact}`):wrong(target+direction,'일의 자리 하나 달리 세기',`일의 자리를 1 ${direction>0?'크게':'작게'} 계산했습니다. ${arithmeticWords(a,b,!add).onesFact}`))};
  },
  requiredChoices:({a,b,add})=>add?[a+b-10]:a%10+10-b%10===5?[]:[Math.floor(a/10)*10-Math.floor(b/10)*10+b%10-a%10],
  candidates:({a,b,add})=>add?seq(Math.max(a,b)+1,99):seq(0,a-1),
  answer:({a,b,add})=>add?a+b:a-b,
  check:({a,b,add})=>add?(Math.floor(a/10)+Math.floor(b/10)+1)*10+(a%10+b%10-10):(Math.floor(a/10)-1-Math.floor(b/10))*10+(a%10+10-b%10),
  art:({add})=>({scene:add?'sticker-collect':'sticker-share'}),solution:'{explanation}',
});
