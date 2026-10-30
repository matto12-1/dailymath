import {define,meta,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
import {normalize,propertyMarks} from '../g4/geometry.js?v=9a67f36b25';
const raw=v=>{const x=(v.a*v.a+v.c*v.c-v.b*v.b)/(2*v.a);return [[0,0],[v.a,0],[x,Math.sqrt(v.c*v.c-x*x)]];};
const pictureCache=new Map();
const picturePoints=v=>{
 const key=[v.a,v.b,v.c].join(',');
 if(!pictureCache.has(key)){
  const base=normalize(raw(v));let best;
  // 가로·세로 범위가 비슷하면 90° 돌린 짝도 같은 높이로 크게 놓인다.
  for(let degrees=0;degrees<=45;degrees++){
   const a=-degrees*Math.PI/180,points=base.map(([x,y])=>[5+(x-5)*Math.cos(a)-(y-5)*Math.sin(a),5+(x-5)*Math.sin(a)+(y-5)*Math.cos(a)]),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys),score=Math.abs(w-h);
   if(!best||score<best.score)best={points,score};
  }
  pictureCache.set(key,best.points);
 }
 return pictureCache.get(key);
};
const cases=[];for(const [a,b,c]of [[4,5,6],[5,6,7],[5,7,8],[6,8,9]])for(let k=1;k<=3;k++)for(let target=0;target<3;target++)cases.push({a:a*k,b:b*k,c:c*k,target});
const answer=v=>[v.a,v.b,v.c][v.target],names=['ㄹ','ㅁ','ㅂ'];
export default define(meta('symmetry','correspond',2,'shape',['03-01'],'합동인 도형의 대응변'),{
 input:'number',answerUnit:'cm',texts:['두 삼각형은 합동입니다. 변 {sideName}의 길이는 몇 cm일까요?','두 삼각형은 합동입니다. 변 {sideName}의 길이는 몇 cm일까요?'],
 ...casesSpec(cases,answer,v=>{const ps=raw(v),p=ps[v.target],q=ps[(v.target+1)%3];return Math.round(Math.hypot(p[0]-q[0],p[1]-q[1]));},(v,rng)=>({...v,sideName:names[v.target]+names[(v.target+1)%3],sourceSide:'ㄱㄴㄷ'[v.target]+'ㄱㄴㄷ'[(v.target+1)%3],rotation:rng.pick([90,180,270]),mirror:true,...errors(...[v.a,v.b,v.c].filter((_,i)=>i!==v.target).map(n=>wrong(n,'다른 변과 대응시키기','변 {sideName}의 대응변이 아닌 변의 길이 '+n+' cm를 답했습니다. 변 '+['ㄱㄴ','ㄴㄷ','ㄷㄱ'][[v.a,v.b,v.c].indexOf(n)]+'의 길이가 아니라 대응변 {sourceSide}의 길이가 같으므로 {answer} cm입니다.')))})),
 art:v=>{const points=picturePoints(v),lengths=[v.a,v.b,v.c],second=points.map(([x,y])=>[10-x,y]),marks={angles:[[0],[1],[2]]};return {kind:'polygon',panelTitles:true,panels:[{title:'삼각형 ㄱㄴㄷ',points,labels:{sides:lengths.map(n=>n+' cm'),angles:['ㄱ','ㄴ','ㄷ']},marks,uprightLabels:true,labelsOutside:true,fontSize:24},{title:'삼각형 ㄹㅁㅂ',points:second,rotation:v.rotation,uprightLabels:true,labelsOutside:true,fontSize:24,labels:{sides:lengths.map((n,i)=>i===v.target?'? cm':null),angles:names},marks}]};},
 solution:'같은 표시를 한 각을 보면 점 ㄱ과 점 ㄹ, 점 ㄴ과 점 ㅁ, 점 ㄷ과 점 ㅂ이 대응점입니다. 변 {sideName}의 대응변은 변 {sourceSide}이고, 합동인 두 도형에서 대응변의 길이는 서로 같습니다.\n따라서 변 {sideName}의 길이는 {answer} cm입니다.',
});
