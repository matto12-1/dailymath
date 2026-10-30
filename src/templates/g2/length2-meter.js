import { define, seq, sum, wrong, errors, fill } from './helpers.js?v=9a67f36b25';

export default define({id:'g2.length2.meter',unit:'g2s2-length',strand:'life',level:1,label:'m와 cm 바꾸기',std:['[2수03-10]','[2수03-11]']},{
  range:{min:1,max:900},operandRange:{min:0,max:1000},differentDigits:true,errorCount:3,answerSpan:[...seq(2,9),...seq(2,9).map(n=>n*100)],
  texts:['{question}'],
  draw(rng){const m=rng.int(2,9),reverse=rng.pick([true,false]),direction=rng.pick([-1,1]),factor=reverse?1:100;
    const counted=(n,label)=>wrong(n>=2&&n<=9?n*factor:null,label,`${reverse?'100 cm':'1 m'}를 ${n}번 세었습니다. ${n<m?'빠뜨린 '+(m-n)+'번까지 넣어':'더 센 '+(n-m)+'번을 빼고'} ${m}번으로 세면 ${reverse?m+' m':m*100+' cm'}입니다.`);
    return {m,reverse,question:rng.pick(reverse?[`${m*100} cm는 몇 m일까요?`,`${m*100} cm를 m로 나타내면 몇 m일까요?`]:[`${m} m는 몇 cm일까요?`,`${m} m를 cm로 나타내면 몇 cm일까요?`]),
      explanation:reverse?`100 cm는 1 m입니다.\n${m*100} cm는 100 cm가 ${m}번입니다.\n따라서 ${m*100} cm는 ${m} m입니다.`:`1 m는 100 cm입니다.\n${m} m는 1 m가 ${m}번입니다.\n따라서 ${m} m는 ${m*100} cm입니다.`,
      ...errors(counted(m-1,'1 m 덜 세기',`${reverse?'100 cm':'1 m'}를 ${m-1}번 세었습니다. ${reverse?m*100+' cm에는 100 cm가':m+' m에는 1 m가'} ${m}번 들어 있으므로 ${reverse?m+' m':m*100+' cm'}입니다.`),
      counted(m+1,'1 m 더 세기',`${reverse?'100 cm':'1 m'}를 ${m+1}번 세었습니다. ${reverse?m*100+' cm에는 100 cm가':m+' m에는 1 m가'} ${m}번 들어 있으므로 ${reverse?m+' m':m*100+' cm'}입니다.`),
      counted(m+direction*2,'1 m 두 번 달리 세기',`${reverse?'100 cm':'1 m'}를 ${m+direction*2}번 세었습니다. ${reverse?m*100+' cm에는 100 cm가':m+' m에는 1 m가'} ${m}번 들어 있으므로 ${reverse?m+' m':m*100+' cm'}입니다.`))};},
  candidates:({reverse})=>seq(2,9).map(n=>n*(reverse?1:100)),
  answer:({m,reverse})=>reverse?m:m*100,check:({m,reverse})=>reverse?sum(...Array(m).fill(1)):sum(...Array(m).fill(100)),
  art:({m,reverse})=>reverse?({kind:'ruler',lengths:[{value:m*100,label:m*100+' cm'}],hundredMarks:true,fontSize:22}):({kind:'ruler',segments:m,unitLabel:'m',caption:'1 m = 100 cm'}),solution:'{explanation}',
});
