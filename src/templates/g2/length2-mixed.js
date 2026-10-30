import {define,pair,wrong,pairOptions} from './helpers.js?v=9a67f36b25';
export default define({id:'g2.length2.mixed',unit:'g2s2-length',strand:'life',level:2,label:'m와 cm로 바꾸기',std:['[2수03-11]']},{
 errorCount:2,answerKind:'pair',parts:[{after:' m'},{after:' cm'}],choiceOrder:c=>{const [m,cm]=c.split('|').map(Number);return m*100+cm;},
 texts:['{cm} cm는 몇 m 몇 cm일까요?'],
 draw(rng){const m=rng.int(2,8),c=rng.int(11,89),cm=100*m+c,result=m+' m '+c+' cm';
 const pool=[
 ...(c+10<100?[wrong(pair(m,c+10),'남은 cm의 십을 한 번 더 세기','남은 cm에서 10 cm를 한 번 더 세었습니다. 남은 길이의 눈금을 정확히 읽으면 '+result+'입니다.')]:[]),
 wrong(pair(m-1,c),'100 cm 묶음 하나 빠뜨리기','100 cm 묶음을 하나 빠뜨렸습니다. 100 cm 묶음 '+m+'개를 모두 세면 '+result+'입니다.'),
 wrong(pair(m+1,c),'100 cm 묶음 하나 더 세기','100 cm 묶음을 하나 더 세었습니다. 묶음을 '+m+'개로 세고 남은 cm를 붙이면 '+result+'입니다.'),
 wrong(pair(m,c%10),'남은 cm의 십의 자리 빠뜨리기','남은 cm에서 일의 자리만 썼습니다. 100 cm씩 묶고 남은 '+c+' cm를 모두 쓰면 '+result+'입니다.'),
 wrong(pair(m,Math.floor(c/10)),'남은 cm의 일의 자리 빠뜨리기','남은 cm에서 끝 숫자를 빠뜨렸습니다. 100 cm 묶음 밖의 길이는 '+c+' cm이므로 '+result+'입니다.'),
 wrong(pair(m,c+1),'cm 눈금 하나 더 세기','남은 cm의 눈금 선을 하나 더 세었습니다. 길이를 나타내는 칸만 세면 '+result+'입니다.'),
 ];const chosen=pairOptions(rng,pair(m,c),pool,this.parts,100);return chosen?{m,c,cm,...chosen}:null;},
 answer:({m,c})=>pair(m,c),check:({cm})=>pair(Math.floor(cm/100),cm%100),
 art:({m,c})=>({kind:'ruler',lengths:[{value:m*100+c,label:(m*100+c)+' cm'}],hundredMarks:true,fontSize:22}),
 solution:'100 cm씩 묶으면 묶음이 {m}개이고 {c} cm가 남습니다.\n따라서 {m} m {c} cm입니다.',
});
