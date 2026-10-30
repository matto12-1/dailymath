import {define,meta,casesSpec,errors,wrong,count} from './helpers.js?v=9a67f36b25';
import {meanCases,data} from './average-helpers.js?v=9a67f36b25';
export default define(meta('average','storymean',4,'word',['04-01'],'꽃 수의 하루 평균'),{
 input:'number',answerUnit:'송이',minMistakes:2,errorCount:3,texts:['상자는 월요일부터 목요일까지 딴 꽃의 수입니다. 하루 평균 몇 송이일까요?','상자는 월요일부터 목요일까지 딴 꽃의 수입니다. 하루 평균은 몇 송이일까요?'],
 // 늘어선 수는 글 대신 수 상자에 둔다(검수 10번).
 numberRow:v=>({items:v.values.map((n,i)=>['월','화','수','목'][i]+' '+n+'송이'),tag:'날마다 딴 꽃'}),
 ...casesSpec(meanCases([4]),v=>v.M,v=>v.values?count(v.values)/4:v.M,(v,rng)=>{const values=data(rng,4,v.M),S=count(values);return {...v,values,S,addition:values.join(' + '),largest:Math.max(...values),smallest:Math.min(...values),shown:values.join(', '),...errors(wrong((Math.max(...values)+Math.min(...values))%2===0?(Math.max(...values)+Math.min(...values))/2:null,'가장 큰 수와 작은 수의 평균만 구하기','가장 큰 수 {largest:과/와} 가장 작은 수 {smallest:을/를} 더해 2로 나누었습니다. 양 끝의 두 날뿐 아니라 네 날의 값을 모두 더해 나누면 {S} ÷ 4 = {answer}송이입니다.'),wrong(S,'나흘 동안의 합만 답하기','나흘 동안 딴 꽃의 합 {S}송이만 구했습니다. 나흘 동안의 합을 날수 4로 나누면 {S} ÷ 4 = {answer}송이입니다.'),wrong(S/3,'날수를 적게 세기','나흘의 합을 3일로 나누었습니다. 기록이 있는 날은 4일이므로 {S} ÷ 4 = {answer}송이입니다.'))};}),
 art:()=>({scene:'flower-harvest'}),solution:'월요일부터 목요일까지 딴 꽃은 모두 {addition} = {S}송이입니다. {S:을/를} 날수 4로 나누면 {S} ÷ 4 = {answer:입니다}.\n따라서 하루 평균 {answer}송이입니다.',
});
