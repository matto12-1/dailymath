import {define,meta,casesSpec,errors,wrong,count,tableArt} from './helpers.js?v=9a67f36b25';
import {meanCases,data} from './average-helpers.js?v=9a67f36b25';
export default define(meta('average','zero',1,'life',['04-01'],'0인 자료도 평균에 넣기'),{
 input:'number',answerUnit:'쪽',texts:['표를 보고 하루에 읽은 쪽수의 평균을 구하면 몇 쪽일까요?','표에 나타낸 {k}일 동안 읽은 쪽수의 하루 평균은 몇 쪽일까요?'],
 ...casesSpec(meanCases(),v=>v.M,v=>v.values?count(v.values)/v.values.length:v.M,(v,rng)=>{const values=data(rng,v.k,v.M,true),S=count(values);return {...v,values,S,addition:values.join(' + '),zeroDay:['월','화','수','목'][values.indexOf(0)],denominator:v.k-1,...errors(wrong(S/(v.k-1),'0인 자료 빼고 세기','0쪽인 날을 빼고 {S} ÷ {denominator:으로/로} 나누었습니다. 0쪽인 날도 자료의 수에 넣어 나누면 {S} ÷ {k} = {answer}쪽입니다.'),wrong(S,'합만 답하기','기록의 합 {S}만 구하고 자료 수 {k:으로/로} 나누지 않았습니다. 합만 쓰지 않고 0인 자료까지 포함한 {k}일로 나누면 {S} ÷ {k} = {answer}쪽입니다.'))};}),
 art:v=>({...tableArt([['요일',...['월','화','수','목'].slice(0,v.k)],['읽은 쪽수(쪽)',...v.values]]),fontSize:26,columnWidths:[154,...v.values.map(()=>54)]}),solution:'읽은 쪽수의 합은 {addition} = {S}쪽입니다. 0쪽인 {zeroDay}요일도 자료의 수에 넣으므로 {S} ÷ {k} = {answer:입니다}.\n따라서 하루에 읽은 쪽수의 평균은 {answer}쪽입니다.',
});
