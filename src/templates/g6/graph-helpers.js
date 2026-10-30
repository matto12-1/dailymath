import {seq,cart} from './helpers.js?v=9a67f36b25';
export const surveys=[
 {title:'좋아하는 과일별 학생 수',header:'좋아하는 과일',labels:['사과','배','귤']},
 {title:'좋아하는 운동별 학생 수',header:'좋아하는 운동',labels:['축구','수영','농구']},
 {title:'좋아하는 놀이별 학생 수',header:'좋아하는 놀이',labels:['숨바꼭질','줄넘기','술래잡기']},
 {title:'좋아하는 동물별 학생 수',header:'좋아하는 동물',labels:['고양이','강아지','토끼']},
 {title:'등교 방법별 학생 수',header:'등교 방법',labels:['걷기','버스','자동차']},
];
export const shares=step=>cart({p:seq(1,Math.floor(80/step)),q:seq(1,Math.floor(80/step))}).map(v=>({p:v.p*step,q:v.q*step})).filter(v=>v.p+v.q<100&&v.p!==v.q);
export const graphDecorate=(v,rng)=>{const survey=rng.pick(surveys),labels=survey.labels,target=rng.int(0,2),values=[v.q,100-v.p-v.q];values.splice(target,0,v.p);return {...survey,target,item:labels[target],values,ticks:v.p/5};};
