import {define,meta,seq,wrong,errors,names} from './helpers.js?v=9a67f36b25';
import {cycle} from '../g3/arithmetic-helpers.js?v=9a67f36b25';
const key={};
const visibleSides=n=>{const phase=({3:90,4:30,5:50,6:15})[n]??20;return seq(0,n-1).filter(i=>(Math.sin((i*360/n+phase)*Math.PI/180)+Math.sin(((i+1)*360/n+phase)*Math.PI/180))/2>0).length;};
export default define(meta('prisms','name',1,'shape',['03-05'],'각기둥 이름'),{
 answerKind:'text',answerValues:seq(3,8).map(n=>names[n]+'기둥'),texts:['{question}'],
 draw(rng){const n=cycle(rng,key,seq(3,8)),visible=n<=6?visibleSides(n):0,near=n===8?7:n+1,first=visible>=3&&visible!==n?visible:near,second=n!==4&&first!==4?4:(n+2<=8&&n+2!==first?n+2:3);return {n,baseShape:names[n]+'형',orientation:0,options:[n,first,second,...rng.shuffle(seq(3,8).filter(i=>![n,first,second].includes(i))).slice(0,1)].map(i=>names[i]+'기둥'),question:n<=6?rng.pick(['그림의 각기둥 이름은 무엇일까요?','밑면을 보면 이 각기둥의 이름은 무엇일까요?']):'밑면의 변이 '+n+'개인 각기둥의 이름은 무엇일까요?',...errors(wrong(names[first]+'기둥',visible>=3?'보이는 옆면만 세기':'밑면의 변 수 혼동',visible>=3?'보이는 옆면 '+visible+'개만 세어 '+names[first]+'기둥을 골랐습니다. 밑면의 변 {n}개를 모두 세면 {answer:입니다}.':''+names[first]+'기둥을 골랐습니다. 각기둥의 이름은 밑면의 모양에 따라 정하며 밑면은 '+names[n]+'형이므로 '+names[n]+'기둥입니다.'),wrong(names[second]+'기둥',second===4?'옆면 모양으로 이름 짓기':'밑면과 옆면 수 혼동',second===4?'옆면이 사각형이라 사각기둥을 골랐습니다. 밑면이 '+names[n]+'형이므로 '+names[n]+'기둥입니다.':''+names[second]+'기둥을 골랐습니다. 전체 면 수 대신 밑면의 변 '+n+'개로 이름을 정하면 '+names[n]+'기둥입니다.'))};},
 answer:v=>names[v.n]+'기둥',check:v=>['삼각','사각','오각','육각','칠각','팔각'][v.n-3]+'기둥',isCorrect:(v,c)=>c===names[v.n]+'기둥',
 guessHints:[({choices})=>({'name-length':choices.map(s=>s.length),'name-order':choices.map(s=>seq(3,8).map(n=>names[n]+'기둥').indexOf(s))})],
 art:v=>v.n<=6?{kind:'solid',type:'prism',n:v.n,orientation:0,wide:true}:null,solution:'각기둥의 이름은 밑면의 모양에 따라 정합니다. 밑면이 {baseShape:입니다}.\n따라서 이 각기둥은 {answer:입니다}.',
});
