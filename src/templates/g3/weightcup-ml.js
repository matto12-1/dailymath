import {define,seq,errors,wrong} from './helpers.js?v=9a67f36b25';
import {cycle} from './arithmetic-helpers.js?v=9a67f36b25';
const values=seq(110,290,10).filter(n=>n%100);
export default define({id:'g3.weightcup.ml',unit:'g3s2-weight-capacity',strand:'life',level:1,label:'들이 눈금 읽기',std:['[4수03-17]']},{
  input:'number',answerUnit:'mL',range:{min:0,max:1000},answerSpan:values,errorCount:2,
  texts:['그릇에 든 {object:은/는} 몇 mL일까요?'],
  draw(rng){const n=cycle(rng,'weightcup-ml',values),step=rng.pick([10,20,50].filter(s=>n%s===0)),base=Math.floor(n/100)*100,ticks=(n-base)/step;
    return {n,step,base,ticks,divisions:100/step,slip:base+ticks,object:rng.pick(['물','주스','우유','차']),...errors(wrong(base,'아래 큰 눈금 읽기','작은 눈금을 세지 않고 아래 큰 눈금 {base} mL를 읽었습니다. 작은 눈금 한 칸은 {step} mL이고 {base} mL에서 {ticks}칸 더 갔으므로 {n} mL입니다.'),wrong(base+ticks,'한 칸을 1로 세기','한 칸을 1 mL로 세어 {slip} mL라고 했습니다. 한 칸은 {step} mL이므로 {base} mL에서 {ticks}칸 더 간 곳은 {n} mL입니다.'))};},
  answer:({n})=>n,check:({base,ticks,step})=>base+ticks*step,
  art:({n,step,object})=>({kind:'cup',ml:n,max:300,step,labelStep:100,object}),
  solution:'큰 눈금 한 칸 100 mL가 작은 눈금 {divisions}칸으로 나뉘어 있으므로 작은 눈금 한 칸은 {step} mL입니다.\n{base} mL에서 작은 눈금 {ticks}칸 더 간 곳을 읽습니다.\n따라서 {object:은/는} {answer} mL입니다.',
});
