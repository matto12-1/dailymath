import {define,seq,errors,wrong} from './helpers.js?v=9a67f36b25';
import {cycle} from './arithmetic-helpers.js?v=9a67f36b25';
const cases=[10,100].flatMap(k=>seq(1,9).flatMap(a=>seq(1,9).map(b=>({k,a,b}))));
export default define({id:'g3.pictograph.story',unit:'g3s2-picture-graphs',strand:'word',level:3,label:'책 그림그래프 읽기',std:['[4수04-01]']},{
  input:'number',referenceArt:'pictograph',answerUnit:'권',range:{min:0,max:9999},answerSpan:cases.map(({k,a,b})=>a*k+b*k/10),errorCount:3,back:'g2s2-tables-graphs',
  texts:["그림그래프에서 {className:이/가} 읽은 책은 모두 몇 권일까요?","그림그래프에서 {className:이/가} 읽은 책은 모두 몇 권일까요?"],
  draw(rng){const {k,a,b}=cycle(rng,'pictograph-story',cases),small=k/10,className=rng.pick(['1반','2반','3반','4반']),big=a*k,little=b*small,labels=rng.shuffle([className,...rng.shuffle(['1반','2반','3반','4반'].filter(c=>c!==className)).slice(0,2)]),values=labels.map(c=>c===className?big+little:rng.int(1,8)*k+rng.int(1,8)*small);return {k,a,b,small,big,little,className,labels,values,...errors(
    wrong(a+b,'그림 수만 답하기','큰 그림과 작은 그림이 나타내는 수를 보지 않고 그림 {count}개를 {count}권으로 세었습니다. 큰 그림 {a}개는 {big}권, 작은 그림 {b}개는 {little}권이므로 {big} + {little} = {answer}권입니다.'),
    wrong(big,'작은 그림 빠뜨리기','큰 그림이 나타내는 {big}권만 썼습니다. 빠뜨린 작은 그림 {b}개가 나타내는 {little}권도 더하면 {answer}권입니다.'),
    wrong((a+b)*k,'작은 그림도 큰 그림으로 계산하기',`작은 그림도 하나에 ${k}권으로 세어 ${(a+b)*k}권이라고 했습니다. 작은 그림 하나는 ${k/10}권이므로 ${a*k} + ${b*k/10} = ${a*k+b*k/10}권입니다.`)),count:a+b};},
  answer:({big,little})=>big+little,check:({values,labels,className})=>values[labels.indexOf(className)],
  art:({k,small,labels,values})=>({kind:'pictograph',title:'반별 읽은 책 수',labels,values,unit:k,smallUnit:small,unitLabel:'권',symbol:'책'}),
  solution:'큰 그림 하나는 {k}권, 작은 그림 하나는 {small}권을 나타냅니다.\n큰 그림 {a}개는 {big}권, 작은 그림 {b}개는 {little}권이므로 {big} + {little} = {answer}입니다.\n따라서 {className:이/가} 읽은 책은 모두 {answer}권입니다.',
});
