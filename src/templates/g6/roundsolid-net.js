import {define,meta,pictureHints,dec} from './helpers.js?v=9a67f36b25';
import {netVars,validNet,netHints} from './net-helpers.js?v=9a67f36b25';
export default define(meta('roundsolid','net',3,'shape',['03-08'],'원기둥 전개도'),{
 errorCount:3,answerKind:'text',answerValues:['1번','2번','3번','4번'],texts:['원주율은 3.14입니다. 밑면의 지름이 {diameter} cm인 원기둥의 전개도는 어느 것일까요?','원주율은 3.14입니다. 밑면의 지름이 {diameter} cm인 원기둥의 전개도는 어느 것일까요?'],
 // 보기 넷은 지름·높이가 같아 지름은 글에 한 번 쓰고 그림에는 옆면 가로만 쓴다. 길이 셋을 다 쓰면 폰 한 화면에 넷이 안 들었다(검수 13·14번).
 draw:rng=>{const v=netVars(rng,'cylinder');return {...v,diameter:v.panels[0].diameter,circumference:dec(v.panels[0].diameter*314,2)};},answer:v=>v.panels.find(validNet).number+'번',check:v=>v.panels.find(p=>Math.round(p.diameter*314)===Math.round(p.rectWidth*100)).number+'번',isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&validNet(p)),guessHints:[pictureHints,netHints],
 art:v=>({kind:'net',type:'cylinder',panels:v.panels,wide:true,wrapRows:true,widthOnly:true}),solution:'원기둥의 전개도에서 옆면의 가로는 밑면의 원주와 같습니다. 밑면의 원주는 {diameter} × 3.14 = {circumference} cm입니다.\n따라서 답은 옆면의 가로가 {circumference} cm인 {answer:입니다}.',
});
