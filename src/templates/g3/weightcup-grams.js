import {define,seq,errors,wrong} from './helpers.js?v=9a67f36b25';
import {cycle} from './arithmetic-helpers.js?v=9a67f36b25';
const values=seq(110,790,10).filter(n=>n%100);
export default define({id:'g3.weightcup.grams',unit:'g3s2-weight-capacity',strand:'life',level:1,label:'저울 눈금 읽기',std:['[4수03-20]']},{
  input:'number',answerUnit:'g',range:{min:0,max:1000},answerSpan:values,errorCount:2,
  texts:['저울에 올린 {object}의 무게는 몇 g일까요?'],
  draw(rng){const n=cycle(rng,'weightcup-grams',values),step=rng.pick([10,20,50].filter(s=>n%s===0)),base=Math.floor(n/100)*100,ticks=(n-base)/step;
    return {n,step,base,ticks,divisions:100/step,slip:base+ticks,object:rng.pick(['사과 봉지','감자 봉지','귤 봉지','바나나 봉지']),...errors(wrong(base,'아래 큰 눈금 읽기','작은 눈금을 세지 않고 아래 큰 눈금 {base} g을 읽었습니다. 작은 눈금 한 칸은 {step} g이고 {base} g에서 {ticks}칸 더 갔으므로 {n} g입니다.'),wrong(base+ticks,'한 칸을 1로 세기','한 칸을 1 g으로 세어 {slip} g라고 했습니다. 한 칸은 {step} g이므로 {base} g에서 {ticks}칸 더 간 곳은 {n} g입니다.'))};},
  answer:({n})=>n,check:({base,ticks,step})=>base+ticks*step,
  art:({n,step,object})=>({kind:'scale',g:n,max:800,step,labelStep:100,object,wide:true}),
  solution:'큰 눈금 한 칸 100 g이 작은 눈금 {divisions}칸으로 나뉘어 있으므로 작은 눈금 한 칸은 {step} g입니다.\n{base} g에서 작은 눈금 {ticks}칸 더 간 곳을 읽습니다.\n따라서 {object}의 무게는 {answer} g입니다.',
});
