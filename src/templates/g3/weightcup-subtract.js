import {define,seq,pair,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define({id:'g3.weightcup.subtract',unit:'g3s2-weight-capacity',strand:'calc',level:3,label:'무게의 차',std:['[4수03-23]']},{
  input:'number',answerKind:'pair',parts:[{after:'kg'},{after:'g'}],errorCount:2,
  texts:['〔{a} kg {b} g − {c} kg {d} g = ?〕계산하면 몇 kg 몇 g일까요?'],
  draw(rng){const a=rng.int(3,9),c=rng.int(1,a-2),b=rng.pick(seq(0,900,50)),d=rng.pick(seq(b+50,950,50));
    return {a,b,c,d,borrow:a-1,grams:1000+b,kg:a-c-1,g:1000+b-d,...errors(
      wrong(pair(a-c,d-b),'g끼리 거꾸로 빼기',`g끼리 거꾸로 빼서 ${a-c} kg ${d-b} g라고 했습니다. ${a} kg ${b} g을 ${a-1} kg ${1000+b} g으로 바꾸어 빼면 ${a-c-1} kg ${1000+b-d} g입니다.`),
      wrong(pair(a-c,1000+b-d),'빌려 준 1 kg 안 빼기',`1 kg을 받아내림하고도 줄이지 않아 ${a-c} kg ${1000+b-d} g라고 했습니다. kg끼리는 ${a-1} − ${c} = ${a-c-1}이므로 ${a-c-1} kg ${1000+b-d} g입니다.`))};},
  answer:({kg,g})=>pair(kg,g),check:({a,b,c,d})=>{const n=(a-c)*1000+b-d;return pair(Math.floor(n/1000),n%1000);},
  solution:'1 kg = 1000 g이므로 {a} kg {b} g을 {borrow} kg {grams} g으로 바꿉니다. {grams} − {d} = {g}, {borrow} − {c} = {kg:입니다}.\n따라서 {kg} kg {g} g입니다.',
});
