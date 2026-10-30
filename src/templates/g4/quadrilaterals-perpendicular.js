import { j } from '../solution-process.js?v=9a67f36b25';
import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
const names=['수직','평행','수직도 평행도 아니다'];
// 보기에 두 직선 그림표를 붙이고 「수직도 평행도 아닙니다」는 단추에 「둘 다 아닙니다」로 줄인다(검수 7번).
const looks={수직:{icon:'perpendicular',text:'수직'},평행:{icon:'parallel',text:'평행'},'수직도 평행도 아니다':{icon:'neither',text:'둘 다 아니다'}};
const relation=lines=>{const vs=lines.map(([a,b])=>[b[0]-a[0],b[1]-a[1]]),cross=vs[0][0]*vs[1][1]-vs[0][1]*vs[1][0],dot=vs[0][0]*vs[1][0]+vs[0][1]*vs[1][1];return Math.abs(cross)<1e-7?'평행':Math.abs(dot)<1e-7?'수직':'수직도 평행도 아니다';};
export default define(meta('quadrilaterals','perpendicular',1,'shape',['03-03'],'두 직선의 관계'),{
  answerKind:'text',texts:['두 직선은 어떤 관계일까요?','두 직선의 관계로 알맞은 말은 무엇일까요?'],
  draw(rng){const kind=rng.int(0,2),theta=kind===0?90:rng.int(40,75),r=theta*Math.PI/180,lines=kind===1?[[[1,3],[9,3]],[[1,7],[9,7]]]:[[[1,5],[9,5]],[[5-4*Math.cos(r),5+4*Math.sin(r)],[5+4*Math.cos(r),5-4*Math.sin(r)]]],answer=names[kind],options=names;return {lines,options,relationSentence:kind===0?"그림의 두 직선은 직각으로 만납니다.":kind===1?"그림의 두 직선은 늘여도 만나지 않습니다.":"그림의 두 직선은 만나지만 직각으로 만나지 않습니다.",conclusion:kind===0?"서로 수직입니다.":kind===1?"서로 평행합니다.":"수직도 평행도 아닙니다.",rotation:rng.int(0,35)*10,...errors(...names.filter(n=>n!==answer).map(n=>wrong(n,`${looks[n].text} 고르기`,`「${looks[n].text}」${j(looks[n].text,"을/를").slice(looks[n].text.length)} 골랐습니다. ${n==="수직"?"직각으로 만나는지":n==="평행"?"늘여도 만나지 않는지":"직각으로 만나는지, 늘여도 만나지 않는지를"} 보면 그림의 두 직선은 ${kind===0?"직각으로 만나므로 서로 수직입니다":kind===1?"늘여도 만나지 않으므로 서로 평행합니다":"만나지만 직각으로 만나지 않으므로 알맞은 보기는 「둘 다 아니다」입니다"}.`)))};},
  answer:v=>relation(v.lines),check:v=>relation(v.lines),isCorrect:(v,c)=>c===relation(v.lines),choiceLook:c=>looks[c],
  art:v=>({kind:'polygon',lines:v.lines,rotation:v.rotation,wide:true}),solution: "두 직선이 만나서 이루는 각이 직각이면 서로 수직이고 아무리 늘여도 만나지 않으면 서로 평행합니다.\n{relationSentence}\n따라서 두 직선은 {conclusion}",
});
