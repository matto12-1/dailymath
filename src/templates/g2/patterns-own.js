import { explain, j, ordinal } from '../solution-process.js?v=9a67f36b25';
import { define, shapes, names, colors, item, wrong, errors } from './helpers.js?v=9a67f36b25';

export default define({"id":"g2.patterns.own","unit":"g2s2-patterns","strand":"shape","level":2,"label":"빈 곳의 무늬","std":["[2수02-01]"]}, {

  answerKind:'text',texts:['빈 곳에 들어갈 모양은 어느 것일까요?'],
  draw: explain(function(rng) {const ss=rng.shuffle(shapes),cs=rng.shuffle(colors),cycle=ss.map((shape,i)=>item(shape,cs[i]));
    const end=rng.int(5,7),blank=rng.int(1,end-1),wanted=cycle[blank%3],prev=cycle[(blank+2)%3];
    const word=(x)=>x.color+' '+names[x.shape],w1={...wanted,shape:prev.shape};
    const extra=item(wanted.shape,prev.color);
    const items=Array.from({length:end+1},(_,i)=>i===blank?item('blank'):cycle[i%3]);
    const panels=rng.shuffle([wanted,w1,prev,extra]).map((p,i)=>({number:i+1,items:[p]})),number=x=>panels.find(p=>word(p.items[0])===word(x)).number+'번';
    return {items,wanted,cycle,blank,panels,wantedLabel:word(wanted),options:panels.map(p=>p.number+'번'),
      ...errors(wrong(number(w1),'색깔만 맞추기',`${word(w1)}을 골라 색깔만 맞추었습니다. 세 모양의 차례에 맞는 ${word(wanted)}은 ${number(wanted)}입니다.`),
        wrong(number(prev),'바로 앞 모양 복사하기',`빈칸 바로 앞의 ${word(prev)}을 그대로 골랐습니다. 같은 차례의 모양을 찾으면 ${word(wanted)}인 ${number(wanted)}입니다.`),
        wrong(number(extra),'모양만 맞추기',`${word(extra)}을 골라 모양만 맞추었습니다. 색깔까지 규칙에 맞는 것은 ${word(wanted)}인 ${number(wanted)}입니다.`))};}, v => ['빈칸 앞뒤를 함께 보면 ' + j(v.cycle.map(p=>p.color+' '+({triangle:'삼각형',square:'사각형',circle:'원'})[p.shape]).join(', '),'이/가') + ' 차례로 되풀이됩니다.', '빈칸은 세 개씩 묶었을 때 '+ordinal(v.blank%3+1)+' 자리입니다.']),
  errorCount:3,
  answer:v=>v.panels.find(p=>p.items[0].shape===v.wanted.shape&&p.items[0].color===v.wanted.color).number+'번',
  check:v=>{const x=v.cycle[v.blank%3];return v.panels.find(p=>p.items[0].shape===x.shape&&p.items[0].color===x.color).number+'번';},
  isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&p.items[0].shape===v.wanted.shape&&p.items[0].color===v.wanted.color),
  back:'g1s2-patterns',art:({items,panels})=>({kind:'objects',expand:true,items,panels}),
  solution: "{process}\n따라서 알맞은 그림은 {answer}입니다.",
});
