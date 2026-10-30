import {explain} from '../solution-process.js?v=9a67f36b25';
import {define,meta,seq,cycle,closest,errors,wrong} from './helpers.js?v=9a67f36b25';
const values=seq(20,160,10).filter(n=>n!==90);
const optionBanks=new Map();
const anchor=d=>d<45?[0,45]:d<90?[45,90]:d<135?[90,135]:[135,180];
export default define(meta('angles','estimate',2,'shape',['03-24'],'각도 어림하기'),{
  answerUnit:'°',answerSpan:values,range:{min:0,max:180},operandRange:{min:0,max:360},errorCount:3,
  texts:['그림의 각도에 가장 가까운 보기는 몇 도일까요?'],
  draw:explain(function(rng){
    const deg=cycle(rng,'angle-estimate',values),byValue=new Map();
    const add=(value,label,seen,proper)=>{if(value>=10&&value<=170&&Math.abs(value-deg)>=30&&!byValue.has(value))byValue.set(value,wrong(value,label,`${seen} ${proper} 약 ${deg}°입니다.`));};
    add(180-deg,'반대쪽 각으로 어림하기',`반대쪽 각인 ${180-deg}°를 골랐습니다.`,`직각보다 ${deg<90?'좁게':'넓게'} 벌어진 쪽이 묻는 각이므로`);
    const half=Math.round(deg/20)*10,double=Math.min(170,deg*2);
    add(half,'벌어진 정도를 반으로 보기',`벌어진 정도를 반으로 보아 ${half}°를 골랐습니다.`,'두 변이 벌어진 전체를 기준 각과 견주면');
    add(double,'벌어진 정도를 두 배로 보기',`벌어진 정도를 두 배로 보아 ${double}°를 골랐습니다.`,'한 변에서 다른 변까지 한 번 벌어진 크기만 견주면');
    const [low,high]=anchor(deg);
    for(const value of [low,high,90])add(value,'기준 각과 같다고 보기',`그림의 각을 기준 각 ${value}°와 같다고 보았습니다.`,`그림의 각은 ${low}°와 ${high}° 사이이며 ${Math.abs(deg-low)<Math.abs(deg-high)?low:high}°에 더 가까우므로`);
    const es=[...byValue.values()],pool=seq(10,170,10).filter(n=>Math.abs(n-deg)>=30);
    if(!optionBanks.has(deg)){
      const groups=new Map();
      for(let i=0;i<pool.length;i++)for(let j=i+1;j<pool.length;j++)for(let k=j+1;k<pool.length;k++){
        const options=[deg,pool[i],pool[j],pool[k]];
        if(options.filter(n=>n<100).length!==2||es.filter(e=>options.includes(e.value)).length<2)continue;
        const rank=options.filter(n=>n<deg).length;
        if(!groups.has(rank))groups.set(rank,[]);
        groups.get(rank).push(options);
      }
      optionBanks.set(deg,groups);
    }
    const groups=optionBanks.get(deg);
    if(!groups.size)return null;
    const list=groups.get(rng.pick([...groups.keys()])),harder=list.filter(options=>{const mean=options.reduce((s,n)=>s+n,0)/4;return Math.abs(deg-mean)>Math.min(...options.filter(n=>n!==deg).map(n=>Math.abs(n-mean)));});
    const options=rng.pick(harder.length?harder:list);
    return {deg,rotation:rng.int(0,35)*10,options,...errors(...es.filter(e=>options.includes(e.value)))};
  },v=>{
    const [low,high]=anchor(v.deg),near=Math.abs(v.deg-low)<Math.abs(v.deg-high)?low:high;
    const others=v.options.filter(n=>n!==v.deg&&n>low&&n<high);
    return [`그림의 각은 ${low}°보다 크고 ${high}°보다 작으며, ${near}°에 더 가깝습니다.`,...others.map(n=>`${n}°라면 ${near}°와 ${Math.abs(n-near)}° 차이지만 그림은 ${near}°에서 약 ${Math.abs(v.deg-near)}°만큼 벌어진 크기입니다.`)];
  }),
  answer:v=>v.deg,check:v=>Math.round(v.deg/10)*10,isCorrect:(v,c)=>closest(v,c,v.deg),
  art:v=>({kind:'angle',deg:v.deg,rotation:v.rotation,wide:true}),solution:'{process}\n따라서 그림의 각도는 약 {answer}°입니다.',
});
