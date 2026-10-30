import {explain} from '../solution-process.js?v=9a67f36b25';
import {define,pair,wrong,pairOptions} from './helpers.js?v=9a67f36b25';
export default define({id:'g2.length2.sum',unit:'g2s2-length',strand:'life',level:3,label:'길이 더하기',std:['[2수03-13]']},{
 errorCount:2,answerKind:'pair',parts:[{after:' m'},{after:' cm'}],choiceOrder:c=>{const [m,cm]=c.split('|').map(Number);return m*100+cm;},
 texts:['{a} m {b} cm와 {c} m {d} cm를 더하면 몇 m 몇 cm일까요?'],
 draw:explain(function(rng){const a=rng.int(1,4),c=rng.int(1,5),b=rng.int(1,45),d=rng.int(1,49),m=a+c,cm=b+d,result=m+' m '+cm+' cm';if(m>9)return null;
 const pool=[
 wrong(pair(a,cm),'m 더하기 빠뜨리기','cm끼리만 더하고 '+c+' m를 더하지 않았습니다. m끼리도 더하면 '+result+'입니다.'),
 wrong(pair(m,b),'cm 더하기 빠뜨리기',d+' cm를 더하지 않았습니다. cm끼리도 더하면 '+result+'입니다.'),
 wrong(pair(m+c,cm),'m를 두 번 더하기',c+' m를 두 번 더했습니다. 각 길이의 m를 한 번씩만 더하면 '+result+'입니다.'),
 ...(cm+d<100?[wrong(pair(m,cm+d),'cm를 두 번 더하기',d+' cm를 두 번 더했습니다. 각 길이의 cm를 한 번씩만 더하면 '+result+'입니다.')]:[]),
 ...(b%10+d%10>=10?[wrong(pair(m,cm-10),'cm 받아올림 빠뜨리기','cm끼리 더하며 받아올림한 10을 빠뜨렸습니다. 받아올림까지 더하면 '+result+'입니다.')]:[]),
 ...(cm+10<100?[wrong(pair(m,cm+10),'cm 받아올림 한 번 더 하기','cm를 더할 때 10을 더 넣었습니다. 일의 자리와 십의 자리를 정확히 더하면 '+result+'입니다.')]:[]),
 ];const chosen=pairOptions(rng,pair(m,cm),pool,this.parts,100);return chosen?{a,b,c,d,...chosen}:null;
 },v=>['cm끼리 더하면 '+v.b+' + '+v.d+' = '+(v.b+v.d)+'입니다.','m끼리 더하면 '+v.a+' + '+v.c+' = '+(v.a+v.c)+'입니다.']),
 answer:({a,b,c,d})=>pair(a+c,b+d),check:({a,b,c,d})=>{const cm=(a+c)*100+b+d;return pair(Math.floor(cm/100),cm%100);},
 art:({a,b,c,d})=>({kind:'ruler',lengths:[{value:a*100+b,label:a+' m '+b+' cm'},{value:c*100+d,label:c+' m '+d+' cm'}]}),solution:'{process}\n따라서 길이의 합은 {result:입니다}.',
});
