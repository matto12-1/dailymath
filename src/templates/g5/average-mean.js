import {define,meta,casesSpec,errors,wrong,count} from './helpers.js?v=9a67f36b25';
import {meanCases,data} from './average-helpers.js?v=9a67f36b25';
const answer=v=>v.M;
export default define(meta('average','mean',1,'calc',['04-01'],'자료의 평균'),{
 input:'number',minMistakes:2,errorCount:3,texts:['상자에 있는 자료의 평균은 얼마일까요?','상자에 있는 자료의 평균은 몇일까요?'],
 // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
 numberRow:v=>({items:v.values,tag:'자료'}),
 ...casesSpec(meanCases(),answer,v=>v.values?count(v.values)/v.values.length:v.M,(v,rng)=>{const values=data(rng,v.k,v.M),S=count(values);return {...v,values,S,shortCount:v.k-1,largest:Math.max(...values),smallest:Math.min(...values),addition:values.join(' + '),shown:values.join(', '),...errors(wrong(S,'합만 구하기','자료 {k}개의 합 {S}만 구하고 {k:으로/로} 나누지 않았습니다. 모든 자료의 합을 자료 수로 나누면 {S} ÷ {k} = {answer:입니다}.'),wrong((Math.max(...values)+Math.min(...values))%2===0?(Math.max(...values)+Math.min(...values))/2:null,'가장 큰 수와 작은 수의 평균만 구하기','가장 큰 수 {largest:과/와} 가장 작은 수 {smallest:을/를} 더해 2로 나누었습니다. 양 끝의 두 수뿐 아니라 {k}개 모두의 합을 나누면 {S} ÷ {k} = {answer:입니다}.'),wrong(S/(v.k-1),'자료 수를 적게 세기','자료의 수를 {shortCount}개로 잘못 세어 합을 나누었습니다. 자료는 모두 {k}개이므로 {S} ÷ {k} = {answer:입니다}.'))};}),
 solution:'자료의 합은 {addition} = {S:입니다}.\n자료 수는 {k}개이므로 {S} ÷ {k} = {answer:입니다}.\n따라서 자료의 평균은 {answer:입니다}.',
});
