import {define,meta,seq,casesSpec,errors,wrong} from './helpers.js?v=9a67f36b25';
import {lineArt} from './graph-helpers.js?v=9a67f36b25';
const cases=[10,20,30,40].flatMap(base=>[2,5].flatMap(step=>seq(2,9).map(n=>({base,step,n}))));
export default define(meta('linegraphs','scale',2,'life',['04-02'],'생략한 눈금 읽기'),{
  input:'number',errorCount:3,answerUnit:'cm',back:'g3s2-picture-graphs',
  texts:['꺾은선그래프에서 {asked}에 잰 해바라기의 키는 몇 cm일까요?'],
  ...casesSpec(cases,({base,step,n})=>base+step*n,({base,step,n})=>Array(n).fill(step).reduce((s,x)=>s+x,base),(v,rng)=>{const labels=['1주','2주','3주','4주'],values=[v.n,...rng.shuffle(seq(1,10).filter(n=>n!==v.n)).slice(0,3)].sort((a,b)=>a-b).map(n=>v.base+n*v.step),target=values.indexOf(v.base+v.step*v.n);return {...v,heightAbove:v.n*v.step,wrongSmall:v.base+v.n,values,labels,target,labelEvery:5,unit:'cm',title:'해바라기의 키',xLabel:'시간',yLabel:'키 (cm)',asked:labels[target],...errors(wrong(v.base+v.n,'한 칸을 1 cm로 보기','한 칸을 1 cm로 보고 {base} cm에 {n}만 더해 {wrongSmall} cm를 썼습니다. 한 칸은 {step} cm이므로 {n}칸은 {heightAbove} cm이고 {base} + {heightAbove} = {answer} cm입니다.'),wrong(v.n*v.step,'시작 눈금 빠뜨리기','물결선 위 첫 눈금 {base} cm를 빠뜨리고 올라간 {heightAbove} cm만 썼습니다. 첫 눈금 {base} cm에 {heightAbove} cm를 더하면 {answer} cm입니다.'),wrong(v.base+(v.n+1)*v.step,'위 눈금 읽기',`점보다 한 칸 위인 ${v.base+(v.n+1)*v.step} cm를 읽었습니다. 점이 있는 눈금은 그보다 ${v.step} cm 작은 ${v.base+v.n*v.step} cm입니다.`))};}),
  art:lineArt,solution: "물결선 위의 첫 눈금은 {base} cm이고 세로 눈금 한 칸은 {step} cm입니다.\n{asked}의 점은 첫 눈금에서 {n}칸 위이므로 {n} × {step} = {heightAbove} cm 더 높습니다.\n{base} + {heightAbove} = {answer}입니다.\n따라서 {asked}에 잰 해바라기의 키는 {answer} cm입니다.",
});
