import {define,meta,dec,errors,wrong} from './helpers.js?v=9a67f36b25';
// 검수 B-31: 「여러 병에 나누어 담았습니다」처럼 긴 말을 장면 그림(주스는 컵에 따르기, 물은 통 사이에 붓기)에 맞춰 줄이고,
// 리본은 「남은 길이」로 묻는다.
const contexts=[
  {object:'통에 든 주스',unit:'L',verb:'컵에 따랐습니다',used:'컵에 따른 양',rest:'남은 양',start:'처음 양',scene:'juice-pouring'},
  {object:'리본',unit:'m',verb:'잘랐습니다',used:'자른 길이',rest:'남은 길이',start:'처음 길이',scene:'craft'},
  {object:'통에 든 물',unit:'L',verb:'다른 통에 부었습니다',used:'부은 양',rest:'남은 양',start:'처음 양',scene:'water-container'},
  {object:'밀가루',unit:'kg',verb:'썼습니다',used:'쓴 양',rest:'남은 양',start:'처음 양',scene:'flour-baking'},
];
export default define(meta('decimaladdsub','story',3,'word',['01-16'],'소수만큼 쓰고 남은 양'),{
  input:'number',answerKind:'decimal',answerUnit:v=>v.unit,back:'g3s1-addsub',
  texts:['{object} {left} {unit} 중에서 {right} {unit}만큼 {verb}. {rest:은/는} 몇 {unit}일까요?','{object} {left} {unit}에서 {right} {unit}만큼 {verb}. {rest:은/는} 몇 {unit}일까요?'],
  draw(rng){const a=rng.int(21,89)*10,b=rng.int(101,a-11);if(b%10===0)return null;return {a,b,...rng.pick(contexts),left:dec(a,2),right:dec(b,2),...errors(wrong(dec(a-b+10,2),'소수 첫째 자리에서 빌려준 1 빼먹기',`소수 둘째 자리로 받아내림한 1을 소수 첫째 자리에서 빼지 않아 ${dec(a-b+10,2)}을 썼습니다. 소수 첫째 자리에서도 1을 줄여 빼면 {left} − {right} = {answer}입니다.`),wrong(String(a-b),'소수점 없이 빼기',`소수점을 지우고 ${a} − ${b} = ${a-b}을 썼습니다. 소수점을 맞추어 같은 자리끼리 빼면 {left} − {right} = {answer}입니다.`))};},
  answer:({a,b})=>dec(a-b,2),check:({left,right})=>dec(Math.round(Number(left)*100)-Math.round(Number(right)*100),2),
  art:v=>({scene:v.scene}),solution:"{start}에서 {used:을/를} 뺍니다. {left} − {right} = {answer}입니다.\n따라서 {rest:은/는} {answer} {unit}입니다.",
});
