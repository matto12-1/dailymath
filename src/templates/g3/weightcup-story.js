import { define, seq, pair, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({id:'g3.weightcup.story',unit:'g3s2-weight-capacity',strand:'word',level:3,label:'물의 양 빼기',std:['[4수03-19]']},{
  input:'number',answerKind:'pair',parts:[{after:'L'},{after:'mL'}],errorCount:2,back:'g2s1-addsub',
  texts:['물 {start}에서 {c} L {d} mL를 썼습니다. 남은 물은 몇 L 몇 mL일까요?'],
  draw(rng){const a=rng.int(3,9),c=rng.int(1,a-2),b=rng.pick(seq(0,900,50)),d=rng.pick(seq(b+50,950,50));return {a,b,c,d,borrow:a-1,milliliters:1000+b,start:`${a} L${b?` ${b} mL`:''}`,L:a-c-1,mL:1000+b-d,delta:d-b,unborrowed:a-c,
    ...errors(wrong(pair(a-c,d-b),'각 칸 큰 수에서 작은 수 빼기',`mL끼리 거꾸로 빼서 ${a-c} L ${d-b} mL라고 했습니다. ${a} L ${b} mL를 ${a-1} L ${1000+b} mL로 바꾸어 빼면 ${a-c-1} L ${1000+b-d} mL입니다.`),wrong(pair(a-c,1000+b-d),'빌려 준 1 L 안 빼기',`1 L를 받아내림하고도 줄이지 않아 ${a-c} L ${1000+b-d} mL라고 했습니다. L끼리는 ${a-1} − ${c} = ${a-c-1}이므로 ${a-c-1} L ${1000+b-d} mL입니다.`))};},
  answer:({L,mL})=>pair(L,mL),check:({a,b,c,d})=>{const total=1000*a+b-(1000*c+d);return pair(Math.floor(total/1000),total%1000);},
  art:()=>({scene:'water-container'}),solution:'{b} mL에서 {d} mL를 뺄 수 없으므로 {start}를 {borrow} L {milliliters} mL로 바꿉니다.\n{milliliters} − {d} = {mL}, {borrow} − {c} = {L}입니다.\n따라서 남은 물은 {L} L {mL} mL입니다.',
});
