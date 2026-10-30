import {define,seq,pair,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define({id:'g3.weightcup.cupsum',unit:'g3s2-weight-capacity',strand:'calc',level:3,label:'들이의 합',std:['[4수03-19]']},{
  input:'number',answerKind:'pair',parts:[{after:'L'},{after:'mL'}],errorCount:2,
  texts:['〔{a} L {b} mL + {c} L {d} mL = ?〕계산하면 몇 L 몇 mL일까요?'],
  draw(rng){const a=rng.int(1,4),c=rng.int(1,4),b=rng.pick(seq(100,950,50)),d=rng.pick(seq(100,950,50));if(b+d<=1000)return null;
    return {a,b,c,d,both:b+d,liters:a+c,L:a+c+1,mL:b+d-1000,...errors(
      wrong(pair(a+c,b+d),'mL에서 L로 바꾸기 빠뜨리기',`${b+d} mL를 바꾸지 않아 ${a+c} L ${b+d} mL라고 했습니다. ${b+d} mL는 1 L ${b+d-1000} mL이므로 합은 ${a+c+1} L ${b+d-1000} mL입니다.`),
      wrong(pair(a+c,b+d-1000),'L에 올린 1 빠뜨리기',`받아올린 1 L를 더하지 않아 ${a+c} L ${b+d-1000} mL라고 했습니다. ${a+c} L에 1 L를 더하면 ${a+c+1} L ${b+d-1000} mL입니다.`))};},
  answer:({L,mL})=>pair(L,mL),check:({a,b,c,d})=>{const n=(a+c)*1000+b+d;return pair(Math.floor(n/1000),n%1000);},
  solution:'mL끼리 더하면 {b} mL + {d} mL = {both} mL이고, {both} mL는 1 L {mL} mL입니다.\nL끼리 더한 값에 받아올린 1 L도 더하면 {a} + {c} + 1 = {L} L입니다.\n따라서 합은 {L} L {mL} mL입니다.',
});
