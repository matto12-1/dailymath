import {define,meta,errors,wrong} from './helpers.js?v=9a67f36b25';
export default define(meta('cuboids','name',1,'shape',['03-03'],'정육면체 그림 고르기'),{
 answerKind:'text',texts:['단위는 cm입니다. 정육면체를 고르시오.','단위는 cm입니다. 모든 면이 정사각형인 도형을 고르시오.'],
 // 단추 그림의 길이에는 cm를 빼고 문제 글에 한 번 쓴다. cm까지 달면 폰에서 그림 넷이 두 칸에 안 들고 한 칸씩 길게 늘어섰다(검수 14번).
 draw(rng){const a=rng.int(3,9),other=rng.int(1,2),dims=[[a,a,a],[a,a,a+other],[a+other,a,a],[a,a+other,a+other+1]],panels=rng.shuffle(dims.map(edgeLengths=>({type:'cuboid',edgeLengths,lengthUnit:''}))).map((p,i)=>({...p,number:i+1})),bad=panels.filter(p=>new Set(p.edgeLengths).size>1);return {panels,options:panels.map(p=>p.number+'번'),...errors(...bad.slice(0,2).map(p=>wrong(p.number+'번',new Set(p.edgeLengths).size===2?'일부 모서리만 같으면 정육면체로 보기':'직육면체와 정육면체 구별하지 않기','모서리의 길이가 '+p.edgeLengths.join(' cm, ')+' cm인 '+p.number+'번 도형을 골랐습니다. '+p.number+'번은 '+p.edgeLengths[0]+' cm인 모서리와 '+p.edgeLengths.find(n=>n!==p.edgeLengths[0])+' cm인 모서리가 다르지만, 모든 모서리 길이가 같은 정육면체는 {answer:입니다}.')))};},
 answer:v=>v.panels.find(p=>new Set(p.edgeLengths).size===1).number+'번',check:v=>v.panels.find(p=>p.edgeLengths.every(n=>n===p.edgeLengths[0])).number+'번',
 isCorrect:(v,c)=>v.panels.some(p=>p.number+'번'===c&&new Set(p.edgeLengths).size===1),
 art:v=>({kind:'solid',panels:v.panels,largePanels:'full',wide:true}),solution:'정사각형 6개로 둘러싸인 도형을 정육면체라고 합니다. 정육면체는 모서리의 길이가 모두 같습니다.\n따라서 정육면체는 {answer:입니다}.',
});
