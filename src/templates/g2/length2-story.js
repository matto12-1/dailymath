import {explain} from '../solution-process.js?v=9a67f36b25';
import {define,pair,wrong,pairOptions} from './helpers.js?v=9a67f36b25';
export default define({id:'g2.length2.story',unit:'g2s2-length',strand:'word',level:3,label:'끈 자르기',std:['[2수03-13]']},{
 errorCount:2,answerKind:'pair',parts:[{after:' m'},{after:' cm'}],choiceOrder:c=>{const [m,cm]=c.split('|').map(Number);return m*100+cm;},
 texts:['{a} m {b} cm인 끈에서 {c} m {d} cm를 잘랐습니다. 남은 끈은 몇 m 몇 cm일까요?'],
 draw:explain(function(rng){const a=rng.int(2,8),c=rng.int(1,a-1),b=rng.int(2,69),d=rng.int(1,b-1),m=a-c,cm=b-d,result=m+' m '+cm+' cm';if(b+d>=100)return null;
 const pool=[
 ...(m-c>=0?[wrong(pair(m-c,cm),'잘라 낸 m를 두 번 빼기',c+' m를 두 번 뺐습니다. 잘라 낸 m를 한 번만 빼면 '+result+'입니다.')]:[]),
 ...(cm-d>=0?[wrong(pair(m,cm-d),'잘라 낸 cm를 두 번 빼기',d+' cm를 두 번 뺐습니다. 잘라 낸 길이를 한 번만 빼면 '+result+'입니다.')]:[]),
 ...(cm>=10?[wrong(pair(m,cm-10),'cm의 십을 한 번 더 빼기','cm끼리 빼며 십을 한 번 더 뺐습니다. 십의 자리와 일의 자리를 맞추어 빼면 '+result+'입니다.')]:[]),
 wrong(pair(m,b),'cm 빼기 빠뜨리기','m끼리만 빼고 '+d+' cm를 빼지 않았습니다. cm끼리도 빼면 '+result+'입니다.'),
 wrong(pair(a,cm),'m 빼기 빠뜨리기','cm끼리만 빼고 '+c+' m를 빼지 않았습니다. m끼리도 빼면 '+result+'입니다.'),
 wrong(pair(a+c,b+d),'빼야 할 길이 더하기','잘라 낸 길이를 더했습니다. 원래 길이에서 잘라 낸 길이를 빼면 '+result+'입니다.'),
 wrong(pair(m,b+d),'cm를 더하기','cm끼리 빼야 하는데 더했습니다. cm도 '+b+'에서 '+d+'를 빼면 '+result+'입니다.'),
 wrong(pair(m,cm-1),'cm를 하나 더 빼기','거꾸로 세며 cm를 하나 더 뺐습니다. '+d+' cm만 빼면 '+result+'입니다.'),
 ];const chosen=pairOptions(rng,pair(m,cm),pool,this.parts,100);return chosen?{a,b,c,d,...chosen}:null;
 },v=>[v.a+' m '+v.b+' cm에서 '+v.c+' m '+v.d+' cm를 뺍니다.','cm끼리 빼면 '+v.b+' − '+v.d+' = '+(v.b-v.d)+'입니다.','m끼리 빼면 '+v.a+' − '+v.c+' = '+(v.a-v.c)+'입니다.']),
 answer:({a,b,c,d})=>pair(a-c,b-d),check:({a,b,c,d})=>{const cm=a*100+b-c*100-d;return pair(Math.floor(cm/100),cm%100);},art:()=>({scene:'cord-cutting'}),solution:'{process}\n따라서 남은 끈은 {result:입니다}.',
});
