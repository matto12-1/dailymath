import { define, seq, pair, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({id:'g3.weightcup.sum',unit:'g3s2-weight-capacity',strand:'calc',level:3,label:'무게의 합',std:['[4수03-23]']},{
  input:'number',answerKind:'pair',parts:[{after:'kg'},{after:'g'}],errorCount:2,
  texts:['〔{a} kg {b} g + {c} kg {d} g = ?〕계산하면 몇 kg 몇 g일까요?'],
  draw(rng){const a=rng.int(1,4),c=rng.int(1,4),b=rng.pick(seq(100,950,50)),d=rng.pick(seq(100,950,50));if(b+d<=1000)return null;
    return {a,b,c,d,both:b+d,kg:a+c+1,g:b+d-1000,
      ...errors(wrong(pair(a+c,b+d),'g에서 kg으로 바꾸기 빠뜨리기',`${b+d} g을 바꾸지 않아 ${a+c} kg ${b+d} g라고 했습니다. ${b+d} g은 1 kg ${b+d-1000} g이므로 합은 ${a+c+1} kg ${b+d-1000} g입니다.`),wrong(pair(a+c,b+d-1000),'kg에 올린 1 빠뜨리기',`받아올린 1 kg을 더하지 않아 ${a+c} kg ${b+d-1000} g라고 했습니다. ${a+c} kg에 1 kg을 더하면 ${a+c+1} kg ${b+d-1000} g입니다.`))};},
  answer:({kg,g})=>pair(kg,g),check:({a,b,c,d})=>{const total=a*1000+b+c*1000+d;return pair(Math.floor(total/1000),total%1000);},
  solution:'g끼리 더하면 {b} g + {d} g = {both} g이고, {both} g은 1 kg {g} g입니다.\nkg끼리 더한 값에 받아올린 1 kg도 더하면 {a} + {c} + 1 = {kg} kg입니다.\n따라서 합은 {kg} kg {g} g입니다.',
});
