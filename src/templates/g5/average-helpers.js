import {errors,wrong,fill} from './helpers.js?v=9a67f36b25';
export function data(rng,k,M,zero=false){
 const values=zero?[0]:[],lo=Math.ceil(M*.5),hi=Math.floor(M*1.5);let left=k*M;
 for(let i=values.length;i<k;i++){const remain=k-i-1,n=rng.int(Math.max(lo,left-remain*hi),Math.min(hi,left-remain*lo));values.push(n);left-=n;}
 return rng.shuffle(values);
}
export const meanCases=(ks=[3,4])=>ks.flatMap(k=>Array.from({length:59},(_,i)=>i+2).filter(M=>k*M%(k-1)===0).map(M=>({k,M})));
export const likelihood=['불가능하다','빨간 공이 아닐 것 같다','반반이다','빨간 공일 것 같다','확실하다'];
// 보기에 가능성 눈금 그림표(불가능 0 ~ 확실 1)를 붙이고, 묻는 글에 있는 「빨간 공」은 빼 교과서 눈금처럼 「~일 것 같다」로 쓴다(검수 7번).
const shortWords=['불가능하다','~아닐 것 같다','반반이다','~일 것 같다','확실하다'];
export const likelihoodLook=c=>{const i=likelihood.indexOf(c);return {icon:`chance-${i}`,text:shortWords[i]};};
export const likelihoodIndex=(red,blue)=>red===0?0:blue===0?4:red===blue?2:red<blue?1:3;
export function likelihoodErrors(red,blue,indices,numeric=false,record=false){
 const unit=record?'번':'개',index=likelihoodIndex(red,blue),chance=red===0?'0':blue===0?'1':'1/2';
 const result=numeric?'빨간 공이 나올 가능성은 '+chance+'입니다.':(record?'기록으로 예상한 가능성은 ':'빨간 공이 나올 가능성은 ')+'「'+likelihood[index]+'」입니다.';
 // 고른 실수와 실제 개수의 관계를 함께 설명한다. 없는 색을 더 많다고 말하지 않는다.
 const reasons=[
  ['', '빨간 공이 적게 있는 경우가 아니라 하나도 없으므로 ', '두 색이 반씩 있는 것이 아니라 파란 공만 '+blue+'개 있으므로 ', '빨간 공 대신 파란 공만 '+blue+'개 있으므로 ', '반드시 나오는 색은 파란색이고 빨간 공은 없으므로 '],
  ['빨간 공도 '+red+unit+' 있지만 파란 공 '+blue+unit+'보다 적으므로 ', '', '빨간 공은 '+red+unit+', 파란 공은 '+blue+unit+'이며 빨간 공이 더 적으므로 ', '더 많은 쪽은 파란 공 '+blue+unit+'이므로 ', '파란 공은 '+blue+unit+'이고 더 많아 반드시 빨간 공이 나오지는 않으므로 '],
  ['빨간 공도 '+red+unit+' 있고 파란 공과 수가 같으므로 ', '빨간 공이 더 적은 것이 아니라 두 색이 '+red+unit+'씩 같으므로 ', '', '빨간 공이 더 많은 것이 아니라 두 색이 '+red+unit+'씩 같으므로 ', '파란 공도 빨간 공과 같은 '+blue+unit+'이므로 '],
  ['빨간 공은 '+red+unit+', 파란 공은 '+blue+unit+'이며 빨간 공이 더 많으므로 ', '더 적은 쪽은 파란 공 '+blue+unit+'이므로 ', '빨간 공은 '+red+unit+'이고 더 많고 두 색의 수가 다르므로 ', '', '파란 공도 '+blue+unit+' 있지만 빨간 공은 '+red+unit+'이고 더 많으므로 '],
  ['주머니에 든 '+red+'개가 모두 빨간 공이므로 ', '빨간 공이 적은 것이 아니라 빨간 공만 '+red+'개 있으므로 ', '두 색이 반씩 있는 것이 아니라 빨간 공만 있으므로 ', '파란 공이 하나도 없어 어떤 공을 꺼내도 빨간 공이므로 ', '']
 ];
 return errors(...indices.map(i=>{
  const value=numeric?['0',null,'1/2',null,'1'][i]:likelihood[i];
  const mistake=fill(numeric?'가능성을 {value:으로/로} 보았습니다. ':'가능성을 「{value}」로 보았습니다. ',{value});
  return wrong(value,'가능성 '+i+'로 판단하기',mistake+reasons[index][i]+result);
 }));
}
