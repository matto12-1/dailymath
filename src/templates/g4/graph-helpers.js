import { j } from '../solution-process.js?v=9a67f36b25';
import {errors,wrong} from './helpers.js?v=9a67f36b25';
export const labelsFor = rng => rng.pick([['사과','배','귤'],['축구','피구','줄넘기'],['봄','여름','겨울']]);
export const barsArt = v=>({kind:'bars',labels:v.labels,values:v.values,step:v.step??1,readable:true,wide:true,title:v.title??`좋아하는 ${v.labels[0]==='사과'?'과일':v.labels[0]==='축구'?'운동':'계절'}`,xLabel:v.labels[0]==='사과'?'과일':v.labels[0]==='축구'?'운동':'계절',yLabel:'사람 수 (명)',labelEvery:v.labelEvery,minCount:v.minCount,...(v.blank?{blankBars:[v.target],maxValue:v.amount}:{}),unitLabel:'명'});
export const lineArt = v=>({kind:'line',values:v.values,labels:v.labels,step:v.step??1,base:v.step>1?v.base:Math.floor(Math.min(...v.values)/5)*5,readable:true,wide:true,title:v.title??'날짜별 기온',xLabel:v.xLabel??'날짜',yLabel:v.yLabel??'기온 (°C)',labelEvery:v.labelEvery??5,unitLabel:v.unit??'°C'});
export function readErrors(values,target,labels,{thing="막대",unit="명"}={}) {
  return errors(...[-1,1].map(d=>{const i=(target+d+values.length)%values.length;return wrong(values[i],'다른 항목 읽기',`${labels[target]} 대신 ${labels[i]}${thing==="막대"?" 막대의 눈금":"의 기온"} ${j(values[i]+unit,"을/를")} 읽었습니다. ${labels[i]} 대신 ${labels[target]}의 ${thing==="막대"?"막대 끝":"점"}에서 세로 눈금을 읽으면 ${values[target]}${unit}입니다.`);}));
}
