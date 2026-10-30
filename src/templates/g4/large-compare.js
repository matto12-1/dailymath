import { explain, comparePlaces } from '../solution-process.js?v=9a67f36b25';
import {define,meta,seq,errors,wrong,spaced} from './helpers.js?v=9a67f36b25';
export default define(meta('large','compare',3,'calc',['01-02'],'여덟 자리 수 비교'),{
  orderAsked:true,choiceBox:true, texts:['가장 {direction} 수는 어느 것일까요?','가장 {direction} 수는 어느 것일까요?'],
  draw: explain(function(rng) {const p=rng.int(2,7),scale=10**p,prefix=p===7?0:rng.int(10**(7-p),10**(8-p)-1)*scale,ds=rng.shuffle(seq(p===7?1:0,9)).slice(0,4),options=ds.map(d=>prefix+d*scale+rng.int(0,scale-1)),large=rng.int(0,1)===1,sorted=[...options].sort((a,b)=>a-b),answer=sorted[large?3:0],opposite=sorted[large?0:3],lower=[...options].sort((a,b)=>(a%scale)-(b%scale)),bad=lower[large?3:0];
    if(options.some(n=>n<10000000||n>99999999)||bad===answer||bad===opposite)return null;
    return {options,large,answer,p,tail:String(bad%scale).padStart(p,'0'),listed:options.map(spaced).join(', '),direction:large?'큰':'작은',bad,opposite,...errors(wrong(bad,'아래 자리 숫자부터 비교하기','뒤의 {p}자리 {tail}만 보고 {bad:을/를} 골랐습니다. 높은 자리부터 차례로 비교하면 가장 {direction} 수는 {answer}입니다.'),wrong(opposite,'반대 크기 고르기','가장 {other} 수 {opposite:을/를} 골랐습니다. 같은 자리끼리 숫자를 비교하면 가장 {direction} 수는 {answer}입니다.')),other:large?'작은':'큰'};}, v => comparePlaces(v.options,v.large,8)),
  answer:v=>v.answer,check:v=>[...v.options].sort((a,b)=>a-b)[v.large?3:0],
  isCorrect:(v,c)=>v.options.includes(c)&&v.options.every(n=>v.large?c>=n:c<=n),
  solution: "{process}\n따라서 가장 {direction} 수는 {answer:입니다}.",
});
