import {define,meta,pictureHints} from './helpers.js?v=9a67f36b25';
import {netVars,validNet,netHints} from './net-helpers.js?v=9a67f36b25';
export default define(meta('prisms','net',3,'shape',['03-06'],'각기둥 전개도'),{
 errorCount:3,answerKind:'text',answerValues:['1번','2번','3번','4번'],texts:['단위는 cm입니다. 길이 표시를 보고 {name:이/가} 되는 전개도는 어느 것일까요?','단위는 cm입니다. {name:으로/로} 접을 수 있는 전개도는 어느 것일까요?'],
 draw(rng){const v=netVars(rng,'prism'),sides=v.panels.map(p=>p.stripSide);return Math.max(...sides)<=Math.min(...sides)*2.5?v:null;},answer:v=>v.panels.find(validNet).number+'번',check:v=>v.panels.find(p=>p.side===p.stripSide).number+'번',isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&validNet(p)),guessHints:[pictureHints,netHints],
 art:v=>({kind:'net',type:'prism',panels:v.panels,wide:true}),solution:'{name}의 전개도에는 밑면 2개와 옆면 {n}개가 있고, 접었을 때 맞닿는 변의 길이가 같아야 합니다.\n따라서 {name:으로/로} 접을 수 있는 전개도는 {answer:입니다}.',
});
