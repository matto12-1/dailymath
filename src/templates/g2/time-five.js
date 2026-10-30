import {explain,j} from '../solution-process.js?v=9a67f36b25';
import {define,seq,pair,wrong,pairOptions} from './helpers.js?v=9a67f36b25';
import {clearClockHands} from '../../art/life.js?v=9a67f36b25';
export default define({id:'g2.time.five',unit:'g2s2-time',strand:'life',level:1,label:'5분씩 시계 읽기',std:['[2수03-07]']},{
 errorCount:2,answerKind:'pair',parts:[{after:'시'},{after:'분'}],choiceOrder:c=>{const [h,m]=c.split('|').map(Number);return h*60+m;},
 texts:['시계가 가리키는 시각은 몇 시 몇 분일까요?'],
 draw:explain(function(rng){const h=rng.int(1,12),m=rng.int(2,10)*5;
 if(!clearClockHands(h,m))return null;
 const result=h+'시 '+m+'분',base=Math.floor(m/5)*5,numeral=Math.floor(m/5),next=h%12+1,previous=(h+10)%12+1;
 const pool=[
 wrong(pair(h,m+10),'눈금을 여러 칸 더 세기','긴바늘이 간 곳보다 눈금을 더 세었습니다. 바늘 끝의 눈금까지만 세면 '+result+'입니다.'),
 wrong(pair(h,m/5),'바늘 숫자를 분으로 읽기','긴바늘이 가리키는 숫자를 분으로 읽었습니다. 5분씩 뛰어 세어 읽으면 '+result+'입니다.'),
 wrong(pair(next,m),'다음 시로 읽기','짧은바늘이 아직 닿지 않은 '+next+'시를 골랐습니다. 지나온 숫자 '+h+'를 시로 읽으면 '+result+'입니다.'),
 wrong(pair(previous,m),'앞 시로 읽기','짧은바늘이 지난 수보다 하나 앞인 '+previous+'시를 골랐습니다. 짧은바늘이 '+h+'를 지난 것을 읽으면 '+result+'입니다.'),
 wrong(pair(numeral||12,h%12*5),'긴바늘과 짧은바늘 바꾸기','긴바늘로 시를 읽고 짧은바늘로 분을 읽었습니다. 짧은바늘로 시를 읽고 긴바늘로 분을 읽으면 '+result+'입니다.'),
 wrong(pair(h,Math.min(59,m+5)),'눈금 한 칸 더 세기','긴바늘이 간 곳보다 눈금을 한 칸 더 세었습니다. 긴바늘 끝의 눈금까지만 세면 '+result+'입니다.'),
 wrong(pair(h,Math.max(0,m-5)),'눈금 한 칸 빠뜨리기','긴바늘이 간 눈금 한 칸을 빠뜨렸습니다. 눈금을 빠짐없이 세면 '+result+'입니다.'),
 ];
 const chosen=pairOptions(rng,pair(h,m),pool,this.parts,60,5);if(!chosen)return null;
 return {h,m,base,numeral,next,...chosen};
 },v=>['짧은바늘이 '+j(v.h,'과/와')+' '+v.next+' 사이에 있으므로 '+v.h+'시입니다.',
 '긴바늘이 '+j(v.numeral,'을/를')+' 가리킵니다. 5분씩 뛰어 세면 '+Array.from({length:v.numeral},(_,i)=>(i+1)*5).join(', ')+'분입니다.']),
 answer:({h,m})=>pair(h,m),check:({h,m})=>pair(h,Math.floor(m/5)*5+m%5),
 art:({h,m})=>({kind:'clock',h,m}),solution:'{process}\n따라서 {result:입니다}.',
});
