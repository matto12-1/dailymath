import {define,meta,cart,seq,wrong,errors,pair,fill,gcd} from './helpers.js?v=9a67f36b25';
import {cycle} from '../g3/arithmetic-helpers.js?v=9a67f36b25';
const orders=[[0,1],[1,0],[0,2],[2,0],[1,2],[2,1]],colors=['빨간','파란','노란'];
// 두 항만 먼저 고른다. 물음에 쓰지 않는 셋째 수와 색의 차례는 문제를 만들 때 정한다.
const pairs=cart({first:seq(2,20),second:seq(2,20)}).filter(v=>v.first!==v.second&&gcd(v.first,v.second)===1),key={};
export default define(meta('ratio','ratio',1,'calc',['02-02'],'두 양의 비'),{
 input:'number',answerKind:'pair',parts:[{after:':'},{}],minMistakes:2,errorCount:2,
 answerValues:pairs.map(v=>pair(v.first,v.second)),texts:['{data}{question}'],
 draw(rng){
  const {first,second}=pairs[cycle(rng,key,pairs.map((_,i)=>i))],order=rng.int(0,5),[i,j]=orders[order],ns=[];
  ns[i]=first;ns[j]=second;ns[3-i-j]=rng.pick(seq(2,20).filter(n=>n!==first&&n!==second));
  const object=rng.pick(['공','구슬']),ratioText=first+' : '+second,baseName=colors[j]+' '+object;
  return {total:ns.reduce((a,b)=>a+b,0),a:ns[0],b:ns[1],c:ns[2],order,ratioText,baseName,base:second,
   data:colors.map((s,k)=>'〔'+s+' '+object+' '+ns[k]+'개〕').join(''),
   question:baseName+' 수에 대한 '+colors[i]+' '+object+' 수의 비는 얼마일까요?',
   explanation:fill('비교하는 양은 {first} 수 {x}, 기준량은 {second} 수 {y}입니다. 비는 비교하는 양 : 기준량으로 나타냅니다.',{first:colors[i]+' '+object,second:baseName,x:first,y:second}),
   ...errors(
    wrong(pair(second,first),'비의 순서 바꾸기','비교하는 양과 기준량을 바꾸어 {base} : '+first+'로 썼습니다. 기준량 {baseName} 수 {base:을/를} 뒤에 놓으면 {ratioText:입니다}.'),
    wrong(pair(first,ns.reduce((a,b)=>a+b,0)),'전체를 뒤 항으로 쓰기','기준량 대신 세 색의 수를 합한 {total:을/를} 비의 뒤에 썼습니다. 전체가 아니라 주어진 기준량 {base:을/를} 뒤에 쓰면 {ratioText:입니다}.'))};
 },
 answer:v=>{const ns=[v.a,v.b,v.c],[i,j]=orders[v.order];return pair(ns[i],ns[j]);},
 check:v=>orders[v.order].map(i=>[v.a,v.b,v.c][i]).join('|'),
 solution:'{explanation}\n따라서 비는 {ratioText:입니다}.',
});
