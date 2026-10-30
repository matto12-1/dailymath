import { explain, j } from '../solution-process.js?v=9a67f36b25';
import { define, wrong, errors } from './helpers.js?v=9a67f36b25';

const entries=[
  ['달걀','g',[50,60,70]],['사과','g',[150,200,250]],['감자','g',[100,150,200]],['귤','g',[80,100,120]],['공책','g',[150,200,250]],['지우개','g',[10,20,30]],['연필','g',[5,10,15]],['딸기','g',[10,20,30]],['바나나','g',[100,150,200]],
  ['고양이','kg',[3,4,5]],['강아지','kg',[5,8,10]],['수박','kg',[4,5,6]],['호박','kg',[2,3,4]],['쌀 포대','kg',[10,20,30]],['볼링공','kg',[4,5,6]],['책가방','kg',[2,3,4]],
  ['코끼리','t',[3,4,5]],['자동차','t',[1,2]],['트럭','t',[3,4,5]],['버스','t',[8,10,12]],['고래','t',[20,30,40]],
];
const units=['g','kg','t'];
const unitNames={g:'그램',kg:'킬로그램',t:'톤'};
export default define({id:'g3.weightcup.estimate',unit:'g3s2-weight-capacity',strand:'life',level:2,label:'무게 단위 어림',std:['[4수03-20]','[4수03-22]']},{
  answerKind:'text',errorCount:2,texts:['{object}의 무게는 약 {n} ( )입니다. ( ) 안에 알맞은 단위는 무엇일까요?'],
  draw: explain(function(rng) {const unit=rng.pick(units),entry=rng.pick(entries.filter(x=>x[1]===unit)),[object,,ns]=entry,n=rng.pick(ns),others=units.filter(x=>x!==unit);return {object,unit,unitName:unitNames[unit],n,options:units,first:others[0],second:others[1],
    ...errors(wrong(others[0],'알맞지 않은 무게 단위 고르기',j(unitNames[others[0]],'을/를')+' 골랐지만 '+n+' '+others[0]+'은 '+object+'의 무게로 알맞지 않습니다. '+j(object,'은/는')+' '+(unit==='g'?'한 손으로 가볍게 들 만하므로':unit==='kg'?'두 팔로 들거나 안을 만하므로':'사람이 들기 어려울 만큼 무거우므로')+' 약 '+n+' '+unit+'('+unitNames[unit]+')입니다.'),wrong(others[1],'무게 단위 크기 혼동하기',j(unitNames[others[1]],'을/를')+' 골랐지만 '+n+' '+others[1]+'은 '+object+'의 무게로 알맞지 않습니다. '+(unit==='g'?'작고 가벼운 물건의 무게는 g으로':unit==='kg'?'사람이 들 만한 무게는 kg으로':'아주 무거운 물건의 무게는 t으로')+' 나타내므로 '+object+'의 무게는 약 '+n+' '+unit+'('+unitNames[unit]+')입니다.'))};}, v => v.unit==='g' ? ['약 '+v.n+' kg은 '+v.object+'보다 훨씬 무겁습니다.', j(v.object,'은/는')+' 한 손으로 가볍게 드는 물건이므로 g으로 나타냅니다.'] : v.unit==='kg' ? ['약 '+v.n+' g은 '+v.object+'의 무게로 너무 가볍습니다.',j(v.object,'은/는')+' 두 팔로 들거나 안을 만한 무게이므로 kg으로 나타냅니다.'] : ['약 '+v.n+' kg은 '+v.object+'의 무게로 너무 가볍습니다.',j(v.object,'은/는')+' 사람이 들기 어려울 만큼 무거우므로 t으로 나타냅니다.']),
  answer:({unit})=>unit,check:({object})=>entries.find(x=>x[0]===object)[1],isCorrect:(v,c)=>c===entries.find(x=>x[0]===v.object)[1],
  choiceOrder:units,
  choiceLook:c=>({icon:'weight-unit-'+c,text:{g:'그램',kg:'킬로그램',t:'톤'}[c]}),
  art:({object})=>({kind:'scale',object,blankUnit:true}),solution: "{process}\n따라서 알맞은 단위는 {unitName}({answer})입니다.",
});
